import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import MainPageVideoCreatePage from '@/pages/admin/main-page-video/MainPageVideoCreatePage'
import MainPageVideoDetailPage from '@/pages/admin/main-page-video/MainPageVideoDetailPage'
import MainPageVideoListPage from '@/pages/admin/main-page-video/MainPageVideoListPage'
import MainPageVideoUpdatePage from '@/pages/admin/main-page-video/MainPageVideoUpdatePage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.main_page" />,
    path: '/admin/main-page-videos',
  },
  {
    isActive: true,
    isSeparator: true,
    title: '',
    path: '',
  },
]

const MainPageVideoRoutes = () => {
  const intl = useIntl()

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <RoutePermission allow={PagePermission.ADMIN_MAIN_PAGE_VIDEO_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.main_page_video.list' })}
                breadcrumbs={breadcrumbs}
              />
              <MainPageVideoListPage />
            </RoutePermission>
          }
        />

        <Route
          path="/create"
          element={
            <RoutePermission allow={PagePermission.ADMIN_MAIN_PAGE_VIDEO_CREATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.main_page_video.create' })}
                breadcrumbs={breadcrumbs}
              />
              <MainPageVideoCreatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/:mainPageVideoId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_MAIN_PAGE_VIDEO_DETAIL}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.main_page_video.detail' })}
                breadcrumbs={breadcrumbs}
              />
              <MainPageVideoDetailPage />
            </RoutePermission>
          }
        />

        <Route
          path="/edit/:mainPageVideoId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_MAIN_PAGE_VIDEO_UPDATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.main_page_video.update' })}
                breadcrumbs={breadcrumbs}
              />
              <MainPageVideoUpdatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/*"
          element={
            <Navigate
              replace={true}
              to="/admin/main-page-videos"
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default MainPageVideoRoutes
