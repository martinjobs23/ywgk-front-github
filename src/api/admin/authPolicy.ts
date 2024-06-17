import request from '@/utils/request'

export function getList(data: any) {
  return request({
    url: '/authPolicy/getList',
    method: 'post',
    data,
  })
}

export function getSettingList(data: any) {
  return request({
    url: '/authPolicy/getSettingList',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/authPolicy/insert',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/authPolicy/update',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/authPolicy/delete',
    method: 'post',
    data,
  })
}
