import request from '@/utils/request';
import { stringify } from 'qs';

export async function getBuserPage(params) {
  return request('/api/binduser/get.page', {
    method: 'POST',
    body: params,
  });
}

export async function getBindUser(params) {
  return request(`/api/binduser/get?${stringify(params)}`);
}
