import request from '@/utils/request'

//获取终端安装版本列表
export function getterminalVersionList(data) {
  return request({
    url: '/securitycomponent/getterminalVersionList',
    method: 'post',
    data,
  })
}

export function getcredit() {
  return request({
    url: '/securitycomponent/getcredit',
    method: 'post',
  })
}
//获取安全策略列表
export function getSecurityPolicyList(data) {
  return request({
    url: '/securitycomponent/getSecurityPolicyList',
    method: 'post',
    data,
  })
}

//获取画图数据列表
export function getImageDataList() {
  return request({
    url: '/securitycomponent/getImageDataList',
    method: 'post',
  })
}

//设置密码
export function setPassword(data) {
  return request({
    url: '/securitycomponent/setPassword',
    method: 'post',
    data,
  })
}

//下发信息
export function transferMsg(data) {
  return request({
    url: '/securitycomponent/transferMsg',
    method: 'post',
    data,
  })
}

//获取安装包目录
export function getinstallPackageList(data) {
  return request({
    url: '/securityComponentRequest/getinstallPackageList',
    method: 'post',
    data,
  })
}

//上传安装包
export function ComponentUpload(data) {
  return request({
    url: '/securityComponentRequest/ComponentUpload',
    method: 'post',
    data,
  })
}

//删除安装包
export function ComponentDelete(data) {
  return request({
    url: '/securityComponentRequest/ComponentDelete',
    method: 'post',
    data,
  })
}

//设置默认版本
export function ComponentDefault(data) {
  return request({
    url: '/securityComponentRequest/ComponentDefault',
    method: 'post',
    data,
  })
}

//获取安全组件设置列表
export function getsecurityComponentSetList(data) {
  return request({
    url: '/securitycomponent/getsecurityComponentSetList',
    method: 'post',
    data,
  })
}
