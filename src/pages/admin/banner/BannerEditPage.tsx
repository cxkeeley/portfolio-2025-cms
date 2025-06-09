import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'

import AdminBannersAPI, { PayloadAdminUpdateBanner } from '@api/admin/bannersAPI'

import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'

import BannerFormCard, { BannerFormCardShape } from '@modules/banner/components/BannerFormCard'

import { QUERIES } from '@/constants/queries'
import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

type Props = {}

const BannerEditPage: FC<Props> = () => {
  const intl = useIntl()
  const toast = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { bannerId } = useParams()

  const { data, isLoading, error } = useQuery({
    enabled: TypeUtil.isDefined(bannerId),
    queryKey: [QUERIES.BANNER_DETAIL, bannerId],
    queryFn: () => AdminBannersAPI.get(bannerId!),
    select: (response) => response.data.data?.banner,
  })

  const goBack = () => navigate(-1)

  const handleSubmit = async (values: BannerFormCardShape) => {
    const payload = FormUtil.parseValues<PayloadAdminUpdateBanner>(values)

    await AdminBannersAPI.update(bannerId!, payload)

    queryClient.invalidateQueries([QUERIES.BANNER_LIST])
    toast.success(intl.formatMessage({ id: 'banner.message.update_success' }))

    goBack()
  }

  if (isLoading) {
    return <FloatLoadingIndicator />
  }

  if (error || !data) {
    return <ErrorCard />
  }

  const initialValues: BannerFormCardShape = {
    url: data.url,
  }

  return (
    <BannerFormCard
      initialImageSrc={data.image_file.link}
      initialValues={initialValues}
      onCancel={goBack}
      onSubmit={handleSubmit}
    />
  )
}

export default BannerEditPage
