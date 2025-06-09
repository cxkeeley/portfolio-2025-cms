import { useField } from 'formik'
import { FC } from 'react'

import { RadioButton, RadioButtonProps } from './RadioButton'

type RadioButtonFieldProps = RadioButtonProps

const RadioButtonField: FC<RadioButtonFieldProps> = (props) => {
  const [field] = useField(props.name)

  return (
    <RadioButton
      {...props}
      {...field}
    />
  )
}

export type { RadioButtonFieldProps }

export { RadioButtonField }
