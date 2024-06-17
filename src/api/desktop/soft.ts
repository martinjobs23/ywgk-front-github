import request from '@/utils/request'

//获取终端软件列表
export function getDeviceSoftList(data) {
  return request({
    url: '/soft/getDeviceSoftList',
    method: 'post',
    data,
  })
}

//获取软件列表
export function getSoftList(data) {
  return request({
    url: '/soft/getSoftList',
    method: 'post',
    data,
  })
}

//获取终端设备列表
export function getDeviceList(data) {
  return request({
    url: '/soft/getDeviceList',
    method: 'post',
    data,
  })
}

//添加
export function doAdd(data) {
  return request({
    url: '/soft/insert',
    method: 'post',
    data,
  })
}

//删除
export function doDelete(data) {
  return request({
    url: '/soft/delete',
    method: 'post',
    data,
  })
}

//编辑
export function doEdit(data) {
  return request({
    url: '/soft/update',
    method: 'post',
    data,
  })
}

//上传
export function doUpload(data) {
  return request({
    url: '/soft/upload',
    method: 'post',
    data,
  })
}

//软件下载
export function softDownload(data) {
  return request({
    url: '/certRequest/download',
    method: 'post',
    data,
  })
}

//私有软件登记
export function privateSoftwareUpload(data) {
  return request({
    url: '/certRequest/privateSoftwareUpload',
    method: 'post',
    data,
  })
}

//软件信息修改
export function SoftwareEdit(data) {
  return request({
    url: '/certRequest/SoftwareEdit',
    method: 'post',
    data,
  })
}

//软件超市删除
export function SoftwareDelete(data) {
  return request({
    url: '/certRequest/SoftwareDelete',
    method: 'post',
    data,
  })
}

//软件分发
export function doSend(data) {
  return request({
    url: '/certRequest/SoftwareDistribute',
    method: 'post',
    data,
  })
}

//软件升级
export function doUpdate(data) {
  return request({
    url: '/certRequest/SoftwareUpdate',
    method: 'post',
    data,
  })
}

//终端视图获取终端软件列表
export function terminalViewSoftList(data) {
  return request({
    url: '/soft/getstatisticList',
    method: 'post',
    data,
  })
}

//软件视图获取终端软件列表
export function softViewSoftList(data) {
  return request({
    url: '/soft/getsoftViewList',
    method: 'post',
    data,
  })
}

//软件视图获取终端软详情
export function softViewTerminalList(data) {
  return request({
    url: '/soft/getsoftViewDetail',
    method: 'post',
    data,
  })
}
