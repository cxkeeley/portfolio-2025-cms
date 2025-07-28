import { useIntl } from 'react-intl'

import AdminProjectsAPI from '@api/admin/projectsAPI'

import { initialQueryState } from '@models/apiBase'
import { Option } from '@models/option'

import { AsyncPaginateSelectField, AsyncPaginateSelectFieldProps } from '@components/Form/AsyncPaginateSelect'

import TypeUtil from '@/utils/typeUtil'

type Props<IsMulti extends boolean> = Omit<AsyncPaginateSelectFieldProps<IsMulti>, 'onSearch'>

const TeamProjectSelectField = <IsMulti extends boolean = false>(props: Props<IsMulti>) => {
  const intl = useIntl()

  const handleSearch = async (keyword: string, page: number) => {
    const { data } = await AdminProjectsAPI.getOptionsForTeamForm({
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
              label: node.name,
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
      noOptionsMessage={() => {
        return intl.formatMessage({
          id: 'team.placeholder.empty_project_option',
        })
      }}
    />
  )
}

export default TeamProjectSelectField
