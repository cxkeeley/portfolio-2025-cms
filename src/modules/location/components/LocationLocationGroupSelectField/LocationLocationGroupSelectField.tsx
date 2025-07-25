import { FormattedMessage } from 'react-intl'

import AdminLocationGroupAPI from '@api/admin/projectGroupsAPI'

import { initialQueryState } from '@models/apiBase'
import { Option } from '@models/option'

import { AsyncPaginateSelectField, AsyncPaginateSelectFieldProps } from '@components/Form/AsyncPaginateSelect'

import TypeUtil from '@/utils/typeUtil'

type Props<IsMulti extends boolean> = Omit<AsyncPaginateSelectFieldProps<IsMulti>, 'onSearch'>

const LocationLocationGroupSelectField = <IsMulti extends boolean = false>(props: Props<IsMulti>) => {
  const handleSearch = async (keyword: string, page: number) => {
    const { data } = await AdminLocationGroupAPI.getOptionsForLocationForm({
      ...initialQueryState,
      page,
      limit: 10,
      phrase: !TypeUtil.isEmpty(keyword) ? keyword : undefined,
    })

    if (data.data?.nodes && data.data.nodes.length > 0) {
      return {
        ...data.data,
        nodes: data.data.nodes.map(
          (node) =>
            new Option({
              label: node.name,
              value: node.id,
              data: node,
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
            model: <FormattedMessage id="model.location_group" />,
          }}
        />
      )}
    />
  )
}

export default LocationLocationGroupSelectField
