import { useField } from 'formik'
import { ChangeEvent, FC } from 'react'

import TypeUtil from '@/utils/typeUtil'

import { Textarea, TextareaProps } from './Textarea'

export type TextareaInputProps = Omit<TextareaProps, 'onChange' | 'value'> & {
  name: string
  isNullable?: boolean
}

const TextareaField: FC<TextareaInputProps> = ({ isNullable = true, ...props }) => {
  const [field, , helper] = useField(props)

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

    if (TypeUtil.isEmpty(value) && isNullable) {
      helper.setValue(null)
    } else {
      helper.setValue(value)
    }
  }

  return (
    <Textarea
      {...field}
      {...props}
      value={field.value || ''}
      onChange={handleChange}
    />
  )
}

export { TextareaField }
