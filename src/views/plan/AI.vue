<script setup>
import { onMounted, ref } from 'vue';
import instance from '@/utils/request.js';

const dialogVisible = ref(false);
const conversationVisible = ref(false);
const form = ref({
    userId: 1,
    planName: "",
    planDescription: ""
});

const openForm = () => {
    dialogVisible.value = true;
};


const autoAddPlan = (data) => {
    return instance.post('/plan/autoAddPlan', data);
};

const addHistoryConversation = (HCData) => {
    return instance.post('/historyConversation/addHistoryConversation', HCData);
};

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

const AISendMessage = (formData) => {
    return instance.post('/conversation/AI', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const getMessageList = (historyConversationId) => {
    return instance.get('/conversation/getConversationByHistoryConversationId', { params: { historyConversationId } });
};

const selectedHCId = ref(0);
const message = ref('');
const messageList = ref([]);

const sendMessage = async () => {
    if (!message.value.trim()) {
        console.warn('消息内容不能为空');
        return;
    }

    const formData = new FormData();
    formData.append('question', message.value);
    formData.append('userId', 1);
    formData.append('historyConversationId', selectedHCId.value);

    let AIRes = await AISendMessage(formData);
    if (AIRes.code === 0) {
        console.log("成功发送");
        let getMsgRes;
        getMsgRes = await getMessageList(selectedHCId.value);
        if (getMsgRes.code === 0) {
            console.log("成功获取消息列表")
            messageList.value = await getMsgRes.data; // 更新消息列表
        } else {
            console.log("获取消息列表失败");
        }
        message.value = "";
    } else {
        console.log("发送失败");
    }
};

const historyConversationForm = ref([]);
const getHistoryConversationByUserId = (userId) => {
    return instance.get('/historyConversation/getHistoryConversationByUserId', { params: { userId } });
};

const updatehistoryConversationForm = async () => {
    let response = await getHistoryConversationByUserId(1);
    if (response.data) {
        historyConversationForm.value = response.data.map(item => ({
            ...item,
            createTime: item.createTime.split('T')[0]
        }));
    }
};

updatehistoryConversationForm();

const handleHistoryClick = async (history) => {
    selectedHCId.value = history.historyConversationId;
    // 更新消息列表
    let getMsgRes;
    getMsgRes = await getMessageList(selectedHCId.value);
    if (getMsgRes.code === 0) {
        console.log("成功获取消息列表")
        messageList.value = await getMsgRes.data;
    } else {
        messageList.value = [];
        console.log("获取消息列表失败");
    }

    dialogVisible.value = false;
    conversationVisible.value = true;
    console.log("Selected History Plan:", history);
};
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
                    <el-scrollbar wrap-class="message-scrollbar">
                        <div class="message-box">
                            <div v-for="(msg, index) in messageList" :key="index" class="message">
                                <div class="question">{{ msg.question }}</div>
                                <div class="answer">{{ msg.answer }}</div>
                            </div>
                        </div>
                    </el-scrollbar>

                    <div class="message-input-box">
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
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 95vh;
}

.message-box {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
}

.message {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 8px;
}

.question {
    background-color: #f0f0f0;
}

.answer {
    background-color: #d9edf7;
}

.message-input-box {
    display: flex;
    align-items: center;
    background-color: #FFFFFF;
    padding: 10px;
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
    color: #409EFF;
}
</style>
