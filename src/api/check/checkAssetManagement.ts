import request from '@/utils/request'

//获取资产采集策略信息列表
export function getCheckAssetList(data: any) {
  return request({
    url: '/check/checkasset/getCheckAssetList',
    method: 'post',
    data,
  })
}

// 新增资产采集策略条目
export function doAdd(data: any) {
  return request({
    url: '/check/checkasset/insert',
    method: 'post',
    data,
  })
}

// 修改
export function doEdit(data: any) {
  return request({
    url: '/check/checkasset/update',
    method: 'post',
    data,
  })
}

//删除资产采集策略条目
export function doDelete(data: any) {
  return request({
    url: '/check/checkasset/delete',
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

//分发资产采集策略
export function distribute(data: any) {
  return request({
    url: '/check/checkasset/distribute',
    method: 'post',
    data,
  })
}

// 导入
export function doImport(data: any) {
  return request({
    url: '/check/checkasset/import',
    method: 'post',
    data,
  })
}
