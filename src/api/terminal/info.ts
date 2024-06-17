import request from '@/utils/request'

export function getPage(data: any) {
  return request({
    url: '/terminal/info/page',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/terminal/info/insert',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/terminal/info/update',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/terminal/info/delete',
    method: 'post',
    data,
  })
}

export function setSort(data: any) {
  return request({
    url: '/terminal/info/sort',
    method: 'post',
    data,
  })
}
