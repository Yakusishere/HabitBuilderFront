<script setup>

import { ref, computed, onMounted } from 'vue';
import instance from '@/utils/request';

const todayEvents = ref({
  "code": 0,
  "message": "操作成功",
  "data": []
})
const type = ref({
  "code": 0,
  "message": "操作成功",
  "data": []
})

//日期
const dateValue = ref(new Date());
//日期转换为string
const formattedValue = computed(() => {
  const date = dateValue.value;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
});



// dailyEvent接口和dailyPlanType接口
// dailyEvent: 传入日期，传回这天所有的事件
// dailyPlanType: 传入日期，传回这天所有的事件名称
const getDailyEvent = (date) => {
  return instance.get('/plan/dailyEvent', { params: { date } })
}
const getType = (date) => {
  return instance.get('/plan/dailyPlanType', { params: { date } })
}
//清除选项框
const optionValue = ref('所有计划')
const clearOptions = () => {
  type.value = {
    "code": 0,
    "message": "操作成功",
    "data": []
  }
}
//点击时获取每日计划
const getDailyEventOnClick = async () => {
  try {
    todayEvents.value = await getDailyEvent(formattedValue.value);
    type.value = await getType(formattedValue.value);
    updateAllDailyEvents();
    optionValue.value = "所有计划"
    if (todayEvents.value.code != 0) {
      clearOptions();
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

//构建选项组件
const options = computed(() => {
  const baseOptions = type.value.data.map(item => ({
    value: item,
    label: item
  }));
  return [{ value: '所有计划', label: '所有计划' }, ...baseOptions];
});
//创建搜索eventInPlan的数据集
const searchEventInPlan = ref({
  planId: 0,
  executionDate: ""
})
//创建展示计划的tableData
const tableData = ref([]);
//调用eventInPlan接口
//eventInPlan: 传入planId和executionDate，返回当天该计划包含的事件
const getEventInPlan = (searchEventInPlan) => {
  return instance.get('/plan/eventInPlan', searchEventInPlan.value)
}
const clearTableData = () => {
  tableData.value = ([])
}
//更新每日日程（所有计划）
const updateAllDailyEvents = async () => {
  let res;
  res = await getDailyEvent(formattedValue.value);// 假设 getDailyEvent 返回的格式与 eventInPlan 相同
  if (res.data == null) {
    clearTableData();
  } else {
    tableData.value = res.data.map(event => ({
      plan: `计划${event.planId}`, // 你可以根据实际需要修改这个映射
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime
    }));
  }
}
const fetchEventsOnClick = async () => {
  let res;
  if (optionValue.value === "所有计划") {
    updateAllDailyEvents();
  } else {
    res = await getEventInPlan(searchEventInPlan.value);
    //tableData.value = res.data;
  }
}

//加载页面
onMounted(async () => {
  try {
    todayEvents.value = await getDailyEvent(formattedValue.value);
    type.value = await getType(formattedValue.value);

    updateAllDailyEvents();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
})
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="70vh">
        <!-- 日历 -->
        <div>
          <el-calendar v-model="dateValue" @click="getDailyEventOnClick" />
        </div>

        <el-row>
          Text
        </el-row>
      </el-aside>
      <el-main>
        <div class="left-right-layout">
          <div class="left">
            <row>
              <p>{{ formattedValue }}</p>
            </row>

            <!--  选择器  -->
            <row>
              <el-select v-model="optionValue" placeholder="Select" style="width: 240px">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
                  @click="fetchEventsOnClick" />
              </el-select>
            </row>
          </div>

          <div class="right">
            <!-- <PieChart/> -->
            <MyProgress />
          </div>
        </div>

        <!-- 每日事件表 -->
        <div class="event-layout">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="selection" width="55" />
            <!-- <el-table-column label="Date" width="120">
              <template #default="scope">{{ scope.row.date }}</template>
</el-table-column> -->
            <el-table-column property="plan" label="计划" width="190" />
            <el-table-column property="description" label="事件" width="190" />
            <el-table-column property="startTime" label="开始时间" width="190" />
            <el-table-column property="endTime" label="结束时间" width="190" />
          </el-table>
        </div>

      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.left-right-layout {
  display: flex;
  flex-direction: row;
  height: 40vh;
}

.left {
  flex: 1;
  padding: 20px;
}

.right {
  flex: 2;
  padding: 20px;
}
</style>