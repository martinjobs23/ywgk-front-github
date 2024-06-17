<template>
  <div class="networkAccessResult-container">
    <vab-card shadow="hover">
      <vab-query-form>
        <vab-query-form-top-panel :span="12" />
        <vab-query-form-right-panel :span="12">
          <el-form inline :model="queryForm">
            <el-form-item>
              <el-select
                v-model="queryForm.option"
                placeholder="选择搜索字段"
                :popper-append-to-body="false"
                style="width: 100px"
              >
                <el-option
                  v-for="item in queryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model.trim="queryForm.condition"
                autofocus="true"
                placeholder="请输入查询值"
                style="margin-left: 10px"
                @keyup.enter="fetchData"
              />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" type="primary" @click="fetchData">
                查询
              </el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table
        ref="tableRef"
        v-loading="listLoading"
        border
        :data="list"
        :default-expand-all="true"
        highlight-current-row
        row-key="id"
        size="small"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @current-change="handleCurrentChange"
        @row-click="handleRowClick"
        @select="handleSelect"
        @select-all="handleSelectAll"
      >
        <!--        @selection-change="onTableSelectChange"-->
        <!--        @sort-change="ondataTableChange"-->
        <el-table-column show-overflow-tooltip type="selection" width="40" />
        <el-table-column align="center" label="序号" type="" width="55">
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>

        <el-table-column
          label="设备ip"
          prop="dev_ip"
          show-overflow-tooltip
          sortable
        />

        <el-table-column
          label="使用人"
          prop="user_name"
          show-overflow-tooltip
          sortable
        />
        <el-table-column align="center" fixed="right" label="操作" width="80">
          <template #default="{ row }">
            <el-button type="text" @click="handleDetail(row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <!-- <el-image
                class="vab-data-empty"
                :src="require('@/assets/empty_images/data_empty.png')"
              /> -->
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>
      <el-pagination
        v-model:current-page="queryForm.pageNow"
        v-model:page-size="queryForm.pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100, 200, 300, 400, 500, 1000, 10000]"
        :small="small"
        :total="total"
        @current-change="handlePageCurrentChange"
        @size-change="handlePageSizeChange"
      />
    </vab-card>

    <detail ref="detailRef" @detail-finish="onDetailFinish" />
  </div>
</template>

<script>
  // import { getStartupList } from '@/api/monitor/startItem'
  import { getIpList } from '@/api/monitor/startItem'
  import { getStartupBlackList } from '@/api/monitor/startItem'
  import {
    Plus,
    Edit,
    Delete,
    DArrowLeft,
    Search,
    SortUp,
    SortDown,
  } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'SystemPreformanceResult',
    components: {
      Detail: defineAsyncComponent(() => import('./components/startupDetail')),
    },
    setup() {
      // const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        total: 0,
        detailRef: null,
        tableRef: null,
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true,
        selectRows: '',
        list: [],
        blackList: [],
        listLoading: true,
        elementLoadingText: '正在加载...',
        queryOptions: [
          {
            value: '*',
            label: '全局搜索',
          },
          {
            value: 'dev_ip',
            label: '设备ip',
          },
        ],
        queryForm: {
          pageNow: 1,
          pageSize: 10,
          option: '*',
          condition: '',
        },
      })
      //展示详情页
      const handleDetail = (row) => {
        state.editRow = row
        state['detailRef'].show(row)
      }
      //获取数据
      const fetchData = async () => {
        state.listLoading = true
        const { data } = await getIpList(state.queryForm)
        const blackList = await getStartupBlackList()
        state.list = data.jsonData
        state.total = data.totalCount
        state.blackList = blackList.data.jsonData
        // 遍历原始数据的jsonData数组，为每个对象添加isBlack属性
        state.list.forEach((item) => {
          item.isBlack = 'false' // 添加isBlack属性并赋值为"false"
        })
        console.log(blackList)
        console.log(state.list)
        console.log(state.blackList)
        checkIfBlacklisted(state.list, state.blackList)
        state.listLoading = false
      }
      //更改密码
      const handlePassChange = (row) => {
        state.editRow = row
        $baseMessage('密码修改功能尚未完成', 'error')
      }
      //当前行是否被选中
      const isRowSelected = (row) => {
        let selected = false
        const selectedRows = state.tableRef.getSelectionRows()
        if (selectedRows) {
          const obj = selectedRows.find((val) => {
            //这一行很重要，要随row变化
            return val.id === row.id
          })
          if (obj) selected = true
        }
        //selected没有更新
        return selected
      }
      const setChildrenSelection = (row, selected) => {
        state.tableRef.toggleRowSelection(row, selected)
        if (row.children) {
          row.children.forEach((child) => {
            setChildrenSelection(child, selected)
          })
        }
      }
      //处理点击行
      const handleRowClick = (row, column) => {
        // console.log('handleRowClick')
        // console.log(row)
        // console.log(column)
        //console.log(event)
        if (column && (column.label === '排序' || column.label === '操作'))
          return

        state.tableRef.toggleRowSelection(row)
        setChildrenSelection(row, isRowSelected(row))
      }
      const handleSelectAll = (selectRows) => {
        let selected = true

        if (selectRows.length == 0) {
          selected = false
        } else {
          //如果所有顶级节点都被选中，就全选
          let i = 0
          for (; i < state.list.length; i++) {
            if (isRowSelected(state.list[i]) == false) {
              selected = false
              break
            }
          }
        }
        state.list.forEach((row) => {
          setChildrenSelection(row, selected)
        })
      }

      const handleSelect = (selectedRows, row) => {
        //把所有子的选中或取消
        setChildrenSelection(row, isRowSelected(row))
      }
      //处理页面大小改变
      const handlePageSizeChange = (val) => {
        state.queryForm.pageSize = val
        fetchData()
      }
      //当前页面
      const handlePageCurrentChange = (val) => {
        state.queryForm.pageNow = val
        fetchData()
      }

      const onDetailFinish = (newData) => {
        let pid = -1
        let oldParentList = null
        if (state.editRow) {
          pid = state.editRow.pid
          oldParentList = getParentList(state.list, pid)
        } else {
          //添加
          /*
          oldParentList = state.list
          state.list.push(newData) //push的数据没有$treeNodeId?? name为空
          state.editRow = newData
          state.total++
          */
          //重新加载数据
          fetchData()
          return
        }

        //如果pid变化了，重新组织树形结构
        if (pid != newData.pid) {
          const newParentList = getParentList(state.list, newData.pid)

          //原来的里面删除
          const index = oldParentList.findIndex((x) => {
            return x.id == state.editRow.id
          })
          oldParentList.splice(index, 1)

          //新的添加,根据sort放到合适位置
          let i = 0
          let newIndex = 0
          for (; i < newParentList.length; i++) {
            if (
              newParentList[i].sort == undefined ||
              newParentList[i].sort == null ||
              newParentList[i].sort > newData.sort
            )
              break
            else newIndex = i
          }
          newParentList.splice(newIndex + 1, 0, state.editRow)
        }

        //更新数据
        Object.keys(state.editRow).forEach((key) => {
          state.editRow[key] = newData[key]
        })
      }

      const getParentList = (rootList, id) => {
        let i = 0
        for (; i < rootList.length; i++) {
          const row = rootList[i]
          if (row.pid === id) {
            return rootList
          } else if (row.id === id) {
            return row.children
          }
          if (row.children && row.children.length > 0) {
            const result = getParentList(row.children, id)
            if (result != null) return result
          }
        }
        return null
      }

      onMounted(() => {
        fetchData()
      })

      return {
        ...toRefs(state),
        fetchData,
        handleDetail,
        handlePassChange,
        handleRowClick,
        handleSelect,
        handleSelectAll,
        handlePageSizeChange,
        handlePageCurrentChange,
        onDetailFinish,
        Plus,
        Edit,
        Delete,
        DArrowLeft,
        Search,
        SortUp,
        SortDown,
      }
    },
  })
  function checkIfBlacklisted(list, blackList) {
    // 遍历 list 数组中的每个元素
    for (let i = 0; i < list.length; i++) {
      // let isBlacklisted = false // 标记当前元素是否在黑名单中

      // 遍历 blackList 数组中的每个元素
      for (let j = 0; j < blackList.length; j++) {
        // 如果当前元素的 startup 属性与某个黑名单元素的 startup 属性相同，则标记为已在黑名单中
        if (list[i].startup === blackList[j].key_value) {
          // isBlacklisted = true
          list[i].isBlack = 'true'
          break // 已经在黑名单中，可以退出内层循环
        }
      }

      // 输出结果，或者根据 isBlacklisted 的值执行其他操作
      //console.log(`Element ${i} is${isBlacklisted ? '' : ' not'} blacklisted.`)
    }
  }
</script>

<style lang="scss" scoped>
  $base: '.info-management';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
</style>
