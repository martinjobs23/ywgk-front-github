/**
 * @description 格式化时间
 * @param time
 * @param cFormat
 * @returns {string|null}
 */
export function parseTime(time: string | number | Date, cFormat: string) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  return format.replace(
    /{([ymdhisa])+}/g,
    (result: string | any[], key: string) => {
      let value = formatObj[key]
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value]
      }
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    }
  )
}

/**
 * @description 格式化时间
 * @param time
 * @param option
 * @returns {string}
 */
export function formatTime(time: any | number | Date, option: any) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d: any = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @description 将url请求参数转为json格式
 * @param url
 * @returns {{}|any}
 */
export function paramObj(url: string) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    `{"${decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ')}"}`
  )
}

/**
 * @description 父子关系的数组转换成树形结构数据
 * @param data
 * @returns {*}
 */
export function translateDataToTree(data: any[]) {
  data.sort((a, b) => {
    if (a.sort == undefined || a.sort == null) return 1
    if (b.sort == undefined || b.sort == null) return -1
    return a.sort - b.sort
  })

  const parent = data.filter((value) => value.pid === 0)
  const children = data.filter((value) => value.pid !== 0)

  const translator = (parent: any[], children: any[]) => {
    parent.forEach((parent: { id: any; children: any[] }) => {
      children.forEach((current: { pid: any }, index: any) => {
        if (current.pid === parent.id) {
          const temp = JSON.parse(JSON.stringify(children))
          temp.splice(index, 1)
          translator([current], temp)
          typeof parent.children !== 'undefined'
            ? parent.children.push(current)
            : (parent.children = [current])
        }
      })
    })
  }
  translator(parent, children)
  return parent
}

export function toTree(data) {
  // 删除 所有 children,以防止多次调用
  data.forEach(function (item) {
    if (typeof item.children == 'undefined') {
      //console.log('toTree item.id=' + item.id + ' children undefined')
      Object.defineProperty(item, 'children', {
        value: null,
        writable: true,
        enumerable: true,
        configurable: true,
      })
    } else {
      //console.log(
      //  'toTree item.id=' + item.id + ' children type: ' + typeof item.children
      //)
      delete item.children
    }
  })

  //排序
  data.sort((a: any, b: any) => {
    if (a.sort == undefined || a.sort == null) return 1
    if (b.sort == undefined || b.sort == null) return -1
    return a.sort - b.sort
  })

  //console.log(data)

  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  const map = {}
  data.forEach(function (item) {
    map[item.id] = item
  })
  const val = []
  data.forEach(function (item) {
    // 以当前遍历项，的pid,去map对象中找到索引的id
    const parent = map[item.pid]
    // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
    if (parent) {
      // eslint-disable-next-line prettier/prettier
      ; (parent.children || (parent.children = [])).push(item)
    } else {
      //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
      val.push(item)
    }
  })

  //console.log(val)
  return val
}

/**
 * @description 树形结构数据转换成父子关系的数组
 * @param data
 * @returns {[]}
 */
export function translateTreeToData(data: any[]) {
  const result: { id: any; name: any; parentId: any }[] = []
  data.forEach((item: any) => {
    const loop = (data: { id: any; name: any; pid: any; children: any }) => {
      result.push({
        id: data.id,
        name: data.name,
        parentId: data.pid,
      })
      const child = data.children
      if (child) {
        for (let i = 0; i < child.length; i++) {
          loop(child[i])
        }
      }
    }
    loop(item)
  })
  return result
}

/**
 * @description 10位时间戳转换
 * @param time
 * @returns {string}
 */
export function tenBitTimestamp(time: number) {
  const date = new Date(time * 1000)
  const y = date.getFullYear()
  let m: any = date.getMonth() + 1
  m = m < 10 ? '' + m : m
  let d: any = date.getDate()
  d = d < 10 ? '' + d : d
  let h: any = date.getHours()
  h = h < 10 ? '0' + h : h
  let minute: any = date.getMinutes()
  let second: any = date.getSeconds()
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  return y + '年' + m + '月' + d + '日 ' + h + ':' + minute + ':' + second //组合
}

/**
 * @description 13位时间戳转换
 * @param time
 * @returns {string}
 */
export function thirteenBitTimestamp(time: number) {
  const date = new Date(time / 1)
  const y = date.getFullYear()
  let m: any = date.getMonth() + 1
  m = m < 10 ? '' + m : m
  let d: any = date.getDate()
  d = d < 10 ? '' + d : d
  let h: any = date.getHours()
  h = h < 10 ? '0' + h : h
  let minute: any = date.getMinutes()
  let second: any = date.getSeconds()
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  return y + '年' + m + '月' + d + '日 ' + h + ':' + minute + ':' + second //组合
}

/**
 * @description 获取随机id
 * @param length
 * @returns {string}
 */
export function uuid(length = 32) {
  const num = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  let str = ''
  for (let i = 0; i < length; i++) {
    str += num.charAt(Math.floor(Math.random() * num.length))
  }
  return str
}

/**
 * @description m到n的随机数
 * @param m
 * @param n
 * @returns {number}
 */
export function random(m: number, n: number) {
  return Math.floor(Math.random() * (m - n) + n)
}

/**
 * @description 数组打乱
 * @param array
 * @returns {*}
 */
export function shuffle(array: any[]) {
  let m = array.length,
    t,
    i
  while (m) {
    i = Math.floor(Math.random() * m--)
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }
  return array
}
