<template>
  <el-container class="layout-container">
    <!-- 侧边导航区域 -->
    <el-aside :width="iscollapse ? '50px' : '200px'">
      <app-aside></app-aside>
    </el-aside>
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>
          <i
            :class="{
              'el-icon-s-fold': iscollapse,
              'el-icon-s-unfold': !iscollapse
            }"
            @click="isfold"
          ></i>
          <span>今日头条</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img class="avatar" :src="user.photo" alt="" />
            <span class="el-dropdown-link"
              >{{ user.name }} <i class="el-icon-arrow-down el-icon--right"></i
            ></span>
          </div>
          <!-- <span>
            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </span> -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-user">设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-lock"
              ><i @click="logout">退出</i></el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <!-- 主题内容区域 -->

      <!-- 右侧内容 -->
      <el-main
        ><!-- 路由占位符 -->
        <router-view></router-view
      ></el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './component/aside'
import { getUserProfile } from '@/api/user'
export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  data() {
    return {
      iscollapse: false,
      user: {}
    }
  },
  created() {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile() {
      const res = await getUserProfile()
      // console.log(res)
      this.user = res.data.data
    },
    isfold() {
      this.iscollapse = !this.iscollapse
    },
    logout() {
      window.localStorage.removeItem('user')
      this.$router.push('/login')
      // console.log('11')
    }
  }
}
</script>

<style lang="less">
.layout-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  .el-header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    // background-color: pink;
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  .el-aside {
    background-color: #0a1f33;
    // height: 100%;
  }
}
</style>
