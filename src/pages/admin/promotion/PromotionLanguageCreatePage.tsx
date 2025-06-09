import AdminPromotionLanguageAPI, { PayloadCreatePromotionLanguage } from '@/api/admin/promotionLanguagesAPI'
import { useToast } from '@/hooks'
import PromotionLanguageCreateFormCard, {
  PromotionLanguageCreateFormCardShape,
} from '@/modules/promotion/components/PromotionLanguageCreateFormCard'
import FormUtil from '@/utils/formUtil'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

type Props = {}

const PromotionLanguageCreatePage: FC<Props> = () => {
  const intl = useIntl()
  const toast = useToast()
  const { promotionId } = useParams()

  const navigate = useNavigate()

  const handleSubmit = async (value: PromotionLanguageCreateFormCardShape) => {
    const payload = FormUtil.parseValues<PayloadCreatePromotionLanguage>(value)

    const { data } = await AdminPromotionLanguageAPI.create({
      ...payload,
      promotion_id: promotionId!,
    })

    if (data) {
      toast.success(intl.formatMessage({ id: 'promotion.alert.create_promotion_language_success' }))
      navigate(`/admin/promotions/${promotionId}`)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  if (!promotionId) {
    return <Navigate to="/error/404" />
  }

  return (
    <PromotionLanguageCreateFormCard
      promotionId={promotionId}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}

export default PromotionLanguageCreatePage
