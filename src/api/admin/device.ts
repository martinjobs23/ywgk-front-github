import request from '@/utils/request'

export function getList(data: any) {
  return request({
    url: '/device/page',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/device/insert',
    method: 'post',
    data,
  })
}

export function doUpload(data: any) {
  return request({
    url: '/device/upload',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/device/update',
    method: 'post',
    data,
  })
}

export function doDeleteById(data: any) {
  return request({
    url: '/device/delete',
    method: 'post',
    data,
  })
}

export function getProtocols(data: any) {
  return request({
    url: '/device/getProtocols',
    method: 'post',
    data,
  })
}

export function getDeviceService(data: any) {
  return request({
    url: '/device/getDeviceService',
    method: 'post',
    data,
  })
}

export function getDeviceAccount(data: any) {
  return request({
    url: '/device/getDeviceAccount',
    method: 'post',
    data,
  })
}

export function protocolList(data: any) {
  return request({
    url: '/device/protocolList',
    method: 'post',
    data,
  })
}

export function getDeviceType(data: any) {
  return request({
    url: '/device/getDeviceType',
    method: 'post',
    data,
  })
}
