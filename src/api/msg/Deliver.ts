import request from '@/utils/request'
export function messageDeliver(data: any) {
  return request({
    url: '/msg/Deliver',
    method: 'post',
    data,
  })
}

export function insertcredit(data: any) {
  return request({
    url: '/msg/creditEdit',
    method: 'post',
    data,
  })
}
