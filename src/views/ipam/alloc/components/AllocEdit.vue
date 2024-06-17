<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="430px"
    @close="close"
  >
    <el-form
      ref="formRef"
      inline
      label-width="100px"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="网段:">
        <el-tree-select
          v-model="form.subnet_id"
          check-strictly
          :data="treeData"
          filterable
          placeholder="选择网段"
          :props="{ label: 'name', value: 'id' }"
          :render-after-expand="false"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="IP地址:" prop="ip">
        <el-input v-model.trim="form.ip" style="width: 240px" />
      </el-form-item>
      <el-form-item label="MAC地址:" prop="mac">
        <el-input v-model.trim="form.mac" style="width: 240px" />
      </el-form-item>
      <el-form-item label="部门:" prop="org_name">
        <el-input v-model.trim="form.org_name" style="width: 240px" />
      </el-form-item>
      <el-form-item label="责任人:" prop="user_name">
        <el-input v-model.trim="form.user_name" style="width: 240px" />
      </el-form-item>
      <el-form-item label="备注:" prop="description">
        <el-input v-model.trim="form.description" style="width: 240px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doAdd, doEdit } from '@/api/ipam/alloc'

  export default defineComponent({
    name: 'AllocEdit',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        formRef: null,
        treeData: [],
        form: {
          id: 0,
          subnet_id: 0,
          ip: '',
          mac: '',
          org_id: 0,
          org_name: '',
          user_id: 0,
          user_name: '',
          description: '',
        },
        rules: {
          subnet_id: [
            { required: true, trigger: 'blur', message: '请选择上级网段' },
          ],
          ip: [{ required: true, trigger: 'blur', message: '请输入IP地址' }],
          org_name: [
            { required: true, trigger: 'blur', message: '请输入部门' },
          ],
          user_name: [
            { required: true, trigger: 'blur', message: '请输入责任人' },
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
      const showAdd = (treeData, subnet_id) => {
        state.title = '添加'
        if (subnet_id <= 0) state.form.subnet_id = treeData[0].id
        else state.form.subnet_id = subnet_id
        state.dialogFormVisible = true
        state.treeData = treeData
      }
      const showEdit = (treeData, row) => {
        state.title = '编辑'
        state.form = JSON.parse(JSON.stringify(row))
        state.dialogFormVisible = true
        state.treeData = treeData
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
        showAdd,
        showEdit,
        close,
        save,
      }
    },
  })
</script>
