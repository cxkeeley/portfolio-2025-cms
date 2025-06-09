import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import React from 'react'
import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link, useParams } from 'react-router-dom'

import AdminArticleLanguageAPI from '@api/admin/articleLanguagesAPI'
import AdminArticlesAPI, { ResponseArticle } from '@api/admin/articlesAPI'

import { ID } from '@models/base'
import { LanguageCodeEnum } from '@models/language'

import EmptyContentCard from '@components/EmptyContentCard'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import LanguageTabDeleteButton from '@components/LanguageTabDeleteButton/LanguageTabDeleteButton'
import LanguageTabSwitcher, { LanguageTab } from '@components/LanguageTabSwitcher'

import ArticleContentEditorCard from '@modules/article/components/ArticleContentEditorCard'
import ArticleDetailCard from '@modules/article/components/ArticleDetailCard'
import ArticleFeaturedImageCard from '@modules/article/components/ArticleFeaturedImageCard/ArticleFeaturedImageCard'
import ArticleLanguageDetailCard from '@modules/article/components/ArticleLanguageDetailCard'
import ArticleVisibilityCard from '@modules/article/components/ArticleVisibilityCard'
import { PermissionsControl } from '@modules/permissions'
import { usePermissions } from '@modules/permissions/core/PermissionsProvider'

import { DEFAULT_LANGUAGE } from '@/constants/constant'
import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import TypeUtil from '@/utils/typeUtil'

type Props = {}

const ArticleDetailPage: React.FC<Props> = () => {
  const intl = useIntl()
  const toast = useToast()
  const alert = useAlert()
  const queryClient = useQueryClient()
  const { hasAllPermissions, hasPermissions } = usePermissions()
  const { articleId } = useParams()
  const [activeLanguageIndex, setActiveLanguageIndex] = React.useState<number>(0)

  const canPublish = hasAllPermissions([PermissionEnum.ADMIN_ARTICLE_PUBLISH, PermissionEnum.ADMIN_ARTICLE_UNPUBLISH])
  const canUpdateContent = hasPermissions(PermissionEnum.ADMIN_ARTICLE_LANGUAGE_UPDATE_CONTENT)

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    enabled: TypeUtil.isDefined(articleId),
    queryKey: [QUERIES.ARTICLE_DETAIL, articleId],
    queryFn: () => AdminArticlesAPI.get(articleId!),
    select: (response) => response.data.data?.article,
  })

  const publishArticle = async (id: ID) => {
    try {
      await AdminArticlesAPI.publish(id)
      refetch()
      toast.success(intl.formatMessage({ id: 'article.alert.publish_article_success' }))
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
      await AdminArticlesAPI.unpublish(id)
      refetch()
      toast.success(intl.formatMessage({ id: 'article.alert.unpublish_article_success' }))
    } catch (err) {
      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        alert.error({ text: err.response.data.message })
      } else {
        alert.error({ text: String(err) })
      }
    }
  }

  const deleteArticleLanguage = React.useCallback(
    async (articleLanguageId: ID) => {
      try {
        AdminArticleLanguageAPI.delete(articleLanguageId)
        refetch()
        setActiveLanguageIndex((prev) => (prev > 0 ? prev - 1 : prev))
        toast.success(intl.formatMessage({ id: 'article.alert.delete_article_language_success' }))
      } catch (err) {
        if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
          alert.error({ text: err.response.data.message })
        } else {
          alert.error({ text: String(err) })
        }
      }
    },
    [alert, intl, refetch, toast]
  )

  const updateContent = async (content: string, articleLanguageId: ID) => {
    try {
      const response = await AdminArticleLanguageAPI.setContent(articleLanguageId, content)
      toast.success(intl.formatMessage({ id: 'article.alert.update_article_language_content_success' }))

      queryClient.setQueryData<AxiosResponse<ResponseArticle>>([QUERIES.ARTICLE_DETAIL, articleId], (oldData) => {
        const newArticleLanguage = response.data.data?.article_language
        if (newArticleLanguage && oldData?.data.data?.article) {
          const index = oldData.data.data.article.languages?.findIndex((l) => l.id === newArticleLanguage.id) ?? -1
          if (index !== -1 && oldData.data.data.article.languages) {
            oldData.data.data.article.languages[index] = newArticleLanguage
          }
        }
        return oldData
      })
    } catch (error) {
      if (AxiosUtil.isAxiosError(error) && error.response?.data.message) {
        alert.error({ text: error.response.data.message })
      } else {
        alert.error({ text: String(error) })
      }
    }
  }

  const handleVisibilityChange = (value: boolean) => {
    if (value) {
      publishArticle(articleId!)
    } else {
      unpublishArticle(articleId!)
    }
  }

  const handleRemoveLanguage = React.useCallback(
    async (articleLanguageId: ID, index: number) => {
      const { isConfirmed } = await alert.warning({
        text: intl.formatMessage({ id: 'article.alert.delete_article_language_prompt' }),
        confirmButtonText: intl.formatMessage({ id: 'article.alert.delete_article_language_confirm' }),
      })
      if (isConfirmed) {
        deleteArticleLanguage(articleLanguageId)

        // realign active language index
        if (index <= activeLanguageIndex) {
          setActiveLanguageIndex((prev) => (prev > 0 ? prev - 1 : prev))
        }
      }
    },
    [activeLanguageIndex, alert, deleteArticleLanguage, intl]
  )

  const languages = React.useMemo<Array<LanguageTab>>(() => {
    if (data?.languages) {
      return data.languages
        .filter((language) => TypeUtil.isDefined(language.language))
        .map<LanguageTab>((language, index) => ({
          id: language.language!.id,
          code: language.language!.code,
          name: language.language!.name,
          toolbar: language.language!.code !== DEFAULT_LANGUAGE && (
            <PermissionsControl allow={PermissionEnum.ADMIN_CATEGORY_LANGUAGE_DELETE}>
              <LanguageTabDeleteButton onClick={() => handleRemoveLanguage(language.id, index)} />
            </PermissionsControl>
          ),
        }))
    }
    return []
  }, [data?.languages, handleRemoveLanguage])

  if (data) {
    const activeLanguage = data.languages?.at(activeLanguageIndex)
    const hasLanguages = data.languages && data.languages.length > 0
    const canAddLanguage = hasLanguages && languages.length < Object.values(LanguageCodeEnum).length

    return (
      <Row>
        <Col xs={8}>
          <ArticleDetailCard
            author={data.author_name}
            publisedAt={data.published_at}
            reviewer={data.reviewer}
            category={data.category.default_name!}
            toolbar={
              <PermissionsControl allow={[PermissionEnum.ADMIN_ARTICLE_UPDATE]}>
                <Link
                  to={`/admin/articles/edit/${articleId}`}
                  className="btn btn-light-primary"
                >
                  <i className="fa-solid fa-pen me-1" />
                  <FormattedMessage id="article.button.edit" />
                </Link>
              </PermissionsControl>
            }
          />

          {hasLanguages ? (
            <React.Fragment>
              <div className="mb-6">
                <div className="d-flex align-items-center gap-4">
                  <LanguageTabSwitcher
                    current={activeLanguage?.language}
                    tabs={languages}
                    onChange={(_, index) => setActiveLanguageIndex(index)}
                  />

                  {canAddLanguage && (
                    <PermissionsControl allow={[PermissionEnum.ADMIN_ARTICLE_LANGUAGE_CREATE]}>
                      <div>
                        <Link
                          to={`/admin/articles/${articleId}/languages/create`}
                          className="btn btn-primary"
                        >
                          <i className="fa-solid fa-plus" />
                          {intl.formatMessage({ id: 'article.button.add_language' })}
                        </Link>
                      </div>
                    </PermissionsControl>
                  )}
                </div>
              </div>

              {activeLanguage && (
                <React.Fragment>
                  <ArticleLanguageDetailCard
                    title={activeLanguage.title}
                    slug={activeLanguage.slug}
                    lead={activeLanguage.lead}
                    reference={activeLanguage.reference}
                    imageCaption={activeLanguage.image_caption}
                    toolbar={
                      <PermissionsControl allow={[PermissionEnum.ADMIN_ARTICLE_LANGUAGE_UPDATE]}>
                        <Link
                          to={`/admin/articles/${articleId}/languages/edit/${activeLanguage.id}`}
                          className="btn btn-light-primary"
                        >
                          <i className="fa-solid fa-pen me-1" />
                          <FormattedMessage id="article.button.edit" />
                        </Link>
                      </PermissionsControl>
                    }
                  />

                  <ArticleContentEditorCard
                    key={activeLanguage.id}
                    readOnly={!canUpdateContent}
                    articleLanguageId={activeLanguage.id}
                    defaultContent={activeLanguage.content}
                    images={activeLanguage.images}
                    onChange={(content) => updateContent(content, activeLanguage.id)}
                  />
                </React.Fragment>
              )}
            </React.Fragment>
          ) : (
            <EmptyContentCard title={<FormattedMessage id="article.placeholder.empty_article_language" />}>
              <Link
                to={`/admin/articles/${articleId}/languages/create`}
                className="btn btn-primary"
              >
                <i className="fa-solid fa-plus" />
                <FormattedMessage id="article.button.add_language" />
              </Link>
            </EmptyContentCard>
          )}
        </Col>

        <Col xs={4}>
          <ArticleVisibilityCard
            isVisible={TypeUtil.isDefined(data.published_at)}
            isDisabled={!canPublish}
            onVisibilityChange={handleVisibilityChange}
          />

          <ArticleFeaturedImageCard
            imageSrc={data.image_file ? data.image_file.link : null}
            toolbar={
              <PermissionsControl allow={[PermissionEnum.ADMIN_ARTICLE_UPDATE]}>
                <Link
                  to={`/admin/articles/edit/${articleId}`}
                  className="btn btn-sm btn-icon btn-secondary"
                >
                  <i className="fa-solid fa-pen" />
                </Link>
              </PermissionsControl>
            }
          />
        </Col>
      </Row>
    )
  }

  if (isFetching && isLoading) {
    return <FloatLoadingIndicator />
  }

  if (isError) {
    return <ErrorCard />
  }

  return null
}

export default ArticleDetailPage
