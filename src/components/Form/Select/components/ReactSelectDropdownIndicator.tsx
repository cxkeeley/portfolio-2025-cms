import { components, DropdownIndicatorProps } from 'react-select'

import { Option } from '@models/option'

const ReactSelectDropdownIndicator = <Opt = Option,>(props: DropdownIndicatorProps<Opt>) => {
  return (
    <components.DropdownIndicator {...props}>
      <i className="fa fa-chevron-down" />
    </components.DropdownIndicator>
  )
}

export { ReactSelectDropdownIndicator }
