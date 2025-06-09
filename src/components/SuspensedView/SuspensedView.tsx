import { FC, Suspense } from 'react'
import { PropsWithChildren } from 'react'
import TopBarProgress from 'react-topbar-progress-indicator'

import { getCSSVariableValue } from '@/assets/ts/_utils'

const SuspensedView: FC<PropsWithChildren<{}>> = ({ children }) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export { SuspensedView }
