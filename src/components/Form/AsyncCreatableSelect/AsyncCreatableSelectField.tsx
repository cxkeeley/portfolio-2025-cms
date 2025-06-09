import { useField } from 'formik'
import { useMemo } from 'react'
import { ActionMeta, OnChangeValue } from 'react-select'

import { Option } from '@models/option'

import PromiseUtil from '@/utils/PromiseUtil'

import { AsyncCreatableSelect, AsyncCreatableSelectProps } from './AsyncCreatableSelect'

type Opt = Option

export type AsyncCreatableSelectFieldProps<IsMulti extends boolean> = Omit<
  AsyncCreatableSelectProps<IsMulti>,
  'onSearch' | 'defaultOptions' | 'value'
> & {
  name: string
  searchDebounceDelay?: number
  onSearch: (keyword: string) => Promise<Array<Option> | undefined>
}

export const AsyncCreatableSelectField = <IsMulti extends boolean = false>({
  onChange,
  onSearch,
  required,
  searchDebounceDelay = 500,
  ...props
}: AsyncCreatableSelectFieldProps<IsMulti>) => {
  const [field, , helper] = useField(props.name)

  const handleSearch = PromiseUtil.debounce<Array<Option>>(async (keyword: string) => {
    let options = await onSearch(keyword)

    if (!options) {
      return []
    }

    return options
  }, searchDebounceDelay)

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

  const handleChange = (value: OnChangeValue<Opt, IsMulti>, actionMeta: ActionMeta<Opt>) => {
    helper.setValue(value)

    if (onChange) {
      onChange(value, actionMeta)
    }
  }

  const handleBlur = () => {
    helper.setTouched(true)
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <AsyncCreatableSelect
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
