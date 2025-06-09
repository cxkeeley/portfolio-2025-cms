import { useField } from 'formik'
import { useMemo } from 'react'
import { ActionMeta, OnChangeValue } from 'react-select'

import { Option } from '@models/option'

import PromiseUtil from '@/utils/PromiseUtil'

import { AsyncReactSelect, AsyncSelectProps } from './AsyncSelect'

type Opt = Option

export type AsyncSelectFieldProps<IsMulti extends boolean> = Omit<
  AsyncSelectProps<IsMulti>,
  'onSearch' | 'defaultOptions'
> & {
  name: string
  searchDebounceDelay?: number
  onSearch: (keyword: string) => Promise<Array<Option> | undefined>
}

const AsyncSelectField = <IsMulti extends boolean = false>({
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  onSearch,
  name,
  required,
  searchDebounceDelay = 500,
  ...props
}: AsyncSelectFieldProps<IsMulti>) => {
  const [field, , helper] = useField(name)

  const isClearable = useMemo(() => {
    if (props.isClearable && field.value) {
      if (Array.isArray(field.value)) {
        return field.value.some((v) => !v.isFixed)
      } else {
        return !field.value.isFixed
      }
    }
    return false
  }, [props.isClearable, field.value])

  const handleSearch = PromiseUtil.debounce<Array<Opt>>(async (keyword: string) => {
    let options = await onSearch(keyword)

    if (!options) {
      return []
    }

    return options
  }, searchDebounceDelay)

  const handleChange = (value: OnChangeValue<Opt, IsMulti>, action: ActionMeta<Opt>) => {
    helper.setValue(value)

    if (onChange) {
      onChange(value, action)
    }
  }

  const handleBlur = () => {
    helper.setTouched(true)
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <AsyncReactSelect
        {...props}
        placeholder={props.placeholder ?? ''}
        value={field.value}
        isClearable={isClearable}
        onSearch={handleSearch}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  )
}

export { AsyncSelectField }
