import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import MainPageDoctorListPage from '@/pages/admin/main-page-doctor/MainPageDoctorListPage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.main_page" />,
    path: '/admin/main-page-doctors',
  },
  {
    isActive: true,
    isSeparator: true,
    title: '',
    path: '',
  },
]

const MainPageDoctorRoutes = () => {
  const intl = useIntl()

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <RoutePermission allow={PagePermission.ADMIN_MAIN_PAGE_DOCTOR_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.main_page_doctor.list' })}
                breadcrumbs={breadcrumbs}
              />
              <MainPageDoctorListPage />
            </RoutePermission>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              replace
              to="/admin/main-page-doctors"
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default MainPageDoctorRoutes
