<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form
      ref="formRef"
      inline
      label-width="140px"
      :model="form"
      :rules="rules"
    >
      <!--      <el-form-item label="当前专机ID" prop="workstation_id">-->
      <!--        <el-input v-model="form.workstation_id" readonly style="width: 240px" />-->
      <!--      </el-form-item>-->
      <el-form-item label="当前专机名称" prop="workstation_name">
        <el-input
          v-model="form.workstation_name"
          readonly
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="工作票编号" prop="order_num">
        <el-input v-model="form.order_num" readonly style="width: 240px" />
      </el-form-item>
      <el-form-item label="工作票名称" prop="order_name">
        <el-input v-model="form.order_name" readonly style="width: 240px" />
      </el-form-item>
      <el-form-item v-if="editpwd === false" label="请选择位置" prop="location">
        <el-select
          v-model="form.location"
          placeholder="请先选择位置后再选择专机"
          style="width: 240px"
          @change="selectlocation"
        >
          <el-option label="东区" :value="1" />
          <el-option label="西区" :value="2" />
          <el-option label="数据中心" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="editpwd === false"
        label="请选择调整后的专机"
        prop="freeworkstationlist1"
      >
        <el-tree-select
          v-model="form.freeworkstationlist1"
          check-strictly
          :data="freeworkstationlist"
          filterable
          placeholder="请选择调整后的专机"
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
      <el-form-item v-if="editpwd" label="请输入密码：" prop="password">
        <el-input
          v-model="form.password"
          show-password
          style="width: 300px"
          type="password"
        />
      </el-form-item>
      <el-form-item v-if="editpwd" label="请重复新密码：" prop="repeatPassword">
        <el-input
          v-model="form.repeatPassword"
          show-password
          style="width: 300px"
          type="password"
        />
      </el-form-item>

      <el-form-item label="备注" prop="description">
        <el-input v-model="form.description" style="width: 240px" />
      </el-form-item>
    </el-form>

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
    doPwdEdit,
    getFreeWorkstationList,
  } from '@/api/workstation/distribution'

  export default defineComponent({
    name: 'InfoEdit',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')
      const validatePass = (rules, value, callback) => {
        if (value !== state.form.password) {
          callback(new Error('未与新密码保持一致！'))
        } else {
          callback()
        }
      }
      const state = reactive({
        formRef: null,
        ifedit: true,
        editpwd: true,
        userData: [],
        treeData: [],
        freeworkstationlist: [],
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
          id: null,
          loaction: '',
          online: 0,
          logined: 0,
          logined_username: '',
          disabled: 0,
          description: '',
          freeworkstationlist: [],
        },
        rules: {
          location: [
            {
              required: true,
              trigger: 'blur',
              message: '请选择位置',
            },
          ],
          freeworkstationlist1: [
            {
              required: true,
              trigger: 'blur',
              message: '请选择专机',
            },
          ],
          oldpassword: [
            { required: true, trigger: 'blur', message: '请输入旧密码' },
          ],
          password: [
            { required: true, trigger: 'blur', message: '请输入新密码' },
            {
              min: 6,
              max: 8,
              message: '密码大小大于6位小于8位',
              trigger: ['blur', 'change'],
            },
            {
              validator: function (rule, value, callback) {
                if (/^[^\s]*$/.test(value) == false) {
                  callback(new Error('密码格式有误，密码中不允许出现空格'))
                } else {
                  callback()
                }
              },
              trigger: 'blur',
            },
          ],
          repeatPassword: [
            {
              required: true,
              trigger: 'blur',
              message: '请重复密码',
            },
            {
              validator: validatePass,
              trigger: ['blur', 'change'],
            },
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

      const handleIcon = (item) => {
        state.form.icon = item
      }
      /*
      const fetchTreeData = async () => {
        const { data } = await getTree()
        state.treeData = data.list
      }*/

      const showAdd = (treeData, userData, pid) => {
        state.title = '添加'
        state.form.pid = pid
        state.ifedit = false
        state.dialogFormVisible = true
        state.treeData = treeData
        state.userData = userData
      }
      const showEdit = (treeData, userData, row) => {
        state.title = '编辑工位'
        state.form = JSON.parse(JSON.stringify(row))
        // state.form.mac = state.form.mac.replace(/[:-]/g, '')
        state.editpwd = false
        state.ifedit = true
        state.dialogFormVisible = true
        state.treeData = treeData
        state.userData = userData
        selectlocation()
      }
      const showPwdEdit = (treeData, userData, row) => {
        state.title = '修改密码'
        state.form = JSON.parse(JSON.stringify(row))
        // state.form.mac = state.form.mac.replace(/[:-]/g, '')
        state.ifedit = true
        state.editpwd = true
        state.dialogFormVisible = true
        state.treeData = treeData
        state.userData = userData
      }
      const close = () => {
        state['formRef'].resetFields()
        state.form = {
          icon: '',
        }
        state.dialogFormVisible = false
      }
      const save = () => {
        state['formRef'].validate(async (valid) => {
          state.form.username = state.form.dev_hash
          let response
          if (valid) {
            if (state.form.id === undefined || state.form.id <= 0) {
              response = await doAdd(state.form)
            } else if (state.editpwd === true) {
              state.form.workstation_password = state.form.password
              response = await doPwdEdit(state.form)
            } else {
              // state.form.order_id = state.form.freeworkstationlist1.id
              response = await doEdit(state.form)
            }

            if (response.code === 200) {
              $baseMessage(response.data, 'success', 'vab-hey-message-success')
              emit('edit-finish', state.form)
              close()
            } else {
              $baseMessage(response.data, 'error', 'vab-hey-message-error')
            }
          }
        })
      }
      const selectlocation = async () => {
        const { data } = await getFreeWorkstationList(state.form)
        state.freeworkstationlist = data
        console.log(data)
      }
      return {
        ...toRefs(state),
        handleCheckBoxChange,
        handleIcon,
        showAdd,
        showPwdEdit,
        showEdit,
        close,
        save,
        selectlocation,
      }
    },
  })
</script>
