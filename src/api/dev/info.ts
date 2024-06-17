import request from '@/utils/request'

export function getPage(data: any) {
  return request({
    url: '/dev/info/page',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/dev/info/insert',
    method: 'post',
    data,
  })
}

export function getTypeList(data: any) {
  return request({
    url: '/dev/info/typelist',
    method: 'post',
    data,
  })
}

export function getVerifyData(data: any) {
  return request({
    url: '/dev/info/verifydata',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/dev/info/update',
    method: 'post',
    data,
  })
}

export function doVerify(data: any) {
  return request({
    url: '/dev/info/verify',
    method: 'post',
    data,
  })
}

export function doVerifyOK(data: any) {
  return request({
    url: '/dev/info/verifyok',
    method: 'post',
    data,
  })
}

export function doImport(data: any) {
  return request({
    url: '/dev/info/import',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/dev/info/delete',
    method: 'post',
    data,
  })
}

export function setNumber(data: any) {
  return request({
    url: '/dev/info/number',
    method: 'post',
    data,
  })
}

export function setSort(data: any) {
  return request({
    url: '/dev/info/sort',
    method: 'post',
    data,
  })
}

export function getAccountList(data: any) {
  return request({
    url: '/dev/info/getAccountList',
    method: 'post',
    data,
  })
}

export function getProtocolType(data: any) {
  return request({
    url: '/dev/info/protocolType',
    method: 'post',
    data,
  })
}

export function getProtocolList(data: any) {
  return request({
    url: '/dev/info/getProtocolList',
    method: 'post',
    data,
  })
}

export function getDeviceState(data: any) {
  return request({
    url: '/dev/info/getDeviceState',
    method: 'post',
    data,
  })
}
