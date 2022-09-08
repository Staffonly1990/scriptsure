import React, {
  FC,
  FormEventHandler,
  FocusEventHandler,
  MouseEventHandler,
  ChangeEventHandler,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  ReactElement,
  ForwardedRef,
  forwardRef,
  useRef,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { useFocusManager, FocusScope } from '@react-aria/focus';
import { XIcon } from '@heroicons/react/outline';
import { isElement as isHtmlElement, isFunction, isString, isNil, isEqual, assign } from 'lodash';

import { useForkRef, useSetterValue, useDebouncedValue } from 'shared/hooks';
import { AutocompleteProvider, useAutocompleteContext } from './autocomplete.context';

export type AutocompletePlacement =
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

export interface IAutocompleteProps {
  onSelect?: <R extends object = any>(value: string, rawValue: R) => void;
}

export interface IAutocompleteInputProps<E = Element> {
  name?: string;
  value?: string;
  disabled?: boolean;
  placeholder?: string;
  onBlur?: FocusEventHandler<E>;
  onInput?: FormEventHandler<E>;
  onChange?: ChangeEventHandler<E>;
}

export interface IAutocompleteOptionProps {
  value: object | string;
  label?: ReactNode;
  disabled?: boolean;
  valueToString?: (rawValue: object) => string;
}

export interface IAutocompleteResetProps {
  defaultValue?: string;
  onClick?: MouseEventHandler<Element>;
}

/** @experimental */
const Input = forwardRef<HTMLInputElement, StyledComponentProps<IAutocompleteInputProps<HTMLInputElement>>>((props, ref) => {
  const { className, style, name, value, disabled, onChange, onInput, onBlur, placeholder } = props;
  const { change, setInputRef } = useAutocompleteContext();

  const nodeRef = useRef<HTMLInputElement>(null);
  const plugRef = useForkRef(setInputRef, nodeRef);
  const handleRef = useForkRef(plugRef, ref);

  const handleChange = (event) => {
    change(event.target?.value);
    if (isFunction(onChange)) onChange(event);
  };

  return (
    <input
      ref={handleRef}
      className={className}
      style={style}
      type="text"
      name={name}
      value={value}
      disabled={disabled}
      spellCheck="false"
      autoComplete="off"
      aria-autocomplete="list"
      onChange={handleChange}
      onInput={onInput}
      onBlur={onBlur}
      placeholder={placeholder}
    />
  );
});
Input.displayName = 'Autocomplete.Input';

/** @experimental */
const ListBox = forwardRef(function ListBox<F extends HTMLDivElement, P = {}>(
  props: PropsWithChildren<StyledComponentProps<P>>,
  ref: ForwardedRef<F>
): ReactElement<any, any> | null {
  const { children } = props;

  return (
    <div ref={ref} role="listbox" tabIndex={-1}>
      <FocusScope contain autoFocus>
        {children}
      </FocusScope>
    </div>
  );
});
ListBox.displayName = 'Autocomplete.ListBox';

const Option: FC<StyledComponentProps<IAutocompleteOptionProps>> = (props) => {
  const { className, style, value: rawValue, label, disabled, valueToString } = props;
  const { debouncedSource, select, delegateChange } = useAutocompleteContext();

  const focusManager = useFocusManager();
  const handleKeyDown = (e: KeyboardEvent) => {
    let flag = false;
    switch (e.key) {
      case 'ArrowUp':
        focusManager.focusPrevious({ wrap: true });
        flag = true;
        break;
      case 'ArrowDown':
        focusManager.focusNext({ wrap: true });
        flag = true;
        break;
      default:
        break;
    }
    if (flag) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const value = useMemo(() => (!isString(rawValue) && isFunction(valueToString) ? valueToString(rawValue) : rawValue), [rawValue, valueToString]);
  const selected = useMemo(() => isEqual(debouncedSource, value), [debouncedSource, value]);

  const handleSelect = () => {
    select(value, rawValue);
    delegateChange(value);
  };

  return (
    <button
      className={className}
      style={style}
      type="button"
      role="option"
      aria-live="polite"
      aria-selected={selected}
      tabIndex={selected ? -1 : 0}
      disabled={disabled}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
    >
      {label ?? value}
    </button>
  );
};
Option.displayName = 'Autocomplete.Option';

/** @experimental */
const Reset: FC<StyledComponentProps<IAutocompleteResetProps>> = (props) => {
  const { className, style, defaultValue, onClick, ...attrs } = props;
  const { inputRef, debouncedSource, delegateChange } = useAutocompleteContext();

  const disabled = useMemo(() => isNil(debouncedSource) || !(debouncedSource as string)?.length, [debouncedSource]);

  const handleClick = (event: MouseEvent<Element>) => {
    if (isFunction(onClick)) onClick(event);
    if (isHtmlElement(inputRef)) inputRef?.focus();
    if (!event.defaultPrevented) delegateChange(defaultValue ?? null);
  };

  return <XIcon className={className} style={style} role="button" tabIndex={0} focusable="true" aria-disabled={disabled} onClick={handleClick} {...attrs} />;
};
Reset.displayName = 'Autocomplete.Reset';

/** @experimental */
const Autocomplete: FC<IAutocompleteProps> = (props) => {
  const { onSelect, children } = props;
  const [inputRef, setInputRef] = useState<Nullable<HTMLInputElement>>(null);
  const [source, setSource] = useState(null);
  const debouncedSource = useDebouncedValue(source, 300);
  const setNativeSource = useSetterValue();

  const select = useCallback(
    (value, rawValue) => {
      if (isFunction(onSelect)) onSelect(value, rawValue);
    },
    [onSelect]
  );

  const change = useCallback((value) => setSource(value), []);

  const delegateChange = useCallback(
    (value) => {
      if (!isHtmlElement(inputRef)) return;
      setNativeSource(inputRef, value);
      const event = new InputEvent('change', {
        bubbles: true,
        cancelable: true,
        data: null,
        inputType: '',
      });
      // event.simulated = true;
      inputRef?.dispatchEvent(event);
    },
    [inputRef]
  );

  const context = { source, debouncedSource, select, change, delegateChange, setInputRef, inputRef };
  return <AutocompleteProvider value={context}>{children ?? null}</AutocompleteProvider>;
};
Autocomplete.displayName = 'Autocomplete';

export default assign(Autocomplete, { Input, ListBox, Option, Reset });
