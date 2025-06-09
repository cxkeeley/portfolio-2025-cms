import { FC } from 'react'
import Stack from 'react-bootstrap/Stack'

import { RadioButton } from '../RadioButton/RadioButton'

export type RadioButtonOption = {
  label?: string
  value: string | number | boolean | null
}

type DefaultProps = Pick<React.InputHTMLAttributes<HTMLInputElement>, 'onBlur'>

export type RadioButtonGroupProps = DefaultProps & {
  name: string
  value: RadioButtonOption['value']
  options: Array<RadioButtonOption>
  onChange: (value: RadioButtonOption['value']) => void
  isDisabled?: boolean
  direction?: 'horizontal' | 'vertical'
}

export const RadioButtonGroup: FC<RadioButtonGroupProps> = ({ onChange, options, value, direction, ...props }) => {
  return (
    <Stack
      gap={5}
      direction={direction}
    >
      {options.map((option) => (
        <RadioButton
          key={String(option.value)}
          {...props}
          disabled={props.isDisabled}
          label={option.label}
          value={String(option.value)}
          onChange={() => onChange(option.value)}
          checked={option.value === value}
        />
      ))}
    </Stack>
  )
}
