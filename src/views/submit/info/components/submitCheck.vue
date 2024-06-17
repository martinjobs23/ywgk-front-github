<template>
  <el-dialog
    v-model="dialogFormVisible"
    :close-on-click-modal="false"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" inline label-width="140px" :model="form">
      <el-form-item label="用户">
        <el-input v-model="form.username" autocomplete="off" :disabled="true" />
      </el-form-item>
      <el-form-item label="序列号">
        <el-input v-model="form.serial" autocomplete="off" :disabled="true" />
      </el-form-item>
      <el-form-item label="提交时间">
        <el-input
          v-model="form.submit_time"
          autocomplete="off"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="内容">
        <el-input
          v-model="form.content"
          autocomplete="off"
          :disabled="true"
          :rows="5"
          type="textarea"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="close">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  export default defineComponent({
    name: '',
    emits: ['check-finish'],
    setup() {
      const state = reactive({
        title: '',
        dialogFormVisible: false,
        form: {
          content: '',
        },
        formRef: null,
        treeData: [],
      })
      const showworkorder = (row) => {
        state.title = '详情'
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
      return {
        ...toRefs(state),
        showworkorder,
        close,
      }
    },
  })
</script>
