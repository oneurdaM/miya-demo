export const Routes = {
  dashboard: '/',
  login: '/login',
  biometrics: '/biometrics',
  logout: '/logout',
  profile: '/profile',
  settings: '/settings',
  forgotPassword: '/forgot-password',
  profileUpdate: '/profile-update',
  adminList: '/users/admins',
  myStaffs: '/users/my-staffs',
  track: '/track',
  analitycs: "/analitycs",
  attendances: {
    ...routesFactory('/attendances'),
  },
  documents: {
    ...routesFactory('/documents'),
  },
  shifts: {
    ...routesFactory('/shifts'),
  },
  message: {
    ...routesFactory('/message'),
  },
  userMessage: {
    ...routesFactory('/user-message'),
  },
  blog: {
    ...routesFactory('/blog'),
  },
  categories: {
    ...routesFactory('/categories'),
  },
  storeNotice: {
    ...routesFactory('/notices'),
  },
  conferences: {
    ...routesFactory('/conferences'),
  },
  alerts: {
    ...routesFactory('/alerts'),
  },
  suggestions: {
    ...routesFactory('/suggestions'),
  },
  tracker: {
    ...routesFactory('/tracker'),
  },
  environments: {
    ...routesFactory('/environments'),
  },
  users: {
    ...routesFactory('/users'),
  },
  operators: {
    ...routesFactory('/operators'),
  },
  conversations: {
    ...routesFactory('/message'),
  },
  roles: {
    ...routesFactory('/roles'),
  },
  Rondines: {
    ...routesFactory('/round'),
  },
  sectores: {
    ...routesFactory('/sector'),
  },
  terms: {
    ...routesFactory('/terms'),
  },
  checkpoint: {
    ...routesFactory('/checkpoint'),
  },
  documentsType: {
    ...routesFactory('/documents-type'),
  },
}

function routesFactory(endpoint: string) {
  return {
    list: `${endpoint}`,
    create: `${endpoint}/create`,
    editWithoutLang: (slug: string,environment?: string) => {
      return environment
        ? `/${environment}${endpoint}/${slug}/edit`
        : `${endpoint}/${slug}/edit`
    },
    edit: ({id,environment}: {id: string; environment?: string}) => {
      return environment
        ? `/${environment}${endpoint}/${id}/edit`
        : `${endpoint}/${id}/edit`
    },
    details: ({id}: {id: string}) => `${endpoint}/${id}`,
  }
}
