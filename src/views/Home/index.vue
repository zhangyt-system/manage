<template>
  <el-container class="container">
    <el-header class="header">
      <span @click="headerClick">电商后台管理系统</span>
      <el-button class="exit" @click="exitBtnClick">退出</el-button>
    </el-header>
    <el-container>
      <!-- 展开折叠模块 -->
      <el-aside :width="isCollapse?'94px':'200px'" class="aside" ref="aside">
        <div @click="toggleCollapse">
          <el-menu class="toggole" :collapse="this.isCollapse" :collapse-transition="false">|||</el-menu>
        </div>
        <el-menu
          class="el-menu-vert ical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="this.isCollapse"
          :collapse-transition="false"
          router
          default-active="2"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="it.path+''" v-for="it in item.children" :key="it.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{it.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconList: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      isCollapse: false
    };
  },
  created() {
    this.getMenus();
  },
  mounted() {
    console.log(this.$route.path);
  },
  methods: {
    headerClick() {
      this.$router.push("/home");
    },
    exitBtnClick() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/");
    },
    async getMenus() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) {
        return this.$message.error("获取列表失败！");
      }
      this.menuList = res.data;
      console.log(this.menuList);
    },
    //点击按钮，折叠打开侧边栏
    toggleCollapse() {
      this.isCollapse == true
        ? (this.isCollapse = false)
        : (this.isCollapse = true);
    }
  }
};
</script>

<style scoped>
.container {
  height: 100%;
}
.header {
  background-color: #363d40;
  font-size: 23px;
  font-weight: bold;
  padding-left: 23px;
  line-height: 52px;
  cursor: pointer;
}
.toggole {
  text-align: center;
  margin: 6px 0;
  line-height: 25px;
  font-size: 12px;
  letter-spacing: 0.5px;
  cursor: pointer;
  background-color: #3b4761;
  color: #fff;
  padding: 0 15px;
}
.el-menu {
  border: none;
}
.aside {
  background-color: #313743;
}
.main {
  background-color: #eaedf1;
}
.exit {
  float: right;
  margin-top: 10px;
}
.iconfont {
  padding: 15px;
}
</style>