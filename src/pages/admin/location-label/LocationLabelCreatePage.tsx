import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import AdminLocationLabelsAPI, { PayloadCreateLocationLabel } from '@api/admin/locationLabelsAPI'

import LocationLabelFormCard, {
  LocationLabelFormCardShape,
} from '@modules/location-label/components/LocationLabelFormCard/LocationLabelFormCard'

import { QUERIES } from '@/constants/queries'
import FormUtil from '@/utils/formUtil'

type Props = {}

const LocationLabelCreatePage: FC<Props> = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const goBack = () => navigate(-1)

  const handleSubmit = async (values: LocationLabelFormCardShape) => {
    const payload = FormUtil.parseValues<PayloadCreateLocationLabel>(values)
    const response = await AdminLocationLabelsAPI.create(payload)
    queryClient.invalidateQueries([QUERIES.LOCATION_GROUP_LIST])
    navigate(`/admin/location-labels/${response.data.data?.location_label.id}`)
  }

  return (
    <LocationLabelFormCard
      onCancel={goBack}
      onSubmit={handleSubmit}
    />
  )
}

export default LocationLabelCreatePage
