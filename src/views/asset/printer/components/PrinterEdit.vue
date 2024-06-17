<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="450px"
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
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="型号" prop="model">
        <el-input v-model="form.model" autocomplete="off" />
      </el-form-item>
      <el-form-item label="IP地址" prop="ip">
        <el-input v-model="form.ip" autocomplete="off" />
      </el-form-item>
      <el-form-item label="责任人" prop="user_name">
        <el-input v-model="form.user_name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doAdd, doEdit } from '@/api/asset/printer'

  export default defineComponent({
    name: 'PrinterEdit',
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
            { required: true, trigger: 'blur', message: '请输入打印机名称' },
          ],
          model: [
            { required: true, trigger: 'blur', message: '请输入打印机型号' },
          ],
          ip: [{ required: true, trigger: 'blur', message: '打印机IP地址' }],
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
        close,
        save,
      }
    },
  })
</script>
