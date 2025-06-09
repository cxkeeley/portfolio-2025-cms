import { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { ActionMeta, GroupBase, OnChangeValue, StylesConfig } from 'react-select'
import { ComponentProps, UseAsyncPaginateParams, withAsyncPaginate } from 'react-select-async-paginate'
import Creatable from 'react-select/creatable'
import type { CreatableProps } from 'react-select/creatable'

import { WithFilter } from '@models/apiBase'
import { Option } from '@models/option'

import { PaginationUtil } from '@/utils/paginationUtil'

import { ReactSelectClearIndicator } from '../Select/components/ReactSelectClearIndicator'
import { ReactSelectControl } from '../Select/components/ReactSelectControl'
import { ReactSelectDropdownIndicator } from '../Select/components/ReactSelectDropdownIndicator'
import { ReactSelectIndicatorSeparator } from '../Select/components/ReactSelectIndicatorSeparator'
import { ReactSelectLoadingIndicator } from '../Select/components/ReactSelectLoadingIndicator'
import { ReactSelectMultiValue } from '../Select/components/ReactSelectMultiValue'
import { ReactSelectSingleValue } from '../Select/components/ReactSelectSingleValue'

type Opt = Option

type Additional = {
  page: number
}

type Props<IsMulti extends boolean> = CreatableProps<Opt, IsMulti, GroupBase<Opt>> &
  UseAsyncPaginateParams<Opt, GroupBase<Opt>, Additional> &
  ComponentProps<Opt, GroupBase<Opt>, IsMulti>

export type AsyncCreatablePaginateSelectProps<IsMulti extends boolean> = Omit<
  Props<IsMulti>,
  'additional' | 'loadOptions' | 'defaultValues'
> & {
  onSearch: (inputValue: string, page: number) => Promise<WithFilter<Array<Opt>> | undefined>
  defaultValue?: Opt
}

type AsyncPaginateCreatableType = <IsMulti extends boolean>(props: Props<IsMulti>) => ReactElement

const CreatableAsyncPaginate = withAsyncPaginate(Creatable) as AsyncPaginateCreatableType

const AsyncCreatablePaginateSelect = <IsMutli extends boolean>({
  defaultValue,
  menuPosition = 'fixed',
  onSearch,
  onChange,
  ...props
}: AsyncCreatablePaginateSelectProps<IsMutli>) => {
  // Handle Remove 'X' if option is Fixed
  const styles: StylesConfig<Opt, IsMutli> = {
    multiValueRemove: (base, state) => {
      const data = state.data as Option
      return {
        ...base,
        marginLeft: 'auto',
        display: data.isFixed ? 'none' : 'block',
      }
    },
  }

  const handleSearch = async (keyword: string, page: number) => {
    const response = await onSearch(keyword, page)
    if (!response) {
      return { page: 0, total: 0, limit: 0, nodes: [] }
    }
    return response
  }

  const handleChange = (newValue: OnChangeValue<Opt, IsMutli>, actionMeta: ActionMeta<Opt>) => {
    let option = newValue as Array<Option> | Option
    if (option) {
      if (Array.isArray(option)) {
        option = option.map((opt) => {
          return new Option({
            label: opt.label,
            value: opt.value,
            data: opt.data,
            __isNew__: opt.__isNew__,
          })
        })
      } else {
        option = new Option({
          label: option.label,
          value: option.value,
          data: option.data,
          __isNew__: option.__isNew__,
        })
      }
    }
    onChange?.(option as OnChangeValue<Opt, IsMutli>, actionMeta)
  }

  const handleLoadOptions = async (inputVal: string, additional?: Additional) => {
    try {
      const response = await handleSearch(inputVal, additional!.page)
      return {
        options: response.nodes,
        hasMore: PaginationUtil.hasNextPage(response.total, response.page, response.limit),
        additional: {
          page: additional!.page + 1,
        },
      }
    } catch (e) {
      return {
        options: [],
        hasMore: false,
        additional: {
          page: additional!.page + 1,
        },
      }
    }
  }

  return (
    <CreatableAsyncPaginate
      {...props}
      classNamePrefix="react-select"
      menuPosition={menuPosition}
      defaultOptions={true}
      loadingMessage={() => (
        <>
          <FormattedMessage id="vocabulary.loading" />
          ...
        </>
      )}
      components={{
        ...props.components,
        ClearIndicator: ReactSelectClearIndicator,
        DropdownIndicator: ReactSelectDropdownIndicator,
        SingleValue: ReactSelectSingleValue,
        MultiValue: ReactSelectMultiValue,
        Control: ReactSelectControl,
        LoadingIndicator: ReactSelectLoadingIndicator,
        IndicatorSeparator: ReactSelectIndicatorSeparator,
      }}
      additional={{ page: 1 }}
      styles={styles}
      value={props.value ? props.value : null}
      onChange={handleChange}
      loadOptions={(keyword, _, additional) => handleLoadOptions(keyword, additional)}
      defaultValue={defaultValue ? defaultValue : undefined}
    />
  )
}

export { AsyncCreatablePaginateSelect }
