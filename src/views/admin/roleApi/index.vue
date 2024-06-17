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
            placeholder="角色 过滤关键字"
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
              <el-space>
                <el-button
                  icon="CircleCheck"
                  plain
                  type="success"
                  @click="handleSave()"
                >
                  保存
                </el-button>
                <el-button
                  :icon="ArrowDown"
                  plain
                  type="primary"
                  @click="handleExpand()"
                >
                  展开
                </el-button>
                <el-button
                  icon="Filter"
                  plain
                  type="success"
                  @click="handleFilter()"
                >
                  过滤
                </el-button>
              </el-space>
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
              min-width="150"
              show-overflow-tooltip
              sortable
            >
              <template #default="{ row }">
                <vab-icon v-if="row.icon" :icon="row.icon" />
                {{ row.name }}
              </template>
            </el-table-column>

            <el-table-column
              label="后台URL"
              min-width="150"
              prop="path"
              show-overflow-tooltip
              sortable
            />
            <el-table-column
              label="描述"
              min-width="200"
              prop="description"
              show-overflow-tooltip
              sortable
            />

            <el-table-column align="center" label="隐藏" sortable>
              <template #default="{ row }">
                {{ row.hidden ? '是' : '' }}
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
        </el-col>
      </el-row>
    </vab-card>
  </div>
</template>

<script>
  import { getTree, getRoleApi, setRoleApi } from '@/api/admin/role'
  import { getTree as getPage } from '@/api/admin/api'

  import {
    Search,
    CircleCheck,
    Filter,
    ArrowDown,
  } from '@element-plus/icons-vue'

  import { useUserStore } from '@/store/modules/user'

  const userStore = useUserStore()
  const { username } = storeToRefs(userStore)

  export default defineComponent({
    name: 'RoleApi',

    setup() {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        treeRef: null,
        tableRef: null,
        editRef: null,
        username: '',
        treeData: [],
        treeFilterText: '',
        tableFilterChecked: 0,
        roleApiIds: [],
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
            value: 'path',
            label: '后台URL',
          },
          {
            value: 'description',
            label: '描述',
          },
        ],
        queryForm: {
          role_name: [],
          api_name: '',
          role_id: '',
          pageNow: 1,
          pageSize: 1000,
          option: '*',
          condition: '',
        },
      })

      const handleTreeNodeFilter = () => {
        state.treeRef.filter(state.treeFilterText)
      }
      const handleTreeCheck = (data, node) => {
        //console.log('handleTreeCheck: ')
        //console.log(node)
        //console.log(data)

        handleTreeNodeClick(data, node)
      }
      const handleTreeNodeClick = (data, node) => {
        //取消其他的
        state.treeRef.setCheckedKeys([], false)
        //选中自己
        state.treeRef.setChecked(data, true, false)
        //展开
        node.expanded = true

        //清理查询框的查询条件，执行查询
        if (state.queryForm.condition && state.queryForm.condition != '') {
          state.queryForm.condition = ''
          fetchData()
        }

        //获取角色对应的接口Id
        state.queryForm.role_id = data.id
        state.queryForm.api_name = data.name
        fetchRoleApi()
      }
      const handleCurrentChange = (currentRow) => {
        state.currentRow = currentRow
      }
      const handleSave = async () => {
        state.username = username
        if (!state.queryForm.role_id) {
          $baseMessage('请选择角色', 'error', 'vab-hey-message-error')
          return
        }
        //所有选中的接口
        state.roleApiIds = []
        const selectedRows = state.tableRef.getSelectionRows()
        selectedRows.forEach((row) => {
          state.roleApiIds.push(row.id)
          state.queryForm.role_name.push(row.name)
        })

        //提交保存
        const { data } = setRoleApi({
          username: state.username,
          role_name: state.queryForm.role_name,
          api_name: state.queryForm.api_name,
          role_id: state.queryForm.role_id,
          api_ids: state.roleApiIds,
        })
        console.log(
          '============================================================================'
        )
        console.log(state.queryForm.role_name)
        if (data === 0)
          $baseMessage('保存数据失败', 'error', 'vab-hey-message-error')
        else $baseMessage('保存数据成功', 'success', 'vab-hey-message-success')
      }
      const handleExpand = () => {
        state.list.forEach((row) => {
          state.tableRef.toggleRowExpansion(row)
        })
      }
      const handleFilter = async () => {
        state.tableFilterChecked++
      }
      const tableRowClassName = ({ row }) => {
        //全部显示
        if (state.tableFilterChecked % 3 == 0) return ''

        //只显示一部分
        let showChecked = true
        if (state.tableFilterChecked % 3 == 2) showChecked = false

        const selected = isRowSelected(row)
        if (selected != showChecked) {
          return 'hidden-row'
        }

        return ''
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
      const setRoleApiSelection = async (rootList) => {
        rootList.forEach((row) => {
          let selected = false
          state.roleApiIds.forEach((id) => {
            if (id == row.id) selected = true
          })

          state.tableRef.toggleRowSelection(row, selected)
          if (row.children && row.children.length > 0)
            setRoleApiSelection(row.children)
        })
      }
      const fetchRoleApi = async () => {
        const { data } = await getRoleApi(state.queryForm)
        //console.log(data)

        state.roleApiIds = []
        data.forEach((item) => {
          state.roleApiIds.push(item.api_id)
        })

        setRoleApiSelection(state.list)
      }
      const fetchTreeData = async () => {
        const { data } = await getTree()
        state.treeData = data
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

        //获取树上选中的节点
        const { data } = await getPage(state.queryForm)
        state.list = data
        state.total = getTreeListCount(data)
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
      onMounted(() => {
        fetchTreeData()
        fetchData()
      })

      return {
        ...toRefs(state),
        handleTreeNodeFilter,
        handleTreeCheck,
        handleTreeNodeClick,
        handleSave,
        handleExpand,
        handleFilter,
        tableRowClassName,
        handleRowClick,
        handleSelect,
        handleSelectAll,
        handleCurrentChange,
        fetchTreeData,
        fetchData,
        handlePageSizeChange,
        handlePageCurrentChange,
        CircleCheck,
        ArrowDown,
        Search,
        Filter,
      }
    },
  })
</script>

<style lang="scss">
  .el-table .hidden-row {
    display: none;
  }
</style>
