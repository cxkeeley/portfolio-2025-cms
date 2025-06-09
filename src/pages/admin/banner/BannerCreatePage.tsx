import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import AdminBannersAPI, { PayloadAdminCreateBanner } from '@api/admin/bannersAPI'

import BannerFormCard, { BannerFormCardShape } from '@modules/banner/components/BannerFormCard'

import FormUtil from '@/utils/formUtil'
import { useToast } from '@/hooks'
import { useIntl } from 'react-intl'
import { useQueryClient } from '@tanstack/react-query'
import { QUERIES } from '@/constants/queries'

type Props = {}

const BannerCreatePage: FC<Props> = () => {
  const intl = useIntl()
  const toast = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const goBack = () => navigate(-1)

  const handleSubmit = async (values: BannerFormCardShape) => {
    const payload = FormUtil.parseValues<PayloadAdminCreateBanner>(values)

    await AdminBannersAPI.create(payload)

    queryClient.invalidateQueries([QUERIES.BANNER_LIST])
    toast.success(intl.formatMessage({ id: 'banner.message.create_success' }))

    goBack()
  }

  return (
    <BannerFormCard
      onCancel={goBack}
      onSubmit={handleSubmit}
    />
  )
}

export default BannerCreatePage
