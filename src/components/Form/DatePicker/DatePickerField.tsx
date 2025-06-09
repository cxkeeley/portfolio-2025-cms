import { useField } from 'formik'
import { FC, useEffect, useMemo } from 'react'

import dayjs from '@/libs/dayjs'

import { DatePicker, DatePickerProps } from './DatePicker'

type DatePickerFieldProps = Omit<DatePickerProps, 'onChange' | 'onBlur'> & {
  name: string
  minDate?: Date
  maxDate?: Date
  showTimeInput?: boolean
  disabled?: boolean
  isClearable?: boolean
  variant?: 'outline' | 'solid'
  onChange?: (date?: Date) => void
}

const DatePickerInputField: FC<DatePickerFieldProps> = ({ name, onChange, ...props }) => {
  const [field, , helper] = useField(name)

  const selected = useMemo(() => {
    return field.value ? dayjs(field.value).toTzDate() : undefined
  }, [field.value])

  const handleChange = (date: Date) => {
    helper.setValue(dayjs(date).toTzISOString(props.showTimeInput === true))
  }

  const handleClear = () => {
    helper.setValue(undefined)
  }

  useEffect(() => {
    if (onChange) {
      onChange(selected)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange])

  return (
    <DatePicker
      isClearable
      selected={selected}
      onChange={handleChange}
      onClear={handleClear}
      {...props}
    />
  )
}

export { DatePickerInputField }
