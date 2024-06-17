import request from '@/utils/request'

export function getPage(data: any) {
  return request({
    url: '/asset/info/page',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/asset/info/insert',
    method: 'post',
    data,
  })
}

export function getTypeList(data: any) {
  return request({
    url: '/asset/info/typelist',
    method: 'post',
    data,
  })
}

export function getVerifyData(data: any) {
  return request({
    url: '/asset/info/verifydata',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/asset/info/update',
    method: 'post',
    data,
  })
}

export function doVerify(data: any) {
  return request({
    url: '/asset/info/verify',
    method: 'post',
    data,
  })
}

export function doVerifyOK(data: any) {
  return request({
    url: '/asset/info/verifyok',
    method: 'post',
    data,
  })
}

export function doImport(data: any) {
  return request({
    url: '/asset/info/import',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/asset/info/delete',
    method: 'post',
    data,
  })
}

export function setNumber(data: any) {
  return request({
    url: '/asset/info/number',
    method: 'post',
    data,
  })
}

export function setSort(data: any) {
  return request({
    url: '/asset/info/sort',
    method: 'post',
    data,
  })
}
