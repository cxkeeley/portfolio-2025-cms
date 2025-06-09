import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import AdminLocationServicesAPI, { PayloadLocationServiceCreate } from '@api/admin/locationServiceAPI'

import { LocationGroupFormCardShape } from '@modules/location-group/components/LocationGroupFormCard'
import LocationServiceFormCard from '@modules/location-service/components/LocationServiceFormCard/LocationServiceFormCard'

import { QUERIES } from '@/constants/queries'
import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'

type Props = {}

const LocationServiceCreatePage: FC<Props> = () => {
  const intl = useIntl()
  const toast = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const goBack = () => navigate(-1)

  const handleSubmit = async (values: LocationGroupFormCardShape) => {
    const payload = FormUtil.parseValues<PayloadLocationServiceCreate>(values)
    const response = await AdminLocationServicesAPI.create(payload)
    queryClient.invalidateQueries([QUERIES.ADMIN_LOCATION_SERVICE_LIST])
    toast.success(intl.formatMessage({ id: 'location_service.message.create_success' }))
    navigate(`/admin/location-services/${response.data.data?.location_service.id}`)
  }

  return (
    <LocationServiceFormCard
      onCancel={goBack}
      onSubmit={handleSubmit}
    />
  )
}

export default LocationServiceCreatePage
