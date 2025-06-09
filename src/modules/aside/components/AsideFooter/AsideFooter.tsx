import { AsideUserMenu } from '@components/AsideUserMenu'

import { KTSVG } from '@components/KTSVG'

const AsideFooter = () => {
  return (
    <div
      className="aside-footer d-flex flex-column align-items-center flex-column-auto"
      id="kt_aside_footer"
    >
      {/* begin::User */}
      <div
        className="d-flex align-items-center mb-10"
        id="kt_header_user_menu_toggle"
      >
        {/* begin::Menu wrapper */}
        <div
          className="cursor-pointer"
          data-kt-menu-trigger="click"
          data-kt-menu-overflow="false"
          data-kt-menu-placement="top-start"
          title="User profile"
        >
          <KTSVG
            path="/media/avatars/blank.svg"
            svgClassName="h-45px w-45px"
          />
        </div>
        {/* end::Menu wrapper */}
        <AsideUserMenu />
      </div>
      {/* end::User */}
    </div>
  )
}

export { AsideFooter }
