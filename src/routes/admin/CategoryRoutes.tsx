import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import CategoryCreatePage from '@/pages/admin/category/CategoryCreatePage'
import CategoryDetailPage from '@/pages/admin/category/CategoryDetailPage'
import CategoryListPage from '@/pages/admin/category/CategoryListPage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.articles" />,
    path: '/admin/categories',
  },
  {
    isActive: true,
    isSeparator: true,
    title: '',
    path: '',
  },
]

const CategoryRoutes = () => {
  const intl = useIntl()

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <RoutePermission allow={PagePermission.ADMIN_CATEGORY_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.category.list' })}
                breadcrumbs={breadcrumbs}
              />
              <CategoryListPage />
            </RoutePermission>
          }
        />

        <Route
          path="/create"
          element={
            <RoutePermission allow={PagePermission.ADMIN_CATEGORY_CREATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.category.create' })}
                breadcrumbs={breadcrumbs}
              />
              <CategoryCreatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/:categoryId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_CATEGORY_DETAIL}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.category.create' })}
                breadcrumbs={breadcrumbs}
              />
              <CategoryDetailPage />
            </RoutePermission>
          }
        />

        <Route
          path="/*"
          element={
            <Navigate
              replace={true}
              to="/admin/categories"
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default CategoryRoutes
