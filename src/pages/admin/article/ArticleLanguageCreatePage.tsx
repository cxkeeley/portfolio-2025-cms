import { FC } from 'react'
import { useIntl } from 'react-intl'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import AdminArticleLanguageAPI, { PayloadCreateArticleLanguage } from '@api/admin/articleLanguagesAPI'

import ArticleLanguageFormCard from '@modules/article/components/ArticleCreateLanguageFormCard'
import { ArticleCreateLanguageFormShape } from '@modules/article/components/ArticleCreateLanguageFormCard'

import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'

type Props = {}

const ArticleLanguageCreatePage: FC<Props> = () => {
  const intl = useIntl()
  const toast = useToast()
  const navigate = useNavigate()
  const { articleId } = useParams()

  const handleSubmit = async (values: ArticleCreateLanguageFormShape) => {
    const payload = FormUtil.parseValues<PayloadCreateArticleLanguage>(values)

    const { data } = await AdminArticleLanguageAPI.create({
      ...payload,
      article_id: articleId!,
    })

    if (data) {
      toast.success(intl.formatMessage({ id: 'article.alert.create_language_success' }))
      navigate(`/admin/articles/${articleId}`)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  if (!articleId) {
    return <Navigate to="/error/404" />
  }

  return (
    <ArticleLanguageFormCard
      articleId={articleId}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}

export default ArticleLanguageCreatePage
