<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <div class="left">
          <img src="../assets/logo.png" alt="" />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '65px' : '200px'">
        <div class="toggle_bar" @click="isCollapse = !isCollapse">|||</div>
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          router
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 这里index的斜杠在二级里面不需要加，但是在二级跳到其他里面需要加，默认从根路径开始 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="getPath('/' + subItem.path)"
              ><i class="el-icon-menu"></i>{{ subItem.authName }}</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 子路由占位 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      menulist: [],
      // 定义字体对象
      iconObj: {
        // 定义的键是id值
        125: 'iconfont icon-user',
        101: 'iconfont icon-user',
        103: 'iconfont icon-user',
        102: 'iconfont icon-user',
        145: 'iconfont icon-user'
      },
      // 激活的项目菜单 就是高亮效果
      activePath: '',
      // 控制左侧菜单列表的折叠收缩 false是展开状态
      isCollapse: false
    }
  },
  // vue2中第二个钩子函数，就相当于页面一加载就调用渲染页面的函数
  created () {
    this.getMenus()
    this.activePath = sessionStorage.getItem('path')
  },
  methods: {
    // 退出功能
    async logout () {
      const res = await this.$confirm('确定退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(res)
      if (res !== 'confirm') {
        return this.$message.info('已取消退出')
      }
      // 当确定退出的时候 $message.success是eleui自带的消息提示
      this.$message.success('账号已退出')
      // 清除本地存储
      sessionStorage.clear()
      // 回到登录页面
      this.$router.push('/login')
    },
    async getMenus () {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取左侧列表失败')
      }
      this.$message.success('获取左侧列表成功')
      this.menulist = res.data
    },
    getPath (path) {
      this.activePath = path
      // 为了保证刷新后之前点击的链接还是高亮
      // 本地存储将激活的链接path信息保存
      sessionStorage.setItem('path', path)
    }
  }
}
</script>

<style lang='less' scoped>
.home_container {
  height: 100%;
}
.el-header {
  height: 50px;
  background-color: #333744;
  line-height: 50px;
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      width: 40px;
      height: 40px;
      vertical-align: middle;
    }
    span {
      font-size: 23px;
      color: #fff;
      margin-left: 15px;
    }
  }
}
.el-aside {
  height: 100%;
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle_bar {
  height: 20px;
  background-color: #4a5064;
  color: #fff;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
}
// 解决边框问题
.el-menu {
  border-right: 0;
}
</style>
