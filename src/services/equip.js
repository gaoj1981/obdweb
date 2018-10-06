import request from '@/utils/request';

export async function getLicCountSum() {
  return request('/api/lic/count.sum');
}

export async function getDeviceTODO() {
  // 待完善
  return request('/api/device');
}
