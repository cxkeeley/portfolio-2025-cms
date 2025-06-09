import AdminPromotionsAPI, { PayloadCreatePromotion } from '@/api/admin/promotionsAPI'
import { useToast } from '@/hooks'
import PromotionCreateFormCard, { PromotionCreateFormCardShape } from '@/modules/promotion/components/PromotionCreateFormCard/PromotionCreateFormCard'
import FormUtil from '@/utils/formUtil'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

type Props = {}

const PromotionCreatePage: FC<Props> = () => {
  const intl = useIntl()
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (values: PromotionCreateFormCardShape) => {
    const payload = FormUtil.parseValues<PayloadCreatePromotion>(values)

    const response = await AdminPromotionsAPI.create(payload)

    if (response.data.data?.promotion) {
      toast.success(intl.formatMessage({ id: 'promotion.alert.create_promotion_success' }))
      navigate(`/admin/promotions/${response.data.data.promotion.id}`)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <PromotionCreateFormCard
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}

export default PromotionCreatePage
