<script setup>
import { ref, computed, onMounted } from "vue";
import instance from "@/utils/request";
import useUserInfoStore from "@/stores/userInfo.js";

const userInfoStore = useUserInfoStore();

const todayEvents = ref({
  code: 0,
  message: "操作成功",
  data: [],
});
const type = ref({
  code: 0,
  message: "操作成功",
  data: [],
});

//日期
const dateValue = ref(new Date());
//日期转换为string
const formattedValue = computed(() => {
  const date = dateValue.value;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
});

// dailyEvent接口和dailyPlanType接口
// dailyEvent: 传入日期，传回这天所有的事件
// dailyPlanType: 传入日期，传回这天所有的事件名称
const getDailyEvent = (formData) => {
  return instance.post("/plan/dailyEvent", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
const getType = (formData) => {
  return instance.post("/plan/dailyPlanType", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
//清除选项框
const optionValue = ref("所有计划");
const clearOptions = () => {
  type.value = {
    code: 0,
    message: "操作成功",
    data: [],
  };
};
//点击时获取每日计划
const getDailyEventOnClick = async () => {
  try {
    // 定义formData
    const dailyEventFormData = new FormData();
    dailyEventFormData.append("userId", userInfoStore.info.userId);
    dailyEventFormData.append("date", formattedValue.value);
    //调用接口 获取今日事件和计划类型
    todayEvents.value = await getDailyEvent(dailyEventFormData);
    type.value = await getType(dailyEventFormData);
    //更新今日事件
    updateAllDailyEvents(dailyEventFormData);
    optionValue.value = "所有计划";
    if (todayEvents.value.code != 0) {
      console.log("不存在今日事件,清空选项");
      clearOptions();
    } else if (todayEvents.value.code === 0) {
      console.log("获取todayEvents成功!");
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
};

//构建选项组件
const options = computed(() => {
  if (!type.value || !type.value.data) {
    return [{ value: "所有计划", label: "所有计划" }];
  }

  const baseOptions = type.value.data
    .map((item) => {
      if (Array.isArray(item) && item.length >= 2) {
        return {
          value: item[0], // 使用数组的第一个元素作为值(id)
          label: item[1], // 使用数组的第二个元素作为标签(title)
        };
      }
      return null;
    })
    .filter((option) => option !== null); // 过滤掉无效的选项

  return [{ value: "所有计划", label: "所有计划" }, ...baseOptions];
});

const searchEventInPlan = ref({
  planId: 0,
  executionDate: "",
});

//创建展示计划的tableData
const tableData = ref([]);
//调用eventInPlan接口
//eventInPlan: 传入planId和executionDate，返回当天该计划包含的事件
const getEventInPlan = (searchEventInPlan) => {
  return instance.post("/plan/eventInPlan", searchEventInPlan);
};
const clearTableData = () => {
  tableData.value = [];
};
//更新每日日程（所有计划）
const updateAllDailyEvents = async (formData) => {
  let res;
  res = await getDailyEvent(formData); // 假设 getDailyEvent 返回的格式与 eventInPlan 相同
  if (res.data == null) {
    console.log("没有事件,清空tableData");
    clearTableData();
  } else {
    console.log("存在事件,进行更改");
    tableData.value = res.data.map((event) => ({
      eventId: event.eventId,
      plan: `计划${event.planId}`, // 你可以根据实际需要修改这个映射
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
    }));
  }
};
const fetchEventsOnClick = async () => {
  if (optionValue.value === "所有计划") {
    await updateAllDailyEvents();
  } else {
    console.log("searchEventInPlan:" + searchEventInPlan.value);
    let res = await getEventInPlan(searchEventInPlan.value);

    tableData.value = res.data.map((event) => ({
      plan: `计划${event.planId}`, // 你可以根据实际需要修改这个映射
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
    }));
  }
};

// 完成事件接口
const completeEvent = () => {
  const eventId = 2;
  console.log("传入的eventId:" + eventId);
  return instance.get("/plan/completeEvent", { params: { eventId } });
};
const handleSelectionChange = async (selectedRows) => {
  try {
    for (const row of selectedRows) {
      console.log("选中事件的eventId:" + row.eventId);
      let res = await completeEvent();
      if (res.code === 0) {
        alert("Selected events have been marked as complete.");
      }
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
};

//加载页面
// 加载页面时获取每日事件和计划类型
onMounted(async () => {
  getDailyEventOnClick();
});
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="70vh">
        <!-- 日历 -->
        <div>
          <el-calendar v-model="dateValue" @click="getDailyEventOnClick" />
        </div>

        <el-row> Text </el-row>
      </el-aside>
      <el-main>
        <div class="left-right-layout">
          <div class="left">
            <row>
              <p>{{ formattedValue }}</p>
            </row>

            <!--  选择器  -->
            <row>
              <el-select
                v-model="optionValue"
                placeholder="Select"
                style="width: 240px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  @click="fetchEventsOnClick"
                />
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
          <el-table
            :data="tableData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column property="plan" label="计划" width="190" />
            <el-table-column property="description" label="事件" width="190" />
            <el-table-column
              property="startTime"
              label="开始时间"
              width="190"
            />
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