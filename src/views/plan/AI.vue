<script setup>
import { onMounted, ref, onUpdated, nextTick } from "vue";
import instance from "@/utils/request.js";
import useUserInfoStore from "@/stores/userInfo";
import {
  autoAddPlanService
} from "@/api/plan.js";
import {
  eventListService
} from "@/api/event.js";
import {
  addConversation
} from "@/api/conversation.js";

const userInfoStore = new useUserInfoStore();
const dialogVisible = ref(false);
const conversationVisible = ref(false);
const selectedHCId = ref(0);
const selectedPlanId = ref(0);
const message = ref("");
const changePlanMsg = ref("");
const changePlanForm = ref([]);
const messageList = ref([]);
const ifChangePlan = ref(false); //是否要改变计划
const AICreatePlanLoading = ref(false);
// 获取聊天容器的引用
const messageScroller = ref(null);
const form = ref({
  userId: userInfoStore.info.userId,
  planName: "",
  planDescription: "",
});

const openForm = () => {
  dialogVisible.value = true;
};

const addHistoryConversation = (HCData) => {
  return instance.post("/historyConversation/addHistoryConversation", HCData);
};

const AICreatePlanOnClick = async () => {
  if (form.value.planName === "") {
    alert("计划名不能为空");
    return;
  } else if (form.value.planDescription === "") {
    alert("计划描述不能为空");
    return;
  }

  AICreatePlanLoading.value = true; //创建计划时进行加载
  let addPlanRes = await autoAddPlanService({
    title: form.value.planName,
    description: form.value.planDescription,
  });
  AICreatePlanLoading.value = false;

  if (addPlanRes.code === 0) {
    console.log("创建成功");
    updatehistoryConversationForm();
    selectedHCId.value = addPlanRes.data.historyConversationId;
    selectedPlanId.value = addPlanRes.data.planId;
    console.log("当前选中的historyConversationId为:" + selectedHCId.value);
    dialogVisible.value = false;
    conversationVisible.value = true;
  } else {
    alert("创建失败");
  }
};

const AISendMessage = (formData) => {
  return instance.post("/conversation/AI", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


const getMessageList = (historyConversationId) => {
  return instance.get("/conversation/getConversationByHistoryConversationId", {
    params: { historyConversationId },
  });
};

const fixPlan = (formData) => {
  return instance.post("/plan/fixPlan", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const completeFix = (formData) => {
  return instance.post("/plan/completeFix", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const initAIPlanPage = () => {
  dialogVisible.value = false;
  conversationVisible.value = false;
  selectedHCId.value = 0;
  selectedPlanId.value = 0;
  message.value = "";
  changePlanMsg.value = "";
  changePlanForm.value = [];
  messageList.value = [];
  ifChangePlan.value = false; //是否要改变计划
  form.value = {
    userId: userInfoStore.info.userId,
    planName: "",
    planDescription: "",
  };
};

const displayedAnswer = ref(""); // 用于逐字显示的答案
let timer = null;

const sendMessage = async () => {
  if (!message.value.trim()) {
    console.warn("消息内容不能为空");
    return;
  }

  const questionMsg = message.value;
  message.value = "";
  const formData = new FormData();
  formData.append("question", questionMsg);
  formData.append("userId", userInfoStore.info.userId);
  formData.append("historyConversationId", selectedHCId.value);

  let AIRes = await AISendMessage(formData);
  if (AIRes.code === 0) {
    console.log("成功发送");
    updateMsgListUsingDisplay();
  } else {
    console.log("发送失败");
  }
};
const startDisplayAnswer = () => {
  if (timer) {
    clearTimeout(timer);
  }

  const lastAnswer = messageList.value[messageList.value.length - 1].answer;
  console.log("lastAnswer", lastAnswer);
  messageList.value[messageList.value.length - 1].answer = "";
  displayedAnswer.value = ""; // 清空之前显示的答案
  let currIndex = 0;

  const displayNextChar = () => {
    if (currIndex < lastAnswer.length) {
      // 每次增加 5 个字符
      displayedAnswer.value += lastAnswer.slice(currIndex, currIndex + 5);
      messageList.value[messageList.value.length - 1].answer =
        displayedAnswer.value;
      currIndex += 5;
      timer = setTimeout(displayNextChar, 80); // 逐字显示的间隔时间，可以根据需要调整
      nextTick(scrollToBottom());
    } else {
      clearTimeout(timer);
      timer = null;
    }
  };

  displayNextChar();
};

const historyConversationForm = ref([]);
const getHistoryConversationByUserId = (userId) => {
  return instance.get("/historyConversation/getHistoryConversationByUserId", {
    params: { userId },
  });
};

const updatehistoryConversationForm = async () => {
  let response = await getHistoryConversationByUserId(
    userInfoStore.info.userId
  );
  if (response.data) {
    historyConversationForm.value = response.data.map((item) => ({
      ...item,
      createTime: item.createTime.split("T")[0],
    }));
  }
};

const updateMsgList = async () => {
  // 更新消息列表
  let getMsgRes;
  getMsgRes = await getMessageList(selectedHCId.value);
  if (getMsgRes.code === 0) {
    console.log("成功获取消息列表");
    messageList.value = await getMsgRes.data;
    nextTick(scrollToBottom);
  } else {
    messageList.value = [];
    console.log("获取消息列表失败");
  }
};

const updateMsgListUsingDisplay = async () => {
  let getMsgRes;
  getMsgRes = await getMessageList(selectedHCId.value);
  if (getMsgRes.code === 0) {
    console.log("成功获取消息列表");
    messageList.value = await getMsgRes.data; // 更新消息列表
    startDisplayAnswer();
  } else {
    console.log("获取消息列表失败");
  }
};

updatehistoryConversationForm();

const handleHistoryClick = async (history) => {
  selectedHCId.value = history.historyConversationId;
  selectedPlanId.value = history.planId;
  ifChangePlan.value = false;
  message.value = "";
  changePlanMsg.value = "";
  changePlanForm.value = [];

  console.log("选中的planId:" + selectedPlanId.value);
  dialogVisible.value = false;
  conversationVisible.value = true;
  //更新消息列表
  updateMsgList();

  console.log("Selected History Plan:", history);
};

const enterChangePlan = async () => {
  /* let res = addConversation() */
  ifChangePlan.value = true;
  changePlanMsg.value = "";

  console.log("获取当前计划的事件成功");
  let changePlanMsgRes = await addConversation({
    historyConversationId: selectedHCId.value,
    question: "请你帮我修改一下当前的计划",
    answer: "当然可以!请告诉我你的修改要求",
  });
  if (changePlanMsgRes.code === 0) {
    console.log("已发送修改计划提示消息");
    updateMsgList();
  }
};

const checkPlan = async () => {
  let getEventsRes = await eventListService(
      {
        "planId":selectedPlanId.value
      }
  );
  if (getEventsRes.code === 0) {
    console.log("获取当前计划的事件成功");
    const answerStart = "当然可以！你目前的计划如下：\n\n";
    const answerPlan = getEventsRes.data
      .map((event) => event.description)
      .join("\n");
    const answer = answerStart + answerPlan;
    console.log(answer);

    let addConversationRes = await addConversation({
      historyConversationId: selectedHCId.value,
      question: "我想查看当前的详细计划",
      answer: answer,
    });

    if (addConversationRes.code === 0) {
      console.log("已查看当前计划");
      updateMsgListUsingDisplay();
    }
  }
};

const sendChangePlanMsg = async () => {
  if (!changePlanMsg.value.trim()) {
    alert("消息内容不能为空");
    return;
  }

  const formData = new FormData();
  const question = changePlanMsg.value;
  changePlanMsg.value = "";
  formData.append("planId", selectedPlanId.value);
  formData.append("request", question);
  let res = await fixPlan(formData);
  if (res.code === 0) {
    console.log("初步修改成功");
    changePlanForm.value = res.data;
    const answerPlan = res.data.join("\n");
    const answerStart = "修改后计划如下：\n\n";
    const answerEnd = "\n\n如果要应用该计划,请点击'确认修改'按钮";
    const answer = answerStart + answerPlan + answerEnd;
    console.log("修改后计划:", answer);
    let addConversationRes = await addConversation({
      historyConversationId: selectedHCId.value,
      question: question,
      answer: answer,
    });
    if (addConversationRes.code === 0) {
      console.log("成功获取初步消息修改信息");
      updateMsgListUsingDisplay();
    }
  }
};

const confirmChangePlan = async () => {
  if (changePlanForm.value.length === 0) {
    alert("您还未提出修改要求");
    return;
  }

  const formData = new FormData();
  formData.append("planId", selectedPlanId.value);
  formData.append("planContent", changePlanForm.value);
  let changePlanRes = await completeFix(formData);
  if (changePlanRes.code === 0) {
    console.log("成功修改");
    changePlanForm.value = [];
    let question = "确认修改";
    let answer = "修改成功!";
    let addConversationRes = await addConversation({
      historyConversationId: selectedHCId.value,
      question: question,
      answer: answer,
    });
    if (addConversationRes.code === 0) {
      console.log("修改计划成功");
      updateMsgListUsingDisplay();
    }
  }
};

const leaveChangePlan = async () => {
  ifChangePlan.value = false;
  let res = await addConversation({
    historyConversationId: selectedHCId.value,
    question: "放弃修改",
    answer: "好的。如果有其他需求，请跟我说",
  });
  if (res.code === 0) {
    console.log("放弃修改计划");
    updateMsgListUsingDisplay();
  }
};

const scrollToBottom = () => {
  console.log("调用scrollToBottom方法");
  const container = messageScroller.value;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};

onMounted(() => {
  scrollToBottom();
});

onUpdated(() => {
  scrollToBottom();
});
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-main class="main-content">
        <!-- 新建模块 -->
        <div v-if="!conversationVisible">
          <div class="create-button">
            <div class="create-button">
              <el-button class="custom-button" type="primary" @click="openForm">
                <div class="image-container">
                  <img
                    src="@/assets/lightBulb.png"
                    width="50"
                    height="50"
                    alt=""
                  />
                </div>
                <div class="text-container">
                  <h1>添加计划</h1>
                </div>
              </el-button>
            </div>
          </div>
          <!-- 创建计划表单 -->
          <div
            v-loading.fullscreen.lock="AICreatePlanLoading"
            element-loading-text="AI生成计划中..."
            element-loading-background="rgba(122, 122, 122, 0.8)"
          >
            <el-dialog
              v-model="dialogVisible"
              style="width: 400px"
              title="添加新计划"
            >
              <form :model="form" class="custom-form">
                <div class="form-item">
                  <label class="form-label">计划名称</label>
                  <el-input
                    v-model="form.planName"
                    
                    @keyup.enter="AICreatePlanOnClick"
                  />
                </div>
                <div class="form-item">
                  <label class="form-label">计划描述</label>
                  <el-input
                    v-model="form.planDescription"
                    @keyup.enter="AICreatePlanOnClick"
                  />
                </div>
              </form>
              <template #footer>
                <el-button
                  type="primary"
                  @click="dialogVisible = false"
                  class="form-custom-button cancel-button"
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  @click="AICreatePlanOnClick"
                  class="form-custom-button confirm-button"
                  >生成</el-button
                >
              </template>
            </el-dialog>
          </div>
        </div>

        <!-- 对话模块 -->
        <div v-if="conversationVisible" class="message-box-container">
          <div class="message-box" ref="messageScroller">
            <div
              v-for="(msg, index) in messageList"
              :key="index"
              class="message"
            >
              <div class="question">{{ msg.question }}</div>
              <div class="answer">{{ msg.answer }}</div>
            </div>
          </div>

          <div v-if="!ifChangePlan">
            <el-button @click="enterChangePlan">修改计划</el-button>
            <el-button @click="checkPlan">查看计划</el-button>
            <div class="message-input-box">
              <el-input
                v-model="message"
                @keyup.enter="sendMessage"
                type="text"
                placeholder="请输入信息"
                class="message-input"
              />
              <button @click="sendMessage" class="send-button">发送</button>
            </div>
          </div>

          <div v-if="ifChangePlan">
            <el-button @click="confirmChangePlan">确认修改</el-button>
            <el-button @click="leaveChangePlan">放弃修改</el-button>
            <el-button @click="checkPlan">查看计划</el-button>
            <div class="message-input-box">
              <el-input
                v-model="changePlanMsg"
                @keyup.enter="sendChangePlanMsg"
                type="text"
                placeholder="请输入修改要求"
                class="message-input"
              />
              <button @click="sendChangePlanMsg" class="send-button">
                发送
              </button>
            </div>
          </div>
        </div>
      </el-main>

      <!-- 历史计划 -->
      <div>
        <el-aside width="200px" class="aside-container">
          <div class="header">
            <h1>历史计划</h1>
            <div @click="initAIPlanPage" class="icon-container">
              <el-icon><EditPen /></el-icon>
            </div>
          </div>

          <div class="historyPlanForm">
            <form>
              <div
                v-for="(history, index) in historyConversationForm"
                :key="index"
                :class="[
                  'form-item',
                  { selected: selectedHCId === history.historyConversationId },
                ]"
                @click="handleHistoryClick(history)"
              >
                <span>{{ history.createTime }} : {{ history.title }}</span>
              </div>
            </form>
          </div>

          <div class="footer"></div>
        </el-aside>
      </div>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  display: flex;
  height: 95vh;
}

.main-content {
  flex: 1;
  padding: 20px;
  padding-right: 40vh;
  overflow-y: auto;
  width: 60%;
  left: 0;
}

/* 历史计划部分 */
.aside-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 40vh;
  height: 100%;
  background-color: #fff;
  border-left: 1px solid #dcdfe6;
  padding: 20px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  top: 0px;
  width: 35vh;
  height: 8vh;
  position: fixed;
}

.header h1 {
  margin: 0;
  margin-right: 10px; /* 调整标题和图标之间的间距 */
  font-size: 18px;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  bottom: 0px;
  width: 35vh;
  height: 4vh;
  position: fixed;
}

.icon-container {
  cursor: pointer;
  padding-right: 5vh;
}

.historyPlanForm {
  margin-top: 5vh;
  
}

.form-item {
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.form-item:hover {
  background-color: #f9f9f9;
}

.selected {
  background-color: #f1f1f1;
}
/* 历史计划部分 */

.dialog-footer {
  text-align: right;
}

.create-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.custom-button {
  display: flex;
  flex-direction: column; /* 垂直布局 */
  justify-content: center;
  align-items: center;
  background-color: #ffffff; /* 白色背景 */
  color: #888888; /* 灰色文字 */
  border: 1px solid #888888; /* 灰色边框 */
  border-radius: 20px; /* 圆角 */
  padding: 20px; /* 内边距 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影 */
  transition: all 0.3s ease; /* 动画过渡效果 */
  width: 200px; /* 调整按钮宽度 */
  height: auto; /* 自动高度 */
}

.custom-button:hover {
  background-color: #f5f5f5; /* 鼠标悬停时的背景色 */
  color: #555555; /* 鼠标悬停时的文字颜色 */
  border-color: #555555; /* 鼠标悬停时的边框颜色 */
}

.image-container img {
  display: block;
  margin-bottom: 10px; /* 调整图片与文字之间的距离 */
}

.text-container h1 {
  margin: 0;
  font-size: 16px; /* 调整文字大小 */
}

/* 表单部分 */
.custom-form .form-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.custom-form .form-label {
  flex: 0 0 80px;
  color: #333;
  font-weight: bold;
}

.custom-form .input-bar {
  flex: 1;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

.custom-form .input-bar:focus {
  border-color: #409eff;
  outline: none;
}

.form-custom-button {
  font-family: Arial, sans-serif; /* 统一字体 */
  font-size: 14px; /* 统一字体大小 */
  padding: 8px 20px; /* 调整按钮内边距 */
}

.el-button.cancel-button {
  background-color: #f56c6c;
  color: #fff;
  border-color: #f56c6c;
}

.el-button.cancel-button:hover {
  background-color: #f78989;
  border-color: #f78989;
}

.el-button.confirm-button {
  background-color: #67c23a;
  color: #fff;
  border-color: #67c23a;
}

.el-button.confirm-button:hover {
  background-color: #85ce61;
  border-color: #85ce61;
}
/* 表单部分 */

/* 对话部分 */
.message-box-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90vh;
}

.message-box {
  flex-grow: 1;
  overflow-y: auto;
  /* padding: 10px; */
}

.message {
  margin-bottom: 10px;
  /* padding: 10px; */
  border-radius: 8px;
}

.question {
  /* background-color: #f0f0f0; */
  white-space: pre-line;
  text-align: right; /* 右对齐 */
  padding: 20px; /* 添加边距 */
  line-height: 1.5;
}

.answer {
  background-color: #f0f0f0;
  white-space: pre-line;
  padding: 20px;
  line-height: 1.5;
  border-radius: 10px;
}

.message-input-box {
  display: flex;
  align-items: center;
  /* background-color: #ffffff; */
  /*   padding: 10px; */
}

.message-input {
  flex-grow: 1;
  padding: 10px;
  font-size: 16px;
  /* border: 1px solid #ccc; */
  border-radius: 5px;
  margin-right: 20px;
}

.send-button {
  padding: 10px 20px;
  margin-left: 10px;
  font-size: 16px;
  width: 10vh;
  border: none;
  background-color: #008e74;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.send-button:hover {
  background-color: #005445;
}
/* 对话部分 */

.historyPlanForm {
  padding: 10px;
}

.historyPlanForm span {
  cursor: pointer;
  display: block;
  margin-bottom: 10px;
}

.historyPlanForm span:hover {
  text-decoration: underline;
  color: #409eff;
}
</style>
