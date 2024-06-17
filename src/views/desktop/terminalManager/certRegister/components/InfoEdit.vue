<template>
  <el-dialog
    v-model="dialogFormVisible"
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
      <el-form-item label="设备名称" prop="dev_name">
        <el-input
          v-model="form.dev_name"
          autocomplete="off"
          style="width: 240px"
        />
      </el-form-item>
      <!-- <el-form-item label="使用人" prop="user_id">
        <el-tree-select
          v-model="form.user_id"
          check-strictly
          :data="usersOptions"
          filterable
          :props="{ label: 'name', value: 'id' }"
          :render-after-expand="false"
          style="width: 240px"
        />
      </el-form-item> -->
      <el-form-item label="使用人" prop="user_name">
        <el-input
          v-model="form.user_name"
          autocomplete="off"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="位置" prop="loaction">
        <el-input
          v-model="form.location"
          autocomplete="off"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="终端分组" prop="org_id">
        <el-tree-select
          v-model="form.org_id"
          check-strictly
          :data="placeOptions"
          filterable
          :props="{ label: 'name', value: 'id' }"
          :render-after-expand="false"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="设备IP" prop="dev_ip">
        <el-input
          v-model="form.dev_ip"
          autocomplete="off"
          style="width: 240px"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="save">证书申请</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { radCheck } from '@/api/desktop/terminalManager'
  import { getTree } from '@/api/admin/org'
  import { getPage } from '@/api/admin/user'

  export default defineComponent({
    name: 'InfoEdit',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        formRef: null,
        treeData: [],
        placeOptions: [],
        usersOptions: [],
        shortcuts: [
          {
            text: '今天',
            value: new Date(),
          },
          {
            text: '明天',
            value: () => {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24)
              return date
            },
          },
          {
            text: '后天',
            value: () => {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 48)
              return date
            },
          },
        ],
        form: {
          dev_name: '',
          user_id: '',
          dev_ip: '',
          id: 0,
          name: '',
        },
        rules: {
          user_id: [
            { required: true, trigger: 'blur', message: '请选择使用人' },
          ],
          org_id: [
            { required: true, trigger: 'blur', message: '请选择设备分组' },
          ],
          dev_ip: [
            { required: true, trigger: 'blur', message: '请输入设备IP' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      })
      const handleCheckBoxChange = (value) => {
        if (value.length == 0) state.form.methods = ''
        else {
          state.form.methods = value.join(' & ')
        }
      }

      const handleIcon = (item) => {
        state.form.icon = item
      }
      /*
      const fetchTreeData = async () => {
        const { data } = await getTree()
        state.treeData = data.list
      }*/
      const showAdd = (treeData, pid) => {
        state.title = '添加'
        state.form.pid = pid
        state.dialogFormVisible = true
        fetchData()
      }
      const showEdit = (treeData, row) => {
        state.title = '终端认证审核'
        state.form = JSON.parse(JSON.stringify(row))
        state.dialogFormVisible = true
        fetchData()
      }
      const fetchData = async () => {
        const orgdata = await getTree(state.queryForm)
        state.placeOptions = orgdata.data
        const usersdata = await getPage(state.queryForm)
        state.usersOptions = usersdata.data.pageData
      }
      const onSelectChange = (value) => {
        let obj = {}
        obj = state.placeOptions.find((item) => {
          return item.id === value
        })
        //console.log(value + ' ' + obj.location)
        state.form.place = obj.location
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
            //同意注册
            state.form.is_handle = 1
            response = await radCheck(state.form)
            if (response.code === 200) {
              $baseMessage(response.msg, 'success', 'vab-hey-message-success')
              emit('edit-finish', state.form)
              close()
            } else if (response.code === 100) {
              $baseMessage(response.msg, 'warning', 'vab-hey-message-warning')
            } else {
              $baseMessage(response.msg, 'error', 'vab-hey-message-error')
            }
          }
        })
      }
      return {
        ...toRefs(state),
        handleCheckBoxChange,
        handleIcon,
        showAdd,
        showEdit,
        onSelectChange,
        close,
        save,
      }
    },
  })
</script>
