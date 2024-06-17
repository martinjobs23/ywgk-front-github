<template>
  <el-dialog
    v-model="dialogFormVisible"
    min-width="900px"
    :title="title"
    @close="close"
  >
    <vab-query-form>
      <vab-query-form-top-panel :span="12">
        <el-form enctype="multipart/form-data" inline :model="uploadForm">
          <el-form-item>
            <!--本地测试 上传路径 http://localhost:8080/summer/asset/info/import" -->
            <!--服务器部署 相对路径 /summer/asset/info/import" -->
            <el-upload
              ref="uploadRef"
              accept=".xlsx, .xls"
              action="http://localhost:8080/summer/asset/info/import"
              :auto-upload="false"
              :before-upload="handleBeforeUpload"
              :data="uploadForm"
              :limit="1"
              :multiple="false"
              :on-change="handleUploadChange"
              :on-error="handleUploadError"
              :on-exceed="handleUploadExceed"
              :on-success="handleUploadSuccess"
              :show-file-list="false"
              with-credentials
            >
              <el-button icon="Upload" type="success">
                选择Excel文件上传
              </el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
      <vab-query-form-right-panel :span="12">
        <el-form inline :model="form">
          <el-form-item label="重复数据处理方式：">
            <el-select
              v-model="dataPro"
              placeholder="重复数据"
              :popper-append-to-body="false"
              style="width: 100px"
            >
              <el-option
                v-for="item in dataProOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      ref="tableRef"
      v-loading="listLoading"
      border
      :data="list"
      :default-expand-all="true"
      height="350px"
      highlight-current-row
      row-key="id"
      size="small"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @current-change="handleCurrentChange"
      @row-click="handleRowClick"
      @select="handleSelect"
      @select-all="handleSelectAll"
    >
      <el-table-column align="center" label="序号" type="" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="IP地址" prop="IP地址" show-overflow-tooltip />
      <el-table-column label="端口" prop="端口" show-overflow-tooltip />
      <el-table-column label="通信协议" prop="通信协议" show-overflow-tooltip />
      <el-table-column label="添加人员" prop="添加人员" show-overflow-tooltip />
      <el-table-column label="加入原因" prop="加入原因" show-overflow-tooltip />
      <el-table-column label="添加时间" prop="添加时间" show-overflow-tooltip />

      <template #empty>
        <!-- <el-image
                class="vab-data-empty"
                :src="require('@/assets/empty_images/data_empty.png')"
              /> -->
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <h3>
      <i class="el-icon-info">
        以上是资产信息预览，请您检查无误后，点击“确定”按钮上传至服务器
      </i>
    </h3>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleUploadSubmit">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doImport } from '@/api/check/checkIpManagement'
  import * as XLSX from 'xlsx'
  import {
    Share,
    Edit,
    Delete,
    Search,
    SortUp,
    SortDown,
  } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'FileUpload',
    emits: ['finish-fetchdata'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        tableRef: null,
        uploadRef: null,
        orgNameMap: [],
        typelist: [],
        type_id: 0,
        fieldSet: new Set([]),
        list: [],
        listLoading: false,
        dataPro: 'replenish',
        dataProOptions: [
          {
            value: 'ignore',
            label: '忽略',
          },
          {
            value: 'cover',
            label: '覆盖',
          },
          {
            value: 'replenish',
            label: '补齐',
          },
        ],
        title: '',
        dialogFormVisible: false,
      })
      const showUpload = (orgTreeData, typelist, fieldSet, type_id) => {
        state.title = '违规外联信息导入'

        //state.form = JSON.parse(JSON.stringify(row))
        // state.orgNameMap = treeToNameMap(orgTreeData)
        state.type_id = type_id
        state.typelist = typelist

        // const obj = state.typelist.find((item) => {
        //   return item.id === type_id
        // })
        // if (obj) {
        //   state.type = obj.name
        //   state.title = '资产信息导入 [' + obj.name + ']'
        // }

        state.fieldSet = fieldSet
        state.dialogFormVisible = true
      }
      const handleUploadSubmit = async () => {
        if (!state.list || state.list.length == 0) {
          $baseMessage(
            '没有选择文件或者文件格式错误',
            'error',
            'vab-hey-message-error'
          )
          return
        }
        //state.uploadRef.submit()
        let count = 0
        let ignore = 0
        let fail = 0
        let failMsg = ''

        state.listLoading = true

        for (const row of state.list) {
          //console.log(row)
          //一条条导入
          //row.type_id = state.type_id
          row.dataPro = state.dataPro
          const { msg, data } = await doImport(row)
          if (data == undefined || data == null) fail++
          else if (data > 0) count++
          else if (data == 0) ignore++
          else {
            failMsg = msg
            fail++
            if (msg.indexOf('用户未登录') > -1) {
              $baseMessage(failMsg, 'error', 'vab-hey-message-error')
              state.listLoading = false
              close()
              return
            }
          }
        }

        if (fail == 0)
          $baseMessage(
            '成功导入' + count + '条数据, 忽略' + ignore + ',错误' + fail,
            'success',
            'vab-hey-message-success'
          )
        else
          $baseMessage(
            '成功导入' +
              count +
              '条数据, 忽略' +
              ignore +
              ',错误' +
              fail +
              ': ' +
              failMsg,
            'error',
            'vab-hey-message-error'
          )

        state.list = null
        state.listLoading = false
        emit('finish-fetchdata')
        close()
      }
      const handleUploadSuccess = (response, file, fileList) => {
        console.log(file)
        console.log(fileList)
        //console.log(response)
        if (response.code && response.code == 200) {
          console.log(response)
          $baseMessage(response.msg, 'success', 'vab-hey-message-success')
          state.uploadRef.clearFiles()
        } else if (response.msg)
          $baseMessage(
            '上传失败: ' + response.msg,
            'error',
            'vab-hey-message-error'
          )
        else
          $baseMessage('上传失败:' + response, 'error', 'vab-hey-message-error')
      }
      const handleUploadExceed = (files) => {
        console.log('handleUploadExceed')
        console.log(files)
        state.uploadRef.clearFiles()
        state.uploadRef.handleStart(files[0])
      }
      const handleUploadChange = (e) => {
        const file = e.raw
        if (!file) return

        // 读取FILE中的数据
        state.listLoading = true
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = (e) => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'binary', cellDates: true })
          const wsname = workbook.SheetNames[0]
          const outdata = XLSX.utils.sheet_to_json(workbook.Sheets[wsname])
          console.log(outdata)
          state.list = outdata
          state.listLoading = false
        }
      }
      const handleUploadError = (err, file, fileList) => {
        console.log(file)
        console.log(fileList)
        $baseMessage('上传失败' + err, 'error', 'vab-hey-message-error')
      }
      // 上传前校检格式和大小
      const handleBeforeUpload = (rawFile) => {
        console.log(rawFile)
        /*
        if (rawFile.type !== 'image/jpeg') {
          $baseMessage('只能jpeg', 'error', 'vab-hey-message-error')
          return false
        } else if (rawFile.size / 1024 / 1024 > 2) {
          $baseMessage('文件不能大于2M', 'error', 'vab-hey-message-error')
          return false
        }
        */
        return true
      }

      const close = () => {
        state.dialogFormVisible = false
      }
      return {
        ...toRefs(state),
        showUpload,
        handleUploadSuccess,
        handleUploadExceed,
        handleUploadChange,
        handleUploadError,
        handleBeforeUpload,
        handleUploadSubmit,
        Share,
        Edit,
        Delete,
        Search,
        SortUp,
        SortDown,
        close,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $base: '.fileUpload-management';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
</style>
