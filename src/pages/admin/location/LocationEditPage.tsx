import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'

import AdminLocationsAPI, { PayloadAdminLocationUpdate } from '@api/admin/locationsAPI'

import { Option } from '@models/option'

import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'

import { LocationFormCard, LocationFormCardShape } from '@modules/location/components/LocationFormCard'

import { QUERIES } from '@/constants/queries'
import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

const LocationEditPage: FC = () => {
  const intl = useIntl()
  const toast = useToast()
  const navigate = useNavigate()
  const { locationId } = useParams()

  const { data, error, isLoading, isFetching } = useQuery({
    enabled: TypeUtil.isDefined(locationId),
    queryKey: [QUERIES.ADMIN_LOCATION_DETAIL, locationId],
    queryFn: () => AdminLocationsAPI.get(locationId!),
    select: (r) => r.data.data?.location,
  })

  const goBack = () => {
    navigate(-1)
  }

  const handleSubmit = async (values: LocationFormCardShape) => {
    const payload = FormUtil.formatValues(FormUtil.parseValues<PayloadAdminLocationUpdate>(values), {
      latitude: (v) => (TypeUtil.isDefined(v) ? Number(v) : null),
      longitude: (v) => (TypeUtil.isDefined(v) ? Number(v) : null),
    })
    await AdminLocationsAPI.update(locationId!, payload)

    toast.success(intl.formatMessage({ id: 'location.alert.update_location_success' }))
    navigate(`/admin/locations/${locationId}`)
  }

  if (data) {
    return (
      <LocationFormCard
        hiddenFields={{
          default_address: true,
          default_description: true,
          default_name: true,
          default_short_name: true,
        }}
        initialValues={{
          location_group_id: data.location_group ? Option.fromObject(data.location_group, 'id', 'name') : null,
          location_label_id: data.location_label ? Option.fromObject(data.location_label, 'id', 'default_name') : null,
          phone_number: data.phone_number,
          is_coming_soon: data.is_coming_soon,
          latitude: data.latitude,
          longitude: data.longitude,
        }}
        onSubmit={handleSubmit}
        onCancel={goBack}
      />
    )
  }

  if (isLoading || isFetching) {
    return <FloatLoadingIndicator />
  }

  if (error) {
    return <ErrorCard />
  }

  return null
}

export default LocationEditPage
