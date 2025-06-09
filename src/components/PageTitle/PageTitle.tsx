import { FC, PropsWithChildren } from 'react'

import { PageLink } from '@/interfaces/layout'
import { useLayout } from '@/layouts/core'

import { Breadcrumb } from '../Breadcrumb'
import { Portal } from '../Portal'

type Props = {
  title?: string
  description?: string
  breadcrumbs?: Array<PageLink>
}

const PageTitle: FC<PropsWithChildren<Props>> = ({ title, description, breadcrumbs, children }) => {
  const { config } = useLayout()
  const hasChildred = !!children

  return (
    <Portal to="#page-title">
      {!hasChildred && (title || description) && (
        <h1 className="text-dark fw-medium my-0 fs-2">
          {title ? title : null}
          {description && <span className="text-muted fs-6 fw-normal ms-2">{description}</span>}
        </h1>
      )}

      {!hasChildred && breadcrumbs && breadcrumbs.length > 0 && config.pageTitle && config.pageTitle.breadCrumbs && (
        <Breadcrumb
          links={breadcrumbs}
          currentPage={title}
        />
      )}

      {children}
    </Portal>
  )
}

export { PageTitle }
