import request from '@/utils/request'

export function getPage(data: any) {
  return request({
    url: '/meeting/info/page',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/meeting/info/insert',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/meeting/info/update',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/meeting/info/delete',
    method: 'post',
    data,
  })
}

export function setSort(data: any) {
  return request({
    url: '/meeting/info/sort',
    method: 'post',
    data,
  })
}

export function getTotalFile(data: any) {
  return request({
    url: '/meeting/info/totalfile',
    method: 'post',
    data,
  })
}
