<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="900px"
    @close="close"
  >
    <el-form
      ref="formRef"
      inline
      label-width="100px"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="标题" prop="title" style="width: 80%">
        <el-input
          v-model="form.title"
          autocomplete="off"
          placeholder="请输入标题"
          :rows="10"
        />
      </el-form-item>
      <el-form-item label="通知内容" prop="content" style="width: 80%">
        <el-input
          v-model="form.content"
          autocomplete="off"
          placeholder="请输入通知内容"
          :rows="10"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="发送时间" prop="time">
        <el-date-picker
          v-model="form.time"
          placeholder="选择发送时间"
          :shortcuts="shortcuts"
          style="width: 240px"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="success" @click="save">确认发送</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { messageDeliver } from '@/api/msg/Deliver'
  export default defineComponent({
    name: 'InfoEdit',
    emits: ['finish-fetchdata'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        formRef: null,
        form: {
          ips: '',
          title: '',
          content: '',
          time: '',
        },
        rules: {
          title: [{ required: true, trigger: 'blur', message: '请输入标题' }],
          content: [{ required: true, trigger: 'blur', message: '请输入内容' }],
          time: [{ required: true, trigger: 'blur', message: '请输入时间' }],
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
      const onSelectChange = (value) => {
        let obj = {}
        obj = state.typelist.find((item) => {
          return item.id === value
        })
        //console.log(value + ' ' + obj.location)
        state.form.type = obj.name
      }
      const handleIcon = (item) => {
        state.form.icon = item
      }
      const showAdd = (
        treeData,
        pid,
        typelist,
        fieldSet,
        editFieldSet,
        type_id
      ) => {
        state.title = '发送通知'
        state.form.pid = pid
        state.form.id = 0
        state.form.type_id = type_id
        state.treeData = treeData
        state.typelist = typelist
        state.fieldSet = fieldSet
        state.editFieldArray = Array.from(editFieldSet)
        state.dialogFormVisible = true
      }
      const showEdit = (treeData, row, typelist, fieldSet, editFieldSet) => {
        state.title = '编辑'
        state.form = JSON.parse(JSON.stringify(row))
        state.treeData = treeData
        state.typelist = typelist
        state.fieldSet = fieldSet
        state.editFieldArray = Array.from(editFieldSet)
        state.dialogFormVisible = true
      }
      const showMultiEdit = (
        treeData,
        row,
        typelist,
        fieldSet,
        editFieldSet,
        ids
      ) => {
        state.title = '批量修改[' + ids.length + ']个资产信息'
        state.form = JSON.parse(JSON.stringify(row))
        state.form.id = ids
        state.treeData = treeData
        state.typelist = typelist
        state.fieldSet = fieldSet

        if (state.form.id.length > 1) {
          console.log('MultiEdit: ' + ids.length)
          state.checked = {}
          state.editdata = {}
          state.editFieldArray = []
          //批量修改时候，删除没有设置的属性,如序列号，IP,MAC 等
          for (const field of editFieldSet) {
            if (
              field.prop != 'number' &&
              field.prop != 'SN' &&
              field.prop != 'disk_sn' &&
              field.prop != 'ip' &&
              field.prop != 'mac'
            ) {
              state.editFieldArray.push(field)
              console.log(
                'editFieldSet add: ' +
                  field.prop +
                  ' ' +
                  field.label +
                  ' ' +
                  state.editFieldArray.size
              )
            }
          }
        } else {
          //单个编辑
          state.editFieldArray = Array.from(editFieldSet)
        }
        state.dialogFormVisible = true
      }
      const close = () => {
        state['formRef'].resetFields()
        state.dialogFormVisible = false
      }

      const showSend = (ips) => {
        state.title = '请输入通知内容：'
        state.form.ips = ips
        state.dialogFormVisible = true
      }

      // save：msg
      const save = () => {
        state['formRef'].validate(async (valid) => {
          if (valid) {
            const code = messageDeliver(state.form)
            if (code != null) {
              $baseMessage('发送成功', 'success', 'vab-hey-message-')
              emit('finish-fetchdata', state.form)
              close()
            } else {
              $baseMessage('发送失败', 'error', 'vab-hey-message-error')
            }
          }
        })
      }

      return {
        ...toRefs(state),
        handleCheckBoxChange,
        onSelectChange,
        handleIcon,
        showSend,
        // msg:
        messageDeliver,
        showAdd,
        showEdit,
        showMultiEdit,
        close,
        save,
      }
    },
  })
</script>
