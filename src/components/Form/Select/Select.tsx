import { useEffect, useState } from 'react'
import ReactSelect, { GroupBase } from 'react-select'
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager'

import { Option } from '@models/option'

import { useDebounce } from '@/hooks'

import { ReactSelectClearIndicator } from './components/ReactSelectClearIndicator'
import { ReactSelectControl } from './components/ReactSelectControl'
import { ReactSelectDropdownIndicator } from './components/ReactSelectDropdownIndicator'
import { ReactSelectIndicatorSeparator } from './components/ReactSelectIndicatorSeparator'
import { ReactSelectLoadingIndicator } from './components/ReactSelectLoadingIndicator'
import { ReactSelectMultiValue } from './components/ReactSelectMultiValue'
import { ReactSelectSingleValue } from './components/ReactSelectSingleValue'

type Opt = Option

export type SelectProps<IsMulti extends boolean = false> = StateManagerProps<Opt, IsMulti, GroupBase<Opt>> & {
  onSearch?: (value?: string) => void
}

const Select = <IsMulti extends boolean = false>({
  onSearch,
  menuPosition = 'fixed',
  ...props
}: SelectProps<IsMulti>) => {
  const [searchTerm, setSearchTerm] = useState<string>()

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const handleInputChange = (value: string) => {
    setSearchTerm(value)
  }

  useEffect(() => {
    onSearch && onSearch(searchTerm)
    // eslint-disable-next-line
  }, [debouncedSearchTerm])

  return (
    <ReactSelect<Opt, IsMulti, GroupBase<Opt>>
      {...props}
      classNamePrefix="react-select"
      value={props.value ? props.value : null}
      onInputChange={handleInputChange}
      menuPosition={menuPosition}
      components={{
        Control: ReactSelectControl,
        SingleValue: ReactSelectSingleValue,
        MultiValue: ReactSelectMultiValue,
        DropdownIndicator: ReactSelectDropdownIndicator,
        ClearIndicator: ReactSelectClearIndicator,
        LoadingIndicator: ReactSelectLoadingIndicator,
        IndicatorSeparator: ReactSelectIndicatorSeparator,
        ...props.components,
      }}
    />
  )
}

export { Select }
