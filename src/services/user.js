import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/get.current_user');
}

export async function queryCurRole() {
  return request('/api/get.current_role');
}
