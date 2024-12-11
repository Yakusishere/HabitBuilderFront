<script setup>
import {ref, computed, onMounted} from "vue";
import instance from "@/utils/request";
import useUserInfoStore from "@/stores/userInfo.js";
import {ElMessage, valueEquals} from "element-plus";
import * as echarts from "echarts";
import {setColor} from "@/api/plan.js";
import {ElNotification} from "element-plus";
import {h} from "vue";
import {
  dailyPlanOptionsService,
  dailyEventService,
  completeEventService
} from "@/api/plan.js";
import {
  eventListService,
  editEventService
} from "@/api/event.js";

const userInfoStore = useUserInfoStore();
const chart = ref(null);
const completedEvent = ref(0);
const incompletedEvent = ref(0);
const Data = ref([]);
const calendar = ref();
const currentPlanId = ref(0);

const SetColor = async () => {
  console.log(dateValue.value);
  console.log("formattedDate", formattedValue.value);

  let res = await setColor(formattedValue.value)
  if (res.code === 0) {
    Data.value = res.data;
  }
};

const selectDate = (val) => {
  calendar.value.selectDate(val);
  SetColor();
};

const initPieChart = () => {
  const myChart = echarts.init(chart.value);
  const option = {
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: "今日任务完成情况",
        type: "pie",
        radius: "65%",
        data: [
          {
            value: completedEvent.value,
            name: "已完成数",
            itemStyle: {
              color: "#81C784", // 自定义已完成数的颜色为绿色
            },
          },
          {
            value: incompletedEvent.value,
            name: "未完成数",
            itemStyle: {
              color: "#CFD8DC", // 自定义未完成数的颜色为灰色
            },
          },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  myChart.setOption(option);
};

const type = ref([]);
const options = ref([{value: "所有计划", label: "所有计划"}]);

const startTime = ref();
const endTime = ref();
const changeEventDescription = ref("");

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
  completedEvent.value = 0;
  incompletedEvent.value = 0;
  initPieChart();
  try {
    // 定义formData
    const dailyEventFormData = new FormData();
    dailyEventFormData.append("userId", userInfoStore.info.userId);
    dailyEventFormData.append("date", formattedValue.value);
    //调用接口 获取今日事件和计划类型
    let eventRes = await dailyEventService(formattedValue.value);
    let optionRes = await dailyPlanOptionsService(formattedValue.value);
    type.value = optionRes.data;
    updateOptions();
    //更新今日事件
    updateAllDailyEvents(eventRes);
    optionValue.value = "所有计划";
    if (eventRes.code != 0) {
      console.log("不存在今日事件,清空选项");
      clearOptions();
    } else if (eventRes.code === 0) {
      console.log("获取todayEvents成功!");
      if (eventRes.message === "true") {
        ElMessage({
          message: "今日有时间冲突的任务",
          type: "warning",
        });
      }
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
};

function updateOptions() {
  // 清空原来的 options 保证第一个元素始终是 "所有计划"
  const updatedOptions = [{value: "所有计划", label: "所有计划"}];

  // 遍历 type 数组并添加有效的计划到 options
  type.value.forEach((item) => {
    if (item.planId != null && item.title != null) {
      updatedOptions.push({
        value: item.planId,
        label: item.title,
      });
    }
  });

  // 更新 options
  options.value = updatedOptions;
}

const searchEventInPlan = ref({
  planId: 0,
  date: "",
});

//创建展示计划的tableData
const tableData = ref([]);


const clearTableData = () => {
  tableData.value = [];
};
//更新每日日程（所有计划）
const updateAllDailyEvents = async (res) => {
  if (res.data == null) {
    console.log("没有事件,清空tableData");
    clearTableData();
  } else {
    const events = res.data;
    console.log("存在事件,进行更改");
    console.log("description: " + res.data[0].description);
    const updatedEvents = await Promise.all(
        events.map(async (event) => {
          // 检查 isCompleted 属性并更新计数器
          if (event.isCompleted) {
            completedEvent.value += 1;
            console.log("completedEvent:" + completedEvent.value);
          } else {
            incompletedEvent.value += 1;
          }

          console.log("title:" + event.title + " description:" + event.description);

          // 返回映射后的对象
          return {
            eventId: event.eventId,
            plan: event.title,
            description: event.description,
            startTime: event.startTime,
            endTime: event.endTime,
            isCompleted: event.isCompleted,
            isEditingEvent: false,
          };
        })
    );

    tableData.value = updatedEvents;
    fetchEventsOnClick;
    initPieChart();
  }
};
const fetchEventsOnClick = async (planId) => {
  completedEvent.value = 0;
  incompletedEvent.value = 0;
  if (optionValue.value === "所有计划") {
    console.log("获取所有计划");
    let dailyEventRes = await dailyEventService(formattedValue.value);
    if (dailyEventRes.code === 0) {
      await updateAllDailyEvents(dailyEventRes);
    }
  } else {
    searchEventInPlan.value.planId = planId;
    searchEventInPlan.value.date = formattedValue.value;
    let res = await eventListService(searchEventInPlan.value);

    const events = res.data;
    const updatedEvents = await Promise.all(
        events.map(async (event) => {
          // 检查 isCompleted 属性并更新计数器
          if (event.isCompleted) {
            completedEvent.value += 1;
            console.log("completedEvent:" + completedEvent.value);
          } else {
            incompletedEvent.value += 1;
          }

          // 返回映射后的对象
          return {
            eventId: event.eventId,
            plan: event.title,
            description: event.description,
            startTime: event.startTime,
            endTime: event.endTime,
            isCompleted: event.isCompleted,
            isEditingEvent: false,
          };
        })
    );

    tableData.value = updatedEvents;

    initPieChart();
  }
};


const handleCompleteEvent = async (eventId) => {
  try {
    console.log("选中事件的eventId:" + eventId);
    let res = await completeEventService(eventId);
    if (res.code === 0) {
      ElMessage({
        message: "您已完成这项任务！",
        type: "success",
      });
      ElNotification({
        title: "积分增加！",
        message: h("i", {style: "color: teal"}, "您已完成一项任务，积分+5！"),
      });
      completedEvent.value += 1;
      incompletedEvent.value -= 1;
      initPieChart();
      SetColor();
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
};

const changeEventOnClick = async (event) => {
  if (!changeEventDescription.value.trim()) {
    ElMessage({
      message: "任务描述不能为空！",
      type: "warn",
    });
    return;
  }
  // 格式化 startTime 和 endTime
  const formatTime = (time) => {
    const pad = (num) => {
      return num.toString().padStart(2, "0");
    };
    return `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(
        time.getSeconds()
    )}`;
  };

  console.log(
      "eventId:" + event.eventId + " description:" + changeEventDescription.value
  );
  let res;
  if (startTime.value != null && endTime.value != null) {
    const formattedStartTime = formatTime(startTime.value);
    const formattedEndTime = formatTime(endTime.value);
    res = await editEventService({
      eventId: event.eventId,
      description: changeEventDescription.value,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    });
  } else {
    res = await editEventService({
      eventId: event.eventId,
      description: changeEventDescription.value,
    });
  }

  if (res.code === 0) {
    console.log("修改成功");
    ElMessage({
      message: "修改任务成功！",
      type: "success",
    });
    event.isEditingEvent = false;
    startTime.value = null;
    endTime.value = null;
  } else if (res.code === 1) {
    console.log("修改失败");
  } else {
    console.log("调用接口失败");
  }
};

const handleEditEvent = (event) => {
  event.isEditingEvent = true;
  changeEventDescription.value = event.description;
  console.log("changeEventDescription:" + changeEventDescription.value);
};

const goToToday = () => {
  dateValue.value = new Date();
};

//加载页面
// 加载页面时获取每日事件和计划类型
onMounted(async () => {
  getDailyEventOnClick();
  initPieChart();
  SetColor();
});
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="70vh" class="aside-container">
        <div class="left-right-top">
          <div class="left-top">
            <transition name="fade" mode="out-in">
              <h1 :key="formattedValue" class="h1-custom-font">
                {{ formattedValue }}
              </h1>
            </transition>

            <!-- 选择器 -->
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
                    @click="fetchEventsOnClick(item.value)"
                />
              </el-select>
            </row>
          </div>
          <div class="right-top">
            <div ref="chart" style="width: 100%; height: 100%"></div>
          </div>
        </div>

        <!-- 日历 -->
        <div class="calendar-wrapper">
          <el-calendar
              v-model="dateValue"
              @click="getDailyEventOnClick"
              ref="calendar"
          >
            <template #header="{ date }">
              <span>{{ date }}</span>
              <el-button-group>
                <el-button size="small" @click="selectDate('prev-month')"
                >上个月
                </el-button
                >
                <el-button size="small" @click="selectDate('today')">
                  今天
                </el-button>
                <el-button size="small" @click="selectDate('next-month')">
                  下个月
                </el-button>
              </el-button-group>
            </template>
            <template #date-cell="{ data }">
              <div v-for="(item, index) in Data" :key="index">
                <el-tag
                    type="danger"
                    v-if="item.localDate === data.day && item.type === 0"
                >
                  {{ item.time }}
                </el-tag>
                <el-tag
                    type="success"
                    v-if="item.localDate === data.day && item.type === 1"
                >
                  {{ item.time }}
                </el-tag>
                <el-tag
                    type="info"
                    v-if="item.localDate === data.day && item.type === -1"
                >
                  {{ item.time }}
                </el-tag>
              </div>
            </template>
          </el-calendar>
        </div>
      </el-aside>
      <el-main>
        <!-- 每日事件表 -->
        <div class="event-layout">
          <transition name="fade" mode="out-in">
            <div v-if="tableData.length === 0" class="no-events">
              <h1>今日无计划任务</h1>
            </div>
            <div v-else class="card-list-container">
              <el-row
                  :gutter="20"
                  v-for="event in tableData"
                  :key="event.eventId"
                  class="card-list"
              >
                <el-card
                    :class="{
                    'event-card-completed': event.isCompleted,
                    'event-card-not-completed': !event.isCompleted,
                  }"
                >
                  <div class="event-card-header">
                    <h1>{{ event.plan }}</h1>
                    <div>
                      <el-button
                          v-if="!event.isEditingEvent && !event.isCompleted"
                          type="primary"
                          style="margin-right: 10px"
                          auto-insert-space
                          @click="handleEditEvent(event)"
                      >编辑
                      </el-button
                      >
                      <el-button
                          v-if="event.isEditingEvent"
                          type="primary"
                          style="margin-right: 10px"
                          auto-insert-space
                          @click="changeEventOnClick(event)"
                      >确认
                      </el-button
                      >
                      <el-button
                          v-if="event.isEditingEvent"
                          type="primary"
                          style="margin-right: 10px"
                          auto-insert-space
                          @click="event.isEditingEvent = false"
                      >取消
                      </el-button
                      >

                      <el-switch
                          v-if="!event.isEditingEvent"
                          v-model="event.isCompleted"
                          :disabled="event.isCompleted"
                          @change="handleCompleteEvent(event.eventId)"
                      />
                    </div>
                  </div>
                  <div v-if="!event.isEditingEvent || event.isCompleted">
                    <span class="event-time"
                    >{{ event.startTime }} - {{ event.endTime }}</span
                    >
                    <p>{{ event.description }}</p>
                  </div>
                  <div v-if="event.isEditingEvent && !event.isCompleted">
                    <el-input
                        v-model="changeEventDescription"
                        type="textarea"
                        :rows="3"
                        autosize
                        style="width: 90%; min-height: auto; margin-bottom: 10px"
                    ></el-input>
                    <div class="timePickerContainer">
                      <el-time-picker
                          v-model="startTime"
                          format="HH:mm:ss"
                          placeholder="开始时间"
                      />
                      to
                      <el-time-picker
                          v-model="endTime"
                          format="HH:mm:ss"
                          placeholder="结束时间"
                      />
                    </div>
                  </div>
                </el-card>
              </el-row>
            </div>
          </transition>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
/* 左侧顶部 */
.aside-container {
  display: flex;
  flex-direction: column;
  /*   justify-content: center;
  align-items: center; */
  height: 90%;
  /* width: 70vh; */
  margin-left: 2vh;
  margin-bottom: 50px;
}

.left-right-top {
  display: flex;
  flex-direction: row;
  padding: 20px;
  height: 20vh;
}

.left-top {
  flex: 1;
}

.right-top {
  flex: 2;
  padding: 20px;
}

.h1-custom-font {
  font-size: 24px;
  font-family: "Arial, sans-serif";
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
{
  opacity: 0;
}

/* 左侧顶部 */

/* .calendar-container .el-calendar-table .el-calendar-day{
 height: 50px;
} */

.calendar-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10vh;
  width: 100%;
  height: 100%;
}

/* 右侧事件列表 */

.event-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 95vh;
}

.card-list-container {
  width: 65vh;
  max-height: 85vh;
  overflow-y: auto;
  padding: 20px;
  border: 1px solid #eaeaea;
}

.card-list {
  margin-bottom: 20px;
}

.event-card-completed {
  width: 100%;
  background-color: #f7fcff;
}

.event-card-not-completed {
  width: 100%;
  background-color: #fdfdfa;
}

.event-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.timePickerContainer {
  /*top: 50px;*/
}

.time-picker {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
}

.card1 {
  background: #85ce61;
}

.card0 {
  background: #f56c6c;
}

/* 右侧事件列表 */
</style>