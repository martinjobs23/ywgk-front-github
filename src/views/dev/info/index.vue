<template>
  <div class="info-management-container">
    <vab-card shadow="hover">
      <el-row>
        <el-col
          :lg="4"
          :md="8"
          :sm="24"
          style="padding-right: 10px"
          :xl="4"
          :xs="24"
        >
          <el-input
            v-model.trim="treeFilterText"
            autofocus="true"
            placeholder="设备分组 过滤关键字"
            style="padding-bottom: 10px"
            @input="handleTreeNodeFilter"
          />
          <el-tree
            ref="treeRef"
            :data="groupData"
            default-expand-all
            :filter-node-method="
              function treeNodeFilter(value, data) {
                if (!value) return true
                return data.name.includes(value)
              }
            "
            node-key="id"
            :props="{ children: 'children', label: 'name' }"
            show-checkbox
            @check="handleTreeCheck"
            @node-click="handleTreeNodeClick"
          />
        </el-col>
        <el-col :lg="20" :md="16" :sm="24" :xl="20" :xs="24">
          <vab-query-form>
            <vab-query-form-top-panel :span="14">
              <el-button :icon="Plus" plain type="primary" @click="handleAdd()">
                添加
              </el-button>

              <el-button
                :icon="Edit"
                plain
                type="success"
                @click="handleEdit()"
              >
                编辑
              </el-button>
              <el-button
                :icon="Delete"
                plain
                type="danger"
                @click="handleDelete()"
              >
                删除
              </el-button>
              <!-- <el-button
            :icon="DArrowLeft"
            plain
            type="primary"
            @click="handleImport()"
          >
            导入
          </el-button> -->
              <el-button
                :icon="DArrowRight"
                plain
                type="primary"
                @click="handleExport()"
              >
                导出
              </el-button>
              <!-- <el-button
            :icon="CircleCheck"
            plain
            type="primary"
            @click="handleVerifyOK()"
          >
            校核
          </el-button> -->
              <!-- <el-button
            :icon="Edit"
            plain
            type="success"
            @click="handleMultiEdit()"
          >
            批量修改
          </el-button> -->
              <!-- <el-button
            :icon="DArrowRight"
            plain
            type="primary"
            @click="handleNumber()"
          >
            自动编号
          </el-button> -->
              <el-button
                :icon="DArrowLeft"
                plain
                type="primary"
                @click="handleSync()"
              >
                同步设备台账
              </el-button>
            </vab-query-form-top-panel>
            <vab-query-form-right-panel :span="10">
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
            :row-class-name="tableRowClassName"
            row-key="id"
            size="small"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @current-change="handleCurrentChange"
            @row-click="handleRowClick"
            @select="handleSelect"
            @select-all="handleSelectAll"
          >
            <el-table-column
              fixed="left"
              show-overflow-tooltip
              type="selection"
              width="40"
            />
            <el-table-column
              align="center"
              fixed="left"
              label="序号"
              type=""
              width="55"
            >
              <template #default="{ $index }">
                {{ $index + 1 }}
              </template>
            </el-table-column>
            <!-- <el-table-column
              align="center"
              fixed="left"
              label="核验"
              type=""
              width="55"
            >
              <template #default="{ row }">
                <vab-icon
                  v-if="row.verify_state == 2"
                  icon="checkbox-circle-fill"
                  style="color: #92ca41"
                />
                <el-link
                  v-if="
                    row.verify_state == null ||
                    row.verify_state == 0 ||
                    row.verify_state == 1
                  "
                  :icon="CircleCheck"
                  style="color: #0000ff"
                  type="success"
                  :underline="false"
                  @click="handleVerifyOK(row)"
                />
                <el-link
                  v-if="row.verify_state == 3 || row.verify_state == 4"
                  :icon="CircleCheck"
                  style="color: #ff0000"
                  type="danger"
                  :underline="false"
                  @click="handleVerify(row)"
                />
              </template>
            </el-table-column> -->
            <el-table-column
              label="设备名称"
              :min-width="300"
              prop="name"
              show-overflow-tooltip
              sortable
            />
            <el-table-column
              label="IP"
              :min-width="150"
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
            <template v-for="val in fieldSet" :key="val.label">
              <el-table-column
                :label="val.label"
                :min-width="calculateColumnWidth(val.label)"
                :prop="val.prop"
                show-overflow-tooltip
                sortable
              />
            </template>

            <el-table-column
              align="center"
              fixed="right"
              label="操作"
              width="80"
            >
              <template #default="{ row }">
                <el-link
                  :icon="Edit"
                  type="success"
                  :underline="false"
                  @click="handleEdit(row)"
                />
                <el-link
                  :icon="Delete"
                  style="color: #ff0000"
                  type="danger"
                  :underline="false"
                  @click="handleDelete(row)"
                />
              </template>
            </el-table-column>

            <template #empty>
              <el-empty class="vab-data-empty" description="暂无数据" />
            </template>
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
        </el-col>
      </el-row>
    </vab-card>

    <upload ref="uploadRef" @finish-fetchdata="fetchData" />
    <edit ref="editRef" @finish-fetchdata="fetchData" />
    <verify ref="verifyRef" @verify-finish="onVerifyFinish" />
  </div>
</template>

<script>
  import { useTabsStore } from '@/store/modules/tabs'
  import {
    doDelete,
    doVerifyOK,
    getPage,
    setNumber,
    getTypeList,
    getProtocolType,
    getDeviceState,
  } from '@/api/dev/info'
  import { getTree as getGroupTree } from '@/api/dev/group'
  import { getTree as getOrgTree } from '@/api/admin/org'
  import { getList as getUserList } from '@/api/admin/user'
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

  export default defineComponent({
    name: 'Info',
    components: {
      Upload: defineAsyncComponent(() => import('./components/DevUpload')),
      Edit: defineAsyncComponent(() => import('./components/InfoEdit')),
      Verify: defineAsyncComponent(() => import('./components/InfoVerify')),
    },
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')
      const route = useRoute()
      const tabsStore = useTabsStore()
      const { changeTabsMeta } = tabsStore
      const state = reactive({
        treeRef: null,
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
        orgData: [],
        groupData: [],
        fieldSet: new Set([]),
        editFieldSet: new Set([]),
        protocolBakData: [],
        treeFilterText: '',
        ids: '',
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
            value: 'name',
            label: '设备名称',
          },
          {
            value: 'dev_type',
            label: '设备类型',
          },
          {
            value: 'ip',
            label: 'IP地址',
          },
          {
            value: 'location',
            label: '放置地点',
          },
          {
            value: 'group_name',
            label: '所属分组',
          },
          {
            value: 'org_name',
            label: '所属部门',
          },
          {
            value: 'operator_name',
            label: '运维人员',
          },
          {
            value: 'manager_name',
            label: '专责',
          },
        ],
        queryForm: {
          pageNow: 1,
          pageSize: 20,
          option: '*',
          condition: '',
        },
      })
      const calculateColumnWidth = (label) => {
        if (label == '密级') {
          return '70'
        } else if (
          (label == '类型') |
          (label == '责任人') |
          (label == '使用人')
        ) {
          return '90'
        } else if (label == '使用情况') {
          return '100'
        } else if (label == '型号') {
          return '200'
        } else if (
          (label == '名称') |
          (label == '品牌型号') |
          (label == '序列号') |
          (label == '硬盘序列号') |
          (label == '操作系统安装日期') |
          (label == '启用时间')
        ) {
          return '250'
        } else if (
          (label == '设备名称') |
          (label == '放置地点') |
          (label == '操作系统类型及版本')
        ) {
          return '300'
        } else return '150'
      }
      const handleCurrentChange = (currentRow) => {
        state.currentRow = currentRow
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
        const protocolData = _.cloneDeep(state.protocolBakData)
        state.editRow = null
        state['editRef'].showAdd(
          state.orgData,
          state.groupData,
          state.userData,
          pid,
          state.typelist,
          state.fieldSet,
          state.editFieldSet,
          state.queryForm.type_id,
          protocolData
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
        const protocolData = _.cloneDeep(state.protocolBakData)
        state['editRef'].showEdit(
          state.orgData,
          state.groupData,
          state.userData,
          row,
          state.typelist,
          state.fieldSet,
          state.editFieldSet,
          protocolData
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
          state.orgData,
          state.groupData,
          state.userData,
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
          state.orgData,
          state.groupData,
          state.userData,
          row,
          state.typelist,
          state.fieldSet,
          state.editFieldSet
        )
      }
      const handleSync = () => {
        $baseMessage(
          '从统一运行监控平台拉取设备台账信息。。。',
          'success',
          'vab-hey-message-success'
        )
      }
      const handleImport = () => {
        state['uploadRef'].showUpload(
          state.orgData,
          state.groupData,
          state.userData,
          state.typelist,
          state.fieldSet,
          state.queryForm.type_id
        )
      }
      const handleNumber = async () => {
        state.listLoading = true
        const { data: count } = await setNumber(state.queryForm)
        $baseMessage(
          '自动设置了' + count + '个设备编号',
          'success',
          'vab-hey-message-success'
        )
        state.listLoading = false
      }
      const handleExport = async () => {
        console.log('handleExport excel')
        $baseMessage('正在导出，请稍候', 'success', 'vab-hey-message-success')
        state.listLoading = true
        const selectedRows = state.tableRef.getSelectionRows()
        if (selectedRows.length) {
          state.exporlist = selectedRows
        } else {
          const {
            data: { rows },
          } = await getPage()
          const orgMap = treeToMap(state.orgData, null)
          const groupMap = treeToMap(state.groupData, null)
          rows.forEach((x) => {
            //设置显示的类型名
            const obj = state.typelist.find((item) => {
              return item.id === x.type_id
            })
            if (obj) x.type = obj.name

            //设置部门名称(树形)
            x.org_name = orgMap.get(x.org_id)
            x.group_name = groupMap.get(x.group_id)
          })
          state.exporlist = rows
        }
        if (state.exporlist.length) {
          state.downloadLoading = true
          import('@/utils/excel').then((excel) => {
            const tHeader = [
              '设备名称',
              '设备类型',
              'IP地址',
              '使用情况',
              '所属分组',
              '所属部门',
              '放置地点',
              'MAC地址',
              '操作系统',
            ]
            const filterVal = [
              'name',
              'dev_type',
              'ip',
              'use_state',
              'group_name',
              'org_name',
              'location',
              'mac',
              'os',
            ]

            const list = state.exporlist
            const data = formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: state.title,
            })
            state.listLoading = false
          })
        } else {
          $baseMessage('请至少选择一行', 'error', 'vab-hey-message-error')
          state.listLoading = false
        }
      }
      const formatJson = (filterVal, jsonData) => {
        return jsonData.map((v) => filterVal.map((j) => v[j]))
      }
      const handleTreeNodeFilter = () => {
        state.treeRef.filter(state.treeFilterText)
      }
      const handleTreeCheck = () => {
        //console.log('handleTreeCheck: ')
        //console.log(node)
        //console.log(data)
        //清理查询框的查询条件，执行查询
        state.queryForm.condition = ''
        fetchData()
      }
      const handleTreeNodeClick = (data, node) => {
        if (node.checked) {
          //原来选中，取消选中
          state.treeRef.setChecked(data, false, true)
          node.expanded = true
        } else {
          //原来未选中，变成选中 选中所有子节点
          state.treeRef.setChecked(data, true, true)
          //展开
          node.expanded = true
        }

        //清理查询框的查询条件，执行查询
        state.queryForm.condition = ''
        fetchData()
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
      function treeToMap(treeData, path) {
        const map = new Map()
        for (let i = 0; i < treeData.length; i++) {
          const item = treeData[i]
          map.set(item.id, path == null ? item.name : path + '/' + item.name)
          if (item.children && item.children.length > 0) {
            const subMap = treeToMap(item.children, item.name)
            //合并
            for (const [key, value] of subMap) {
              map.set(key, value)
            }
          }
        }
        return map
      }
      // function listToMap(listData) {
      //   const map = new Map()
      //   for (let i = 0; i < listData.length; i++) {
      //     const item = listData[i]
      //     map.set(item.id, item.name)
      //   }
      //   return map
      // }
      const getNodesId = (nodes) => {
        if (!nodes) return []
        const ids = []
        nodes.forEach((node) => {
          ids.push(node.id)
          if (node.children) ids.concat(getNodesId(node.children))
        })

        return ids
      }
      const fetchData = async () => {
        state.listLoading = true

        //获取树上选中的节点, 包括半选的节点
        const nodes = state.treeRef.getCheckedNodes(false, true)
        const keys = getNodesId(nodes)
        state.queryForm.group_id = keys

        const {
          data: { rows, total },
        } = await getPage(state.queryForm)

        const orgMap = treeToMap(state.orgData, null)
        const groupMap = treeToMap(state.groupData, null)
        // const userMap = listToMap(state.userData)
        let ids = ''
        rows.forEach((x) => {
          //设置显示的类型名
          const obj = state.typelist.find((item) => {
            return item.id === x.type_id
          })
          if (obj) x.type = obj.name

          //设置部门名称(树形)
          x.org_name = orgMap.get(x.org_id)
          x.group_name = groupMap.get(x.group_id)
          // x.manager_name = userMap.get(x.manager_id)
          if (x.operator_ids) {
            x.operator_id = x.operator_ids.split(',').map(Number)
          }
          if (x.manager_ids) {
            x.manager_id = x.manager_ids.split(',').map(Number)
          }
          ids = ids + x.id + ','
        })
        state.ids = ids.slice(0, -1)

        state.list = rows
        state.total = total
        state.listLoading = false
        fetchDevStatus()
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
        // console.log('dynamicNewTab: ')
        // console.log(route)
        state.fieldSet = new Set([])

        let type_id = 255 //所有设备信息
        if (!route.query.type) {
          state.title = '所有设备信息'
        } else {
          type_id = Number(route.query.type)
          state.queryForm.type_id = type_id
        }
        // console.log(state.typelist)
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
                if (props[j] != 'name' && props[j] != 'ip') {
                  state.fieldSet.add({
                    prop: props[j],
                    label: labels[j],
                  })
                }
                if (
                  props[j] != 'org_name' &&
                  props[j] != 'use_state' &&
                  props[j] != 'secret_level' &&
                  props[j] != 'operator_name' &&
                  props[j] != 'manager_name' &&
                  props[j] != 'group_name'
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
            title: '设备信息',
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

        const { data: groupData } = await getGroupTree()
        state.groupData = groupData

        const { data: orgData } = await getOrgTree()
        state.orgData = orgData

        const { data: userData } = await getUserList()
        state.userData = userData

        const { data: protocolBakData } = await getProtocolType()
        state.protocolBakData = []
        for (let i = 0; i < protocolBakData.length; i++) {
          const x = protocolBakData[i]
          if (x.id == 255 && x.protocol != null && x.protocol.length > 0) {
            const protocol = x.protocol.split(',')
            const port = x.port.split(',')
            for (let j = 0; j < protocol.length; j++) {
              state.protocolBakData.push({
                protocol: protocol[j],
                port: port[j],
                valid: false,
              })
            }
          }
        }
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
        calculateColumnWidth,
        handleAdd,
        handleEdit,
        handleMultiEdit,
        handleDelete,
        handleVerify,
        handleVerifyOK,
        handleImport,
        handleExport,
        handleNumber,
        formatJson,
        handleTreeNodeFilter,
        handleTreeCheck,
        handleTreeNodeClick,
        handleSync,
        handleRowClick,
        handleSelect,
        handleSelectAll,
        handleCurrentChange,
        fetchData,
        fetchDevStatus,
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
