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
      <el-form-item label="专机名称" prop="name">
        <el-input v-model="form.name" style="width: 240px" />
      </el-form-item>
      <el-form-item label="IP地址" prop="ip">
        <el-input v-model="form.ip" style="width: 240px" />
      </el-form-item>
      <el-form-item label="MAC地址" prop="mac">
        <el-input v-model="form.mac" style="width: 240px" />
      </el-form-item>
      <!-- <el-form-item label="位置" prop="location">
        <el-input v-model="form.location" style="width: 240px" />
      </el-form-item> -->
      <el-form-item label="位置" prop="location">
        <el-select v-model="form.location" style="width: 240px">
          <el-option label="东区" :value="1" />
          <el-option label="西区" :value="2" />
          <el-option label="数据中心" :value="3" />
        </el-select>
      </el-form-item>

      <!--      <el-form-item v-if="ifedit" label="在线状态" prop="online">-->
      <!--        <el-switch-->
      <!--          v-model="form.online"-->
      <!--          active-text="在线"-->
      <!--          :active-value="1"-->
      <!--          inactive-text="不在线"-->
      <!--          :inactive-value="0"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item v-if="ifedit" label="登录状态" prop="logined">-->
      <!--        <el-switch-->
      <!--          v-model="form.logined"-->
      <!--          active-text="已登录"-->
      <!--          :active-value="1"-->
      <!--          inactive-text="未登录"-->
      <!--          :inactive-value="0"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="登录人员信息" prop="logined_username">
        <el-input v-model="form.logined_username" style="width: 240px" />
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model="form.description" style="width: 240px" />
      </el-form-item>
      <el-form-item v-if="ifedit" label="是否禁用" prop="disabled">
        <el-switch
          v-model="form.disabled"
          active-text="禁用"
          :active-value="1"
          inactive-text="在用"
          :inactive-value="0"
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
  import { doAdd, doEdit } from '@/api/workstation/manager'

  export default defineComponent({
    name: 'InfoEdit',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        formRef: null,
        ifedit: true,
        userData: [],
        treeData: [],
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
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请输入专机名称' },
          ],
          // model: [
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
          mac: [
            { required: true, trigger: 'blur', message: '请输入设备MAC地址' },
            {
              pattern: /^([0-9A-Fa-f]{2}[:-]?){5}[0-9A-Fa-f]{2}$/,
              message: '请输入正确的12位MAC地址',
              // transform: (value) => value.replace(/[:-]/g, ''),
            },
          ],
          location: [
            { required: true, trigger: 'blur', message: '请选择专机所在位置' },
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
        state.title = '编辑'
        state.form = JSON.parse(JSON.stringify(row))
        state.form.mac = state.form.mac.replace(/[:-]/g, '')
        state.ifedit = true
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
            } else {
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
      return {
        ...toRefs(state),
        handleCheckBoxChange,
        handleIcon,
        showAdd,
        showEdit,
        close,
        save,
      }
    },
  })
</script>
