<template>
  <el-dialog
    v-model="dialogFormVisible"
    min-width="900px"
    :title="title"
    @close="close"
  >
    <vab-query-form>
      <vab-query-form-top-panel :span="12">
        <el-form inline :model="sendForm">
          <el-form-item>
            <el-button :icon="Share" plain type="primary" @click="handleSend()">
              分发
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
      <vab-query-form-right-panel :span="12">
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
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      ref="tableRef"
      v-loading="listLoading"
      border
      :data="list"
      :default-expand-all="true"
      height="510px"
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
        align="center"
        label="在线"
        show-overflow-tooltip
        sortable
        width="70"
      >
        <template #default="{ row }">
          <vab-icon
            v-if="row.online == 1"
            icon="checkbox-circle-fill"
            style="color: #92ca41"
          />
          <vab-icon v-if="row.online != 1" icon="close-circle-line" />
        </template>
      </el-table-column>
      <el-table-column
        label="终端名称"
        prop="dev_name"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        label="用户"
        prop="user_name"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        label="终端型号"
        prop="model"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        label="IP地址"
        prop="dev_ip"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        label="MAC地址"
        prop="dev_mac"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        label="硬盘序列号"
        prop="disk_sn"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        label="操作系统"
        prop="operation_system"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        label="组织部门"
        prop="name"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        label="安装时间"
        prop="install_time"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        label="启动时间"
        prop="bootup_time"
        show-overflow-tooltip
        sortable
      />

      <el-table-column
        label="设备HASH"
        min-width="100"
        prop="dev_hash"
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
      :page-sizes="[15, 30, 50, 100, 200, 300, 400, 500, 1000, 10000]"
      :small="small"
      :total="total"
      @current-change="handlePageCurrentChange"
      @size-change="handlePageSizeChange"
    />
  </el-dialog>
</template>

<script>
  import { getCheckList } from '@/api/desktop/terminalManager'
  import { distribute } from '@/api/check/checkIpManagement/'
  import {
    Share,
    Edit,
    Delete,
    Search,
    SortUp,
    SortDown,
  } from '@element-plus/icons-vue'
  import { useUserStore } from '~/src/store/modules/user'
  const userStore = useUserStore()
  const { username } = storeToRefs(userStore)

  export default defineComponent({
    name: 'FileSend',
    emits: ['send-finish'],
    setup() {
      const $baseMessage = inject('$baseMessage')
      const $baseConfirm = inject('$baseConfirm')

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
            value: 'dev_name',
            label: '终端名称',
          },
          {
            value: 'user_name',
            label: '用户',
          },
          {
            value: 'name',
            label: '组织部门',
          },
        ],
        sendForm: {
          strategy_id: null,
        },
        queryForm: {
          pageNow: 1,
          pageSize: 15,
          option: '*',
          condition: '',
        },
        title: '',
        dialogFormVisible: false,
      })
      const handleCurrentChange = (currentRow) => {
        state.currentRow = currentRow
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
        state.list = jsonData
        state.total = totalCount

        //自动选中在线的终端
        nextTick(() => {
          state.list.forEach((x) => {
            state.tableRef.toggleRowSelection(x, x.online == 1)
          })
        })

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
      const showSend = (row) => {
        state.title = '分发策略'
        //state.form = JSON.parse(JSON.stringify(row))
        state.dialogFormVisible = true
        state.sendForm.strategy_id = row
        //会议id或者会议室Id获取对应的终端
        console.log('showSend')
        console.log(row)
        fetchData()
      }
      const handleSend = async () => {
        const terminal_id = []
        const selectedRows = state.tableRef.getSelectionRows()
        if (selectedRows && selectedRows.length > 0) {
          selectedRows.forEach((item) => {
            terminal_id.push(item.id)
          })
        } else {
          $baseMessage('未选中任何行', 'error')
          return false
        }

        console.log(terminal_id)
        const ids = selectedRows.map((item) => item.id).join()
        state.sendForm.terminal_id = terminal_id.join()

        $baseConfirm('你确定要把当前选中项进行分发吗？', null, async () => {
          // const { msg } = await distribute({ id: ids })
          const { msg, data } = await distribute({
            strategy_id: state.sendForm.strategy_id,
            id: ids,
            send_user: username._object.username,
          })
          if (data === 0)
            $baseMessage('错误:' + msg, 'error', 'vab-hey-message-error')
          else {
            $baseMessage('成功:' + msg, 'success', 'vab-hey-message-success')
          }
          state.dialogFormVisible = false
        })
      }
      return {
        ...toRefs(state),
        showSend,
        handleSend,
        handleRowClick,
        handleSelect,
        handleSelectAll,
        handleCurrentChange,
        fetchData,
        onEditFinish,
        handlePageSizeChange,
        handlePageCurrentChange,
        Share,
        Edit,
        Delete,
        Search,
        SortUp,
        SortDown,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $base: '.fileSend-management';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
</style>
