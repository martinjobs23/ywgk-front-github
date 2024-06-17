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
      <el-form-item label="终端名称" prop="dev_name">
        <el-input v-model="form.dev_name" style="width: 240px" />
      </el-form-item>
      <el-form-item v-if="!ifedit" label="设备HASH" prop="dev_hash">
        <el-input v-model="form.dev_hash" style="width: 240px" />
      </el-form-item>
      <el-form-item v-if="ifedit" label="设备HASH" prop="dev_hash">
        <el-input
          v-model="form.dev_hash"
          :disabled="true"
          readonly
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="IP地址" prop="dev_ip">
        <el-input v-model="form.dev_ip" style="width: 240px" />
      </el-form-item>
      <el-form-item label="MAC地址" prop="dev_mac">
        <el-input
          v-model="form.dev_mac"
          :disabled="true"
          readonly
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="使用人" prop="user_name">
        <el-input v-model="form.user_name" style="width: 240px" />
      </el-form-item>
      <el-form-item label="位置" prop="location">
        <el-input v-model="form.location" style="width: 240px" />
      </el-form-item>
      <el-form-item label="终端型号" prop="model">
        <el-input v-model="form.model" style="width: 240px" />
      </el-form-item>
      <el-form-item label="终端分组" prop="org_id">
        <el-tree-select
          v-model="form.org_id"
          check-strictly
          :data="treeData"
          filterable
          placeholder="选择终端分组"
          :props="{ label: 'name', value: 'id' }"
          :render-after-expand="false"
          style="width: 240px"
        />
      </el-form-item>
      <!-- <el-form-item label="用户" prop="user_id">
        <el-tree-select
          v-model="form.user_id"
          check-strictly
          :data="userData"
          filterable
          placeholder="选择用户"
          :props="{ label: 'name', value: 'id' }"
          :render-after-expand="false"
          style="width: 240px"
        />
      </el-form-item> -->
      <el-form-item label="操作系统" prop="operation_system">
        <el-input v-model="form.operation_system" style="width: 240px" />
      </el-form-item>
      <el-form-item label="硬盘序列号" prop="disk_sn">
        <el-input v-model="form.disk_sn" style="width: 240px" />
      </el-form-item>
      <el-form-item label="安装时间" prop="install_time">
        <el-date-picker
          v-model="form.install_time"
          placeholder="选择安装时间"
          :shortcuts="shortcuts"
          style="width: 240px"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="启动时间" prop="bootup_time">
        <el-date-picker
          v-model="form.bootup_time"
          placeholder="选择启动时间"
          :shortcuts="shortcuts"
          style="width: 240px"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="备注" prop="dev_desc">
        <el-input v-model="form.dev_desc" style="width: 240px" />
      </el-form-item>
      <el-form-item v-if="ifedit" label="在线状态" prop="online">
        <el-switch
          v-model="form.online"
          active-text="在线"
          :active-value="1"
          inactive-text="不在线"
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
  import { doAdd, doEdit } from '@/api/terminal/info'

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
          org_id: null,
          name: '',
          dev_desc: '',
        },
        rules: {
          dev_name: [
            { required: true, trigger: 'blur', message: '请输入终端名称' },
          ],
          // model: [
          //   { required: true, trigger: 'blur', message: '请输入终端型号' },
          // ],
          // operation_system: [
          //   { required: true, trigger: 'blur', message: '请输入操作系统版本' },
          // ],
          dev_hash: [
            { required: true, trigger: 'blur', message: '请输入设备HASH' },
          ],
          // org_id: [
          //   { required: true, trigger: 'blur', message: '请选择组织机构' },
          // ],
          // user_name: [
          //   { required: true, trigger: 'blur', message: '请输入使用人姓名' },
          // ],
          // user_id: [{ required: true, trigger: 'blur', message: '请选择用户' }],
          dev_ip: [
            { required: true, trigger: 'blur', message: '请输入设备IP' },
            {
              pattern:
                /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
              required: true,
              trigger: 'blur',
              message: '请输入正确的设备IP',
            },
          ],
          dev_mac: [
            { required: true, trigger: 'blur', message: '请输入设备MAC地址' },
            {
              pattern: /^([0-9A-Fa-f]{2}[:-]?){5}[0-9A-Fa-f]{2}$/,
              message: '请输入正确的12位MAC地址',
              // transform: (value) => value.replace(/[:-]/g, ''),
            },
          ],
          // disk_sn: [
          //   { required: true, trigger: 'blur', message: '请输入硬盘序列号' },
          // ],
          // install_time: [
          //   { required: true, trigger: 'blur', message: '请输入系统安装时间' },
          // ],
          // bootup_time: [
          //   { required: true, trigger: 'blur', message: '请输入系统启动时间' },
          // ],
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
        state.form.dev_mac = state.form.dev_mac.replace(/[:-]/g, '')
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
