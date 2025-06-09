import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import AdminArticleLanguageAPI, { PayloadUpdateArticleLanguage } from '@api/admin/articleLanguagesAPI'

import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'

import ArticleUpdateLanguageFormCard, {
  ArticleUpdateLanguageFormShape,
} from '@modules/article/components/ArticleUpdateLanguageFormCard'

import { QUERIES } from '@/constants/queries'
import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

type Props = {}

const ArticleLanguageUpdatePage: FC<Props> = () => {
  const intl = useIntl()
  const toast = useToast()
  const navigate = useNavigate()
  const { articleId, languageId } = useParams()

  const {
    data: article,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    enabled: TypeUtil.isDefined(languageId),
    queryKey: [QUERIES.ARTICLE_LANGUAGE_DETAIL, languageId],
    queryFn: () => AdminArticleLanguageAPI.get(languageId!),
    select: (response) => response.data.data?.article_language,
  })

  const handleSubmit = async (values: ArticleUpdateLanguageFormShape) => {
    const payload = FormUtil.parseValues<PayloadUpdateArticleLanguage>(values)

    const { data } = await AdminArticleLanguageAPI.update(languageId!, payload)

    if (data) {
      toast.success(intl.formatMessage({ id: 'article.alert.update_language_success' }))
      navigate(`/admin/articles/${articleId}`)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  if (!articleId || !languageId) {
    return <Navigate to="/error/404" />
  }

  if (isLoading && isFetching) {
    return <FloatLoadingIndicator />
  }

  if (isError || !article) {
    return <ErrorCard />
  }

  const initialValues: ArticleUpdateLanguageFormShape = {
    image_caption: article.image_caption,
    lead: article.lead,
    reference: article.reference,
    slug: article.slug,
    title: article.title,
  }

  return (
    <ArticleUpdateLanguageFormCard
      articleId={articleId}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}

export default ArticleLanguageUpdatePage
