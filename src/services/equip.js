import request from '@/utils/request';
import { stringify } from 'qs';

export async function getLicCountSum() {
  return request('/api/lic/count.sum');
}

export async function getCarCountSum() {
  return request('/api/car/count.sum');
}

export async function getCarPage(params) {
  return request('/api/car/get.page', {
    method: 'POST',
    body: params,
  });
}

export async function createCar(params) {
  return request('/api/car/add', {
    method: 'POST',
    body: params,
  });
}

export async function getCarInfo(params) {
  return request(`/api/car/get?${stringify(params)}`);
}

export async function modifyCar(params) {
  return request('/api/car/edit', {
    method: 'POST',
    body: params,
  });
}

export async function delCar(params) {
  return request(`/api/car/del?${stringify(params)}`, {
    method: 'DELETE',
  });
}

// 设备详情增删改查
export async function pageEquipInfo(params) {
  return request('/api/equipinfo/get.page', {
    method: 'POST',
    body: params,
  });
}

export async function addEquipInfo(params) {
  return request('/api/equipinfo/add', {
    method: 'POST',
    body: params,
  });
}

export async function delEquipInfo(params) {
  return request(`/api/equipinfo/del?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function editEquipInfo(params) {
  return request('/api/equipinfo/edit', {
    method: 'POST',
    body: params,
  });
}

export async function getEquipInfo(params) {
  return request(`/api/equipinfo/get?${stringify(params)}`);
}
