import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import AdminLocationsAPI, { PayloadAdminLocationCreate } from '@api/admin/locationsAPI'

import { LocationFormCard, LocationFormCardShape } from '@modules/location/components/LocationFormCard'

import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

const LocationCreatePage: FC = () => {
  const intl = useIntl()
  const toast = useToast()
  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1)
  }

  const handleSubmit = async (values: LocationFormCardShape) => {
    const payload = FormUtil.formatValues(FormUtil.parseValues<PayloadAdminLocationCreate>(values), {
      latitude: (v) => (TypeUtil.isDefined(v) ? Number(v) : null),
      longitude: (v) => (TypeUtil.isDefined(v) ? Number(v) : null),
    })

    const response = await AdminLocationsAPI.create(payload)
    toast.success(intl.formatMessage({ id: 'location.alert.create_location_success' }))

    if (response.data.data?.location) {
      navigate(`/admin/locations/${response.data.data.location.id}`)
    } else {
      goBack()
    }
  }

  return (
    <LocationFormCard
      onSubmit={handleSubmit}
      onCancel={goBack}
    />
  )
}

export default LocationCreatePage
