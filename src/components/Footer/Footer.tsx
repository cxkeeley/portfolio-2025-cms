import clsx from 'clsx'
import { FC } from 'react'

import { useLayout } from '../../layouts/core'

const Footer: FC = () => {
  const { classes } = useLayout()

  return (
    <div
      className={'footer py-4 d-flex flex-lg-column'}
      id="kt_footer"
    >
      {/*begin::Container*/}
      <div className={clsx(classes.footerContainer, 'd-flex flex-column flex-md-row flex-stack')}>
        {/*begin::Copyright*/}
        {/* <div className="text-dark order-2 order-md-1">
          <span className="text-gray-400 fw-medium me-1">
            {intl.formatMessage({ id: 'copyright' })}
          </span>
          <a
            href="https://www.kupuhealth.id/"
            target="_blank"
            className="text-muted text-hover-primary fw-medium me-2 fs-6"
          >
            KUPU Healthcare
          </a>
        </div> */}
        {/*end::Copyright*/}

        {/*begin::Menu*/}
        {/*end::Menu*/}
      </div>
      {/*end::Container*/}
    </div>
  )
}

export { Footer }
