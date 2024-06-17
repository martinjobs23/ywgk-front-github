import request from '@/utils/request'

export function getPage(data: any) {
  return request({
    url: '/meeting/file/page',
    method: 'post',
    data,
  })
}

export function getPadFilePage(data: any) {
  return request({
    url: '/meeting/file/padfilepage',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/meeting/file/insert',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/meeting/file/update',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/meeting/file/delete',
    method: 'post',
    data,
  })
}

export function setSort(data: any) {
  return request({
    url: '/meeting/file/sort',
    method: 'post',
    data,
  })
}

export function doUpload(data: any) {
  return request({
    url: '/meeting/file/upload',
    method: 'post',
    data,
  })
}

export function doClean(data: any) {
  return request({
    url: '/meeting/file/clean',
    method: 'post',
    data,
  })
}

export function doSend(data: any) {
  return request({
    url: '/meeting/file/send',
    method: 'post',
    data,
  })
}
