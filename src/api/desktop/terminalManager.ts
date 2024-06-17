import request from '@/utils/request'

export function getList(data: any) {
  return request({
    url: '/certRequest/getList',
    method: 'post',
    data,
  })
}

//获取未注册设备列表
export function getUncheckList(data: any) {
  return request({
    url: '/certRequest/getUncheckList',
    method: 'post',
    data,
  })
}

//添加未注册设备
export function addToUncheckList(data: any) {
  return request({
    url: '/certRequest/addToUncheckList',
    method: 'post',
    data,
  })
}

//获取已注册设备列表
export function getCheckList(data: any) {
  return request({
    url: '/terminalManagement/getCheckList',
    method: 'post',
    data,
  })
}

//设备注册审核
export function radCheck(data: any) {
  return request({
    url: '/certRequest/radCheck',
    method: 'post',
    data,
  })
}

//设备注册撤销
export function radRevoke(data: any) {
  return request({
    url: '/certRequest/radRevoke',
    method: 'post',
    data,
  })
}

//硬件认证信息
export function hardwareCheckInfo(data: any) {
  return request({
    url: '/terminalManagement/hardwareCheckInfo',
    method: 'post',
    data,
  })
}

//获取终端状态信息
export function devicestatus(data: any) {
  return request({
    url: '/terminalManagement/terminalStatus',
    method: 'post',
    data,
  })
}
