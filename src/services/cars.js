import request from '@/utils/request';
import { stringify } from 'qs';

export async function getBuserPage(params) {
  return request('/api/binduser/get.page', {
    method: 'POST',
    body: params,
  });
}

export async function getObdInfo(params) {
  return request(`/api/car/get.obd?${stringify(params)}`, {
    method: 'POST',
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

// CarMot增删改查
export async function pageCarMot(params) {
  return request('/api/carmot/get.page', {
    method: 'POST',
    body: params,
  });
}

export async function addCarMot(params) {
  return request('/api/carmot/add', {
    method: 'POST',
    body: params,
  });
}

export async function delCarMot(params) {
  return request(`/api/carmot/del?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function editCarMot(params) {
  return request('/api/carmot/edit', {
    method: 'POST',
    body: params,
  });
}

export async function getCarMot(params) {
  return request(`/api/carmot/get?${stringify(params)}`);
}

export async function getCarMotInfo(params) {
  return request(`/api/carmot/get.info?${stringify(params)}`);
}

// 车辆保险增删改查
export async function pageCarInsur(params) {
  return request('/api/carinsur/get.page', {
    method: 'POST',
    body: params,
  });
}

export async function addCarInsur(params) {
  return request('/api/carinsur/add', {
    method: 'POST',
    body: params,
  });
}

export async function delCarInsur(params) {
  return request(`/api/carinsur/del?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function editCarInsur(params) {
  return request('/api/carinsur/edit', {
    method: 'POST',
    body: params,
  });
}

export async function getCarInsur(params) {
  return request(`/api/carinsur/get?${stringify(params)}`);
}
