import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import AdminArticlesAPI, { PayloadUpdateArticle } from '@api/admin/articlesAPI'

import { Option } from '@models/option'

import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'

import ArticleUpdateFormCard from '@modules/article/components/ArticleUpdateFormCard'
import { ArticleUpdateFormShape } from '@modules/article/components/ArticleUpdateFormCard/ArticleUpdateFormCard'

import { QUERIES } from '@/constants/queries'
import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

type Props = {}

const ArticleUpdatePage: FC<Props> = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const intl = useIntl()
  const { articleId } = useParams()

  const {
    data: article,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    enabled: TypeUtil.isDefined(articleId),
    queryKey: [QUERIES.ARTICLE_DETAIL, articleId],
    queryFn: () => AdminArticlesAPI.get(articleId!),
    select: (r) => r.data.data?.article,
  })

  const handleSubmit = async (values: ArticleUpdateFormShape) => {
    const payload = FormUtil.parseValues<PayloadUpdateArticle>(values)

    const { data } = await AdminArticlesAPI.update(articleId!, payload)

    if (data.data?.article) {
      toast.success(intl.formatMessage({ id: 'article.alert.update_article_success' }))
      navigate(`/admin/articles/${data.data.article.id}`)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  if (!articleId) {
    return <Navigate to="/error/404" />
  }

  if (isLoading && isFetching) {
    return <FloatLoadingIndicator />
  }

  if (isError || !article) {
    return <ErrorCard />
  }

  const initialValues: ArticleUpdateFormShape = {
    author_name: article.author_name,
    image_file_path: null,
    category_id: Option.fromObject(article.category, 'id', 'default_name'),
    reviewer: article.reviewer,
  }

  return (
    <ArticleUpdateFormCard
      initialValues={initialValues}
      initialImageSrc={article.image_file?.link}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}

export default ArticleUpdatePage
