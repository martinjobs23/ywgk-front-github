<template>
  <div class="no-layout-container">
    <div>
      <el-alert
        :closable="false"
        title="修改密码：初次登录或满三个月未修改密码的，皆需强制修改！！！"
        type="error"
      />
    </div>
    <div class="Password">
      <el-form ref="form" :model="formData" :rules="rules">
        <el-form-item label="设置密码" prop="password">
          <el-input
            v-model="formData.password"
            style="width: 300px"
            type="password"
          />
        </el-form-item>
        <el-form-item label="重复密码" prop="repeatPassword">
          <el-input
            v-model="formData.repeatPassword"
            style="width: 300px"
            type="password"
          />
        </el-form-item>
        <el-button type="primary" @click="save">提交并返回</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { setPassword } from '@/api/login'
  import { useUserStore } from '@/store/modules/user'
  import { handleActivePath } from '@/utils/routes'
  import { useTabsStore } from '@/store/modules/tabs'

  export default {
    name: 'Changepassword',
    setup() {
      const tabsStore = useTabsStore()
      const route = useRoute()
      const { delVisitedRoute } = tabsStore
      const router = useRouter()
      const userStore = useUserStore()
      const { username } = storeToRefs(userStore)
      // const $baseMessage = inject('$baseMessage')
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
          type: '1',
          username: '',
          password: '',
          repeatPassword: '',
        },

        rules: {
          password: [
            { required: true, trigger: 'blur', message: '请输入新密码' },
            {
              min: 8,
              max: 127,
              message: '密码大小大于8位小于127位',
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
              //$baseMessage('提交成功', 'success', 'vab-hey-message-success')
              // 提交成功后，应返回正常登录的首页
              goBack()
            } else {
              alert(response.msg)
              //$baseMessage(response.msg, 'error', 'vab-hey-message-error')
            }
          }
        })
      }
      const goBack = async () => {
        await router.push({ path: '/index' })
        const detailPath = await handleActivePath(route, true)
        await delVisitedRoute(detailPath)
      }
      return {
        ...toRefs(state),
        save,
        goBack,
      }
    },
  }
</script>

<style lang="scss" scoped>
  .no-layout-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999;
  }

  .Password {
    display: flex;
    justify-content: center; /* Center horizontally */
    align-items: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
  }
</style>
