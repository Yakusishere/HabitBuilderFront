<script lang="ts" setup>
import { onMounted } from 'vue';
import instance from "@/utils/request.js";
import useUserInfoStore from "@/stores/userInfo.js";

const userInfoService = (id: any) => {
  return instance.get("/user/getId", { params: { id } });
};

const userInfoStore = useUserInfoStore();

const getUserInfo = async () => {
  // 检查 userInfoStore.info 是否存在
  if (!userInfoStore.info || !userInfoStore.info.userId) {
    console.error("User info or userId is null or undefined.");
    return;
  }

  console.log("LayoutUserId:" + userInfoStore.info.userId);
  try {
    let result = await userInfoService(userInfoStore.info.userId);
    console.log("resultUserName:" + result.data.userName);
    // 数据存储到 pinia 中
    userInfoStore.setInfo(result.data);
  } catch (error) {
    console.error("Failed to fetch user info:", error);
  }
};

onMounted(() => {
  getUserInfo();
});
</script>

<template>
  <el-text class="text1">基本资料：</el-text><br>
  <el-text class="text2">用户名：</el-text>
  <el-text class="username">
    {{ userInfoStore.info?.userName || '未获取到用户名' }}
  </el-text><br>
  <el-text class="text3">积分：</el-text>
  <el-text class="grades">
    {{ userInfoStore.info?.myScore || '未获取到积分' }}
  </el-text><br>
  <el-text class="text4">积分细则：</el-text>
  <el-text class="gradesDetails">1200</el-text><br>
  <el-text class="text5">计划：</el-text>
  <el-text class="gradesDetails">计划名</el-text><br>
</template>


