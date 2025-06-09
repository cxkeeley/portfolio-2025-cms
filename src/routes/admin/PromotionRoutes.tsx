import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import PromotionListPage from '@/pages/admin/promotion/PromotionListPage'
import PromotionCreatePage from '@/pages/admin/promotion/PromotionCreatePage'
import PromotionDetailPage from '@/pages/admin/promotion/PromotionDetailPage'
import PromotionLanguageCreatePage from '@/pages/admin/promotion/PromotionLanguageCreatePage'
import PromotionLanguageUpdatePage from '@/pages/admin/promotion/PromotionLanguageUpdatePage'
import PromotionUpdatePage from '@/pages/admin/promotion/PromotionUpdatePage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.promotions" />,
    path: '/admin/promotions',
  },
  {
    isActive: true,
    isSeparator: true,
    title: '',
    path: '',
  },
]

const PromotionRoutes = () => {
  const intl = useIntl()

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <RoutePermission allow={PagePermission.ADMIN_PROMOTION_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.promotion.list' })}
                breadcrumbs={breadcrumbs}
              />
              <PromotionListPage />
            </RoutePermission>
          }
        />

        <Route
          path="/create"
          element={
            <RoutePermission allow={PagePermission.ADMIN_PROMOTION_CREATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.promotion.create' })}
                breadcrumbs={breadcrumbs}
              />
              <PromotionCreatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/:promotionId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_PROMOTION_DETAIL}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.promotion.detail' })}
                breadcrumbs={breadcrumbs}
              />
              <PromotionDetailPage />
            </RoutePermission>
          }
        />

        <Route
          path="/edit/:promotionId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_PROMOTION_UPDATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.promotion.edit' })}
                breadcrumbs={breadcrumbs}
              />
              <PromotionUpdatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/:promotionId/languages/create"
          element={
            <RoutePermission allow={PagePermission.ADMIN_PROMOTION_LANGUAGE_CREATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.promotion_language.create' })}
                breadcrumbs={breadcrumbs}
              />
              <PromotionLanguageCreatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/:promotionId/languages/edit/:languageId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_PROMOTION_LANGUAGE_UPDATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.promotion_language.edit' })}
                breadcrumbs={breadcrumbs}
              />
              <PromotionLanguageUpdatePage />
            </RoutePermission>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              replace
              to="/admin/promotions"
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default PromotionRoutes
