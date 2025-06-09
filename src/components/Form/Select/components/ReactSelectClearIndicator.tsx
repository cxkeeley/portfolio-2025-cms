import { ClearIndicatorProps, components } from 'react-select'

import { Option } from '@models/option'

const ReactSelectClearIndicator = <Opt = Option,>(props: ClearIndicatorProps<Opt>) => {
  return (
    <components.ClearIndicator {...props}>
      <i className="fa fa-times fs-base" />
    </components.ClearIndicator>
  )
}

export { ReactSelectClearIndicator }
