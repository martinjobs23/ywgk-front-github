<template>
  <div class="deviceBlack-container">
    <vab-card shadow="hover">
      <vab-query-form>
        <vab-query-form-top-panel :span="12">
          <el-button plain type="primary" @click="handleSync()">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
          <!-- <el-button plain type="primary" @click="handleExport()">
            <el-icon><Delete /></el-icon>
            删除
          </el-button> -->
          <el-button
            :icon="DArrowRight"
            plain
            type="primary"
            @click="handleExport()"
          >
            导出
          </el-button>
        </vab-query-form-top-panel>
        <vab-query-form-right-panel :span="12">
          <el-form inline :model="searchForm">
            <el-form-item>
              <el-select
                v-model="searchForm.option"
                placeholder="选择搜索字段"
                :popper-append-to-body="false"
                style="width: 100px"
              >
                <el-option
                  v-for="item in searchOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model.trim="searchForm.condition"
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
        <el-table-column
          label="工作票编号"
          min-width="120"
          prop="order_num"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="工作票名称"
          min-width="120"
          prop="order_name"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="目标系统IP"
          min-width="120"
          prop="deviceList"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="工作模式"
          min-width="120"
          prop="JobDescription"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="运维人员"
          min-width="120"
          prop="operatorList"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="运维设备"
          min-width="120"
          prop="deviceListName"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="工作票开始时间"
          min-width="140"
          prop="start_time"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="工作票结束时间"
          min-width="140"
          prop="end_time"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="工作票创建时间"
          min-width="140"
          prop="create_time"
          show-overflow-tooltip
          sortable
        />
        <!-- <el-table-column
          label="工作票审批时间"
          min-width="140"
          prop="lastmod_time"
          show-overflow-tooltip
          sortable
        /> -->
        <el-table-column
          label="审核人"
          min-width="120"
          prop="spe_user"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="描述"
          min-width="120"
          prop="description"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="重要记录 "
          min-width="120"
          prop="ImportFlag"
          show-overflow-tooltip
          sortable
        />
        <!-- <el-table-column
          label="工作票日志"
          min-width="120"
          prop="order_name"
          show-overflow-tooltip
          sortable
        /> -->
        <el-table-column
          label="工作记录"
          min-width="120"
          prop="operateRecord"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="准入情况"
          min-width="120"
          prop="zhunru"
          show-overflow-tooltip
          sortable
        />
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>
      <el-pagination
        v-model:current-page="searchForm.pageNow"
        v-model:page-size="searchForm.pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100, 200, 300, 400, 500, 1000, 10000]"
        :small="small"
        :total="total"
        @current-change="handlePageCurrentChange"
        @size-change="handlePageSizeChange"
      />
    </vab-card>
    <!-- <upload ref="uploadRef" @finish-fetchdata="fetchData" />
    <edit ref="editRef" @edit-finish="onEditFinish" /> -->
  </div>
</template>

<script>
  import { getProgressTicketList } from '@/api/order/orderTicketManage'
  import {
    Plus,
    // Upload,
    // Edit,
    Delete,
    DArrowLeft,
    DArrowRight,
    Search,
    SortUp,
    SortDown,
    CircleCheck,
    Folder,
    Mouse,
  } from '@element-plus/icons-vue'
  // import { da } from 'element-plus/es/locale'

  export default defineComponent({
    name: 'DeviceBlack',
    // components: {
    //   Upload: defineAsyncComponent(() =>
    //     import('@/views/order/task/components/AssetUpload')
    //   ),
    //   Edit: defineAsyncComponent(() =>
    //     import('@/views/order/task/components/InfoEdit.vue')
    //   ),
    // },
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        total: 0,
        editRef: null,
        tableRef: null,
        currentRow: null,
        uploadRef: null,
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true,
        selectRows: '',
        list: [],
        title: '工作票任务',
        listLoading: true,
        elementLoadingText: '正在加载...',
        searchOptions: [
          {
            value: '*',
            label: '全局搜索',
          },
          {
            value: 'devicelist',
            label: '目标系统IP',
          },
          {
            value: 'operatorlist',
            label: '运维人员',
          },
          // {
          //   value: 'status',
          //   label: '是否生效',
          // },
        ],
        searchForm: {
          pageNow: 1,
          pageSize: 10,
          option: '*',
          condition: '',
        },
      })

      // 导出
      const handleExport = () => {
        $baseMessage('正在导出，请稍候', 'success', 'vab-hey-message-success')
        state.listLoading = true
        if (state.list.length) {
          state.downloadLoading = true
          import('@/utils/excel').then((excel) => {
            const tHeader = [
              '工作票编号',
              '工作票名称',
              '目标系统IP',
              '工作模式',
              '运维人员',
              '运维设备',
              '工作票开始时间',
              '工作票结束时间',
              '工作票创建时间',
              '审核人',
              '描述',
              '重要记录',
              '工作记录',
              '准入情况',
            ]
            const filterVal = [
              'order_num',
              'order_name',
              'deviceList',
              'JobDescription',
              'operatorList',
              'deviceListName',
              'start_time',
              'end_time',
              'create_time',
              'description',
              'ImportFlag',
              'operateRecord',
              'zhunru',
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
      const formatJson = (filterVal, jsonData) => {
        return jsonData.map((v) => filterVal.map((j) => v[j]))
      }
      //获取当前选中行的内容
      const handleCurrentChange = (currentRow) => {
        state.currentRow = currentRow
      }

      //删除违规外联条目
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

      //刷新表格中数据
      const handleSync = () => {
        fetchData()
        $baseMessage(
          '工作票信息刷新成功!',
          'success',
          'vab-hey-message-success'
        )
      }

      //获取数据
      const fetchData = async () => {
        state.listLoading = true
        const { data } = await getProgressTicketList(state.searchForm)
        state.list = data.rows
        state.total = data.total
        state.listLoading = false
      }
      //处理页面大小改变
      const handlePageSizeChange = (val) => {
        state.searchForm.pageSize = val
        fetchData()
      }
      //当前页面
      const handlePageCurrentChange = (val) => {
        state.searchForm.pageNow = val
        fetchData()
      }
      //编辑完成后刷新界面
      const onEditFinish = () => {
        fetchData()
      }

      onMounted(() => {
        fetchData()
      })

      return {
        ...toRefs(state),
        handleDelete,
        fetchData,
        formatJson,
        handleSync,
        handleCurrentChange,
        handlePageSizeChange,
        handlePageCurrentChange,
        onEditFinish,
        handleExport,
        Plus,
        // Edit,
        // Upload,
        Delete,
        DArrowLeft,
        DArrowRight,
        Search,
        SortUp,
        SortDown,
        CircleCheck,
        Folder,
        Mouse,
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
