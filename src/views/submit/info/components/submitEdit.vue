<template>
  <el-dialog
    v-model="dialogFormVisible"
    :close-on-click-modal="false"
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
      <el-form-item label="管理员" prop="username">
        <el-input v-model="form.admin" autocomplete="off" :disabled="true" />
      </el-form-item>
      <el-form-item label="结果" prop="result">
        <el-input
          v-model.trim="form.result"
          autocomplete="off"
          :rows="3"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button icon="Upload" type="success" @click="save">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { WorkorderSubmit } from '@/api/submit/WorkorderSubmit'
  import { useUserStore } from '@/store/modules/user'

  const userStore = useUserStore()
  const { username } = storeToRefs(userStore)

  export default defineComponent({
    name: '',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        title: '',
        dialogFormVisible: false,
        form: {
          admin: '',
          process_time: '',
          result: '',
          ishandle: '',
        },
        formRef: null,
        rules: {
          result: [
            { required: true, trigger: 'blur', message: '请输入反馈结果' },
          ],
        },
        treeData: [],
      })
      const showEdit = (row) => {
        state.title = '编辑'
        state.form = JSON.parse(JSON.stringify(row))
        state.form.admin = username
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
            response = await WorkorderSubmit(state.form)
            if (response.code === 200) {
              $baseMessage('提交成功', 'success', 'vab-hey-message-success')
              emit('edit-finish')
              close()
            } else {
              $baseMessage('提交失败', 'error', 'vab-hey-message-error')
            }
          }
        })
      }
      return {
        ...toRefs(state),
        showEdit,
        close,
        save,
      }
    },
  })
</script>
