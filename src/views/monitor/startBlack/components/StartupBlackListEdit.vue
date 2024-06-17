<template>
  <el-dialog
    v-model="dialogFormVisible"
    :close-on-click-modal="false"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-tabs active-name="first">
      <el-tab-pane label="基本信息" name="first">
        <el-form ref="formRef" label-width="120px" :model="form" :rules="rules">
          <el-form-item label="启动项黑名单:" prop="title">
            <el-input v-model.trim="form.startupBlack" style="width: 240px" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { insertStartupBlack } from '@/api/monitor/startItem'
  export default defineComponent({
    name: 'StartupBlackListEdit',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        formRef: null,
        deviceList: [],
        form: {
          startupBlack: [],
        },
        title: '',
        dialogFormVisible: false,
        // rules: {},
      })
      const showAdd = () => {
        state.title = '添加黑名单'
        state.dialogFormVisible = true
        fetchData()
      }
      const fetchData = async () => {
        const res = await getDevice()
        state.deviceList = res.data
      }
      const close = () => {
        state['formRef'].resetFields()
        state.form = {
          startup_name: [],
        }
        state.dialogFormVisible = false
      }
      const save = () => {
        state['formRef'].validate(async (valid) => {
          let response
          if (valid) {
            response = await insertStartupBlack(state.form)
            if (response.code === 0)
              $baseMessage('添加数据失败', 'error', 'vab-hey-message-error')
            else {
              $baseMessage('添加数据成功', 'success', 'vab-hey-message-success')
              emit('edit-finish')
              close()
            }
          }
        })
      }
      return {
        ...toRefs(state),
        showAdd,
        fetchData,
        close,
        save,
      }
    },
  })
</script>
