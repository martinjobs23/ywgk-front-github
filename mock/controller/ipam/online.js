const testdata = [
  {
    id: '1',
    pid: '0',
    sort: '1',
    ip: '192.167.*.*',
    description: '主E9楼',
    user_name: '程咬金',
    org_name: '工程中心',
  },
  {
    id: '11',
    pid: '1',
    sort: '2',
    ip: '192.167.200.*',
    description: '主E9楼',
    user_name: '奕星',
  },
  {
    id: '12',
    pid: '1',
    sort: '2',
    ip: '192.167.201.*',
    description: '主E9楼',
    user_name: '牧之',
  },
  {
    id: '2',
    pid: '0',
    sort: '1',
    ip: '192.168.*.*',
    description: '主E9楼',
    user_name: '云迪',
  },
  {
    id: '21',
    pid: '2',
    sort: '1',
    ip: '192.168.200.*',
    description: '主E9楼',
    user_name: '张三',
  },
  {
    id: '22',
    pid: '2',
    sort: '2',
    ip: '192.168.201.*',
    description: '主E9楼',
    user_name: '李四',
    online: 1,
  },
  {
    id: '23',
    pid: '2',
    sort: '3',
    ip: '192.168.202.*',
    description: '主E9楼',
    user_name: '王五',
  },
  {
    id: '3',
    pid: '0',
    sort: '1',
    ip: '192.169.*.*',
    description: '主E9楼',
    user_name: '赵六',
  },
]

const testdata2 = [
  {
    id: '11',
    pid: '1',
    sort: '1',
    isDestribute: '是',
    isOnline: '是',
    ip: '192.168.200.7',
    describe: '',
    group: '大数据组',
    user_name: '何广智',
    online: 1,
  },
  {
    id: '11',
    pid: '1',
    sort: '1',
    isDestribute: '是',
    isOnline: '否',
    ip: '192.168.201.123',
    describe: '',
    group: '运维审计组',
    user_name: '迪玛希',
  },
  {
    id: '11',
    pid: '1',
    sort: '1',
    isDestribute: '否',
    isOnline: '是',
    ip: '192.167.180.18',
    describe: '',
    group: '主E9楼',
    user_name: '程咬金',
    org_name: '工程中心',
  },
]
module.exports = [
  {
    url: '/ipam/online/page',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: 'success',
        data: { pageData: testdata, totalCount: testdata.length },
      }
    },
  },
  {
    url: '/ipam/online/list',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: 'success',
        data: testdata2,
      }
    },
  },
]
