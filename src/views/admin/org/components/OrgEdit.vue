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
      <el-form-item label="上级分组:">
        <el-tree-select
          v-model="form.pid"
          check-strictly
          :data="treeData"
          filterable
          placeholder="选择上级分组"
          :props="{ label: 'name', value: 'id' }"
          :render-after-expand="false"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="名称:" prop="name">
        <el-input v-model.trim="form.name" style="width: 240px" />
      </el-form-item>
      <el-form-item label="代码:" prop="code">
        <el-input v-model.trim="form.code" style="width: 240px" />
      </el-form-item>
      <el-form-item label="英文名称:" prop="e_name">
        <el-input v-model.trim="form.e_name" style="width: 240px" />
      </el-form-item>
      <el-form-item label="简称:" prop="shortname">
        <el-input v-model.trim="form.shortname" style="width: 240px" />
      </el-form-item>
      <el-form-item label="电话:">
        <el-input v-model.trim="form.phone_number" style="width: 240px" />
      </el-form-item>
      <el-form-item label="传真:">
        <el-input v-model="form.fax" style="width: 240px" />
      </el-form-item>
      <el-form-item label="排序:">
        <el-input v-model="form.sort" style="width: 240px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doAdd, doEdit } from '@/api/admin/org'

  export default defineComponent({
    name: 'OrgEdit',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        formRef: null,
        treeData: [],
        form: {
          id: 0,
          pid: 0,
          sort: 100,
          name: '',
          icon: '',
          code: '',
          e_name: '',
          phone_number: '',
          fax: '',
        },
        rules: {
          pid: [{ required: true, trigger: 'blur', message: '请选择上级分组' }],
          name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
          code: [{ required: true, trigger: 'blur', message: '请输入代码' }],
        },
        title: '',
        dialogFormVisible: false,
      })
      const addNoParentItem = (data) => {
        //查找pid=0的选项
        let result = false
        let i = 0

        for (; i < data.length; i++) {
          if (data[i].id === 0) {
            result = true
            break
          }
        }

        if (result === false) {
          data.unshift({ id: 0, pid: -1, name: '无上级分组' })
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

        //clone一份数据
        state.treeData = treeData.slice()

        //fetchTreeData()
        addNoParentItem(state.treeData)
      }
      const showEdit = (treeData, row) => {
        state.title = '编辑'
        state.form = JSON.parse(JSON.stringify(row))
        state.dialogFormVisible = true

        //clone一份数据
        state.treeData = treeData.slice()

        //fetchTreeData()
        addNoParentItem(state.treeData)
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
