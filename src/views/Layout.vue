<script lang=ts setup>
import {
  Calendar,
  Menu as IconMenu,
  User,
  UserFilled,
} from "@element-plus/icons-vue";
import instance from "@/utils/request.js";
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
//获取用户详细信息的接口
/* const userInfoService = (userId) => {
  return instance.get("/myCenter/myInfo", userId);
}; */
const userInfoService = (id:any) => {
  return instance.get("/user/getId",{params:{id}});
};
import useUserInfoStore from "@/stores/userInfo.js";
const userInfoStore = useUserInfoStore();
//调用函数，获取用户详细信息
const getUserInfo = async () => {
  //调用接口
  /////////////////////et result = await userInfoService(userId);
  //console.log("LayoutUserId:"+userInfoStore.info.userId);
  let result = await userInfoService(userInfoStore.info.userId);
  //console.log("resultUserName:"+result.data.userName)
  //数据存储到pinia中
  userInfoStore.setInfo(result.data);
};
getUserInfo();
</script>

<template>
  <div class="common-layout">
    <el-container class="layout-countainer">
      <el-aside width="200px" class="aside">
        <!--接下来为左侧-->
        <el-row class="tac">
          <el-col :span="24">
            <div class="avatar-text-container">
              <el-avatar :size="50" src="userInfoStore.info.avatarImg?userInfoStore.info.avatarImg:UserFilled" />
              <!-- <el-avatar :size="50" src="" /> -->
              <el-text class="grades">积分</el-text>
            </div>
            <!-- 还未连接，连接后删除 -->
            <el-text class="username">{{
              userInfoStore.info.userName
            }}</el-text>
            <el-text class="text">，你好!</el-text>
            <el-menu
              default-active="/main/plan/planpage"
              class="el-menu"
              @open="handleOpen"
              @close="handleClose"
              router
            >
              <el-sub-menu>
                <template #title>
                  <el-icon><Calendar /></el-icon>
                  <span>计划</span>
                </template>
                <el-menu-item index="/main/plan/planpage">日程</el-menu-item>
                <el-menu-item index="/main/plan/ai">AI</el-menu-item>
              </el-sub-menu>
              <el-menu-item index="/main/community/communitypage">
                <el-icon><icon-menu /></el-icon>
                <span>社区</span>
              </el-menu-item>
              <el-sub-menu>
                <template #title>
                  <el-icon><User /></el-icon>
                  <span>我的</span>
                </template>
                <el-menu-item index="/main/user/userinfo"
                  >个人资料</el-menu-item
                >
                <el-menu-item index="/main/user/userresetinfo"
                  >账号设置</el-menu-item
                >
                <el-menu-item index="/main/user/userpost"
                  >个人帖子</el-menu-item
                >
              </el-sub-menu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <!-- 中间区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.aside {
  background-color: white;
  height: 100vh;
}

.layout-container {
  height: 100%;
  .el-menu {
    border-right: none;
  }
}

.avatar-text-container {
  margin: 20px; /* 调整这个值来设置头像的位置 */
  align-items: center; /* 头像和文字垂直居中对齐 */
  //position: fixed;
  //top: 20px; /* 调整这个值以设置垂直位置 */
  //left: 20px; /* 调整这个值以设置水平位置 */
  /* 你也可以使用 bottom 和 left 来定位 */
}
.grades {
  //display: flex;
  //align-items: flex-start; /* 左对齐 */
  //flex-direction: column; /* 垂直排列 */
  //line-height: 50px;
  margin-left: 20px; /* 调整这个值以设置头像和文字之间的间距 */
  //white-space: pre-line; /* 保持换行符 */
  font-size: 24px;
  color: #ff0000; /* 设置积分文字的颜色，例如红色 */
}
.username {
  margin-left: 30px;
}
</style>
  