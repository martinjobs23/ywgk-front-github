<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="900px"
    @close="close"
  >
    <el-tabs v-model="activeName" @tab-click="tabsHandleClick">
      <el-tab-pane label="基本信息" name="basicInfo">
        <el-form
          ref="formRef"
          inline
          label-width="100px"
          :model="form"
          :rules="rules"
        >
          <!-- <el-form-item label="设备类型" prop="type_id">
        <el-select
          v-model="form.type_id"
          style="width: 240px"
          @change="onSelectChange"
        >
          <el-option
            v-for="item in typelist"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-checkbox
          v-if="form.id.length > 1"
          v-model="checked['type_id']"
          label=" 修改"
          name="type_id"
        />
      </el-form-item> -->
          <el-form-item label="所属部门:" prop="org_id">
            <el-tree-select
              v-model="form.org_id"
              check-strictly
              :data="orgData"
              filterable
              placeholder="选择上级组织机构"
              :props="{ label: 'name', value: 'id' }"
              :render-after-expand="false"
              style="width: 240px"
            />
            <el-checkbox
              v-if="form.id.length > 1"
              v-model="checked['org_id']"
              label=" 修改"
              name="org_id"
            />
          </el-form-item>
          <el-form-item label="所属设备组:" prop="group_id">
            <el-tree-select
              v-model="form.group_id"
              check-strictly
              :data="groupData"
              filterable
              placeholder="选择所属设备组"
              :props="{ label: 'name', value: 'id' }"
              :render-after-expand="false"
              style="width: 240px"
            />
            <el-checkbox
              v-if="form.id.length > 1"
              v-model="checked['group_id']"
              label=" 修改"
              name="group_id"
            />
          </el-form-item>
          <el-form-item label="使用情况" prop="use_state">
            <el-select v-model="form.use_state" style="width: 240px">
              <el-option label="在用" value="在用" />
              <el-option label="停用" value="停用" />
              <el-option label="在建" value="在建" />
            </el-select>
            <el-checkbox
              v-if="form.id.length > 1"
              v-model="checked['use_state']"
              label=" 修改"
              name="use_state"
            />
          </el-form-item>
          <!-- <el-form-item label="密级" prop="secret_level">
        <el-select v-model="form.secret_level" style="width: 240px">
          <el-option label="非密" value="非密" />
          <el-option label="内部" value="内部" />
        </el-select>
        <el-checkbox
          v-if="form.id.length > 1"
          v-model="checked['secret_level']"
          label=" 修改"
          name="secret_level"
        />
      </el-form-item> -->
          <el-form-item label="运维人员:" prop="operator_id">
            <el-select
              v-model="form.operator_id"
              filterable
              multiple
              :multiple-limit="10"
              placeholder="选择设备运维人员"
              :render-after-expand="false"
              style="width: 240px"
            >
              <el-option
                v-for="item in userData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-checkbox
              v-if="form.id.length > 1"
              v-model="checked['operator_id']"
              label=" 修改"
              name="operator_id"
            />
          </el-form-item>
          <el-form-item label="专责:" prop="manager_id">
            <el-tree-select
              v-model="form.manager_id"
              :data="userData"
              filterable
              multiple
              :multiple-limit="10"
              placeholder="选择设备专责"
              :props="{ label: 'name', value: 'id' }"
              :render-after-expand="false"
              style="width: 240px"
            />
            <el-checkbox
              v-if="form.id.length > 1"
              v-model="checked['manager_id']"
              label=" 修改"
              name="manager_id"
            />
          </el-form-item>

          <template v-for="val in editFieldArray" :key="val.label">
            <el-form-item :label="val.label" :prop="val.prop">
              <el-input v-model="form[val.prop]" style="width: 240px" />
              <el-checkbox
                v-if="form.id.length > 1"
                v-model="checked[val.prop]"
                label="修改"
                name="[val.prop]"
              />
            </el-form-item>
          </template>
        </el-form>
      </el-tab-pane>
      <!-- <el-tab-pane label="设备账号" name="accountInfo">
        <el-form
          ref="formRef"
          inline
          label-width="100px"
          :model="form"
          :rules="rules"
        >
          <el-button
            :icon="Plus"
            plian
            size="small"
            type="primary"
            @click="addItem"
          >
            添加项
          </el-button>
          <el-table
            ref="tableRef"
            border
            :data="accountData"
            max-height="400px"
            stripe
            style="width: 100%"
          >
            <el-table-column label="账号" prop="account" sortable>
              <template #default="{ row }">
                <el-input v-model="row.account" />
              </template>
            </el-table-column>
            <el-table-column label="密码" prop="password">
              <template #default="{ row }">
                <el-input v-model="row.password" show-password />
              </template>
            </el-table-column>
            <el-table-column label="特权账号" prop="account_type">
              <template #default="{ row }">
                <el-select v-model="row.account_type">
                  <el-option label="特权账号" :value="1" />
                  <el-option label="普通账号" :value="0" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  :icon="Delete"
                  plain
                  size="small"
                  type="danger"
                  @click="deleteItem(scope.$index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane> -->
      <el-tab-pane label="设备协议" name="protocolInfo">
        <el-form
          ref="formRef"
          inline
          label-width="100px"
          :model="form"
          :rules="rules"
        >
          <el-table border :data="protocolData" stripe style="width: 100%">
            <el-table-column
              align="center"
              fixed="left"
              label="状态"
              type=""
              width="55"
            >
              <template #default="{ row }">
                <vab-icon
                  v-if="row.valid == true"
                  icon="checkbox-circle-fill"
                  style="color: #92ca41"
                />
                <vab-icon
                  v-if="row.valid == false || row.valid == null"
                  icon="close-circle-line"
                />
              </template>
            </el-table-column>
            <el-table-column label="协议名称" prop="protocol" sortable>
              <template #default="{ row }">
                <el-input v-model="row.protocol" disabled size="samll" />
              </template>
            </el-table-column>
            <el-table-column label="端口" prop="port">
              <template #default="{ row }">
                <el-input v-model="row.port" size="samll" />
              </template>
            </el-table-column>
            <el-table-column label="是否启用" prop="valid">
              <template #default="{ row }">
                <el-select v-model="row.valid">
                  <el-option label="启用" :value="true" />
                  <el-option label="停用" :value="false" />
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import {
    doAdd,
    doEdit,
    // getAccountList,
    getProtocolList,
  } from '@/api/dev/info'
  import { Plus, Delete } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'DevInfoEdit',
    emits: ['finish-fetchdata'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        activeName: 'basicInfo',
        formRef: null,
        orgData: [],
        groupData: [],
        userData: [],
        accountData: [],
        protocolData: [
          { protocol: 'RDP', port: '13389', valid: true },
          { protocol: 'SSH', port: '22', valid: true },
          { protocol: 'FTP', port: '21', valid: true },
          { protocol: 'SFTP', port: '22', valid: true },
          { protocol: 'VNC', port: '5901', valid: true },
          { protocol: 'TELNET', port: '23', valid: false },
          { protocol: 'IE', port: '8080', valid: false },
          { protocol: 'Oracle', port: '1521', valid: false },
          { protocol: 'MySQL', port: '1521', valid: false },
          { protocol: 'X11', port: '21', valid: false },
          { protocol: 'scp', port: '22', valid: false },
        ],
        typelist: [],
        checked: [],
        editdata: {},
        fieldSet: new Set([]),
        editFieldArray: [],
        shortcuts: [
          {
            text: '今天',
            value: new Date(),
          },
          {
            text: '明天',
            value: () => {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24)
              return date
            },
          },
          {
            text: '后天',
            value: () => {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 48)
              return date
            },
          },
        ],
        form: {
          accountData: [],
          protocolData: [],
        },
        rules: {
          // type_id: [{ required: true, trigger: 'blur', message: '请选择分类' }],
          name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
          ip: [
            { required: true, trigger: 'blur', message: '请输入设备IP' },
            {
              pattern:
                /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
              required: true,
              trigger: 'blur',
              message: '请输入正确的设备IP',
            },
          ],
          account: [{ required: true, trigger: 'blur', message: '请输入账号' }],
          password: [
            { required: true, trigger: 'blur', message: '请输入密码' },
          ],
          account_type: [
            { required: true, trigger: 'blur', message: '请选择账号类型' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      })
      const handleCheckBoxChange = (value) => {
        if (value.length == 0) state.form.methods = ''
        else {
          state.form.methods = value.join(' & ')
        }
      }
      const onSelectChange = (value) => {
        let obj = {}
        obj = state.typelist.find((item) => {
          return item.id === value
        })
        //console.log(value + ' ' + obj.location)
        state.form.type = obj.name
      }
      const handleIcon = (item) => {
        state.form.icon = item
      }
      const showAdd = (
        orgData,
        groupData,
        userData,
        pid,
        typelist,
        fieldSet,
        editFieldSet,
        type_id,
        protocolData
      ) => {
        state.activeName = 'basicInfo'
        state.form = {}
        state.title = '添加'
        state.form.pid = pid
        state.form.id = 0
        state.form.type_id = type_id
        state.orgData = orgData
        state.groupData = groupData
        state.userData = userData
        state.typelist = typelist
        state.fieldSet = fieldSet
        state.protocolData = protocolData
        state.editFieldArray = Array.from(editFieldSet)
        state.dialogFormVisible = true
      }
      const showEdit = (
        orgData,
        groupData,
        userData,
        row,
        typelist,
        fieldSet,
        editFieldSet,
        protocolData
      ) => {
        state.activeName = 'basicInfo'
        state.title = '编辑'
        state.form = JSON.parse(JSON.stringify(row))
        state.orgData = orgData
        state.groupData = groupData
        state.userData = userData
        state.typelist = typelist
        state.fieldSet = fieldSet
        state.protocolData = protocolData
        state.editFieldArray = Array.from(editFieldSet)
        fetchData()
        state.dialogFormVisible = true
      }
      const showMultiEdit = (
        orgData,
        groupData,
        userData,
        row,
        typelist,
        fieldSet,
        editFieldSet,
        ids
      ) => {
        state.activeName = 'basicInfo'
        state.title = '批量修改[' + ids.length + ']个资产信息'
        state.form = JSON.parse(JSON.stringify(row))
        state.form.id = ids
        state.groupData = groupData
        state.orgData = orgData
        state.userData = userData
        state.typelist = typelist
        state.fieldSet = fieldSet

        if (state.form.id.length > 1) {
          console.log('MultiEdit: ' + ids.length)
          state.checked = {}
          state.editdata = {}
          state.editFieldArray = []
          //批量修改时候，删除没有设置的属性,如序列号，IP,MAC 等
          for (const field of editFieldSet) {
            if (
              field.prop != 'number' &&
              field.prop != 'SN' &&
              field.prop != 'disk_sn' &&
              field.prop != 'ip' &&
              field.prop != 'mac'
            ) {
              state.editFieldArray.push(field)
              console.log(
                'editFieldSet add: ' +
                  field.prop +
                  ' ' +
                  field.label +
                  ' ' +
                  state.editFieldArray.size
              )
            }
          }
        } else {
          //单个编辑
          state.editFieldArray = Array.from(editFieldSet)
        }

        state.dialogFormVisible = true
      }
      const addItem = () => {
        // 添加一个新的表格项
        state.accountData.push({
          account: null,
          password: null,
          account_type: null,
        })
      }
      const deleteItem = (index) => {
        // 删除指定的表格项
        state.accountData.splice(index, 1)
      }
      //点击标签页触发事件
      const tabsHandleClick = async (tab) => {
        //获取标签页name
        state.activeName = tab.props.name
        // if (state.title == '编辑' && state.activeName == 'accountInfo') {
        //   //获取当前设备账号信息
        //   const { data: list } = await getAccountList(state.form)
        //   state.accountData = list
        // } else if (
        //   state.title == '编辑' &&
        //   state.activeName == 'protocolInfo'
        // ) {
        //   //获取当前设备协议端口信息
        //   const { data: list } = await getProtocolList(state.form)
        //   state.protocolData.forEach((x) => {
        //     const obj = list.find((item) => {
        //       return item.protocol === x.protocol
        //     })
        //     if (obj) {
        //       x.port = obj.port
        //       x.valid = true
        //     }
        //   })
        // }
      }
      function listToMap(listData) {
        const map = new Map()
        for (let i = 0; i < listData.length; i++) {
          const item = listData[i]
          map.set(item.id, item.name)
        }
        return map
      }
      const fetchData = async () => {
        // //获取当前设备账号信息
        // const { data: accountList } = await getAccountList(state.form)
        // state.accountData = accountList
        //获取当前设备协议端口信息
        const { data: protocolList } = await getProtocolList(state.form)
        state.protocolData.forEach((x) => {
          const obj = protocolList.find((item) => {
            return item.protocol === x.protocol
          })
          if (obj) {
            x.port = obj.port
            x.valid = true
          }
        })
        state.userMap = listToMap(state.userData)
      }
      const close = () => {
        state['formRef'].resetFields()
        state.accountData = []
        state.dialogFormVisible = false
      }
      const save = () => {
        state['formRef'].validate(async (valid) => {
          let response
          if (valid) {
            //过滤为空的账号信息
            state.form.accountData = state.accountData.filter(
              (item) => item.account != null && item.account != ''
            )
            //过滤生效的协议端口
            state.form.protocolData = state.protocolData.filter(
              (item) => item.valid == true
            )
            delete state.form.protocolData.valid
            //处理operator_name
            let operator_name = ''
            state.form.operator_id.forEach((x) => {
              let obj = ''
              obj = state.userMap.get(x)
              operator_name = operator_name + obj + ','
            })
            state.form.operator_name = operator_name.slice(0, -1)
            //处理manager_name
            let manager_name = ''
            state.form.manager_id.forEach((x) => {
              let obj = ''
              obj = state.userMap.get(x)
              manager_name = manager_name + obj + ','
            })
            state.form.manager_name = manager_name.slice(0, -1)
            //处理批量修改
            if (state.form.id.length > 1) {
              state.editdata.id = state.form.id

              //批量修改是否选中
              if (state.checked['type_id']) {
                state.editdata.type_id = state.form.type_id
                state.editdata.type = state.form.type
              }

              if (state.checked['org_id']) {
                state.editdata.org_id = state.form.org_id
                state.editdata.org_name = state.form.org_name
              }

              state.fieldSet.forEach((field) => {
                console.log(
                  field.prop + ' checked=' + state.checked[field.prop]
                )

                if (state.checked[field.prop]) {
                  console.log(
                    state.editdata[field.prop] + ' => ' + state.form[field.prop]
                  )
                  state.editdata[field.prop] = state.form[field.prop]
                }
              })
              console.log(state.form)
              console.log(state.editdata)
              response = await doEdit(state.editdata)
            } else if (
              state.form.id === undefined ||
              state.form.id === null ||
              state.form.id === 0
            ) {
              response = await doAdd(state.form)
            } else {
              response = await doEdit(state.form)
            }

            if (response.data <= 0)
              $baseMessage(
                '失败:' + response.msg,
                'error',
                'vab-hey-message-error'
              )
            else {
              $baseMessage(
                '保存数据成功: 保存了' + response.data + '个数据',
                'success',
                'vab-hey-message-success'
              )
              if (state.form.id.length > 1) state.form.id = state.form.id[0]
              emit('finish-fetchdata', state.form)
              close()
            }
          }
        })
      }
      onMounted(async () => {})
      return {
        ...toRefs(state),
        handleCheckBoxChange,
        onSelectChange,
        handleIcon,
        showAdd,
        showEdit,
        addItem,
        deleteItem,
        showMultiEdit,
        tabsHandleClick,
        fetchData,
        close,
        save,
        Plus,
        Delete,
      }
    },
  })
</script>
