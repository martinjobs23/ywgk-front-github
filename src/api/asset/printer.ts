import request from '@/utils/request'

export function getPage(data: any) {
  return request({
    url: '/asset/printer/page',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/asset/printer/insert',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/asset/printer/update',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/asset/printer/delete',
    method: 'post',
    data,
  })
}

export function setSort(data: any) {
  return request({
    url: '/asset/printer/sort',
    method: 'post',
    data,
  })
}
