<template>
  <div class="Password">
    <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="旧密码" prop="oldpassword">
        <el-input
          v-model="formData.oldpassword"
          show-password
          style="width: 300px"
          type="password"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input
          v-model="formData.password"
          show-password
          style="width: 300px"
          type="password"
        />
      </el-form-item>
      <el-form-item label="重复新密码" prop="repeatPassword">
        <el-input
          v-model="formData.repeatPassword"
          show-password
          style="width: 300px"
          type="password"
        />
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="save">提交</el-button>
    </div>
  </div>
</template>

<script>
  import { setPassword } from '@/api/login'
  import { useUserStore } from '@/store/modules/user'

  const userStore = useUserStore()
  const { username } = storeToRefs(userStore)

  export default defineComponent({
    name: '',

    setup() {
      const $baseMessage = inject('$baseMessage')
      const validatePass = (rules, value, callback) => {
        if (value !== state.formData.password) {
          callback(new Error('未与新密码保持一致！'))
        } else {
          callback()
        }
      }
      const state = reactive({
        form: null,
        formData: {
          type: '2',
          username: '',
          oldpassword: '',
          password: '',
          repeatPassword: '',
        },
        rules: {
          oldpassword: [
            { required: true, trigger: 'blur', message: '请输入旧密码' },
          ],
          password: [
            { required: true, trigger: 'blur', message: '请输入新密码' },
            {
              min: 8,
              max: 32,
              message: '密码大小大于8位小于32位',
              trigger: ['blur', 'change'],
            },
            {
              validator: function (rule, value, callback) {
                if (/^[^\s]*$/.test(value) == false) {
                  callback(new Error('密码格式有误，密码中不允许出现空格'))
                } else {
                  callback()
                }
              },
              trigger: 'blur',
            },
          ],
          repeatPassword: [
            {
              required: true,
              trigger: 'blur',
              message: '请重复密码',
            },
            {
              validator: validatePass,
              trigger: ['blur', 'change'],
            },
          ],
        },
      })
      const save = async () => {
        state['form'].validate(async (valid) => {
          let response
          state.formData.username = username
          if (valid) {
            response = await setPassword(state.formData)
            console.log(response.msg)
            console.log(response)
            if (response.data === 'success') {
              // alert('提交成功')
              $baseMessage('提交成功', 'success', 'vab-hey-message-success')
              // 提交成功后，应返回正常登录的首页
              state.form.resetFields()
            } else {
              // alert(response.msg)
              $baseMessage(response.msg, 'error', 'vab-hey-message-error')
            }
          }
        })
      }
      return {
        ...toRefs(state),
        save,
      }
    },
  })
</script>
