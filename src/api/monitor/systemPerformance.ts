import request from '@/utils/request'
//获取系统性能
export function getSystemList(data) {
  return request({
    url: '/sysPerformance/getSystemList',
    method: 'post',
    data,
  })
}
