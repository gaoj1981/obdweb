import request from '@/utils/request';

export async function getLicCountSum() {
  return request('/api/lic/count.sum');
}

export async function getCarPage(params) {
  return request('/api/car/get.page', {
    method: 'POST',
    body: params,
  });
}