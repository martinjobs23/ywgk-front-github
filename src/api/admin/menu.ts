import request from '@/utils/request'

export function getTree(data: any) {
  return request({
    url: '/menu/navigate',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/menu/insert',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/menu/update',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/menu/delete',
    method: 'post',
    data,
  })
}

export function setSort(data: any) {
  return request({
    url: '/menu/sort',
    method: 'post',
    data,
  })
}
