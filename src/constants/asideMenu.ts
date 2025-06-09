import { extractPaths } from '@modules/aside/helpers'
import { AsideMenu, AsideTab, AsideTabTypeEnum } from '@modules/aside/model'

import { PagePermission } from './pagePermission'

export const AsideDefaultMenus: ReadonlyArray<AsideMenu> = [
  {
    to: '/dashboard',
    fontIcon: 'fa-solid fa-gauge',
    intlMessage: 'menu.default.dashboard',
  },
  {
    to: '/admin/doctors',
    fontIcon: 'fa-solid fa-user-doctor',
    intlMessage: 'menu.default.doctors',
    permissions: PagePermission.ADMIN_DOCTOR_LIST,
  },
  {
    to: '',
    fontIcon: 'fa-solid fa-location-dot',
    intlMessage: 'menu.default.location',
    children: [
      {
        hasBullet: true,
        to: '/admin/location-services',
        intlMessage: 'menu.default.location_services',
        permissions: PagePermission.ADMIN_LOCATION_SERVICE_LIST,
      },
      {
        hasBullet: true,
        to: '/admin/location-labels',
        intlMessage: 'menu.default.location_label',
        permissions: PagePermission.ADMIN_LOCATION_LABEL_LIST,
      },
      {
        hasBullet: true,
        to: '/admin/location-groups',
        intlMessage: 'menu.default.location_group',
        permissions: PagePermission.ADMIN_LOCATION_GROUP_LIST,
      },
      {
        hasBullet: true,
        to: '/admin/locations',
        intlMessage: 'menu.default.location',
        permissions: PagePermission.ADMIN_LOCATION_LIST,
      },
    ],
  },
  {
    to: '',
    fontIcon: 'fa-solid fa-newspaper',
    intlMessage: 'menu.default.articles',
    children: [
      {
        hasBullet: true,
        to: '/admin/categories',
        intlMessage: 'menu.default.article_categories',
        permissions: PagePermission.ADMIN_CATEGORY_LIST,
      },
      {
        hasBullet: true,
        to: '/admin/articles',
        intlMessage: 'menu.default.articles',
        permissions: PagePermission.ADMIN_ARTICLE_LIST,
      },
    ],
  },
  {
    to: '',
    fontIcon: 'fa-solid fa-newspaper',
    intlMessage: 'menu.default.main_page',
    children: [
      {
        hasBullet: true,
        to: '/admin/main-page-videos',
        intlMessage: 'menu.default.main_page_videos',
        permissions: PagePermission.ADMIN_MAIN_PAGE_VIDEO_LIST,
      },
      {
        hasBullet: true,
        to: '/admin/main-page-doctors',
        intlMessage: 'menu.default.main_page_doctors',
        permissions: PagePermission.ADMIN_MAIN_PAGE_DOCTOR_LIST,
      },
      {
        hasBullet: true,
        to: '/admin/main-page-location-groups',
        intlMessage: 'menu.default.main_page_location_groups',
        permissions: PagePermission.ADMIN_MAIN_PAGE_LOCATION_GROUP_LIST,
      },
    ],
  },
  {
    to: '',
    fontIcon: 'fa-solid fa-newspaper',
    intlMessage: 'menu.default.our_doctor_page',
    children: [
      {
        hasBullet: true,
        to: '/admin/our-doctor-page-doctors',
        intlMessage: 'menu.default.our_doctor_page_doctors',
        permissions: PagePermission.ADMIN_OUR_DOCTOR_PAGE_DOCTOR_LIST,
      },
    ],
  },
  {
    to: '/admin/banners',
    fontIcon: 'fa-solid fa-image',
    intlMessage: 'menu.default.banners',
    permissions: PagePermission.ADMIN_DOCTOR_LIST,
  },
  {
    to: '/admin/promotions',
    fontIcon: 'fa-solid fa-newspaper',
    intlMessage: 'menu.default.promotions',
    permissions: PagePermission.ADMIN_PROMOTION_LIST,
  },
]

export const AsideTabsList: Array<AsideTab> = [
  {
    type: AsideTabTypeEnum.DEFAULT,
    icon: 'fa-solid fa-house',
    intlMessage: 'menu.default',
    includedPaths: extractPaths(AsideDefaultMenus),
    children: AsideDefaultMenus,
  },
]
