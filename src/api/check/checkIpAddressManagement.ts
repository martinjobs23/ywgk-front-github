import request from '@/utils/request'

//获取IP地址采集策略列表
export function getCheckIpAddressList(data: any) {
  return request({
    url: '/check/checkipaddress/getCheckIpAddressList',
    method: 'post',
    data,
  })
}

// 新增IP地址采集策略条目
export function doAdd(data: any) {
  return request({
    url: '/check/checkipaddress/insert',
    method: 'post',
    data,
  })
}

// 修改
export function doEdit(data: any) {
  return request({
    url: '/check/checkipaddress/update',
    method: 'post',
    data,
  })
}

//删除IP地址采集策略条目
export function doDelete(data: any) {
  return request({
    url: '/check/checkipaddress/delete',
    method: 'post',
    data,
  })
}

//分发IP地址采集策略
export function distribute(data: any) {
  return request({
    url: '/check/checkipaddress/distribute',
    method: 'post',
    data,
  })
}

// 导入
export function doImport(data: any) {
  return request({
    url: '/check/checkipaddress/import',
    method: 'post',
    data,
  })
}
