import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { SuspensedView } from '@components/SuspensedView'

import { MasterLayout } from '@/layouts/MasterLayout'

const BannerRoutes = lazy(() => import('./admin/BannerRoutes'))
const ArticleRoutes = lazy(() => import('./admin/ArticleRoutes'))
const CategoryRoutes = lazy(() => import('./admin/CategoryRoutes'))
const DoctorRoutes = lazy(() => import('./admin/DoctorRoutes'))
const LocationRoutes = lazy(() => import('./admin/LocationRoutes'))
const MainPageVideoRoutes = lazy(() => import('./admin/MainPageVideoRoutes'))
const LocationServiceRoutes = lazy(() => import('./admin/LocationServiceRoutes'))
const LocationGroupRoutes = lazy(() => import('./admin/LocationGroupRoutes'))
const LocationLabelRoutes = lazy(() => import('./admin/LocationLabelRoutes'))
const MainPageDoctorRoutes = lazy(() => import('./admin/MainPageDoctorRoutes'))
const OurDoctorPageDoctorRoutes = lazy(() => import('./admin/OurDoctorPageDoctorRoutes'))
const PromotionRoutes = lazy(() => import('./admin/PromotionRoutes'))
const MainPageLocationGroupRoutes = lazy(() => import('./admin/MainPageLocationGroupRoutes'))

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route
          path="articles/*"
          element={
            <SuspensedView>
              <ArticleRoutes />
            </SuspensedView>
          }
        />

        <Route
          path="categories/*"
          element={
            <SuspensedView>
              <CategoryRoutes />
            </SuspensedView>
          }
        />

        <Route
          path="doctors/*"
          element={
            <SuspensedView>
              <DoctorRoutes />
            </SuspensedView>
          }
        />

        <Route
          path="locations/*"
          element={
            <SuspensedView>
              <LocationRoutes />
            </SuspensedView>
          }
        />

        <Route
          path="main-page-videos/*"
          element={
            <SuspensedView>
              <MainPageVideoRoutes />
            </SuspensedView>
          }
        />

        <Route
          path="location-services/*"
          element={
            <SuspensedView>
              <LocationServiceRoutes />
            </SuspensedView>
          }
        />

        <Route
          path="location-groups/*"
          element={
            <SuspensedView>
              <LocationGroupRoutes />
            </SuspensedView>
          }
        />

        <Route
          path="location-labels/*"
          element={
            <SuspensedView>
              <LocationLabelRoutes />
            </SuspensedView>
          }
        />

        <Route
          path="main-page-doctors/*"
          element={
            <SuspensedView>
              <MainPageDoctorRoutes />
            </SuspensedView>
          }
        />

        <Route
          path="our-doctor-page-doctors/*"
          element={
            <SuspensedView>
              <OurDoctorPageDoctorRoutes />
            </SuspensedView>
          }
        />

        <Route
          path="banners/*"
          element={
            <SuspensedView>
              <BannerRoutes />
            </SuspensedView>
          }
        />

        <Route
          path="promotions/*"
          element={
            <SuspensedView>
              <PromotionRoutes />
            </SuspensedView>
          }
        />

        <Route
          path="main-page-location-groups/*"
          element={
            <SuspensedView>
              <MainPageLocationGroupRoutes />
            </SuspensedView>
          }
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/error/404" />}
      />
    </Routes>
  )
}

export { AdminRoutes }
