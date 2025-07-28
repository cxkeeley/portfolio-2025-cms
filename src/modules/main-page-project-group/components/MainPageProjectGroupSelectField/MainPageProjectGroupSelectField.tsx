import { FormattedMessage } from 'react-intl'

import AdminProjectGroupsAPI from '@api/admin/projectGroupsAPI'

import { initialQueryState } from '@models/apiBase'
import { Option } from '@models/option'

import { AsyncPaginateSelectField, AsyncPaginateSelectFieldProps } from '@components/Form/AsyncPaginateSelect'

import TypeUtil from '@/utils/typeUtil'

type Props<IsMulti extends boolean> = Omit<AsyncPaginateSelectFieldProps<IsMulti>, 'onSearch'>

const MainPageProjectGroupSelectField = <IsMulti extends boolean = false>(props: Props<IsMulti>) => {
  const handleSearch = async (keyword: string, page: number) => {
    const { data } = await AdminProjectGroupsAPI.getOptionsForMainPageProjectGroupForm({
      ...initialQueryState,
      page,
      phrase: !TypeUtil.isEmpty(keyword) ? keyword : undefined,
    })

    if (data.data) {
      return {
        ...data.data,
        nodes: data.data.nodes.map(
          (node) =>
            new Option({
              label: node.name ?? '',
              value: node.id,
            })
        ),
      }
    }
  }

  return (
    <AsyncPaginateSelectField
      {...props}
      onSearch={handleSearch}
      noOptionsMessage={() => (
        <FormattedMessage
          id="model.not_found"
          values={{
            model: <FormattedMessage id="model.project_group" />,
          }}
        />
      )}
    />
  )
}

export default MainPageProjectGroupSelectField
