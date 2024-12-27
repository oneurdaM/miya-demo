import {Routes} from '@/config/routes'
// import {adminAndOwnerOnly} from '@/utils/auth-utils'

export const siteSettings = {
  name: 'Miyaa',
  description: 'Dashboard',
  logo: {
    url: '/images/logo.png',
    alt: 'Miyaa',
    href: '/',
    width: 128,
    height: 60,
  },
  collapseLogo: {
    url: '/images/logo.png',
    alt: 'T',
    href: '/',
    width: 32,
    height: 32,
  },
  defaultLanguage: 'en',
  author: {
    name: 'Roger Torres',
    websiteUrl: 'https://sissadigital.com',
    address: '',
  },
  headerLinks: [],
  authorizedLinks: [
    {
      href: Routes.profileUpdate,
      labelTransKey: 'Perfil',
      icon: 'UserIcon',
    },
    {
      href: Routes.settings,
      labelTransKey: 'authorized-nav-item-settings',
      icon: 'SettingsIcon',
    },
    {
      href: Routes.logout,
      icon: 'LogOutIcon',
      labelTransKey: 'Salir',
    }
  ],
  currencyCode: 'USD',
  sidebarLinks: {
    admin: {
      root: {
        href: Routes.dashboard,
        label: 'Main',
        icon: 'DashboardIcon',
        childMenu: [
          {
            href: Routes.dashboard,
            label: 'sidebar-nav-item-dashboard',
            icon: 'DashboardIcon',
          },

        ]
      },
      alerts: {
        href: '',
        label: 'sidebar-nav-item-alerts',
        icon: 'InformationIcon',
        childMenu: [
          {
            href: Routes.alerts.list,
            label: 'sidebar-nav-item-alerts-list',
            icon: 'InformationIcon',
          },
        ]

      },

      environments: {
        href: '',
        label: 'sidebar-nav-item-enviroment',
        icon: 'MyShopOwnerIcon',
        childMenu: [
          {
            href: Routes.environments.list,
            label: 'sidebar-nav-item-enviroment',
            icon: 'MyShopOwnerIcon',
          },
        ]

      },
      conferences: {
        href: '',
        label: 'sidebar-nav-item-conferences',
        icon: 'CameraIcon',
        childMenu: [
          {
            href: Routes.conferences.list,
            label: 'sidebar-nav-item-conferences-list',
            icon: 'CameraIcon',
          },
        ]

      },
      conversations: {
        href: '',
        label: 'sidebar-nav-item-messages',
        icon: 'ChatIcon',
        childMenu: [
          {
            href: Routes.conversations.list,
            label: 'sidebar-nav-item-chat',
            icon: 'ChatIcon',
          },
          {
            href: Routes.storeNotice.list,
            label: 'sidebar-nav-item-store-notice',
            icon: 'StoreNoticeIcon',
          },
        ]
      },
      user: {
        href: '',
        label: 'text-user-control',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: '',
            label: 'sidebar-nav-item-users',
            icon: 'UsersIcon',
            childMenu: [
              {
                href: Routes.users.list,
                label: 'text-users-list',
                icon: 'UsersIcon',
              },
              {
                href: Routes.adminList,
                label: 'text-admin-list',
                icon: 'AdminListIcon',
              },
              {
                href: Routes.attendances.list,
                label: 'text-attendances',
                icon: 'MyShopIcon',
              },
            ],
          },
          {
            href: '',
            label: 'Roles',
            icon: 'TypesIcon',
            childMenu: [

              {
                href: Routes.roles.list,
                label: 'Posicion de trabajo',
                icon: 'TypesIcon',

              },
              {
                href: Routes.documents.list,
                label: 'Documentos',
                icon: 'TypesIcon',

              },
            ]
          },
          {
            href: Routes.documentsType.list,
            label: 'Tipo Documentos',
            icon: 'QuoteIcon',
          },
          {
            href: Routes.Rondines.list,
            label: 'text-Round',
            icon: 'WithdrawIcon',
          },
          {
            href: Routes.sectores.list,
            label: 'text-Sectors',
            icon: 'MaintenanceIcon',
          },
          {
            href: Routes.suggestions.list,
            label: 'text-suggestions',
            icon: 'TermsIcon',
          },
          {
            href: Routes.shifts.list,
            label: 'sidebar-text-shifts',
            icon: 'ManufacturersIcon',
          },
          {
            href: Routes.track,
            label: 'text-track-users',
            icon: 'PinMap',
          },
        ],
      },
      blog: {
        href: '',
        label: 'sidebar-nav-item-blog',
        icon: 'InventoryIcon',
        childMenu: [
          {
            href: Routes.blog.list,
            label: 'sidebar-nav-item-articles',
            icon: 'FlashDealsIcon',
          },
          {
            href: Routes.categories.list,
            label: 'sidebar-nav-item-categories-articles',
            icon: 'InventoryIcon',
          }
        ]
      },

      settings: {
        href: '',
        label: 'sidebar-nav-item-settings',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: Routes.settings,
            label: 'sidebar-nav-item-settings-general',
            icon: 'SettingsIcon',
          },
          {
            href: Routes.terms.list,
            label: 'sidebar-nav-item-settings-terms-conditions',
            icon: 'TermsIcon',
          },


        ]

      }
    },
  },
  avatar: {
    placeholder: '/avatar-placeholder.svg',
  },
}
