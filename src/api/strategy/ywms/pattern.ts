import request from '@/utils/request'

export function getPage(data: any) {
  return request({
    url: '/strategy/pattern/page',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/strategy/pattern/insert',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/strategy/pattern/update',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/strategy/pattern/delete',
    method: 'post',
    data,
  })
}

export function setSort(data: any) {
  return request({
    url: '/strategy/pattern/sort',
    method: 'post',
    data,
  })
}
