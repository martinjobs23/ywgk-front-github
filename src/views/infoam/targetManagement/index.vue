<template>
  <div>
    <el-form ref="formRef" label-width="120px" :model="form" :rules="rules">
      <el-form-item ref="formRef" label="3级权限≥" prop="three">
        <el-input
          v-model.trim="form.three"
          autocomplete="off"
          placeholder="请输入3级权限值"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item ref="formRef" label="2级权限≥" prop="two">
        <el-input
          v-model.trim="form.two"
          autocomplete="off"
          placeholder="请输入2级权限值"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item ref="formRef" label="1级权限≥" prop="one">
        <el-input
          v-model.trim="form.one"
          autocomplete="off"
          placeholder="请输入1级权限值"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item ref="formRef" label="报告管理员<" prop="manager">
        <el-input
          v-model.trim="form.manager"
          autocomplete="off"
          placeholder="请输入相应权限值"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item ref="formRef" label="强制断网<" prop="network">
        <el-input
          v-model.trim="form.network"
          autocomplete="off"
          placeholder="请输入强制断网权限值"
          style="width: 240px"
        />
      </el-form-item>
    </el-form>
    <div>
      <el-button type="success" @click="save">策略下发</el-button>
    </div>
  </div>
</template>

<script>
  import { insertcredit } from '@/api/msg/Deliver'
  import { getcredit } from '@/api/securitycomponent/securitycomponent'
  export default defineComponent({
    name: 'LaunchBlack',
    components: {},
    setup() {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        formRef: null,
        total: 0,
        editRef: null,
        tableRef: null,
        currentRow: null,
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true,
        selectRows: '',
        list: [],
        form: {
          three: '',
          two: '',
          one: '',
          manager: '',
          network: '',
        },
        rules: {
          three: [
            { required: true, trigger: 'blur', message: '请输入3级权限值' },
            {
              pattern: /^[0-9]+$/,
              message: '请输入正确的信任值',
              trigger: 'blur',
            },
          ],
          two: [
            { required: true, trigger: 'blur', message: '请输入2级权限值' },
            {
              pattern: /^[0-9]+$/,
              message: '请输入正确的信任值',
              trigger: 'blur',
            },
          ],
          one: [
            { required: true, trigger: 'blur', message: '请输入1级权限值' },
            {
              pattern: /^[0-9]+$/,
              message: '请输入正确的信任值',
              trigger: 'blur',
            },
          ],
          manager: [
            { required: true, trigger: 'blur', message: '请输入相应权限值' },
            {
              pattern: /^[0-9]+$/,
              message: '请输入正确的信任值',
              trigger: 'blur',
            },
          ],
          network: [
            {
              required: true,
              trigger: 'blur',
              message: '请输入强制断网权限值',
            },
            {
              pattern: /^[0-9]+$/,
              message: '请输入正确的信任值',
              trigger: 'blur',
            },
          ],
        },
        listLoading: true,
        elementLoadingText: '正在加载...',
      })

      const save = () => {
        state['formRef'].validate(async (valid) => {
          let response
          if (valid) {
            response = await insertcredit(state.form)
            if (response.data === 0) {
              $baseMessage('保存策略失败', 'error', 'vab-hey-message-error')
            } else {
              $baseMessage('保存策略成功', 'success', 'vab-hey-message-success')
            }
          }
        })
      }

      const fetchData = async () => {
        const { data } = await getcredit()
        state.form.three = data[0].three
        state.form.two = data[0].two
        state.form.one = data[0].one
        state.form.manager = data[0].manager
        state.form.network = data[0].network
      }

      onMounted(() => {
        fetchData()
      })
      return {
        ...toRefs(state),
        save,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $base: '.info-management';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
</style>
