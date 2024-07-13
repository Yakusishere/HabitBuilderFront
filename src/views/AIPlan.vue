<script setup>
import { onMounted, ref } from 'vue';
import instance from '../utils/request.js';

//表单的可见性
const dialogVisible = ref(false);
//对话的可见性
const conversationVisible = ref(false);

//表单模块
const form = ref({
    userId: 1,
    planName: "",
    planDescription: ""
});

const openForm = () => { //打开表单
    dialogVisible.value = true;
};
const submitForm = () => { //提交表单
    console.log('提交的表单数据：', form.value);
    dialogVisible.value = false;
    conversationVisible.value = true;
};

// AI添加计划接口
const autoAddPlan = (data) => {
    return instance.post('/plan/autoAddPlan', data);
}
// 创建历史对话接口
const addHistoryConversation = (HCData) => {
    return instance.post('/historyConversation/addHistoryConversation', HCData);
}
// AI创建计划
const AICreatePlanOnClick = async () => {
    let addPlanRes = await autoAddPlan({
        userId: form.value.userId,
        title: form.value.planName,
        description: form.value.planDescription
    });
    let addHCRes = await addHistoryConversation({
        userId: 1,
        title: form.value.planName
    });
    if (addPlanRes.code === 0 && addHCRes.code === 0) {
        console.log("创建成功");
        dialogVisible.value = false;
        conversationVisible.value = true;
    }
};

//发送消息
const AISendMessage = (formData) => {
  return instance.post('/conversation/AI', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const message = ref(''); // 添加一个用于存储消息内容的变量
const userQuestion =ref([]);
const AIAnswer = ref([]);

const sendMessage = async () => {
  if (!message.value.trim()) {
    console.warn('消息内容不能为空');
    return;
  }

  
};

//历史计划
const historyConversationForm = ref([]);
const getHistoryConversationByUserId = (userId) => {
    return instance.get('/historyConversation/getHistoryConversationByUserId', { params: { userId } });
};
const updatehistoryConversationForm = async () => {
    let response = await getHistoryConversationByUserId(1);
    if (response.data) {
        historyConversationForm.value = response.data.map(item => ({
            ...item,
            createTime: item.createTime.split('T')[0] // 只保留日期部分
        }));
    }
};
updatehistoryConversationForm();

// 处理历史计划点击事件
const handleHistoryClick = (history) => {
    dialogVisible.value = false;
    conversationVisible.value = true;
    console.log("Selected History Plan:", history);
}
</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-main>
                <!-- 新建模块 -->
                <div v-if="!conversationVisible">
                    <div class="create-button">
                        <el-button type="primary" @click="openForm">添加计划</el-button>
                    </div>
                    <!-- 创建计划表单 -->
                    <el-dialog v-model="dialogVisible" title="添加新计划">
                        <el-form :model="form" label-width="80px">
                            <el-form-item label="计划名称">
                                <el-input v-model="form.planName"></el-input>
                            </el-form-item>
                            <el-form-item label="计划描述">
                                <el-input v-model="form.planDescription"></el-input>
                            </el-form-item>
                        </el-form>
                        <template #footer>
                            <el-button @click="dialogVisible = false">取消</el-button>
                            <el-button type="primary" @click="AICreatePlanOnClick">确定</el-button>
                        </template>
                    </el-dialog>
                </div>

                <!-- 对话模块 -->
                <div v-if="conversationVisible" class="message-box-container">
                    <div class="message-box">
                        <input v-model="message" @keyup.enter="sendMessage" type="text" placeholder="Type your message"
                            class="message-input" />
                        <button @click="sendMessage" class="send-button">发送</button>
                    </div>
                </div>
            </el-main>

            <el-aside width="200px">
                <h1>历史计划</h1>
                <div class="historyPlanForm">
                    <el-form>
                        <el-form-item v-for="(history, index) in historyConversationForm" :key="index"
                            @click="handleHistoryClick(history)">
                            <span>{{ history.createTime }}: {{ history.title }}</span>
                        </el-form-item>
                    </el-form>
                </div>
            </el-aside>
        </el-container>
    </div>
</template>

<style scoped>
.dialog-footer {
    text-align: right;
}

.create-button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
}

.message-box-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px;
    display: flex;
    justify-content: center;
}

.message-box {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 800px;
}

.message-input {
    flex-grow: 1;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.send-button {
    padding: 10px 20px;
    margin-left: 10px;
    font-size: 16px;
    border: none;
    background-color: #008e74;
    color: white;
    cursor: pointer;
    border-radius: 5px;
}

.send-button:hover {
    background-color: #005445;
}
</style>
