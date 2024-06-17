<template>
  <div class="room-management-container">
    <vab-card shadow="hover">
      <vab-query-form>
        <vab-query-form-top-panel :span="12">
          <el-button :icon="Share" plain type="success" @click="setDevice()">
            设备角度
          </el-button>
          <el-button :icon="Share" plain type="success" @click="setSoftware()">
            软件角度
          </el-button>
          <el-button :icon="Share" plain type="success" @click="handleExport()">
            导出
          </el-button>
        </vab-query-form-top-panel>
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
        v-if="device_software"
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
          label="设备分组"
          prop="name"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="软件分发数量"
          prop="count"
          show-overflow-tooltip
          sortable
        />
      </el-table>
      <el-table
        v-if="!device_software"
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
          label="软件名称"
          prop="sw_name"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="软件哈希"
          prop="sw_hash"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="分发数量"
          prop="count"
          show-overflow-tooltip
          sortable
        />
      </el-table>
      <el-pagination
        v-model:current-page="queryForm.pageNow"
        v-model:page-size="queryForm.pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[20, 50, 100, 200, 300, 400, 500, 1000, 10000]"
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
    softwareDistribution_device,
    softwareDistribution_software,
  } from '@/api/analysis/analysis'
  import {
    Plus,
    Edit,
    Delete,
    Search,
    SortUp,
    SortDown,
  } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'SendLog',
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        device_software: true,
        tableRef: null,
        editRef: null,
        list: [],
        total: 0,
        listLoading: false,
        currentRow: null,
        editRow: null,
        queryOptions1: [
          {
            value: '*',
            label: '全局搜索',
          },
          {
            value: 'name',
            label: '设备分组',
          },
        ],
        queryOptions2: [
          {
            value: '*',
            label: '全局搜索',
          },
          {
            value: 'sw_name',
            label: '软件名称',
          },
          {
            value: 'sw_hash',
            label: '软件哈希',
          },
        ],
        queryForm: {
          pageNow: 1,
          pageSize: 20,
          option: '*',
          condition: '',
        },
      })
      const handleCurrentChange = (currentRow) => {
        state.currentRow = currentRow
      }
      const setDevice = () => {
        state.device_software = true
        console.log(state.device_software)
        fetchData()
      }
      const setSoftware = () => {
        state.device_software = false
        console.log(state.device_software)
        fetchData()
      }
      const handleDelete = (row) => {
        if (row && row.id) {
          $baseConfirm('你确定要删除当前项吗', null, async () => {
            const { data } = await doDelete({ id: row.id })
            if (data === 0)
              $baseMessage('删除失败', 'error', 'vab-hey-message-error')
            else {
              $baseMessage('删除成功', 'success', 'vab-hey-message-success')
              fetchData()
            }
          })
        } else {
          const selectedRows = state.tableRef.getSelectionRows()
          if (selectedRows.length > 0) {
            const ids = selectedRows.map((item) => item.id).join()
            $baseConfirm('你确定要删除选中项吗', null, async () => {
              const { data } = await doDelete({ id: ids })
              if (data === 0)
                $baseMessage('删除失败', 'error', 'vab-hey-message-error')
              else {
                $baseMessage('删除成功', 'success', 'vab-hey-message-success')
                fetchData()
              }
            })
          } else {
            $baseMessage('未选中任何行', 'error', 'vab-hey-message-error')
          }
        }
      }

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
      const queryOptions = computed(() => {
        return state.device_software ? state.queryOptions1 : state.queryOptions2
      })
      const fetchData = async () => {
        state.listLoading = true
        if (state.device_software) {
          const { data } = await softwareDistribution_device(state.queryForm)
          state.list = data.jsonData
          console.log(data)
          console.log(data.jsonData)
          state.total = data.totalCount
        } else {
          const { data } = await softwareDistribution_software(state.queryForm)
          state.list = data.jsonData
          console.log(data)
          console.log(data.jsonData)
          state.total = data.totalCount
        }
        state.listLoading = false
      }
      const handlePageSizeChange = (val) => {
        state.queryForm.pageSize = val
        fetchData()
      }
      const handlePageCurrentChange = (val) => {
        state.queryForm.pageNow = val
        fetchData()
      }
      const handleExport = () => {
        console.log('handleExport excel')
        $baseMessage('正在导出，请稍候', 'success', 'vab-hey-message-success')
        state.listLoading = true
        if (state.list.length) {
          state.downloadLoading = true
          if (state.device_software) {
            import('@/utils/excel').then((excel) => {
              const tHeader = ['设备分组', '软件分发数量']
              const filterVal = ['name', 'count']
              const list = state.list
              const data = formatJson(filterVal, list)
              state.title = '软件分发统计(设备角度)'
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: state.title,
              })
              //state.list.clearSelection()
              state.listLoading = false
            })
          } else {
            import('@/utils/excel').then((excel) => {
              const tHeader = ['软件名称', '软件哈希', '分发数量']
              const filterVal = ['sw_name', 'sw_hash', 'count']
              const list = state.list
              const data = formatJson(filterVal, list)
              state.title = '软件分发统计(软件角度)'
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: state.title,
              })
              //state.list.clearSelection()
              state.listLoading = false
            })
          }
        } else {
          $baseMessage('请至少选择一行', 'error', 'vab-hey-message-error')
        }
      }
      const formatJson = (filterVal, jsonData) => {
        return jsonData.map((v) => filterVal.map((j) => v[j]))
      }
      onMounted(() => {
        fetchData()
      })

      return {
        ...toRefs(state),
        queryOptions,
        handleExport,
        formatJson,
        setDevice,
        setSoftware,
        handleDelete,
        handleRowClick,
        handleSelect,
        handleSelectAll,
        handleCurrentChange,
        fetchData,
        handlePageSizeChange,
        handlePageCurrentChange,
        Plus,
        Edit,
        Delete,
        Search,
        SortUp,
        SortDown,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $base: '.room-management';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
</style>
