import React, { FC, InputHTMLAttributes, MutableRefObject, forwardRef, useRef, useMemo, useState, useEffect, useContext, useReducer, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useUnmount, useGetSet, useUnmountPromise, useIsomorphicLayoutEffect, useAsync } from 'react-use';
import { useId } from '@react-aria/utils';
import { useFocusManager, useFocusRing, FocusScope } from '@react-aria/focus';
import { useDateInput } from 'react-nice-dates';
import type {
  CommonProps,
  CalendarProps,
  DatePickerCalendarProps,
  DatePickerChildrenProps,
  DateChangeCallBack,
  Modifiers,
  ModifiersClassNames,
} from 'react-nice-dates';
import type { Locale } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import {
  lightFormat,
  format as formatDate,
  set as setDate,
  getDate,
  isToday,
  isSameDay,
  isSameMonth,
  isBefore,
  isAfter,
  startOfDay,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  eachDayOfInterval,
  differenceInDays,
  differenceInCalendarWeeks,
  differenceInCalendarMonths,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  getYear,
} from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import enGB from 'date-fns/locale/en-GB';
import { isElement as isHtmlElement, isFunction, isNumber, isDate, isNull, isNil, assign, debounce, throttle, noop, map } from 'lodash';
import cx from 'classnames';

import { useDetectTouch } from 'shared/hooks';
import Popper, { IPopperProps } from 'shared/ui/popper';
import MaskInput from 'shared/ui/mask.input';
import './date.picker.css';
import { convertRemToPixels } from '../../lib/element';

export type { InputProps } from 'react-nice-dates';

export type DatePickerPlacement =
  | 'auto'
  | 'auto-start'
  | 'auto-end'
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'left'
  | 'left-start'
  | 'left-end';

export interface IDatePickerProps extends Pick<IPopperProps, 'container'> {
  date?: Date | number;
  minimumDate?: Date | number;
  maximumDate?: Date | number;
  format?: string;
  weekdayFormat?: string;
  modifiers?: Modifiers;
  modifiersClassNames?: ModifiersClassNames;
  locale?: Locale;
  touchDragEnabled?: boolean;
  onDateChange?: DateChangeCallBack;
  placement?: DatePickerPlacement;
}
export const DefaultPlacement: DatePickerPlacement = 'bottom-start';
export const DefaultOffset: [number, number] = [0, convertRemToPixels(0.5)];

export interface ICalendarProps extends CalendarProps {
  date?: Date;
}

export interface IDatePickerInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'min' | 'max' | 'onChange'> {
  value?: Date | number | string | undefined;
  min?: Date | undefined;
  max?: Date | undefined;
  placeholder?: string;
  format?: string;
  locale?: Locale;
  onChange?: DateChangeCallBack;
}

// const defaultLocaleId = 'en';
// const locales: Record<string, Locale> = {};

// const useDateFnsLocale = (localeId: string = defaultLocaleId) => {
//   const mounted = useUnmountPromise();
//   const [locale, setLocale] = useState<Locale>({});

//   useEffect(() => {
//     (async () => {
//       let data: Locale = {};
//       try {
//         if (!includes(['en', 'de', 'ru'], localeId)) throw new Error();
//         if (!isNil(locales[localeId])) data = locales[localeId];
//         if (isNil(locales[localeId])) {
//           const module = await mounted(Promise.resolve(import(`date-fns/locale/${localeId}`)));
//           data = { ...module.default } as Locale;
//           locales[localeId] = data;
//         }
//       } catch {
//         console.error(`Not found date-fns "${localeId}" locale`);
//       }
//       setLocale(data);
//     })();
//   }, [localeId]);

//   return locale;
// };

// const Control: FC<PropsWithFunctionChild<any, DatePickerChildrenProps>> = () => {
//   return null;
// };

// #region utils
function setRef(ref, value) {
  if (typeof ref === 'function') ref(value);
  else if (ref) assign(ref, { current: value });
}

const isSelectable = (date, { minimumDate, maximumDate }) => !isBefore(date, startOfDay(minimumDate)) && !isAfter(date, maximumDate);

const setTime = (date, dateWithTime) =>
  setDate(date, {
    hours: dateWithTime.getHours(),
    minutes: dateWithTime.getMinutes(),
    seconds: dateWithTime.getSeconds(),
  });

const isRangeLengthValid = ({ startDate, endDate }, { minimumLength, maximumLength }) =>
  differenceInDays(startOfDay(endDate), startOfDay(startDate)) >= minimumLength &&
  (!maximumLength || differenceInDays(startOfDay(endDate), startOfDay(startDate)) <= maximumLength);

const rowsBetweenDates = (startDate, endDate, locale) => differenceInCalendarWeeks(endDate, startDate, { locale }) + 1;

const rowsInMonth = (date, locale) => rowsBetweenDates(startOfMonth(date), endOfMonth(date), locale);

const getStartDate = (date, locale) => startOfWeek(startOfMonth(date), { locale });

const getEndDate = (date, locale) => endOfWeek(addWeeks(endOfMonth(date), 6 - rowsInMonth(date, locale)), { locale });

const mergeModifiers = (baseModifiers, newModifiers) => {
  if (!newModifiers) {
    return baseModifiers;
  }

  const modifiers = { ...baseModifiers };
  Object.keys(newModifiers).forEach((name) => {
    modifiers[name] = baseModifiers[name] ? (date) => baseModifiers[name](date) || newModifiers[name](date) : newModifiers[name];
  });
  return modifiers;
};

const computeModifiers = (modifiers, date) => {
  const computedModifiers = {};
  Object.keys(modifiers).forEach((key) => {
    computedModifiers[key] = modifiers[key](date);
  });
  return computedModifiers;
};
// #endregion

const START_DATE = 'startDate';
const END_DATE = 'endDate';
const ORIGIN_BOTTOM = 'bottom';
const ORIGIN_TOP = 'top';

const createInitialState = (currentMonth, locale) => {
  return {
    focusDay: null,
    startDate: getStartDate(currentMonth, locale),
    endDate: getEndDate(currentMonth, locale),
    lastCurrentMonth: currentMonth,
    isWide: false,
    locale,
    offset: 0,
    cellHeight: 0,
    origin: ORIGIN_TOP,
    transition: false,
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setFocusDay':
      return { ...state, focusDay: action.value };
    case 'setStartDate':
      return { ...state, startDate: action.value };
    case 'setEndDate':
      return { ...state, endDate: action.value };
    case 'setRange':
      return { ...state, startDate: action.startDate, endDate: action.endDate };
    case 'setCellHeight':
      return { ...state, cellHeight: action.value };
    case 'setIsWide':
      return { ...state, isWide: action.value };
    case 'reset':
      return {
        ...createInitialState(action.currentMonth, state.locale),
        focusDay: state.focusDay,
        cellHeight: state.cellHeight,
        isWide: state.isWide,
      };
    case 'transitionToCurrentMonth': {
      const { currentMonth } = action;
      const { lastCurrentMonth, startDate, endDate, cellHeight } = state;

      const newState = {
        ...state,
        lastCurrentMonth: currentMonth,
        transition: true,
      };

      if (isAfter(currentMonth, lastCurrentMonth)) {
        const offset = -(rowsBetweenDates(startDate, currentMonth, state.locale) - 1) * cellHeight;

        return {
          ...newState,
          endDate: getEndDate(currentMonth, state.locale),
          offset,
          origin: ORIGIN_TOP,
        };
      }

      if (isBefore(currentMonth, lastCurrentMonth)) {
        const gridHeight = cellHeight * 6;
        const offset = rowsBetweenDates(currentMonth, endDate, state.locale) * cellHeight - gridHeight;

        return {
          ...newState,
          startDate: getStartDate(currentMonth, state.locale),
          offset,
          origin: ORIGIN_BOTTOM,
        };
      }

      return state;
    }
    default:
      throw new Error(`Unknown ${action.type} action type`);
  }
};

// #region hooks
/** @hook useControllableState */
function useControllableState(value, onChange, intitialValue) {
  const [state, setState] = useState(intitialValue);
  return onChange ? [value, onChange] : [state, setState];
}

/** @hook useGrid */
function useGrid({ locale, month: currentMonth, date: selectedDate, minimumDate, maximumDate, onMonthChange, transitionDuration, touchDragEnabled }) {
  const timeoutRef = useRef<number | undefined>();
  const containerElementRef = useRef<HTMLElement>(null);
  const initialDragPositionRef = useRef(0);

  const focusManager = useFocusManager();
  const [state, dispatch] = useReducer(reducer, createInitialState(currentMonth, locale));
  const { startDate, endDate, focusDay, cellHeight, lastCurrentMonth, offset, origin, transition, isWide } = state;

  const changeMonthLeft = (left, right) => {
    if (isSameMonth(left, right)) {
      onMonthChange(left);
    }
  };

  const focusDayChange = useCallback(
    (date) => {
      dispatch({ type: 'setFocusDay', value: date });
    },
    [dispatch]
  );

  useIsomorphicLayoutEffect(() => {
    const notDragging = !initialDragPositionRef.current;

    if (!isSameMonth(lastCurrentMonth, currentMonth) && notDragging) {
      const containerElement = containerElementRef.current;
      if (!isNull(containerElement) && isHtmlElement(containerElement)) {
        containerElement?.classList?.add('-transition');
      }
      clearTimeout(timeoutRef.current);

      if (Math.abs(differenceInCalendarMonths(currentMonth, lastCurrentMonth)) <= 3) {
        dispatch({ type: 'transitionToCurrentMonth', currentMonth });

        timeoutRef.current = setTimeout(() => {
          dispatch({ type: 'reset', currentMonth });
        }, transitionDuration) as unknown as number;
      } else {
        dispatch({ type: 'reset', currentMonth });
      }
    }
  }, [currentMonth]);

  useIsomorphicLayoutEffect(() => {
    if (selectedDate && isNil(focusDay) && isSelectable(selectedDate, { minimumDate, maximumDate })) {
      dispatch({ type: 'setFocusDay', value: startOfDay(selectedDate) });
    }
  }, [selectedDate]);

  // eslint-disable-next-line consistent-return
  useIsomorphicLayoutEffect(() => {
    if (!touchDragEnabled) {
      return;
    }

    const containerElement = containerElementRef.current;
    const gridHeight = cellHeight * 6;
    const halfGridHeight = gridHeight / 2;

    if (!isNull(containerElement) && isHtmlElement(containerElement)) {
      const handleDragStart = (event) => {
        clearTimeout(timeoutRef.current);
        const computedOffset = Number(
          // @ts-ignore
          window?.getComputedStyle(containerElement)?.transform?.match(/([-+]?[\d.]+)/g)[5]
        );
        let currentMonthPosition = 0;

        if (!initialDragPositionRef.current) {
          const newStartDate = getStartDate(subMonths(currentMonth, 1), locale);
          currentMonthPosition = (rowsBetweenDates(newStartDate, currentMonth, locale) - 1) * cellHeight;
          dispatch({
            type: 'setRange',
            startDate: newStartDate,
            endDate: getEndDate(addMonths(currentMonth, 1), locale),
          });
        }

        containerElement.style.transform = `translate3d(0, ${computedOffset || -currentMonthPosition}px, 0)`;
        containerElement.classList.remove('-transition');
        containerElement.classList.add('-moving');
        initialDragPositionRef.current = (event.touches[0].clientY as number) + (-computedOffset || currentMonthPosition);
      };

      const handleDrag = (event) => {
        const initialDragPosition = initialDragPositionRef.current;
        const dragOffset = event.touches[0].clientY - initialDragPosition;
        const previousMonth = subMonths(currentMonth, 1);
        const previousMonthPosition = (rowsBetweenDates(startDate, previousMonth, locale) - 1) * cellHeight;
        const currentMonthPosition = (rowsBetweenDates(startDate, currentMonth, locale) - 1) * cellHeight;
        const nextMonth = addMonths(currentMonth, 1);
        const nextMonthPosition = (rowsBetweenDates(startDate, nextMonth, locale) - 1) * cellHeight;

        if (dragOffset < 0) {
          if (Math.abs(dragOffset) > currentMonthPosition && isBefore(endDate, addMonths(currentMonth, 2))) {
            dispatch({ type: 'setEndDate', value: getEndDate(nextMonth, locale) });
          }
        } else if (dragOffset > 0) {
          const newStartDate = getStartDate(previousMonth, locale);
          const newCurrentMonthPosition = (rowsBetweenDates(newStartDate, currentMonth, locale) - 1) * cellHeight;
          initialDragPositionRef.current += newCurrentMonthPosition;
          dispatch({ type: 'setStartDate', value: newStartDate });
        }

        const shouldChangeToNextMonth = Math.abs(dragOffset) > nextMonthPosition - halfGridHeight;
        const shouldChangeToPreviousMonth =
          Math.abs(dragOffset) > previousMonthPosition - halfGridHeight && Math.abs(dragOffset) < currentMonthPosition - halfGridHeight;

        if (shouldChangeToNextMonth) {
          onMonthChange(nextMonth);
        } else if (shouldChangeToPreviousMonth) {
          onMonthChange(previousMonth);
        }

        containerElement.style.transform = `translate3d(0, ${dragOffset}px, 0)`;
        event.preventDefault();
      };

      const handleDragEnd = (event) => {
        const currentMonthPosition = (rowsBetweenDates(startDate, currentMonth, locale) - 1) * cellHeight;
        containerElement.style.transform = `translate3d(0, ${-currentMonthPosition}px, 0)`;
        containerElement.classList.add('-transition');
        containerElement.classList.remove('-moving');

        timeoutRef.current = setTimeout(() => {
          initialDragPositionRef.current = 0;
          containerElement.style.transform = 'translate3d(0, 0, 0)';
          containerElement.classList.remove('-transition');
          dispatch({ type: 'reset', currentMonth });
        }, transitionDuration) as unknown as number;

        if (Math.abs(initialDragPositionRef.current - currentMonthPosition - event.changedTouches[0].clientY) > 10) {
          event.preventDefault();
          event.stopPropagation();
        }
      };

      containerElement.addEventListener('touchstart', handleDragStart);
      containerElement.addEventListener('touchmove', handleDrag);
      containerElement.addEventListener('touchend', handleDragEnd);

      // eslint-disable-next-line consistent-return
      return () => {
        containerElement.removeEventListener('touchstart', handleDragStart);
        containerElement.removeEventListener('touchmove', handleDrag);
        containerElement.removeEventListener('touchend', handleDragEnd);
      };
    }
  });

  // eslint-disable-next-line consistent-return
  useIsomorphicLayoutEffect(() => {
    const containerElement = containerElementRef.current;
    if (!isNull(containerElement) && isHtmlElement(containerElement)) {
      const handleKeyDown = throttle((e: KeyboardEvent) => {
        const prevMonth = subMonths(currentMonth, 1);
        const nextMonth = addMonths(currentMonth, 1);

        let adjustedDay;
        let flag = false;

        switch (e.key) {
          case 'ArrowRight':
            adjustedDay = startOfDay(addDays(focusDay, 1));
            if (isSelectable(adjustedDay, { minimumDate, maximumDate })) {
              changeMonthLeft(nextMonth, adjustedDay);
              dispatch({ type: 'setFocusDay', value: adjustedDay });
            }
            flag = true;
            break;
          case 'ArrowLeft':
            adjustedDay = startOfDay(subDays(focusDay, 1));
            if (isSelectable(adjustedDay, { minimumDate, maximumDate })) {
              changeMonthLeft(prevMonth, adjustedDay);
              dispatch({ type: 'setFocusDay', value: adjustedDay });
            }
            flag = true;
            break;
          case 'ArrowDown':
            adjustedDay = startOfDay(addWeeks(focusDay, 1));
            if (isSelectable(adjustedDay, { minimumDate, maximumDate })) {
              changeMonthLeft(nextMonth, adjustedDay);
              dispatch({ type: 'setFocusDay', value: adjustedDay });
            }
            flag = true;
            break;
          case 'ArrowUp':
            adjustedDay = startOfDay(subWeeks(focusDay, 1));
            if (isSelectable(adjustedDay, { minimumDate, maximumDate })) {
              changeMonthLeft(prevMonth, adjustedDay);
              dispatch({ type: 'setFocusDay', value: adjustedDay });
            }
            flag = true;
            break;
          case 'Tab':
            if (e.shiftKey) focusManager.focusPrevious({ tabbable: true, wrap: true });
            else focusManager.focusNext({ tabbable: true, wrap: true });
            flag = true;
            break;
          default:
            break;
        }

        if (flag) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, 100);

      containerElement.addEventListener('keydown', handleKeyDown);

      // eslint-disable-next-line consistent-return
      return () => {
        handleKeyDown?.cancel();
        containerElement.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [currentMonth, containerElementRef, focusManager, focusDay, onMonthChange]);

  useEffect(() => {
    const handleResize = () => {
      const containerElement = containerElementRef.current;
      const containerWidth = containerElement?.offsetWidth ?? 0;
      const cellWidth = containerWidth / 7;
      let newCellHeight = 1;
      let wide = false;

      if (cellWidth > 60) {
        newCellHeight += Math.round(cellWidth * 0.75);
        wide = true;
      } else {
        newCellHeight += Math.round(cellWidth);
      }

      dispatch({ type: 'setIsWide', value: wide });
      dispatch({ type: 'setCellHeight', value: newCellHeight });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    startDate,
    endDate,
    focusDay,
    cellHeight,
    containerElementRef,
    offset,
    origin,
    transition,
    isWide,
    focusDayChange,
  };
}

/** @hook useDateFnsLocale */
function useDateFnsLocale(defaultLocale: Locale) {
  const intl = useIntl();

  const localeMapping = { en: 'en-GB', ru: 'ru' };
  const loadLocale = async (localeId) => {
    const module = await Promise.resolve(import(`date-fns/locale/${localeId}`));
    return module.default as Locale;
  };

  const localeState = useAsync(async () => {
    const result = await loadLocale(localeMapping[intl.locale]);
    return result;
  }, [intl.locale]);
  const locale = !localeState.loading && localeState.value ? localeState.value : defaultLocale;

  return [locale, localeState.loading] as [Locale, boolean];
}
// #endregion

const defaultModifiersClassNames = {
  today: '-today',
  outside: '-outside',
  wide: '-wide',
  disabled: '-disabled',
  selected: '-selected',
  selectedStart: '-selected-start',
  selectedMiddle: '-selected-middle',
  selectedEnd: '-selected-end',
  focusVisible: '-focus-visible',
};

/**
 * @experimental
 * @private
 */
function CalendarNavigation(props: ICalendarProps) {
  const { locale, month, minimumDate, maximumDate, onMonthChange } = props;

  const handlePrevious = (event) => {
    // @ts-ignore
    if (isFunction(onMonthChange)) onMonthChange(startOfMonth(subMonths(month, 1)));
    event.preventDefault();
  };

  const handleNext = (event) => {
    // @ts-ignore
    if (isFunction(onMonthChange)) onMonthChange(startOfMonth(addMonths(month, 1)));
    event.preventDefault();
  };

  // @ts-ignore
  const isDisabledPrevMonth = isSameMonth(month, minimumDate);
  // @ts-ignore
  const isDisabledNextMonth = isSameMonth(month, maximumDate);

  return (
    <div className="nice-dates-navigation">
      <button
        className={cx('nice-dates-navigation_previous', { '-disabled': isDisabledPrevMonth })}
        type="button"
        tabIndex={isDisabledPrevMonth ? -1 : 0}
        disabled={isDisabledPrevMonth}
        aria-disabled={isDisabledPrevMonth}
        onClick={handlePrevious}
        onTouchEnd={handlePrevious}
      >
        <span className="sr-only">Previous month</span>
      </button>

      <span className="nice-dates-navigation_current" role="presentation" aria-live="polite">
        {/* @ts-ignore */}
        {formatDate(month, getYear(month) === getYear(new Date()) ? 'LLLL' : 'LLLL yyyy', { locale })}
      </span>

      <button
        className={cx('nice-dates-navigation_next', { '-disabled': isDisabledNextMonth })}
        type="button"
        tabIndex={isDisabledNextMonth ? -1 : 0}
        disabled={isDisabledNextMonth}
        aria-disabled={isDisabledNextMonth}
        onClick={handleNext}
        onTouchEnd={handleNext}
      >
        <span className="sr-only">Next month</span>
      </button>
    </div>
  );
}
CalendarNavigation.displayName = 'DatePicker.CalendarNavigation';

/**
 * @experimental
 * @private
 */
function CalendarWeekHeader(props: CommonProps) {
  const { locale, weekdayFormat = 'eee' } = props;

  const today = new Date();
  const weekDays = map(
    eachDayOfInterval({
      start: startOfWeek(today, { locale }),
      end: endOfWeek(today, { locale }),
    }),
    (date) => formatDate(date, weekdayFormat, { locale })
  );

  return (
    <div className="nice-dates-week-header">
      {map(weekDays, (day) => (
        <span key={day} className="nice-dates-week-header_day" aria-hidden="true">
          {day}
        </span>
      ))}
    </div>
  );
}
CalendarWeekHeader.displayName = 'DatePicker.CalendarWeekHeader';

/**
 * @experimental
 * @private
 */
function CalendarDay(props: any) {
  const { date, height, locale, modifiers: receivedModifiers = {}, modifiersClassNames: receivedModifiersClassNames, onClick = noop, onHover = noop } = props;

  const nodeRef = useRef<HTMLButtonElement>(null);
  const { isFocusVisible: focusVisible, focusProps } = useFocusRing();

  const modifiers = { today: isToday(date), ...receivedModifiers };
  const modifiersClassNames = { ...defaultModifiersClassNames, ...receivedModifiersClassNames };

  const isDisabled = Boolean(modifiers?.disabled);
  const isSelected = Boolean(modifiers?.selected);
  const isFocusVisible = Boolean(modifiers?.focusVisible);

  useEffect(() => {
    const node = nodeRef.current;
    if (!isNull(node) && isHtmlElement(node)) {
      if (!focusVisible && isFocusVisible) {
        node.focus();
      }
    }
  }, [nodeRef, isFocusVisible]);

  const dayOfMonth = getDate(date);
  const dayClassNames = {};
  Object.keys(modifiers).forEach((name) => {
    dayClassNames[modifiersClassNames[name]] = modifiers[name];
  });

  const handleClick = (event) => {
    onClick(date);
    event.preventDefault();
  };

  const handleMouseEnter = () => {
    onHover(date);
  };

  const handleMouseLeave = () => {
    onHover(null);
  };

  return (
    <button
      ref={nodeRef}
      className={cx('nice-dates-day', dayClassNames)}
      style={{ height }}
      type="button"
      tabIndex={isFocusVisible ? 0 : -1}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-pressed={isSelected}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleClick}
      {...focusProps}
    >
      {dayOfMonth === 1 && <span className="nice-dates-day_month">{formatDate(date, 'LLL', { locale })}</span>}
      <span className="nice-dates-day_date">{dayOfMonth}</span>
    </button>
  );
}
CalendarDay.displayName = 'DatePicker.CalendarDay';

/**
 * @experimental
 * @private
 */
function CalendarGrid(props: ICalendarProps) {
  const {
    locale,
    month,
    date: selectedDate,
    minimumDate,
    maximumDate,
    modifiers = {},
    modifiersClassNames,
    onMonthChange,
    onDayHover,
    onDayClick,
    // @ts-ignore
    transitionDuration = 500,
    // @ts-ignore
    touchDragEnabled = true,
  } = props;

  const grid = useGrid({
    locale,
    // @ts-ignore
    month: startOfMonth(month),
    // @ts-ignore
    date: selectedDate,
    minimumDate,
    maximumDate,
    onMonthChange,
    transitionDuration,
    touchDragEnabled,
  });
  const { startDate, endDate, focusDay, cellHeight, containerElementRef, isWide, offset, origin, transition, focusDayChange } = grid;

  const handleDayClick = useCallback(
    (date) => {
      if (isFunction(onDayClick)) onDayClick(date);
      focusDayChange(date);
    },
    [onDayClick]
  );

  const days = map(
    eachDayOfInterval({
      start: startDate,
      end: endDate,
    }),
    (date) => {
      return (
        <CalendarDay
          key={lightFormat(date, 'yyyy-MM-dd')}
          date={date}
          height={cellHeight}
          locale={locale}
          modifiers={{
            ...computeModifiers(modifiers, date),
            focusVisible: isSameDay(date, focusDay),
            // @ts-ignore
            outside: !isSameMonth(date, month),
            wide: isWide,
          }}
          modifiersClassNames={modifiersClassNames}
          onHover={onDayHover}
          onClick={handleDayClick}
        />
      );
    }
  );

  return (
    <div className="nice-dates-grid" style={{ height: cellHeight * 6 }} role="grid">
      <div
        ref={containerElementRef as MutableRefObject<HTMLDivElement>}
        className={cx('nice-dates-grid_container', {
          '-moving': offset,
          '-origin-bottom': origin === ORIGIN_BOTTOM,
          '-origin-top': origin === ORIGIN_TOP,
          '-transition': transition,
        })}
        style={{
          transform: `translate3d(0, ${offset}px, 0)`,
          transitionDuration: `${transitionDuration}ms`,
        }}
      >
        {days}
      </div>
    </div>
  );
}
CalendarGrid.displayName = 'DatePicker.CalendarGrid';

/**
 * @experimental
 */
function Calendar(props: ICalendarProps) {
  const {
    locale,
    month: receivedMonth,
    date: selectedDate,
    modifiers: receivedModifiers,
    modifiersClassNames,
    minimumDate,
    maximumDate,
    onMonthChange,
    onDayHover,
    onDayClick,
    weekdayFormat,
    // @ts-ignore
    touchDragEnabled,
  } = props;

  const [month, setMonth] = useControllableState(receivedMonth, onMonthChange, startOfMonth(new Date()));
  const modifiers = mergeModifiers(
    {
      // @ts-ignore
      selected: (date) => isSameDay(date, selectedDate) && isSelectable(date, { minimumDate, maximumDate }),
      disabled: (date) => !isSelectable(date, { minimumDate, maximumDate }),
    },
    receivedModifiers
  );

  return (
    <div>
      <FocusScope contain autoFocus>
        <CalendarNavigation locale={locale} month={month} minimumDate={minimumDate} maximumDate={maximumDate} onMonthChange={setMonth} />

        <CalendarWeekHeader locale={locale} weekdayFormat={weekdayFormat} />

        <CalendarGrid
          locale={locale}
          month={month}
          date={selectedDate}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          onMonthChange={setMonth}
          onDayHover={onDayHover}
          onDayClick={onDayClick}
          // @ts-ignore
          touchDragEnabled={touchDragEnabled}
        />
      </FocusScope>
    </div>
  );
}
Calendar.displayName = 'DatePicker.Calendar';

/** @experimental */
const Input = forwardRef<HTMLInputElement, IDatePickerInputProps>((props, ref) => {
  const { value, min, max, format: receivedFormat, locale: receivedLocale, placeholder: receivedPlaceholder, onBlur, onFocus, onChange, ...attrs } = props;

  const locale = receivedLocale || enGB;
  const format = receivedFormat || locale?.formatLong?.date({ width: 'short' });
  const mask = useMemo(() => format.replace(/(D|M|Y|d|m|y)/g, '9'), [format]);

  const { placeholder, ...inputProps } = useDateInput({
    date: value ? new Date(value) : undefined,
    minimumDate: min,
    maximumDate: max,
    format,
    locale,
    onDateChange: onChange ?? noop,
  });

  const handleBlur = (e) => {
    if (isFunction(onBlur)) onBlur(e);
    inputProps?.onBlur(e);
  };

  const handleFocus = (e) => {
    if (isFunction(onFocus)) onFocus(e);
    inputProps?.onFocus(e);
  };

  return (
    <MaskInput
      ref={ref}
      placeholder={receivedPlaceholder ?? placeholder}
      options={{ mask, placeholder, autoUnmask: false }}
      {...attrs}
      {...inputProps}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  );
});
Input.displayName = 'DatePicker.Input';

/**
 * @experimental
 * @private
 */
function DatePickerCalendar(props: DatePickerCalendarProps) {
  const {
    locale,
    month: receivedMonth,
    date: selectedDate,
    onMonthChange,
    onDateChange,
    minimumDate,
    maximumDate,
    modifiers,
    modifiersClassNames,
    weekdayFormat,
    // @ts-ignore
    touchDragEnabled,
  } = props;

  const [month, setMonth] = useControllableState(receivedMonth, onMonthChange, startOfMonth(selectedDate || new Date()));

  const handleDateChange = useCallback(
    (date) => {
      if (isFunction(onDateChange)) onDateChange(selectedDate ? setTime(date, selectedDate) : date);
    },
    [onDateChange, selectedDate]
  );

  return (
    <Calendar
      locale={locale}
      month={month}
      date={selectedDate}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
      weekdayFormat={weekdayFormat}
      onMonthChange={setMonth}
      onDayClick={handleDateChange}
      // @ts-ignore
      touchDragEnabled={touchDragEnabled}
    />
  );
}
DatePickerCalendar.displayName = 'DatePicker.DatePickerCalendar';

/** @experimental */
const DatePicker: FC<PropsWithFunctionChild<StyledComponentProps<IDatePickerProps, never>, DatePickerChildrenProps>> = ({
  className,
  style,
  date,
  minimumDate,
  maximumDate,
  format,
  weekdayFormat,
  modifiers,
  modifiersClassNames,
  locale: receivedLocale,
  touchDragEnabled,
  onDateChange,
  container,
  children,
  placement,
}) => {
  const mounted = useUnmountPromise();
  const [locale] = useDateFnsLocale(enGB);
  const [isMounted, setIsMounted] = useGetSet(false);

  useIsomorphicLayoutEffect(() => {
    (async () => {
      const result = await mounted(new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 300))); // hack
      // This line will not execute if component gets unmounted.
      setIsMounted(result);
    })();
  }, []);

  const mDate = useMemo(() => {
    if (isDate(date)) return date;
    if (isNumber(date)) return new Date(date);
    return new Date();
  }, [date]);

  const mMinimumDate = useMemo(() => {
    if (isDate(minimumDate)) return minimumDate;
    if (isNumber(minimumDate)) return new Date(minimumDate);
    return undefined;
  }, [minimumDate]);

  const mMaximumDate = useMemo(() => {
    if (isDate(maximumDate)) return maximumDate;
    if (isNumber(maximumDate)) return new Date(maximumDate);
    return undefined;
  }, [maximumDate]);

  const [month, setMonth] = useState(mDate);
  const [focused, setFocused] = useState(false);
  const isTouch = useDetectTouch();

  const handleDateChange = useCallback(
    (value: Date | null) => {
      if (isFunction(onDateChange)) onDateChange(value);
      setFocused(false);
    },
    [onDateChange]
  );

  const handleDateInput = useCallback(
    (value: Date | null) => {
      if (isFunction(onDateChange)) onDateChange(value);
      if (value) setMonth(value);
    },
    [onDateChange]
  );

  const popoverId = useId();
  const popoverRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLElement>(null);
  const inputProps = useDateInput({
    date: mDate,
    minimumDate: mMinimumDate,
    maximumDate: mMaximumDate,
    format,
    locale: receivedLocale ?? locale,
    onDateChange: handleDateInput,
  });

  const handleInputFocus = useCallback(
    debounce((event) => {
      setFocused(true);
      inputProps?.onFocus(event);

      if (isTouch) inputRef.current?.blur();
    }, 300),
    [inputRef, isTouch]
  );

  useEffect(() => {
    inputRef.current?.addEventListener('focus', handleInputFocus);

    return () => {
      inputRef.current?.removeEventListener('focus', handleInputFocus);
    };
  }, [inputRef, handleInputFocus]);

  useUnmount(() => {
    handleInputFocus?.cancel();
  });

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const fallback = ({ inputProps, focused }) => <input className={cx(className, { '-focused': focused })} style={style} {...inputProps} />;

  if (!isMounted()) return <div className="nice-dates" />;
  // @ts-ignore
  return (
    <div className="nice-dates">
      <Popper
        ref={popoverRef}
        id={popoverId}
        className="nice-dates-popover"
        placement={placement || DefaultPlacement}
        trigger="focus"
        open={focused}
        content={
          <DatePickerCalendar
            month={month}
            date={mDate}
            minimumDate={mMinimumDate}
            maximumDate={mMaximumDate}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            weekdayFormat={weekdayFormat}
            locale={receivedLocale || locale}
            onMonthChange={(value: Date | null) => setMonth(value as Date)}
            onDateChange={handleDateChange}
            // @ts-ignore
            touchDragEnabled={touchDragEnabled}
          />
        }
        container={container}
        onClose={() => setFocused(false)}
      >
        {({ ref }) => (
          <>
            {(children ?? fallback)({
              inputProps: {
                'aria-haspopup': 'dialog',
                'aria-flowto': popoverId,
                ...inputProps,
                'ref': (node) => {
                  setRef(ref, node);
                  setRef(inputRef, node);
                },
                'readOnly': isTouch,
              },
              focused,
            })}
          </>
        )}
      </Popper>
    </div>
  );
};
DatePicker.displayName = 'DatePicker';

export default assign(DatePicker, { Input, Calendar });
