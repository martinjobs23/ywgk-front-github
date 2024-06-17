<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="900px"
    @close="close"
  >
    <el-row>
      <el-col :span="12">
        <el-form
          ref="formRef"
          inline
          label-width="100px"
          :model="form"
          :rules="rules"
        >
          <el-form-item
            v-if="verifydata.type_id != form.type_id || showallfields"
            label="资产分类"
            prop="type_id"
          >
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
              v-model="checked0"
              label=""
            />
          </el-form-item>
          <el-form-item
            v-if="verifydata.org_id != form.org_id || showallfields"
            label="所属部门:"
          >
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
          </el-form-item>
          <el-form-item
            v-if="verifydata.use_state != form.use_state || showallfields"
            label="使用情况"
            prop="use_state"
          >
            <el-select v-model="form.use_state" style="width: 240px">
              <el-option label="在用" :value="在用" />
              <el-option label="报废" :value="报废" />
            </el-select>
            <el-checkbox
              v-if="form.id.length > 1"
              v-model="checked0"
              label=""
            />
          </el-form-item>
          <el-form-item
            v-if="verifydata.secret_level != form.secret_level || showallfields"
            label="密级"
            prop="secret_level"
          >
            <el-select v-model="form.secret_level" style="width: 240px">
              <el-option label="非密" :value="非密" />
              <el-option label="内部" :value="内部" />
            </el-select>
            <el-checkbox
              v-if="form.id.length > 1"
              v-model="checked0"
              label=""
            />
          </el-form-item>

          <template v-for="val in editFieldSet" :key="val.label">
            <el-form-item
              v-if="verifydata[val.prop] != form[val.prop] || showallfields"
              :label="val.label"
              :prop="val.prop"
            >
              <el-input v-model="form[val.prop]" style="width: 240px" />
              <el-checkbox
                v-if="form.id.length > 1"
                v-model="checked[val.prop]"
                label="修改"
                name="val.prop"
              />
            </el-form-item>
          </template>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-form
          ref="formRef2"
          inline
          label-width="100px"
          :model="verifydata"
          :rules="rules"
        >
          <el-form-item
            v-if="verifydata.type_id != form.type_id || showallfields"
            label="资产分类"
            prop="type_id"
          >
            <el-select
              v-model="verifydata.type_id"
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
              v-model="checked['type_id']"
              label=" 修改"
              name="type_id"
              @change="handleCheckChange('type_id', verifydata.type_id)"
            />
          </el-form-item>

          <el-form-item
            v-if="verifydata.org_id != form.org_id || showallfields"
            label="所属部门:"
          >
            <el-tree-select
              v-model="verifydata.org_id"
              check-strictly
              :data="treeData"
              filterable
              placeholder="选择上级组织机构"
              :props="{ label: 'name', value: 'id' }"
              :render-after-expand="false"
              style="width: 240px"
            />
            <el-checkbox
              v-model="checked['org_id']"
              label=" 修改"
              name="org_id"
              @change="handleCheckChange('org_id', verifydata.org_id)"
            />
          </el-form-item>
          <el-form-item
            v-if="verifydata.use_state != form.use_state || showallfields"
            label="使用情况"
            prop="use_state"
          >
            <el-select v-model="verifydata.use_state" style="width: 240px">
              <el-option label="在用" :value="在用" />
              <el-option label="报废" :value="报废" />
            </el-select>
            <el-checkbox
              v-model="checked['use_state']"
              label=" 修改"
              name="use_state"
              @change="handleCheckChange('use_state', verifydata.use_state)"
            />
          </el-form-item>
          <el-form-item
            v-if="verifydata.secret_level != form.secret_level || showallfields"
            label="密级"
            prop="secret_level"
          >
            <el-select v-model="verifydata.secret_level" style="width: 240px">
              <el-option label="非密" :value="非密" />
              <el-option label="内部" :value="内部" />
            </el-select>
            <el-checkbox
              v-model="checked['secret_level']"
              label=" 修改"
              name="secret_level"
              @change="
                handleCheckChange('secret_level', verifydata.secret_level)
              "
            />
          </el-form-item>

          <template v-for="val in editFieldSet" :key="val.label">
            <el-form-item
              v-if="verifydata[val.prop] != form[val.prop] || showallfields"
              :label="val.label"
              :prop="val.prop"
            >
              <el-input v-model="verifydata[val.prop]" style="width: 240px" />
              <el-checkbox
                v-model="checked[val.prop]"
                label=" 修改"
                name="val.prop"
                @change="handleCheckChange([val.prop], verifydata[val.prop])"
              />
            </el-form-item>
          </template>
        </el-form>
      </el-col>
    </el-row>

    <template #footer>
      <el-checkbox
        v-model="showallfields"
        label="显示所有字段"
        name="showallfields"
      />
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doVerify, getVerifyData } from '@/api/dev/info'

  export default defineComponent({
    name: 'DevInfoVerify',
    emits: ['verify-finish'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        formRef: null,
        formRef2: null,
        treeData: [],
        typelist: [],
        editFieldSet: new Set([]),
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
        checked: {},
        verifydata: {},
        showallfields: false,
        form: {
          id: 0,
          name: '',
          type_id: 0,
        },
        rules: {
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
      const showVerify = (
        treeData,
        groupData,
        userData,
        row,
        typelist,
        fieldSet,
        editFieldSet
      ) => {
        state.title = '校核'

        state.checked = []
        state.form = JSON.parse(JSON.stringify(row))

        state.treeData = treeData
        state.groupData = groupData
        state.userData = userData
        state.typelist = typelist
        state.fieldSet = fieldSet
        state.editFieldSet = editFieldSet

        //加载待审核数据
        fetchData()
      }
      const fetchData = async () => {
        state.listLoading = true
        const { msg, data } = await getVerifyData({ id: state.form.id })
        console.log(data)
        if (data == null || data === undefined) {
          $baseMessage('错误:' + msg, 'error', 'vab-hey-message-error')
          close()
        } else {
          state.verifydata = data
          state.dialogFormVisible = true
        }
      }
      function showMultiVerify(treeData, row, typelist, editFieldSet, ids) {
        state.title = '批量修改[' + ids.length + ']个资产信息'
        state.form = JSON.parse(JSON.stringify(row))
        state.form.id = ids
        state.treeData = treeData
        state.typelist = typelist
        state.editFieldSet = editFieldSet

        if (state.form.id.length > 1) {
          //批量修改时候，删除没有设置的属性
          delete state.form['number']
          //state.editFieldSet.forEach((name) => {
          //  delete state.form[name]
          //})
        }

        state.dialogFormVisible = true
      }
      const handleCheckChange = (fieldName, fieldValue) => {
        console.log(
          state.checked[fieldName] +
            ',' +
            fieldName +
            ',' +
            state.form[fieldName] +
            ' => ' +
            fieldValue
        )
      }
      const close = () => {
        state['formRef'].resetFields()
        state.dialogFormVisible = false
      }
      const save = () => {
        state['formRef'].validate(async (valid) => {
          let response
          if (valid) {
            //是否选中
            if (state.checked.type_id)
              state.form.type_id = state.verifydata.type_id

            state.fieldSet.forEach((field) => {
              if (state.checked[field.prop]) {
                console.log(
                  state.form[field.prop] + ' => ' + state.verifydata[field.prop]
                )
                state.form[field.prop] = state.verifydata[field.prop]
              }
            })

            response = await doVerify(state.form)

            if (response.data <= 0)
              $baseMessage(
                '失败:' + response.msg,
                'error',
                'vab-hey-message-error'
              )
            else {
              $baseMessage('校核数据成功', 'success', 'vab-hey-message-success')
              state.form.verifydata = 2
              emit('verify-finish', state.form)
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
        showVerify,
        showMultiVerify,
        handleCheckChange,
        fetchData,
        close,
        save,
      }
    },
  })
</script>
