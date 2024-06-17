<template>
  <el-dialog
    v-model:visible="dialogFormVisible"
    :close-on-click-modal="false"
    :title="title"
    width="1000px"
    @close="close"
  >
    <el-tabs active-name="first">
      <el-tab-pane label="基本信息" name="first">
        <el-form
          ref="form"
          :label-position="labelPosition"
          label-width="120px"
          :model="form"
          :rules="rules"
        >
          <el-row>
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <!--          <el-form-item label="设备Id" prop="id">-->
              <!--            <el-input-->
              <!--              v-model.trim="form.id"-->
              <!--              :disabled="true"-->
              <!--              placeholder="此项由系统生成，不可随意输入！"-->
              <!--            ></el-input>-->
              <!--          </el-form-item>-->
              <el-form-item label="设备名称" prop="name">
                <el-input v-model.trim="form.name" autocomplete="off" />
              </el-form-item>
              <el-form-item label="设备编号" prop="code">
                <el-input v-model.trim="form.code" autocomplete="off" />
              </el-form-item>
              <el-form-item label="设备组" prop="dgroup_id">
                <el-cascader
                  v-model="form.dgroup_id"
                  autocomplete="off"
                  clearable
                  :options="groupList"
                  :props="optionProps"
                />
              </el-form-item>
              <el-form-item label="操作系统类型" prop="os">
                <el-cascader
                  v-model="form.os"
                  autocomplete="off"
                  clearable
                  :options="osOptions"
                  :props="{
                    checkStrictly: true,
                    emitPath: false,
                    value: 'value',
                    label: 'label',
                    children: 'children',
                  }"
                />
              </el-form-item>
              <el-form-item label="IP地址" prop="ip">
                <el-input v-model.trim="form.ip" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :md="11" :offset="1">
              <el-form-item label="设备类型" prop="type">
                <el-cascader
                  ref="cascaderType"
                  v-model="form.type"
                  autocomplete="off"
                  clearable
                  :options="typeList"
                  :props="typeProps"
                  @visible-change="handleChange()"
                />
                <!--                <el-select v-model="form.type" clearable placeholder="请选择">-->
                <!--                  <el-option-->
                <!--                    v-for="item in typeOptions"-->
                <!--                    :key="item.value"-->
                <!--                    :label="item.label"-->
                <!--                    :value="item.value"-->
                <!--                  ></el-option>-->
                <!--                </el-select>-->
              </el-form-item>
              <el-form-item v-show="hostShow" label="宿主ip" prop="host_ip">
                <el-input v-model.trim="form.host_ip" autocomplete="off" />
              </el-form-item>
              <el-form-item label="物理位置" prop="location">
                <el-input
                  v-model.trim="form.location"
                  autocomplete="off"
                  clearable
                  placeholder="房间-机柜(A1-A10,B1-B10)-柜内位置(1-42U)"
                />
              </el-form-item>
              <el-form-item label="负责人" prop="manager">
                <el-input v-model.trim="form.manager" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="设备描述" prop="description">
              <el-input
                v-model.trim="form.description"
                placeholder="请输入内容"
                type="textarea"
              />
            </el-form-item>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="设备服务" name="second">
        <el-row>
          <el-table
            ref="protocolTable"
            border
            class="tb-edit"
            :data="protocolData"
            highlight-current-row
            :row-class-name="tableRowClassName"
            row-key="id"
            style="width: 100%"
            @row-click="onTableRowClick"
            @selection-change="setSelectRows"
          >
            <el-table-column
              show-overflow-tooltip
              type="selection"
              width="40"
            />
            <el-table-column
              align="center"
              label="#"
              show-overflow-tooltip
              width="40"
            >
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="服务类型"
              min-width="90px"
              prop="type"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <template v-if="row.edit">
                  <el-select v-model="row.type" clearable placeholder="请选择">
                    <el-option
                      v-for="item in serviceOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <!--                    <el-input v-model="row.type" style="width: 100px" />-->
                </template>
                <span v-else>{{ row.type }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="服务名称"
              min-width="80px"
              prop="name"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <template v-if="row.edit">
                  <el-input v-model="row.name" />
                </template>
                <span v-else>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="端口"
              min-width="60px"
              prop="port"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <template v-if="row.edit">
                  <el-input v-model="row.port" />
                </template>
                <span v-else>{{ row.port }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="通过代理访问"
              min-width="80px"
              prop="via_proxy"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <template v-if="row.edit">
                  <el-switch
                    v-model="row.via_proxy"
                    active-color="#13ce66"
                    :active-value="1"
                    inactive-color="#ff4949"
                    :inactive-value="0"
                  />
                </template>
                <span v-else>
                  <el-switch
                    v-model="row.via_proxy"
                    active-color="#13ce66"
                    :active-value="1"
                    disabled
                    inactive-color="#ff4949"
                    :inactive-value="0"
                  />
                </span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="通过winserver访问"
              min-width="80px"
              prop="via_winserver"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <template v-if="row.edit">
                  <el-switch
                    v-model="row.via_winserver"
                    active-color="#13ce66"
                    :active-value="1"
                    inactive-color="#ff4949"
                    :inactive-value="0"
                  />
                </template>
                <span v-else>
                  <el-switch
                    v-model="row.via_winserver"
                    active-color="#13ce66"
                    :active-value="1"
                    disabled
                    inactive-color="#ff4949"
                    :inactive-value="0"
                  />
                </span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="默认开启的特性选项"
              min-width="180px"
              prop="options"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <template v-if="row.edit">
                  <el-select
                    v-model="row.options"
                    allow-create
                    default-first-option
                    filterable
                    multiple
                    placeholder="请选择"
                  >
                    <el-option-group
                      v-for="group in defaultOptions"
                      :key="group.label"
                      :label="group.label"
                    >
                      <el-option
                        v-for="item in group.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-option-group>
                  </el-select>
                </template>
                <span v-else>
                  <el-select
                    v-model="row.options"
                    allow-create
                    default-first-option
                    disabled
                    filterable
                    multiple
                    placeholder="请选择"
                  >
                    <el-option-group
                      v-for="group in defaultOptions"
                      :key="group.label"
                      :label="group.label"
                      :value="group.value"
                    >
                      <el-option
                        v-for="item in group.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-option-group>
                  </el-select>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              show-overflow-tooltip
              width="200"
            >
              <template #default="{ row }">
                <el-button
                  v-if="row.edit"
                  size="small"
                  type="success"
                  @click="confirmEdit(row)"
                >
                  保存
                </el-button>
                <el-button
                  v-else
                  icon="el-icon-edit"
                  size="small"
                  type="primary"
                  @click="row.edit = !row.edit"
                >
                  编辑
                </el-button>
                <el-button
                  icon="el-icon-delete"
                  size="small"
                  type="danger"
                  @click="deleteServiceRow(row.$index, protocolData, row)"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="el-table-edit-row" style="width: 99.2%">
            <span @click="addServieceRow()">+ 添加</span>
          </div>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="账号" name="third">
        <el-table
          ref="accountTable"
          border
          class="tb-edit"
          :data="accountList"
          highlight-current-row
          :row-class-name="tableRowClassName"
          row-key="id"
          @row-click="accountTableRowClick"
          @selection-change="setSelectRows"
        >
          <el-table-column
            align="center"
            show-overflow-tooltip
            type="selection"
            width="40"
          />
          <el-table-column
            align="center"
            label="#"
            show-overflow-tooltip
            width="40"
          >
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="账号名称"
            min-width="100px"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <template v-if="row.edit">
                <el-input v-model="row.name" />
              </template>
              <span v-else>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="密码"
            min-width="100px"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <template v-if="row.edit">
                <el-input v-model="row.password" type="password" />
              </template>
              <span v-else>{{ '*'.repeat((row.password, 6)) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="确认密码"
            min-width="100px"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <template v-if="row.edit">
                <el-input v-model="row.repassword" type="password" />
              </template>
              <span v-else>
                {{ '*'.repeat((row.repassword, 6)) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            show-overflow-tooltip
            width="200"
          >
            <template #default="{ row }">
              <el-button
                v-if="row.edit"
                size="small"
                type="success"
                @click="confirmEdit(row)"
              >
                保存
              </el-button>
              <el-button
                v-else
                icon="el-icon-edit"
                size="small"
                type="primary"
                @click="row.edit = !row.edit"
              >
                编辑
              </el-button>
              <el-button
                icon="el-icon-delete"
                size="small"
                type="danger"
                @click="deleteAccountRow(row.$index, accountList, row)"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="el-table-edit-row" style="width: 99.2%">
          <span @click="addAccountRow()">+ 添加</span>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {
    doEdit,
    doAdd,
    getProtocols,
    getDeviceService,
    getDeviceAccount,
    getDeviceType,
  } from '@/api/admin/device'
  import { getTree } from '@/api/admin/dgroup'

  export default {
    name: 'TableEdit',
    emits: ['fetch-data'],
    data() {
      return {
        hostShow: false,
        labelPosition: 'left',
        selectProtocolIds: [],
        defaultOptions: [
          {
            label: 'ssh',
            options: [
              {
                value: 'sftp',
                label: 'sftp',
              },
              {
                value: 'tcp',
                label: 'tcp',
              },
              {
                value: 'x11',
                label: 'x11',
              },
            ],
          },
          {
            label: 'rdp',
            options: [
              {
                value: 'clipboard',
                label: 'clipboard',
              },
              {
                value: 'file',
                label: 'file',
              },
              {
                value: 'audio',
                label: 'audio',
              },
              {
                value: 'ukey',
                label: 'ukey',
              },
            ],
          },
        ],
        osOptions: [
          {
            value: 'Windows',
            label: 'Windows',
            children: [
              {
                value: 'Windows 10',
                label: '10',
              },
              {
                value: 'Windows 8',
                label: '8',
              },
              {
                value: 'Windows 7',
                label: '7',
              },
              {
                value: 'Windows XP',
                label: 'XP',
              },
              {
                value: 'WinServer 2008',
                label: 'WinServer 2008',
              },
              {
                value: 'WinServer 2012',
                label: 'WinServer 2012',
              },
              {
                value: 'WinServer 2016',
                label: 'WinServer 2016',
              },
            ],
          },
          {
            value: 'Linux',
            label: 'Linux',
            children: [
              {
                value: 'Linux/Ubantu',
                label: 'Ubantu',
                children: [
                  {
                    value: 'Linux/Ubantu 18.04.3',
                    label: '18.04.3',
                  },
                ],
              },
              {
                value: 'Linux/CentOS',
                label: 'CentOS',
                children: [
                  {
                    value: 'Linux/CentOS 6',
                    label: '6',
                  },
                  {
                    value: 'Linux/CentOS 7',
                    label: '7',
                  },
                  {
                    value: 'Linux/CentOS 8',
                    label: '8',
                  },
                ],
              },
              {
                value: 'Linux/RedHat',
                label: 'RedHat',
                children: [
                  {
                    value: 'Linux/RedHat 6.8',
                    label: '6.8',
                  },
                ],
              },
              {
                value: 'Linux/Fedora',
                label: 'Fedora',
              },
              {
                value: 'Linux/中标麒麟',
                label: '中标麒麟',
                children: [
                  {
                    value: 'Linux/中标麒麟 5',
                    label: '5',
                  },
                ],
              },
            ],
          },
          {
            value: 'UNIX',
            label: 'UNIX',
            children: [
              {
                value: 'UNIX/FreeBSD',
                label: 'FreeBSD',
              },
            ],
          },
          {
            value: 'EXSI',
            label: 'EXSI',
            children: [
              {
                value: 'EXSI/7.0',
                label: '7.0',
              },
              {
                value: 'EXSI/6.0',
                label: '6.0',
              },
            ],
          },
          {
            value: '其它',
            label: '其它系统',
          },
        ],
        value: '',
        typeProps: {
          checkStrictly: true,
          emitPath: false,
          value: 'name',
          label: 'name',
          children: 'children',
        },
        serviceOptions: [
          {
            value: 'ssh',
            label: 'ssh',
          },
          {
            value: 'ftp',
            label: 'ftp',
          },
          {
            value: 'rdp',
            label: 'rdp',
          },
          {
            value: 'mysql',
            label: 'mysql',
          },
          {
            value: 'vnc',
            label: 'vnc',
          },
          {
            value: 'ngnix',
            label: 'ngnix',
          },
          {
            value: 'GMSSL',
            label: 'GMSSL',
          },
          {
            value: 'zabbix_agentd',
            label: 'zabbix_agentd',
          },
          {
            value: 'vpn',
            label: 'vpn',
          },
          {
            value: 'jupyter',
            label: 'jupyter',
          },
          {
            value: 'http',
            label: 'http',
          },
          {
            value: 'memcached',
            label: 'memcached',
          },
        ],
        groupList: [],
        typeList: [],
        protocolData: [],
        accountList: [],
        form: {
          name: '',
          ip: '',
        },
        optionProps: {
          checkStrictly: true,
          emitPath: false,
          value: 'id',
          label: 'name',
          children: 'children',
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请输入设备名称' },
          ],
          dgroup_id: [
            { required: true, trigger: 'blur', message: '请选择设备组' },
          ],
          ip: [{ required: true, trigger: 'blur', message: '请输入IP地址' }],
        },
        title: '',
        dialogFormVisible: false,
        flag: false,
      }
    },
    async created() {
      const { data } = await getTree({
        roleId: this.$store.getters['user/userId'],
      })
      this.groupList = data
      await getDeviceType().then((res) => {
        this.typeList = res.data
      })
      this.accountList.map((v) => {
        this.$set(v, 'edit', false)
        return v
      })
      this.protocolData.map((v) => {
        this.$set(v, 'edit', false)
        return v
      })
    },
    methods: {
      handleChange() {
        if (this.$refs.cascaderType.value == '虚拟机') this.hostShow = true
        else this.hostShow = false
      },
      setSelectRows(val) {
        this.getSelectProtocolIds(val)
      },
      tableRowClassName({ row, rowIndex }) {
        row.index = rowIndex
      },
      onTableRowClick(row) {
        this.$refs.protocolTable.clearSelection()
        this.$refs.protocolTable.toggleRowSelection(row)
      },
      accountTableRowClick(row) {
        this.$refs.accountTable.clearSelection()
        this.$refs.accountTable.toggleRowSelection(row)
      },
      getSelectProtocolIds(val) {
        const a = val.map((el) => el.id)
        this.selectProtocolIds = a //获取选中的菜单id组成列表
      },
      setProtocolTableSelected(id) {
        getProtocols({
          device_id: id,
        }).then((res) => {
          const list = res.data
          this.selectProtocolIds = list
          for (let index = 0; index < list.length; index++) {
            for (let i = 0; i < this.protocolData.length; i++) {
              if (this.protocolData[i].protocol_id == list[index].protocol_id) {
                this.protocolData[i].protocol_port = list[index].protocol_port
                this.toggleSelection(this.protocolData[i], true)
                break
              }
            }
          }
        })
      },
      toggleSelection(row, select) {
        if (row) {
          this.$nextTick(() => {
            this.$refs.protocolTable &&
              this.$refs.protocolTable.toggleRowSelection(row, select)
          })
        }
      },
      addServieceRow() {
        const j = {
          type: '',
          name: '',
          port: '',
          via_proxy: '',
          via_winserver: '',
          options: [],
          edit: false,
        }
        this.protocolData.push(j)
      },
      addAccountRow() {
        const k = { name: '', password: '', repassword: '', edit: false }
        this.accountList.push(k)
      },
      deleteServiceRow(index, rows, row) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          rows.splice(row.index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
      },
      deleteAccountRow(index, rows, row) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          rows.splice(row.index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
      },
      confirmEdit(row) {
        if (row.password != row.repassword) {
          row.repassword = ''
          this.$message({
            type: 'error',
            message: '两次密码不一致,请重新输入!',
          })
        } else {
          row.edit = false
          this.$message({
            type: 'success',
            message: '保存成功!',
          })
        }
      },
      // judge() {
      //   this.protocolData.forEach((item) => {
      //   })
      // },
      getDeviceData(id) {
        getDeviceService({
          device_id: id,
        }).then((res) => {
          res.data.forEach((item) => {
            item.options = item.options.split(',')
          })
          this.protocolData = res.data
        })
        getDeviceAccount({
          device_id: id,
        }).then((res) => {
          this.accountList = res.data
        })
      },
      showEdit(row) {
        if (!row) {
          this.flag = true
          this.title = '添加'
          this.accountList = []
          this.protocolData = []
        } else {
          this.flag = false
          this.title = '编辑'
          this.form = Object.assign({}, row)
          this.getDeviceData(row.id)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.$refs.protocolTable.clearSelection()
        this.$refs.protocolTable.clearFilter()
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid && this.flag) {
            const { msg } = await doAdd({
              from: this.form,
              services: this.protocolData,
              accounts: this.accountList,
            })
            this.$baseMessage(msg, 'success')
            this.$refs['form'].resetFields()
            this.$refs.protocolTable.clearSelection()
            this.$refs.accountTable.clearSelection()
            this.dialogFormVisible = false
            this.$emit('fetch-data')
            this.form = this.$options.data().form
          } else if (valid && !this.flag) {
            const { msg } = await doEdit({
              from: this.form,
              services: this.protocolData,
              accounts: this.accountList,
            })
            this.$baseMessage(msg, 'success')
            this.$refs['form'].resetFields()
            this.$refs.protocolTable.clearSelection()
            this.$refs.accountTable.clearSelection()
            this.dialogFormVisible = false
            this.$emit('fetch-data')
            this.form = this.$options.data().form
          } else {
            return false
          }
        })
      },
    },
  }
</script>
<style>
  .tb-edit .el-input {
    display: none;
  }
  .tb-edit .current-row .el-input {
    display: block;
  }
  .tb-edit .current-row .el-input + span {
    display: none;
  }
  .el-table-edit-row {
    margin-top: 10px;
    width: 100%;
    height: 34px;
    border: 1px dashed #c1c1cd;
    border-radius: 3px;
    cursor: pointer;
    justify-content: center;
    display: flex;
    line-height: 34px;
  }
</style>
