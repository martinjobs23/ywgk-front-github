<template>
  <div class="device-container">
    <el-row>
      <el-col :lg="4" :md="8" :sm="24" :xl="3" :xs="24">
        <el-tree
          id="groupTree"
          ref="groupTree"
          :data="treeData"
          default-expand-all
          node-key="id"
          :props="defaultProps"
          show-checkbox
        />
      </el-col>

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
            label="IP地址"
            min-width="160"
            prop="ip"
            show-overflow-tooltip
            sortable
          />
          <!-- <el-table-column
            label="设备名称"
            prop="name"
            show-overflow-tooltip
            sortable
          /> -->
          <el-table-column
            label="设备编号"
            prop="code"
            show-overflow-tooltip
            sortable
          />

          <el-table-column
            label="操作系统"
            prop="os"
            show-overflow-tooltip
            sortable
            width="120"
          />
          <el-table-column
            label="添加时间"
            prop="create_time"
            show-overflow-tooltip
            sortable
            width="100"
          />
          <el-table-column
            label="设备类型"
            prop="type"
            show-overflow-tooltip
            sortable
          />
          <el-table-column
            label="宿主IP"
            prop="host_ip"
            show-overflow-tooltip
            sortable
          />
          <!-- <el-table-column
            label="服务类型"
            prop="service_type"
            show-overflow-tooltip
            sortable
          /> -->
          <el-table-column
            label="物理位置"
            prop="location"
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
  import { getList } from '@/api/admin/device'
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
        treeData: [],
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
            label: '设备名称',
          },
          {
            value: 'code',
            label: '设备编号',
          },
          {
            value: 'ip',
            label: '设备IP',
          },
          {
            value: 'os',
            label: '操作系统类型',
          },
          {
            value: 'create_time',
            label: '创建时间',
          },
          {
            value: 'type',
            label: '设备类型',
          },
          {
            value: 'host_ip',
            label: '宿主ip',
          },
          {
            value: 'service_type',
            label: '服务类型',
          },
          {
            value: 'location',
            label: '物理位置',
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

      const fetchTreeData = async () => {
        state.listLoading = true
        const { data } = await getTree()
        state.treeData = data
        state.listLoading = false
      }

      const fetchListData = async () => {
        state.listLoading = true
        const { data } = await getList(state.queryForm)
        state.list = data
        state.listLoading = false
      }

      onMounted(() => {
        fetchTreeData()
        fetchListData()
      })

      return {
        ...toRefs(state),
        handleAdd,
        handleEdit,
        handleDelete,
        handleSelectionChange,
        fetchTreeData,
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
