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
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 240px" />
      </el-form-item>
      <el-form-item label="型号" prop="model">
        <el-input v-model="form.model" style="width: 240px" />
      </el-form-item>
      <el-form-item label="操作系统" prop="os">
        <el-input v-model="form.os" style="width: 240px" />
      </el-form-item>
      <el-form-item label="IP地址" prop="ip">
        <el-input v-model="form.ip" style="width: 240px" />
      </el-form-item>
      <el-form-item label="MAC地址" prop="mac">
        <el-input v-model="form.mac" style="width: 240px" />
      </el-form-item>
      <el-form-item label="硬盘序列号" prop="disk_sn">
        <el-input v-model="form.disk_sn" style="width: 240px" />
      </el-form-item>
      <el-form-item label="系统安装时间" prop="install_date">
        <el-input v-model="form.install_date" style="width: 240px" />
      </el-form-item>
      <el-form-item label="启用时间" prop="bootup_time">
        <el-input v-model="form.bootup_time" style="width: 240px" />
      </el-form-item>
      <el-form-item label="在线状态" prop="online">
        <el-switch
          v-model="form.online"
          active-text="在线"
          active-value="1"
          inactive-text="不在线"
          inactive-value="0"
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
          id: 0,
          name: '',
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请输入会议名称' },
          ],
          place: [
            { required: true, trigger: 'blur', message: '请输入会议地点' },
          ],
          sponsor: [
            { required: true, trigger: 'blur', message: '请输入会议发起人' },
          ],
          department: [
            { required: true, trigger: 'blur', message: '请选择组织部门' },
          ],
          start_time: [
            { required: true, trigger: 'blur', message: '请输入会议开始时间' },
          ],
          end_time: [
            { required: true, trigger: 'blur', message: '请输入会议结束时间' },
          ],
          number: [
            { required: true, trigger: 'blur', message: '请输入参会人数' },
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
      const showAdd = (treeData, pid) => {
        state.title = '添加'
        state.form.pid = pid
        state.dialogFormVisible = true
      }
      const showEdit = (treeData, row) => {
        state.title = '编辑'
        state.form = JSON.parse(JSON.stringify(row))
        state.dialogFormVisible = true
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
          let response
          if (valid) {
            if (state.form.id === undefined || state.form.id <= 0) {
              response = await doAdd(state.form)
            } else {
              response = await doEdit(state.form)
            }
            if (response.data === 200) {
              $baseMessage(response.msg, 'success', 'vab-hey-message-success')
              emit('edit-finish', state.form)
              close()
            } else {
              $baseMessage(response.msg, 'error', 'vab-hey-message-error')
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
