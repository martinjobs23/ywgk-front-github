import request from '@/utils/request'

export function getPage(data: any) {
  return request({
    url: '/ipam/online/page',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/ipam/online/insert',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/ipam/online/update',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/ipam/online/delete',
    method: 'post',
    data,
  })
}
