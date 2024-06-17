import request from '@/utils/request'

//草稿票编辑功能
export function DraftTicketEdit(data: any) {
  return request({
    url: '/order/manage/draftTicketEdit',
    method: 'post',
    data,
  })
}

//查询工作票内容
export function getTicketList(data: any) {
  return request({
    url: '/order/manage/getTicketList',
    method: 'post',
    data,
  })
}

//查询草稿工作票内容
export function getDraftTicketList(data: any) {
  return request({
    url: '/order/manage/getDraftTicketList',
    method: 'post',
    data,
  })
}

//查询待审核工作票内容
export function getPendingReviewTicketList(data: any) {
  return request({
    url: '/order/manage/getPendingReviewTicketList',
    method: 'post',
    data,
  })
}

//查询失效工作票内容
export function getInvalidTicketList(data: any) {
  return request({
    url: '/order/manage/getInvalidTicketList',
    method: 'post',
    data,
  })
}

//查询历史工作票内容
export function getHistoryTicketList(data: any) {
  return request({
    url: '/order/manage/getHistoryTicketList',
    method: 'post',
    data,
  })
}

//查询进行中工作票内容
export function getProgressTicketList(data: any) {
  return request({
    url: '/order/manage/getProgressTicketList',
    method: 'post',
    data,
  })
}

//撤回工作票功能
export function WithdrawTicket(data: any) {
  return request({
    url: '/order/manage/WithdrawTicket',
    method: 'post',
    data,
  })
}

//工作票删除功能
export function doDelete(data: any) {
  return request({
    url: '/order/manage/doDelete',
    method: 'post',
    data,
  })
}
