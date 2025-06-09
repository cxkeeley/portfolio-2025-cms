import { components, OptionProps } from 'react-select'

import { Option, WithDesc } from '@models/option'

export const ReactSelectOptionStyle1 = <Opt = Option,>(props: OptionProps<Opt>) => {
  const data = props.data as unknown as Option<WithDesc>

  return (
    <components.Option {...props}>
      <div className="d-flex flex-column">
        <div className="fw-medium d-flex align-items-center">{props.children}</div>
        {data.data?.description && <div className="text-muted">{data.data.description}</div>}
      </div>
    </components.Option>
  )
}
