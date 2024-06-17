import request from '@/utils/request'

export function getPage(data: any) {
  return request({
    url: '/meeting/pad/page',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/meeting/pad/insert',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/meeting/pad/update',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/meeting/pad/delete',
    method: 'post',
    data,
  })
}

export function setSort(data: any) {
  return request({
    url: '/meeting/pad/sort',
    method: 'post',
    data,
  })
}
