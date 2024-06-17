<template>
  <div>
    <vab-card shadow="hover">
      <el-row :gutter="20">
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
            placeholder="网段名称 过滤关键字"
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

              <el-button
                :icon="DArrowRight"
                plain
                type="primary"
                @click="handleBind()"
              >
                采集信息
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
              label="名称"
              min-width="80"
              prop="name"
              show-overflow-tooltip
              sortable
              type=""
            />
            <el-table-column
              label="IP地址"
              min-width="80"
              prop="ip"
              show-overflow-tooltip
              sortable
              type=""
            />
            <el-table-column
              label="类型"
              min-width="50"
              prop="type"
              show-overflow-tooltip
              sortable
              type=""
            />
            <el-table-column
              label="型号"
              min-width="100"
              prop="model"
              show-overflow-tooltip
              sortable
              type=""
            />
            <el-table-column
              label="系统版本"
              min-width="100"
              prop="os"
              show-overflow-tooltip
              sortable
              type=""
            />
            <el-table-column
              label="序列号"
              min-width="100"
              prop="sn"
              show-overflow-tooltip
              sortable
              type=""
            />
            <el-table-column
              label="采集时间"
              min-width="100"
              prop="check_time"
              show-overflow-tooltip
              sortable
              type=""
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
                  type="danger"
                  :underline="false"
                  @click="handleDelete(row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="提示信息"
              min-width="100"
              prop="check_time"
              show-overflow-tooltip
              sortable
            >
              <template #default="{ row }">
                {{ row.check_state == 2 ? '正在采集...' : row.check_result }}
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

          <edit ref="editRef" @edit-finish="onEditFinish" />
        </el-col>
      </el-row>
    </vab-card>
  </div>
</template>

<script>
  import { getTree } from '@/api/ipam/subnet'
  import { doDelete, getPage, doCheck } from '@/api/ipam/netdevice'
  import {
    Plus,
    Edit,
    Delete,
    DArrowRight,
    Search,
    SortUp,
    SortDown,
  } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'Netdevice',
    components: {
      Edit: defineAsyncComponent(() => import('./components/Edit')),
    },
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        treeRef: null,
        tableRef: null,
        editRef: null,
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
            value: '名称',
            label: 'name',
          },
          {
            value: 'ip',
            label: 'IP地址',
          },
          {
            value: 'type',
            label: '类型',
          },
          {
            value: 'model',
            label: '型号',
          },
          {
            value: 'sn',
            label: '序列号',
          },
          {
            value: 'username',
            label: '用户名',
          },
          {
            value: 'check_time',
            label: '检测时间',
          },
        ],
        queryForm: {
          subnet_id: [],
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
          state.lastTreeNodeId = data.id
        }

        //清理查询框的查询条件，执行查询
        state.queryForm.condition = ''
        fetchData()
      }
      const handleCurrentChange = (currentRow) => {
        state.currentRow = currentRow
      }
      const handleAdd = () => {
        let subnet_id = 0
        if (state.currentRow != null && isRowSelected(state.currentRow)) {
          subnet_id = state.currentRow.subnet_id
        } else {
          const selectedRows = state.tableRef.getSelectionRows()
          if (selectedRows && selectedRows.length > 0) {
            subnet_id = selectedRows[0].id
          } else {
            subnet_id = state.lastTreeNodeId
          }
        }
        state.editRow = null
        state['editRef'].showAdd(state.treeData, subnet_id)
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
        state['editRef'].showEdit(state.treeData, row)
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
      const handleBind = async (row) => {
        const ids = []
        if (row && row.id) {
          ids.push(row.id)
        } else {
          const selectedRows = state.tableRef.getSelectionRows()
          selectedRows.forEach((row) => {
            if (row.ip) ids.push(row.id)
          })
        }

        if (ids.length == 0) {
          $baseMessage('未选中任何行', 'error', 'vab-hey-message-error')
        } else {
          const { data } = await doCheck({ id: ids.join() })
          if (data === -1)
            $baseMessage('添加采集任务失败', 'error', 'vab-hey-message-error')
          else {
            $baseMessage(
              '已添加到采集任务，请稍后查看',
              'success',
              'vab-hey-message-success'
            )
            fetchData()
          }
          fetchData()
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
      const fetchData = async () => {
        state.listLoading = true

        //获取树上选中的节点, 包括半选的节点
        const nodes = state.treeRef.getCheckedNodes(false, true)
        const keys = getNodesId(nodes)
        state.queryForm.subnet_id = keys

        const {
          data: { pageData, totalCount },
        } = await getPage(state.queryForm)
        state.list = pageData
        state.total = totalCount
        state.listLoading = false
      }
      const getParentList = (rootList, id) => {
        let i = 0
        for (; i < rootList.length; i++) {
          const row = rootList[i]
          if (row.subnet_id === id) {
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
        const list = getParentList(state.list, row.subnet_id)

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
        let subnet_id = -1
        let oldParentList = null
        if (state.editRow) {
          subnet_id = state.editRow.subnet_id
          oldParentList = getParentList(state.list, subnet_id)
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

        //如果subnet_id变化了，重新组织树形结构
        if (subnet_id != newData.subnet_id) {
          const newParentList = getParentList(state.list, newData.subnet_id)

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
        handleBind,
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
        DArrowRight,
        Search,
        SortUp,
        SortDown,
      }
    },
  })
</script>
