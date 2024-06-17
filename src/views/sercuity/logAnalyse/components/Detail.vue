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
        <el-tab-pane label="日志详情" name="hardwareInfo">
          <div class="hardwareInfo-container">
            <el-form ref="formRef" label-width="120px" :model="form">
              <el-form-item label="平台名称" prop="platname">
                <el-input v-model="form.platname" />
              </el-form-item>
              <el-form-item label="日志内容" prop="logcontentDetail">
                <el-input
                  v-model.trim="form.logcontentDetail"
                  :rows="15"
                  type="textarea"
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
        <!--        <el-tab-pane label="软件信息" name="softwareInfo">-->
        <!--          <div class="softwareInfo-container">-->
        <!--            <el-row>-->
        <!--              <el-col :lg="20" :md="16" :sm="24" :xl="20" :xs="24">-->
        <!--                <el-table-->
        <!--                  ref="dataTable2"-->
        <!--                  v-loading="listLoading"-->
        <!--                  border-->
        <!--                  :cell-style="{ padding: 1 }"-->
        <!--                  :data="softwarelist"-->
        <!--                  :default-expand-all="isExpand"-->
        <!--                  :element-loading-text="elementLoadingText"-->
        <!--                  highlight-current-row-->
        <!--                  row-key="id"-->
        <!--                  :row-style="{ height: '30px' }"-->
        <!--                  @select="select"-->
        <!--                  @select-all="selectAll"-->
        <!--                  @selection-change="setSelectRows"-->
        <!--                >-->
        <!--                  <el-table-column-->
        <!--                    label="#"-->
        <!--                    prop="id"-->
        <!--                    show-overflow-tooltip-->
        <!--                    type=""-->
        <!--                    width="40"-->
        <!--                  >-->
        <!--                    <template #default="role">-->
        <!--                      {{ role.$index + 1 }}-->
        <!--                    </template>-->
        <!--                  </el-table-column>-->
        <!--                  <el-table-column-->
        <!--                    show-overflow-tooltip-->
        <!--                    type="selection"-->
        <!--                    width="40"-->
        <!--                  />-->
        <!--                  <el-table-column-->
        <!--                    label="软件名称"-->
        <!--                    prop="filename"-->
        <!--                    show-overflow-tooltip-->
        <!--                    sortable-->
        <!--                  />-->
        <!--                  <el-table-column-->
        <!--                    label="软件HASH"-->
        <!--                    prop="hash"-->
        <!--                    show-overflow-tooltip-->
        <!--                    sortable-->
        <!--                  />-->
        <!--                  <el-table-column-->
        <!--                    label="安装时间"-->
        <!--                    prop="time"-->
        <!--                    show-overflow-tooltip-->
        <!--                    sortable-->
        <!--                  />-->
        <!--                  <el-table-column-->
        <!--                    label="设备IP"-->
        <!--                    prop="dev_ip"-->
        <!--                    show-overflow-tooltip-->
        <!--                    sortable-->
        <!--                  />-->
        <!--                  <el-table-column-->
        <!--                    label="使用时长(小时)"-->
        <!--                    prop="use_time"-->
        <!--                    show-overflow-tooltip-->
        <!--                    sortable-->
        <!--                  />-->
        <!--                  <el-table-column align="center" label="操作" width="160">-->
        <!--                    <template #default="{ row }">-->
        <!--                      <el-button :icon="Edit" type="text" @click="handleUpload(row)">-->
        <!--                        升级-->
        <!--                      </el-button>-->
        <!--                      <el-button :icon="Delete" type="text" @click="handleDelete(row)">-->
        <!--                        卸载-->
        <!--                      </el-button>-->
        <!--                    </template>-->
        <!--                  </el-table-column>-->
        <!--                </el-table>-->
        <!--                <el-pagination-->
        <!--                  :background="background"-->
        <!--                  :current-page="searchForm.pageNow"-->
        <!--                  :layout="layout"-->
        <!--                  :page-sizes="[10, 100, 200, 500, 1000]"-->
        <!--                  :total="total"-->
        <!--                  @current-change="onPageCurrentChange"-->
        <!--                  @size-change="onPageSizeChange"-->
        <!--                />-->
        <!--              </el-col>-->
        <!--            </el-row>-->
        <!--            <div class="dialog-footer" style="text-align: center">-->
        <!--              <el-button style="margin-right: 10%" @click="close">-->
        <!--                关 闭-->
        <!--              </el-button>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </el-tab-pane>-->
        <!--        <el-tab-pane label="流量信息" name="flowInfo">-->
        <!--          <div style="width: auto; height: 20rem">-->
        <!--            <div id="quantity"></div>-->
        <!--          </div>-->
        <!--          <div class="dialog-footer" style="text-align: center">-->
        <!--            <el-button style="margin-right: 10%" @click="close">-->
        <!--              关 闭-->
        <!--            </el-button>-->
        <!--          </div>-->
        <!--        </el-tab-pane>-->
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script>
  // import { radRevoke, hardwareCheckInfo } from '@/api/desktop/terminalManager'
  import { inject, nextTick } from 'vue'
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
    setup() {
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        form: {},
        formRef: null,
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
        title: '终端状态详情',
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
      const show = (row) => {
        state.activeName = 'hardwareInfo'
        state.form = row
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
        if (state.activeName == 'hardwareInfo') {
          // hardwareQuery()
        }
        if (state.activeName == 'softwareInfo') {
          softwareQuery()
        }
        if (state.activeName == 'flowInfo') {
          await nextTick()
          flowQuery()
        }
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
        $baseConfirm('你确定撤销该设备证书吗?', null, () => {
          $baseMessage('尚未有撤销功能！', 'error')
          // radRevoke(state.form).then((res) => {
          //   state.$baseMessage(res.msg, res.data)
          //   state.fetchData()
          // })
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
        console.log(state.searchForm)
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
        show,
        unDo,
        tabsHandleClick,
        fetchData,
        setSelectRows,
        selectAll,
        select,
        onPageSizeChange,
        onPageCurrentChange,
        hardwareQuery,
        softwareQuery,
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
