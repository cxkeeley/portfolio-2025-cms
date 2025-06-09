import { useMutation, useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { FC, useCallback, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import AdminArticlesAPI from '@api/admin/articlesAPI'

import { ArticleModel } from '@models/article'
import { ID } from '@models/base'

import { Button } from '@components/Button'
import ErrorCard from '@components/ErrorCard/ErrorCard'
import { KTCard } from '@components/KTCard'
import Pagination from '@components/Pagination'
import { SearchBar } from '@components/SearchBar'
import { Table } from '@components/Table'

import { ArticleAuthorColumn } from '@modules/article/components/ArticleAuthorCell'
import { ArticleImageColumn } from '@modules/article/components/ArticleImageCell'
import { ArticleTitleColumn } from '@modules/article/components/ArticleTitleCell/ArticleTitleCell'
import { ArticleUpdatedAtColumn } from '@modules/article/components/ArticleUpdatedAtCell'
import articleColumnHelper from '@modules/article/utils/articleColumnHelper'
import { PermissionsControl } from '@modules/permissions'

import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useRequestState, useToast } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'

type Props = {}

const ArticleListPage: FC<Props> = () => {
  const intl = useIntl()
  const alert = useAlert()
  const toast = useToast()
  const { query, page, phrase, setPhrase, setPage } = useRequestState<ArticleModel>()

  const { data, isFetching, isLoading, refetch, error } = useQuery({
    queryKey: [QUERIES.ARTICLE_LIST, query],
    queryFn: () => AdminArticlesAPI.filter(query),
    select: (r) => r.data.data,
    keepPreviousData: true,
  })

  const { mutate: deleteArticle, isLoading: isDeletingArticle } = useMutation({
    mutationFn: (articleId: ID) => AdminArticlesAPI.delete(articleId),
    onSuccess: () => {
      refetch()
      toast.success(intl.formatMessage({ id: 'article.alert.delete_article_success' }))
    },
    onError: (err) => {
      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        alert.error({ text: err.response.data.message })
      } else {
        alert.error({ text: String(err) })
      }
    },
  })

  const handleDelete = useCallback(
    async (article: ArticleModel) => {
      const { isConfirmed } = await alert.warning({
        text: intl.formatMessage({ id: 'article.alert.delete_article_prompt' }),
        confirmButtonText: intl.formatMessage({ id: 'article.alert.delete_article_confirm' }),
      })

      if (isConfirmed) {
        deleteArticle(article.id)
      }
    },
    [alert, deleteArticle, intl]
  )

  const columns: ColumnDef<ArticleModel, string>[] = useMemo(
    () => [
      ArticleImageColumn,
      ArticleTitleColumn,
      ArticleAuthorColumn,
      ArticleUpdatedAtColumn,
      articleColumnHelper.display({
        id: 'action',
        size: 75,
        header: () => (
          <div className="text-end">
            <FormattedMessage id="table.action" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="d-flex justify-content-end gap-3">
            <PermissionsControl allow={PermissionEnum.ADMIN_ARTICLE_SHOW}>
              <Link
                className="btn btn-secondary btn-icon"
                to={`/admin/articles/${row.original.id}`}
              >
                <i className="fa-solid fa-eye" />
              </Link>
            </PermissionsControl>

            <PermissionsControl allow={PermissionEnum.ADMIN_ARTICLE_DELETE}>
              <Button
                variant="icon"
                theme="secondary"
                onClick={() => handleDelete(row.original)}
                isLoading={isDeletingArticle}
              >
                <i className="fa-solid fa-trash" />
              </Button>
            </PermissionsControl>
          </div>
        ),
      }),
    ],
    [handleDelete, isDeletingArticle]
  )

  if (isLoading) {
    return null
  }

  if (error || !data) {
    return <ErrorCard />
  }

  return (
    <KTCard flush>
      <KTCard.Header>
        <SearchBar
          initialValue={phrase}
          onChange={setPhrase}
          placeholder={intl.formatMessage({ id: 'article.placeholder.search' })}
        />

        <KTCard.Toolbar>
          <PermissionsControl allow={PermissionEnum.ADMIN_ARTICLE_CREATE}>
            <Link
              className="btn btn-primary"
              to="/admin/articles/create"
            >
              <i className="fa-solid fa-plus" />
              <FormattedMessage id="article.button.add_article" />
            </Link>
          </PermissionsControl>
        </KTCard.Toolbar>
      </KTCard.Header>

      <KTCard.Body className="p-0 pb-6">
        <Table
          columns={columns}
          isLoading={isFetching}
          data={data.nodes}
        />

        {data.total > 0 && (
          <div className="d-flex justify-content-end px-10">
            <Pagination
              current={page}
              pageSize={data.limit}
              total={data.total}
              onChange={setPage}
            />
          </div>
        )}
      </KTCard.Body>
    </KTCard>
  )
}

export default ArticleListPage
