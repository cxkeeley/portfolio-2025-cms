import clsx from 'clsx'
import { ChangeEvent, FC } from 'react'

type TextInputProps = {
  name: string
  value: string | number
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  isDisabled?: boolean
  variant?: 'solid' | 'outline'
  type?: 'text' | 'number'
}

const TextInput: FC<TextInputProps> = ({ variant = 'solid', isDisabled, ...props }) => {
  return (
    <input
      type="text"
      {...props}
      disabled={isDisabled}
      className={clsx('form-control', {
        'form-control-solid': variant === 'solid',
      })}
    />
  )
}

export type { TextInputProps }

export { TextInput }
