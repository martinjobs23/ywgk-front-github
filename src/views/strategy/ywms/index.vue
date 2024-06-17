<template>
  <div class="group-management-container">
    <vab-card shadow="hover">
      <vab-query-form>
        <vab-query-form-top-panel :span="12">
          <el-button :icon="Plus" plain type="primary" @click="handleAdd()">
            添加
          </el-button>
          <el-button :icon="Edit" plain type="success" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button :icon="Delete" plain type="danger" @click="handleDelete()">
            删除
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
          label="策略名称"
          min-width="20"
          prop="inspection_ticket"
          show-overflow-tooltip
        />

        <el-table-column
          label="禁止运维命令"
          min-width="150"
          prop="ban_order"
          show-overflow-tooltip
        />

        <el-table-column
          label="运维终端区域"
          prop="operate_location"
          show-overflow-tooltip
          sortable
          width="100"
        >
          <template #default="{ row }">
            {{
              row.operate_location == 1
                ? '东区'
                : row.operate_location == 2
                ? '西区'
                : row.operate_location == 3
                ? '数据中心'
                : '不指定区域'
            }}
          </template>
        </el-table-column>

        <el-table-column
          label="1-任一审核通过，2-多人审核"
          prop="audit_pattern"
          show-overflow-tooltip
          sortable
          width="100"
        >
          <template #default="{ row }">
            {{
              row.audit_pattern == 1
                ? '任一审核通过'
                : row.audit_pattern == 2
                ? '多人审核'
                : '无'
            }}
          </template>
        </el-table-column>

        <el-table-column
          label="通知方式"
          prop="inform_path"
          show-overflow-tooltip
          sortable
          width="100"
        >
          <template #default="{ row }">
            {{
              row.inform_path == 0
                ? '不通知'
                : row.inform_path == 1
                ? '短信'
                : '无'
            }}
          </template>
        </el-table-column>
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

    <edit ref="editRef" @edit-finish="onEditFinish" />
    <!--      <edit ref="editRef" @finish-fetchdata="fetchData"/>-->
  </div>
</template>

<script>
  import { doDelete, setSort, getPage } from '@/api/strategy/ywms/pattern'
  /*import { getList as getUserList } from '@/api/admin/user'*/
  import {
    Plus,
    Edit,
    Delete,
    ArrowDown,
    Search,
    SortUp,
    SortDown,
  } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'Group',
    components: {
      Edit: defineAsyncComponent(() => import('./components/TableEdit')),
    },
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        tableRef: null,
        editRef: null,
        userData: [],
        list1: [],
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
            value: 'inspection_ticket',
            label: '推送检修票',
          },
          {
            value: 'operation_ticket',
            label: '系统运维票',
          },
          {
            value: 'sys_ticket',
            label: '系统巡检票',
          },
          {
            value: 'construction_ticket',
            label: '测试建设票',
          },
        ],
        queryForm: {
          pageNow: 1,
          pageSize: 100,
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
        state['editRef'].showAdd(state.list, pid)
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
        state['editRef'].showEdit(state.list, row)
      }
      const handleDelete = (row) => {
        if (row && row.id) {
          $baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg, data } = await doDelete({ id: row.id })
            if (data === 0) {
              $baseMessage(msg, 'error', 'vab-hey-message-error')
            } else {
              $baseMessage('删除成功', 'success', 'vab-hey-message-success')
              fetchData()
            }
          })
        } else {
          const selectedRows = state.tableRef.getSelectionRows()
          if (selectedRows.length > 0) {
            const ids = selectedRows.map((item) => item.id).join()
            $baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg, data } = await doDelete({ id: ids })
              if (data === 0) {
                $baseMessage(msg, 'error', 'vab-hey-message-error')
              } else {
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
        /*const { data } = await getTree(state.queryForm)
      const userMap = listToMap(state.userData)
      data.forEach((x) => {
        x.user_name = userMap.get(x.user_id)
      })
      state.list = data
      state.total = getTreeListCount(data)*/

        const { data } = await getPage()

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
      const handleSort = (row, isUp) => {
        const list = getParentList(state.list, row.pid)

        //原来的顺序
        const index = list.findIndex((x) => {
          return x.id == row.id
        })

        //不需要重新排序
        if (isUp) {
          //第一个
          if (index < 1) return
          else {
            //跟前一个换位置
            list[index - 1] = list.splice(index, 1, list[index - 1])[0]
          }
        } else {
          //最后一个
          if (index > list.length - 2) return
          else {
            //跟后一个换位置
            list[index] = list.splice(index + 1, 1, list[index])[0]
          }
        }

        //重新设置sort
        let oldSort = 0
        let newSort = 0
        let i = 0
        for (; i < list.length; i++) {
          oldSort = list[i].sort
          newSort = i + 1
          if (oldSort != newSort) {
            setSort({ id: list[i].id, sort: newSort })
            /*
          console.log(
            list[i].name + ' sort changed: ' + oldSort + ' -> ' + newSort
          )
          */
          }
          list[i].sort = newSort
        }
      }
      const onEditFinish = () => {
        //console.log(newData)

        //重新加载数据
        fetchData()
        return
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
        // fetchUserData()
        fetchData()
      })

      return {
        ...toRefs(state),
        handleAdd,
        handleEdit,
        handleDelete,
        handleRowClick,
        handleSelect,
        handleSelectAll,
        handleCurrentChange,
        handleSort,
        fetchData,
        onEditFinish,
        handlePageSizeChange,
        handlePageCurrentChange,
        Plus,
        Edit,
        Delete,
        ArrowDown,
        Search,
        SortUp,
        SortDown,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $base: '.group-management';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
</style>
