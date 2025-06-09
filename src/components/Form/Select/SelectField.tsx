import { useField } from 'formik'

import { Option } from '@models/option'

import { Select, SelectProps } from './Select'

export type SelectFieldProps<IsMulti extends boolean = false> = SelectProps<IsMulti> & {
  name: string
}

const SelectField = <IsMulti extends boolean = false>({
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  required,
  defaultValue,
  ...props
}: SelectFieldProps<IsMulti>) => {
  const [field, , helper] = useField(props.name)

  const handleChange = (newValue: unknown) => {
    const options = newValue as Option | Array<Option>
    helper.setValue(options)
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Select
        {...props}
        value={field.value}
        placeholder={props.placeholder ?? ''}
        options={props.options}
        onChange={(newValue, actionMeta) => {
          handleChange(newValue)
          onChange?.(newValue, actionMeta)
        }}
      />
    </div>
  )
}

export { SelectField }
