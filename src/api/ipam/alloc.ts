import request from '@/utils/request'

export function getPage(data: any) {
  return request({
    url: '/ipam/alloc/page',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/ipam/alloc/insert',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/ipam/alloc/update',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/ipam/alloc/delete',
    method: 'post',
    data,
  })
}
