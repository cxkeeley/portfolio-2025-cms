import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { SuspensedView } from '@components/SuspensedView'

import { MasterLayout } from '@/layouts/MasterLayout'

const BannerRoutes = lazy(() => import('./admin/BannerRoutes'))
const ArticleRoutes = lazy(() => import('./admin/ArticleRoutes'))
const CategoryRoutes = lazy(() => import('./admin/CategoryRoutes'))
const TeamRoutes = lazy(() => import('./admin/TeamRoutes'))
const ProjectRoutes = lazy(() => import('./admin/ProjectRoutes'))
const MainPageVideoRoutes = lazy(() => import('./admin/MainPageVideoRoutes'))
const ProjectServiceRoutes = lazy(() => import('./admin/ProjectServiceRoutes'))
const ProjectGroupRoutes = lazy(() => import('./admin/ProjectGroupRoutes'))
const ProjectLabelRoutes = lazy(() => import('./admin/ProjectLabelRoutes'))
const MainPageTeamRoutes = lazy(() => import('./admin/MainPageTeamRoutes'))
const OurTeamPageTeamRoutes = lazy(() => import('./admin/OurTeamPageTeamRoutes'))
const PromotionRoutes = lazy(() => import('./admin/PromotionRoutes'))
const MainPageProjectGroupRoutes = lazy(() => import('./admin/MainPageProjectGroupRoutes'))

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
          path="teams/*"
          element={
            <SuspensedView>
              <TeamRoutes />
            </SuspensedView>
          }
        />

        <Route
          path="projects/*"
          element={
            <SuspensedView>
              <ProjectRoutes />
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
          path="project-services/*"
          element={
            <SuspensedView>
              <ProjectServiceRoutes />
            </SuspensedView>
          }
        />

        <Route
          path="project-groups/*"
          element={
            <SuspensedView>
              <ProjectGroupRoutes />
            </SuspensedView>
          }
        />

        <Route
          path="project-labels/*"
          element={
            <SuspensedView>
              <ProjectLabelRoutes />
            </SuspensedView>
          }
        />

        <Route
          path="main-page-teams/*"
          element={
            <SuspensedView>
              <MainPageTeamRoutes />
            </SuspensedView>
          }
        />

        <Route
          path="our-team-page-teams/*"
          element={
            <SuspensedView>
              <OurTeamPageTeamRoutes />
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
          path="main-page-project-groups/*"
          element={
            <SuspensedView>
              <MainPageProjectGroupRoutes />
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
