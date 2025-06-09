import { AdminUsersAPI } from '@api/admin/usersAPI'

import { initialQueryState } from '@models/apiBase'
import { Option } from '@models/option'

import { AsyncPaginateSelectField, AsyncPaginateSelectFieldProps } from '@components/Form/AsyncPaginateSelect'
import { ReactSelectOptionUser } from '@components/Form/Select/components/ReactSelectOptionUser'

import TypeUtil from '@/utils/typeUtil'

type Props<IsMulti extends boolean> = Omit<AsyncPaginateSelectFieldProps<IsMulti>, 'onSearch'>

const UserSelectField = <IsMulti extends boolean = false>(props: Props<IsMulti>) => {
  const searchDebounce = async (inputVal: string, page: number) => {
    const response = await AdminUsersAPI.getOptionsForEmailLoginForm({
      ...initialQueryState,
      page: page,
      limit: 10,
      phrase: !TypeUtil.isEmpty(inputVal) ? inputVal : undefined,
    })

    if (response?.data) {
      return {
        ...response.data,
        nodes: response.data.nodes.map(
          (user) =>
            new Option({
              label: user.name!,
              value: user.email!,
              data: {
                email: user.email,
              },
            })
        ),
      }
    }
  }

  return (
    <AsyncPaginateSelectField
      {...props}
      onSearch={searchDebounce}
      noOptionsMessage={() => 'user not found'}
      components={{
        Option: ReactSelectOptionUser,
      }}
    />
  )
}

export { UserSelectField }
