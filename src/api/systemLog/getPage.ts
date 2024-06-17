import request from '@/utils/request'

//获取软件安装卸载列表
export function getSoftwareList(data) {
  return request({
    url: '/systemLog/getSoftwareList',
    method: 'post',
    data,
  })
}
//获取软件安装卸载列表日志
export function getSoftwareListLog(data) {
  return request({
    url: '/systemLog/getSoftwareListLog',
    method: 'post',
    data,
  })
}
//获取终端注册列表
export function getaccountlogs(data) {
  return request({
    url: '/systemLog/getaccountlogs',
    method: 'post',
    data,
  })
}
//获取终端注册列表日志
export function getTerminalListLog(data) {
  return request({
    url: '/systemLog/getTerminalListLog',
    method: 'post',
    data,
  })
}
//获取指令下发列表
export function getInstructionList(data) {
  return request({
    url: '/systemLog/getInstructionList',
    method: 'post',
    data,
  })
}
//获取策略下发列表
export function getStrategyList(data) {
  return request({
    url: '/systemLog/getStrategyList',
    method: 'post',
    data,
  })
}
//获取策略下发列表日志
export function getStrategyListLog(data) {
  return request({
    url: '/systemLog/getStrategyListLog',
    method: 'post',
    data,
  })
}
//获取用户操作列表
export function getUserOperationList(data) {
  return request({
    url: '/systemLog/getUserOperationList',
    method: 'post',
    data,
  })
}

export function getsercuityAudit(data) {
  return request({
    url: '/systemLog/getsercuityAudit',
    method: 'post',
    data,
  })
}
//获取软件库维护列表
export function getSoftwarelibraryList(data) {
  return request({
    url: '/systemLog/getSoftwarelibraryList',
    method: 'post',
    data,
  })
}
//获取软件分发列表
export function getSoftwaredistributeList(data) {
  return request({
    url: '/systemLog/getSoftwaredistributeList',
    method: 'post',
    data,
  })
}
//获取网络访问列表
export function getNetworkaccessList(data) {
  return request({
    url: '/systemLog/getNetworkaccessList',
    method: 'post',
    data,
  })
}
//获取网络访问列表日志
export function getNetworkaccesslogList(data) {
  return request({
    url: '/systemLog/getNetworkaccesslogList',
    method: 'post',
    data,
  })
}
//获取违规外联列表
export function getCheckipList(data) {
  return request({
    url: '/systemLog/getCheckipList',
    method: 'post',
    data,
  })
}
//获取终端硬件变更日志列表
export function getTerminalHardwareAlterList(data) {
  return request({
    url: '/systemLog/getTerminalHardwareAlterList',
    method: 'post',
    data,
  })
}
