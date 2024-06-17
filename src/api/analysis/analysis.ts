import request from '@/utils/request'

export function terminalAlert(data) {
  return request({
    url: '/analysisRequest/terminalAlert',
    method: 'post',
    data,
  })
}
export function softwareDistribution_device(data) {
  return request({
    url: '/analysisRequest/softwareDistribution_device',
    method: 'post',
    data,
  })
}
export function softwareDistribution_software(data) {
  return request({
    url: '/analysisRequest/softwareDistribution_software',
    method: 'post',
    data,
  })
}
export function fileDistribution_device(data) {
  return request({
    url: '/analysisRequest/fileDistribution_device',
    method: 'post',
    data,
  })
}
export function fileDistribution_file(data) {
  return request({
    url: '/analysisRequest/fileDistribution_file',
    method: 'post',
    data,
  })
}

export function terminalUsage(data) {
  return request({
    url: '/analysisRequest/terminalUsage',
    method: 'post',
    data,
  })
}
export function asset(data) {
  return request({
    url: '/analysisRequest/asset',
    method: 'post',
    data,
  })
}
export function operatingSystem(data: any) {
  return request({
    url: '/analysisRequest/operatingSystem',
    method: 'post',
    data,
  })
}
export function workOrder(data) {
  return request({
    url: '/analysisRequest/workOrder',
    method: 'post',
    data,
  })
}
export function softwareInstallation_device(data) {
  return request({
    url: '/analysisRequest/softwareInstallation_device',
    method: 'post',
    data,
  })
}
export function softwareInstallation_software(data) {
  return request({
    url: '/analysisRequest/softwareInstallation_software',
    method: 'post',
    data,
  })
}
export function deviceAccess(data) {
  return request({
    url: '/analysisRequest/deviceAccess',
    method: 'post',
    data,
  })
}
