import { useField } from 'formik'
import { FC, useState } from 'react'

import { Checkbox } from '@components/Form/Checkbox'

import { CheckboxSwitchProps } from './CheckboxSwitch'

export type CheckboxSwitchFieldProps = Omit<CheckboxSwitchProps, 'onChange' | 'onBlur'> & {
  name: string
  label?: string
  checkboxLabel?: string
  isCell?: boolean
  accept?: 'boolean' | 'string'
  onChange?: (value: boolean) => void
}

export const CheckboxSwitchField: FC<CheckboxSwitchFieldProps> = ({
  name,
  label,
  checkboxLabel,
  accept = 'boolean',
  isCell,
  onChange,
  ...props
}) => {
  const [field, meta, helper] = useField(name)
  const [value, setValue] = useState<boolean>(typeof field.value === 'boolean' ? field.value : field.value === 'true')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    helper.setValue(accept === 'boolean' ? e.target.checked : '' + e.target.checked)
    if (onChange) {
      onChange(e.target.checked)
    }
    setValue(e.target.checked)
  }

  return (
    <Checkbox
      {...props}
      onChange={handleChange}
      checked={value}
      label={checkboxLabel}
      value={String(meta.initialValue)}
    />
  )
}
