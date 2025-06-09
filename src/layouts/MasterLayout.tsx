import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { ContentContainer } from '@components/ContentContainer'
import { Footer } from '@components/Footer'
import { Header } from '@components/Header'
import { ScrollToTop } from '@components/ScrollToTop'

import { Aside } from '@modules/aside/components/Aside'
import { ThemeProvider } from '@modules/theme/core/ThemeProvider'

import { MenuComponent } from '@/assets/ts/components'

const MasterLayout = () => {
  const location = useLocation()

  useEffect(() => {
    const timeout = setTimeout(() => {
      MenuComponent.reinitialization()
    }, 500)

    return () => clearTimeout(timeout)
  }, [location.key])

  return (
    <ThemeProvider>
      <div className="d-flex flex-column flex-root">
        {/* begin::Page */}
        <div className="page d-flex flex-row flex-column-fluid">
          {/* begin::Aside */}
          <Aside />
          {/* end::Aside */}

          {/* begin::Wrapper */}
          <div
            className="wrapper d-flex flex-column flex-row-fluid"
            id="kt_wrapper"
          >
            {/* begin::Header */}
            <Header />
            {/* end::Header */}

            {/* begin::Content */}
            <div
              id="kt_content"
              className="content d-flex flex-column flex-column-fluid"
            >
              <ContentContainer>
                <Outlet />
              </ContentContainer>
            </div>
            {/* end::Content */}

            {/* begin::Footer */}
            <Footer />
            {/* end::Footer */}
          </div>
          {/* end::Wrapper */}
        </div>
        {/* end::Page */}
      </div>

      {/* begin::Scroll Top */}
      <ScrollToTop />
      {/* end::Scroll Top */}
    </ThemeProvider>
  )
}

export { MasterLayout }
