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
      <el-form-item label="组织机构:">
        <el-tree-select
          v-model="form.org_id"
          check-strictly
          :data="treeData"
          filterable
          placeholder="选择组织机构"
          :props="{ label: 'name', value: 'id' }"
          :render-after-expand="false"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item v-if="title === '添加'" label="账号:" prop="account">
        <el-input v-model.trim="form.account" style="width: 240px" />
      </el-form-item>
      <el-form-item label="姓名:" prop="name">
        <el-input v-model.trim="form.name" style="width: 240px" />
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input
          v-model.trim="form.password"
          placeholder="不设置密码请留空"
          show-password
          style="width: 240px"
          type="password"
        />
      </el-form-item>
      <el-form-item label="证件号码:" prop="id_number">
        <el-input v-model.trim="form.id_number" style="width: 240px" />
      </el-form-item>
      <!-- <el-form-item label="电话:">
        <el-input v-model.trim="form.phone_number" style="width: 240px" />
      </el-form-item> -->
      <el-form-item label="手机:">
        <el-input v-model="form.mobile" style="width: 240px" />
      </el-form-item>
      <el-form-item label="邮件:">
        <el-input v-model="form.email" style="width: 240px" />
      </el-form-item>
      <el-form-item label="描述:" prop="description">
        <el-input v-model.trim="form.description" style="width: 240px" />
      </el-form-item>
      <el-form-item label="允许的ip范围:" prop="description">
        <el-input v-model.trim="form.ip" style="width: 240px" />
      </el-form-item>
      <el-form-item v-if="title === '编辑'" label="用户状态:">
        <el-radio-group v-model="form.locked">
          <el-radio-button label="0">正常</el-radio-button>
          <el-radio-button label="1">锁定</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="title === '编辑'" label="休眠状态:">
        <el-radio-group v-model="form.sleep">
          <el-radio-button label="0">正常</el-radio-button>
          <el-radio-button label="1">休眠</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户周期：">
        <el-radio-group v-model="form.period">
          <el-radio-button label="长期" />
          <el-radio-button label="临时" />
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="form.period == '临时'"
        label="开始时间:"
        prop="start_time"
      >
        <el-date-picker
          v-model="form.start_time"
          placeholder="选择开始时间"
          :shortcuts="shortcuts"
          style="width: 240px"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item
        v-if="form.period == '临时'"
        label="结束时间:"
        prop="end_time"
      >
        <el-date-picker
          v-model="form.end_time"
          placeholder="选择结束时间"
          :shortcuts="shortcuts"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
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
    name: 'UserEdit',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        formRef: null,
        treeData: [],
        form: {
          id: 0,
          org_id: 0,
          account: '',
          name: '',
          id_number: '',
          tel: '',
          mobile: '',
          email: '',
          description: '',
          disabled: 0,
          password: '',
          locked: '',
          period: '长期',
          ip: '',
        },
        rules: {
          org_id: [
            { required: true, trigger: 'blur', message: '请选择上级组织机构' },
          ],
          account: [{ required: true, trigger: 'blur', message: '请输入账号' }],
          name: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
          start_time: [
            { required: true, trigger: 'blur', message: '请输入开始时间' },
          ],
          end_time: [
            { required: true, trigger: 'blur', message: '请输入结束时间' },
          ],
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
        state.form.period = '长期'
        state.dialogFormVisible = true
        state.treeData = treeData
      }
      const showEdit = (treeData, row) => {
        state.title = '编辑'
        state.form = JSON.parse(JSON.stringify(row))
        //不允许修改account
        delete state.form.account
        //给state.form.period设置一个初始值
        if ('start_time' in row) {
          state.form.period = '临时'
        } else {
          state.form.period = '长期'
        }
        state.dialogFormVisible = true
        state.treeData = treeData
      }
      const close = () => {
        // console.log(state.form.period)
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

            state.form.password = ''

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
