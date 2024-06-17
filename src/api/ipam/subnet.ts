import request from '@/utils/request'

export function getTree(data: any) {
  return request({
    url: '/ipam/subnet/navigate',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/ipam/subnet/insert',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/ipam/subnet/update',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/ipam/subnet/delete',
    method: 'post',
    data,
  })
}

export function setSort(data: any) {
  return request({
    url: '/ipam/subnet/sort',
    method: 'post',
    data,
  })
}
