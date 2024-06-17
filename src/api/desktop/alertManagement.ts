import request from '@/utils/request'

export function getHardwareAlertList(data: any) {
  return request({
    url: '/alertRequest/hardwareAlert',
    method: 'post',
    data,
  })
}

export function getSoftwareChangeAlertList(data: any) {
  return request({
    url: '/alertRequest/softwareChangeAlert',
    method: 'post',
    data,
  })
}

export function getSoftwareRunAlertList(data: any) {
  return request({
    url: '/alertRequest/softwareRunAlert',
    method: 'post',
    data,
  })
}

export function getFlowAlertList(data: any) {
  return request({
    url: '/alertRequest/flowAlert',
    method: 'post',
    data,
  })
}
export function getOverviewList(data: any) {
  return request({
    url: '/alertRequest/overviewAlert',
    method: 'post',
    data,
  })
}
