import request from '@/utils/request'

export function getPage(data: any) {
  return request({
    url: '/ipam/netdevice/page',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/ipam/netdevice/insert',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/ipam/netdevice/update',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/ipam/netdevice/delete',
    method: 'post',
    data,
  })
}

export function doCheck(data: any) {
  return request({
    url: '/ipam/netdevice/check',
    method: 'post',
    data,
  })
}
