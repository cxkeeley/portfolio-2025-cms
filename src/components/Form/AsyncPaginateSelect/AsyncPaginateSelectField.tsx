import { useField } from 'formik'
import { useMemo } from 'react'
import { ActionMeta, OnChangeValue } from 'react-select'

import { WithFilter } from '@models/apiBase'
import { Option } from '@models/option'

import {
  AsyncPaginateReactSelect,
  AsyncPaginateSelectProps,
} from '@components/Form/AsyncPaginateSelect/AsyncPaginationReactSelect'

import PromiseUtil from '@/utils/PromiseUtil'

type Opt = Option

export type AsyncPaginateSelectFieldProps<IsMulti extends boolean> = Omit<
  AsyncPaginateSelectProps<IsMulti>,
  'defaultOptions' | 'value'
> & {
  name: string
}

export const AsyncPaginateSelectField = <IsMulti extends boolean = false>({
  onChange,
  onSearch,
  searchDebounceDelay = 500,
  ...props
}: AsyncPaginateSelectFieldProps<IsMulti>) => {
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

  const handleChange = (newValue: OnChangeValue<Opt, IsMulti>, actionMeta: ActionMeta<Opt>) => {
    helper.setValue(newValue)

    if (onChange) {
      onChange(newValue, actionMeta)
    }
  }

  const handleBlur = () => {
    helper.setTouched(true)
  }

  const handleSearch = PromiseUtil.debounce<WithFilter<Array<Option>>>(async (keyword: string, page: unknown) => {
    const pageNumber = page as number
    const response = await onSearch(keyword, pageNumber)

    if (!response) {
      return { page: 0, total: 0, limit: 0, nodes: [] }
    }

    return response
  }, searchDebounceDelay)

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <AsyncPaginateReactSelect
        {...props}
        placeholder={props.placeholder ?? ''}
        value={field.value}
        isClearable={isClearable}
        onSearch={handleSearch}
        onChange={handleChange}
        onBlur={handleBlur}
        searchDebounceDelay={searchDebounceDelay}
      />
    </div>
  )
}
