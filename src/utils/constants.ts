import {atom} from 'jotai'
export const LIMIT = 10
export const SUPER_ADMIN = 'SUPER_ADMIN'
export const ADMIN = 'ADMIN'
export const STAFF = 'STAFF'
export const OPERATOR = 'OPERATOR'
export const TOKEN = 'token'
export const MAXDOCUMENTS = 32
export const ROLES = [
  {
    label: 'Super Admin',
    value: 'SUPER_ADMIN',
  },
  // {
  //   label: 'Operator',
  //   value: 'OPERATOR',
  // },
  {
    label: 'User',
    value: 'USER',
  },

  {
    label: 'Usuario Admin',
    value: 'ADMIN',
  },
  // {label: 'Admin',value: 'ADMIN'},
]
export const PERMISSIONS = 'permissions'
export const AUTH_CRED = 'AUTH_CRED'
export const EMAIL_VERIFIED = 'emailVerified'
export const CART_KEY = 'miyaa-cart'
export const CHECKOUT = 'miyaa-checkout'
export const RESPONSIVE_WIDTH = 1024 as number
export const MAINTENANCE_DETAILS = 'MAINTENANCE_DETAILS'
export const MAXIMUM_WORD_COUNT_FOR_RICH_TEXT_EDITOR: number = 10000
// export const LATITUDE = 23.16349
// export const LONGITUDE = -109.71773
// export const LATITUDE = 23.15874
// export const LONGITUDE = -109.71692

export const LATITUDE = 23.1634033
export const LONGITUDE = -109.7176351

export const ICON = 'iconos/inspector.png'
export const phoneRegExp =
  /^\+?((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
export const URLRegExp =
  /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm

export const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
export const ACCEPTED_FILE_TYPES = {
  'image/jpeg': [],
  'image/png': [],
  'application/pdf': [],
  'application/zip': [],
  'application/vnd.rar': [],
  'application/epub+zip': [],
  '.psd': [],
}

export const searchModalInitialValues = atom(false)
export const miniSidebarInitialValue = atom(false)
export const checkIsMaintenanceModeComing = atom(false)
export const checkIsMaintenanceModeStart = atom(false)
