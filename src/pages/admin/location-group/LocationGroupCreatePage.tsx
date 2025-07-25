import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import AdminLocationGroupsAPI, { PayloadLocationGroupCreate } from '@api/admin/projectGroupsAPI'

import { LocationGroupFormCardShape } from '@modules/location-group/components/LocationGroupFormCard'
import LocationGroupFormCard from '@modules/location-group/components/LocationGroupFormCard/LocationGroupFormCard'

import { QUERIES } from '@/constants/queries'
import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'

type Props = {}

const LocationGroupCreatePage: FC<Props> = () => {
  const intl = useIntl()
  const toast = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const goBack = () => navigate(-1)

  const handleSubmit = async (values: LocationGroupFormCardShape) => {
    const payload = FormUtil.parseValues<PayloadLocationGroupCreate>(values)
    const response = await AdminLocationGroupsAPI.create(payload)
    queryClient.invalidateQueries([QUERIES.LOCATION_GROUP_LIST])
    toast.success(intl.formatMessage({ id: 'location_group.message.create_success' }))
    navigate(`/admin/location-groups/${response.data.data?.location_group.id}`)
  }

  return (
    <LocationGroupFormCard
      onCancel={goBack}
      onSubmit={handleSubmit}
    />
  )
}

export default LocationGroupCreatePage
