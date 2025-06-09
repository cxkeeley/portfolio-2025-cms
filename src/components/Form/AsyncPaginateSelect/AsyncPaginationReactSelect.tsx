import { FormattedMessage } from 'react-intl'
import { GroupBase, StylesConfig } from 'react-select'
import { AsyncPaginate, LoadOptions } from 'react-select-async-paginate'
import { AsyncAdditionalProps } from 'react-select/dist/declarations/src/useAsync'
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager'

import { WithFilter } from '@models/apiBase'
import { Option } from '@models/option'

import { PaginationUtil } from '@/utils/paginationUtil'

import { ReactSelectClearIndicator } from '../Select/components/ReactSelectClearIndicator'
import { ReactSelectControl } from '../Select/components/ReactSelectControl'
import { ReactSelectDropdownIndicator } from '../Select/components/ReactSelectDropdownIndicator'
import { ReactSelectIndicatorSeparator } from '../Select/components/ReactSelectIndicatorSeparator'
import { ReactSelectLoadingIndicator } from '../Select/components/ReactSelectLoadingIndicator'
import { ReactSelectMultiValue } from '../Select/components/ReactSelectMultiValue'
import { ReactSelectPlaceHolder } from '../Select/components/ReactSelectPlaceHolder'
import { ReactSelectSingleValue } from '../Select/components/ReactSelectSingleValue'

type Opt = Option

type AdditionalProps = {
  page: number
}

export type AsyncPaginateSelectProps<IsMulti extends boolean> = StateManagerProps<Opt, IsMulti, GroupBase<Opt>> &
  AsyncAdditionalProps<Opt, GroupBase<Opt>> & {
    onSearch: (inputValue: string, page: number) => Promise<WithFilter<Array<Option>> | undefined>
    defaultValue?: Opt | Array<Opt>
    searchDebounceDelay?: number
  }

export const AsyncPaginateReactSelect = <IsMulti extends boolean = false>({
  onSearch,
  searchDebounceDelay = 500,
  menuPosition = 'fixed',
  ...props
}: AsyncPaginateSelectProps<IsMulti>) => {
  const styles: StylesConfig<Opt, IsMulti> = {
    multiValueRemove: (base, state) => {
      const data = state.data as Option
      return {
        ...base,
        marginLeft: 'auto',
        display: data.isFixed ? 'none' : 'block',
      }
    },
  }

  const handleLoadOptions: LoadOptions<Opt, GroupBase<Opt>, AdditionalProps> = async (keyword, _, additional) => {
    try {
      const response = await onSearch(keyword, additional!.page)

      if (!response || response.nodes.length === 0) {
        return { options: [], hasMore: false }
      }

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
    <AsyncPaginate
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
      value={props.value ?? null}
      styles={styles}
      loadOptions={handleLoadOptions}
      debounceTimeout={searchDebounceDelay}
      additional={{ page: 1 }}
      components={{
        ClearIndicator: ReactSelectClearIndicator,
        DropdownIndicator: ReactSelectDropdownIndicator,
        SingleValue: ReactSelectSingleValue,
        MultiValue: ReactSelectMultiValue,
        Control: ReactSelectControl,
        LoadingIndicator: ReactSelectLoadingIndicator,
        Placeholder: ReactSelectPlaceHolder,
        IndicatorSeparator: ReactSelectIndicatorSeparator,
        ...props.components,
      }}
    />
  )
}
