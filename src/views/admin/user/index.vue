<template>
  <div>
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
            placeholder="组织机构 过滤关键字"
            style="padding-bottom: 10px"
            @input="handleTreeNodeFilter"
          />
          <el-tree
            ref="treeRef"
            :data="treeData"
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
            <vab-query-form-top-panel :span="12">
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
            highlight-current-row
            row-key="id"
            size="small"
            @current-change="handleCurrentChange"
            @row-click="handleRowClick"
            @select="handleSelect"
            @select-all="handleSelectAll"
          >
            <el-table-column
              show-overflow-tooltip
              type="selection"
              width="40"
            />
            <el-table-column align="center" label="序号" type="" width="55">
              <template #default="{ $index }">
                {{ $index + 1 }}
              </template>
            </el-table-column>

            <el-table-column
              label="账号"
              min-width="120"
              prop="account"
              show-overflow-tooltip
              sortable
              type=""
            />
            <el-table-column
              label="姓名"
              min-width="120"
              prop="name"
              show-overflow-tooltip
              sortable
              type=""
            />
            <el-table-column
              label="组织机构"
              min-width="130"
              prop="org_name"
              show-overflow-tooltip
              sortable
            />
            <el-table-column
              label="证件号码"
              min-width="160"
              prop="id_number"
              show-overflow-tooltip
              sortable
            />
            <!-- <el-table-column
              label="电话"
              min-width="130"
              prop="tel"
              show-overflow-tooltip
              sortable
            /> -->
            <el-table-column
              label="手机"
              min-width="100"
              prop="mobile"
              show-overflow-tooltip
              sortable
            />
            <el-table-column
              label="邮箱"
              min-width="150"
              prop="email"
              show-overflow-tooltip
              sortable
            />
            <el-table-column label="账号周期" show-overflow-tooltip>
              <template #default="{ row }">
                {{ 'start_time' in row ? '临时' : '长期' }}
              </template>
            </el-table-column>
            <el-table-column label="账号状态" show-overflow-tooltip>
              <template #default="{ row }">
                {{ row.locked == '0' || row.locked == null ? '正常' : '锁定' }}
              </template>
            </el-table-column>
            <el-table-column label="休眠状态" show-overflow-tooltip>
              <template #default="{ row }">
                {{ row.sleep == '0' || row.sleep == null ? '正常' : '休眠' }}
              </template>
            </el-table-column>
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

          <edit ref="editRef" @edit-finish="onEditFinish" />
          <tabs ref="tabsRef" @edit-finish="onEditFinish" />
        </el-col>
      </el-row>
    </vab-card>
  </div>
</template>

<script>
  import { getTree } from '@/api/admin/org'
  import { doDelete, getPage } from '@/api/admin/user'
  import {
    Plus,
    Edit,
    Delete,
    Search,
    SortUp,
    SortDown,
  } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'User',
    components: {
      Edit: defineAsyncComponent(() => import('./components/UserEdit')),
      Tabs: defineAsyncComponent(() => import('./components/UserTabs')),
    },
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        treeRef: null,
        tableRef: null,
        editRef: null,
        tabsRef: null,
        treeData: [],
        treeFilterText: '',
        lastTreeNodeId: 0,
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
            value: 'account',
            label: '账号',
          },
          {
            value: 'name',
            label: '姓名',
          },
          {
            value: 'id_number',
            label: '证件号码',
          },
          {
            value: 'tel',
            label: '电话',
          },
          {
            value: 'mobile',
            label: '手机',
          },
          {
            value: 'email',
            label: '邮箱',
          },
        ],
        queryForm: {
          org_id: [],
          pageNow: 1,
          pageSize: 20,
          option: '*',
          condition: '',
        },
      })

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
      const handleCurrentChange = (currentRow) => {
        state.currentRow = currentRow
      }
      const handleAdd = () => {
        let org_id = 0
        if (state.currentRow != null && isRowSelected(state.currentRow)) {
          org_id = state.currentRow.org_id
        } else {
          const selectedRows = state.tableRef.getSelectionRows()
          if (selectedRows && selectedRows.length > 0) {
            org_id = selectedRows[0].id
          }
        }
        state.editRow = null
        state['editRef'].showAdd(state.treeData, org_id)
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
              fetchData()
            } else {
              $baseMessage('未选中任何行', 'error')
              return false
            }
          }
        }

        state.editRow = row
        state['editRef'].showEdit(state.treeData, row)
      }
      const handleDelete = (row) => {
        if (row && row.id) {
          $baseConfirm('你确定要删除当前项吗', null, async () => {
            const { data } = await doDelete({ ids: row.id })
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
              const { data } = await doDelete({ ids: ids })
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

      const fetchTreeData = async () => {
        const { data } = await getTree()
        state.treeData = data
      }
      const getNodesId = (nodes) => {
        if (!nodes) return []
        const ids = []
        nodes.forEach((node) => {
          ids.push(node.id)
          if (node.children) ids.concat(getNodesId(node.children))
        })

        return ids
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
      const fetchData = async () => {
        state.listLoading = true

        //获取树上选中的节点, 包括半选的节点
        const nodes = state.treeRef.getCheckedNodes(false, true)
        const keys = getNodesId(nodes)
        state.queryForm.org_id = keys

        const {
          data: { rows, total },
        } = await getPage(state.queryForm)

        //设置组织机构名
        const orgMap = treeToMap(state.treeData, null)
        rows.forEach((x) => {
          x.org_name = orgMap.get(x.org_id)
        })

        state.list = rows
        state.total = total
        state.listLoading = false
      }
      const getParentList = (rootList, id) => {
        let i = 0
        for (; i < rootList.length; i++) {
          const row = rootList[i]
          if (row.org_id === id) {
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
        const list = getParentList(state.list, row.org_id)

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
            //TODO:POST
            console.log(
              list[i].name + ' sort changed: ' + oldSort + ' -> ' + newSort
            )
          }
          list[i].sort = newSort
        }
      }
      const onEditFinish = (newData) => {
        let org_id = -1
        let oldParentList = null
        if (state.editRow) {
          org_id = state.editRow.org_id
          oldParentList = getParentList(state.list, org_id)
        } else {
          /*
oldParentList = state.list
state.list.push(newData) //push的数据没有$treeNodeId?? name为空
state.editRow = newData
state.total++
*/
          //重新加载数据
          fetchData()
        }

        //如果org_id变化了，重新组织树形结构
        if (org_id != newData.org_id) {
          const newParentList = getParentList(state.list, newData.org_id)

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
        fetchData()
      })

      return {
        ...toRefs(state),
        handleTreeNodeFilter,
        handleTreeCheck,
        handleTreeNodeClick,
        handleAdd,
        handleEdit,
        handleDelete,
        handleRowClick,
        handleSelect,
        handleSelectAll,
        handleCurrentChange,
        handleSort,
        fetchTreeData,
        fetchData,
        onEditFinish,
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
