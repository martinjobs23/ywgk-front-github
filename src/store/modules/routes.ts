/**
 * @description 路由拦截状态管理，目前两种模式：all模式与intelligence模式，其中partialRoutes是菜单暂未使用
 */
import { asyncRoutes, constantRoutes, resetRouter } from '@/router'
import { convertRouter, filterRoutes } from '@/utils/routes'
import { authentication, rolesControl } from '@/config'
import { OptionType, RoutesModuleType } from '/#/store'
import { isArray } from '@/utils/validate'
import { getList } from '@/api/admin/router'
import { gp } from '@gp'
import { VabRouteRecord } from '/#/router'
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useRoutesStore = defineStore('routes', {
  state: (): RoutesModuleType => ({
    /**
     * 一级菜单值
     */
    tab: {
      data: undefined,
    },
    /**
     * 一级菜单
     */
    tabMenu: undefined,
    /**
     * 自定义激活菜单
     */
    activeMenu: {
      data: undefined,
    },
    /**
     * 一级菜单
     */
    routes: [],
  }),
  getters: {
    getTab: (state) => state.tab,
    getTabMenu: (state) =>
      state.tab.data
        ? state.routes.find((route) => route.name === state.tab.data)
        : { meta: { title: '' }, redirect: '404' },
    getActiveMenu: (state) => state.activeMenu,
    getRoutes: (state) =>
      state.routes.filter((_route) => _route.meta.hidden !== true),
    getPartialRoutes: (state) =>
      state.routes.find((route) => route.name === state.tab.data)?.children ||
      [],
  },
  actions: {
    clearRoutes() {
      this.routes = []
    },
    /**
     * @description 多模式设置路由
     * @param mode
     * @returns
     */
    async setRoutes(mode = 'none') {
      // 默认前端路由
      let routes = [...asyncRoutes]
      // 设置游客路由关闭路由拦截(不需要可以删除)
      const control = mode === 'visit' ? false : rolesControl
      // 设置后端路由(不需要可以删除)
      // 之前返回 {data:[]} 现在 {data:{list:[]}}
      if (authentication === 'all') {
        const userStore = useUserStore()
        const { userId } = storeToRefs(userStore)

        const { data } = await getList({ userId: userId.value })
        const list = data
        //转换格式，添加meta
        list.forEach((element: any) => {
          this.getMeta(element)
        })

        if (!isArray(list))
          gp.$baseMessage(
            '路由格式返回有误！',
            'error',
            'vab-hey-message-error'
          )
        if (list[list.length - 1].path !== '*')
          list.push({
            path: '/:pathMatch(.*)*',
            redirect: '/404',
            name: 'NotFound',
            meta: { hidden: true },
          })
        routes = convertRouter(list)
      }
      // 根据权限和rolesControl过滤路由
      const accessRoutes = filterRoutes([...constantRoutes, ...routes], control)
      // 设置菜单所需路由
      this.routes = JSON.parse(JSON.stringify(accessRoutes))
      // 根据可访问路由重置Vue Router
      await resetRouter(routes)
    },
    getMeta(element: any) {
      if (element.meta == undefined) {
        const meta = {
          title: element.title,
          icon: element.icon,
          affix: element.affix,
          permissions: element.permissions,
          badge: element.badge,
          dot: element.dot,
          hidden: element.hidden,
          levelHidden: element.levelHidden,
          isCustomSvg: element.isCustomSvg,
          noClosable: element.noClosable,
          noKeepAlive: element.noKeepAlive,
          tabHidden: element.tabHidden,
          dynamicNewTab: true,
        }

        element.meta = Object.assign(meta)
      }

      if (
        element.children !== undefined &&
        element.children !== null &&
        element.children
      ) {
        element.children.forEach((item: any) => {
          this.getMeta(item)
        })
      }
    },
    changeMenuMeta(options: OptionType) {
      function handleRoutes(routes: VabRouteRecord[]) {
        return routes.map((route) => {
          if (route.name === options.name)
            Object.assign(route.meta, options.meta)
          if (route.children && route.children.length)
            route.children = handleRoutes(route.children)
          return route
        })
      }
      this.routes = handleRoutes(this.routes)
    },
    /**
     * @description 修改 activeName
     * @param activeMenu 当前激活菜单
     */
    changeActiveMenu(activeMenu: string) {
      this.activeMenu.data = activeMenu
    },
  },
})
