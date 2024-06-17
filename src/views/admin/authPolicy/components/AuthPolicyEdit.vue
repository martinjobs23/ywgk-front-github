<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="60%"
    @close="close"
  >
    <el-form
      ref="formRef"
      inline
      label-width="140px"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="名称:" prop="name">
        <el-input v-model.trim="form.name" style="width: 240px" />
      </el-form-item>
      <el-form-item label="认证方法:" prop="methods">
        <el-checkbox-group
          v-model="form.methodList"
          v-mo
          @change="handleCheckBoxChange"
        >
          <el-checkbox disabled label="pwd">密码认证</el-checkbox>
          <el-checkbox label="ip">IP地址认证</el-checkbox>
          <el-checkbox label="time">登录时间段</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        v-if="pwdsetting"
        label="密码复杂度策略:"
        prop="java_regex_x"
      >
        <el-input
          v-model.trim="form.java_regex_x"
          placeholder="大写小写数字特殊字符(要求为1)"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item v-if="pwdsetting" label="密码有效期:" prop="valid_days">
        <el-input
          v-model.trim="form.valid_days"
          placeholder="输入密码有效期/天"
          style="width: 240px"
        />
        <!-- <el-input-number
          v-model.trim="form.valid_days"
          :max="1000"
          :min="30"
          placeholder="输入密码有效期/天"
          style="width: 240px"
        /> -->
      </el-form-item>
      <el-form-item v-if="pwdsetting" label="密码最小长度:" prop="min_len">
        <el-input
          v-model.trim="form.min_len"
          placeholder="最小长度"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item v-if="pwdsetting" label="密码最大长度:" prop="max_len">
        <el-input
          v-model.trim="form.max_len"
          placeholder="最大长度"
          style="width: 240px"
        />
        <!-- <el-input-number
          v-model.trim="form.min_len"
          :max="16"
          :min="8"
          placeholder="最小值"
          style="width: 120px"
        />
        <el-input-number
          v-model.trim="form.max_len"
          :max="256"
          :min="8"
          placeholder="最大值"
          style="width: 120px"
        /> -->
      </el-form-item>
      <el-form-item v-if="pwdsetting" label="锁定次数:" prop="fail_lock_count">
        <el-input
          v-model.trim="form.fail_lock_count"
          placeholder="连续登录失败锁定次数"
          style="width: 240px"
        />
        <!-- <el-input-number
          v-model.trim="form.fail_lock_count"
          :max="10"
          :min="1"
          placeholder="连续登录失败锁定次数"
          style="width: 240px"
        /> -->
      </el-form-item>
      <el-form-item v-if="pwdsetting" label="锁定时长:" prop="fail_lock_time">
        <el-input
          v-model.trim="form.fail_lock_time"
          placeholder="连续登录失败锁定时长/秒"
          style="width: 240px"
        />
        <!-- <el-input-number
          v-model.trim="form.fail_lock_time"
          :max="2400"
          :min="600"
          placeholder="连续登录失败锁定时长/s"
          style="width: 240px"
        /> -->
      </el-form-item>
      <el-form-item v-if="timeSetting" label="允许登录周期:" prop="weekday">
        <el-input
          v-model.trim="form.weekday"
          placeholder="周一到周日,允许为1"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item v-if="timeSetting" label="每天时间段:" prop="daytime">
        <el-input
          v-model.trim="form.daytime"
          placeholder="XX:XX-XX:XX"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="描述:" prop="description">
        <el-input v-model.trim="form.description" style="width: 240px" />
      </el-form-item>
      <el-form-item label="默认:">
        <el-switch
          v-model="form.is_default"
          :active-value="1"
          :inactive-value="0"
          style="width: 240px"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doAdd, doEdit, getSettingList } from '@/api/admin/authPolicy'

  export default defineComponent({
    name: 'AuthPolicyEdit',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        formRef: null,
        timeSetting: false,
        pwdsetting: true,
        treeData: [],
        form: {
          id: 0,
          name: '',
          methodList: [],
          methods: '',
          description: '',
          is_default: 0,
          min_len: '8',
          max_len: '127',
          fail_captcha_count: '',
          fail_lock_count: '5',
          fail_lock_time: '1200',
          valid_days: '90',
          ip_auto_bind: 0,
          java_regex_x: '1111',
          weekday: '',
          daytime: '',
        },
        rules: {
          name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
          methods: [
            { required: true, trigger: 'blur', message: '请选择认证方法' },
          ],
          min_len: [
            { required: true, trigger: 'blur', message: '请输入最小长度' },
          ],
          max_len: [
            { required: true, trigger: 'blur', message: '请输入最大长度' },
          ],
        },
        queryForm: {
          option: 'policy_id',
          condition: 0,
        },
        title: '',
        dialogFormVisible: false,
      })
      const handleCheckBoxChange = (value) => {
        if (value.length == 0) state.form.methods = ''
        else {
          state.form.methods = value.join(' & ')
        }
        state.timeSetting = state.form.methods.includes('time') ? true : false
        state.pwdsetting = state.form.methods.includes('pwd') ? true : false
        state.form.ip_auto_bind = state.form.methods.includes('ip') ? 1 : 0
      }
      const addNoParentItem = (data) => {
        //查找pid=0的选项
        let result = false
        let i = 0

        for (; i < data.length; i++) {
          if (data[i].id === 0) {
            result = true
            break
          }
        }

        if (result === false) {
          data.unshift({ id: 0, pid: -1, name: '无上级认证策略' })
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
      const showAdd = (treeData, pid) => {
        state.title = '添加'
        state.form.pid = pid
        state.form.methodList = ['pwd']
        state.pwdsetting = true
        state.dialogFormVisible = true

        //clone一份数据
        state.treeData = treeData.slice()

        //fetchTreeData()
        addNoParentItem(state.treeData)
      }
      const showEdit = (treeData, row) => {
        state.title = '编辑'
        state.form = JSON.parse(JSON.stringify(row))
        fetchSettingData(state.form.id)
        state.timeSetting = state.form.methods.includes('time') ? true : false
        state.pwdsetting = state.form.methods.includes('pwd') ? true : false
        state.form.ip_auto_bind = state.form.methods.includes('ip') ? 1 : 0
        state.dialogFormVisible = true

        //分割去空格
        const methodList = state.form.methods.split('&')
        let i = 0
        for (i = 0; i < methodList.length; i++) {
          methodList[i] = methodList[i].trim()
        }
        state.form.methodList = methodList

        //clone一份数据
        state.treeData = treeData.slice()

        //fetchTreeData()
        addNoParentItem(state.treeData)
      }
      const fetchSettingData = async (policy_id) => {
        state.listLoading = true
        state.queryForm.option = 'policy_id'
        state.queryForm.condition = policy_id
        const { data } = await getSettingList(state.queryForm)
        state.form.policy_id = state.form.id
        state.form.min_len = data.find(
          (item) => item.code === 'min_len' && item.method_code === 'pwd'
        )?.value
        state.form.max_len = data.find(
          (item) => item.code === 'max_len' && item.method_code === 'pwd'
        )?.value
        state.form.fail_captcha_count = data.find(
          (item) =>
            item.code === 'fail_captcha_count' && item.method_code === 'pwd'
        )?.value
        state.form.fail_lock_count = data.find(
          (item) =>
            item.code === 'fail_lock_count' && item.method_code === 'pwd'
        )?.value
        state.form.fail_lock_time = data.find(
          (item) => item.code === 'fail_lock_time' && item.method_code === 'pwd'
        )?.value
        state.form.valid_days = data.find(
          (item) => item.code === 'valid_days' && item.method_code === 'pwd'
        )?.value
        state.form.java_regex_x = data.find(
          (item) => item.code === 'java_regex_x' && item.method_code === 'pwd'
        )?.value
        state.form.weekday = data.find(
          (item) => item.code === 'weekday' && item.method_code === 'time'
        )?.value
        state.form.daytime = data.find(
          (item) => item.code === 'daytime' && item.method_code === 'time'
        )?.value
        state.listLoading = false
      }
      const close = () => {
        state['formRef'].resetFields()
        state.form = {
          icon: '',
        }
        state.timeSetting = false
        state.dialogFormVisible = false
      }
      const save = () => {
        state['formRef'].validate(async (valid) => {
          console.log(state.form)
          let response
          if (valid) {
            if (state.form.id === undefined || state.form.id <= 0) {
              response = await doAdd(state.form)
            } else {
              response = await doEdit(state.form)
            }
            if (response.data === 0)
              $baseMessage('保存数据失败', 'error', 'vab-hey-message-error')
            else {
              $baseMessage('保存数据成功', 'success', 'vab-hey-message-success')
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
        showAdd,
        showEdit,
        fetchSettingData,
        close,
        save,
      }
    },
  })
</script>
