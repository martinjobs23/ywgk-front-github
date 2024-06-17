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
      <el-form-item label="上级菜单:">
        <el-tree-select
          v-model="form.pid"
          check-strictly
          :data="treeData"
          filterable
          placeholder="选择上级菜单"
          :props="{ label: 'title', value: 'id' }"
          :render-after-expand="false"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="显示标题:" prop="title">
        <el-input v-model.trim="form.title" style="width: 240px" />
      </el-form-item>
      <el-form-item label="内部名称:" prop="name">
        <el-input v-model.trim="form.name" style="width: 240px" />
      </el-form-item>
      <el-form-item label="前端路由:" prop="path">
        <el-input v-model.trim="form.path" style="width: 240px" />
      </el-form-item>
      <el-form-item label="Vue组件:" prop="component">
        <el-input
          v-model.trim="form.component"
          placeholder="@views/"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="重定向:">
        <el-input v-model.trim="form.redirect" style="width: 240px" />
      </el-form-item>
      <el-form-item label="排序:">
        <el-input v-model="form.sort" style="width: 240px" />
      </el-form-item>
      <el-form-item label="图标:">
        <el-space>
          <vab-icon :icon="form.icon" style="width: 30px" />
          <el-popover
            popper-class="icon-selector-popper"
            trigger="click"
            :width="292"
          >
            <template #reference>
              <el-input v-model.trim="form.icon" style="width: 200px" />
            </template>
            <vab-icon-selector @handle-icon="handleIcon" />
          </el-popover>
        </el-space>
      </el-form-item>
      <el-form-item label="badge">
        <el-input v-model.trim="form.badge" />
      </el-form-item>
      <el-form-item label="dot">
        <el-switch v-model="form.dot" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="隐藏">
        <el-switch
          v-model="form.hidden"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="始终显示当前节点">
        <el-switch
          v-model="form.levelHidden"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="自定义svg图标">
        <el-switch
          v-model="form.isCustomSvg"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="固定">
        <el-switch
          v-model="form.noClosable"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="无缓存">
        <el-switch
          v-model="form.noKeepAlive"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="不显示当前标签页">
        <el-switch
          v-model="form.tabHidden"
          :active-value="1"
          :inactive-value="0"
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
  import VabIconSelector from '@/plugins/VabIconSelector'
  import { doAdd, doEdit } from '@/api/admin/menu'

  export default defineComponent({
    name: 'MenuEdit',
    components: { VabIconSelector },
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
          title: '',
          icon: '',
          path: '',
          redirect: '',
          component: '',
          badge: '',
          dot: 0,
          hidden: 0,
          disabled: 0,
          levelHidden: 0,
          isCustomSvg: 0,
          noClosable: 0,
          noKeepAlive: 0,
          tabHidden: 0,
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
          data.unshift({ id: 0, pid: -1, title: '无上级菜单' })
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
