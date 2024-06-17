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
              <!--
              <el-button
                icon="Filter"
                plain
                type="success"
                @click="handleFilter(1)"
              >
                显示在线
              </el-button>
              <el-button
                icon="Filter"
                plain
                type="success"
                @click="handleFilter(2)"
              >
                显示已分配
              </el-button>
              -->
              <el-button
                :icon="DArrowRight"
                plain
                type="primary"
                @click="handleExport()"
              >
                导出
              </el-button>
              <el-button
                icon="Delete"
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
            :row-class-name="tableRowClassName"
            row-key="id"
            size="small"
            @current-change="handleCurrentChange"
            @row-click="handleRowClick"
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
              label="IP地址"
              min-width="100"
              show-overflow-tooltip
              sort-by="ip"
              sortable
              type=""
            >
              <template #default="{ row }">
                {{ row.ip }}
              </template>
            </el-table-column>
            <el-table-column
              label="在线"
              min-width="50"
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
              </template>
            </el-table-column>
            <!--
            <el-table-column
              label="MAC地址"
              min-width="120"
              prop="mac"
              show-overflow-tooltip
              sortable
              type=""
            />
            <el-table-column
              label="操作系统"
              min-width="120"
              prop="os"
              show-overflow-tooltip
              sortable
              type=""
            />
            <el-table-column
              label="部门"
              min-width="120"
              prop="org_name"
              show-overflow-tooltip
              sortable
              type=""
            />
            <el-table-column
              label="责任人"
              min-width="120"
              prop="user_name"
              show-overflow-tooltip
              sortable
              type=""
            />
            -->
            <el-table-column
              label="最后在线时间"
              min-width="120"
              prop="online_time"
              show-overflow-tooltip
              sortable
              type=""
            />

            <el-table-column
              label="检测时间"
              min-width="120"
              prop="check_time"
              show-overflow-tooltip
              sortable
              type=""
            />

            <el-table-column
              label="检测方式"
              min-width="100"
              prop="checker"
              show-overflow-tooltip
              sortable
              type=""
            />

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
            :page-sizes="[20, 50, 100, 500, 1000, 10000, 999999]"
            :small="small"
            :total="total"
            @current-change="handlePageCurrentChange"
            @size-change="handlePageSizeChange"
          />
        </el-col>
      </el-row>
    </vab-card>
  </div>
</template>

<script>
  import { getTree } from '@/api/ipam/subnet'
  import { doDelete, getPage } from '@/api/ipam/online'
  import {
    Plus,
    Edit,
    Delete,
    Search,
    SortUp,
    SortDown,
  } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'Online',
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        treeRef: null,
        tableRef: null,
        editRef: null,
        treeData: [],
        treeFilterText: '',
        tableFilterOnline: 0,
        tableFilterAlloc: 0,
        lastTreeNodeId: 0,
        list: [],
        title: 'IP在线状态信息',
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
            value: 'ip',
            label: 'IP地址',
          },
          {
            value: 'mac',
            label: 'MAC地址',
          },
          {
            value: 'org_name',
            label: '部门名称',
          },
          {
            value: 'user_name',
            label: '用户名称',
          },
          {
            value: 'online',
            label: '在线',
          },
          {
            value: 'check_time',
            label: '检测时间',
          },
          {
            value: 'os',
            label: '操作系统',
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
        }

        //清理查询框的查询条件，执行查询
        state.queryForm.condition = ''
        fetchData()
      }
      const formatJson = (filterVal, jsonData) => {
        return jsonData.map((v) => filterVal.map((j) => v[j]))
      }
      const handleExport = () => {
        console.log('handleExport excel')
        $baseMessage('正在导出，请稍候', 'success', 'vab-hey-message-success')
        state.listLoading = true
        if (state.list.length) {
          state.downloadLoading = true
          import('@/utils/excel').then((excel) => {
            const tHeader = [
              '序号',
              'IP地址',
              '在线',
              'MAC地址',
              '操作系统',
              '部门',
              '责任人',
              '最后在线时间',
              '检测时间',
              '检测方式',
            ]
            const filterVal = [
              'id',
              'ip',
              'online',
              'mac',
              'os',
              'org_name',
              'user_name',
              'online_time',
              'check_time',
              'checker',
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
      const handleCurrentChange = (currentRow) => {
        state.currentRow = currentRow
      }
      const handleFilter = async (flag) => {
        if (flag == 1) state.tableFilterOnline++
        if (flag == 2) state.tableFilterAlloc++
      }
      const tableRowClassName = ({ row }) => {
        //全部显示
        if (state.tableFilterOnline % 3 == 0 && state.tableFilterAlloc % 3 == 0)
          return ''

        //只显示在线的
        let showOnline = true
        if (state.tableFilterOnline % 3 == 2) showOnline = false

        //只显示已分配
        let showAlloc = true
        if (state.tableFilterAlloc % 3 == 2) showAlloc = false

        if (
          showOnline != (row.online == 1) ||
          showAlloc != (row.user_id != undefined && row.user_id != null)
        ) {
          return 'hidden-row'
        }

        return ''
      }
      const handleRowClick = (row, column) => {
        //console.log('handleRowClick')
        //console.log(column)
        //console.log(event)
        if (column && (column.label === '排序' || column.label === '操作'))
          return

        state.tableRef.toggleRowSelection(row)
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
        handleFilter,
        handleRowClick,
        formatJson,
        handleExport,
        handleCurrentChange,
        handleSort,
        handleDelete,
        fetchTreeData,
        fetchData,
        tableRowClassName,
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

<style lang="scss">
  .el-table .hidden-row {
    display: none;
  }
</style>
