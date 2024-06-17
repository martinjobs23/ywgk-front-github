import request from '@/utils/request'

//获取设备黑名单列表
export function getDeviceBlackList(data) {
  return request({
    url: '/networkAccess/getDeviceBlackList',
    method: 'post',
    data,
  })
}

//撤销设备黑名单
export function doRevoke(data) {
  return request({
    url: '/networkAccess/deviceRevoke',
    method: 'post',
    data,
  })
}

//获取所有未在黑名单中的终端
export function getDevice(data) {
  return request({
    url: '/networkAccess/getDevice',
    method: 'post',
    data,
  })
}

//向黑名单中的添加终端
export function insertDevice(data) {
  return request({
    url: '/networkAccess/insertDevice',
    method: 'post',
    data,
  })
}

//获取用户入网结果列表
export function getUserNetAccessList(data) {
  return request({
    url: '/networkAccess/getUserNetAccessList',
    method: 'post',
    data,
  })
}
