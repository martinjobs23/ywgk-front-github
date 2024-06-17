<template>
  <div class="hardwareAlert-container">
    <vab-card shadow="hover">
      <vab-query-form>
        <p class="my-text" style="font-size: 18px; text-align: left">
          日志分析内容
        </p>
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
          label="平台名称"
          prop="platname"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="平台IP"
          prop="platip"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="日志内容"
          prop="logcontent"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="时间"
          prop="time"
          show-overflow-tooltip
          sortable
        />
        <el-table-column align="center" label="操作" width="80">
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
  import { getlogAnalyseList } from '@/api/sercuity/logCollection'
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
    name: 'HardwareAlter',
    components: {
      Detail: defineAsyncComponent(() => import('./components/Detail')),
    },
    setup() {
      // const $baseConfirm = inject('$baseConfirm')
      // const $baseMessage = inject('$baseMessage')

      const state = reactive({
        tableRef: null,
        detailRef: null,
        list: [],
        total: 0,
        listLoading: true,
        currentRow: null,
        editRow: null,
        queryOptions: [
          {
            value: '*',
            label: '全局搜索',
          },
          {
            value: 'device_name',
            label: '平台名称',
          },
          {
            value: 'device_ip',
            label: '平台IP',
          },
          {
            value: 'type',
            label: '日志内容',
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
        const { data } = await getlogAnalyseList(state.queryForm)
        state.list = data.jsonData
        console.log('state.list:   ')
        console.log(state.list)
        state.total = data.totalCount
        state.listLoading = false
      }
      //处理页面大小改变
      const handlePageSizeChange = (val) => {
        state.queryForm.pageSize = val
        state.queryForm.pageNow = 1
        fetchData()
      }
      //当前页面
      const handlePageCurrentChange = (val) => {
        state.queryForm.pageNow = val
        fetchData()
      }

      const isRowSelected = (row) => {
        let selected = false
        const selectedRows = state.tableRef.getSelectionRows()
        if (selectedRows) {
          const obj = selectedRows.find((val) => {
            return val.time === row.time
          })
          if (obj) selected = true
        }
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
      const handleRowClick = (row, column) => {
        //console.log('handleRowClick')
        //console.log(column)
        //console.log(event)
        if (column && (column.label === '排序' || column.label === '操作'))
          return

        state.tableRef.toggleRowSelection(row)
        setChildrenSelection(row, isRowSelected(row))
      }
      // const handleSelectAll = (selectRows) => {
      //   let selected = true
      //
      //   if (selectRows.length == 0) {
      //     selected = false
      //   } else {
      //     //如果所有顶级节点都被选中，就全选
      //     let i = 0
      //     for (; i < state.list.length; i++) {
      //       if (isRowSelected(state.list[i]) == false) {
      //         selected = false
      //         break
      //       }
      //     }
      //   }
      //   state.list.forEach((row) => {
      //     setChildrenSelection(row, selected)
      //   })
      // }
      //
      // const handleSelect = (selectedRows, row) => {
      //   //把所有子的选中或取消
      //   setChildrenSelection(row, isRowSelected(row))
      // }
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

      onMounted(() => {
        fetchData()
      })

      return {
        ...toRefs(state),
        handleDetail,
        fetchData,
        handlePageSizeChange,
        handlePageCurrentChange,
        handleRowClick,
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
</script>

<style lang="scss" scoped>
  $base: '.info-management';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
</style>
