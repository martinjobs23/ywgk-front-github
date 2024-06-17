const List = [
  {
    id: '@id',
    role: 'admin',
    btnRolesCheckedList: ['read:system', 'write:system', 'delete:system'],
  },
  {
    id: '@id',
    role: 'editor',
    btnRolesCheckedList: ['read:system', 'write:system'],
  },
]

module.exports = [
  {
    url: '/role/getList',
    type: 'get',
    response(config) {
      const { role, pageNow = 1, pageSize = 20 } = config.query
      const mockList = List.filter(
        (item) => !(role && item.title.indexOf(role) < 0)
      )
      const list = mockList.filter(
        (item, index) =>
          index < pageSize * pageNow && index >= pageSize * (pageNow - 1)
      )
      return {
        code: 200,
        msg: 'success',
        data: { list, ...{ total: mockList.length } },
      }
    },
  },
  {
    url: '/role/insert',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟保存成功',
      }
    },
  },
  {
    url: '/role/edit',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟保存成功',
      }
    },
  },
  {
    url: '/role/delete',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟删除成功',
      }
    },
  },
]
