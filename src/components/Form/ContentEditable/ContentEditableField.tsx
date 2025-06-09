import { useField } from 'formik'
import { FC } from 'react'

import TypeUtil from '@/utils/typeUtil'

import { ContentEditable, ContentEditableProps } from './ContentEditable'

type ContentEditableFieldProps = Omit<ContentEditableProps, 'onChange' | 'value'> & {
  name: string
  isNullable?: boolean
}

const ContentEditableField: FC<ContentEditableFieldProps> = ({ name, isNullable = true, ...props }) => {
  const [field, , helper] = useField(name)

  const handleChange = (value: string) => {
    if (TypeUtil.isEmpty(value) && isNullable) {
      helper.setValue(null)
    } else {
      helper.setValue(value)
    }
  }

  return (
    <ContentEditable
      {...field}
      {...props}
      value={field.value || ''}
      onChange={handleChange}
    />
  )
}

export type { ContentEditableFieldProps }
export { ContentEditableField }
