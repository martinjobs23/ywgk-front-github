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
      <el-form-item label="上级分组:" prop="pid">
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
      <el-form-item label="排序:">
        <el-input v-model="form.sort" style="width: 240px" />
      </el-form-item>
      <el-form-item label="责任人" prop="user_id">
        <el-tree-select
          v-model="form.user_id"
          check-strictly
          :data="userData"
          filterable
          placeholder="选择责任人"
          :props="{ label: 'name', value: 'id' }"
          :render-after-expand="false"
          style="width: 240px"
          @change="updateUserName"
        />
      </el-form-item>
      <el-form-item label="电话:">
        <el-input v-model="form.phone_number" style="width: 240px" />
      </el-form-item>
      <el-form-item label="描述:" prop="description">
        <el-input
          v-model.trim="form.description"
          :autosize="{ minRows: 2, maxRows: 4 }"
          maxlength="60"
          placeholder="请输入内容"
          show-word-limit
          style="width: 240px"
          type="textarea"
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
  import { doAdd, doEdit } from '@/api/dev/group'

  export default defineComponent({
    name: 'GroupEdit',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        formRef: null,
        treeData: [],
        userData: [],
        form: {
          id: null,
          pid: 0,
          sort: 100,
          name: '',
          user_id: null,
          user_name: '',
          phone_number: '',
          description: '',
        },
        rules: {
          pid: [
            { required: true, trigger: 'blur', message: '请选择上级分组' },
            { validator: checkPidNotEqualToId, trigger: ['blur', 'change'] },
          ],
          name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
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
      const updateUserName = () => {
        state.form.user_name = state.userData.find(
          (item) => item.id === state.form.user_id
        ).name
      }
      /*
      const fetchTreeData = async () => {
        const { data } = await getTree()
        state.treeData = data.list
      }*/
      const showAdd = (userData, treeData, pid) => {
        state.title = '添加'
        state.userData = userData
        state.form.pid = pid
        state.dialogFormVisible = true

        //clone一份数据
        state.treeData = treeData.slice()

        //fetchTreeData()
        addNoParentItem(state.treeData)
      }
      const showEdit = (userData, treeData, row) => {
        state.title = '编辑'
        state.userData = userData
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
      function checkPidNotEqualToId(rule, value, callback) {
        if (value === state.form.id) {
          callback(new Error('上级分组不能选择自己'))
        } else {
          callback()
        }
      }
      return {
        ...toRefs(state),
        handleIcon,
        updateUserName,
        showAdd,
        showEdit,
        close,
        save,
      }
    },
  })
</script>
