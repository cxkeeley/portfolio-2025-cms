import { FC } from 'react'

import { Checkbox, CheckboxProps } from '@components/Form/Checkbox'

export type CheckboxSwitchProps = Omit<CheckboxProps, 'onChange' | 'value'> & {
  value?: boolean
  onChange?: (value: boolean) => void
}

const CheckboxSwitch: FC<CheckboxSwitchProps> = ({ value, onChange, ...props }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked)
  }

  return (
    <Checkbox
      {...props}
      checked={value}
      onChange={handleChange}
      value={String(value)}
    />
  )
}

export { CheckboxSwitch }
