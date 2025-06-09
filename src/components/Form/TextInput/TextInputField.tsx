import { useField } from 'formik'
import React, { FC } from 'react'

import TypeUtil from '@/utils/typeUtil'

import { TextInput, TextInputProps } from './TextInput'

type TextInputFieldProps = Omit<TextInputProps, 'value' | 'onChange'> & {
  formatValue?: (text: string) => string
}

const TextInputField: FC<TextInputFieldProps> = ({ formatValue, ...props }) => {
  const [field, , helper] = useField(props)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.type && ['number', 'range'].includes(props.type)) {
      helper.setValue(parseFloat(e.target.value))
    } else if (TypeUtil.isEmpty(e.target.value)) {
      helper.setValue(null)
    } else {
      const value = formatValue ? formatValue(e.target.value) : e.target.value
      helper.setValue(value)
    }
  }

  return (
    <TextInput
      {...field}
      {...props}
      onChange={onChange}
    />
  )
}

export type { TextInputFieldProps }

export { TextInputField }
