import { queryCurRole } from '@/services/user';
import { isArray } from '@/utils/utils';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  let storageAuth = localStorage.getItem('antd-pro-authority');
  storageAuth = storageAuth
    .replace('[', '')
    .replace(']', '')
    .replace(/"/g, '');
  if (storageAuth.indexOf('guest') < 0) {
    const promisCurRole = queryCurRole();
    promisCurRole
      .then(response => {
        console.log(str, response, storageAuth);
        if (str) {
          if (isArray(response) && response.indexOf(str) >= 0) {
            console.log('auth success');
          } else {
            /* eslint-disable no-underscore-dangle */
            window.g_app._store.dispatch({
              type: 'login/logout',
            });
          }
        } else if (isArray(response) && response.indexOf(storageAuth) >= 0) {
          console.log('auth pass');
        } else {
          /* eslint-disable no-underscore-dangle */
          window.g_app._store.dispatch({
            type: 'login/logout',
          });
        }
      })
      .catch(e => {
        console.log('auth err', e);
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
      });
  }

  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['admin'];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}
