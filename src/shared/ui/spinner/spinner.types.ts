import { FC } from 'react';

type SpinnerSize = Extract<TailwindSize, 'xs' | 'sm' | 'lg' | 'xl'> | 'md' | null;

export interface ISpinnerElementProps extends StyledComponentProps {
  size?: SpinnerSize;
  color: TailwindColor;
}

export interface ISpinnerProps extends Partial<ISpinnerElementProps> {
  wrapperClassName?: string;
  component?: FC<ISpinnerElementProps>;
  beyond?: boolean;
  block?: boolean;
}

export const DefaultSpacing: TailwindSpacing = 8;
export const DefaultSize: SpinnerSize = 'md';
export const DefaultColor: TailwindColor = 'blue';
