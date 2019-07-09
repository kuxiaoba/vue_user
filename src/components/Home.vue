<template>

<el-container  class="home-container">
    <!-- 头部 -->
  <el-header>
      <div>
          <img src="../assets/heima.png" alt="">
          <span>电商后台管理系统</span>
      </div>
       <el-button type="info" @click="cler">重置</el-button>
  </el-header>
  <!-- 页面主体 -->
  <el-container>
      <!-- 侧边栏 -->
    <el-aside :width="isCollapse ?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapase">|||</div>
        <!-- 导航菜单 -->
        <!-- unique-opened 只保持一个字导航展开 -->
        <!-- :router = "true" 为整个侧边栏开启路由模式 -->
                <el-menu :default-active="activePath" :router = "true" :unique-opened="true" background-color="#333744" text-color="#fff" active-text-color="yellow" :collapse="isCollapse"
                :collapse-transition="false">
                    <!-- 一级导航 -->
                    <el-submenu :index="item.id+ '' " v-for="item in menulist" :key="item.id">
                        <!-- 一级导航的模板 -->
                        <template slot="title">
                            <!-- 图标 -->
                             <!-- id对应的类 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级导航 -->
                        <!--   savaNavStare   -->
                        <el-menu-item :index="'/'+subitem.path+''" v-for="subitem in item.children" :key=subitem.id @click="savaNavStare('/'+subitem.path)  ">
                            <!-- 二级导航模板 -->
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subitem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>

    </el-aside>
    <!--右侧内容 -->
    <el-main>
        <!-- 路由占位符 -->
        <!-- welcome 的占位符 -->
        <router-view></router-view>
          </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
    data (){
        return {
            menulist:[],
            iconsObj:{
                // 把id当做key 字体图标当做值
                '125':'iconfont icon-user',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao' 
            },
            // 是否折叠
            isCollapse:false,
            // 被激活的链接地址
            activePath:''
        }
    },
  created (){
    //   调用方法
      this.getMenuList()
      this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    cler() {
      // 清空sessionStorage中保存toke n
      sessionStorage.clear()
      // 编程式导航跳转登录页
      this.$router.push('/login')
    },
    // 获取所有的菜单
   async getMenuList(){
          const {data: res} = await this.$http.get('menus')
          if(res.meta.status !==200) return this.$message.error(res.meta.msg)
          this.menulist = res.data
    },
    // 点击按钮切换菜单的折叠和展开
    toggleCollapase (){
        this.isCollapse = !this.isCollapse
    },
    //保存链接的激活状态
    savaNavStare(activePath){
        window.sessionStorage.setItem('activePath',activePath)
          this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {background-color: #333744;
.el-menu {
    border-right: none
}
}
.el-main {
    background-color: #eaedf1;
}
.iconfont {
    margin-right: 10px;
}
.toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
  cursor: pointer
}
</style>


