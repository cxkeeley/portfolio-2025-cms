import AdminPromotionLanguageAPI, { PayloadUpdatePromotionLanguage } from '@/api/admin/promotionLanguagesAPI'
import ErrorCard from '@/components/ErrorCard'
import FloatLoadingIndicator from '@/components/FloatLoadingIndicator'
import { QUERIES } from '@/constants/queries'
import { useToast } from '@/hooks'
import PromotionLanguageEditFormCard from '@/modules/promotion/components/PromotionLanguageEditFormCard'
import { PromotionLanguageEditFormCardShape } from '@/modules/promotion/components/PromotionLanguageEditFormCard/PromotionLanguageEditFormCard'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'
import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

type Props = {}

const PromotionLanguageUpdatePage: FC<Props> = () => {
  const intl = useIntl()
  const toast = useToast()
  const navigate = useNavigate()
  const { promotionId, languageId } = useParams()

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [QUERIES.ADMIN_PROMOTION_LANGUAGE_DETAIL, languageId],
    queryFn: () => AdminPromotionLanguageAPI.get(languageId!),
    enabled: TypeUtil.isDefined(languageId),
    select: (r) => r.data.data?.promotion_language,
  })

  const handleCancel = () => {
    navigate(-1)
  }

  const handleSubmit = async (values: PromotionLanguageEditFormCardShape) => {
    const payload = FormUtil.parseValues<PayloadUpdatePromotionLanguage>(values)

    const response = await AdminPromotionLanguageAPI.update(languageId!, payload)

    if (response.data) {
      toast.success(intl.formatMessage({ id: 'promotion.alert.update_promotion_language_success' }))
      navigate(`/admin/promotions/${promotionId}`)
    }
  }

  if (!promotionId || !languageId) {
    return <Navigate to="/error/404" />
  }

  if (isLoading && isFetching) {
    return <FloatLoadingIndicator />
  }

  if (isError || !data) {
    return <ErrorCard />
  }

  return (
    <PromotionLanguageEditFormCard
      initialValues={{
        lead: data.lead,
        reference: data.reference,
        slug: data.slug,
        title: data.title,
      }}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}

export default PromotionLanguageUpdatePage
