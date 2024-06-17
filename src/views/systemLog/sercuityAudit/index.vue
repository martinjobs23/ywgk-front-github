<template>
  <div class="software-Install-Uninstall">
    <vab-card shadow="hover">
      <vab-query-form>
        <vab-query-form-top-panel :span="12">
          <el-button :icon="Plus" plain type="primary" @click="handleExport()">
            导出
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
                clearable
                placeholder="请输入查询值"
                style="width: 200px; margin-left: 10px"
                @keyup.enter="fetchData"
              />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" type="primary" @click="fetchLogData">
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
        :cell-style="{ padding: 1 }"
        :data="logData"
        highlight-current-row
        :row-class-name="tableRowClassName"
        size="small"
      >
        <el-table-column align="center" label="序号" type="" width="55">
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作用户账号"
          prop="NAME"
          show-overflow-tooltip
        />
        <el-table-column
          label="操作用户名称"
          prop="TYPE"
          show-overflow-tooltip
        />
        <el-table-column
          label="日志日期"
          prop="LOG_DATE"
          show-overflow-tooltip
        />
        <el-table-column label="IP地址" prop="IP" show-overflow-tooltip />
        <el-table-column label="日志类型" prop="TYPE" show-overflow-tooltip />
        <el-table-column
          label="操作名称"
          prop="EVENT_NAME"
          show-overflow-tooltip
        />
        <el-table-column
          label="模型ID"
          prop="object_id"
          show-overflow-tooltip
        />
        <el-table-column
          label="操作描述"
          prop="EVENT_RECORD"
          show-overflow-tooltip
        />
        <template #empty>
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
  </div>
</template>

<script>
  import {
    getsercuityAudit,
    // getUserOperationList,
  } from '@/api/systemLog/getPage'
  import { Plus, Search } from '@element-plus/icons-vue'
  export default defineComponent({
    name: '',

    //未根据实际情况判断是否需要组件
    //若加入【导出】组件：可增加导出指定时间或终端的日志的功能或者全部导出

    setup() {
      //$baseConfirm弹出提示窗：目前未使用
      //const $baseConfirm = inject('$baseConfirm')

      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        tableRef: null,
        list: [],
        total: 0,
        logData: [],
        logData2: [],
        listLoading: true,
        title: null,
        queryOptions: [
          {
            value: '*',
            label: '全局搜索',
          },
          {
            value: 'TYPE',
            label: '操作用户名称',
          },
          {
            value: 'EVENT_NAME',
            label: '操作名称',
          },
          {
            value: 'EVENT_RECORD',
            label: '操作描述',
          },
        ],
        queryForm: {
          pageNow: 1,
          pageSize: 10,
          option: '*',
          condition: '',
        },
      })
      //处理页面大小改变
      const handlePageSizeChange = (val) => {
        state.queryForm.pageSize = val
        fetchLogData()
      }
      //当前页面
      const handlePageCurrentChange = (val) => {
        state.queryForm.pageNow = val
        fetchLogData()
      }
      const handleExport = () => {
        console.log('handleExport excel')
        $baseMessage('正在导出，请稍候', 'success', 'vab-hey-message-success')
        state.listLoading = true
        if (state.list.length) {
          state.downloadLoading = true
          import('@/utils/excel').then((excel) => {
            const tHeader = ['用户名', 'IP', '操作类型', '操作内容', '操作时间']
            // const export_type = row.type === 1 ? '安装' : '卸载'
            const filterVal = ['username', 'ip', 'type', 'description', 'time']
            const list = state.list
            const data = formatJson(filterVal, list)
            state.title = '用户操作记录'
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
      const fetchLogData = async () => {
        state.listLoading = true
        const { data } = await getsercuityAudit(state.queryForm)
        const logData2 = data.rows
        state.total = data.total
        console.log(logData2)
        console.log(logData2.type)
        state.logData = logData2
        state.listLoading = false
      }
      const fetchData = async () => {
        state.listLoading = true
        const { data } = await getsercuityAudit(state.queryForm)
        state.list = data.jsonData
        state.total = data.totalCount
        state.listLoading = false
      }
      onMounted(() => {
        fetchLogData()
      })
      return {
        ...toRefs(state),
        handleExport,
        formatJson,
        fetchData,
        fetchLogData,
        handlePageSizeChange,
        handlePageCurrentChange,
        Plus,
        Search,
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
