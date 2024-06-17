<template>
  <div class="deviceBlack-container">
    <vab-card shadow="hover">
      <vab-query-form>
        <vab-query-form-top-panel :span="12">
          <el-button :icon="Plus" plain type="primary" @click="handleAdd()">
            添加
          </el-button>
          <el-button :icon="Delete" plain type="danger" @click="handleRevoke()">
            撤销
          </el-button>
        </vab-query-form-top-panel>
        <vab-query-form-right-panel :span="12">
          <el-form inline :model="searchForm">
            <el-form-item>
              <el-select
                v-model="searchForm.option"
                placeholder="选择搜索字段"
                :popper-append-to-body="false"
                style="width: 100px"
              >
                <el-option
                  v-for="item in searchOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model.trim="searchForm.condition"
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
        <el-table-column show-overflow-tooltip type="selection" width="40" />
        <el-table-column align="center" label="序号" type="" width="55">
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>

        <el-table-column
          label="设备名称"
          prop="dev_name"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="设备IP"
          prop="dev_ip"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="组织部门"
          prop="org_name"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="加入原因"
          prop="reason"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="时间"
          prop="time"
          show-overflow-tooltip
          sortable
        />
        <template #empty>
          <!-- <el-image
                class="vab-data-empty"
                :src="require('@/assets/empty_images/data_empty.png')"
              /> -->
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>
      <el-pagination
        v-model:current-page="searchForm.pageNow"
        v-model:page-size="searchForm.pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100, 200, 300, 400, 500, 1000, 10000]"
        :small="small"
        :total="total"
        @current-change="handlePageCurrentChange"
        @size-change="handlePageSizeChange"
      />
    </vab-card>

    <edit ref="editRef" @edit-finish="onEditFinish" />
  </div>
</template>

<script>
  import {
    getDeviceBlackList,
    // doRevoke,
  } from '@/api/desktop/networkAccessManagement/'
  import {
    Plus,
    Edit,
    Delete,
    DArrowLeft,
    Search,
    SortUp,
    SortDown,
  } from '@element-plus/icons-vue'
  import { doRevoke } from '@/api/desktop/networkAccessManagement'

  export default defineComponent({
    name: 'DeviceBlack',
    components: {
      Edit: defineAsyncComponent(() => import('./components/RadBlackListEdit')),
    },
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        total: 0,
        editRef: null,
        tableRef: null,
        currentRow: null,
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true,
        selectRows: '',
        list: [],
        listLoading: true,
        elementLoadingText: '正在加载...',
        searchOptions: [
          {
            value: '*',
            label: '全局搜索',
          },
          {
            value: 'dev_name',
            label: '设备名称',
          },
          {
            value: 'dev_ip',
            label: '设备IP',
          },
          {
            value: 'name',
            label: '组织部门',
          },
        ],
        searchForm: {
          pageNow: 1,
          pageSize: 10,
          option: '*',
          condition: '',
        },
      })
      //获取当前选中行的内容
      const handleCurrentChange = (currentRow) => {
        state.currentRow = currentRow
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
      const setChildrenSelection = (row, selected) => {
        state.tableRef.toggleRowSelection(row, selected)
        if (row.children) {
          row.children.forEach((child) => {
            setChildrenSelection(child, selected)
          })
        }
      }
      //加入黑名单
      const handleAdd = () => {
        state['editRef'].showAdd()
      }
      //撤销黑名单
      const handleRevoke = (row) => {
        if (row && row.id) {
          //row好像一直都是空的
        } else {
          const selectedRows = state.tableRef.getSelectionRows()
          if (selectedRows.length > 0) {
            const usernames = selectedRows.map((item) => item.username).join()
            $baseConfirm('你确定要撤销选中项吗', null, async () => {
              const { data } = await doRevoke({ usernames: usernames })
              if (data === 0)
                $baseMessage('撤销失败', 'error', 'vab-hey-message-error')
              else {
                $baseMessage('撤销成功', 'success', 'vab-hey-message-success')
                fetchData()
              }
            })
          } else {
            $baseMessage('未选中任何行', 'error', 'vab-hey-message-error')
          }
        }
      }
      // 判断是否选择
      const isRowSelected = (row) => {
        let selected = false
        const selectedRows = state.tableRef.getSelectionRows()
        if (selectedRows) {
          const obj = selectedRows.find((val) => {
            return val.dev_hash === row.dev_hash
          })
          if (obj) selected = true
        }
        return selected
      }
      //获取数据
      const fetchData = async () => {
        state.listLoading = true
        const { data } = await getDeviceBlackList(state.searchForm)
        state.list = data.jsonData
        state.total = data.totalCount
        state.listLoading = false
      }
      //处理页面大小改变
      const handlePageSizeChange = (val) => {
        state.searchForm.pageSize = val
        fetchData()
      }
      //当前页面
      const handlePageCurrentChange = (val) => {
        state.searchForm.pageNow = val
        fetchData()
      }
      //编辑完成后刷新界面
      const onEditFinish = () => {
        fetchData()
      }

      // const getParentList = (rootList, id) => {
      //   let i = 0
      //   for (; i < rootList.length; i++) {
      //     const row = rootList[i]
      //     if (row.pid === id) {
      //       return rootList
      //     } else if (row.id === id) {
      //       return row.children
      //     }
      //     if (row.children && row.children.length > 0) {
      //       const result = getParentList(row.children, id)
      //       if (result != null) return result
      //     }
      //   }
      //   return null
      // }

      onMounted(() => {
        fetchData()
      })

      return {
        ...toRefs(state),
        handleAdd,
        handleRevoke,
        fetchData,
        handleRowClick,
        handleCurrentChange,
        handlePageSizeChange,
        handlePageCurrentChange,
        onEditFinish,
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
  $base: '.deviceBlack';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
</style>
