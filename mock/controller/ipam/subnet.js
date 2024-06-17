const testdata2 = [
  {
    id: 1,
    pid: 0,
    sort: 2,
    name: '918服务器',
    ip: '192.168.200.0',
    mask: '24',
    is_reserved: 0,
    description: '服务器网段',
  },
  {
    id: 2,
    pid: 1,
    sort: 1,
    name: '918服务器3',
    ip: '192.168.200.0',
    mask: '28',
    is_reserved: 1,
    description: '这个网段属于测试组2',
  },
  {
    id: 3,
    pid: 1,
    sort: 2,
    name: '918服务器2',
    ip: '192.168.200.16',
    mask: '25',
    is_reserved: 0,
    description: '这个网段属于测试组2',
  },
  {
    id: 4,
    pid: 1,
    sort: 3,
    name: '918服务器200',
    ip: '192.168.200.128',
    mask: '25',
    is_reserved: 0,
    description: '这个网段属于测试组2',
  },

  {
    id: 5,
    pid: 0,
    sort: 1,
    name: '100服务器',
    ip: '192.168.100.0',
    mask: '24',
    is_reserved: 0,
    description: '服务器网段1',
  },
]

module.exports = [
  {
    url: '/ipam/subnet/getPermissions',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: 'success',
        data: testdata1,
      }
    },
  },
  {
    url: '/ipam/subnet/navigate',
    type: 'post',
    response() {
      return {
        code: 201,
        msg: 'success',
        data: testdata2,
      }
    },
  },
  {
    url: '/ipam/subnet/add',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟保存成功',
      }
    },
  },
  {
    url: '/ipam/subnet/update',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟保存成功',
      }
    },
  },
  {
    url: '/ipam/subnet/delete',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟删除成功',
      }
    },
  },
]
