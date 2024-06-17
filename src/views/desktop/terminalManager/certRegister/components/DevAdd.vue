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
      <el-form-item label="设备HASH" prop="dev_hash">
        <el-input
          v-model="form.dev_hash"
          autocomplete="off"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="MAC地址" prop="dev_mac">
        <el-input
          v-model="form.dev_mac"
          autocomplete="off"
          style="width: 240px"
        />
      </el-form-item>
      <!--      <el-form-item label="终端分组" prop="org_id">-->
      <!--        <el-tree-select-->
      <!--          v-model="form.org_id"-->
      <!--          check-strictly-->
      <!--          :data="placeOptions"-->
      <!--          filterable-->
      <!--          :props="{ label: 'name', value: 'id' }"-->
      <!--          :render-after-expand="false"-->
      <!--          style="width: 240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="设备IP" prop="device_ip">-->
      <!--        <el-input-->
      <!--          v-model="form.device_ip"-->
      <!--          autocomplete="off"-->
      <!--          style="width: 240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { addToUncheckList } from '@/api/desktop/terminalManager'
  // import { getTree } from '@/api/admin/org'

  export default defineComponent({
    name: 'DevAdd',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        formRef: null,
        treeData: [],
        placeOptions: [],
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
          dev_hash: '',
          dev_mac: '',
          id: 0,
          name: '',
        },
        rules: {
          dev_name: [
            { required: true, trigger: 'blur', message: '请输入设备名称' },
          ],
          dev_hash: [
            { required: true, trigger: 'blur', message: '请输入设备HASH' },
            {
              pattern: /^[0-9a-fA-F]{32}$/,
              message: '设备HASH必须为32位',
            },
          ],
          dev_mac: [
            { required: true, trigger: 'blur', message: '请输入设备MAC' },
            {
              pattern: /^[0-9A-Fa-f]{12}$/,
              message: '请输入正确的12位MAC地址',
            },
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
      const fetchData = async () => {}
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
            {
              //加入未注册表
              response = await addToUncheckList(state.form)
            }
            if (response.code === 200) {
              $baseMessage(response.data, 'success', 'vab-hey-message-success')
              emit('edit-finish', state.form)
              close()
            } else {
              $baseMessage(response.data, 'error', 'vab-hey-message-error')
            }
          }
        })
      }
      return {
        ...toRefs(state),
        handleCheckBoxChange,
        handleIcon,
        showAdd,
        onSelectChange,
        close,
        save,
      }
    },
  })
</script>
