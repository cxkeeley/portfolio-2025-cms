import { components, OptionProps } from 'react-select'

import { Option } from '@models/option'
import { UserModel } from '@models/user'

import { useAuth } from '@modules/auth/contexts/AuthContext'

const ReactSelectOptionUser = <Opt = Option,>(props: OptionProps<Opt>) => {
  const { currentUser } = useAuth()
  const data = props.data as unknown as Option<UserModel>

  return (
    <components.Option {...props}>
      <div className="d-flex flex-column">
        <div className="fw-medium d-flex align-items-center">
          {props.children}
          {data.value === currentUser?.id && <span className="badge badge-primary ms-2">Me</span>}
        </div>
        {data.data?.email && <div className="text-muted">{data.data.email}</div>}
      </div>
    </components.Option>
  )
}

export { ReactSelectOptionUser }
