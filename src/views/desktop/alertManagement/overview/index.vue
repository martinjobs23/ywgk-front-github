<template>
  <div class="overviewAlert-container">
    <vab-card shadow="hover">
      <vab-query-form>
        <vab-query-form-top-panel :span="12" />
        <!--
        <vab-query-form-right-panel :span="12">
          <el-form inline :model="queryForm">
            <el-form-item>
              <el-select
                v-model="queryForm.option"
                placeholder="选择搜索字段"
                :popper-append-to-body="false"
                style="width: 100px"
              >
                <el-option
                  v-for="item in queryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model.trim="queryForm.condition"
                autofocus="true"
                placeholder="请输入查询值"
                style="margin-left: 10px"
                @keyup.enter="fetchData"
              />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" type="primary" @click="fetchData">
                查询
              </el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
        -->
      </vab-query-form>
      <el-table
        ref="tableRef"
        v-loading="listLoading"
        border
        :data="list"
        :default-expand-all="true"
        highlight-current-row
        row-key="id"
        size="small"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @current-change="handleCurrentChange"
        @row-click="handleRowClick"
        @select="handleSelect"
        @select-all="handleSelectAll"
      >
        <!--        @selection-change="onTableSelectChange"-->
        <!--        @sort-change="ondataTableChange"-->
        <el-table-column show-overflow-tooltip type="selection" width="40" />
        <el-table-column align="center" label="序号" type="" width="55">
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>

        <el-table-column
          label="设备名称"
          prop="dev_name"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="组织部门"
          prop="name"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="设备IP"
          prop="dev_ip"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="设备HASH"
          prop="username"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="异常时间"
          prop="time"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="处理措施"
          prop="type"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="异常类型"
          prop="alertType"
          show-overflow-tooltip
          sortable
        />
        <template #empty>
          <!-- <el-image
                class="vab-data-empty"
                :src="require('@/assets/empty_images/data_empty.png')"
              /> -->
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>
      <el-pagination
        v-model:current-page="queryForm.pageNow"
        v-model:page-size="queryForm.pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100, 200, 300, 400, 500, 1000, 10000]"
        :small="small"
        :total="total"
        @current-change="handlePageCurrentChange"
        @size-change="handlePageSizeChange"
      />
    </vab-card>
    <div style="width: auto; height: 25rem">
      <div id="classification"></div>
      <!--
      <div id="quantity"></div>
      -->
    </div>
    <detail ref="detailRef" @detail-finish="onDetailFinish" />
  </div>
</template>

<script>
  import { defineComponent, onMounted, inject } from 'vue'
  import { getOverviewList } from '@/api/desktop/alertManagement'

  export default defineComponent({
    setup() {
      const state = reactive({
        tableRef: null,
        detailRef: null,
        list: [],
        total: 0,
        listLoading: true,
        currentRow: null,
        editRow: null,
        queryOptions: [
          {
            value: '*',
            label: '全局搜索',
          },
          {
            value: 'device_name',
            label: '设备名称',
          },
          {
            value: 'device_ip',
            label: '设备IP',
          },
          {
            value: 'type',
            label: '处置措施',
          },
        ],
        pieOption: {
          //标题
          title: {
            text: '异常类型分布',
            // top: 'bottom',
            left: 'center',
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
          },
          grid: {
            top: '0px',
            left: '0px',
            right: '0px',
            bottom: '0px',
          },
          series: [
            {
              name: '异常类型',
              type: 'pie',
              radius: '55%',
              avoidLabelOverlap: true,
              itemStyle: {
                //基本样式
                normal: {
                  label: {
                    show: true,
                    textStyle: { color: '#3c4858', fontSize: '16' },
                    //让series 中的文字进行换行
                    formatter: function (val) {
                      return val.name.split('-').join('\n')
                    },
                  },
                  //线条颜色
                  labelLine: {
                    show: true,
                    lineStyle: { color: '#3c4858' },
                  },
                },
                //鼠标放在各个区域的样式
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  //鼠标放在区域边框颜色
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                  textColor: '#000',
                },
              },
              data: [
                { value: 0, name: '硬件异常' },
                { value: 0, name: '软件异常' },
                { value: 0, name: '进程异常' },
              ],
              //各个区域颜色
              color: ['#51CEC6', '#FFB703', '#5FA0FA'],
            },
          ],
        },
        queryForm: {
          pageNow: 1,
          pageSize: 10,
          option: '*',
          condition: '',
        },
      })

      //获取数据
      const fetchData = async () => {
        state.listLoading = true
        const { data } = await getOverviewList(state.queryForm)
        state.list = data.jsonData
        state.total = data.totalCount
        console.log(data.jsonData)
        fetchCharts(data.hardCount, data.softChangeCount, data.softRunCount)
        state.listLoading = false
      }
      //画图
      const fetchCharts = async (hardTotal, softChangeTotal, softRunTotal) => {
        piechart(hardTotal, softChangeTotal, softRunTotal)
        linechart()
      }
      const isRowSelected = (row) => {
        let selected = false
        const selectedRows = state.tableRef.getSelectionRows()
        if (selectedRows) {
          const obj = selectedRows.find((val) => {
            return val.time === row.time
          })
          if (obj) selected = true
        }
        return selected
      }
      const setChildrenSelection = (row, selected) => {
        state.tableRef.toggleRowSelection(row, selected)
        if (row.children) {
          row.children.forEach((child) => {
            setChildrenSelection(child, selected)
          })
        }
      }
      const handleRowClick = (row, column) => {
        //console.log('handleRowClick')
        //console.log(column)
        //console.log(event)
        if (column && (column.label === '排序' || column.label === '操作'))
          return

        state.tableRef.toggleRowSelection(row)
        setChildrenSelection(row, isRowSelected(row))
      }
      //处理页面大小改变
      const handlePageSizeChange = (val) => {
        state.queryForm.pageSize = val
        state.queryForm.pageNow = 1
        fetchData()
      }
      //当前页面
      const handlePageCurrentChange = (val) => {
        state.queryForm.pageNow = val
        fetchData()
      }
      const echarts = inject('echarts') // 主要
      // 饼图
      const piechart = (hardTotal, softChangeTotal, softRunTotal) => {
        // const setEchartWH = { //设置控制图表大小变量
        //   width: 600,
        //   height: 400
        // };
        const chartBox = echarts.init(
          document.getElementById('classification')
          // setEchartWH
        ) // 主要
        state.pieOption.series[0].data[0].value = hardTotal
        state.pieOption.series[0].data[1].value = softChangeTotal
        state.pieOption.series[0].data[2].value = softRunTotal
        // state.pieOption.series[0].data[2].value = flowTotal
        chartBox.setOption(state.pieOption)
        // 根据页面大小自动响应图表大小
        window.addEventListener('resize', function () {
          chartBox.resize()
        })
      }
      // 折线图
      const linechart = () => {
        // 获取组件实例
        const machart = echarts.init(document.getElementById('quantity'))
        // 设置配置项
        const lineoption = {
          // 标题设置
          title: {
            text: '七日异常终端数量变化',
            left: 'center',
          },
          xAxis: {
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          },
          yAxis: {},
          tooltip: {},
          grid: {
            bottom: '20px',
          },
          series: [
            {
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

      onMounted(() => {
        fetchData()
      })

      return {
        ...toRefs(state),
        fetchData,
        handleRowClick,
        handlePageSizeChange,
        handlePageCurrentChange,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $base: '.overviewAlert';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }

  #classification {
    min-height: 22rem;
    width: 40%;
    float: left;
  }

  #quantity {
    min-height: 15rem;
    width: 40%;
    float: right;
  }
</style>
