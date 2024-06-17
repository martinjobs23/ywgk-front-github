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
        <el-tab-pane label="专机状态" name="deviceStatus">
          <div class="deviceStatus-container">
            <el-form
              ref="formRef"
              label-width="120px"
              :model="form"
              :rules="rules"
            >
              <el-form-item label="专机名称" prop="name">
                <el-input v-model="form.name" readonly />
              </el-form-item>
              <el-form-item label="IP地址" prop="ip">
                <el-input v-model.trim="form.ip" readonly />
              </el-form-item>
              <el-form-item label="MAC地址" prop="mac">
                <el-input v-model.trim="form.mac" readonly />
              </el-form-item>
              <el-form-item label="位置" prop="location">
                <el-input
                  v-model="form.location"
                  readonly
                  :value="getLocationLabel(form.location)"
                />
              </el-form-item>

              <el-form-item label="上线时间" prop="online_time">
                <el-input v-model.trim="form.online_time" readonly />
              </el-form-item>
              <el-form-item label="下线时间" prop="offline_time">
                <el-input v-model.trim="form.offline_time" readonly />
              </el-form-item>
              <el-form-item label="登录人员信息" prop="logined_username">
                <el-input v-model.trim="form.logined_username" readonly />
              </el-form-item>
            </el-form>
            <el-form
              v-if="ifstatus"
              ref="statusRef"
              label-width="120px"
              :model="devicestatus"
              :rules="rules"
            >
              <el-form-item label="CPU利用率">
                <el-input v-model.trim="devicestatus.CPU_status" readonly>
                  %
                </el-input>
              </el-form-item>
              <el-form-item label="内存">
                <el-input
                  v-model.trim="devicestatus.memory_status_phy"
                  readonly
                />
              </el-form-item>
              <el-form-item label="系统硬盘">
                <el-input
                  v-model.trim="devicestatus.system_disk_status_phy"
                  readonly
                />
              </el-form-item>
              <el-form-item label="所有硬盘">
                <el-input
                  v-model.trim="devicestatus.total_disk_status_phy"
                  readonly
                />
              </el-form-item>
            </el-form>
            <div class="dialog-footer" style="text-align: center">
              <el-button style="margin-right: 10%" @click="close">
                关 闭
              </el-button>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="工位分配情况" name="orderlistInfo">
          <div class="orderlistInfo-container">
            <el-row>
              <el-col :lg="20" :md="16" :sm="24" :xl="20" :xs="24">
                <el-table
                  ref="dataTable2"
                  v-loading="listLoading"
                  border
                  :cell-style="{ padding: 1 }"
                  :data="orderlist"
                  :default-expand-all="isExpand"
                  :element-loading-text="elementLoadingText"
                  highlight-current-row
                  row-key="id"
                  :row-style="{ height: '30px', weight: '3000px' }"
                  @select="select"
                  @select-all="selectAll"
                  @selection-change="setSelectRows"
                >
                  <el-table-column
                    show-overflow-tooltip
                    type="selection"
                    width="40"
                  />
                  <el-table-column
                    label="#"
                    prop="id"
                    show-overflow-tooltip
                    type=""
                    width="80"
                  >
                    <template #default="role">
                      {{ role.$index + 1 }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="专机ID"
                    prop="workstation_id"
                    show-overflow-tooltip
                    sortable
                  />
                  <el-table-column
                    label="工作票ID"
                    prop="order_id"
                    show-overflow-tooltip
                    sortable
                  />
                  <el-table-column
                    label="运维人员ID"
                    prop="operator_id"
                    show-overflow-tooltip
                    sortable
                  />
                  <el-table-column
                    label="运维人员账号名"
                    prop="operator_name"
                    show-overflow-tooltip
                    sortable
                  />
                  <el-table-column
                    label="开始时间"
                    prop="start_time"
                    show-overflow-tooltip
                    width="200"
                  />
                  <el-table-column
                    label="结束时间"
                    prop="end_time"
                    show-overflow-tooltip
                    width="200"
                  />
                  <el-table-column
                    label="创建/修改时间"
                    prop="time"
                    show-overflow-tooltip
                    width="200"
                  />
                </el-table>
                <el-pagination
                  :background="background"
                  :current-page="searchForm.pageNow"
                  :layout="layout"
                  :page-sizes="[10, 100, 200, 500, 1000]"
                  :total="total"
                  @current-change="onPageCurrentChange"
                  @size-change="onPageSizeChange"
                />
              </el-col>
            </el-row>
            <div class="dialog-footer" style="text-align: center">
              <el-button style="margin-right: 10%" @click="close">
                关 闭
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script>
  // import { radRevoke, hardwareCheckInfo } from '@/api/desktop/terminalManager'
  import { inject, nextTick } from 'vue'
  import {
    devicestatus,
    radRevoke,
    radCheck,
    getOrderList,
  } from '@/api/workstation/manager'
  import { getFlowAlertList } from '@/api/desktop/alertManagement'
  import {
    Plus,
    Edit,
    Delete,
    DArrowLeft,
    Search,
    SortUp,
    SortDown,
  } from '@element-plus/icons-vue'

  export default {
    name: 'WorkstationDetail',
    emits: ['detail-finish'],
    setup(props, { emit }) {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        form: {},
        formRef: null,
        statusRef: null,
        ifstatus: false,
        searchForm: {
          option: '',
          condition: '',
          pageNow: 1,
          pageSize: 10,
        },
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true,
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
        title: '终端详情',
        devicestatus: [],
        hardwarelist: [],
        orderlist: [],
        listLoading: true,
        dialogFormVisible: false,
        activeName: 'hardwareInfo',
        isExpand: true,
        elementLoadingText: '正在加载...',
        selectRows1: '',
        selectWindow1: false,
        selectRows2: '',
        selectWindow2: false,
      })
      const show = (row) => {
        state.activeName = 'deviceStatus'
        state.form = row
        fetchData()
        state.dialogFormVisible = true
      }
      //点击标签页触发事件
      const tabsHandleClick = async (tab) => {
        //获取标签页name
        state.activeName = tab.props.name
        fetchData()
      }
      //获取数据
      const fetchData = async () => {
        if (state.activeName == 'deviceStatus') {
          //devicestatusQuery()
        }
        if (state.activeName == 'hardwareInfo') {
          // hardwareQuery()
        }
        if (state.activeName == 'orderlistInfo') {
          orderlistQuery()
        }
        if (state.activeName == 'flowInfo') {
          //await nextTick()
          //flowQuery()
        }
      }
      //终端状态查询
      const devicestatusQuery = async () => {
        if (state.form.dev_hash == null) {
          $message.warning('当前设备HASH为null')
          state.listLoading = false
          return false
        }
        state.listLoading = true
        const { data } = await devicestatus(state.form)
        state.devicestatus = data.jsonData[0]
        if (state.devicestatus != null) {
          state.ifstatus = true
          state.devicestatus.CPU_status = state.devicestatus.CPU_status + '%'
        } else {
          state.ifstatus = false
        }
        state.listLoading = false
      }
      //硬件认证信息查询
      const hardwareQuery = async () => {
        if (state.form.dev_ip == null) {
          $message.warning('当前设备IP为null')
          state.listLoading = false
          return false
        }
        state.listLoading = true
        const { data } = await hardwareInfo(state.form)
        state.hardwarelist = data.jsonData
        state.listLoading = false
      }
      //撤销证书申请
      const unDo = () => {
        $baseConfirm('你确定撤销该设备证书吗?', null, async () => {
          const response = await radRevoke(state.form)
          if (response.code === 200) {
            $baseMessage(response.msg, 'success', 'vab-hey-message-success')
            emit('detail-finish', state.form)
            close()
          } else {
            $baseMessage(response.msg, 'error', 'vab-hey-message-error')
          }
        })
      }
      //更新证书申请
      const reDo = () => {
        $baseConfirm('你确定更新该设备证书吗?', null, async () => {
          state.form.is_handle = '1'
          const response = await radCheck(state.form)
          if (response.code === 200) {
            $baseMessage(response.msg, 'success', 'vab-hey-message-success')
            emit('detail-finish', state.form)
            close()
          } else {
            $baseMessage(response.msg, 'error', 'vab-hey-message-error')
          }
        })
      }

      //工作票信息查询
      const orderlistQuery = async () => {
        if (state.form.id == null) {
          $message.warning('当前设备Id为null')
          state.listLoading = false
          return false
        }
        state.listLoading = true
        state.searchForm.workstation_id = state.form.id
        const { data } = await getOrderList(state.searchForm)
        state.orderlist = data.rows
        // state.orderlist.forEach((x) => {
        //   if (!x.time | (x.time == '')) {
        //     x.time = '未知'
        //   }
        // })
        state.total = data.total
        state.listLoading = false
      }
      const echarts = inject('echarts') // 主要
      //流量信息查询
      const flowQuery = async () => {
        if (state.form.dev_ip == null) {
          $baseMessage('当前设备IP为null', 'warning')
          state.listLoading = false
          return false
        }
        //确保在dom加载完成后调用echarts函数
        await nextTick()
        linechart()
        state.listLoading = true
        // 查询数据库中流量信息
        state.searchForm.device_ip = state.form.device_ip
        const { data } = await getFlowAlertList(state.searchForm)
        state.softwarelist = data.jsonData
        state.total = data.totalCount
        state.listLoading = false
      }

      // 折线图
      const linechart = () => {
        // 获取组件实例
        const machart = echarts.init(document.getElementById('quantity'))
        // 设置配置项
        const lineoption = {
          // 标题设置
          title: {
            text: '流量变化图',
            left: 'center',
          },
          xAxis: {
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          },
          yAxis: {},
          tooltip: {},
          legend: {
            data: ['周流量变化'],
            x: 'right',
            y: 'top',
          },
          // 调整折线图四周留白部分大小
          // grid: {
          //   top: '0px',
          //   left: '0px',
          //   right: '0px',
          //   bottom: '10px',
          // },
          series: [
            {
              name: '周流量变化',
              data: [10, 28, 25, 43, 49, 20, 31],
              type: 'line',
              stack: 'x',
              label: {
                show: true,
                rotate: 0,
              },
            },
          ],
        }
        // 赋值
        machart.setOption(lineoption)
        // 根据页面大小自动响应图表大小
        window.addEventListener('resize', function () {
          machart.resize()
        })
      }

      const setSelectRows = (val) => {
        state.selectRows = val
      }
      // 选择全部
      const selectAll = (selection) => {
        // dataTable第一层只要有在selection里面就是全选
        const isSelect = selection.some((el) => {
          const tableDataIds = state.list.map((j) => j.id)
          return tableDataIds.includes(el.id)
        })
        // dataTable第一层只要有不在selection里面就是全不选
        const isCancel = !state.list.every((el) => {
          const selectIds = selection.map((j) => j.id)
          return selectIds.includes(el.id)
        })
        if (isSelect) {
          selection.map((el) => {
            if (el.children) {
              // 解决子组件没有被勾选到
              state.setChildren(el.children, true)
            }
          })
        }
        if (isCancel) {
          state.list.map((el) => {
            if (el.children) {
              // 解决子组件没有被勾选到
              state.setChildren(el.children, false)
            }
          })
        }
      }
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
        state.dialogFormVisible = false
        state.searchForm.device_ip = ''
        state.searchForm.pageNow = 1
        state.searchForm.pageSize = 10
      }
      return {
        ...toRefs(state),
        show,
        unDo,
        reDo,
        tabsHandleClick,
        fetchData,
        setSelectRows,
        selectAll,
        select,
        onPageSizeChange,
        onPageCurrentChange,
        devicestatusQuery,
        hardwareQuery,
        orderlistQuery,
        flowQuery,
        close,
        // save,
        Plus,
        Edit,
        Delete,
        DArrowLeft,
        Search,
        SortUp,
        SortDown,
      }
    },
    methods: {
      getLocationLabel(locationValue) {
        switch (locationValue) {
          case 1:
            return '东区'
          case 2:
            return '西区'
          case 3:
            return '数据中心'
          default:
            return '未登记'
        }
      },
    },
  }
</script>
<style>
  .dialogDiv {
    /*height: 570px;*/
    height: auto;
    overflow: auto;
  }
  #quantity {
    width: 100%;
    min-height: 20rem;
  }
</style>
