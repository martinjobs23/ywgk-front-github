<template>
  <div class="info-management-container">
    <vab-card shadow="hover">
      <vab-query-form>
        <vab-query-form-top-panel :span="12">
          <!--          <el-button :icon="Plus" plain type="primary" @click="handleAdd()">-->
          <!--            添加-->
          <!--          </el-button>-->

          <el-button :icon="Edit" plain type="success" @click="handleEdit()">
            编辑工位
          </el-button>
          <el-button :icon="Edit" plain type="success" @click="handlePwdEdit()">
            修改密码
          </el-button>
          <el-button :icon="Delete" plain type="danger" @click="handleDelete()">
            删除
          </el-button>
          <el-button
            :icon="DArrowRight"
            plain
            type="primary"
            @click="handleExport()"
          >
            导出本页
          </el-button>
          <el-button
            :icon="DArrowRight"
            plain
            type="primary"
            @click="handleAllExport()"
          >
            全部导出
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
        <!--        <el-table-column-->
        <!--          fixed="left"-->
        <!--          label="专机ID"-->
        <!--          prop="workstation_id"-->
        <!--          show-overflow-tooltip-->
        <!--          sortable-->
        <!--          width="100"-->
        <!--        />-->
        <el-table-column
          fixed="left"
          label="专机名称"
          prop="name"
          show-overflow-tooltip
          sortable
          width="150"
        >
          <!-- <template #default="{ row }">
            <vab-icon v-if="row.online == 1" icon="checkbox-circle-fill" style="color: #92ca41" />
            <vab-icon v-if="row.online == 0 && row.online_time" icon="checkbox-circle-fill" style="color: #cccccc" />
            <vab-icon v-if="row.online == 0 && row.online_time == null" icon="close-circle-line" />
            {{ row.name }}
          </template> -->
        </el-table-column>
        <!-- <el-table-column fixed="left" label="工作票id" prop="logined" show-overflow-tooltip sortable width="140">
          <template #default="{ row }">
            <vab-icon v-if="row.logined == 1" icon="checkbox-circle-fill" style="color: #92ca41" />
            <vab-icon v-if="row.logined == 0 && row.online_time" icon="checkbox-circle-fill" style="color: #cccccc" />
            <vab-icon v-if="row.logined == 0 && row.online_time == null" icon="close-circle-line" />
          </template>
        </el-table-column> -->
        <!--        <el-table-column-->
        <!--          fixed="left"-->
        <!--          label="工作票ID"-->
        <!--          prop="order_id"-->
        <!--          show-overflow-tooltip-->
        <!--          sortable-->
        <!--          width="100"-->
        <!--        />-->
        <el-table-column
          fixed="left"
          label="工作票编号"
          prop="order_num"
          show-overflow-tooltip
          sortable
          width="150"
        />
        <el-table-column
          fixed="left"
          label="工作票名称"
          prop="order_name"
          show-overflow-tooltip
          sortable
          width="200"
        />
        <!-- <el-table-column label="操作人员人数" prop="order_num" show-overflow-tooltip sortable width="140" /> -->
        <!--        <el-table-column-->
        <!--          label="运维人员ID"-->
        <!--          prop="operator_id"-->
        <!--          show-overflow-tooltip-->
        <!--          sortable-->
        <!--          width="120"-->
        <!--        />-->
        <el-table-column
          label="运维人员账号"
          prop="operator_name"
          show-overflow-tooltip
          sortable
          width="140"
        />
        <el-table-column
          label="位置"
          prop="location"
          show-overflow-tooltip
          sortable
          width="100"
        >
          <template #default="{ row }">
            {{
              row.location == 1
                ? '东区'
                : row.location == 2
                ? '西区'
                : '数据中心'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="开始时间"
          min-width="100"
          prop="start_time"
          show-overflow-tooltip
          sortable
          width="160"
        />
        <el-table-column
          label="结束时间"
          min-width="100"
          prop="end_time"
          show-overflow-tooltip
          sortable
          width="160"
        />
        <el-table-column
          label="创建/修改时间"
          min-width="100"
          prop="time"
          show-overflow-tooltip
          sortable
          width="160"
        />
        <el-table-column
          label="当前状态"
          min-width="100"
          prop="status"
          show-overflow-tooltip
          sortable
        >
          <template #default="{ row }">
            <vab-icon
              v-if="row.status == 2 && row.start_time"
              icon="checkbox-circle-fill"
              style="color: #92ca41"
            />
            <vab-icon
              v-if="row.status == 1"
              icon="checkbox-circle-fill"
              style="color: #cccccc"
            />
            <vab-icon v-if="row.status == 0" icon="close-circle-line" />
            <!--            {{ row.name }}-->
            <span v-if="row.status == 0">已过期</span>
            <span v-if="row.status == 1">待使用</span>
            <span v-if="row.status == 2">正在使用</span>
            <span v-if="![0, 1, 2].includes(row.status)">状态异常</span>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          min-width="100"
          prop="description"
          show-overflow-tooltip
          sortable
        />
        <!--
        <el-table-column
          label="上线地址"
          min-width="80"
          show-overflow-tooltip
          sortable
        >
          <template #default="{ row }">
            {{ row.online_ip }}
          </template>
        </el-table-column>
         -->
        <!-- <el-table-column align="center" fixed="right" label="操作" width="80">
          <template #default="{ row }">
            <el-button type="text" @click="handleDetail(row)">
              查看详情
            </el-button>
          </template>
        </el-table-column> -->

        <template #empty>
          <!-- <el-image
                class="vab-data-empty"
                :src="require('@/terminals/empty_images/data_empty.png')"
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
        @row-click="handleRowClick"
        @select="handleSelect"
        @select-all="handleSelectAll"
        @size-change="handlePageSizeChange"
      />
    </vab-card>

    <edit ref="editRef" @edit-finish="onEditFinish" />
    <detail ref="detailRef" @detail-finish="onEditFinish" />
  </div>
</template>

<script>
  // import { doDelete } from '@/api/terminal/info'
  import { getCheckList, radRevoke } from '@/api/workstation/distribution'
  import { getTree } from '@/api/admin/org'
  import { getPage } from '@/api/admin/user'
  import {
    Plus,
    Edit,
    Delete,
    DArrowLeft,
    DArrowRight,
    Search,
    SortUp,
    SortDown,
  } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'Info',
    components: {
      Edit: defineAsyncComponent(() => import('./components/InfoEdit')),
      Detail: defineAsyncComponent(() => import('./components/Detail')),
    },
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        tableRef: null,
        editRef: null,
        detailRef: null,
        list: [],
        userData: [],
        treeData: [],
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
            value: 'workstation_name',
            label: '专机名称',
          },
          {
            value: 'order_num',
            label: '工作票编号',
          },
          {
            value: 'order_name',
            label: '工作票名称',
          },
          {
            value: 'operator_name',
            label: '运维人员账号名',
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
        state['editRef'].showAdd(state.treeData, state.userData, pid)
      }
      const handlePwdEdit = (row) => {
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
        state['editRef'].showPwdEdit(state.treeData, state.userData, row)
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
        state['editRef'].showEdit(state.treeData, state.userData, row)
      }
      const handleDelete = (row) => {
        if (row && row.id) {
          $baseConfirm('你确定要删除当前项吗', null, async () => {
            const { data } = await radRevoke({ row })
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
            let count = 0
            let successnum = 0,
              faildnum = 0
            let response
            $baseConfirm('你确定要删除选中行的内容吗', null, async () => {
              for (const row of selectedRows) {
                count++
                response = await radRevoke(row)
                if (response.msg === 'success') {
                  successnum++
                } else {
                  faildnum++
                }
                fetchData()
              }
              if (faildnum != 0) {
                $baseMessage(
                  '删除' +
                    count +
                    '条' +
                    ',成功' +
                    successnum +
                    '条' +
                    ',失败' +
                    faildnum +
                    '条',
                  'error',
                  'vab-hey-message-error'
                )
              } else {
                $baseMessage(
                  '删除' +
                    count +
                    '条' +
                    ',成功' +
                    successnum +
                    '条' +
                    ',失败' +
                    faildnum +
                    '条',
                  'success',
                  'vab-hey-message-success'
                )
              }
            })
          } else {
            $baseMessage('未选中任何行', 'error', 'vab-hey-message-error')
          }
        }
      }
      //展示详情页
      const handleDetail = (row) => {
        state.editRow = row
        state['detailRef'].show(row)
      }
      const handleSync = () => {
        $baseMessage(
          '从资产预约系统拉取资产信息。。。',
          'success',
          'vab-hey-message-success'
        )
      }
      const handleExport = async () => {
        console.log('handleExport excel')
        $baseMessage('正在导出，请稍候', 'success', 'vab-hey-message-success')
        state.listLoading = true
        if (state.list.length) {
          state.downloadLoading = true
          import('@/utils/excel').then((excel) => {
            const tHeader = [
              '专机名称',
              'IP地址',
              'MAC地址',
              '位置',
              '上线时间',
              '下线时间',
              '是否登录',
              '登录人员信息',
              '是否禁用',
              '备注',
            ]
            const filterVal = [
              'name',
              'ip',
              'mac',
              'location',
              'online_time',
              'offline_time',
              'logined',
              'logined_username',
              'disabled',
              'description',
            ]
            const list = state.list
            const data = formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '专机工作票列表',
            })
            //state.list.clearSelection()
            state.listLoading = false
          })
        } else {
          $baseMessage('请至少选择一行', 'error', 'vab-hey-message-error')
        }
      }
      const handleAllExport = async () => {
        console.log('handleExport excel')
        $baseMessage('正在导出，请稍候', 'success', 'vab-hey-message-success')
        state.listLoading = true
        const { data } = await getCheckList()
        state.exporlist = data.rows
        if (state.exporlist.length) {
          state.downloadLoading = true
          import('@/utils/excel').then((excel) => {
            const tHeader = [
              '专机名称',
              'IP地址',
              'MAC地址',
              '位置',
              '上线时间',
              '下线时间',
              '是否登录',
              '登录人员信息',
              '是否禁用',
              '备注',
            ]
            const filterVal = [
              'name',
              'ip',
              'mac',
              'location',
              'online_time',
              'offline_time',
              'logined',
              'logined_username',
              'disabled',
              'description',
            ]
            const list = state.exporlist
            const data = formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '专机工作票列表',
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

      /*
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
    */

      const fetchUserData = async () => {
        const { data } = await getPage()
        state.userData = data.pageData
      }
      const fetchTreeData = async () => {
        const { data } = await getTree()
        state.treeData = data
      }
      const fetchData = async () => {
        state.listLoading = true
        const { data } = await getCheckList(state.queryForm)

        // //设置组织机构名
        // const orgMap = treeToMap(state.treeData, null)
        // jsonData.forEach((x) => {
        //   x.org_name = orgMap.get(x.org_id)
        // })

        state.list = data.rows
        state.total = data.total
        state.listLoading = false
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
        fetchData()
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
      const handlePageSizeChange = (val) => {
        state.queryForm.pageSize = val
        fetchData()
      }
      const handlePageCurrentChange = (val) => {
        state.queryForm.pageNow = val
        fetchData()
      }
      onMounted(() => {
        fetchTreeData()
        fetchUserData()
        fetchData()
      })

      return {
        ...toRefs(state),
        handleAdd,
        handleEdit,
        handlePwdEdit,
        handleDelete,
        handleDetail,
        handleExport,
        handleAllExport,
        formatJson,
        handleSync,
        handleRowClick,
        handleSelect,
        handleSelectAll,
        handleCurrentChange,
        fetchUserData,
        fetchTreeData,
        fetchData,
        onEditFinish,
        handlePageSizeChange,
        handlePageCurrentChange,
        Plus,
        Edit,
        Delete,
        DArrowLeft,
        DArrowRight,
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
