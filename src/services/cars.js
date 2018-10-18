import request from '@/utils/request';
import { stringify } from 'qs';

export async function getBuserPage(params) {
  return request('/api/binduser/get.page', {
    method: 'POST',
    body: params,
  });
}

// 增删改查
export async function pageBindUser(params) {
  return request('/api/binduser/get.page', {
    method: 'POST',
    body: params,
  });
}

export async function addBindUser(params) {
  return request('/api/binduser/add', {
    method: 'POST',
    body: params,
  });
}

export async function delBindUser(params) {
  return request(`/api/binduser/del?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function editBindUser(params) {
  return request('/api/binduser/edit', {
    method: 'POST',
    body: params,
  });
}

export async function getBindUser(params) {
  return request(`/api/binduser/get?${stringify(params)}`);
}

export async function editBindUserDefault(params) {
  return request(`/api/binduser/edit.default?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function getBindUserDefault(params) {
  return request(`/api/binduser/get.default?${stringify(params)}`);
}
