import request from '@/utils/request'

export function getTree(data: any) {
  return request({
    url: '/dev/group/tree',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/dev/group/insert',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/dev/group/update',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/dev/group/delete',
    method: 'post',
    data,
  })
}

export function setSort(data: any) {
  return request({
    url: '/dev/group/sort',
    method: 'post',
    data,
  })
}
