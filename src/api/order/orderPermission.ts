import request from '@/utils/request'
//获取审批任务列表
export function getOrderList(data: any) {
  return request({
    url: '/order/permission/getOrderList',
    method: 'post',
    data,
  })
}

//审批通过工作票
export function permissionOrder(data: any) {
  return request({
    url: '/order/permission/permissionOrder',
    method: 'post',
    data,
  })
}

//驳回工作票
export function refuseOrder(data: any) {
  return request({
    url: '/order/permission/refuseOrder',
    method: 'post',
    data,
  })
}
