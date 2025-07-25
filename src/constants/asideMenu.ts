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
    to: '/admin/teams',
    fontIcon: 'fa-solid fa-user',
    intlMessage: 'menu.default.teams',
    permissions: PagePermission.ADMIN_TEAM_LIST,
  },
  {
    to: '',
    fontIcon: 'fa-solid fa-list-check',
    intlMessage: 'menu.default.project',
    children: [
      {
        hasBullet: true,
        to: '/admin/project-services',
        intlMessage: 'menu.default.project_services',
        permissions: PagePermission.ADMIN_PROJECT_SERVICE_LIST,
      },
      {
        hasBullet: true,
        to: '/admin/project-labels',
        intlMessage: 'menu.default.project_label',
        permissions: PagePermission.ADMIN_PROJECT_LABEL_LIST,
      },
      {
        hasBullet: true,
        to: '/admin/project-groups',
        intlMessage: 'menu.default.project_group',
        permissions: PagePermission.ADMIN_PROJECT_GROUP_LIST,
      },
      {
        hasBullet: true,
        to: '/admin/projects',
        intlMessage: 'menu.default.project',
        permissions: PagePermission.ADMIN_PROJECT_LIST,
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
        to: '/admin/main-page-teams',
        intlMessage: 'menu.default.main_page_teams',
        permissions: PagePermission.ADMIN_MAIN_PAGE_TEAM_LIST,
      },
      {
        hasBullet: true,
        to: '/admin/main-page-project-groups',
        intlMessage: 'menu.default.main_page_project_groups',
        permissions: PagePermission.ADMIN_MAIN_PAGE_PROJECT_GROUP_LIST,
      },
    ],
  },
  {
    to: '',
    fontIcon: 'fa-solid fa-newspaper',
    intlMessage: 'menu.default.our_team_page',
    children: [
      {
        hasBullet: true,
        to: '/admin/our-team-page-teams',
        intlMessage: 'menu.default.our_team_page_teams',
        permissions: PagePermission.ADMIN_OUR_TEAM_PAGE_TEAM_LIST,
      },
    ],
  },
  {
    to: '/admin/banners',
    fontIcon: 'fa-solid fa-image',
    intlMessage: 'menu.default.banners',
    permissions: PagePermission.ADMIN_TEAM_LIST,
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
