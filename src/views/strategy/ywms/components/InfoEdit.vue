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
      <el-form-item label="ip地址" prop="ip">
        <el-input
          v-model="form.ip"
          autocomplete="off"
          oninput="value=value.replace(/[^0-9]\.]/,'')"
          style="width: 240px"
          @input="ipVerify"
        />
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-input v-model="form.port" autocomplete="off" style="width: 240px" />
      </el-form-item>
      <el-form-item label="通信协议" prop="protocol">
        <el-select
          v-model="form.protocol"
          filterable
          placeholder="请选择"
          style="width: 240px"
          @change="onSelectChange"
        >
          <el-option key="TCP" label="TCP" value="TCP" />
          <el-option key="UDP" label="UDP" value="UDP" />
        </el-select>
      </el-form-item>
      <el-form-item label="添加人员" prop="person">
        <el-input
          v-model="form.person"
          autocomplete="off"
          :disabled="true"
          style="width: 240px"
        />
      </el-form-item>
      <!-- <el-form-item label="组织部门" prop="part">
        <el-input v-model="form.part" autocomplete="off" style="width: 240px" />
      </el-form-item> -->
      <el-form-item label="加入原因" prop="reason">
        <el-input
          v-model="form.reason"
          autocomplete="off"
          style="width: 240px"
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
  import { doAdd, doEdit } from '@/api/check/checkIpManagement'
  import { getPage } from '@/api/meeting/room'
  import { useUserStore } from '~/src/store/modules/user'

  const userStore = useUserStore()
  const { username } = storeToRefs(userStore)
  export default defineComponent({
    name: 'InfoEdit',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        formRef: null,
        treeData: [],
        placeOptions: [],
        form: {
          id: 0,
        },
        rules: {
          ip: [
            {
              required: true,
              trigger: 'blur',
              message: '请输入IP地址',
            },
            {
              pattern:
                /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
              message: '请输入正确IP地址格式',
              trigger: 'blur',
            },
          ],
          port: [{ required: true, trigger: 'blur', message: '请输入端口号' }],
          person: [
            { required: true, trigger: 'blur', message: '请输入添加人员' },
          ],
          protocol: [
            { required: true, trigger: 'blur', message: '请选择通信协议' },
          ],
          part: [
            { required: true, trigger: 'blur', message: '请输入所属组织部门' },
          ],
          reason: [
            { required: true, trigger: 'blur', message: '请输入加入原因' },
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
      const showAdd = (treeData, list, pid) => {
        state.title = '添加'
        state.treeData = treeData
        state.form.pid = pid
        state.form.person = username
        state.dialogFormVisible = true
        fetchData()
      }
      const showEdit = (treeData, list, row) => {
        state.title = '编辑'
        state.treeData = treeData
        //console.log(treeData)
        state.form = JSON.parse(JSON.stringify(row))
        state.dialogFormVisible = true
        fetchData()
      }
      const fetchData = async () => {
        const {
          data: { pageData },
        } = await getPage(state.queryForm)
        state.placeOptions = pageData
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
            if (state.form.id === undefined || state.form.id <= 0) {
              response = await doAdd(state.form)
            } else {
              response = await doEdit(state.form)
            }
            if (response.data <= 0)
              $baseMessage(response.msg, 'error', 'vab-hey-message-error')
            else {
              $baseMessage(response.msg, 'success', 'vab-hey-message-success')
              emit('edit-finish', state.form)
              close()
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
