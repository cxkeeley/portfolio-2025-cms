import { Ref } from 'react'
import { FormattedMessage } from 'react-intl'
import { GroupBase, StylesConfig } from 'react-select'
import AsyncSelect from 'react-select/async'
import Select from 'react-select/dist/declarations/src/Select'
import { AsyncAdditionalProps } from 'react-select/dist/declarations/src/useAsync'
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager'

import { Option } from '@models/option'

import { ReactSelectClearIndicator } from '../Select/components/ReactSelectClearIndicator'
import { ReactSelectControl } from '../Select/components/ReactSelectControl'
import { ReactSelectDropdownIndicator } from '../Select/components/ReactSelectDropdownIndicator'
import { ReactSelectIndicatorSeparator } from '../Select/components/ReactSelectIndicatorSeparator'
import { ReactSelectLoadingIndicator } from '../Select/components/ReactSelectLoadingIndicator'
import { ReactSelectMultiValue } from '../Select/components/ReactSelectMultiValue'
import { ReactSelectPlaceHolder } from '../Select/components/ReactSelectPlaceHolder'
import { ReactSelectSingleValue } from '../Select/components/ReactSelectSingleValue'

type Opt = Option

type ComponentType<IsMulti extends boolean> = Select<Opt, IsMulti, GroupBase<Opt>>

export type AsyncSelectProps<IsMulti extends boolean> = StateManagerProps<Opt, IsMulti, GroupBase<Opt>> &
  AsyncAdditionalProps<Option, GroupBase<Option>> & {
    ref?: Ref<ComponentType<IsMulti>>
    onSearch: (inputValue: string) => Promise<Array<Option>>
    defaultValue?: Option
  }

const AsyncReactSelect = <IsMulti extends boolean = false>({
  ref,
  onSearch,
  defaultValue,
  menuPosition = 'fixed',
  ...props
}: AsyncSelectProps<IsMulti>) => {
  // Handle Remove 'X' if option is Fixed
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

  return (
    <AsyncSelect<Opt, IsMulti, GroupBase<Opt>>
      {...props}
      ref={ref}
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
      value={props.value ? props.value : null}
      defaultValue={defaultValue ? defaultValue : undefined}
      loadOptions={async (inputVal: string) => onSearch(inputVal)}
      styles={styles}
    />
  )
}

export { AsyncReactSelect }
