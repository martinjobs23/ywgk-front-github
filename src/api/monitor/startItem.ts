import request from '@/utils/request'

//获取启动项黑名单列表
export function getStartupBlackList(data) {
  return request({
    url: '/startItem/getStartupBlackList',
    method: 'post',
    data,
  })
}
//获取ip列表
export function getIpList(data) {
  return request({
    url: '/startItem/getIpList',
    method: 'post',
    data,
  })
}
//获取启动项列表
export function getStartupList(data) {
  return request({
    url: '/startItem/getStartupList',
    method: 'post',
    data,
  })
}
//发送启动项黑名单
export function sendStartupBlack(data) {
  return request({
    url: '/startItem/sendStartupBlack',
    method: 'post',
    data,
  })
}

//删除黑名单
export function doRevoke(data) {
  return request({
    url: '/startItem/startupBlackRevoke',
    method: 'post',
    data,
  })
}

//向黑名单中的添加终端
export function insertStartupBlack(data) {
  return request({
    url: '/startItem/insertStartupBlack',
    method: 'post',
    data,
  })
}
