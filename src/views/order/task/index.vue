<template>
  <div class="deviceBlack-container">
    <vab-card shadow="hover">
      <vab-query-form>
        <vab-query-form-top-panel :span="12">
          <el-button
            :icon="DArrowRight"
            plain
            type="primary"
            @click="handleExport()"
          >
            导出
          </el-button>
          <el-button
            :icon="DArrowLeft"
            plain
            type="primary"
            @click="handleSync()"
          >
            同步信息
          </el-button>
        </vab-query-form-top-panel>
        <vab-query-form-right-panel :span="12">
          <el-form inline :model="searchForm">
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
          label="工作票状态"
          prop="status"
          show-overflow-tooltip
          sortable
        >
          <template #default="{ row }">
            <vab-icon
              v-if="row.status == 4"
              icon="close-circle-line"
              style="color: #ea9999"
            />
            <vab-icon
              v-if="
                row.status == 5 &&
                new Date(row.start_time).setMinutes(
                  new Date(row.start_time).getMinutes() - 30
                ) < new Date()
              "
              icon="checkbox-circle-fill"
              style="color: #92ca41"
            />
            <vab-icon
              v-if="
                row.status == 5 &&
                new Date(row.start_time).setMinutes(
                  new Date(row.start_time).getMinutes() - 30
                ) >= new Date()
              "
              icon="checkbox-circle-fill"
              style="color: #cccccc"
            />
            {{
              // 状态  0-失效，1-草稿，2-正常工作(endTime过期为历史), 3-待审核票箱  4-审核通过等待复审
              row.status == 4
                ? '待许可'
                : new Date(row.start_time).setMinutes(
                    new Date(row.start_time).getMinutes() - 30
                  ) < new Date()
                ? '可运维'
                : '未到开始时间'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="名称"
          prop="order_name"
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
          prop="name"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="目标设备IP"
          prop="ip"
          show-overflow-tooltip
          sortable
        >
          <template #default="{ row }">
            <el-tooltip
              class="box-item"
              :content="row.onlineStatus"
              effect="dark"
              placement="top"
            >
              <vab-icon
                v-if="row.online == 1"
                icon="checkbox-circle-fill"
                style="color: #92ca41"
              />
            </el-tooltip>
            <el-tooltip
              class="box-item"
              content="Loading"
              effect="dark"
              placement="top"
            >
              <vab-icon
                v-if="row.online == null"
                icon="loader-2-fill"
                style="color: #cccccc"
              />
            </el-tooltip>
            <el-tooltip
              class="box-item"
              :content="row.onlineStatus"
              effect="dark"
              placement="top"
            >
              <vab-icon v-if="row.online == 0" icon="close-circle-line" />
            </el-tooltip>
            {{ row.ip }}
          </template>
        </el-table-column>
        <el-table-column
          label="特权账号"
          prop="tqzh"
          show-overflow-tooltip
          sortable
        >
          <template #default="{ row }">
            {{ row.tqzh === ' ' || !row.tqzh ? '无' : row.tqzh }}
          </template>
        </el-table-column>
        <el-table-column
          label="运维人员"
          prop="operatorList"
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
        <el-table-column align="center" label="操作" width="80">
          <template #default="{ row }">
            <el-link
              v-if="getProtocol(row, 'SSH')"
              :icon="Folder"
              type="success"
              :underline="false"
              @click="doTaskSsh(row)"
            />
            <el-link
              v-if="getProtocol(row, 'RDP')"
              :icon="Mouse"
              style="color: #ff0000"
              type="danger"
              :underline="false"
              @click="doTaskRdp(row)"
            />
            <el-link
              v-if="getProtocol(row, 'MySQL')"
              :icon="Edit"
              style="color: #ff0000"
              type="danger"
              :underline="false"
              @click="doTaskMySQL(row)"
            />
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
    <upload ref="uploadRef" @finish-fetchdata="fetchData" />
    <edit ref="editRef" @edit-finish="onEditFinish" />
  </div>
</template>

<script>
  import { getOrderDevice, permission } from '@/api/order/orderTask'
  import {
    Plus,
    Upload,
    Edit,
    Delete,
    DArrowLeft,
    DArrowRight,
    Search,
    SortUp,
    SortDown,
    CircleCheck,
    Folder,
    Mouse,
  } from '@element-plus/icons-vue'
  import { getDeviceState } from '@/api/dev/info'
  export default defineComponent({
    name: 'DeviceBlack',
    components: {
      Upload: defineAsyncComponent(() => import('./components/AssetUpload')),
      Edit: defineAsyncComponent(() => import('./components/InfoEdit.vue')),
    },
    setup() {
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
            value: 'order_name',
            label: '工作票名称',
          },
          {
            value: 'deviceObject',
            label: '目标系统',
          },
          {
            value: 'name',
            label: '目标设备',
          },
          {
            value: 'ip',
            label: '目标设备IP',
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

      // 导入文件
      const handleImport = () => {
        state['uploadRef'].showUpload(
          state.treeData,
          state.typelist,
          [
            '名称',
            '目标系统IP',
            '运维人员',
            '工作票开始时间',
            '工作票结束时间',
            '是否生效',
          ],
          state.searchForm.type_id
        )
      }

      // 导出
      const handleExport = () => {
        $baseMessage('正在导出，请稍候', 'success', 'vab-hey-message-success')
        state.listLoading = true
        if (state.list.length) {
          state.downloadLoading = true
          import('@/utils/excel').then((excel) => {
            const tHeader = [
              '名称',
              '目标系统IP',
              '运维人员',
              '工作票开始时间',
              '工作票结束时间',
              '是否可操作',
            ]
            const filterVal = [
              'order_name',
              'deviceList',
              'operatorList',
              'start_time',
              'end_time',
              'status',
            ]

            const list = state.list
            const data = formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: state.title,
            })
            //state.list.clearSelection()
            state.listLoading = false
          })
        } else {
          $baseMessage('请至少选择一行', 'error', 'vab-hey-message-error')
        }
      }
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
      // SSH运维操作
      const doTaskSsh = async (row) => {
        state.editRow = row
        const result = await permission(state.editRow)
        if (result.msg === 'success') {
          state['editRef'].showSsh(row)
        } else {
          $baseMessage(result.msg, 'error', result.data)
        }
      }
      // RDP运维操作
      const doTaskRdp = async (row) => {
        state.editRow = row
        const result = await permission(state.editRow)
        if (result.msg === 'success') {
          state['editRef'].showRdp(row)
        } else {
          $baseMessage(result.msg, 'error', result.data)
        }
      }
      // MySQL运维操作
      const doTaskMySQL = async (row) => {
        state.editRow = row
        const result = await permission(state.editRow)
        if (result.msg === 'success') {
          state['editRef'].showMySQL(row)
        } else {
          $baseMessage(result.msg, 'error', result.data)
        }
      }
      //刷新表格中数据
      const handleSync = () => {
        fetchData()
        $baseMessage(
          '工作票信息同步成功!',
          'success',
          'vab-hey-message-success'
        )
      }

      const fetchDevStatus = async () => {
        const {
          data: { message, status },
        } = await getDeviceState({ ids: state.ids })
        if (status) {
          const devState = message
            .replace('OK:', '')
            .slice(0, -1)
            .split(',')
            .map(String)
          state.list.forEach((x) => {
            let obj = devState.find((item) => {
              return item.includes(x.ip + ':')
            })
            if (obj) {
              if (obj.includes('+')) {
                x.online = 1
              } else {
                x.online = 0
              }
              obj = obj
                .replace(/\*/g, '超时 ')
                .replace(/-/g, '×失败 ')
                .replace(/\+/g, '√成功 ')
              x.onlineStatus = obj
            }
          })
        }
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
        const { data } = await getOrderDevice(state.searchForm)
        state.list = data.rows
        // 用来查询设备状态的id串
        let ids = ''
        state.list.forEach((row) => {
          ids += row.DEVICE_ID + ','
        })
        state.ids = ids.slice(0, -1)
        state.total = data.total
        fetchDevStatus()
        state.listLoading = false
      }

      // 判断协议类型
      const getProtocol = (row, protocol) => {
        if (row.device_protocol !== undefined) {
          return (
            row.device_protocol.find((item) => item.protocol === protocol) !==
            undefined
          )
        }
        return false
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
        fetchData,
        fetchDevStatus,
        getProtocol,
        doTaskSsh,
        doTaskRdp,
        doTaskMySQL,
        formatJson,
        handleSync,
        handleRowClick,
        handleCurrentChange,
        handlePageSizeChange,
        handlePageCurrentChange,
        onEditFinish,
        handleImport,
        handleExport,
        Plus,
        Edit,
        Upload,
        Delete,
        DArrowLeft,
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
