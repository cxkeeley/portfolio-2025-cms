import { useField } from 'formik'
import { FC } from 'react'

import { RadioButtonGroup, RadioButtonGroupProps, RadioButtonOption } from './RadioButtonGroup'

type Props = Omit<RadioButtonGroupProps, 'value' | 'onChange' | 'onBlur'> & {
  onChange?: (value: RadioButtonOption['value']) => void
}

const RadioButtonGroupField: FC<Props> = ({ onChange, ...props }) => {
  const [field, , helper] = useField(props.name)

  const handleChange = (value: RadioButtonOption['value']) => {
    helper.setValue(value)
    onChange?.(value)
  }

  return (
    <RadioButtonGroup
      {...props}
      {...field}
      onChange={handleChange}
    />
  )
}

export { RadioButtonGroupField }
