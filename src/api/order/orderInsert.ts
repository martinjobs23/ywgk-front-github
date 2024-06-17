import request from '@/utils/request'

//工作票提交审核
export function orderSave(data: any) {
  return request({
    url: '/order/insert/orderSave',
    method: 'post',
    data,
  })
}
