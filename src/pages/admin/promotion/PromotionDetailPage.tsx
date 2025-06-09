import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { FC, Fragment, useCallback, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link, Navigate, useParams } from 'react-router-dom'

import { Button } from '@components/Button'
import LanguageTabDeleteButton from '@components/LanguageTabDeleteButton'

import PromotionDetailCard from '@modules/promotion/components/PromotionDetailCard'

import AdminPromotionLanguageAPI from '@/api/admin/promotionLanguagesAPI'
import AdminPromotionsAPI, { ResponsePromotion } from '@/api/admin/promotionsAPI'
import EmptyContentCard from '@/components/EmptyContentCard'
import ErrorCard from '@/components/ErrorCard'
import FloatLoadingIndicator from '@/components/FloatLoadingIndicator'
import LanguageTabSwitcher, { LanguageTab } from '@/components/LanguageTabSwitcher'
import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useToast } from '@/hooks'
import { ID } from '@/models/base'
import { LanguageCodeEnum } from '@/models/language'
import { PromotionStatusEnum } from '@/models/promotion'
import { PromotionLanguageModel } from '@/models/promotionLanguage'
import { PermissionsControl } from '@/modules/permissions'
import { usePermissions } from '@/modules/permissions/core/PermissionsProvider'
import PromotionFeaturedImageCard from '@/modules/promotion/components/PromotionFeaturedImageCard'
import PromotionLanguageContentEditorCard from '@/modules/promotion/components/PromotionLanguageContentEditorCard'
import PromotionLanguageDetailCard from '@/modules/promotion/components/PromotionLanguageDetailCard'
import { PromotionLanguageTermAndConditionEditorCard } from '@/modules/promotion/components/PromotionLanguageTermAndConditionEditorCard'
import PromotionVisibilityCard from '@/modules/promotion/components/PromotionVisibilityCard'
import AxiosUtil from '@/utils/axiosUtil'
import TypeUtil from '@/utils/typeUtil'

type Props = {}

const PromotionDetailPage: FC<Props> = () => {
  const intl = useIntl()
  const alert = useAlert()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { hasAllPermissions, hasPermissions } = usePermissions()
  const { promotionId } = useParams()

  const [activeLanguageIndex, setActiveLanguageIndex] = useState(0)

  const canPublish = hasAllPermissions([
    PermissionEnum.ADMIN_PROMOTION_PUBLISH,
    PermissionEnum.ADMIN_PROMOTION_UNPUBLISH,
  ])

  const canUpdateContent = hasPermissions(PermissionEnum.ADMIN_PROMOTION_LANGUAGE_UPDATE_CONTENT)

  const canUpdateTermAndConditions = hasPermissions(PermissionEnum.ADMIN_PROMOTION_LANGUAGE_UPDATE_TERM_AND_CONDITIONS)

  const { data, isFetching, isLoading, isError, refetch } = useQuery({
    queryKey: [QUERIES.ADMIN_PROMOTION_DETAIL, promotionId],
    queryFn: () => AdminPromotionsAPI.get(promotionId!),
    select: (r) => r.data.data?.promotion,
    enabled: TypeUtil.isDefined(promotionId),
  })

  const handleLanguageTabChange = (_: unknown, index: number) => {
    setActiveLanguageIndex(index)
  }

  const publishArticle = async (id: ID) => {
    try {
      await AdminPromotionsAPI.publish(id)
      refetch()
      toast.success(intl.formatMessage({ id: 'promotion.alert.publish_promotion_success' }))
    } catch (err) {
      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        alert.error({ text: err.response.data.message })
      } else {
        alert.error({ text: String(err) })
      }
    }
  }

  const unpublishArticle = async (id: ID) => {
    try {
      await AdminPromotionsAPI.unpublish(id)
      refetch()
      toast.success(intl.formatMessage({ id: 'promotion.alert.unpublish_promotion_success' }))
    } catch (err) {
      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        alert.error({ text: err.response.data.message })
      } else {
        alert.error({ text: String(err) })
      }
    }
  }

  const handleVisibilityChange = (value: boolean) => {
    if (value) {
      publishArticle(promotionId!)
    } else {
      unpublishArticle(promotionId!)
    }
  }

  const handleRemoveLanguage = useCallback(
    async (promotionLanguage: PromotionLanguageModel, index: number) => {
      const { isConfirmed } = await alert.question({
        text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: promotionLanguage.language?.name }),
        confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
      })

      if (isConfirmed) {
        try {
          await AdminPromotionLanguageAPI.delete(promotionLanguage.id)

          refetch()
          // realign active language index
          if (index <= activeLanguageIndex) {
            setActiveLanguageIndex((prev) => (prev > 0 ? prev - 1 : prev))
          }

          toast.success(
            intl.formatMessage(
              { id: 'promotion.alert.delete_promotion_language_success' },
              { name: promotionLanguage.language?.name }
            )
          )
        } catch (err) {
          if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
            alert.error({ text: err.response.data.message })
          } else {
            alert.error({ text: String(err) })
          }
        }
      }
    },
    [activeLanguageIndex, alert, intl, refetch, toast]
  )

  const updateContent = async (content: string, promotionLanguageId: ID) => {
    try {
      const response = await AdminPromotionLanguageAPI.updateContent(promotionLanguageId, { content })
      toast.success(intl.formatMessage({ id: 'promotion.alert.update_promotion_language_content_success' }))

      queryClient.setQueryData<AxiosResponse<ResponsePromotion>>(
        [QUERIES.ADMIN_PROMOTION_DETAIL, promotionId],
        (oldData) => {
          const newPromotionLanguage = response.data.data?.promotion_language
          if (newPromotionLanguage && oldData?.data.data?.promotion) {
            const index = oldData.data.data.promotion.languages!.findIndex((l) => l.id === newPromotionLanguage.id)
            if (index !== -1) {
              oldData.data.data.promotion.languages![index] = newPromotionLanguage
            }
          }
          return oldData
        }
      )
    } catch (error) {
      if (AxiosUtil.isAxiosError(error) && error.response?.data.message) {
        alert.error({ text: error.response.data.message })
      } else {
        alert.error({ text: String(error) })
      }
    }
  }

  const updateTermAndConditions = async (content: string, promotionLanguageId: ID) => {
    try {
      const response = await AdminPromotionLanguageAPI.updateTermAndConditions(promotionLanguageId, {
        term_and_conditions: content,
      })
      toast.success(intl.formatMessage({ id: 'promotion.alert.update_promotion_language_term_and_conditions_success' }))

      queryClient.setQueryData<AxiosResponse<ResponsePromotion>>(
        [QUERIES.ADMIN_PROMOTION_DETAIL, promotionId],
        (oldData) => {
          const newPromotionLanguage = response.data.data?.promotion_language
          if (newPromotionLanguage && oldData?.data.data?.promotion) {
            const index = oldData.data.data.promotion.languages!.findIndex((l) => l.id === newPromotionLanguage.id)
            if (index !== -1) {
              oldData.data.data.promotion.languages![index] = newPromotionLanguage
            }
          }
          return oldData
        }
      )
    } catch (error) {
      if (AxiosUtil.isAxiosError(error) && error.response?.data.message) {
        alert.error({ text: error.response.data.message })
      } else {
        alert.error({ text: String(error) })
      }
    }
  }

  if (!promotionId) {
    return <Navigate to="/error/404" />
  }

  if (isFetching && isLoading) {
    return <FloatLoadingIndicator />
  }

  if (isError) {
    return <ErrorCard />
  }

  if (!data) {
    return <Navigate to="/error/404" />
  }

  const AddButton = (
    <Link to={`/admin/promotions/${promotionId}/languages/create`}>
      <Button theme="primary">
        <i className="fa-solid fa-plus" />
        <FormattedMessage id="promotion.button.add_language" />
      </Button>
    </Link>
  )

  const languages = (data.languages ?? []).map<LanguageTab>((content, index) => ({
    id: content.id,
    code: content.language?.code ?? ('-' as LanguageCodeEnum),
    name: content.language?.name ?? '-',
    toolbar: (
      <PermissionsControl allow={[PermissionEnum.ADMIN_ARTICLE_LANGUAGE_DELETE]}>
        <LanguageTabDeleteButton onClick={() => handleRemoveLanguage(content, index)} />
      </PermissionsControl>
    ),
  }))

  const activeLanguage = data.languages?.[activeLanguageIndex]
  const canAddLanguage = languages.length < Object.values(LanguageCodeEnum).length
  const hasLanguages = languages.length > 0

  return (
    <Row>
      <Col xs={8}>
        <PromotionDetailCard
          title={<FormattedMessage id="promotion.card.article_general_title" />}
          whatsappText={data.whatsapp_text}
          toolbar={
            <PermissionsControl allow={[PermissionEnum.ADMIN_PROMOTION_UPDATE]}>
              <Link to={`/admin/promotions/edit/${promotionId}`}>
                <Button
                  variant="icon"
                  size="sm"
                  theme="secondary"
                >
                  <i className="fa-solid fa-pen" />
                </Button>
              </Link>
            </PermissionsControl>
          }
        />

        {hasLanguages ? (
          <Fragment>
            <div className="mb-6">
              <div className="d-flex align-items-center gap-4">
                <LanguageTabSwitcher
                  current={activeLanguage?.language}
                  tabs={languages}
                  onChange={handleLanguageTabChange}
                />

                {canAddLanguage && (
                  <PermissionsControl allow={[PermissionEnum.ADMIN_PROMOTION_LANGUAGE_CREATE]}>
                    <div>{AddButton}</div>
                  </PermissionsControl>
                )}
              </div>
            </div>

            {activeLanguage && (
              <Fragment>
                <PromotionLanguageDetailCard
                  lead={activeLanguage.lead}
                  reference={activeLanguage.reference}
                  slug={activeLanguage.slug}
                  title={activeLanguage.title}
                  toolbar={
                    <PermissionsControl allow={[PermissionEnum.ADMIN_ARTICLE_LANGUAGE_UPDATE]}>
                      <Link to={`/admin/promotions/${promotionId}/languages/edit/${activeLanguage.id}`}>
                        <Button
                          theme="primary"
                          variant="light"
                        >
                          <i className="fa-solid fa-pen me-1" />
                          <FormattedMessage id="article.button.edit" />
                        </Button>
                      </Link>
                    </PermissionsControl>
                  }
                />

                <PromotionLanguageContentEditorCard
                  key={activeLanguage.id}
                  promotionLanguageId={activeLanguage.id}
                  defaultContent={activeLanguage.content}
                  images={activeLanguage.images}
                  readOnly={!canUpdateContent}
                  onChange={(content) => updateContent(content, activeLanguage.id)}
                />

                <PromotionLanguageTermAndConditionEditorCard
                  promotionLanguageId={activeLanguage.id}
                  defaultContent={activeLanguage.term_and_conditions}
                  readOnly={!canUpdateTermAndConditions}
                  onChange={(content) => updateTermAndConditions(content, activeLanguage.id)}
                />
              </Fragment>
            )}
          </Fragment>
        ) : (
          <EmptyContentCard title={<FormattedMessage id="promotion.placeholder.empty_article_language" />}>
            {AddButton}
          </EmptyContentCard>
        )}
      </Col>

      <Col xs={4}>
        <PromotionFeaturedImageCard
          imageSrc={data.image_file?.link}
          toolbar={
            <PermissionsControl allow={[PermissionEnum.ADMIN_PROMOTION_UPDATE]}>
              <Link to={`/admin/promotions/edit/${promotionId}`}>
                <Button
                  variant="icon"
                  size="sm"
                  theme="secondary"
                >
                  <i className="fa-solid fa-pen" />
                </Button>
              </Link>
            </PermissionsControl>
          }
        />

        <PromotionVisibilityCard
          isVisible={data.status === PromotionStatusEnum.PUBLISHED}
          isDisabled={!canPublish}
          onVisibilityChange={handleVisibilityChange}
        />
      </Col>
    </Row>
  )
}

export default PromotionDetailPage
