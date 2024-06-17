<template>
  <div class="softwareAlert-container">
    <vab-card shadow="hover">
      <vab-query-form>
        <vab-query-form-top-panel :span="12">
          <el-switch
            v-model="ifrun"
            active-text="软件运行异常"
            :active-value="true"
            inactive-text="软件变化异常"
            :inactive-value="false"
            @change="fetchData"
          />
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
        v-if="!ifrun"
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
          label="设备名称"
          prop="dev_name"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="部门"
          prop="name"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="设备IP"
          prop="dev_ip"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="设备HASH"
          prop="username"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="异常软件"
          prop="filename"
          show-overflow-tooltip
          sortable
        >
          <template #default="{ row }">
            {{ row.filename.substring(row.filename.lastIndexOf('\\') + 1) }}
          </template>
        </el-table-column>
        <el-table-column
          label="异常时间"
          prop="time"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="处置措施"
          prop="operation"
          show-overflow-tooltip
          sortable
        />
        <el-table-column align="center" label="操作" width="80">
          <template #default="{ row }">
            <el-button type="text" @click="handleDetail(row)">
              查看详情
            </el-button>
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
      <el-table
        v-if="ifrun"
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
          label="设备名称"
          prop="dev_name"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="部门"
          prop="name"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="设备IP"
          prop="dev_ip"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="设备HASH"
          prop="username"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="异常软件"
          prop="filename"
          show-overflow-tooltip
          sortable
        >
          <template #default="{ row }">
            {{ row.filename.substring(row.filename.lastIndexOf('\\') + 1) }}
          </template>
        </el-table-column>
        <el-table-column
          label="异常时间"
          prop="time"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="处置措施"
          prop="operation"
          show-overflow-tooltip
          sortable
        />
        <el-table-column align="center" label="操作" width="80">
          <template #default="{ row }">
            <el-button type="text" @click="handleDetail(row)">
              查看详情
            </el-button>
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
        :page-sizes="[10, 20, 50, 100, 200, 300, 400, 500, 1000, 10000]"
        :small="small"
        :total="total"
        @current-change="handlePageCurrentChange"
        @size-change="handlePageSizeChange"
      />
    </vab-card>

    <detail ref="detailRef" />
  </div>
</template>

<script>
  import {
    getSoftwareChangeAlertList,
    getSoftwareRunAlertList,
  } from '@/api/desktop/alertManagement'
  import {
    Plus,
    Edit,
    Delete,
    DArrowLeft,
    Search,
    SortUp,
    SortDown,
  } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'SoftwareAlert',
    components: {
      Detail: defineAsyncComponent(() => import('../detail/Detail')),
    },
    setup() {
      // const $baseConfirm = inject('$baseConfirm')
      // const $baseMessage = inject('$baseMessage')

      const state = reactive({
        tableRef: null,
        detailRef: null,
        list: [],
        total: 0,
        ifrun: true,
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
            label: '设备名称',
          },
          {
            value: 'dev_ip',
            label: '设备IP',
          },
          {
            value: 'operation',
            label: '处置措施',
          },
        ],
        queryForm: {
          pageNow: 1,
          pageSize: 10,
          option: '*',
          condition: '',
        },
      })
      //展示详情页
      const handleDetail = (row) => {
        state.editRow = row
        state['detailRef'].softwareShow(row)
      }
      //获取数据
      const fetchData = async () => {
        state.listLoading = true
        if (state.ifrun) {
          const { data } = await getSoftwareRunAlertList(state.queryForm)
          state.list = data.jsonData
          state.total = data.totalCount
        } else {
          const { data } = await getSoftwareChangeAlertList(state.queryForm)
          state.list = data.jsonData
          state.total = data.totalCount
        }
        state.listLoading = false
      }
      const isRowSelected = (row) => {
        let selected = false
        const selectedRows = state.tableRef.getSelectionRows()
        if (selectedRows) {
          const obj = selectedRows.find((val) => {
            return val.time === row.time
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
      const onDetailFinish = (newData) => {
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
        state.queryForm.pageNow = 1
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
        handleDetail,
        fetchData,
        handlePageSizeChange,
        handlePageCurrentChange,
        handleRowClick,
        onDetailFinish,
        //
        Plus,
        Edit,
        Delete,
        DArrowLeft,
        Search,
        SortUp,
        SortDown,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $base: '.softwareAlert';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
</style>
