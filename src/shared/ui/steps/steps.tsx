import React, { Children, cloneElement, FC, ReactElement } from 'react';
import { isFunction, assign, map } from 'lodash';

import { DefaultColor, DefaultColumn, StepsColor } from './steps.types';
import { StepsContext } from './steps.context';
import Step from './steps.step';
import styles from './steps.module.css';

export interface IStepsProps {
  color: StepsColor;
  column: boolean;
  /**
   * If true will not assist in controlling steps for linear flow.
   */
  nonLinear?: boolean;
  activeStep: number;
  isValid?: (step: number, index) => boolean;
  onSelect?: (step: number) => void;
}

const Steps: FC<StyledComponentProps<IStepsProps>> = ({ color, column, activeStep, nonLinear, isValid, onSelect, children }) => {
  const steps = Children.toArray(children);
  const { length } = steps;

  const render = () => {
    return map(steps, (step, index) => {
      const first = index === 0;
      const last = index === length - 1;
      const active = activeStep === index;
      const completed = !nonLinear && activeStep > index;
      const valid = isFunction(isValid) ? isValid(activeStep, index) : true;

      const StepContext = (
        <StepsContext.Provider value={{ first, last, active, completed, valid, index, onSelect, color, column }}>{step}</StepsContext.Provider>
      );

      return cloneElement(StepContext as ReactElement);
    });
  };

  return (
    <div className={styles.root} role="menubar">
      <div className={styles.inner}>
        <ol className="flex flex-wrap">{render()}</ol>
      </div>
    </div>
  );
};
Steps.displayName = 'Steps';
Steps.defaultProps = {
  color: DefaultColor,
  column: DefaultColumn,
  nonLinear: false,
};

export default assign(Steps, { Step });
