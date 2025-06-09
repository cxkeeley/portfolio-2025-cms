import clsx, { ClassValue } from 'clsx'
import { ButtonHTMLAttributes, forwardRef, PropsWithChildren } from 'react'
import { FormattedMessage } from 'react-intl'

export type Theme = 'secondary' | 'light' | 'primary' | 'warning' | 'success' | 'danger' | 'info'

export type Variant = 'light' | 'outline' | 'link' | 'icon'

export type Size = 'sm' | 'lg'

export type HoverEffect = 'elevate-up' | 'elevate-down' | 'scale' | 'rotate-end' | 'rotate-start'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean
  isActive?: boolean
  variant?: Variant
  size?: Size

  hover?: HoverEffect
  theme?: Theme
  activeColor?: Theme

  textColor?: Theme | (string & {})
  iconColor?: Theme | (string & {})
  activeTextColor?: Theme | (string & {})
  bg?: Theme | (string & {})
}

const Button = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps>>(
  (
    {
      children,
      isLoading,
      isActive,
      size,
      type = 'button',

      variant,
      theme,
      activeColor,
      activeTextColor,
      iconColor,
      textColor,
      hover,
      bg,

      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const buttonClass = (): ClassValue => {
      const classNames: ClassValue = ['btn']

      switch (variant) {
        case 'light': {
          if (theme && theme !== 'light') {
            classNames.push(`btn-light-${theme}`)
          } else {
            classNames.push('btn-light')
          }

          if (activeColor) {
            classNames.push(`btn-active-light-${activeColor}`)
          }

          break
        }
        case 'link': {
          classNames.push('btn-link')

          break
        }
        case 'outline': {
          classNames.push('btn-outline')

          if (theme) {
            classNames.push(`btn-outline-${theme}`)
          }

          if (activeColor) {
            classNames.push(`btn-active-${activeColor}`)
          }

          break
        }
        case 'icon': {
          classNames.push('btn-icon')
          classNames.push(`btn-${theme}`)

          if (activeColor) {
            classNames.push(`btn-active-${activeColor}`)
          }

          break
        }
        default: {
          classNames.push(`btn-${theme}`)

          if (activeColor) {
            classNames.push(`btn-active-${activeColor}`)
          }

          break
        }
      }

      if (size) {
        classNames.push(`btn-${size}`)
      }

      if (textColor) {
        classNames.push(`btn-color-${textColor}`)
      }

      if (activeTextColor) {
        classNames.push(`btn-active-color-${activeTextColor}`)
      }

      if (iconColor) {
        classNames.push(`btn-icon-${iconColor}`)
      }

      if (hover) {
        classNames.push(`hover-${hover}`)
      }

      if (bg) {
        classNames.push(`btn-bg-${bg}`)
      }

      if (isActive) {
        classNames.push(`active`)
      }

      return classNames
    }

    return (
      <button
        ref={ref}
        {...props}
        // eslint-disable-next-line react/button-has-type
        type={type}
        className={clsx(buttonClass(), className)}
        disabled={isLoading || disabled}
        data-kt-indicator={isLoading ? 'on' : 'off'}
      >
        <span className="indicator-label">{children}</span>

        <span className="indicator-progress">
          {variant !== 'icon' && <span className="me-2">{<FormattedMessage id="vocabulary.loading" />}...</span>}
          <span className="spinner-border spinner-border-sm align-middle" />
        </span>
      </button>
    )
  }
)

export default Button
