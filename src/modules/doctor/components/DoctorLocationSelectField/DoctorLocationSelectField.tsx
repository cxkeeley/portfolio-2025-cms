import { useIntl } from 'react-intl'

import AdminLocationsAPI from '@api/admin/projectsAPI'

import { initialQueryState } from '@models/apiBase'
import { Option } from '@models/option'

import { AsyncPaginateSelectField, AsyncPaginateSelectFieldProps } from '@components/Form/AsyncPaginateSelect'

import TypeUtil from '@/utils/typeUtil'

type Props<IsMulti extends boolean> = Omit<AsyncPaginateSelectFieldProps<IsMulti>, 'onSearch'>

const DoctorLocationSelectField = <IsMulti extends boolean = false>(props: Props<IsMulti>) => {
  const intl = useIntl()

  const handleSearch = async (keyword: string, page: number) => {
    const { data } = await AdminLocationsAPI.getOptionsForDoctorForm({
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
          id: 'doctor.placeholder.empty_location_option',
        })
      }}
    />
  )
}

export default DoctorLocationSelectField
