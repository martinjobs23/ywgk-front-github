import request from '@/utils/request'

//获取违规外联IP列表
export function getCheckHttpList(data: any) {
  return request({
    url: '/check/checkhttp/getCheckHttpList',
    method: 'post',
    data,
  })
}

// 新增违规外联条目
export function doAdd(data: any) {
  return request({
    url: '/check/checkhttp/insert',
    method: 'post',
    data,
  })
}

// 修改
export function doEdit(data: any) {
  return request({
    url: '/check/checkhttp/update',
    method: 'post',
    data,
  })
}

//删除违规外联条目
export function doDelete(data: any) {
  return request({
    url: '/check/checkhttp/delete',
    method: 'post',
    data,
  })
}

//设置状态为生效
export function changeStatusWork(data: any) {
  return request({
    url: '/check/checkhttp/changeStatusWork',
    method: 'post',
    data,
  })
}

//设置状态为未生效
export function changeStatusRest(data: any) {
  return request({
    url: '/check/checkhttp/changeStatusRest',
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

//分发Http策略
export function distribute(data: any) {
  return request({
    url: '/check/checkhttp/distribute',
    method: 'post',
    data,
  })
}

// 导入
export function doImport(data: any) {
  return request({
    url: '/check/checkhttp/import',
    method: 'post',
    data,
  })
}
