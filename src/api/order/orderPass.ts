import request from '@/utils/request'
//获取审批任务列表
export function getOrderList(data: any) {
  return request({
    url: '/order/pass/getOrderList',
    method: 'post',
    data,
  })
}

//审批通过工作票
export function passOrder(data: any) {
  return request({
    url: '/order/pass/passOrder',
    method: 'post',
    data,
  })
}

//驳回工作票
export function refuseOrder(data: any) {
  return request({
    url: '/order/pass/refuseOrder',
    method: 'post',
    data,
  })
}
