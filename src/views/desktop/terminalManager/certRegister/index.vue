<template>
  <div class="register-management-container">
    <vab-card shadow="hover">
      <vab-query-form>
        <vab-query-form-top-panel :span="12">
          <el-button :icon="Plus" plain type="primary" @click="handleAdd()">
            添加
          </el-button>
          <el-button :icon="Edit" plain type="success" @click="handleAgree()">
            同意
          </el-button>
          <el-button
            :icon="Delete"
            plain
            type="danger"
            @click="handleDeny(row)"
          >
            拒绝
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
        <el-table-column
          fixed="left"
          show-overflow-tooltip
          type="selection"
          width="40"
        />
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
          fixed="left"
          label="设备HASH"
          prop="dev_hash"
          show-overflow-tooltip
          sortable
          width="300"
        >
          <template #default="{ row }">
            {{ row.dev_hash.substring(0, 32) }}
          </template>
        </el-table-column>
        <el-table-column
          label="设备名称"
          prop="dev_name"
          show-overflow-tooltip
          sortable
          width="200"
        />
        <el-table-column
          label="使用人"
          prop="user_name"
          show-overflow-tooltip
          sortable
          width="150"
        />
        <el-table-column
          label="位置"
          prop="location"
          show-overflow-tooltip
          sortable
          width="150"
        />
        <el-table-column
          label="设备IP"
          prop="dev_ip"
          show-overflow-tooltip
          sortable
          width="150"
        >
          <!-- <template #default="{ row }">
            {{ row.dev_desc ? row.dev_desc.match(/model(.+?)disksn/)[1] : '' }}
          </template> -->
        </el-table-column>
        <el-table-column
          label="MAC地址"
          prop="dev_mac"
          show-overflow-tooltip
          sortable
          width="150"
        >
          <!--          <template #default="{ row }">-->
          <!--            {{-->
          <!--              row.dev_mac.substring(0, 2) +-->
          <!--              ':' +-->
          <!--              row.dev_mac.substring(2, 4) +-->
          <!--              ':' +-->
          <!--              row.dev_mac.substring(4, 6) +-->
          <!--              ':' +-->
          <!--              row.dev_mac.substring(6, 8) +-->
          <!--              ':' +-->
          <!--              row.dev_mac.substring(8, 10) +-->
          <!--              ':' +-->
          <!--              row.dev_mac.substring(10, 12)-->
          <!--            }}-->
          <!--          </template>-->
        </el-table-column>
        <el-table-column
          label="设备型号"
          prop="model"
          show-overflow-tooltip
          sortable
          width="150"
        />
        <el-table-column
          label="操作系统"
          prop="operation_system"
          show-overflow-tooltip
          sortable
          width="250"
        />
        <el-table-column
          label="状态"
          show-overflow-tooltip
          sortable
          width="100"
        >
          <template #default="{ row }">
            <vab-icon
              v-if="row.status == 0"
              icon="time-line"
              style="color: #92ca41"
            />
            <vab-icon
              v-if="row.status == 1"
              icon="checkbox-circle-fill"
              style="color: #92ca41"
            />
            <vab-icon
              v-if="row.status == 2"
              icon="close-circle-line"
              style="color: #ea9999"
            />
            {{
              row.status == '0'
                ? '未审核'
                : row.status == 1
                ? '已注册'
                : '已拒绝'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="申请时间"
          prop="time"
          show-overflow-tooltip
          sortable
          width="200"
        />
        <el-table-column align="center" fixed="right" label="操作" width="80">
          <template #default="{ row }">
            <el-link
              :icon="Edit"
              type="success"
              :underline="false"
              @click="handleAgree(row)"
            />
            <el-link
              :icon="Delete"
              style="color: #ff0000"
              type="danger"
              :underline="false"
              @click="handleDeny(row)"
            />
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

    <edit ref="editRef" @edit-finish="onEditFinish" />
    <add ref="addRef" @edit-finish="onEditFinish" />
  </div>
</template>

<script>
  import { getUncheckList, radCheck } from '@/api/desktop/terminalManager'
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
    name: 'Register',
    components: {
      Edit: defineAsyncComponent(() => import('./components/InfoEdit')),
      Add: defineAsyncComponent(() => import('./components/DevAdd')),
    },
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        tableRef: null,
        editRef: null,
        addRef: null,
        list: [],
        total: 0,
        listLoading: true,
        currentRow: null,
        editRow: null,
        modelRegularExpression: /model(.*?)\s+disk_sn(.*?)\s+/,
        queryOptions: [
          {
            value: '*',
            label: '全局搜索',
          },
          {
            value: 'dev_hash',
            label: '设备HASH',
          },
        ],
        queryForm: {
          pageNow: 1,
          pageSize: 20,
          option: '*',
          condition: '',
        },
      })
      const handleCurrentChange = (currentRow) => {
        state.currentRow = currentRow
      }
      const handleAdd = () => {
        let pid = 0
        if (state.currentRow != null && isRowSelected(state.currentRow)) {
          pid = state.currentRow.pid
        } else {
          const selectedRows = state.tableRef.getSelectionRows()
          if (selectedRows && selectedRows.length > 0) {
            pid = selectedRows[0].id
          }
        }
        state.editRow = null
        state['addRef'].showAdd(state.list, pid)
      }
      const handleAgree = (row) => {
        if (row && row.id) {
          state['editRef'].showEdit(state.list, row)
        } else {
          const selectedRows = state.tableRef.getSelectionRows()
          if (selectedRows.length == 1) {
            row = selectedRows[0]
            state.tableRef.setCurrentRow(row)
            state['editRef'].showEdit(state.list, row)
          } else if (selectedRows.length > 1 && selectedRows.length <= 20) {
            let response
            let count = 0

            let successnum = 0,
              warningnum = 0,
              faildnum = 0
            $baseConfirm('你确定要进行批量注册吗', null, async () => {
              for (const row of selectedRows) {
                count++
                row.is_handle = 1
                response = await radCheck(row)
                if (response.code === 200) {
                  successnum++
                } else if (response.code === 100) {
                  warningnum++
                } else {
                  faildnum++
                }
                fetchData()
              }
              if (faildnum != 0) {
                $baseMessage(
                  '注册' +
                    count +
                    '条' +
                    ',成功' +
                    successnum +
                    '条' +
                    ',数据不全' +
                    warningnum +
                    '条' +
                    ',失败' +
                    faildnum +
                    '条',
                  'error',
                  'vab-hey-message-success'
                )
              } else if (warningnum != 0) {
                $baseMessage(
                  '注册' +
                    count +
                    '条' +
                    ',成功' +
                    successnum +
                    '条' +
                    ',数据不全' +
                    warningnum +
                    '条' +
                    ',失败' +
                    faildnum +
                    '条',
                  'warning',
                  'vab-hey-message-warning'
                )
              } else {
                $baseMessage(
                  '注册' +
                    count +
                    '条' +
                    ',成功' +
                    successnum +
                    '条' +
                    ',数据不全' +
                    warningnum +
                    '条' +
                    ',失败' +
                    faildnum +
                    '条',
                  'success',
                  'vab-hey-message-success'
                )
              }
            })
          } else if (selectedRows.length > 20) {
            $baseMessage(
              '批量注册的终端数量不超过20条',
              'error',
              'vab-hey-message-error'
            )
          } else {
            $baseMessage('未选中任何行', 'error', 'vab-hey-message-error')
          }
        }
      }
      const handleDeny = (row) => {
        if (row && row.id) {
          $baseConfirm('你确定拒绝该设备证书申请吗?', null, async () => {
            row.is_handle = 2
            radCheck(row).then((res) => {
              $baseMessage(res.msg, res.data)
              fetchData()
            })
          })
        } else {
          const selectedRows = state.tableRef.getSelectionRows()
          if (selectedRows.length == 1) {
            row = selectedRows[0]
            state.tableRef.setCurrentRow(row)
            $baseConfirm('你确定拒绝该设备证书申请吗?', null, async () => {
              row.is_handle = 2
              radCheck(row).then((res) => {
                $baseMessage(res.msg, res.data)
                fetchData()
              })
            })
          } else if (selectedRows.length > 1) {
            let response
            let count = 0
            let successnum = 0,
              faildnum = 0
            $baseConfirm('你确定要进行批量拒绝吗', null, async () => {
              for (const row of selectedRows) {
                count++
                row.is_handle = 2
                response = await radCheck(row)
                if (response.data === 'success') {
                  successnum++
                } else {
                  faildnum++
                }
                fetchData()
              }
              if (faildnum != 0) {
                $baseMessage(
                  '拒绝' +
                    count +
                    '条' +
                    ',成功' +
                    successnum +
                    '条' +
                    ',失败' +
                    faildnum +
                    '条',
                  'error',
                  'vab-hey-message-error'
                )
              } else {
                $baseMessage(
                  '拒绝' +
                    count +
                    '条' +
                    ',成功' +
                    successnum +
                    '条' +
                    ',失败' +
                    faildnum +
                    '条',
                  'success',
                  'vab-hey-message-success'
                )
              }
            })
          } else {
            $baseMessage('未选中任何行', 'error', 'vab-hey-message-error')
          }
        }
      }

      const isRowSelected = (row) => {
        let selected = false
        const selectedRows = state.tableRef.getSelectionRows()
        if (selectedRows) {
          const obj = selectedRows.find((val) => {
            return (
              val.dev_hash === row.dev_hash &&
              val.dev_ip === row.dev_ip &&
              val.dev_mac === row.dev_mac
            )
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
        const { data } = await getUncheckList(state.queryForm)
        state.list = data.jsonData
        state.total = data.totalCount
        state.listLoading = false
      }

      const onEditFinish = () => {
        fetchData()
      }
      // const getParentList = (rootList, id) => {
      //   let i = 0
      //   for (; i < rootList.length; i++) {
      //     const row = rootList[i]
      //     if (row.pid === id) {
      //       return rootList
      //     } else if (row.id === id) {
      //       return row.children
      //     }
      //     if (row.children && row.children.length > 0) {
      //       const result = getParentList(row.children, id)
      //       if (result != null) return result
      //     }
      //   }
      //   return null
      // }

      // const onEditFinish = (newData) => {
      //   //console.log(newData)
      //
      //   let pid = -1
      //   let oldParentList = null
      //   if (state.editRow) {
      //     pid = state.editRow.pid
      //     oldParentList = getParentList(state.list, pid)
      //   } else {
      //     //添加
      //     /*
      //     oldParentList = state.list
      //     state.list.push(newData) //push的数据没有$treeNodeId?? name为空
      //     state.editRow = newData
      //     state.total++
      //     */
      //     //重新加载数据
      //     fetchData()
      //     return
      //   }
      //
      //   //如果pid变化了，重新组织树形结构
      //   if (pid != newData.pid) {
      //     const newParentList = getParentList(state.list, newData.pid)
      //
      //     //原来的里面删除
      //     const index = oldParentList.findIndex((x) => {
      //       return x.id == state.editRow.id
      //     })
      //     oldParentList.splice(index, 1)
      //
      //     //新的添加,根据sort放到合适位置
      //     let i = 0
      //     let newIndex = 0
      //     for (; i < newParentList.length; i++) {
      //       if (
      //         newParentList[i].sort == undefined ||
      //         newParentList[i].sort == null ||
      //         newParentList[i].sort > newData.sort
      //       )
      //         break
      //       else newIndex = i
      //     }
      //     newParentList.splice(newIndex + 1, 0, state.editRow)
      //   }
      //
      //   //更新数据
      //   Object.keys(state.editRow).forEach((key) => {
      //     state.editRow[key] = newData[key]
      //   })
      // }
      const handlePageSizeChange = (val) => {
        state.queryForm.pageSize = val
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
        handleAdd,
        handleAgree,
        handleDeny,
        handleRowClick,
        handleSelect,
        handleSelectAll,
        handleCurrentChange,
        fetchData,
        onEditFinish,
        handlePageSizeChange,
        handlePageCurrentChange,
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
  $base: '.register-management';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
</style>
