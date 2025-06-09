import { components, MultiValueProps } from 'react-select'

import { Option } from '@models/option'

const ReactSelectMultiValue = <Opt = Option,>(props: MultiValueProps<Opt>) => {
  return (
    <components.MultiValue
      {...props}
      className="badge badge-lg text-dark bg-secondary"
    >
      {props.children}
    </components.MultiValue>
  )
}

export { ReactSelectMultiValue }
