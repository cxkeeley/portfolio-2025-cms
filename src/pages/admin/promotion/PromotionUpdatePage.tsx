import { QUERIES } from '@/constants/queries'
import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'
import AdminPromotionsAPI, { PayloadUpdatePromotion } from '@api/admin/promotionsAPI'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import PromotionUpdateFormCard, {
  PromotionUpdateFormCardShape,
} from '@modules/promotion/components/PromotionUpdateFormCard/PromotionUpdateFormCard'
import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

type Props = {}

const PromotionUpdatePage: FC<Props> = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const intl = useIntl()
  const { promotionId } = useParams()

  const {
    data: promotion,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    enabled: TypeUtil.isDefined(promotionId),
    queryKey: [QUERIES.ADMIN_PROMOTION_DETAIL, promotionId!],
    queryFn: () => AdminPromotionsAPI.get(promotionId!),
    select: (r) => r.data.data?.promotion,
  })

  const handleSubmit = async (values: PromotionUpdateFormCardShape) => {
    const payload = FormUtil.parseValues<PayloadUpdatePromotion>(values)

    const { data } = await AdminPromotionsAPI.update(promotionId!, payload)

    if (data.data?.promotion) {
      toast.success(intl.formatMessage({ id: 'promotion.alert.update_promotion_success' }))
      navigate(`/admin/promotions/${data.data.promotion.id}`)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  if (!promotionId) {
    return <Navigate to="/error/404" />
  }

  if (isLoading && isFetching) {
    return <FloatLoadingIndicator />
  }

  if (isError || !promotion) {
    return <ErrorCard />
  }

  return (
    <PromotionUpdateFormCard
      initialImageSrc={promotion.image_file?.link}
      initialValues={{
        whatsapp_text: promotion.whatsapp_text,
      }}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}

export default PromotionUpdatePage
