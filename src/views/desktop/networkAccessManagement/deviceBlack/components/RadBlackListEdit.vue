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
          <el-form-item label="终端IP" prop="device_usernames">
            <el-select
              v-model="form.device_usernames"
              filterable
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in deviceList"
                :key="item.dev_ip"
                :label="item.dev_ip"
                :value="item.dev_hash"
              />
            </el-select>
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
  import {
    getDevice,
    insertDevice,
  } from '@/api/desktop/networkAccessManagement'
  export default defineComponent({
    name: 'RadBlackListEdit',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        formRef: null,
        deviceList: [],
        form: {
          device_usernames: [],
        },
        title: '',
        dialogFormVisible: false,
        rules: {
          device_usernames: [
            { required: true, trigger: 'blur', message: '请选择终端IP' },
          ],
        },
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
          device_usernames: [],
        }
        state.dialogFormVisible = false
      }
      const save = () => {
        state['formRef'].validate(async (valid) => {
          let response
          if (valid) {
            response = await insertDevice(state.form)
            if (response.data === 0)
              $baseMessage('保存数据失败', 'error', 'vab-hey-message-error')
            else {
              $baseMessage('保存数据成功', 'success', 'vab-hey-message-success')
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
