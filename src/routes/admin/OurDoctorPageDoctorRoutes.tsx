import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import OurDoctorPageDoctorListPage from '@/pages/admin/our-doctor-page-doctor/OurDoctorPageDoctorListPage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.our_doctor_page" />,
    path: '/admin/main-page-doctors',
  },
  {
    isActive: true,
    isSeparator: true,
    title: '',
    path: '',
  },
]

const OurDoctorPageDoctorRoutes = () => {
  const intl = useIntl()

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <RoutePermission allow={PagePermission.ADMIN_OUR_DOCTOR_PAGE_DOCTOR_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.our_doctor_page_doctor.list' })}
                breadcrumbs={breadcrumbs}
              />
              <OurDoctorPageDoctorListPage />
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

export default OurDoctorPageDoctorRoutes
