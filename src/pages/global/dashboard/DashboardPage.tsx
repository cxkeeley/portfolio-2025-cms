/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useEffect } from 'react'
import { useIntl } from 'react-intl'

import { PageTitle } from '@components/PageTitle'

import { PageLink } from '@/interfaces/layout'

const dashboardBreadCrumbs: Array<PageLink> = [
  {
    title: 'Home',
    path: '/dashboard',
    isSeparator: false,
    isActive: false,
  },
]

const DashboardPage: FC = () => {
  useEffect(() => {
    // We have to show toolbar only for dashboard page
    document.getElementById('kt_layout_toolbar')?.classList.remove('d-none')
    return () => {
      document.getElementById('kt_layout_toolbar')?.classList.add('d-none')
    }
  }, [])

  return null
}

const DashboardWrapper: FC = () => {
  const intl = useIntl()

  return (
    <>
      <PageTitle
        title={intl.formatMessage({ id: 'menu.default.dashboard' })}
        breadcrumbs={dashboardBreadCrumbs}
      />
      <DashboardPage />
    </>
  )
}

export { DashboardWrapper }
