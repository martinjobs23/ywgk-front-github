import request from '@/utils/request'

export function getTree(data: any) {
  return request({
    url: '/role/navigate',
    method: 'post',
    data,
  })
}

export function getRoleAuthPolicy(data: any) {
  return request({
    url: '/role/getRoleAuthPolicy',
    method: 'post',
    data,
  })
}

export function getRoleMenu(data: any) {
  return request({
    url: '/menuAuth/list',
    method: 'post',
    data,
  })
}

export function setRoleMenu(data: any) {
  return request({
    url: '/menuAuth/insert',
    method: 'post',
    data,
  })
}

export function getRoleApi(data: any) {
  return request({
    url: '/apiAuth/list',
    method: 'post',
    data,
  })
}

export function setRoleApi(data: any) {
  return request({
    url: '/apiAuth/insert',
    method: 'post',
    data,
  })
}

export function getRoleUser(data: any) {
  return request({
    url: '/userAuth/list',
    method: 'post',
    data,
  })
}

export function setRoleUser(data: any) {
  return request({
    url: '/userAuth/insert',
    method: 'post',
    data,
  })
}

export function getAuthPolicy(data: any) {
  return request({
    url: '/authPolicy/getList',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/role/insert',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/role/edit',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/role/delete',
    method: 'post',
    data,
  })
}
