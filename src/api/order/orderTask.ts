import request from '@/utils/request'

//获取运维任务列表
export function getOrderList(data: any) {
  return request({
    url: '/order/task/getOrderList',
    method: 'post',
    data,
  })
}

//获取运维任务列表
export function getOrderDevice(data: any) {
  return request({
    url: '/order/task/getOrderDevice',
    method: 'post',
    data,
  })
}

//能否进行运维操作
export function permission(data: any) {
  return request({
    url: '/order/task/permission',
    method: 'post',
    data,
  })
}

//运维操作
export function pluginparam(data: any) {
  return request({
    url: '/order/task/pluginparam',
    method: 'post',
    data,
  })
}

// 新增违规外联条目
export function doAdd(data: any) {
  return request({
    url: '/check/checkip/insert',
    method: 'post',
    data,
  })
}

// 修改
export function doEdit(data: any) {
  return request({
    url: '/check/checkip/update',
    method: 'post',
    data,
  })
}

//删除违规外联条目
export function doDelete(data: any) {
  return request({
    url: '/check/checkip/delete',
    method: 'post',
    data,
  })
}

//设置状态为生效
export function changeStatusWork(data: any) {
  return request({
    url: '/check/checkip/changeStatusWork',
    method: 'post',
    data,
  })
}

//设置状态为未生效
export function changeStatusRest(data: any) {
  return request({
    url: '/check/checkip/changeStatusRest',
    method: 'post',
    data,
  })
}

//分发IP策略
export function distribute(data: any) {
  return request({
    url: '/check/checkip/distribute',
    method: 'post',
    data,
  })
}

// 导入
export function doImport(data: any) {
  return request({
    url: '/check/checkip/import',
    method: 'post',
    data,
  })
}
