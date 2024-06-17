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
      <el-form-item label="策略名称:" prop="inspection_ticket">
        <el-input v-model.trim="form.inspection_ticket" style="width: 240px" />
      </el-form-item>

      <el-form-item label="禁止运维命令:" prop="ban_order">
        <el-input v-model.trim="form.ban_order" style="width: 240px" />
      </el-form-item>

      <el-form-item label="时间策略:" prop="time_strategy">
        <el-input v-model.trim="form.time_strategy" style="width: 240px" />
      </el-form-item>

      <el-form-item
        label="运维终端区域123，0为不指定区域:"
        prop="operate_location"
      >
        <el-input v-model.trim="form.operate_location" style="width: 240px" />
      </el-form-item>

      <el-form-item label="1-任意审核通过，2-多人审核:" prop="audit_pattern">
        <el-input v-model.trim="form.audit_pattern" style="width: 240px" />
      </el-form-item>

      <el-form-item label="通知方式（0不通知，1短信）:" prop="inform_path">
        <el-input v-model.trim="form.inform_path" style="width: 240px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doAdd, doEdit } from '@/api/dev/group'

  export default defineComponent({
    name: 'GroupEdit',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        formRef: null,
        treeData: [],
        userData: [],
        list: [],
        form: {
          id: 0,
          inspection_ticket: '',
          ban_order: '',
          time_strategy: '',
          operate_location: '',
          audit_pattern: '',
          inform_path: '',
        },
        rules: {
          inspection_ticket: [
            { required: true, trigger: 'blur', message: '策略名称' },
          ],
          ban_order: [
            { required: true, trigger: 'blur', message: '禁止运维命令' },
          ],
          time_strategy: [
            { required: true, trigger: 'blur', message: '时间策略' },
          ],
          operate_location: [
            {
              required: true,
              trigger: 'blur',
              message: '运维终端区域123，0为不指定区域',
            },
          ],
          audit_pattern: [
            {
              required: true,
              trigger: 'blur',
              message: '1-任意审核通过，2-多人审核',
            },
          ],
          inform_path: [
            {
              required: true,
              trigger: 'blur',
              message: '通知方式（0不通知，1短信）',
            },
          ],
        },
        title: '',
        dialogFormVisible: false,
      })
      const handleIcon = (item) => {
        state.form.icon = item
      }
      const updateUserName = () => {
        state.form.user_name = state.userData.find(
          (item) => item.id === state.form.user_id
        ).name
      }
      const showAdd = (treeData, pid) => {
        state.title = '添加'
        state.form.pid = pid
        state.dialogFormVisible = true
      }
      const showEdit = (treeData, row) => {
        state.title = '编辑'
        // state.userData = userData
        state.form = JSON.parse(JSON.stringify(row))
        // fetchData()
        state.dialogFormVisible = true
        //clone一份数据
        // state.treeData = treeData.slice()
        //fetchTreeData()
        // addNoParentItem(state.treeData)
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
        updateUserName,
        showAdd,
        showEdit,
        // fetchData,
        close,
        save,
      }
    },
  })
</script>
