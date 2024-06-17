<template>
  <div class="device-container">
    <el-row>
      <el-col :lg="20" :md="16" :sm="24" :xl="21" :xs="24">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button :icon="Plus" plain type="primary" @click="handleAdd()">
              添加
            </el-button>
            <el-button :icon="Edit" plain type="success" @click="handleEdit()">
              编辑
            </el-button>
            <el-button
              :icon="Delete"
              plain
              type="danger"
              @click="handleDelete($event)"
            >
              删除
            </el-button>
          </vab-query-form-left-panel>

          <vab-query-form-right-panel>
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
                  @keyup.enter="fetchListData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" type="primary" @click="fetchListData">
                  查询
                </el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table
          v-loading="listLoading"
          border
          :data="list"
          :default-expand-all="true"
          highlight-current-row
          row-key="id"
          size="small"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column show-overflow-tooltip type="selection" width="40" />
          <el-table-column
            label="设备组"
            min-width="80"
            prop="name"
            show-overflow-tooltip
            sortable
          />

          <el-table-column
            label="描述"
            min-width="100"
            prop="description"
            show-overflow-tooltip
            sortable
          />

          <el-table-column
            label="项目组/负责人"
            prop="manager"
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
                type="danger"
                :underline="false"
                @click="handleDelete(row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getTree } from '@/api/admin/dgroup'
  import {
    Plus,
    Edit,
    Delete,
    Search,
    SortUp,
    SortDown,
  } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'DeviceList',
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        editRef: null,
        list: [],
        listLoading: true,
        selectRows: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        queryOptions: [
          {
            value: '*',
            label: '全局搜索',
          },
          {
            value: 'name',
            label: '设备组',
          },
          {
            value: 'manager',
            label: '项目组/负责人',
          },
        ],
        queryForm: {
          groupIds: [],
          pageNow: 1,
          pageSize: 20,
          option: '*',
          condition: '',
        },
      })

      const handleAdd = () => {
        state['editRef'].showEdit(state.list)
      }

      const handleEdit = (row) => {
        if (!row) {
          if (state.selectRows.length > 0) {
            row = state.selectRows[0]
          } else {
            $baseMessage('未选中任何行', 'error')
            return false
          }
        }
        state['editRef'].showEdit(state.list, row)
      }

      const handleDelete = (row) => {
        if (row) {
          $baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ paths: row.path })
            $baseMessage(msg, 'success', 'vab-hey-message-success')
            await fetchListData()
          })
        } else {
          if (state.selectRows.length > 0) {
            $baseConfirm('你确定要删除所有选中项吗', null, () => {
              const ids = state.selectRows.map((item) => item.id).join()
              doDelete({ id: ids }).then((res) => {
                const { msg } = res
                $baseMessage(msg, 'success', 'vab-hey-message-success')
                fetchListData()
              })
            })
          } else {
            $baseMessage('未选中任何行', 'error')
            return false
          }
        }
      }

      const handleSelectionChange = (val) => {
        state.selectRows = val
      }

      const fetchListData = async () => {
        state.listLoading = true
        const { data } = await getTree(state.queryForm)
        state.list = data
        state.listLoading = false
      }

      onMounted(() => {
        fetchListData()
      })

      return {
        ...toRefs(state),
        handleAdd,
        handleEdit,
        handleDelete,
        handleSelectionChange,
        fetchListData,
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

<style lang="scss" scoped>
  $base: '.menu-management';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
</style>
