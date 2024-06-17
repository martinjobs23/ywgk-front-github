import request from '@/utils/request'
export function getTree(data: any) {
  return request({
    url: '/dgroup/navigate',
    method: 'post',
    data,
  })
}
export function doEdit(data: any) {
  return request({
    url: '/dgroup/update',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/dgroup/insert',
    method: 'post',
    data,
  })
}

export function doDeleteById(data: any) {
  return request({
    url: '/dgroup/delete',
    method: 'post',
    data,
  })
}
