import request from '@/utils/request'

export function getOnlineTerminalNums(data: any) {
  return request({
    url: '/index/getOnlineTerminalNums',
    method: 'post',
    data,
  })
}

export function getDepartmentOnlineTerminalNums(data: any) {
  return request({
    url: 'index/getDepartmentOnlineTerminalNums',
    method: 'post',
    data,
  })
}

export function getAlertCount(data: any) {
  return request({
    url: '/index/getAlertCount',
    method: 'post',
    data,
  })
}

export function getTodoNums(data: any) {
  return request({
    url: '/index/getTodoNums',
    method: 'post',
    data,
  })
}
