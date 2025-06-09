import { useField } from 'formik'
import { FC } from 'react'

import { CheckboxGroup, CheckboxGroupProps } from './CheckboxGroup'

type Props = Omit<CheckboxGroupProps, 'value' | 'onChange' | 'onBlur'> & {
  name: string
  onChange?: CheckboxGroupProps['onChange']
}

const CheckboxGroupField: FC<Props> = ({ name, onChange, ...props }) => {
  const [field] = useField(name)

  if (field.value && !Array.isArray(field.value)) {
    throw new Error('Initial value must be an array')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e)
    onChange?.(e)
  }

  return (
    <CheckboxGroup
      {...props}
      {...field}
      onChange={handleChange}
      value={field.value ?? []}
    />
  )
}

export { CheckboxGroupField }
