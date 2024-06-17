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
      <el-form-item label="目标设备名称" prop="ip">
        <el-input
          v-model="form.name"
          autocomplete="off"
          :autosize="{ minRows: 4, maxRows: 4 }"
          :disabled="true"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="目标设备IP" prop="ip">
        <el-input
          v-model="form.ip"
          autocomplete="off"
          :autosize="{ minRows: 4, maxRows: 4 }"
          :disabled="true"
          style="width: 240px"
        />
      </el-form-item>
      <!-- <el-form-item label="目标IP:">
        <el-select
          v-model="form.devicelist"
          placeholder="选择认证策略"
          style="width: 240px"
          @change="handleSelectChange"
        >
          <el-option
            v-for="item in devicelist"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item
        v-show="'tqzh' in form"
        label="是否使用特权账号"
        prop="file_limitdown"
      >
        <el-switch
          v-model="form.useTq"
          active-color="#13ce66"
          active-value="1"
          inactive-color="#ff4949"
          inactive-value="0"
          @change="handleSwitchChange"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="user">
        <el-input v-model="form.user" autocomplete="off" style="width: 240px" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          autocomplete="off"
          show-password
          style="width: 240px"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">登 录</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { pluginparam } from '@/api/order/orderTask'
  export default defineComponent({
    name: 'InfoEdit',
    emits: ['edit-finish'],
    setup() {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        formRef: null,
        treeData: [],
        placeOptions: [],
        form: {
          id: 0,
          tqzh: 0,
          file_limitdown: 0,
        },
        rules: {
          user: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
          password: [
            { required: true, trigger: 'blur', message: '请输入密码' },
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
      const showSsh = (row) => {
        state.title = 'SSH运维'
        state.form = row
        state.form.task = 'ssh'
        state.dialogFormVisible = true
      }
      const showRdp = (row) => {
        state.title = 'RDP运维'
        state.form = row
        state.form.task = 'rdp'
        state.dialogFormVisible = true
      }
      const showMySQL = (row) => {
        state.title = 'MySQL运维'
        state.form = row
        state.form.task = 'mysql'
        state.dialogFormVisible = true
      }
      const onSelectChange = (value) => {
        let obj = {}
        obj = state.placeOptions.find((item) => {
          return item.id === value
        })
        //console.log(value + ' ' + obj.location)
        state.form.place = obj.location
      }
      const close = () => {
        // state['formRef'].resetFields()
        state.form = {
          icon: '',
        }
        state.dialogFormVisible = false
      }
      // 当用户更改“是否使用特权账号开关”时，更改对应的用户密码框是否显示特权账号密码
      const handleSwitchChange = () => {
        if (state.form.tqzh !== null && state.form.useTq > 0) {
          state.form.user = 'yusheuser'
          state.form.password = 'yushepassword'
        } else {
          state.form.user = ''
          state.form.password = ''
        }
      }
      const save = async () => {
        state['formRef'].validate(async (valid) => {
          // if (valid) {
          //   if (state.form.id === undefined || state.form.id <= 0) {
          //     response = await doAdd(state.form)
          //   } else {
          //     response = await doEdit(state.form)
          //   }
          //   if (response.data <= 0)
          //     $baseMessage(response.msg, 'error', 'vab-hey-message-error')
          //   else {
          //     $baseMessage(response.msg, 'success', 'vab-hey-message-success')
          //     emit('edit-finish', state.form)
          //     close()
          //   }
          // }
          if (valid) {
            const response = await pluginparam(state.form)
            if (response.data == 'error') {
              $baseMessage(response.msg, 'error', 'vab-hey-message-error')
            } else
              window.location = 'ocxClientPluginnew://' + response.data.base64

            state.dialogFormVisible = false
          }
        })
      }
      return {
        ...toRefs(state),
        handleCheckBoxChange,
        handleIcon,
        showSsh,
        showRdp,
        showMySQL,
        onSelectChange,
        close,
        handleSwitchChange,
        save,
      }
    },
  })
</script>
