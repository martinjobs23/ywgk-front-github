<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="1500px"
    @close="close"
  >
    <div class="deviceBlack-container">
      <vab-card>
        <vab-query-form>
          <vab-query-form-top-panel :span="12">
            <span style="font-size: 15px">运维人员选择</span>
          </vab-query-form-top-panel>
          <vab-query-form-right-panel :span="12">
            <el-form inline :model="deviceSearchForm">
              <el-form-item>
                <el-select
                  v-model="deviceSearchForm.option"
                  placeholder="选择搜索字段"
                  :popper-append-to-body="false"
                  style="width: 150px"
                >
                  <el-option
                    v-for="item in userSearchOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model.trim="deviceSearchForm.condition"
                  autofocus="true"
                  placeholder="请输入查询值"
                  style="margin-left: 10px"
                  @keyup.enter="fetchUserData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" type="primary" @click="fetchUserData">
                  查询
                </el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          ref="userTableRef"
          v-loading="listLoading"
          border
          :data="userData"
          :default-expand-all="true"
          highlight-current-row
          row-key="id"
          size="small"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @current-change="handleCurrentChange"
          @row-click="handleUserRowClick"
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
            prop="name"
            show-overflow-tooltip
            sortable
          />
          <el-table-column
            label="设备IP"
            prop="ip"
            show-overflow-tooltip
            sortable
          />
          <el-table-column
            label="负责人"
            prop="operator_name"
            show-overflow-tooltip
            sortable
          />
          <el-table-column
            label="所属系统"
            prop="org_name"
            show-overflow-tooltip
            sortable
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
          v-model:current-page="deviceSearchForm.pageNow"
          v-model:page-size="deviceSearchForm.pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100, 200, 300, 400, 500, 1000, 10000]"
          :small="small"
          :total="userTotal"
          @current-change="handleUserPageCurrentChange"
          @size-change="handleUserPageSizeChange"
        />
      </vab-card>
    </div>
  </el-dialog>
</template>

<script>
  import { doAdd, doEdit } from '@/api/check/checkIpManagement'
  // 设备接口
  import { getPage } from '@/api/dev/info'
  export default defineComponent({
    name: 'InfoEdit',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        userTableRef: null,
        userTotal: 0,
        selectedRows: [],
        userData: [],
        placeOptions: [],
        form: {
          id: 0,
        },
        rules: {
          ip: [{ required: true, trigger: 'blur', message: '请输入IP地址' }],
          port: [{ required: true, trigger: 'blur', message: '请输入端口号' }],
          person: [
            { required: true, trigger: 'blur', message: '请输入添加人员' },
          ],
          protocol: [
            { required: true, trigger: 'blur', message: '请选择通信协议' },
          ],
          part: [
            { required: true, trigger: 'blur', message: '请输入所属组织部门' },
          ],
          reason: [
            { required: true, trigger: 'blur', message: '请输入加入原因' },
          ],
        },
        deviceSearchForm: {
          pageNow: 1,
          pageSize: 10,
          option: '*',
          condition: '',
          group_id: '',
        },
        userSearchOptions: [
          {
            value: '*',
            label: '全局搜索',
          },
          {
            value: 'name',
            label: '设备名称',
          },
          {
            value: 'ip',
            label: '设备IP',
          },
        ],
        title: '',
        dialogFormVisible: false,
      })
      const handleCheckBoxChange = (value) => {
        if (value.length == 0) state.form.methods = ''
        else {
          state.form.methods = value.join(' & ')
        }
      }

      const handleIcon = (item) => {
        state.form.icon = item
      }

      const showAdd = async (userData1, deviceSearchForm) => {
        state.deviceSearchForm.group_id = deviceSearchForm.group_id
        await fetchUserData()
        await sleep(0)
        userData1.forEach((row) => {
          if (!state.selectedRows.includes(row)) {
            state.selectedRows.push(row)
          }
        })
        await sleep(0)
        if (state.selectedRows.length !== 0) {
          state.selectedRows.forEach((row) => {
            if (state.userData.some((item) => item.id === row.id)) {
              state.userTableRef.toggleRowSelection(
                state.userData.find((item) => item.id === row.id)
              )
            }
          })
        }
        state.dialogFormVisible = true
      }

      //解决异步方法
      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
      }

      const fetchUserData = async () => {
        state.listLoading = true
        const { data } = await getPage(state.deviceSearchForm)
        state.userData = data.rows
        state.userTotal = data.total

        await sleep(0)
        if (state.selectedRows.length !== 0) {
          state.selectedRows.forEach((row) => {
            if (state.userData.some((item) => item.id === row.id)) {
              state.userTableRef.toggleRowSelection(
                state.userData.find((item) => item.id === row.id)
              )
            }
          })
        }
        state.listLoading = false
        await sleep(0)
        if (state.userTableRef !== null) {
          const selectedRows = state.userTableRef.getSelectionRows()
          selectedRows.forEach((row) => {
            if (!state.selectedRows.some((item) => item.id === row.id)) {
              state.selectedRows.push(row)
            }
          })
        }
      }

      //处理页面大小改变
      const handleUserPageSizeChange = (val) => {
        state.deviceSearchForm.pageSize = val
        fetchUserData()
      }
      //当前页面
      const handleUserPageCurrentChange = (val) => {
        state.deviceSearchForm.pageNow = val
        fetchUserData()
      }

      const onSelectChange = (value) => {
        let obj = {}
        obj = state.placeOptions.find((item) => {
          return item.id === value
        })
        state.form.place = obj.location
      }

      //获取当前选中行的内容
      const handleCurrentChange = (currentRow) => {
        state.currentRow = currentRow
      }

      const handleUserRowClick = (row, column) => {
        if (column && (column.label === '排序' || column.label === '操作'))
          return
        if (!state.selectedRows.some((item) => item.id === row.id)) {
          state.userTableRef.toggleRowSelection(row)
          state.selectedRows.push(row)
        } else {
          const index = state.selectedRows.findIndex((item) => {
            // 根据条件查找元素的索引
            return item.id === row.id // 例如，查找id为someId的元素
          })
          if (index !== -1) {
            state.userTableRef.toggleRowSelection(row, false)
            state.selectedRows.splice(index, 1)
          }
        }
        // setChildrenSelection(row, isUserRowSelected(row))
      }

      const handleSelect = (selectedRows, row) => {
        if (!state.selectedRows.some((item) => item.id === row.id)) {
          // state.userTableRef.toggleRowSelection(row)
          state.selectedRows.push(row)
        } else {
          const index = state.selectedRows.findIndex((item) => {
            // 根据条件查找元素的索引
            return item.id === row.id // 例如，查找id为someId的元素
          })
          if (index !== -1) {
            state.userTableRef.toggleRowSelection(row, false)
            state.selectedRows.splice(index, 1)
          }
        }
      }

      const handleSelectAll = () => {
        state.userData.forEach((row) => {
          if (!state.selectedRows.some((item) => item.id === row.id)) {
            // state.userTableRef.toggleRowSelection(row)
            state.selectedRows.push(row)
          } else {
            const index = state.selectedRows.findIndex((item) => {
              // 根据条件查找元素的索引
              return item.id === row.id // 例如，查找id为someId的元素
            })
            if (index !== -1) {
              // state.userTableRef.toggleRowSelection(row, false)
              state.selectedRows.splice(index, 1)
            }
          }
        })
      }

      const handleDeviceRowClick = (row, column) => {
        if (column && (column.label === '排序' || column.label === '操作'))
          return
        state.deviceTableRef.toggleRowSelection(row)
        // setChildrenSelection(row, isDeviceRowSelected(row))
      }

      const finishEditing = () => {
        const selectedRows = state.userTableRef.getSelectionRows()
        if (state.selectedRows.length !== 0) {
          selectedRows.forEach((row) => {
            if (!state.selectedRows.some((item) => item.id === row.id)) {
              state.selectedRows.push(row)
            }
          })
        }

        // 通过$emit触发'edit-finish'事件，并传递数据
        emit('edit-finish', state.selectedRows)
      }

      const close = () => {
        state.form = {
          icon: '',
        }
        finishEditing()
        state.selectedRows = []
        state.deviceSearchForm = {
          pageNow: 1,
          pageSize: 10,
          option: '*',
          condition: '',
        }
        state.dialogFormVisible = false
      }
      const save = () => {
        state['formRef'].validate(async (valid) => {
          let response
          if (valid) {
            if (state.form.id === undefined || state.form.id <= 0) {
              response = await doAdd(state.form)
            } else {
              response = await doEdit(state.form)
            }
            if (response.data <= 0)
              $baseMessage(response.msg, 'error', 'vab-hey-message-error')
            else {
              $baseMessage(response.msg, 'success', 'vab-hey-message-success')
              emit('edit-finish', state.form)
              close()
            }
          }
        })
      }
      return {
        ...toRefs(state),
        handleCheckBoxChange,
        handleIcon,
        fetchUserData,
        showAdd,
        onSelectChange,
        handleUserPageSizeChange,
        handleUserPageCurrentChange,
        handleCurrentChange,
        handleUserRowClick,
        handleSelect,
        handleSelectAll,
        handleDeviceRowClick,
        finishEditing,
        sleep,
        close,
        save,
      }
    },
  })
</script>
