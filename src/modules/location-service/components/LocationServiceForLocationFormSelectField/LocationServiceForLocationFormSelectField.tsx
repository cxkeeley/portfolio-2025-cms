import { FC } from 'react'
import { FormattedMessage } from 'react-intl'

import AdminLocationServicesAPI from '@api/admin/locationServicesAPI'

import { initialQueryState } from '@models/apiBase'
import { ID } from '@models/base'
import { Option } from '@models/option'

import {
  AsyncPaginateSelectField,
  AsyncPaginateSelectFieldProps,
} from '@components/Form/AsyncPaginateSelect/AsyncPaginateSelectField'

import TypeUtil from '@/utils/typeUtil'

type Props = Omit<AsyncPaginateSelectFieldProps<false>, 'onSearch'> & {
  locationId: ID
}

const LocationServiceForLocationFormSelectField: FC<Props> = ({ locationId, ...props }) => {
  const searchDebounce = async (inputVal: string, page: number) => {
    const response = await AdminLocationServicesAPI.getOptionsForLocationForm({
      ...initialQueryState,
      page,
      phrase: !TypeUtil.isEmpty(inputVal) ? inputVal : undefined,
      location_id: locationId,
    })

    if (response.data.data) {
      return {
        ...response.data.data,
        nodes: response.data.data.nodes.map((lang) => {
          return new Option({
            label: lang.default_title ?? '-',
            value: lang.id,
          })
        }),
      }
    }
  }

  return (
    <AsyncPaginateSelectField
      {...props}
      onSearch={searchDebounce}
      noOptionsMessage={() => (
        <FormattedMessage
          id="model.not_found"
          values={{
            model: <FormattedMessage id="model.location_service" />,
          }}
        />
      )}
    />
  )
}

export default LocationServiceForLocationFormSelectField
