import clsx from 'clsx'
import { FC } from 'react'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: 'solid' | 'outline'
}

const Textarea: FC<TextareaProps> = ({ variant = 'solid', ...props }) => {
  return (
    <textarea
      {...props}
      className={clsx('form-control flex-grow-1 mb-3 mb-lg-0', {
        'form-control-solid': variant === 'solid',
      })}
      disabled={props.disabled}
    ></textarea>
  )
}

export { Textarea }
