<template>
  <div class="org-management-container">
    <vab-card shadow="hover">
      <vab-query-form>
        <vab-query-form-top-panel :span="12">
          <el-button :icon="Plus" plain type="primary" @click="handleAdd()">
            添加
          </el-button>

          <el-button :icon="Edit" plain type="success" @click="handleEdit()">
            编辑
          </el-button>
          <el-button :icon="Delete" plain type="danger" @click="handleDelete()">
            删除
          </el-button>
          <el-button
            :icon="ArrowDown"
            plain
            type="primary"
            @click="handleExpand()"
          >
            展开
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
        <el-table-column show-overflow-tooltip type="selection" width="40" />
        <el-table-column align="center" label="序号" type="" width="55">
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          label="名称"
          min-width="150"
          show-overflow-tooltip
          sortable
        >
          <template #default="{ row }">
            {{ row.name }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="排序" width="80">
          <template #default="{ row }">
            <el-link
              :icon="SortUp"
              type="success"
              :underline="false"
              @click="handleSort(row, true)"
            />
            <el-link
              :icon="SortDown"
              type="danger"
              :underline="false"
              @click="handleSort(row, false)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="代码"
          min-width="150"
          prop="code"
          show-overflow-tooltip
          sortable
        />
        <!--
        <el-table-column
          label="英文名称"
          min-width="150"
          prop="e_name"
          show-overflow-tooltip
          sortable
          type=""
        />
        <el-table-column
          label="简称"
          min-width="150"
          prop="shortname"
          show-overflow-tooltip
          sortable
        />
        -->
        <el-table-column
          label="电话"
          min-width="150"
          prop="phone_number"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="传真"
          min-width="150"
          prop="fax"
          show-overflow-tooltip
          sortable
        />
        <el-table-column align="center" label="操作" width="80">
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
        :page-sizes="[20, 50, 100, 200, 300, 400, 500, 1000, 10000]"
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
  import { doDelete, getTree, setSort } from '@/api/admin/org'
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
    name: 'Org',
    components: {
      Edit: defineAsyncComponent(() => import('./components/OrgEdit')),
    },
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        tableRef: null,
        editRef: null,
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
            value: 'name',
            label: '名称',
          },
          {
            value: 'code',
            label: '代码',
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
      const handleExpand = () => {
        state.list.forEach((row) => {
          state.tableRef.toggleRowExpansion(row)
        })
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
      const getTreeListCount = (rootList) => {
        let count = 0
        rootList.forEach((item) => {
          count++
          if (item.children && item.children.length > 0)
            count += getTreeListCount(item.children)
        })
        return count
      }
      const fetchData = async () => {
        state.listLoading = true
        const { data } = await getTree(state.queryForm)
        state.list = data
        state.total = getTreeListCount(data)
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
      const handlePageSizeChange = (val) => {
        state.queryForm.pageSize = val
        fetchData()
      }
      const handlePageCurrentChange = (val) => {
        state.queryForm.pageNow = val
        fetchData()
      }
      onMounted(() => {
        fetchData()
      })

      return {
        ...toRefs(state),
        handleAdd,
        handleEdit,
        handleDelete,
        handleExpand,
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
  $base: '.org-management';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
</style>
