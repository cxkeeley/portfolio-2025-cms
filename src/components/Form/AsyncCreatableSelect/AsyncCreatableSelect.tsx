import { FormattedMessage } from 'react-intl'
import { GroupBase, StylesConfig } from 'react-select'
import AsyncCreatableReactSelect from 'react-select/async-creatable'
import { AsyncAdditionalProps } from 'react-select/dist/declarations/src/useAsync'
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager'

import { Option } from '@models/option'

import { ReactSelectClearIndicator } from '../Select/components/ReactSelectClearIndicator'
import { ReactSelectControl } from '../Select/components/ReactSelectControl'
import { ReactSelectDropdownIndicator } from '../Select/components/ReactSelectDropdownIndicator'
import { ReactSelectIndicatorSeparator } from '../Select/components/ReactSelectIndicatorSeparator'
import { ReactSelectLoadingIndicator } from '../Select/components/ReactSelectLoadingIndicator'
import { ReactSelectMultiValue } from '../Select/components/ReactSelectMultiValue'
import { ReactSelectSingleValue } from '../Select/components/ReactSelectSingleValue'

type Opt = Option

export type AsyncCreatableSelectProps<IsMulti extends boolean> = StateManagerProps<Opt, IsMulti, GroupBase<Opt>> &
  AsyncAdditionalProps<Option, GroupBase<Option>> & {
    onSearch: (inputValue: string) => Promise<Array<Option>>
    defaultValue?: Option
  }

export const AsyncCreatableSelect = <IsMutli extends boolean = false>({
  onSearch,
  defaultValue,
  menuPosition = 'fixed',
  ...props
}: AsyncCreatableSelectProps<IsMutli>) => {
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

  return (
    <AsyncCreatableReactSelect<Opt, IsMutli, GroupBase<Opt>>
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
      value={props.value ? props.value : null}
      defaultValue={defaultValue ? defaultValue : undefined}
      loadOptions={async (inputVal: string) => onSearch(inputVal)}
      styles={styles}
    />
  )
}
