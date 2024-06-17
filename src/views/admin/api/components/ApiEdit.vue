<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="400px"
    @close="close"
  >
    <el-form
      ref="formRef"
      inline
      label-width="100px"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="上级接口:">
        <el-tree-select
          v-model="form.pid"
          check-strictly
          :data="treeData"
          filterable
          placeholder="选择上级接口"
          :props="{ label: 'name', value: 'id' }"
          :render-after-expand="false"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="名称:" prop="name">
        <el-input v-model.trim="form.name" style="width: 240px" />
      </el-form-item>
      <el-form-item label="后台URL:" prop="path">
        <el-input v-model.trim="form.path" style="width: 240px" />
      </el-form-item>

      <el-form-item label="排序:">
        <el-input v-model="form.sort" style="width: 240px" />
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model.trim="form.description" style="width: 240px" />
      </el-form-item>

      <el-form-item label="隐藏">
        <el-switch v-model="form.hidden" style="width: 240px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doAdd, doEdit } from '@/api/admin/api'

  import { useUserStore } from '@/store/modules/user'

  const userStore = useUserStore()
  const { username } = storeToRefs(userStore)

  export default defineComponent({
    name: 'ApiEdit',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        formRef: null,
        treeData: [],
        username: '',
        form: {
          id: 0,
          pid: 0,
          sort: 100,
          name: '',
          username: '',
          title: '',
          icon: '',
          path: '',
          redirect: '',
          component: '',
          badge: '',
          dot: false,
          hidden: false,
          disabled: false,
          levelHidden: false,
          isCustomSvg: false,
          noClosable: false,
          noKeepAlive: false,
          tabHidden: false,
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
          data.unshift({ id: 0, pid: -1, name: '无上级接口' })
        }
      }
      const handleIcon = (item) => {
        state.form.icon = item
      }
      const showAdd = (treeData, pid) => {
        state.title = '添加'
        state.form.pid = pid
        state.dialogFormVisible = true
        //clone一份数据
        state.treeData = treeData.slice()
        addNoParentItem(state.treeData)
      }
      const showEdit = (treeData, row) => {
        state.title = '编辑'
        state.form = JSON.parse(JSON.stringify(row))
        state.dialogFormVisible = true
        //clone一份数据
        state.treeData = treeData.slice()
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
        state.form.username = username
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
