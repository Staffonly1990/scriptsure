/// <reference types="react-scripts" />

// #region React\OverloadedComponent
declare type JsxType = JSX.IntrinsicElements[keyof JSX.IntrinsicElements];

declare type IntrinsicElementType<P = any> = {
  [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : React.DetailedHTMLProps<React.HTMLAttributes<Element>, Element>;
}[keyof JSX.IntrinsicElements];

declare type VoidElement = 'area' | 'base' | 'br' | 'col' | 'hr' | 'img' | 'input' | 'link' | 'meta' | 'param' | 'command' | 'keygen' | 'source';

declare type ImplicitOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

declare type OmitChildrenFromVoid<C extends React.ElementType> = C extends VoidElement ? Omit<React.ComponentProps<C>, 'children'> : React.ComponentProps<C>;

declare type OverloadedProp<C extends React.ElementType> = { as?: C | undefined };

declare type PropsWithOverload<P = {}, C extends React.ElementType> = P & OverloadedProp<C>;

declare interface OverloadedComponent<P> {
  <C extends React.ElementType>(props: PropsWithOverload<P & ImplicitOmit<OmitChildrenFromVoid<C>, keyof P>, C>, ref?: React.ForwardedRef<C>):
    | JSX.Element
    | React.ReactElement
    | null;
  propTypes?: React.WeakValidationMap<P> | undefined;
  contextTypes?: React.ValidationMap<any> | undefined;
  defaultProps?: Partial<P> | undefined;
  displayName?: string | undefined;
}

declare type OverloadedFC<P = {}> = OverloadedComponent<P>;
// #endregion

// #region React\AUX
declare type PropsWithChildren<P = {}> = React.PropsWithChildren<P>;

declare type PropsWithOnlyChild<P = {}> = P & { children?: React.ReactElement | undefined };

declare type PropsWithFunctionChild<P = {}, T = {}> = P & { children?: ((props: T) => ReactNode) | undefined };

declare type PropsWithStyle<P = {}> = P & { style?: React.CSSProperties | undefined };

declare type PropsWithClassName<P = {}> = P & { className?: string | undefined };

declare type PropsWithClasses<P = {}, C = any> = P & { classes?: ClassesMap<C> | undefined };

declare type ClassesMap<T> = { [key in T]?: string | undefined };

declare type Callback = () => void;

declare type Nullable<T> = T | null;

declare type StyledComponentProps<P = {}, C = any> = PropsWithClassName<P> & PropsWithStyle<P> & PropsWithClasses<P, C>;
// #endregion

// #region Tailwind
declare type TailwindSpacing =
  | 0
  | 'px'
  | 0.5
  | 1
  | 1.5
  | 2
  | 2.5
  | 3
  | 3.5
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 14
  | 16
  | 20
  | 24
  | 28
  | 32
  | 36
  | 40
  | 44
  | 48
  | 52
  | 56
  | 60
  | 64
  | 72
  | 80
  | 96;

declare type TailwindSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

declare type TailwindColor =
  | 'transparent'
  | 'current'
  | 'black'
  | 'white'
  | 'teal'
  | 'gray'
  | 'red'
  | 'yellow'
  | 'orange'
  | 'green'
  | 'blue'
  | 'sky'
  | 'indigo'
  | 'purple'
  | 'pink';

declare type TailwindTextTransform = 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case';
// #endregion
