import { createContext } from 'react';
import { StepsColor } from './steps.types';

export interface IStepsContextProps {
  index: number;
  first: boolean;
  last: boolean;
  active: boolean;
  completed: boolean;
  valid: boolean;
  onSelect?: (step: number) => void;
  column: boolean;
  color: StepsColor;
}

export const StepsContext = createContext({} as IStepsContextProps);
