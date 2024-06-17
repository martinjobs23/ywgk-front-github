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
      <el-form-item label="上级IP网段:">
        <el-tree-select
          v-model="form.pid"
          check-strictly
          :data="treeData"
          filterable
          placeholder="选择上级IP网段"
          :props="{ label: 'name', value: 'id' }"
          :render-after-expand="false"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="网段名称:" prop="name">
        <el-input v-model.trim="form.name" style="width: 240px" />
      </el-form-item>
      <el-form-item
        label="网段地址:"
        prop="subnet"
        title="如:192.168.1.0/24或192.168.1.1-192.168.1.9"
      >
        <el-input
          v-model.trim="form.subnet"
          placeholder="192.168.1.0/24 或 起始IP-结束IP"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="所属部门:" prop="org_id">
        <el-tree-select
          v-model="form.org_id"
          check-strictly
          :data="orgTreeData"
          filterable
          placeholder="选择上级部门"
          :props="{ label: 'name', value: 'id' }"
          :render-after-expand="false"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="描述:" prop="description">
        <el-input v-model.trim="form.description" style="width: 240px" />
      </el-form-item>
      <el-form-item label="固定IP:">
        <el-switch
          v-model="form.fixed"
          :active-value="1"
          :inactive-value="0"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="保留:">
        <el-switch
          v-model="form.is_reserved"
          :active-value="1"
          :inactive-value="0"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="网络扫描:">
        <el-switch
          v-model="form.noscan"
          :active-value="0"
          :inactive-value="1"
          style="width: 240px"
        />
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
  import { doAdd, doEdit } from '@/api/ipam/subnet'

  export default defineComponent({
    name: 'SubnetEdit',
    emits: ['edit-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        formRef: null,
        orgTreeData: [],
        treeData: [],
        form: {
          id: 0,
          pid: 0,
          sort: 100,
          ip: '',
          mask: 0,
          description: '',
          is_reserved: 0,
          fixed: 0,
          noscan: 0,
        },
        rules: {
          pid: [
            { required: true, trigger: 'blur', message: '请选择上级IP网段' },
          ],
          name: [
            { required: true, trigger: 'blur', message: '请输入网段名称' },
          ],
          subnet: [
            { required: true, trigger: 'blur', message: '请输入网段地址' },
            { validator: checkSubnet, trigger: 'blur' },
          ],
          org_id: [
            { required: true, trigger: 'blur', message: '请选择所属部门' },
          ],
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
          data.unshift({ id: 0, pid: -1, name: '无上级IP网段' })
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
      const showAdd = (orgTreeData, treeData, pid) => {
        state.title = '添加'
        state.orgTreeData = orgTreeData

        state.form.pid = pid
        state.dialogFormVisible = true

        //clone一份数据
        state.treeData = treeData.slice()

        //fetchTreeData()
        addNoParentItem(state.treeData)
      }
      const showEdit = (orgTreeData, treeData, row) => {
        state.title = '编辑'
        state.orgTreeData = orgTreeData

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
              $baseMessage(response.msg, 'error', 'vab-hey-message-error')
            else {
              $baseMessage('保存数据成功', 'success', 'vab-hey-message-success')
              emit('edit-finish', state.form)
              close()
            }
          }
        })
      }
      function checkSubnet(rule, value, callback) {
        // CIDR格式正则表达式
        const cidrRegex = /^(?:\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/
        // 范围格式正则表达式
        const rangeRegex = /^(?:\d{1,3}\.){3}\d{1,3}-(?:\d{1,3}\.){3}\d{1,3}$/

        if (!value) {
          callback(new Error('网段地址不能为空'))
        } else if (cidrRegex.test(value)) {
          // 进行CIDR格式的验证
          const [ip, prefixLength] = value.split('/')
          const ipParts = ip.split('.').map(Number)
          const prefix = parseInt(prefixLength, 10)
          if (prefix < 0 || prefix > 32) {
            callback(new Error('子网掩码位数应该在0到32之间'))
          } else if (ipParts.some((part) => part < 0 || part > 255)) {
            callback(new Error('IP地址不正确'))
          } else {
            // 进行逻辑校验
            const mask = ~((1 << (32 - prefix)) - 1)
            const ipAsNumber = ipParts.reduce((sum, part, index) => {
              return sum + (part << ((3 - index) * 8))
            }, 0)

            if ((ipAsNumber & mask) !== ipAsNumber) {
              callback(new Error('不是有效的网络地址'))
            } else {
              // 调用callback()无参数表示验证通过
              callback()
            }
          }
        } else if (rangeRegex.test(value)) {
          // 进行范围格式的验证
          const ips = value.split('-')
          const ipParts1 = ips[0].split('.').map((part) => parseInt(part))
          const ipParts2 = ips[1].split('.').map((part) => parseInt(part))
          if (
            ipParts1.some((part) => part < 0 || part > 255) |
            ipParts2.some((part) => part < 0 || part > 255)
          ) {
            callback(new Error('IP地址不正确'))
          } else {
            for (let i = 0; i < 4; i++) {
              if (ipParts1[i] < ipParts2[i]) {
                continue
              } else if (ipParts1[i] > ipParts2[i]) {
                callback(new Error('起始IP不能大于结束IP'))
              }
            }
            // 调用callback()无参数表示验证通过
            callback()
          }
        } else {
          callback(new Error('网段地址格式不正确'))
        }
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
