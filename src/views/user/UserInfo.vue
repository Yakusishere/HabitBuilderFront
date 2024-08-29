<script lang="ts" setup>
import { onMounted, ref } from "vue";
import instance from "@/utils/request.js";
import useUserInfoStore from "@/stores/userInfo.js";

const userInfoStore = useUserInfoStore();
const planTableData = ref([]);
const eventTableData = ref([]);
const isEventFormVisible = ref(false);
const selectedPlanName = ref("");

const userInfoService = (id: any) => {
  return instance.get("/user/getId", { params: { id } });
};

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

const myPlanService = (userId) => {
  return instance.get("/plan/myPlan", { params: { userId } });
};
const getMyplan = async () => {
  let res;
  res = await myPlanService(userInfoStore.info.userId);
  if (res.code === 0) {
    console.log("获取我的计划成功");
    planTableData.value = res.data;
  } else {
    console.log("获取我的计划失败");
  }
};

const getPlanEventsService = (planId: number) => {
  return instance.get("/event/getPlanEvents", { params: { planId } });
};
const showPlanEvents = async (row, column, event) => {
  console.log("传入的planId:" + row.planId);
  selectedPlanName.value = row.title;
  console.log("设置selectedPlanName" + selectedPlanName.value);
  let res;
  res = await getPlanEventsService(row.planId);
  if (res.code === 0) {
    console.log("成功获取计划中的事件");
    eventTableData.value = res.data;
    isEventFormVisible.value = true;
  } else {
    console.log("获取事件失败");
  }
};

onMounted(() => {
  getUserInfo();
  getMyplan();
});
</script>

<template>
  <div class="profile-container">
    <div class="header">基本资料：</div>
    <div class="spacer"></div>
    <!-- 空行 -->
    <div class="profile-item">
      <el-text class="label">用户名：</el-text>
      <el-text class="value">
        {{ userInfoStore.info?.userName || "未获取到用户名" }}
      </el-text>
    </div>
    <div class="profile-item">
      <el-text class="label">积分：</el-text>
      <el-text class="value">
        {{ userInfoStore.info?.myScore || "未获取到积分" }}
      </el-text>
    </div>
    <div class="profile-item">
      <el-text class="label">积分细则：</el-text>
      <el-text class="value"
        >初始积分为100，完成一项计划加5分，未完成则减2分</el-text
      >
    </div>
    <div class="profile-item">
      <el-text class="label">计划：</el-text>
      <!-- <el-text class="value">计划名</el-text> -->
    </div>
    <el-table
      :data="planTableData"
      stripe
      height="350"
      style="width: 100%"
      @row-click="showPlanEvents"
    >
      <el-table-column prop="title" label="计划名称" width="200" />
      <el-table-column prop="description" label="计划内容" width="200" />
      <el-table-column prop="startDate" label="开始日期" />
        <el-table-column prop="endDate" label="结束日期" />
    </el-table>

    <el-dialog v-model="isEventFormVisible" width="800">
      <template #header>
        <div class="event-header">
          <h3>{{ selectedPlanName }}</h3>
        </div>
      </template>
      <el-table :data="eventTableData" height="400">
        <el-table-column prop="executionDate" label="事件日期" />
        <el-table-column prop="description" label="事件描述" />
      </el-table>
    </el-dialog>
  </div>
</template>

<style scoped>
.profile-container {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  width: 80vh;
  height: 80vh;
  margin: 0 auto;
  margin-top:2vh;
  text-align: center; /* 使容器中的文本居中 */
  background-color: #fcfaf2;
}

.header {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.event-header {
  display: flex;
  align-items: center;
}

.editPenIcon {
  left: 20;
}

.spacer {
  height: 20px; /* 设置空行的高度 */
}

.profile-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  text-align: left; /* 使每个项目内的文本对齐左侧 */
}

.label {
  font-size: 18px;
  color: #666;
}

.value {
  font-size: 12px;
  font-weight: bold;
  color: #333;
}
</style>