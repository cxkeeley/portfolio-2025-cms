import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import AdminArticlesAPI, { PayloadCreateArticle } from '@api/admin/articlesAPI'

import ArticleCreateFormCard, {
  ArticleCreateFormShape,
} from '@modules/article/components/ArticleCreateFormCard/ArticleCreateFormCard'

import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'

type Props = {}

const ArticleCreatePage: FC<Props> = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const intl = useIntl()

  const handleSubmit = async (values: ArticleCreateFormShape) => {
    const payload = FormUtil.parseValues<PayloadCreateArticle>(values)

    const { data } = await AdminArticlesAPI.create(payload)

    if (data.data?.article) {
      toast.success(intl.formatMessage({ id: 'article.alert.create_article_success' }))
      navigate(`/admin/articles/${data.data.article.id}`)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <ArticleCreateFormCard
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}

export default ArticleCreatePage
