const testdata1 = [
  {
    path: '/',
    name: 'Root',
    component: 'Layout',
    meta: {
      title: '首页',
      icon: 'home-2-line',
      breadcrumbHidden: true,
    },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: '@/views/index/index',
        meta: {
          title: '首页',
          icon: 'home-2-line',
          noClosable: true,
        },
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: '@/views/index/dashboard',
        meta: {
          title: '看板',
          icon: 'dashboard-line',
        },
      },
      {
        path: 'workbench',
        name: 'Workbench',
        component: '@/views/index/workbench',
        meta: {
          title: '工作台',
          icon: 'settings-6-line',
          dot: true,
        },
      },
      {
        path: 'store',
        name: 'Store',
        component: '@/views/index/store',
        meta: {
          title: '仓库',
          icon: 'app-store-line',
          dot: true,
        },
      },
    ],
  },
  {
    path: '/admin',
    name: 'setting',
    component: 'Layout',
    meta: {
      title: '配置',
      icon: 'user-settings-line',
      guard: ['Admin'],
    },
    children: [
      {
        path: '/admin/person',
        name: 'person',
        component: '@/views/admin/person/index',
        meta: {
          title: '个人中心',
          icon: 'map-pin-user-line',
        },
      },
      {
        path: '/admin/user',
        name: 'user',
        component: '@/views/admin/user/index',
        meta: {
          title: '用户管理',
          icon: 'user-3-line',
        },
      },
      {
        path: '/admin/role',
        name: 'role',
        component: '@/views/admin/role/index',
        meta: {
          title: '角色管理',
          icon: 'admin-line',
        },
      },
      {
        path: '/admin/org',
        name: 'org',
        component: '@/views/admin/org/index',
        meta: {
          title: '部门管理',
          icon: 'group-line',
        },
      },
      {
        path: '/admin/menu',
        name: 'menu',
        component: '@/views/admin/menu/index',
        meta: {
          title: '菜单管理',
          icon: 'menu-2-fill',
        },
      },
      {
        path: 'dictionaryManagement',
        name: 'DictionaryManagement',
        component: '@/views/admin/dictionaryManagement/index',
        meta: {
          title: '字典管理',
          icon: 'book-2-line',
          dot: true,
        },
      },
      {
        path: 'taskManagement',
        name: 'TaskManagement',
        component: '@/views/admin/taskManagement/index',
        meta: {
          title: '任务管理',
          icon: 'task-line',
          badge: 'New',
        },
      },
      {
        path: 'systemLog',
        name: 'SystemLog',
        component: '@/views/admin/systemLog/index',
        meta: {
          title: '系统日志',
          icon: 'file-shield-2-line',
        },
      },
    ],
  },
  {
    path: '/device',
    name: 'device',
    component: 'Layout',
    meta: {
      title: '设备管理',
      icon: 'external-link-line',
      guard: ['Admin'],
      noColumn: true,
    },
    children: [
      {
        path: '/device/dgroupManagement',
        name: 'dgroupManagement',
        component: '@/views/device/dgroupManagement/index',
        meta: {
          title: '设备分组',
          icon: 'group-line',
        },
      },
      {
        path: '/device/deviceManagement',
        name: 'deviceManagement',
        component: '@/views/device/deviceManagement/index',
        meta: {
          title: '设备管理',
          icon: 'menu-2-fill',
        },
      },
    ],
  },
  {
    path: '/ipam',
    name: 'ipam',
    component: 'Layout',
    meta: {
      title: 'IP地址管理',
      icon: 'user-settings-line',
      guard: ['Admin'],
    },
    children: [
      {
        path: '/ipam/subnet',
        name: 'subnetManagement',
        component: '@/views/ipam/subnet/index',
        meta: {
          title: '网段规划',
          icon: 'map-pin-user-line',
        },
      },
      {
        path: '/ipam/alloc',
        name: 'ipalloc',
        component: '@/views/ipam/alloc/index',
        meta: {
          title: 'IP分配',
          icon: 'admin-line',
        },
      },
      {
        path: '/ipam/online',
        name: 'onlineManagement',
        component: '@/views/ipam/online/index',
        meta: {
          title: '在线状态',
          icon: 'admin-line',
        },
      },
      {
        path: '/ipam/nat',
        name: 'natManagement',
        component: '@/views/ipam/nat/index',
        meta: {
          title: 'NAT设置',
          icon: 'book-2-line',
          dot: true,
        },
      },
      {
        path: '/ipam/collect',
        name: 'collectManagement',
        component: '@/views/ipam/collect/index',
        meta: {
          title: '地址采集',
          icon: 'task-line',
          badge: 'New',
        },
      },
    ],
  },
]

const testdata2 = [
  {
    id: 498,
    pid: 0,
    sort: null,
    name: 'TerminalGroup',
    title: '终端组管理',
    path: '/terminalGroup',
    redirect: 'noRedirect',
    component: 'Layout',
    icon: 'desktop',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 483,
    pid: 2,
    sort: null,
    name: 'Ordermanegement',
    title: '工单管理',
    path: '/admin/ordermanegement',
    redirect: null,
    component: '@/views/admin/workTicket/index',
    icon: 'desktop',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 437,
    pid: 421,
    sort: null,
    name: 'AssetAcqu',
    title: '资产采集',
    path: '/asset/acqu',
    redirect: null,
    component: '@/views/desktop/asset/acquisition/index',
    icon: 'desktop',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 513,
    pid: 436,
    sort: null,
    name: 'SiteVisitEdit',
    title: '网站访问策略',
    path: '/policy/SiteVisitEdit',
    redirect: null,
    component: '@/views/desktop/policy/SiteVisitPolicy/index',
    icon: 'paperclip',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 508,
    pid: 436,
    sort: null,
    name: 'IPAddrEdit',
    title: 'IP地址采集策略',
    path: '/policy/IPAddrEdit',
    redirect: null,
    component: '@/views/desktop/policy/IPAddr/index',
    icon: 'paperclip',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 505,
    pid: 436,
    sort: null,
    name: 'assetsEdit',
    title: '资产采集策略',
    path: '/policy/assetsEdit',
    redirect: null,
    component: '@/views/desktop/policy/assetsEdit/index',
    icon: 'paperclip',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 524,
    pid: 449,
    sort: null,
    name: 'IllegalOutreach',
    title: '违规外联记录',
    path: '/systemlog/illegaloutreach',
    redirect: null,
    component: '@/views/desktop/systemLog/illegalOutreach/index',
    icon: 'desktop',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 522,
    pid: 449,
    sort: null,
    name: 'WebVisit',
    title: '网站访问记录',
    path: '/systemlog/webvisit',
    redirect: null,
    component: '@/views/desktop/systemLog/webVisit/index',
    icon: 'desktop',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 453,
    pid: 449,
    sort: null,
    name: 'DistributePolicy',
    title: '策略下发记录',
    path: '/systemlog/distributepolicylog',
    redirect: null,
    component: '@/views/desktop/systemLog/DistributePolicy/index',
    icon: 'desktop',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 455,
    pid: 449,
    sort: null,
    name: 'InstructionIssuanceLog',
    title: '指令下发记录',
    path: '/systemlog/Instructionissuance',
    redirect: null,
    component: '@/views/desktop/systemLog/instructionIssuance/index',
    icon: 'desktop',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 456,
    pid: 449,
    sort: null,
    name: 'UserOperationLog',
    title: '用户操作记录',
    path: '/systemlog/Useroperationrecord',
    redirect: null,
    component: '@/views/desktop/systemLog/userOperationLog/index',
    icon: 'user',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 458,
    pid: 449,
    sort: null,
    name: 'SoftLibMaintenance',
    title: '软件库维护记录',
    path: '/systemlog/Softwarelibrarymaintenancelog',
    redirect: null,
    component: '@/views/desktop/systemLog/softLibMaintenance/index',
    icon: 'paperclip',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 460,
    pid: 449,
    sort: null,
    name: 'SoftwareDistribute',
    title: '软件分发记录',
    path: '/systemlog/Softwaredistributionrecord',
    redirect: null,
    component: '@/views/desktop/systemLog/softwareDistribute/index',
    icon: 'paperclip',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 482,
    pid: 463,
    sort: null,
    name: 'SoftInstallStatistics',
    title: '软件安装统计',
    path: '/statistics/softwareInstallionstatistics',
    redirect: null,
    component: '@/views/desktop/statistics/softInstall/index',
    icon: 'paperclip',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 467,
    pid: 463,
    sort: null,
    name: 'terminalalarmanalysis',
    title: '终端告警统计',
    path: '/Statistics/terminalalarm',
    redirect: null,
    component: '@/views/desktop/statistics/terminalAlarm/index',
    icon: 'desktop',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 469,
    pid: 463,
    sort: null,
    name: 'SoftDistribute',
    title: '软件分发统计',
    path: '/statistics/softwaredistrsbution',
    redirect: null,
    component: '@/views/desktop/statistics/softDistribute/index.vue',
    icon: 'paperclip',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 470,
    pid: 463,
    sort: null,
    name: 'Filedistrabute',
    title: '文件分发统计',
    path: '/statistics/filedistrabution',
    redirect: null,
    component: '@/views/desktop/statistics/fileDistribute/index.vue',
    icon: 'server',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 471,
    pid: 463,
    sort: null,
    name: 'Terminalusage',
    title: '终端使用情况统计',
    path: '/Statistics/trerminalusage',
    redirect: null,
    component: '@/views/desktop/statistics/terminalUse/index',
    icon: 'desktop',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 473,
    pid: 463,
    sort: null,
    name: 'Orderstatistics',
    title: '工单统计',
    path: '/statistics/orderstatistics',
    redirect: null,
    component: '@/views/desktop/statistics/workingTicket/index',
    icon: 'server',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 480,
    pid: 463,
    sort: null,
    name: 'SystemType',
    title: '操作系统类型统计',
    path: '/statistics/systemtypestatistics',
    redirect: null,
    component: '@/views/desktop/statistics/systemType/index.vue',
    icon: 'indent',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 493,
    pid: 492,
    sort: null,
    name: 'startupManagement',
    title: '启动项管理',
    path: '/terminal/startupManagement',
    redirect: null,
    component: '@/views/desktop/terminalManagement/startup/index',
    icon: 'paperclip',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 494,
    pid: 492,
    sort: null,
    name: 'processMonitoring',
    title: '进程监控',
    path: '/terminal/processMonitoring',
    redirect: null,
    component: '@/views/desktop/terminalManagement/processMonitoring/index',
    icon: 'paperclip',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 497,
    pid: 492,
    sort: null,
    name: 'terminalStatus',
    title: '终端状态',
    path: '/terminal/terminalStatus',
    redirect: null,
    component: '@/views/desktop/terminalManagement/terminalStatus/index.vue',
    icon: 'paperclip',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 531,
    pid: 492,
    sort: null,
    name: 'TerminalAudit',
    title: '证书申请审核',
    path: '/termianl/audit',
    redirect: null,
    component: '@/views/desktop/certService/index',
    icon: 'indent',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 1,
    pid: 0,
    sort: 0,
    name: 'Default',
    title: '默认隐藏页',
    path: '/',
    redirect: 'index',
    component: 'Layout',
    icon: 'desktop',
    badge: null,
    hidden: 1,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 2,
    pid: 0,
    sort: 1,
    name: 'Sys',
    title: '系统管理',
    path: '/sys',
    redirect: 'noRedirect',
    component: 'Layout',
    icon: 'desktop',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 6,
    pid: 1,
    sort: 1,
    name: 'Index',
    title: '首页',
    path: 'index',
    redirect: null,
    component: '@/views/admin/dashboard/index',
    icon: 'home',
    badge: 'New',
    hidden: null,
    fixed: 1,
    alwaysShow: 0,
    description: null,
    disabled: null,
  },
  {
    id: 7,
    pid: 2,
    sort: 1,
    name: 'MenuManagement',
    title: '菜单管理',
    path: '/admin/menu',
    redirect: null,
    component: '@/views/admin/menu/index',
    icon: 'menu-2-fill',
    badge: 'New',
    hidden: null,
    fixed: 0,
    alwaysShow: 0,
    description: null,
    disabled: null,
  },
  {
    id: 14,
    pid: 4,
    sort: 1,
    name: 'UserManagement2',
    title: '页面管理',
    path: '/vpn/page',
    redirect: null,
    component: '@/views/admin/user/index',
    icon: 'id-card',
    badge: 'New',
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 16,
    pid: 5,
    sort: 1,
    name: 'Error401',
    title: '401',
    path: '401',
    redirect: null,
    component: '@/views/admin/401',
    icon: 'bug',
    badge: 'New',
    hidden: 1,
    fixed: 0,
    alwaysShow: 0,
    description: null,
    disabled: null,
  },
  {
    id: 370,
    pid: 366,
    sort: 1,
    name: 'DGroupAuthorization',
    title: '设备组授权',
    path: '/auth/dgroup',
    redirect: null,
    component: '@/views/admin/roleDgroup/index',
    icon: 'laptop',
    badge: null,
    hidden: null,
    fixed: 0,
    alwaysShow: 0,
    description: null,
    disabled: null,
  },
  {
    id: 441,
    pid: 421,
    sort: 1,
    name: 'ComputerAssets',
    title: '计算机',
    path: '/asset/computer',
    redirect: null,
    component: '@/views/desktop/asset/computer/index',
    icon: 'desktop',
    badge: '',
    hidden: null,
    fixed: 0,
    alwaysShow: 0,
    description: null,
    disabled: null,
  },
  {
    id: 423,
    pid: 422,
    sort: 1,
    name: 'IPStatistics',
    title: '地址统计',
    path: '/ip/statistics',
    redirect: null,
    component: '@/views/desktop/IPAddrManagement/addrStatistics/index',
    icon: 'paperclip',
    badge: 'New',
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 428,
    pid: 426,
    sort: 1,
    name: 'SoftwareInstallation',
    title: '软件视图',
    path: '/soft/install',
    redirect: null,
    component: '@/views/desktop/soft/index',
    icon: 'id-card',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 452,
    pid: 449,
    sort: 1,
    name: 'SoftwareInstall',
    title: '软件安装卸载',
    path: '/syslog/softinstallionlog',
    redirect: '',
    component: '@/views/desktop/systemLog/softwareInstall/index',
    icon: 'paperclip',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 454,
    pid: 451,
    sort: 1,
    name: 'InstallPackageManagement',
    title: '安装包管理',
    path: '/securityComponent/installPackageManagement',
    redirect: null,
    component:
      '@/views/desktop/securityComponent/installPackageManagement/index',
    icon: 'paperclip',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 532,
    pid: 486,
    sort: 1,
    name: 'MeetingRoomManagement',
    title: '会议室管理',
    path: '/meetingRoom',
    redirect: null,
    component: '@/views/desktop/meetingRoom/index',
    icon: 'id-card',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 504,
    pid: 492,
    sort: 1,
    name: 'MessagePush',
    title: '消息推送',
    path: '/terminal/messagePush',
    redirect: null,
    component: '@/views/desktop/messagePush/index',
    icon: 'paper-plane',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 528,
    pid: 527,
    sort: 1,
    name: 'FireWallOperation',
    title: '安全处置日志',
    path: '/safe/fireWallOperation',
    redirect: null,
    component: '@/views/desktop/fireWallOperation/index',
    icon: 'server',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 366,
    pid: 0,
    sort: 2,
    name: 'Layout',
    title: '授权管理',
    path: '/auth',
    redirect: 'noRedirect',
    component: 'Layout',
    icon: 'user-lock',
    badge: null,
    hidden: null,
    fixed: 0,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 8,
    pid: 2,
    sort: 2,
    name: 'OrganizationManagement',
    title: '组织机构',
    path: '/admin/org',
    redirect: null,
    component: '@/views/admin/org/index',
    icon: 'group-line',
    badge: 'New',
    hidden: null,
    fixed: 0,
    alwaysShow: 0,
    description: null,
    disabled: null,
  },
  {
    id: 18,
    pid: 4,
    sort: 2,
    name: 'RoleManagement2',
    title: '内网访问',
    path: '/vpn/access',
    redirect: null,
    component: '@/views/admin/role/index',
    icon: 'paper-plane',
    badge: 'New',
    hidden: null,
    fixed: 0,
    alwaysShow: 0,
    description: null,
    disabled: null,
  },
  {
    id: 17,
    pid: 5,
    sort: 2,
    name: 'Error404',
    title: '404',
    path: '/404',
    redirect: null,
    component: '@/views/admin/404',
    icon: 'bug',
    badge: 'New',
    hidden: 1,
    fixed: 0,
    alwaysShow: 0,
    description: null,
    disabled: null,
  },
  {
    id: 368,
    pid: 366,
    sort: 2,
    name: 'MenuAuthorization',
    title: '菜单授权',
    path: '/auth/menuAuth',
    redirect: null,
    component: '@/views/admin/roleMenu/index',
    icon: 'list',
    badge: 'New',
    hidden: null,
    fixed: 0,
    alwaysShow: 0,
    description: null,
    disabled: null,
  },
  {
    id: 442,
    pid: 421,
    sort: 2,
    name: 'USBAssets',
    title: '移动存储介质',
    path: '/asset/usb',
    redirect: '',
    component: '@/views/desktop/asset/usb/index',
    icon: 'layer-group',
    badge: '',
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 425,
    pid: 422,
    sort: 2,
    name: 'IPAssignment',
    title: '地址分配',
    path: '/ip/assignment',
    redirect: null,
    component: '@/views/desktop/IPAddrManagement/addrAssign/index',
    icon: 'user-circle',
    badge: 'New',
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 429,
    pid: 426,
    sort: 2,
    name: 'TerminalInformation',
    title: '终端视图',
    path: '/soft/terminal',
    redirect: null,
    component: '@/views/desktop/terminal/index',
    icon: 'desktop',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 434,
    pid: 430,
    sort: 2,
    name: 'SoftwareDistribution',
    title: '软件分发',
    path: '/sendsoft/distribute',
    redirect: null,
    component: '@/views/desktop/SoftDistribute/index',
    icon: 'paper-plane',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 457,
    pid: 451,
    sort: 2,
    name: 'SecurityComponentSetting',
    title: '安全组件设置',
    path: '/securityComponent/securityComponentSetting',
    redirect: null,
    component: '@/views/desktop/securityComponent/setting/index',
    icon: 'paperclip',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 525,
    pid: 486,
    sort: 2,
    name: 'ConferenceManage',
    title: '会议管理',
    path: '/conference/index',
    redirect: null,
    component: '@/views/desktop/conference/index',
    icon: 'paper-plane',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 436,
    pid: 0,
    sort: 3,
    name: 'PolicyManagement',
    title: '策略管理',
    path: '/policy',
    redirect: 'noRedirect',
    component: 'Layout',
    icon: 'play',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 9,
    pid: 2,
    sort: 3,
    name: 'UserManagement',
    title: '用户管理',
    path: '/admin/user',
    redirect: null,
    component: '@/views/admin/user/index',
    icon: 'id-card',
    badge: 'New',
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 19,
    pid: 4,
    sort: 3,
    name: 'MenuManagement2',
    title: '远程桌面',
    path: '/vpn/rdp',
    redirect: null,
    component: '@/views/admin/menu/index',
    icon: 'desktop',
    badge: 'New',
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 367,
    pid: 366,
    sort: 3,
    name: 'userAuth',
    title: '用户授权',
    path: '/auth/userAuth',
    redirect: null,
    component: '@/views/admin/roleUser/index',
    icon: 'user',
    badge: null,
    hidden: null,
    fixed: 0,
    alwaysShow: 0,
    description: null,
    disabled: null,
  },
  {
    id: 500,
    pid: 421,
    sort: 3,
    name: 'Printer',
    title: '办公自动化设备',
    path: '/asset/printer',
    redirect: null,
    component: '@/views/desktop/asset/printer/index',
    icon: 'layer-group',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 431,
    pid: 426,
    sort: 3,
    name: 'SoftwareUsage',
    title: '软件使用统计',
    path: '/soft/usage',
    redirect: null,
    component: '@/views/desktop/SoftRecord/index',
    icon: 'edit',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 439,
    pid: 436,
    sort: 3,
    name: 'InterViolationPolicy',
    title: '违规外联策略',
    path: '/policy/interViolation',
    redirect: null,
    component: '@/views/desktop/policy/interViolation/index',
    icon: 'user-lock',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 459,
    pid: 451,
    sort: 3,
    name: 'SecurityPolicy',
    title: '安全策略',
    path: '/securityComponent/securityPolicy',
    redirect: null,
    component: '@/views/desktop/securityComponent/securityPolicy/index',
    icon: 'server',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 487,
    pid: 486,
    sort: 3,
    name: 'FileClean',
    title: '资料分发',
    path: '/file/filedistribute',
    redirect: null,
    component: '@/views/desktop/fileDistribute/index',
    icon: 'paper-plane',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 4,
    pid: 0,
    sort: 4,
    name: 'SA',
    title: '安全接入',
    path: '/sa',
    redirect: 'index2',
    component: 'Layout',
    icon: 'desktop',
    badge: 'New',
    hidden: null,
    fixed: 0,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 421,
    pid: 0,
    sort: 4,
    name: 'AssetsManagement',
    title: '资产台账',
    path: '/asset',
    redirect: 'noRedirect',
    component: 'Layout',
    icon: 'id-card',
    badge: 'New',
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 25,
    pid: 2,
    sort: 4,
    name: 'RoleManagement',
    title: '角色管理',
    path: '/admin/role',
    redirect: null,
    component: '@/views/admin/role/index',
    icon: 'user-circle',
    badge: 'New',
    hidden: null,
    fixed: 0,
    alwaysShow: 0,
    description: null,
    disabled: null,
  },
  {
    id: 15,
    pid: 4,
    sort: 4,
    name: 'Permission2',
    title: '远程控制',
    path: '/vpn/remote',
    redirect: null,
    component: '@/views/vab/permissions/index',
    icon: 'play',
    badge: 'New',
    hidden: null,
    fixed: 0,
    alwaysShow: 0,
    description: null,
    disabled: null,
  },
  {
    id: 369,
    pid: 366,
    sort: 4,
    name: '123222',
    title: '接口授权',
    path: '/auth/apiAuth',
    redirect: null,
    component: '@/views/admin/roleApi/index',
    icon: 'key',
    badge: null,
    hidden: null,
    fixed: 0,
    alwaysShow: 0,
    description: null,
    disabled: null,
  },
  {
    id: 501,
    pid: 421,
    sort: 4,
    name: 'AudioVideo',
    title: '声像设备',
    path: '/asset/audio_video',
    redirect: '',
    component: '@/views/desktop/asset/audio_video/index',
    icon: 'layer-group',
    badge: '',
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 440,
    pid: 436,
    sort: 4,
    name: 'SiteVisitPolicy',
    title: '网站访问策略',
    path: '/policy/siteVisit',
    redirect: null,
    component: '@/views/admin/authPolicy/index',
    icon: 'layer-group',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 450,
    pid: 449,
    sort: 4,
    name: 'TerminalRegisterLog',
    title: '终端注册日志',
    path: '/systemlog/terminairegistrationlog',
    redirect: null,
    component: '@/views/desktop/systemLog/terminalRegisterLog/index',
    icon: 'desktop',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 461,
    pid: 451,
    sort: 4,
    name: 'ReleaseStatus',
    title: '版本状况',
    path: '/securityComponent/version',
    redirect: null,
    component: '@/views/desktop/securityComponent/version/index',
    icon: 'indent',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 491,
    pid: 486,
    sort: 4,
    name: 'DistributeRecord',
    title: '分发记录',
    path: '/file/record',
    redirect: null,
    component: '@/views/desktop/distributeRecord/index',
    icon: 'indent',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 5,
    pid: 0,
    sort: 5,
    name: 'Error',
    title: '动态菜单4-错误页',
    path: '/error',
    redirect: 'noRedirect',
    component: 'EmptyLayout',
    icon: 'bug',
    badge: 'New',
    hidden: 1,
    fixed: 0,
    alwaysShow: 0,
    description: null,
    disabled: null,
  },
  {
    id: 502,
    pid: 421,
    sort: 5,
    name: 'Server',
    title: '信息系统',
    path: '/asset/server',
    redirect: '',
    component: '@/views/desktop/asset/server/index',
    icon: 'layer-group',
    badge: '',
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 523,
    pid: 449,
    sort: 5,
    name: 'LogExport',
    title: '日志导出',
    path: '/systemlog/logExport',
    redirect: null,
    component: '@/views/desktop/systemLog/logExport/index',
    icon: 'desktop',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 488,
    pid: 463,
    sort: 5,
    name: 'AssetStatistics',
    title: '资产统计',
    path: '/statistics/asset',
    redirect: null,
    component: '@/views/desktop/statistics/assets/index',
    icon: 'desktop',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 529,
    pid: 486,
    sort: 5,
    name: 'CleanRecord',
    title: '清理记录',
    path: '/file/cleanRecord',
    redirect: null,
    component: '@/views/desktop/cleanRecord/index',
    icon: 'indent',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 37,
    pid: 2,
    sort: 6,
    name: 'gerenzhongxin',
    title: '个人中心',
    path: '/personalcenter',
    redirect: null,
    component: '@/views/admin/user/components/PersonalCenter',
    icon: 'desktop',
    badge: null,
    hidden: 1,
    fixed: 0,
    alwaysShow: 0,
    description: null,
    disabled: null,
  },
  {
    id: 503,
    pid: 421,
    sort: 6,
    name: 'NetworkDevice',
    title: '网络设备',
    path: '/asset/network',
    redirect: '',
    component: '@/views/desktop/asset/network/index',
    icon: 'layer-group',
    badge: '',
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 499,
    pid: 498,
    sort: 6,
    name: 'TerminalGroupManagement',
    title: '终端组管理',
    path: '/terminalGroup',
    redirect: null,
    component: '@/views/desktop/terminalGroup/index',
    icon: 'indent',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 422,
    pid: 0,
    sort: 7,
    name: 'IPManagement',
    title: 'IP地址管理',
    path: '/ip',
    redirect: 'noRedirect',
    component: 'Layout',
    icon: 'user-lock',
    badge: 'New',
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 400,
    pid: 2,
    sort: 7,
    name: 'UserCenter',
    title: '用户中心',
    path: '/userCenter',
    redirect: null,
    component: '@/views/admin/user/components/UserCenter',
    icon: 'edit',
    badge: null,
    hidden: 1,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 26,
    pid: 2,
    sort: 7,
    name: 'ApiManagement',
    title: '接口管理',
    path: '/admin/api',
    redirect: null,
    component: '@/views/admin/api/index',
    icon: 'paperclip',
    badge: 'New',
    hidden: null,
    fixed: 0,
    alwaysShow: 0,
    description: null,
    disabled: null,
  },
  {
    id: 426,
    pid: 0,
    sort: 8,
    name: 'SoftwareManagement',
    title: '软件管理',
    path: '/soft',
    redirect: 'noRedirect',
    component: 'Layout',
    icon: 'building',
    badge: 'New',
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 408,
    pid: 2,
    sort: 8,
    name: 'AuthPolicyManagement',
    title: '认证策略',
    path: '/admin/authPolicy',
    redirect: null,
    component: '@/views/admin/authPolicy/index',
    icon: 'paperclip',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 430,
    pid: 0,
    sort: 9,
    name: 'SoftwareDistribution',
    title: '软件分发',
    path: '/sendsoft',
    redirect: 'noRedirect',
    component: 'Layout',
    icon: 'paperclip',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 486,
    pid: 0,
    sort: 9,
    name: 'File',
    title: '会议资料分发',
    path: '/file',
    redirect: 'noRedirect',
    component: 'Layout',
    icon: 'file',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 492,
    pid: 0,
    sort: 10,
    name: null,
    title: '终端管理',
    path: '/terminal',
    redirect: 'noRedirect',
    component: 'Layout',
    icon: 'paperclip',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 449,
    pid: 0,
    sort: 11,
    name: 'SystemLog',
    title: '系统日志',
    path: '/systemlog',
    redirect: 'noRedirect',
    component: 'Layout',
    icon: 'indent',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 451,
    pid: 0,
    sort: 12,
    name: 'SecurityComponentManagement',
    title: '安全组件管理',
    path: '/securitycomponent',
    redirect: 'noRedirect',
    component: 'Layout',
    icon: 'paperclip',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 463,
    pid: 0,
    sort: 13,
    name: 'Statistics',
    title: '统计分析',
    path: '/statistics',
    redirect: 'noRedirect',
    component: 'Layout',
    icon: 'server',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
  {
    id: 527,
    pid: 0,
    sort: 20,
    name: 'SafeOperation',
    title: '安全处置',
    path: '/safe',
    redirect: 'noRedirect',
    component: 'Layout',
    icon: 'indent',
    badge: null,
    hidden: null,
    fixed: null,
    alwaysShow: null,
    description: null,
    disabled: null,
  },
]

module.exports = [
  {
    url: '/menu/getPermissions',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: 'success',
        data: testdata1,
      }
    },
  },
  {
    url: '/menu/navigate',
    type: 'post',
    response: (req) => {
      const {
        option = '',
        condition = '',
        pageNow = 1,
        pageSize = 100,
      } = req.body
      const mockList = testdata2.filter((item) => {
        if (condition === '') return true
        if (option === '' || option === '*') {
          return (
            (item.title && item.title.indexOf(condition) >= 0) ||
            (item.name && item.name.indexOf(condition) >= 0) ||
            (item.component && item.component.indexOf(condition) >= 0) ||
            (item.path && item.path.indexOf(condition) >= 0)
          )
        } else {
          return true
        }
      })
      const list = mockList.filter(
        (item, index) =>
          index < pageSize * pageNow && index >= pageSize * (pageNow - 1)
      )
      return {
        code: 201,
        msg: 'ok',
        data: list,
      }
    },
  },
  {
    url: '/menu/insert',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟保存成功',
      }
    },
  },
  {
    url: '/menu/update',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟保存成功',
      }
    },
  },
  {
    url: '/menu/delete',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟删除成功',
      }
    },
  },
]
