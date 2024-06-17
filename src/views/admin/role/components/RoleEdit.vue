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
      <el-form-item label="上级角色:">
        <el-tree-select
          v-model="form.pid"
          check-strictly
          :data="roleTreeData"
          filterable
          placeholder="选择上级角色"
          :props="{ label: 'name', value: 'id' }"
          :render-after-expand="false"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="角色名称:" prop="name">
        <el-input v-model.trim="form.name" style="width: 240px" />
      </el-form-item>

      <el-form-item label="认证策略:">
        <el-select
          v-model="form.auth_policy_id"
          placeholder="选择认证策略"
          style="width: 240px"
          @change="handleSelectChange"
        >
          <el-option
            v-for="item in policyData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doAdd, doEdit } from '@/api/admin/role'

  export default defineComponent({
    name: 'RoleEdit',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        formRef: null,
        roleTreeData: [],
        policyData: [],
        form: {
          id: 0,
          pid: 0,
          name: '',
          auth_policy_id: 0,
          auth_policy_name: '',
        },
        rules: {
          name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
          path: [
            { required: true, trigger: 'blur', message: '请输入前端路由' },
          ],
          component: [
            { required: true, trigger: 'blur', message: '请输入Vue组件' },
          ],
          title: [{ required: true, trigger: 'blur', message: '请输入标题' }],
        },
        title: '',
        dialogFormVisible: false,
      })
      const handleSelectChange = (val) => {
        state.form.auth_policy_name = val.name
      }
      const addNoParentItem = (data) => {
        //查找pid=0的选项
        let result = false
        let i = 0
        if (data)
          for (; i < data.length; i++) {
            if (data[i].id === 0) {
              result = true
              break
            }
          }
        if (result === false) {
          data.unshift({ id: 0, pid: -1, name: '无上级角色' })
        }
      }
      const handleIcon = (item) => {
        state.form.icon = item
      }
      const setDefaultPolicyId = () => {
        //查找默认策略
        let defaultId = 0
        let i = 0
        for (i; i < state.policyData.length; i++) {
          if (state.policyData[i].is_default == 1) {
            defaultId = state.policyData[i].id
            break
          } else if (defaultId == 0) defaultId = state.policyData[i].id
        }
        console.log('policyData defaultId=' + defaultId)
        //使用默认策略
        if (state.form.auth_policy_id && state.form.auth_policy_id != 0) {
          //console.log('setDefaultPolicyId already ' + state.form.auth_policy_id)
        } else {
          //console.log('setDefaultPolicyId ')
          state.form.auth_policy_id = defaultId
        }
      }
      const showAdd = (policyData, roleData, pid) => {
        state.title = '添加'
        state.form.pid = pid
        state.dialogFormVisible = true
        //clone一份数据
        state.roleTreeData = roleData.slice()
        state.policyData = policyData
        //console.log(policyData)
        addNoParentItem(state.roleTreeData)

        setDefaultPolicyId()
      }
      const showEdit = (policyData, roleData, row) => {
        state.title = '编辑'
        state.form = JSON.parse(JSON.stringify(row))
        state.dialogFormVisible = true
        //clone一份数据
        state.roleTreeData = roleData.slice()
        state.policyData = policyData
        addNoParentItem(state.roleTreeData)
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
        handleSelectChange,
        showAdd,
        showEdit,
        close,
        save,
      }
    },
  })
</script>
