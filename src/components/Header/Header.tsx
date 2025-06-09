import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { KTSVG } from '@components/KTSVG'

import { useLayout } from '@/layouts/core'
import PathUtil from '@/utils/pathUtil'

import { HeaderToolbar } from '../HeaderToolbar'

const Header = () => {
  const { config, classes, attributes } = useLayout()
  const { header } = config
  const [offset, setOffset] = useState<string>(`{default: '200px', lg: '300px'}`)

  useEffect(() => {
    let newString = `{default: '200px', lg: '300px'}`
    if (header.fixed.desktop) {
      if (!header.fixed.tabletAndMobile) {
        newString = `{lg: '300px'}`
      }
    } else {
      newString = `{default: '200px', lg: false}`
    }

    setOffset(newString)
  }, [header.fixed])

  return (
    <div
      id="kt_header"
      className={clsx('header', classes.header.join(' '))}
      {...attributes.headerMenu}
      data-kt-sticky="true"
      data-kt-sticky-name="header"
      data-kt-sticky-offset={offset}
    >
      {/* begin::Container */}
      <div
        className={clsx(classes.headerContainer.join(' '), 'd-flex align-items-center justify-content-between')}
        id="kt_header_container"
      >
        <div
          id="page-title"
          data-kt-swapper="false"
          data-kt-swapper-mode="prepend"
          data-kt-swapper-parent="{default: '#kt_content_container', lg: '#kt_header_container'}"
          className={clsx(
            'page-title d-flex flex-column align-items-start justify-content-center flex-wrap mt-n5 mt-lg-0 me-lg-2 pb-2 pb-lg-0',
            classes.pageTitle.join(' ')
          )}
        ></div>

        {/* begin::Wrapper */}
        <div className={'d-flex d-lg-none align-items-center ms-n2 me-2'}>
          {/* begin::Aside mobile toggle */}
          <div
            className="btn btn-icon btn-active-icon-primary"
            id="kt_aside_toggle"
          >
            <KTSVG
              path="/media/icons/duotune/abstract/abs015.svg"
              className="svg-icon-1"
            />
          </div>

          {/* begin::Logo */}
          <Link
            to="/dashboard"
            className="d-flex align-items-center"
          >
            <img
              alt="Logo"
              src={PathUtil.toAbsoluteURL('/media/logos/logo.svg')}
              className="w-50px h-auto"
            />
          </Link>
          {/* end::Logo */}
        </div>
        {/* end::Wrapper */}

        <HeaderToolbar />
      </div>
      {/* end::Container */}
    </div>
  )
}

export { Header }
