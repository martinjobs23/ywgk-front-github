import request from '@/utils/request'

export function getTree(data: any) {
  return request({
    url: '/org/tree',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/org/insert',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/org/update',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/org/delete',
    method: 'post',
    data,
  })
}

export function setSort(data: any) {
  return request({
    url: '/org/sort',
    method: 'post',
    data,
  })
}
