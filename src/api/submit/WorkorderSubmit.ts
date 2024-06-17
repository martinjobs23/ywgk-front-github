import request from '@/utils/request'

//获取工单列表
export function getWorkorderList(data) {
  return request({
    url: '/submit/getWorkorderList',
    method: 'post',
    data,
  })
}

//提交工单
export function WorkorderSubmit(data) {
  return request({
    url: '/submit/WorkorderSubmit',
    method: 'post',
    data,
  })
}
