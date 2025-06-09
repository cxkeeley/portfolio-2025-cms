import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import DoctorCreatePage from '@/pages/admin/doctor/DoctorCreatePage'
import DoctorDetailPage from '@/pages/admin/doctor/DoctorDetailPage'
import DoctorListPage from '@/pages/admin/doctor/DoctorListPage'
import DoctorUpdatePage from '@/pages/admin/doctor/DoctorUpdatePage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.doctors" />,
    path: '/admin/articles',
  },
  {
    isActive: true,
    isSeparator: true,
    title: '',
    path: '',
  },
]

const DoctorRoutes = () => {
  const intl = useIntl()

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <RoutePermission allow={PagePermission.ADMIN_DOCTOR_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.doctor.list' })}
                breadcrumbs={breadcrumbs}
              />
              <DoctorListPage />
            </RoutePermission>
          }
        />

        <Route
          path="/create"
          element={
            <RoutePermission allow={PagePermission.ADMIN_DOCTOR_CREATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.doctor.create' })}
                breadcrumbs={breadcrumbs}
              />
              <DoctorCreatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/edit/:doctorId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_DOCTOR_UPDATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.doctor.edit' })}
                breadcrumbs={breadcrumbs}
              />
              <DoctorUpdatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/:doctorId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_DOCTOR_DETAIL}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.doctor.detail' })}
                breadcrumbs={breadcrumbs}
              />
              <DoctorDetailPage />
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

export default DoctorRoutes
