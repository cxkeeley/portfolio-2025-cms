import { ControlProps } from 'react-select'

import { Option } from '@models/option'

const ReactSelectControl = <O = Option,>(props: ControlProps<O>) => {
  return (
    <div
      ref={props.innerRef}
      {...props.innerProps}
      className="react-select__control"
    >
      {props.children}
    </div>
  )
}

export { ReactSelectControl }
