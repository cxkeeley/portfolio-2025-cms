import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import ArticleCreatePage from '@/pages/admin/article/ArticleCreatePage'
import ArticleDetailPage from '@/pages/admin/article/ArticleDetailPage'
import ArticleLanguageCreatePage from '@/pages/admin/article/ArticleLanguageCreatePage'
import ArticleLanguageUpdatePage from '@/pages/admin/article/ArticleLanguageUpdatePage'
import ArticleListPage from '@/pages/admin/article/ArticleListPage'
import ArticleUpdatePage from '@/pages/admin/article/ArticleUpdatePage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.articles" />,
    path: '/admin/articles',
  },
  {
    isActive: true,
    isSeparator: true,
    title: '',
    path: '',
  },
]

const ArticleRoutes = () => {
  const intl = useIntl()

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <RoutePermission allow={PagePermission.ADMIN_ARTICLE_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.article.list' })}
                breadcrumbs={breadcrumbs}
              />
              <ArticleListPage />
            </RoutePermission>
          }
        />

        <Route
          path="/create"
          element={
            <RoutePermission allow={PagePermission.ADMIN_ARTICLE_CREATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.article.create' })}
                breadcrumbs={breadcrumbs}
              />
              <ArticleCreatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/edit/:articleId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_ARTICLE_UPDATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.article.edit' })}
                breadcrumbs={breadcrumbs}
              />
              <ArticleUpdatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/:articleId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_ARTICLE_DETAIL}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.article.detail' })}
                breadcrumbs={breadcrumbs}
              />
              <ArticleDetailPage />
            </RoutePermission>
          }
        />

        <Route
          path="/:articleId/languages/create"
          element={
            <RoutePermission allow={PagePermission.ADMIN_ARTICLE_LANGUAGE_CREATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.article_language.create' })}
                breadcrumbs={breadcrumbs}
              />
              <ArticleLanguageCreatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/:articleId/languages/edit/:languageId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_ARTICLE_LANGUAGE_UPDATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.article_language.edit' })}
                breadcrumbs={breadcrumbs}
              />
              <ArticleLanguageUpdatePage />
            </RoutePermission>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              replace
              to="/admin/articles"
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default ArticleRoutes
