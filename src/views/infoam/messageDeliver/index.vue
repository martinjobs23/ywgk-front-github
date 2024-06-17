<template>
  <div class="info-management-container">
    <vab-card shadow="hover">
      <h1>请选择要通知的设备</h1>
      <vab-query-form>
        <vab-query-form-right-panel :span="15">
          <el-form
            inline
            :model="queryForm"
            style="position: relative; left: 10px"
          >
            <div style="display: flex">
              <el-select
                v-model="queryForm.option"
                class="my-select"
                placeholder="选择搜索字段"
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="item in queryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-input
                v-model.trim="queryForm.condition"
                autofocus="true"
                placeholder="请输入查询值"
                style="margin-left: 10px"
                @keyup.enter="fetchData"
              />
              <el-button
                :icon="Search"
                style="margin-left: 10px"
                type="primary"
                @click="fetchData"
              >
                查询
              </el-button>
              <el-button
                class="container1"
                plain
                type="primary"
                @click="handleSend()"
              >
                发送通知
              </el-button>
            </div>
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
          label="终端名称"
          min-width="120"
          prop="dev_name"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="型号"
          min-width="80"
          prop="model"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="IP地址"
          min-width="80"
          prop="dev_ip"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="启动时间"
          prop="online_time"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="上线地址"
          min-width="80"
          show-overflow-tooltip
          sortable
        >
          <template #default="{ row }">
            <vab-icon
              v-if="row.online == 1"
              icon="checkbox-circle-fill"
              style="color: #92ca41"
            />
            <vab-icon
              v-if="row.online == 0 && row.online_time"
              icon="checkbox-circle-fill"
              style="color: #cccccc"
            />
            <vab-icon
              v-if="row.online == 0 && row.online_time == null"
              icon="close-circle-line"
            />
            {{ row.online_ip }}
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>

      <!--      <el-pagination
        v-model:current-page="queryForm.pageNow"
        v-model:page-size="queryForm.pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[20, 50, 100, 200, 300, 400, 500, 1000, 10000]"
        :small="small"
        :total="total"
        @current-change="handlePageCurrentChange"
        @size-change="handlePageSizeChange"
      />-->
    </vab-card>
    <edit ref="editRef" @finish-fetchdata="fetchData" />
  </div>
</template>

<script>
  import { useTabsStore } from '@/store/modules/tabs'
  import {
    doDelete,
    doVerifyOK,
    setNumber,
    getTypeList,
  } from '@/api/asset/info'
  import { getTree as getOrgTree } from '@/api/admin/org'
  import {
    Plus,
    Edit,
    Delete,
    DArrowLeft,
    DArrowRight,
    Search,
    SortUp,
    SortDown,
    CircleCheck,
  } from '@element-plus/icons-vue'
  import { getCheckList } from '@/api/desktop/terminalManager'
  export default defineComponent({
    name: 'Info',
    components: {
      Edit: defineAsyncComponent(() => import('./components/InfoEdit')),
    },
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')
      const route = useRoute()
      const tabsStore = useTabsStore()
      const { changeTabsMeta } = tabsStore
      const state = reactive({
        tableRef: null,
        uploadRef: null,
        editRef: null,
        verifyRef: null,
        list: [],
        test: [
          {
            prop: 'date',
            label: 'Date',
          },
          {
            prop: 'name',
            label: 'Name',
          },
          {
            prop: 'address',
            label: 'Address',
          },
        ],
        typelist: [],
        fieldSet: new Set([]),
        editFieldSet: new Set([]),
        total: 0,
        listLoading: true,
        currentRow: null,
        editRow: null,
        title: null,
        queryOptions: [
          {
            value: '*',
            label: '全局搜索',
          },
          {
            value: 'dev_name',
            label: '名称',
          },
          {
            value: 'description',
            label: '描述',
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

      const handleSend = () => {
        let ips = ''
        const selectedRows = state.tableRef.getSelectionRows()
        if (selectedRows && selectedRows.length > 0) {
          for (let i = 0; i < selectedRows.length; i++) {
            ips += selectedRows[i].dev_ip + ','
          }
        } else {
          $baseMessage('未选中任何设备', 'error')
          return false
        }
        console.log(ips)
        state['editRef'].showSend(ips)
      }

      const handleAdd = () => {
        let pid = 0
        if (state.currentRow != null && isRowSelected(state.currentRow)) {
          pid = state.currentRow.pid
        } else {
          const selectedRows = state.tableRef.getSelectionRows()
          if (selectedRows && selectedRows.length > 0) {
            pid = selectedRows[0].id
          }
        }
        state.editRow = null
        state['editRef'].showAdd(
          state.treeData,
          pid,
          state.typelist,
          state.fieldSet,
          state.editFieldSet,
          state.queryForm.type_id
        )
      }
      const handleEdit = (row) => {
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
        state['editRef'].showEdit(
          state.treeData,
          row,
          state.typelist,
          state.fieldSet,
          state.editFieldSet
        )
      }
      const handleMultiEdit = (row) => {
        const ids = []
        const selectedRows = state.tableRef.getSelectionRows()
        if (selectedRows && selectedRows.length > 0) {
          row = selectedRows[0]
          state.tableRef.setCurrentRow(row)
          if (selectedRows.length == 1) return handleEdit(row)
          selectedRows.forEach((x) => {
            ids.push(x.id)
          })
        } else {
          $baseMessage('未选中任何行', 'error')
          return false
        }

        state.editRow = row
        state['editRef'].showMultiEdit(
          state.treeData,
          row,
          state.typelist,
          state.fieldSet,
          state.editFieldSet,
          ids
        )
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
      const handleVerifyOK = (row) => {
        if (row && row.id) {
          $baseConfirm('你确定要把当前项设置为校验完成吗？', null, async () => {
            const { data } = await doVerifyOK({ id: row.id })
            if (data === 0)
              $baseMessage('设置失败', 'error', 'vab-hey-message-error')
            else {
              $baseMessage('设置成功', 'success', 'vab-hey-message-success')
              fetchData()
            }
          })
        } else {
          const selectedRows = state.tableRef.getSelectionRows()
          if (selectedRows.length > 0) {
            const ids = selectedRows.map((item) => item.id).join()
            $baseConfirm(
              '你确定要把选中项都设置为校验完成吗？',
              null,
              async () => {
                const { data } = await doVerifyOK({ id: ids })
                if (data === 0)
                  $baseMessage('设置失败', 'error', 'vab-hey-message-error')
                else {
                  $baseMessage('设置成功', 'success', 'vab-hey-message-success')
                  fetchData()
                }
              }
            )
          } else {
            $baseMessage('未选中任何行', 'error', 'vab-hey-message-error')
          }
        }
      }
      const handleVerify = (row) => {
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
        state['verifyRef'].showVerify(
          state.treeData,
          row,
          state.typelist,
          state.fieldSet,
          state.editFieldSet
        )
      }
      const handleSync = () => {
        $baseMessage(
          '从资产预约系统拉取资产信息。。。',
          'success',
          'vab-hey-message-success'
        )
      }
      const handleImport = () => {
        state['uploadRef'].showUpload(
          state.treeData,
          state.typelist,
          state.fieldSet,
          state.queryForm.type_id
        )
      }
      const handleNumber = async () => {
        state.listLoading = true
        const { data: count } = await setNumber(state.queryForm)
        $baseMessage(
          '自动设置了' + count + '个资产编号',
          'success',
          'vab-hey-message-success'
        )
        state.listLoading = false
      }
      const handleExport = () => {
        console.log('handleExport excel')
        $baseMessage('正在导出，请稍候', 'success', 'vab-hey-message-success')
        state.listLoading = true
        if (state.list.length) {
          state.downloadLoading = true
          import('@/utils/excel').then((excel) => {
            const tHeader = [
              '资产编号',
              '类型',
              '名称',
              '型号',
              '序列号',
              '密级',
              '用途',
              '使用情况',
              '放置地点',
              '所属部门',
              '责任人',
              '使用人',
              'IP地址',
              'MAC地址',
              '硬盘序列号',
              '操作系统',
              '安装日期',
              '启用日期',
              '在线时间',
            ]
            const filterVal = [
              'number',
              'type',
              'name',
              'model',
              'SN',
              'secret_level',
              'purpose',
              'use_state',
              'location',
              'org_name',
              'manager_name',
              'user_name',
              'ip',
              'mac',
              'disk_sn',
              'os',
              'install_date',
              'bootup_time',
              'online_time',
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
      const fetchData = async () => {
        state.listLoading = true
        const {
          data: { jsonData, totalCount },
        } = await getCheckList(state.queryForm)
        // } = await getPage(state.queryForm)
        state.list = jsonData
        state.total = totalCount
        state.listLoading = false
        console.log(state)
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

      const onEditFinish = (newData) => {
        //console.log(newData)

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
      const onVerifyFinish = (newData) => {
        console.log(newData)
        //重新加载数据
        fetchData()
      }
      const handlePageSizeChange = (val) => {
        state.queryForm.pageSize = val
        fetchData()
      }
      const handlePageCurrentChange = (val) => {
        state.queryForm.pageNow = val
        fetchData()
      }
      const handleDynamicTab = () => {
        console.log('dynamicNewTab: ')
        console.log(route)
        state.fieldSet = new Set([])

        let type_id = 255 //所有资产信息
        if (!route.query.type) {
          state.title = '所有资产信息'
        } else {
          type_id = Number(route.query.type)
          state.queryForm.type_id = type_id
        }
        //获取类型名称
        for (let i = 0; i < state.typelist.length; i++) {
          const x = state.typelist[i]
          if (x.id == type_id) {
            state.title = x.name

            //该类型显示的字段
            //console.log(x.fields)
            if (x.fields != null && x.fields.length > 0) {
              const props = x.fields.split(',')
              const labels = x.fields_label.split(',')
              for (let j = 0; j < props.length; j++) {
                state.fieldSet.add({
                  prop: props[j],
                  label: labels[j],
                })
                if (
                  props[j] != 'org_name' &&
                  props[j] != 'use_state' &&
                  props[j] != 'type' &&
                  props[j] != 'secret_level'
                ) {
                  state.editFieldSet.add({
                    prop: props[j],
                    label: labels[j],
                  })
                }
              }
            }
            //console.log(state.fieldList)
            //console.log('show ip: ' + state.fieldSet.has('ip'))
            break
          }
        }

        nextTick(() => {
          changeTabsMeta({
            title: '资产信息',
            meta: {
              title: state.title,
              icon: `${route.query.icon}`,
            },
          })
        })
      }
      const fetchTypeData = async () => {
        const { data: list } = await getTypeList(state.queryForm)
        state.typelist = list

        const { data: treeData } = await getOrgTree()
        state.treeData = treeData

        handleDynamicTab()
        fetchData()
      }
      onMounted(() => {
        fetchTypeData()
      })
      const tableRowClassName = (row) => {
        if (row.verify_state === 4 || row.verify_state === 3) {
          return 'warning-row'
        } else if (row.verify_state === 2) {
          return 'success-row'
        }
        return ''
      }
      return {
        ...toRefs(state),
        handleAdd,
        handleEdit,
        handleMultiEdit,
        handleSend,
        handleDelete,
        handleVerify,
        handleVerifyOK,
        handleImport,
        handleExport,
        handleNumber,
        formatJson,
        handleSync,
        handleRowClick,
        handleSelect,
        handleSelectAll,
        handleCurrentChange,
        fetchData,
        onEditFinish,
        onVerifyFinish,
        handlePageSizeChange,
        handlePageCurrentChange,
        tableRowClassName,
        Plus,
        Edit,
        Delete,
        DArrowLeft,
        DArrowRight,
        Search,
        SortUp,
        SortDown,
        CircleCheck,
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

  .el-table .warning-row {
    --el-table-tr-bg-color: var(--el-color-warning-light-9);
  }
  .el-table .success-row {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
  }
</style>
