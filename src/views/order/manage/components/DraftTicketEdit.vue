<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="1500px"
    @close="close"
  >
    <div class="deviceBlack-container">
      <vab-card shadow="hover">
        <vab-query-form>
          <vab-query-form-top-panel style="margin-left: 10px">
            <el-button
              :icon="DArrowLeft"
              plain
              type="success"
              @click="orderSaveClick()"
            >
              存草稿箱
            </el-button>
            <el-button
              :icon="DArrowRight"
              plain
              type="primary"
              @click="orderSubmitClick()"
            >
              提交审批
            </el-button>
          </vab-query-form-top-panel>
        </vab-query-form>
        <el-form ref="formRef" label-width="150px" :model="form" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="工作票名称：" prop="order_name">
                <el-input
                  v-model="form.order_name"
                  autocomplete="off"
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="业务模式：" prop="order_type">
                <el-input
                  v-model="form.order_type"
                  autocomplete="off"
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="运维时间段：" prop="start_end_time">
                <div class="block">
                  <el-date-picker
                    v-model="form.start_end_time"
                    end-placeholder="结束时间"
                    range-separator="——"
                    start-placeholder="开始时间"
                    type="datetimerange"
                  />
                </div>
              </el-form-item>
              <el-form-item label="审批人员：" prop="speUserId">
                <el-select
                  v-model="form.speUserId"
                  filterable
                  multiple
                  placeholder="选择审批人员"
                  style="width: 400px"
                  @change="updateSpeName"
                >
                  <el-option
                    v-for="item in speUserData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="目标系统：" prop="deviceObjectId">
                <el-tree-select
                  v-model="form.deviceObjectId"
                  check-strictly
                  :data="deviceTreeList"
                  filterable
                  placeholder="选择目标系统"
                  :props="{ label: 'name', value: 'id' }"
                  :render-after-expand="false"
                  style="width: 400px"
                  @change="updateGroupName"
                />
              </el-form-item>
              <el-form-item label="检修专区：" prop="location">
                <el-select
                  v-model="form.location"
                  placeholder="选择检修专区"
                  style="width: 400px"
                >
                  <el-option label="东区" :value="1" />
                  <el-option label="西区" :value="2" />
                  <el-option label="数据中心" :value="3" />
                </el-select>
              </el-form-item>
              <el-form-item label="工作票内容说明：" prop="description">
                <el-input
                  v-model="form.description"
                  autocomplete="off"
                  style="width: 400px"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-row>
          <!-- 下左表格 -->
          <el-col
            :span="12"
            style="
              box-sizing: border-box;
              padding: 20px;
              border: 2px solid gainsboro;
            "
          >
            <vab-query-form>
              <vab-query-form-top-panel :span="12">
                <el-button :icon="Search" type="primary" @click="addOperator">
                  添加运维人员
                </el-button>
                <el-button
                  :icon="Search"
                  type="primary"
                  @click="deleteOperator"
                >
                  删除运维人员
                </el-button>
              </vab-query-form-top-panel>
              <vab-query-form-right-panel :span="12" />
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
                label="运维人员名称"
                prop="name"
                show-overflow-tooltip
                sortable
              />
              <el-table-column
                label="运维人员账号"
                prop="account"
                show-overflow-tooltip
                sortable
              />
              <el-table-column
                label="账号描述"
                prop="description"
                show-overflow-tooltip
                sortable
              />
              <template #empty>
                <el-empty class="vab-data-empty" description="暂无数据" />
              </template>
            </el-table>
          </el-col>
          <el-col
            :span="12"
            style="
              box-sizing: border-box;
              padding: 20px;
              border: 2px solid gainsboro;
            "
          >
            <vab-query-form>
              <vab-query-form-top-panel :span="12">
                <el-button :icon="Search" type="primary" @click="addDevice">
                  添加运维设备
                </el-button>
                <el-button :icon="Search" type="primary" @click="deleteDevice">
                  删除运维设备
                </el-button>
              </vab-query-form-top-panel>
              <vab-query-form-right-panel :span="12" />
            </vab-query-form>
            <el-table
              ref="deviceTableRef"
              v-loading="listLoading"
              border
              :data="deviceData"
              :default-expand-all="true"
              highlight-current-row
              row-key="id"
              size="small"
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              @current-change="handleCurrentChange"
              @row-click="handleDeviceRowClick"
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
              <el-table-column
                label="特权账号"
                prop="tqzh"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <el-input
                    v-model="row.tqzh"
                    placeholder="请输入数据"
                    @click="handleInput(row)"
                  />
                </template>
              </el-table-column>
              <template #empty>
                <el-empty class="vab-data-empty" description="暂无数据" />
              </template>
            </el-table>
          </el-col>
        </el-row>
      </vab-card>
      <edit ref="editRef" @edit-finish="onEditFinish" />
      <EditDevice ref="editDeviceRef" @edit-finish="onDeviceEditFinish" />
    </div>
  </el-dialog>
</template>

<script>
  import { orderSave } from '@/api/order/orderInsert'
  // 设备组接口
  import { getTree } from '@/api/dev/group'
  // 设备接口
  import { getPage } from '@/api/dev/info'
  // 用户列表接口
  import { getPage as getUserList } from '@/api/admin/user'
  import {
    Plus,
    Delete,
    DArrowLeft,
    DArrowRight,
    Search,
    SortUp,
    SortDown,
    CircleCheck,
  } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'DeviceBlack',
    components: {
      Edit: defineAsyncComponent(() =>
        import('@/views/order/insert/components/UserInfo.vue')
      ),
      EditDevice: defineAsyncComponent(() =>
        import('@/views/order/insert/components/DeviceInfo.vue')
      ),
    },
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        formRef: null,
        editRef: null,
        editDeviceRef: null,
        userTotal: 0,
        deviceTotal: 0,
        userTableRef: null,
        deviceTableRef: null,
        speUserData: [],
        userData: [],
        deviceTreeList: [],
        deviceData: [],
        currentRow: null,
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true,
        selectRows: '',
        list: [],
        title: '工作票申请',
        dialogFormVisible: false,
        location: [
          {
            value: 1,
            label: '东区',
          },
          {
            value: 2,
            label: '西区',
          },
          {
            value: 3,
            label: '数据中心',
          },
        ],
        form: {
          id: 0,
          tqzh: [],
          status: 0,
        },
        rules: {
          order_name: [
            { required: true, trigger: 'blur', message: '请输入工作票名称' },
          ],
          order_type: [
            {
              required: true,
              trigger: 'blur',
              message: '请选择工作票业务模式',
            },
          ],
          start_end_time: [
            { required: true, message: '请选择工作票时间段', trigger: 'blur' },
          ],
          operatorListId: [
            { required: true, message: '请选择运维人员', trigger: 'blur' },
          ],
          speUserId: [
            {
              required: true,
              message: '请选择审批人员',
              trigger: 'blur',
            },
          ],
          deviceObjectId: [
            { required: true, message: '请选择目标系统', trigger: 'blur' },
          ],
          deviceListId: [
            { required: true, message: '请选择目标设备', trigger: 'blur' },
          ],
          location: [
            { required: true, message: '请选择检修专区', trigger: 'blur' },
          ],
          description: [
            {
              required: true,
              message: '请输入工作票说明信息',
              trigger: 'blur',
            },
          ],
        },
        userSearchForm: {
          pageNow: 1,
          pageSize: 10,
          option: '*',
          condition: '',
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
            label: '运维人员名称',
          },
          {
            value: 'account',
            label: '运维人员帐号',
          },
        ],
        deviceSearchOptions: [
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
          {
            value: 'operator_name',
            label: '负责人',
          },
          {
            value: 'org_name',
            label: '所属系统',
          },
        ],
        listLoading: true,
        elementLoadingText: '正在加载...',
      })

      const formatJson = (filterVal, jsonData) => {
        return jsonData.map((v) => filterVal.map((j) => v[j]))
      }

      const addOperator = () => {
        state['editRef'].showAdd(state.userData)
      }
      const onEditFinish = (data) => {
        state.userData = data
        return
      }

      const deleteOperator = () => {
        const selectedRows = state.userTableRef.getSelectionRows()
        selectedRows.forEach((row) => {
          const index = state.userData.findIndex((item) => {
            // 根据条件查找元素的索引
            return item.id === row.id // 例如，查找id为someId的元素
          })
          if (index !== -1) {
            state.userTableRef.toggleRowSelection(row, false)
            state.userData.splice(index, 1)
          }
        })
      }

      const addDevice = () => {
        if (state.deviceSearchForm.group_id == '') {
          $baseMessage('请先选择目标系统', 'error', 'vab-hey-message-error')
        } else {
          state['editDeviceRef'].showAdd(
            state.deviceData,
            state.deviceSearchForm
          )
        }
      }
      const onDeviceEditFinish = (data) => {
        state.deviceData = data
        return
      }

      const deleteDevice = () => {
        const selectedRows = state.deviceTableRef.getSelectionRows()
        selectedRows.forEach((row) => {
          const index = state.deviceData.findIndex((item) => {
            // 根据条件查找元素的索引
            return item.id === row.id // 例如，查找id为someId的元素
          })
          if (index !== -1) {
            state.deviceTableRef.toggleRowSelection(row, false)
            state.deviceData.splice(index, 1)
          }
        })
      }

      // 工作票申请暂存草稿
      const orderSaveClick = async () => {
        state['formRef'].validate(async (valid) => {
          if (state.userData.length === 0) {
            $baseMessage('请选择运维人员', 'error', 'vab-hey-message-success')
            return
          } else if (state.deviceData.length === 0) {
            $baseMessage('请选择运维设备', 'error', 'vab-hey-message-success')
            return
          }
          const selectedUserRows = state.userData
          const selectedDeviceRows = state.deviceData
          if (selectedUserRows.length > 0) {
            state.form.operatorListId = selectedUserRows.map((item) => item.id)
            state.form.operatorList = selectedUserRows.map((item) => item.name)
          }
          if (selectedDeviceRows.length > 0) {
            state.form.deviceListId = selectedDeviceRows.map((item) => item.id)
            state.form.deviceListName = selectedDeviceRows.map(
              (item) => item.name
            )
            state.form.deviceList = selectedDeviceRows.map((item) => item.ip)
            state.form.tqzh = selectedDeviceRows.map((item) => item.tqzh)
          }
          if (valid) {
            state.listLoading = true
            state.form.status = '0'
            const data = await orderSave(state.form)
            state.list = data
            if (data.msg === 'success') {
              $baseMessage(data.msg, 'success', 'vab-hey-message-success')
            } else {
              $baseMessage(data.msg, 'error', 'vab-hey-message-success')
            }
            state.userData = []
            state.deviceData = []
            state.formRef.resetFields()
            state.listLoading = false
          }
        })
      }

      // 工作票提交审核
      const orderSubmitClick = async () => {
        state['formRef'].validate(async (valid) => {
          if (state.userData.length === 0) {
            $baseMessage('请选择运维人员', 'error', 'vab-hey-message-success')
            return
          } else if (state.deviceData.length === 0) {
            $baseMessage('请选择运维设备', 'error', 'vab-hey-message-success')
            return
          }
          const selectedUserRows = state.userData
          const selectedDeviceRows = state.deviceData
          if (selectedUserRows.length > 0) {
            state.form.operatorListId = selectedUserRows.map((item) => item.id)
            state.form.operatorList = selectedUserRows.map((item) => item.name)
          }
          if (selectedDeviceRows.length > 0) {
            state.form.deviceListId = selectedDeviceRows.map((item) => item.id)
            state.form.deviceListName = selectedDeviceRows.map(
              (item) => item.name
            )
            state.form.deviceList = selectedDeviceRows.map((item) => item.ip)
            state.form.tqzh = selectedDeviceRows.map((item) => item.tqzh)
          }
          if (valid) {
            $baseConfirm('你确定要提交审核该工作票吗？', null, async () => {
              state.listLoading = true
              state.form.status = '3'
              const data = await orderSave(state.form)
              state.list = data
              if (data.msg === 'success') {
                $baseMessage(data.msg, 'success', 'vab-hey-message-success')
              } else {
                $baseMessage(data.msg, 'error', 'vab-hey-message-success')
              }
              state.userData = []
              state.deviceData = []
              state.formRef.resetFields()
              state.listLoading = false
            })
          }
        })
      }

      //输入特权账号
      const handleInput = (row) => {
        state.deviceData.find((item) => item.id === row.id).tqzh = row.tqzh
      }

      //获取人员信息(下拉框)
      const fetchUserData = async () => {
        state.listLoading = true
        const { data: speUserData } = await getUserList()
        state.speUserData = speUserData.rows
        state.listLoading = false
      }

      // 获取设备分组信息（下拉框）
      const fetchDeviceGroup = async () => {
        state.listLoading = true
        const { data } = await getTree(state.queryForm)
        state.deviceTreeList = data
        state.listLoading = false
      }

      // 获取设备分组对应的设备信息（下拉框）
      const fetchDevice = async () => {
        state.listLoading = true
        state.deviceSearchForm.group_id = state.form.deviceObjectId
        const { data } = await getPage(state.deviceSearchForm)
        state.deviceData = data.rows
        state.deviceTotal = data.total
        state.listLoading = false
      }

      // 根据Id将名字也添加到form中，以下四个方法均一样
      const updateUserName = () => {
        state.form.operatorList = []
        state.form.operatorListId.forEach((operatorlistid) => {
          state.form.operatorList.push(
            state.userData.find((item) => item.id === operatorlistid).name
          )
        })
      }

      const updateSpeName = () => {
        state.form.spe_user = []
        state.form.speUserId.forEach((speuserid) => {
          state.form.spe_user.push(
            state.speUserData.find((item) => item.id === speuserid).name
          )
        })
      }

      const updateGroupName = () => {
        state.form.deviceObject = state.deviceTreeList.find(
          (item) => item.id === state.form.deviceObjectId
        ).name
        state.deviceSearchForm.group_id = state.form.deviceObjectId
        state.deviceData = []
        state.form.deviceListId = []
      }

      const updateDevice = () => {
        state.form.deviceList = []
        state.form.deviceListName = []
        state.form.deviceListId.forEach((devicelistid) => {
          state.form.deviceList.push(
            state.deviceData.find((item) => item.id === devicelistid).ip
          )
          state.form.deviceListName.push(
            state.deviceData.find((item) => item.id === devicelistid).name
          )
        })
      }

      //获取当前选中行的内容
      const handleCurrentChange = (currentRow) => {
        state.currentRow = currentRow
      }

      const handleUserRowClick = (row, column) => {
        if (column && (column.label === '排序' || column.label === '操作'))
          return
        state.userTableRef.toggleRowSelection(row)
      }

      const handleDeviceRowClick = (row, column) => {
        if (column && (column.label === '排序' || column.label === '操作'))
          return
        state.deviceTableRef.toggleRowSelection(row)
      }

      //刷新表格中数据
      const handleSync = () => {
        fetchData()
        $baseMessage(
          '违规外联信息同步成功!',
          'success',
          'vab-hey-message-success'
        )
      }

      //获取数据
      const fetchData = async () => {
        state.listLoading = true
        // const { data } = await order_save(state.searchForm)
        // state.list = data.jsonData
        // console.log(state.list)
        // state.total = data.totalCount
        fetchUserData()
        fetchDeviceGroup()
        state.listLoading = false
      }

      //处理页面大小改变--运维人员
      const handleUserPageSizeChange = (val) => {
        state.userSearchForm.pageSize = val
        fetchUserData()
      }
      //当前页面--运维人员
      const handleUserPageCurrentChange = (val) => {
        state.userSearchForm.pageNow = val
        fetchUserData()
      }

      //处理页面大小改变--目标设备
      const handleDevicePageSizeChange = (val) => {
        state.deviceSearchForm.pageSize = val
        fetchDevice()
      }
      //当前页面--目标设备
      const handleDevicePageCurrentChange = (val) => {
        state.deviceSearchForm.pageNow = val
        fetchDevice()
      }

      const showEdit = (
        speUserData,
        userData,
        location,
        deviceTreeList,
        deviceData,
        row,
        list
      ) => {
        state.title = '编辑'
        state.form = JSON.parse(JSON.stringify(row))
        state.speUserData = speUserData
        state.userData = userData
        state.location = location
        state.deviceTreeList = deviceTreeList
        state.deviceData = deviceData
        state.list = list
        // state.deviceSearchForm.group_id = state.form.deviceObjectId
        console.log(state.form)
        fetchData()
        state.dialogFormVisible = true
      }

      onMounted(() => {
        fetchUserData()
        fetchDeviceGroup()
      })

      return {
        ...toRefs(state),
        addOperator,
        fetchData,
        fetchUserData,
        fetchDeviceGroup,
        fetchDevice,
        handleInput,
        updateUserName,
        updateSpeName,
        updateGroupName,
        updateDevice,
        formatJson,
        handleSync,
        handleUserRowClick,
        handleDeviceRowClick,
        handleCurrentChange,
        handleUserPageSizeChange,
        handleUserPageCurrentChange,
        handleDevicePageSizeChange,
        handleDevicePageCurrentChange,
        orderSaveClick,
        orderSubmitClick,
        onEditFinish,
        deleteOperator,
        addDevice,
        deleteDevice,
        onDeviceEditFinish,
        showEdit,
        Plus,
        Delete,
        DArrowLeft,
        DArrowRight,
        Search,
        SortUp,
        SortDown,
        CircleCheck,
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
<style scoped>
  .block {
    flex: 1;
    border-right: solid 1px var(--el-border-color);
  }
  .block:last-child {
    border-right: none;
  }
</style>
