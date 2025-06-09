import { PlaceholderProps } from 'react-select'

import { Option } from '@models/option'

const ReactSelectPlaceHolder = <Opt = Option,>(props: PlaceholderProps<Opt>) => {
  return (
    <div
      {...props.innerProps}
      className="react-select__placeholder text-truncate"
    >
      {props.children}
    </div>
  )
}

export { ReactSelectPlaceHolder }
