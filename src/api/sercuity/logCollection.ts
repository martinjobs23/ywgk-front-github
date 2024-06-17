import request from '@/utils/request'

export function getPage(data: any) {
  return request({
    url: '/logCollection/page',
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: '/logCollection/insert',
    method: 'post',
    data,
  })
}

export function getlogAnalyseList(data: any) {
  return request({
    url: '/logAnalyse/page',
    method: 'post',
    data,
  })
}

export function getSoftwareAlertList(data: any) {
  return request({
    url: '/alertRequest/softwareAlert',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/logCollection/update',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/logCollection/delete',
    method: 'post',
    data,
  })
}

export function setSort(data: any) {
  return request({
    url: '/logCollection/sort',
    method: 'post',
    data,
  })
}

export function getOnlinePad(data: any) {
  return request({
    url: '/logCollection/onlinepad',
    method: 'post',
    data,
  })
}
