import request from '@/utils/request'

export function getTree(data: any) {
  return request({
    url: '/api/tree',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/api/insert',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/api/update',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/api/delete',
    method: 'post',
    data,
  })
}

export function setSort(data: any) {
  return request({
    url: '/api/sort',
    method: 'post',
    data,
  })
}
