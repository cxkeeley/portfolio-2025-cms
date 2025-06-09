import { FC, useCallback } from 'react'
import Stack from 'react-bootstrap/Stack'

import { Checkbox } from '../Checkbox'

export type CheckboxValue = {
  label?: string
  value: string | number
}

type DefaultProps = Pick<React.InputHTMLAttributes<HTMLInputElement>, 'onBlur' | 'disabled' | 'onChange'>

export type CheckboxGroupProps = DefaultProps & {
  value: Array<CheckboxValue['value']>
  options: Array<CheckboxValue>
}

export const CheckboxGroup: FC<CheckboxGroupProps> = ({ onChange, options, value, ...props }) => {
  const isChecked = useCallback(
    (val: CheckboxValue['value']): boolean => {
      return value.some((selected) => selected === val)
    },
    [value]
  )

  return (
    <Stack
      gap={5}
      direction="horizontal"
    >
      {options.map((option) => (
        <Checkbox
          key={String(option.value)}
          {...props}
          label={option.label}
          value={String(option.value)}
          onChange={onChange}
          checked={isChecked(option.value)}
        />
      ))}
    </Stack>
  )
}
