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
      <el-form-item label="账号:" prop="account">
        <el-input v-model.trim="form.account" style="width: 240px" />
      </el-form-item>
      <el-form-item label="姓名:" prop="name">
        <el-input v-model.trim="form.name" style="width: 240px" />
      </el-form-item>
      <el-form-item label="新密码:">
        <el-input v-model.trim="form.password" style="width: 240px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doAdd, doEdit } from '@/api/admin/user'

  export default defineComponent({
    name: 'UserPassword',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        formRef: null,
        treeData: [],
        form: {
          id: 0,
          account: '',
          name: '',
          password: '',
        },
        rules: {
          org_id: [
            { required: true, trigger: 'blur', message: '请选择上级组织机构' },
          ],
          account: [{ required: true, trigger: 'blur', message: '请输入账号' }],
          name: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
        },
        title: '',
        dialogFormVisible: false,
      })

      const handleIcon = (item) => {
        state.form.icon = item
      }
      /*
      const fetchTreeData = async () => {
        const { data } = await getTree()
        state.treeData = data.list
      }*/
      const showAdd = (treeData, org_id) => {
        state.title = '添加'
        if (org_id <= 0) state.form.org_id = treeData[0].id
        else state.form.org_id = org_id
        state.dialogFormVisible = true
        state.treeData = treeData
      }
      const showEdit = (treeData, row) => {
        state.title = '编辑'
        state.form = JSON.parse(JSON.stringify(row))
        state.dialogFormVisible = true
        state.treeData = treeData
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
        handleIcon,
        showAdd,
        showEdit,
        close,
        save,
      }
    },
  })
</script>
