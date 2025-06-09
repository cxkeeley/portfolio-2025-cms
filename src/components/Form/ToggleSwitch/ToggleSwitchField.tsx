import { useField } from 'formik'
import { FC } from 'react'

import { ToggleSwitch, ToggleSwitchProps } from './ToggleSwitch'

export type ToggleSwitchFieldProps = Omit<ToggleSwitchProps, 'onChange'> & {
  name: string
  accept?: 'boolean' | 'string'
  onChange?: (value: boolean) => void
}

export const ToggleSwitchField: FC<ToggleSwitchFieldProps> = ({ accept = 'boolean', onChange, ...props }) => {
  const [field, , helper] = useField(props)
  const value = typeof field.value === 'boolean' ? field.value : field.value === 'true'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    helper.setValue(accept === 'boolean' ? e.target.checked : String(e.target.checked))
    if (onChange) {
      onChange(e.target.checked)
    }
  }

  return (
    <ToggleSwitch
      {...props}
      {...field}
      onChange={handleChange}
      checked={value}
    />
  )
}
