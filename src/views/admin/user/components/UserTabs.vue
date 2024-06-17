<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="60%"
    @close="close"
  >
    <el-tabs v-model="tabsList" @tab-click="handleClick">
      <el-tab-pane label="Edit" name="first">
        <Edit />
      </el-tab-pane>
      <el-tab-pane label="Password" name="second">
        <component :is="Password" />
      </el-tab-pane>
      <el-tab-pane label="Role" name="third">Role</el-tab-pane>
      <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
      <el-tab-pane
        v-for="item in tabsList"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <tab-component :is="item.content" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
  export default defineComponent({
    name: 'UserTabs',
    components: {
      Edit: defineAsyncComponent(() => import('./UserEdit')),
      Password: defineAsyncComponent(() => import('./UserPassword')),
    },
    emits: ['edit-finish'],
    setup() {
      const state = reactive({
        title: '',
        tabsList: [
          {
            title: '基本信息',
            name: '1',
            content: 'Edit',
          },
          {
            title: '修改密码',
            name: '2',
            content: 'Password',
          },
        ],
        dialogFormVisible: false,
      })
      const close = () => {
        //state['formRef'].resetFields()
        state.dialogFormVisible = false
      }
      const showEdit = () => {
        state.title = '编辑'
        //state.form = JSON.parse(JSON.stringify(row))
        state.dialogFormVisible = true
        //state.treeData = treeData
      }
      const handleClick = (tab, event) => {
        console.log(tab, event)
      }
      return {
        ...toRefs(state),
        close,
        showEdit,
        handleClick,
      }
    },
  })
</script>
