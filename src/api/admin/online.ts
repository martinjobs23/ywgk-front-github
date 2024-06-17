import request from '@/utils/request'

export function getList(data: any) {
  return request({
    url: '/online/getList',
    method: 'post',
    data,
  })
}

export function getTree(data: any) {
  return request({
    url: '/online/getTree',
    method: 'post',
    data,
  })
}
