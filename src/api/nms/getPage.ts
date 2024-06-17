import request from '@/utils/request'

export function getPage(data: any) {
  return request({
    url: '/nms/page',
    method: 'post',
    data,
  })
}
