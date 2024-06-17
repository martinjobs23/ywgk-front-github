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
      <el-form-item label="资产分类" prop="type_id">
        <el-select
          v-model="form.type_id"
          style="width: 240px"
          @change="onSelectChange"
        >
          <el-option
            v-for="item in typelist"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-checkbox
          v-if="form.id.length > 1"
          v-model="checked['type_id']"
          label=" 修改"
          name="type_id"
        />
      </el-form-item>
      <el-form-item label="所属部门:" prop="org_id">
        <el-tree-select
          v-model="form.org_id"
          check-strictly
          :data="treeData"
          filterable
          placeholder="选择上级组织机构"
          :props="{ label: 'name', value: 'id' }"
          :render-after-expand="false"
          style="width: 240px"
        />
        <el-checkbox
          v-if="form.id.length > 1"
          v-model="checked['org_id']"
          label=" 修改"
          name="org_id"
        />
      </el-form-item>
      <el-form-item label="使用情况" prop="use_state">
        <el-select v-model="form.use_state" style="width: 240px">
          <el-option label="在用" value="在用" />
          <el-option label="报废" value="报废" />
        </el-select>
        <el-checkbox
          v-if="form.id.length > 1"
          v-model="checked['use_state']"
          label=" 修改"
          name="use_state"
        />
      </el-form-item>
      <el-form-item label="密级" prop="secret_level">
        <el-select v-model="form.secret_level" style="width: 240px">
          <el-option label="非密" value="非密" />
          <el-option label="内部" value="内部" />
        </el-select>
        <el-checkbox
          v-if="form.id.length > 1"
          v-model="checked['secret_level']"
          label=" 修改"
          name="secret_level"
        />
      </el-form-item>

      <template v-for="val in editFieldArray" :key="val.label">
        <el-form-item :label="val.label" :prop="val.prop">
          <el-input v-model="form[val.prop]" style="width: 240px" />
          <el-checkbox
            v-if="form.id.length > 1"
            v-model="checked[val.prop]"
            label="修改"
            name="[val.prop]"
          />
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doAdd, doEdit } from '@/api/asset/info'

  export default defineComponent({
    name: 'AssetInfoEdit',
    emits: ['finish-fetchdata'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        formRef: null,
        treeData: [],
        typelist: [],
        checked: [],
        editdata: {},
        fieldSet: new Set([]),
        editFieldArray: [],
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
          id: 0,
          name: '',
          type_id: 0,
        },
        rules: {
          type_id: [{ required: true, trigger: 'blur', message: '请选择分类' }],
          org_id: [{ required: true, trigger: 'blur', message: '请选择部门' }],
          name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
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
        state.title = '添加'
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
      const save = () => {
        state['formRef'].validate(async (valid) => {
          let response
          if (valid) {
            if (state.form.id.length > 1) {
              state.editdata.id = state.form.id

              //批量修改是否选中
              if (state.checked['type_id']) {
                state.editdata.type_id = state.form.type_id
                state.editdata.type = state.form.type
              }

              if (state.checked['org_id']) {
                state.editdata.org_id = state.form.org_id
                state.editdata.org_name = state.form.org_name
              }

              state.fieldSet.forEach((field) => {
                console.log(
                  field.prop + ' checked=' + state.checked[field.prop]
                )

                if (state.checked[field.prop]) {
                  console.log(
                    state.editdata[field.prop] + ' => ' + state.form[field.prop]
                  )
                  state.editdata[field.prop] = state.form[field.prop]
                }
              })
              console.log(state.form)
              console.log(state.editdata)
              response = await doEdit(state.editdata)
            } else if (
              state.form.id === undefined ||
              state.form.id === null ||
              state.form.id === 0
            ) {
              response = await doAdd(state.form)
            } else {
              response = await doEdit(state.form)
            }

            if (response.data <= 0)
              $baseMessage(
                '失败:' + response.msg,
                'error',
                'vab-hey-message-error'
              )
            else {
              $baseMessage(
                '保存数据成功: 保存了' + response.data + '个数据',
                'success',
                'vab-hey-message-success'
              )
              if (state.form.id.length > 1) state.form.id = state.form.id[0]
              emit('finish-fetchdata', state.form)
              close()
            }
          }
        })
      }
      return {
        ...toRefs(state),
        handleCheckBoxChange,
        onSelectChange,
        handleIcon,
        showAdd,
        showEdit,
        showMultiEdit,
        close,
        save,
      }
    },
  })
</script>
