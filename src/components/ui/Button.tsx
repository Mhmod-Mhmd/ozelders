import { type ButtonHTMLAttributes, type Ref } from 'react';
import {
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from './button-variants';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** React 19 passes refs as a regular prop — no `forwardRef` needed. */
  ref?: Ref<HTMLButtonElement>;
}

/** Base button primitive. For links styled as buttons use `buttonVariants()`. */
export function Button({
  variant,
  size,
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}
