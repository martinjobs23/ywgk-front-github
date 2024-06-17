<template>
  <div class="submit-info-container">
    <vab-card shadow="hover">
      <vab-query-form>
        <vab-query-form-right-panel :span="24">
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
                clearable
                placeholder="请输入查询值"
                style="width: 200px; margin-left: 10px"
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
        :cell-style="{ padding: 1 }"
        :data="list"
        element-loading-text="elementLoadingText"
        highlight-current-row
        size="small"
        @current-change="handleCurrentChange"
        @row-click="handleRowClick"
      >
        <el-table-column show-overflow-tooltip type="selection" width="40" />
        <el-table-column align="center" fixed label="序号" type="" width="55">
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>

        <el-table-column label="用户" prop="username" show-overflow-tooltip />
        <el-table-column label="序列号" prop="serial" show-overflow-tooltip />
        <el-table-column
          label="提交时间"
          prop="submit_time"
          show-overflow-tooltip
          width="150"
        />
        <el-table-column
          label="内容"
          prop="content"
          show-overflow-tooltip
          width="300"
        />
        <el-table-column label="类型" show-overflow-tooltip>
          <template #default="{ row }">
            <vab-icon
              v-if="row.type == 3"
              icon="checkbox-circle-fill"
              style="color: #fc9702"
            />
            <vab-icon
              v-if="row.type == 2"
              icon="checkbox-circle-fill"
              style="color: #f5d330"
            />
            <vab-icon
              v-if="row.type == 1"
              icon="checkbox-circle-fill"
              style="color: #84ce17"
            />
            <vab-icon
              v-if="row.type == 0"
              icon="checkbox-circle-fill"
              style="color: #e85151"
            />
            {{
              row.type == 0
                ? '默认反馈'
                : row.type == 1
                ? '运维工单'
                : row.type == 2
                ? '资源申请'
                : '权限申请'
            }}
          </template>
        </el-table-column>
        <el-table-column label="管理员" prop="admin" show-overflow-tooltip />
        <el-table-column
          label="处理时间"
          prop="process_time"
          show-overflow-tooltip
          width="150"
        />
        <el-table-column label="结果" prop="result" show-overflow-tooltip />
        <el-table-column label="处理结果" show-overflow-tooltip>
          <template #default="{ row }">
            <vab-icon
              v-if="row.ishandle == 1"
              icon="checkbox-circle-fill"
              style="color: #84ce17"
            />
            <vab-icon
              v-if="row.ishandle == 0"
              icon="close-circle-line"
              style="color: #e85151"
            />
            {{ row.ishandle == 1 ? '已处理' : '未处理' }}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="200">
          <template #default="{ row }">
            <el-button type="text" @click="handleCheck(row)">
              查看详情
            </el-button>
            <el-button type="text" @click="handleEdit(row)">处理</el-button>
          </template>
        </el-table-column>

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

    <submitEdit ref="editRef" @edit-finish="onEditFinish" />
    <submitCheck ref="checkRef" @check-finish="onEditFinish" />
  </div>
</template>

<script>
  import { getWorkorderList } from '@/api/submit/WorkorderSubmit/'
  import { Search } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'WorkorderSubmit',
    components: {
      submitEdit: defineAsyncComponent(() => import('./components/submitEdit')),
      submitCheck: defineAsyncComponent(() =>
        import('./components/submitCheck')
      ),
    },
    setup() {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        total: 0,
        editRef: null,
        checkRef: null,
        tableRef: null,
        currentRow: null,
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true,
        selectRows: '',
        list: [],
        listLoading: true,
        elementLoadingText: '正在加载...',
        searchOptions: [
          {
            value: '*',
            label: '全局搜索',
          },
          {
            value: 'username',
            label: '用户',
          },
          {
            value: 'content',
            label: '内容',
          },
          {
            value: 'serial',
            label: '序列号',
          },
        ],
        searchForm: {
          pageNow: 1,
          pageSize: 10,
          option: '*',
          condition: '',
        },
      })
      //获取当前选中行的内容
      const handleCurrentChange = (currentRow) => {
        state.currentRow = currentRow
      }
      const handleRowClick = (row) => {
        state.tableRef.toggleRowSelection(row)
      }
      // 判断是否选择
      const isRowSelected = (row) => {
        let selected = false
        const selectedRows = state.tableRef.getSelectionRows()
        if (selectedRows) {
          const obj = selectedRows.find((val) => {
            return val.serial === row.serial
          })
          if (obj) selected = true
        }
        return selected
      }
      //获取数据
      const fetchData = async () => {
        state.listLoading = true
        const { data } = await getWorkorderList(state.searchForm)
        console.log(data)
        state.list = data.jsonData
        state.total = data.totalCount
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

      //查看详情
      const handleCheck = (row) => {
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
        state['checkRef'].showworkorder(row)
      }
      //编辑showworkorder
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
        state['editRef'].showEdit(row)
      }
      onMounted(() => {
        fetchData()
      })
      return {
        ...toRefs(state),
        handleEdit,
        handleCheck,
        fetchData,
        handleRowClick,
        handleCurrentChange,
        handlePageSizeChange,
        handlePageCurrentChange,
        onEditFinish,
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
