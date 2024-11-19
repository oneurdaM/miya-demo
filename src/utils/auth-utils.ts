import Cookie from "js-cookie";
import SSRCookie from "cookie";
import {ADMIN, AUTH_CRED,PERMISSIONS,STAFF,SUPER_ADMIN,TOKEN} from "./constants";

export const allowedRoles = [SUPER_ADMIN, ADMIN];
export const adminAndOwnerOnly = [SUPER_ADMIN];
export const adminOwnerAndStaffOnly = [SUPER_ADMIN];
export const adminOnly = [SUPER_ADMIN];

export function setAuthCredentials(token: string,permissions: any, refreshToken:string) {
  Cookie.set(AUTH_CRED,JSON.stringify({token,permissions, refreshToken}));
}

export function getAuthCredentials(context?: any): {
  token: string | null;
  permissions: string | null;
  refreshToken: string | null;
} {
  let authCred;
  if (context) {
    authCred = parseSSRCookie(context)[AUTH_CRED];
  } else {
    authCred = Cookie.get(AUTH_CRED);
  }
  if (authCred) {
    return JSON.parse(authCred);
  }
  return {token: null,permissions: null, refreshToken: null};
}

export function parseSSRCookie(context: any) {
  return SSRCookie.parse(context.req.headers.cookie ?? "");
}

export function hasAccess(
  _allowedRoles: string[],
  _userPermissions: string | undefined | null
) {
  if (_userPermissions) {
    return Boolean(_allowedRoles?.includes(_userPermissions));
  }
  return false;
}
export function isAuthenticated(_cookies: any) {
  return !!_cookies[TOKEN] && !!_cookies[PERMISSIONS]?.length;
}
