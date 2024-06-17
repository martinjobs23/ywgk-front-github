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
      <el-form-item label="名称:" prop="name">
        <el-input v-model.trim="form.name" style="width: 240px" />
      </el-form-item>
      <el-form-item label="类型:" prop="type">
        <el-select
          v-model="form.type"
          placeholder="类型"
          :popper-append-to-body="false"
          style="width: 240px"
        >
          <el-option
            v-for="item in typelist"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="IP地址:" prop="ip">
        <el-input v-model.trim="form.ip" style="width: 240px" />
      </el-form-item>
      <el-form-item label="端口:" prop="port">
        <el-input v-model.trim="form.port" style="width: 240px" />
      </el-form-item>
      <el-form-item label="用户名:" prop="username">
        <el-input v-model.trim="form.username" style="width: 240px" />
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
      <el-form-item label="型号:" prop="model">
        <el-input v-model.trim="form.model" style="width: 240px" />
      </el-form-item>
      <el-form-item label="系统版本:" prop="os">
        <el-input v-model.trim="form.os" style="width: 240px" />
      </el-form-item>
      <el-form-item label="序列号:" prop="sn">
        <el-input v-model.trim="form.sn" style="width: 240px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doAdd, doEdit } from '@/api/ipam/netdevice'

  export default defineComponent({
    name: 'Edit',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        formRef: null,
        treeData: [],
        typelist: [
          {
            value: '交换机',
            label: '交换机',
          },
          {
            value: '路由器',
            label: '路由器',
          },
          {
            value: '防火墙',
            label: '防火墙',
          },
          {
            value: '其他网络设备',
            label: '其他网络设备',
          },
        ],
        form: {
          id: 0,
          subnet_id: 0,
          ip: '',
          port: 22,
          protocol: 'ssh',
          type: '交换机',
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
