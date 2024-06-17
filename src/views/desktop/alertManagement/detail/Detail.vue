<template>
  <el-dialog
    v-model="dialogFormVisible"
    :close-on-click-modal="false"
    :title="title"
    width="70%"
    @close="close"
  >
    <div class="dialogDiv">
      <el-tabs v-model="activeName" @tab-click="tabsHandleClick">
        <div class="alert-container">
          <el-tab-pane v-if="ifhardware" label="硬件异常" name="hardwareAlert">
            <el-form ref="formRef" label-width="120px" :model="form">
              <el-form-item label="设备名称" prop="dev_name">
                <el-input v-model="form.dev_name" readonly />
              </el-form-item>
              <el-form-item label="设备IP" prop="dev_ip">
                <el-input v-model="form.dev_ip" readonly />
              </el-form-item>
              <el-form-item label="部门" prop="name">
                <el-input v-model="form.name" readonly />
              </el-form-item>
              <el-form-item label="设备Hash值" prop="username">
                <el-input v-model="form.dev_hash" readonly />
              </el-form-item>
              <el-form-item label="采集Hash值" prop="username">
                <el-input v-model="form.dev_hash" readonly />
              </el-form-item>
              <el-form-item label="注册时间" prop="time">
                <el-input v-model="form.time" readonly />
              </el-form-item>
              <el-form-item label="处置策略" prop="type">
                <el-input v-model="form.type" readonly />
              </el-form-item>
            </el-form>
            <div class="dialog-footer" style="text-align: center">
              <!-- <el-button
                :icon="Edit"
                plain
                type="danger"
                @click="handleHashChange()"
              >
                Hash变更
              </el-button>
              <el-button
                :icon="Edit"
                plain
                type="primary"
                @click="handleTypeChange()"
              >
                策略修改
              </el-button> -->
              <el-button style="margin-right: 10%" @click="close">
                关 闭
              </el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="ifhardware" label="软件异常" name="softwareAlert">
            <el-row>
              <el-col :lg="20" :md="16" :sm="24" :xl="20" :xs="24">
                <el-table
                  ref="dataTable2"
                  v-loading="listLoading"
                  border
                  :cell-style="{ padding: 1 }"
                  :data="softwarelist"
                  :default-expand-all="isExpand"
                  :element-loading-text="elementLoadingText"
                  highlight-current-row
                  row-key="id"
                  :row-style="{ height: '30px' }"
                  @select="select"
                  @select-all="selectAll"
                  @selection-change="setSelectRows"
                >
                  <el-table-column
                    label="#"
                    prop="id"
                    show-overflow-tooltip
                    type=""
                    width="40"
                  >
                    <template #default="role">
                      {{ role.$index + 1 }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    type="selection"
                    width="40"
                  />
                  <el-table-column
                    label="软件名称"
                    prop="filename"
                    show-overflow-tooltip
                    sortable
                  />
                  <el-table-column
                    label="软件HASH"
                    prop="hash"
                    show-overflow-tooltip
                    sortable
                  />
                  <el-table-column
                    label="变动时间"
                    prop="time"
                    show-overflow-tooltip
                    sortable
                  />
                  <el-table-column
                    label="处理措施"
                    prop="operation"
                    show-overflow-tooltip
                    sortable
                  />
                  <el-table-column
                    label="描述"
                    prop="description"
                    show-overflow-tooltip
                    sortable
                  />
                  <el-table-column
                    label="设备IP"
                    prop="dev_ip"
                    show-overflow-tooltip
                    sortable
                  />
                </el-table>
                <el-pagination
                  :background="background"
                  :current-page="searchForm.pageNow"
                  :layout="layout"
                  :page-sizes="[10, 20, 50, 100, 200, 300, 400, 500, 1000]"
                  :total="total"
                  @current-change="onPageCurrentChange"
                  @size-change="onPageSizeChange"
                />
              </el-col>
            </el-row>
            <div class="dialog-footer" style="text-align: center">
              <!-- <el-button
                :icon="Edit"
                plain
                type="danger"
                @click="handleSoftChange()"
              >
                同意变动
              </el-button>
              <el-button
                :icon="Edit"
                plain
                type="primary"
                @click="handleTypeChange()"
              >
                策略修改
              </el-button> -->
              <el-button style="margin-right: 10%" @click="close">
                关 闭
              </el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="ifflow" label="流量异常" name="flowAlert">
            <div style="width: auto; height: 40rem">
              <div>
                <el-row :gutter="20">
                  <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
                    <my-project />
                  </el-col>
                  <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
                    <flow-in7-days-charts />
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="dialog-footer" style="text-align: center">
              <!-- <el-button
                :icon="Edit"
                plain
                type="primary"
                @click="handleTypeChange()"
              >
                策略修改
              </el-button> -->
              <el-button style="margin-right: 10%" @click="close">
                关 闭
              </el-button>
            </div>
          </el-tab-pane>
        </div>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script>
  import { defineComponent, inject, nextTick } from 'vue'
  import {
    getHardwareAlertList,
    getSoftwareRunAlertList,
    getFlowAlertList,
  } from '@/api/desktop/alertManagement'

  export default defineComponent({
    name: 'Detail',
    emits: ['detail-finish'],
    setup() {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        form: {},
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true,
        ifhardware: true,
        ifsoftware: false,
        ifflow: false,
        queryForm1: {
          id: [],
          condition: '',
          option: '*',
        },
        queryForm2: {
          id: [],
          condition: '',
          option: '*',
        },
        formRef: null,
        hardwarelist: [],
        softwarelist: [],
        listLoading: true,
        title: '终端异常详情',
        dialogFormVisible: false,
        activeName: 'hardwareAlert',
        isExpand: true,
        elementLoadingText: '正在加载...',
        selectRows1: '',
        selectWindow1: false,
        selectRows2: '',
        selectWindow2: false,
        searchForm: {
          option: 'dev_ip',
          condition: '',
          pageNow: 1,
          pageSize: 10,
        },
      })
      const hardwareShow = (row) => {
        state.activeName = 'hardwareAlert'
        state.form = row
        state.ifhardware = true
        // state.form = JSON.parse(JSON.stringify(row))
        state.dialogFormVisible = true
      }
      const softwareShow = (row) => {
        state.form = row
        state.activeName = 'softwareAlert'
        state.ifsoftware = true
        state.dialogFormVisible = true
        softwareQuery()
      }
      const flowShow = (row) => {
        state.form = row
        state.activeName = 'flowAlert'
        state.ifflow = true
        state.dialogFormVisible = true
        flowQuery()
      }
      //点击标签页触发事件
      const tabsHandleClick = (tab) => {
        //获取标签页name
        state.activeName = tab.props.name
        fetchData()
      }
      //获取数据
      const fetchData = async () => {
        if (state.activeName == 'hardwareAlert') {
          await nextTick()
          hardwareQuery()
        }
        if (state.activeName == 'softwareAlert') {
          await nextTick()
          softwareQuery()
        }
        if (state.activeName == 'flowAlert') {
          await nextTick()
          flowQuery()
        }
      }
      //硬件认证信息查询
      const hardwareQuery = async () => {
        if (state.form.dev_ip == null) {
          $baseMessage('当前设备IP为null', 'warning')
          state.listLoading = false
          return false
        }
        const { data } = await getHardwareAlertList(state.form)
        state.hardwarelist = data.jsonData
        state.listLoading = false
      }
      //软件信息查询
      const softwareQuery = async () => {
        if (state.form.dev_ip == null) {
          $baseMessage('当前设备IP为null', 'warning')
          state.listLoading = false
          return false
        }
        state.listLoading = true
        state.searchForm.condition = state.form.dev_ip
        const { data } = await getSoftwareRunAlertList(state.searchForm)
        state.softwarelist = data.jsonData
        state.total = data.totalCount
        state.listLoading = false
      }
      // const echarts = inject('echarts') // 主要
      //流量信息查询
      const flowQuery = async () => {
        if (state.form.dev_ip == null) {
          $baseMessage('当前设备IP为null', 'warning')
          state.listLoading = false
          return false
        }
        //确保在dom加载完成后调用echarts函数
        await nextTick()
        // linechart()
        state.listLoading = true
        // 查询数据库中流量信息
        state.searchForm.dev_ip = state.form.dev_ip
        const { data } = await getFlowAlertList(state.searchForm)
        state.softwarelist = data.jsonData
        state.total = data.totalCount
        state.listLoading = false
      }
      // 折线图
      // const linechart = () => {
      //   // 获取组件实例
      //   const machart = echarts.init(document.getElementById('quantity'))
      //   // 设置配置项
      //   const lineoption = {
      //     // 标题设置
      //     title: {
      //       text: '流量变化图（数据待替换）',
      //       left: 'center',
      //     },
      //     xAxis: {
      //       data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      //     },
      //     yAxis: {},
      //     tooltip: {},
      //     legend: {
      //       data: ['周流量变化'],
      //       x: 'right',
      //       y: 'top',
      //     },
      //     // 调整折线图四周留白部分大小
      //     // grid: {
      //     //   top: '0px',
      //     //   left: '0px',
      //     //   right: '0px',
      //     //   bottom: '10px',
      //     // },
      //     series: [
      //       {
      //         name: '周流量变化',
      //         data: [10, 28, 25, 43, 49, 20, 31],
      //         type: 'line',
      //         stack: 'x',
      //         label: {
      //           show: true,
      //           rotate: 0,
      //         },
      //       },
      //     ],
      //   }
      //   // 赋值
      //   machart.setOption(lineoption)
      //   // 根据页面大小自动响应图表大小
      //   window.addEventListener('resize', function () {
      //     machart.resize()
      //   })
      // }
      const setSelectRows = (val) => {
        state.selectRows = val
      }
      //处理hash修改
      const handleHashChange = () => {
        $baseMessage('这是一个重新申请hash的函数！', 'error')
      }
      //处理策略修改
      const handleTypeChange = () => {
        $baseMessage('这是更改异常策略的函数！', 'error')
      }
      //处理软件修改
      const handleSoftChange = () => {
        $baseMessage('这是处理软件变动的函数！', 'error')
      }
      // // 选择全部
      // const selectAll = (selection) => {
      //   // dataTable第一层只要有在selection里面就是全选
      //   const isSelect = selection.some((el) => {
      //     const tableDataIds = state.list.map((j) => j.id)
      //     return tableDataIds.includes(el.id)
      //   })
      //   // dataTable第一层只要有不在selection里面就是全不选
      //   const isCancel = !state.list.every((el) => {
      //     const selectIds = selection.map((j) => j.id)
      //     return selectIds.includes(el.id)
      //   })
      //   if (isSelect) {
      //     selection.map((el) => {
      //       if (el.children) {
      //         // 解决子组件没有被勾选到
      //         state.setChildren(el.children, true)
      //       }
      //     })
      //   }
      //   if (isCancel) {
      //     state.list.map((el) => {
      //       if (el.children) {
      //         // 解决子组件没有被勾选到
      //         state.setChildren(el.children, false)
      //       }
      //     })
      //   }
      // }
      // 选中父节点时，子节点一起选中取消
      const select = (selection, row) => {
        if (
          selection.some((el) => {
            return row.id === el.id
          })
        ) {
          if (row.children) {
            state.setChildren(row.children, true)
          }
        } else {
          if (row.children) {
            state.setChildren(row.children, false)
          }
        }
      }
      const onPageSizeChange = (val) => {
        state.searchForm.pageSize = val
        state.searchForm.pageNow = 1
        fetchData()
      }
      const onPageCurrentChange = (val) => {
        state.searchForm.pageNow = val
        fetchData()
      }
      const close = () => {
        // state['formRef'].resetFields()
        // state.activeName = 'hardwareAlert'
        state.dialogFormVisible = false
        state.searchForm.dev_ip = ''
        state.searchForm.pageNow = 1
        state.searchForm.pageSize = 10
      }

      return {
        ...toRefs(state),
        hardwareShow,
        softwareShow,
        flowShow,
        tabsHandleClick,
        fetchData,
        setSelectRows,
        // selectAll,
        select,
        onPageSizeChange,
        onPageCurrentChange,
        hardwareQuery,
        softwareQuery,
        handleHashChange,
        handleTypeChange,
        handleSoftChange,
        // handleIcon,
        // showAdd,
        // showEdit,
        // onSelectChange,
        close,
        // save,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .chart {
    height: 100vh;
  }
  .dialogDiv {
    height: 570px;
    overflow: auto;
  }
  #quantity {
    min-height: 20rem;
    width: 100%;
  }
</style>
