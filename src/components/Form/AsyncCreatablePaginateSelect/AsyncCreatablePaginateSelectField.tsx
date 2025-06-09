import { useField } from 'formik'
import { useMemo } from 'react'
import { ActionMeta, OnChangeValue } from 'react-select'

import { WithFilter } from '@models/apiBase'
import { Option } from '@models/option'

import PromiseUtil from '@/utils/PromiseUtil'

import { AsyncCreatablePaginateSelect, AsyncCreatablePaginateSelectProps } from './AsyncCreatablePaginateSelect'

type Opt = Option

export type AsyncCreatablePaginateSelectFieldProps<IsMulti extends boolean> = Omit<
  AsyncCreatablePaginateSelectProps<IsMulti>,
  'defaultOptions'
> & {
  name: string
  searchDebounceDelay?: number
}

export const AsyncCreatablePaginateSelectField = <IsMulti extends boolean>({
  required,
  searchDebounceDelay = 500,
  onChange,
  onSearch,
  ...props
}: AsyncCreatablePaginateSelectFieldProps<IsMulti>) => {
  const [field, , helper] = useField(props.name)

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

  const handleSearch = PromiseUtil.debounce<WithFilter<Array<Opt>>>(async (keyword: string, page: unknown) => {
    const pageNumber = page as number
    const response = await onSearch(keyword, pageNumber)

    if (!response) {
      return { limit: 0, page: 0, total: 0, nodes: [] }
    }

    return response
  }, searchDebounceDelay)

  const handleChange = (newValue: OnChangeValue<Opt, IsMulti>, actionMeta: ActionMeta<Opt>) => {
    helper.setValue(newValue)
    if (onChange) {
      onChange(newValue, actionMeta)
    }
  }

  const handleBlur = () => {
    helper.setTouched(true)
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <AsyncCreatablePaginateSelect
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
