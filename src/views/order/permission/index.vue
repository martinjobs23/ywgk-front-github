<template>
  <div class="deviceBlack-container">
    <vab-card shadow="hover">
      <vab-query-form>
        <vab-query-form-top-panel :span="12">
          <el-button :icon="Refresh" plain type="primary" @click="handleSync()">
            同步信息
          </el-button>
        </vab-query-form-top-panel>
        <vab-query-form-right-panel :span="12">
          <el-form inline :model="searchForm">
            ·
            <el-form-item>
              <el-select
                v-model="searchForm.option"
                placeholder="选择搜索字段"
                :popper-append-to-body="false"
                style="width: 150px"
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
        @select-all="handleSelectAll"
      >
        <el-table-column align="center" label="序号" type="" width="55">
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          label="工作票编号"
          prop="order_num"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="工作票名称"
          prop="order_name"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="审批人员"
          prop="spe_user"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="目标系统"
          prop="deviceObject"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="目标设备"
          prop="deviceListName"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="目标设备IP"
          prop="deviceList"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="特权账号"
          prop="tqzh"
          show-overflow-tooltip
          sortable
        >
          <template #default="{ row }">
            {{ row && row.tqzh ? row.tqzh.replace(/null/g, '无') : '数据缺失' }}
          </template>
        </el-table-column>
        <el-table-column
          label="运维人员"
          prop="operatorList"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="工作票创建时间"
          prop="create_time"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="工作票开始时间"
          prop="start_time"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="工作票结束时间"
          prop="end_time"
          show-overflow-tooltip
          sortable
        />
        <el-table-column align="center" label="操作" width="180">
          <template #default="{ row }">
            <el-button plain type="primary" @click="passOrderClick(row)">
              许可
            </el-button>
            <el-button plain type="primary" @click="refuseOrderClick(row)">
              驳回
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
  </div>
</template>

<script>
  import {
    getOrderList,
    permissionOrder,
    refuseOrder,
  } from '@/api/order/orderPermission'
  import {
    Plus,
    Delete,
    DArrowLeft,
    Refresh,
    DArrowRight,
    Search,
    SortUp,
    SortDown,
    CircleCheck,
    Folder,
    Mouse,
  } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'DeviceBlack',
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        total: 0,
        editRef: null,
        tableRef: null,
        currentRow: null,
        uploadRef: null,
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true,
        selectRows: '',
        list: [],
        title: '工作票任务',
        listLoading: true,
        elementLoadingText: '正在加载...',
        searchOptions: [
          {
            value: '*',
            label: '全局搜索',
          },
          {
            value: 'order_num',
            label: '工作票编号',
          },
          {
            value: 'spe_user',
            label: '审批人员',
          },
          {
            value: 'order_name',
            label: '工作票名称',
          },
          {
            value: 'deviceObject',
            label: '目标系统',
          },
          {
            value: 'deviceListName',
            label: '目标设备',
          },
          {
            value: 'deviceList',
            label: '目标设备IP',
          },
          {
            value: 'tqzh',
            label: '特权账号',
          },
          {
            value: 'operatorList',
            label: '运维人员',
          },
        ],
        searchForm: {
          pageNow: 1,
          pageSize: 10,
          option: '*',
          condition: '',
        },
      })
      const formatJson = (filterVal, jsonData) => {
        return jsonData.map((v) => filterVal.map((j) => v[j]))
      }
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

      // 审批通过工作票
      const passOrderClick = async (row) => {
        if (!row) {
          if (state.currentRow != null && isRowSelected(state.currentRow)) {
            row = state.currentRow
          } else {
            const selectedRows = state.tableRef.getSelectionRows()
            if (selectedRows && selectedRows.length > 0) {
              row = selectedRows[0]
              state.tableRef.setCurrentRow(row)
            } else {
              $baseMessage('未选中任何行', 'error')
              return false
            }
          }
        }
        state.editRow = row
        state.editRow.status = '5'
        $baseConfirm('你确定要审核通过该工作票吗？', null, async () => {
          const result = await permissionOrder(state.editRow)
          if (result.data === 'success') {
            $baseMessage(result.msg, 'success', 'vab-hey-message-success')
            fetchData()
          } else {
            $baseMessage(result.msg, 'error', 'vab-hey-message-error')
          }
        })
      }
      // 驳回工作票
      const refuseOrderClick = async (row) => {
        if (!row) {
          if (state.currentRow != null && isRowSelected(state.currentRow)) {
            row = state.currentRow
          } else {
            const selectedRows = state.tableRef.getSelectionRows()
            if (selectedRows && selectedRows.length > 0) {
              row = selectedRows[0]
              state.tableRef.setCurrentRow(row)
            } else {
              $baseMessage('未选中任何行', 'error')
              return false
            }
          }
        }
        state.editRow = row
        state.editRow.status = '2'
        $baseConfirm('你确定要驳回该工作票吗？', null, async () => {
          const result = await refuseOrder(state.editRow)
          if (result.data === 'success') {
            $baseMessage(result.msg, 'success', 'vab-hey-message-success')
            fetchData()
          } else {
            $baseMessage(result.msg, 'error', 'vab-hey-message-error')
          }
        })
      }

      //刷新表格中数据
      const handleSync = () => {
        fetchData()
        $baseMessage(
          '待审核工作票信息同步成功!',
          'success',
          'vab-hey-message-success'
        )
      }

      // 判断是否选择
      const isRowSelected = (row) => {
        let selected = false
        const selectedRows = state.tableRef.getSelectionRows()
        if (selectedRows) {
          const obj = selectedRows.find((val) => {
            return val.id === row.id
          })
          if (obj) selected = true
        }
        return selected
      }

      //获取数据
      const fetchData = async () => {
        state.listLoading = true
        const { data } = await getOrderList(state.searchForm)
        state.list = data.rows
        state.total = data.total
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
        fetchData,
        passOrderClick,
        refuseOrderClick,
        formatJson,
        handleSync,
        handleRowClick,
        handleCurrentChange,
        handlePageSizeChange,
        handlePageCurrentChange,
        onEditFinish,
        Plus,
        Delete,
        DArrowLeft,
        Refresh,
        DArrowRight,
        Search,
        SortUp,
        SortDown,
        CircleCheck,
        Folder,
        Mouse,
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
