<template>
  <el-dialog
    v-model="dialogFormVisible"
    :close-on-click-modal="false"
    :title="title"
    width="70%"
    @close="close"
  >
    <div class="dialogDiv">
      <el-table
        ref="tableRef"
        v-loading="listLoading"
        border
        :data="list"
        :default-expand-all="true"
        height="350"
        highlight-current-row
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @current-change="handleCurrentChange"
        @row-click="handleRowClick"
        @select="handleSelect"
        @select-all="handleSelectAll"
      >
        <el-table-column
          label="进程名称"
          prop="process_name"
          show-overflow-tooltip
        />
        <el-table-column label="进程哈希" prop="hash" show-overflow-tooltip />
        <el-table-column label="是否合规" show-overflow-tooltip>
          <template #default="{ row }">
            <vab-icon
              v-if="row.isBlack == 'false'"
              icon="checkbox-circle-fill"
              style="color: #92ca41"
            />
            <vab-icon
              v-if="row.isBlack == 'true'"
              icon="close-circle-line"
              style="color: #ea9999"
            />
            {{ row.isBlack == 'false' ? '合规' : '违规' }}
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
  // import { radRevoke, hardwareCheckInfo } from '@/api/desktop/terminalManager'
  import { getProcessList } from '@/api/monitor/process'
  import { getProcessBlackList } from '@/api/monitor/process'
  import { inject, nextTick, computed } from 'vue'
  import {
    devicestatus,
    radRevoke,
    radCheck,
  } from '@/api/desktop/terminalManager'
  import { getDeviceSoftList } from '@/api/desktop/soft'
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
    name: 'TerminalDetail',
    emits: ['detail-finish'],
    setup(props, { emit }) {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        form: {},
        list: [],
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
        title: '进程详情',
        devicestatus: [],
        hardwarelist: [],
        softwarelist: [],
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
      const formatCloud = computed(() => {
        return function (index) {
          return parseFloat(index).toFixed(2)
        }
      })
      const show = (row) => {
        state.activeName = 'deviceStatus'
        state.row_dev_ip = row.dev_ip
        fetchData()
        state.dialogFormVisible = true
      }
      //获取数据
      const fetchData = async () => {
        state.listLoading = true
        const { data } = await getProcessList(state.queryForm)
        const blackList = await getProcessBlackList()
        state.list = data.jsonData.filter(
          (item) => item.dev_ip === state.row_dev_ip
        )
        state.total = data.totalCount
        state.blackList = blackList.data.jsonData
        // 遍历原始数据的jsonData数组，为每个对象添加isBlack属性
        state.list.forEach((item) => {
          item.isBlack = 'false' // 添加isBlack属性并赋值为"false"
        })
        checkIfBlacklisted(state.list, state.blackList)
        state.listLoading = false
      }
      //点击标签页触发事件
      const tabsHandleClick = async (tab) => {
        //获取标签页name
        state.activeName = tab.props.name
        fetchData()
      }

      //当前页面
      const handlePageCurrentChange = (val) => {
        state.queryForm.pageNow = val
        fetchData()
      }
      //终端状态查询
      const devicestatusQuery = async () => {
        if (state.form.dev_ip == null) {
          $message.warning('当前设备IP为null')
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

      //软件信息查询
      const softwareQuery = async () => {
        if (state.form.dev_ip == null) {
          $message.warning('当前设备IP为null')
          state.listLoading = false
          return false
        }
        state.listLoading = true
        state.searchForm.option = 'dev_hash'
        state.searchForm.condition = state.form.dev_hash
        const { data } = await getDeviceSoftList(state.searchForm)
        state.softwarelist = data.jsonData
        state.total = data.totalCount
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
        formatCloud,
        show,
        unDo,
        reDo,
        handlePageCurrentChange,
        tabsHandleClick,
        fetchData,
        setSelectRows,
        selectAll,
        select,
        onPageSizeChange,
        onPageCurrentChange,
        devicestatusQuery,
        hardwareQuery,
        softwareQuery,
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
  }
  function checkIfBlacklisted(list, blackList) {
    // 遍历 list 数组中的每个元素
    for (let i = 0; i < list.length; i++) {
      // let isBlacklisted = false // 标记当前元素是否在黑名单中

      // 遍历 blackList 数组中的每个元素
      for (let j = 0; j < blackList.length; j++) {
        // 如果当前元素的 startup 属性与某个黑名单元素的 startup 属性相同，则标记为已在黑名单中
        if (list[i].process_name === blackList[j].filename) {
          // isBlacklisted = true
          list[i].isBlack = 'true'
          break // 已经在黑名单中，可以退出内层循环
        }
      }

      // 输出结果，或者根据 isBlacklisted 的值执行其他操作
      //console.log(`Element ${i} is${isBlacklisted ? '' : ' not'} blacklisted.`)
    }
  }
</script>
<style>
  .dialogDiv {
    /*height: 570px;*/
    height: auto;
    overflow: auto;
  }
  #quantity {
    min-height: 20rem;
    width: 100%;
  }
</style>
