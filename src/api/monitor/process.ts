import request from '@/utils/request'

//获取进程黑名单列表
export function getProcessBlackList(data) {
  return request({
    url: '/process/getProcessBlackList',
    method: 'post',
    data,
  })
}

//删除黑名单
export function processBlackRevoke(data) {
  return request({
    url: '/process/processBlackRevoke',
    method: 'post',
    data,
  })
}

//向黑名单中的添加终端
export function insertProcessBlack(data) {
  return request({
    url: '/process/insertProcessBlack',
    method: 'post',
    data,
  })
}
// //获取进程列表
// export function getProcessList(data) {
//   return request({
//     url: '/process/getProcessBlackList',
//     method: 'post',
//     data,
//   })
// }

//获取进程IP和使用人的信息
export function getIpList(data) {
  return request({
    url: '/process/getIpList',
    method: 'post',
    data,
  })
}

//获取进程监控表的信息
export function getProcessList(data) {
  return request({
    url: '/process/getProcessList',
    method: 'post',
    data,
  })
}
