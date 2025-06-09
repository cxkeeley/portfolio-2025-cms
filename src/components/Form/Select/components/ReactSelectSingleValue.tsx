import { SingleValueProps } from 'react-select'

import { Option } from '@models/option'

const ReactSelectSingleValue = <Opt = Option,>(props: SingleValueProps<Opt>) => {
  return (
    <div
      {...props.innerProps}
      className="react-select__single-value text-truncate"
    >
      {props.children}
    </div>
  )
}

export { ReactSelectSingleValue }
