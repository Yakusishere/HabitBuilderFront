<template>
  <div class="box">
    <div title="我的计划" style="width: 100%">
      <div style="display: flex; justify-content: center">我的计划</div>
      <el-row
        :gutter="20"
        style="width: 100%; margin-top: 20px; justify-content: center"
      >
        <el-col :span="16">
          <!-- 搜索与添加区域 -->
          <el-input
            placeholder="请输入模板名"
            v-model="data.title"
            clearable
            @clear="searchUserPlanList"
            @input="searchUserPlan('')"
          >
            <template #append>
              <el-button type="primary" :icon="Search"></el-button>
              <!--          @click="searchUserList"-->
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="
              clearPlan();
              addDialogVisible = true;
            "
            >新建计划</el-button
          >
        </el-col>
      </el-row>

      <div>
        <el-radio-group
          v-model="tag"
          size="large"
          style="display: flex; justify-content: center"
        >
          <el-radio-button
            v-for="option in options"
            :key="option.value"
            :label="option.value"
            @click="searchUserPlan(option.value)"
            
            >{{ option.label }}</el-radio-button
          >
        </el-radio-group>
      </div>
      <div>
        <el-scrollbar max-height="500px">
          <el-row
            style="margin-top: 20px; justify-content: center; width: 100%"
          >
            <el-col :span="10" v-for="(item, index) in userData.PlanList">
              <el-card
                stripe
                style="max-width: 400px; margin-left: 10px; margin-top: 10px"
              >
                <template #header>
                  <div>{{ item.title }}</div>
                  <div style="font-size: 10px; vertical-align: bottom">
                    创建时间：{{ item.createDate }}
                  </div></template
                >
                <span>{{ item.description }}</span>
                <template #footer>
                  <div style="display: flex; justify-content: space-around">
                    <!-- 查看按钮 -->
                    <el-button type="text" size="small"
                    @click="getPercentage(item.completionPercentage)"
                      ><el-icon><SuccessFilled /></el-icon
                    ></el-button>
                    <!-- 删除按钮 -->
                    <el-button
                      type="text"
                      size="small"
                      @click="deleteConfirm(item.planId)"
                      ><el-icon><DeleteFilled /></el-icon
                    ></el-button>
                    <!-- 禁言按钮 -->
                    <el-button
                      type="text"
                      size="small"
                      @click="
                        valiData();
                        updateShowPlan(index);
                        updateDialogVisible = true;
                      "
                      ><el-icon><Tools /></el-icon
                    ></el-button>
                  </div>
                </template>
              </el-card>
            </el-col>
          </el-row>
        </el-scrollbar>
      </div>
    </div>

    <div title="模板计划" style="width: 45%">
      <div style="display: flex; justify-content: center">模板计划</div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        "
      >
        <el-tabs
          v-model="activeName"
          @tab-change="tabChange"
          style="width: 100%"
        >
          <el-tab-pane label="全部" name="all"></el-tab-pane>
          <el-tab-pane label="运动" name="exercise"></el-tab-pane>
          <el-tab-pane label="学习" name="study"></el-tab-pane>
          <el-tab-pane label="爆改" name="change"></el-tab-pane>
          <el-tab-pane label="生活" name="life"></el-tab-pane>
          <el-tab-pane label="休闲" name="relax"></el-tab-pane>
          <el-tab-pane label="理财" name="finance"></el-tab-pane>
        </el-tabs>
      </div>
      <el-row>
        <el-scrollbar max-height="550px">
          <el-col v-for="(item, index1) in tableData.PlanList">
            <el-card style="width: 480px; margin-top: 10px">
              <template #header>
                <div>{{ item.title }}</div>
                <div
                  style="
                    font-size: 10px;
                    vertical-align: bottom;
                    margin-top: 10px;
                  "
                >
                  简介：{{ item.description }}
                </div>
              </template>
              <p
                v-for="(event, index2) in tableData.EventList[index1]"
                :key="index2"
                style="font-size: small"
              >
                {{ "第" + (index2 + 1) + "天" }}.{{ event.description }}
              </p>
              <template #footer>
                <el-button
                  type="primary"
                  plain
                  @click="
                    valiData();
                    applyPlan(index1);
                    addDialogVisible = true;
                  "
                  >应用</el-button
                >
                <el-button type="success" plain @click="addConfirm(index1)"
                  >添加到我的计划</el-button
                >
              </template>
            </el-card>
          </el-col>
        </el-scrollbar>
      </el-row>
    </div>
  </div>
  <el-dialog
    v-model="addDialogVisible"
    title="制订自己的计划"
    width="40%"
    style="text-align: center"
  >
    <el-form
      ref="addRuleFormRef"
      :model="Plan"
      label-width="auto"
      :size="'default'"
      :rules="rules"
    >
      <el-form-item label="主题名" prop="title">
        <el-input v-model="Plan.title" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="Plan.description" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="tag">
        <!--        <el-input v-model="Plan.tag" style="width: 300px"></el-input>-->
        <el-select
          v-model="Plan.tag"
          placeholder="Select"
          size="large"
          style="width: 300px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开始日期">
        <div style="display: flex; justify-content: center">
          <el-date-picker
            v-model="todayDate"
            type="date"
            placeholder="Pick a day to start"
            :disabled-date="disabledDate"
            :size="'default'"
            style="width: 150px"
            @change="dateChange()"
          />
          <el-date-picker
            v-model="endDate"
            type="date"
            disabled="disabled"
            :size="'default'"
            style="width: 150px"
          />
        </div>
      </el-form-item>
      <el-form-item label="执行时间" style="width: auto" prop="endTime">
        <div style="display: flex; width: 100%">
          <el-time-select
            v-model="startTime"
            style="width: 150px"
            placeholder="Start time"
            start="00:00"
            step="00:15"
            end="23:45"
          />
          <el-time-select
            v-model="endTime"
            style="width: 150px"
            placeholder="End time"
            :start="startTime"
            step="00:15"
            end="23:45"
          />
        </div>
      </el-form-item>
      <div
        v-for="(event, index) in Plan.eventList"
        :key="index"
        class="input-row"
        style="display: flex; align-items: center"
      >
        <el-form-item
          :label="'任务' + (index + 1)"
          :prop="'eventList[' + index + '].description'"
          :rules="[
            { required: true, message: '活动不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="Plan.eventList[index].description"
            style="width: 300px"
          ></el-input>
          <el-button
            @click="deleteModuleEvent(index)"
            size="small"
            type="danger"
            style="margin-left: 10px"
            >删除</el-button
          >
        </el-form-item>
      </div>
      <el-button
        @click="addBlankEvent()"
        icon="el-icon-plus"
        style="margin-top: 20px"
        >添加活动</el-button
      >
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addValidateForm()">提交</el-button>
      </span>
    </template>
  </el-dialog>

  <!--修改目前的计划-->
  <el-dialog
    v-model="updateDialogVisible"
    title="修改计划"
    width="40%"
    style="text-align: center"
  >
    <el-form
      ref="updateRuleFormRef"
      :model="Plan"
      label-width="auto"
      class="demo-ruleForm"
      :size="'default'"
      :rules="rules"
    >
      <el-form-item label="主题名" prop="title">
        <el-input v-model="Plan.title" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="Plan.description" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="tag">
        <!--        <el-input v-model="Plan.tag" style="width: 300px"></el-input>-->
        <el-select
          v-model="Plan.tag"
          placeholder="Select"
          size="large"
          style="width: 300px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开始日期">
        <div style="display: flex; justify-content: center">
          <el-date-picker
            v-model="todayDate"
            type="date"
            placeholder="Pick a day to start"
            :disabled-date="disabledDate"
            :size="'default'"
            style="width: 150px"
            @change="dateChange()"
          />
          <el-date-picker
            v-model="endDate"
            type="date"
            disabled="disabled"
            :size="'default'"
            style="width: 150px"
          />
        </div>
      </el-form-item>
      <el-form-item label="执行时间" style="width: auto" prop="endTime">
        <div style="display: flex; width: 100%">
          <el-time-select
            v-model="startTime"
            style="width: 150px"
            placeholder="Start time"
            start="00:00"
            step="00:15"
            end="23:45"
          />
          <el-time-select
            v-model="endTime"
            style="width: 150px"
            placeholder="End time"
            :start="startTime"
            step="00:15"
            end="23:45"
          />
        </div>
      </el-form-item>
      <div
        v-for="(event, index) in Plan.eventList"
        :key="index"
        class="input-row"
        style="display: flex; align-items: center"
      >
        <el-form-item
          :label="'任务' + (index + 1)"
          :prop="'eventList[' + index + '].description'"
          :rules="[
            { required: true, message: '活动不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="Plan.eventList[index].description"
            style="width: 300px"
          ></el-input>
          <el-button
            @click="deleteEvent(index)"
            size="small"
            type="danger"
            style="margin-left: 10px"
            >删除</el-button
          >
        </el-form-item>
      </div>
      <el-button
        @click="addBlankEvent()"
        icon="el-icon-plus"
        style="margin-top: 20px"
        >添加活动</el-button
      >
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateValidateForm()">提交</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog  v-model="showDialogVisible"
            title="该任务已完成:"
            width="30%"
            style="text-align:center">
  <el-progress type="dashboard" :percentage="percentage" :color="colors" />
</el-dialog>
</template>


<script setup>
import { onMounted, reactive, ref } from "vue";
import {
  changeEvent,
  createEvent,
  createPlan,
  deletePlan,
  delEvent,
  getEventList,
  getPlanList,
  getUserPlanList,
  searchByTag,
  searchPlan,
  updatePlan,
} from "@/api/plan.js";
import useUserInfoStore from "@/stores/userInfo.js";
import index from "pinia-plugin-persist";
import {
  DeleteFilled,
  Search,
  SuccessFilled,
  Tools,
  UserFilled,
} from "@element-plus/icons-vue";

const userInfoStore = useUserInfoStore();
const addDialogVisible = ref(false);
const updateDialogVisible = ref(false);

const showDialogVisible = ref(false);
const percentage = ref(0)

const getPercentage =async (completionPercentage)=>{
  console.log(completionPercentage);
  percentage.value = completionPercentage;
  showDialogVisible.value = true;
}

const colors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
]

// 添加计划
const Plan = ref({
  planId: 0,
  title: "",
  description: "",
  tag: "",
  startDate: "",
  endDate: "",
  eventList: [
    {
      eventId: 0,
      planId: 0,
      startTime: "",
      endTime: "",
      description: "",
    },
  ],
});

const options = [
  {
    value:"all",
    label:"全部"
  },
  {
    value: "exercise",
    label: "运动",
  },
  {
    value: "study",
    label: "学习",
  },
  {
    value: "change",
    label: "爆改",
  },
  {
    value: "life",
    label: "生活",
  },
  {
    value: "relax",
    label: "休闲",
  },
  {
    value: "finance",
    label: "理财",
  },
];

const timeRules = (rule, value, callback) => {
  if (endTime.value < startTime.value) {
    callback(new Error("结束时间必须大于开始时间"));
  } else {
    callback();
  }
};

const rules = {
  title: [{ required: true, message: "请输入题目", trigger: "blur" }],
  description: [{ required: true, message: "请输入简介", trigger: "blur" }],
  tag: [{ required: true, message: "请选择主题", trigger: "blur" }],
  endTime: [{ required: true, validator: timeRules, trigger: "change" }],
};

const addRuleFormRef = ref(null);
const updateRuleFormRef = ref(null);
const activeName = ref("all");
const date = new Date();
const todayDate = ref(date.getTime()); //更新的时间
const endDate = ref(todayDate.value);
const startTime = ref("12:00");
const endTime = ref("14:00");

const dateChange = async () => {
  const date = new Date(todayDate.value);
  const y = date.getFullYear();
  const m =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  let d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  d = String(Number(d) + Plan.value.eventList.length - 1);
  endDate.value = y + "-" + m + "-" + d;
  console.log(endDate.value);
};

const disabledDate = (Date) => {
  return Date.getTime() < date.getTime(); //只能更新以后的计划
};

const tableData = reactive({
  PlanList: [],
  EventList: [],
});

onMounted(async () => {
  await searchPlanList();
  await searchUserPlanList();
  console.log(7 * 3600 * 24 * 1000);
});

const valiData = async () => {
  if (addRuleFormRef.value) {
    addRuleFormRef.value.clearValidate();
  }
  if (updateRuleFormRef.value) {
    updateRuleFormRef.value.clearValidate();
  }
};

const addValidateForm = async () => {
  await addRuleFormRef.value.validate((valid) => {
    if (valid) {
      console.log("验证通过");
      addPlan();
      addDialogVisible.value = false;
    } else {
      console.log("验证失败");
    }
  });
};

const tabChange = async () => {
  if (activeName.value === "all") {
    await searchPlanList();
    console.log(tableData.PlanList);
  } else {
    await searchTagList(activeName.value);
    console.log(tableData.PlanList);
  }
};

const searchPlanList = async () => {
  console.log("开始调用");
  await getPlanList()
    .then(async (res) => {
      if (res.data.length > 0) {
        tableData.PlanList = res.data;
        await searchEventList();
        console.log(tableData.EventList);
      }
      console.log(res.message);
    })
    .catch((err) => {
      console.log(err);
    });
};

//模板计划的
const searchTagList = async (tag) => {
  await searchByTag(tag, 0)
    .then(async (res) => {
      if (res.data.length >= 0) {
        tableData.PlanList = res.data;
        await searchEventList();
      }
      console.log(res.message);
    })
    .catch((err) => {
      console.log(err);
    });
};
const searchEventList = async () => {
  if (tableData.PlanList.length > 0) {
    tableData.EventList = [];
    for (const item of tableData.PlanList) {
      await getEventList(item.planId).then((res) => {
        tableData.EventList.push(res);
      });
    }
  }
};

const clearPlan = async () => {
  Plan.value.planId = 0;
  Plan.value.title = "";
  Plan.value.description = "";
  Plan.value.tag = "";
  todayDate.value = date.getTime();
  endDate.value = todayDate.value;
  startTime.value = "12:00";
  endTime.value = "12:00";
  Plan.value.eventList = [
    {
      eventId: 0,
      planId: 0,
      description: "",
    },
  ];
};

const addBlankEvent = async () => {
  Plan.value.eventList.push({
    eventId: 0,
    planId: 0,
    description: "",
  });
  console.log(endDate.value);
  const endTime = new Date(endDate.value);
  let endMill = endTime.getTime();
  endMill += 1000 * 3600 * 24;
  endDate.value = endMill;
};

const addEvent = async () => {
  let executionDate = todayDate.value;
  for (const item of Plan.value.eventList) {
    if (item.description !== "") {
      const event = {
        planId: Plan.value.planId,
        description: item.description,
        executionDate: convertToDate(executionDate),
        startTime: startTime.value,
        endTime: endTime.value,
        isCompleted: 0,
      };
      await createEvent(event);
      executionDate = executionDate + 3600 * 24 * 1000; // 加一天
    }
  }
};

const deleteModuleEvent = async (index) => {
  Plan.value.eventList.splice(index, 1);
  endDate.value = endDate.value - 1000 * 3600 * 24;
};

const deleteEvent = async (index) => {
  if (Plan.value.eventList[index].eventId !== 0) {
    await delEvent(Plan.value.eventList[index].eventId).then((res) => {
      console.log(res.message);
    });
  }
  Plan.value.eventList.splice(index, 1);
  endDate.value = endDate.value - 1000 * 3600 * 24;
};
//添加计划

const updateValidateForm = async () => {
  await updateRuleFormRef.value.validate((valid) => {
    if (valid) {
      console.log("验证通过");
      updatePlanAndEvent();
      updateDialogVisible.value = false;
    } else {
      console.log("验证失败");
    }
  });
};
const convertToDate = (milliseconds) => {
  const date = new Date(milliseconds);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero based, so we add 1
  const day = date.getDate();

  return `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;
};
const addPlan = async () => {
  const plan = {
    userId: userInfoStore.info.userId,
    title: Plan.value.title,
    description: Plan.value.description,
    tag: Plan.value.tag,
    startDate: convertToDate(todayDate.value),
    endDate: convertToDate(endDate.value),
  };
  await createPlan(plan).then(async (res) => {
    // 返回的是一个plan对象
    Plan.value.planId = res.data.planId;
  });
  await addEvent();
  await searchUserPlanList();
  await clearPlan();
};

const addInMyPlan = async (index) => {
  await applyPlan(index);
  await addPlan();
};
const addConfirm = async (index) => {
  if (confirm("确定要添加到我的计划吗")) {
    await addInMyPlan(index);
    console.log("添加成功");
  } else {
    console.log("取消添加");
  }
};
const applyPlan = async (index) => {
  //拷贝副本
  Plan.value.tag = JSON.parse(JSON.stringify(tableData.PlanList[index].tag));
  Plan.value.title = JSON.parse(
    JSON.stringify(tableData.PlanList[index].title)
  );
  Plan.value.description = JSON.parse(
    JSON.stringify(tableData.PlanList[index].description)
  );
  Plan.value.eventList = JSON.parse(JSON.stringify(tableData.EventList[index]));
  Plan.value.startDate = date.getTime();
  todayDate.value = date.getTime();
  endDate.value =
    todayDate.value + 1000 * 3600 * 24 * (Plan.value.eventList.length - 1);
};
//页面左边

const tag = ref("all");

const data = ref({
  title: "",
});
const userData = reactive({
  PlanList: [],
});

//获得全部的用户的计划
const searchUserPlanList = async () => {
  console.log("开始调用");
  await getUserPlanList(userInfoStore.info.userId)
    .then((res) => {
      if (res.data.length > 0) {
        userData.PlanList = res.data;
      }
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
//按title搜索计划
const searchUserPlan = async (selectTag) => {
  tag.value = selectTag;
  if ((data.value.title === "" && tag.value === "") || tag.value === "all") {
    await searchUserPlanList(); //为空搜索全部
  } else {
    await searchPlan(data.value.title, tag.value, userInfoStore.info.userId)
      .then((res) => {
        if (res.data.length >= 0) {
          userData.PlanList = res.data;
        }
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const deleteConfirm = async (planId) => {
  if (confirm("确定要删除吗")) {
    await deletePlan(planId).then((res) => {
      console.log(res.message);
    });
    await searchUserPlanList();
  } else {
    console.log("取消删除");
  }
};

const updateShowPlan = async (index) => {
  Plan.value.tag = userData.PlanList[index].tag;
  Plan.value.title = userData.PlanList[index].title;
  Plan.value.description = userData.PlanList[index].description;
  Plan.value.planId = userData.PlanList[index].planId;
  todayDate.value = userData.PlanList[index].startDate; //获取计划的开始日期
  endDate.value = userData.PlanList[index].endDate;

  await getEventList(userData.PlanList[index].planId).then((res) => {
    Plan.value.eventList = res;
    console.log(res);
    startTime.value = Plan.value.eventList[0].startTime;
    endTime.value = Plan.value.eventList[0].endTime;
  });
};

const updatePlanAndEvent = async () => {
  const plan = {
    planId: Plan.value.planId,
    userId: userInfoStore.info.userId,
    title: Plan.value.title,
    description: Plan.value.description,
    tag: Plan.value.tag,
    startDate: todayDate.value,
    endDate: endDate.value, // 从今天开始重新计划
  };
  await updatePlan(plan).then((res) => {
    console.log(res.message);
  });

  let executionDate = todayDate.value;
  for (const event of Plan.value.eventList) {
    const newEvent = {
      eventId: event.eventId,
      planId: Plan.value.planId,
      description: event.description,
      executionDate: convertToDate(executionDate),
      startTime: startTime.value,
      endTime: endTime.value,
      isCompleted: 0,
    };
    if (newEvent.eventId === 0) {
      //新增加的event
      await createEvent(newEvent).then((res) => {
        console.log(res.message);
      });
    } else {
      await changeEvent(newEvent).then((res) => {
        console.log(res.message);
      });
    }
    executionDate = executionDate + 3600 * 24 * 1000; // 加一天
  }
  await searchUserPlanList();
};
</script>

<style>
.box {
  width: 100%;
  height: 22px;
  display: flex;
  flex-direction: row;
}
</style>