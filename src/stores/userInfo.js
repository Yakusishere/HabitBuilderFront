//import { tr } from 'element-plus/es/locale';
import { defineStore } from 'pinia'
import { ref } from 'vue'

const useUserInfoStore = defineStore('userInfo', () => {
    //定义状态相关的内容
    const defaultInfo = {
        userId: 0,
        userName: "",
        avatarImg: "",
        myScore: 0,
        isPost:false
    };
    const info = ref({ ...defaultInfo });

    const setInfo = (newInfo) => {
        if (newInfo) {
            info.value = {
                userId: newInfo.userId || 0,
                userName: newInfo.userName || "",
                avatarImg: newInfo.avatarImg || "",
                myScore: newInfo.myScore || 0,
                isPost: newInfo.isPost || false
            };
        } else {
            info.value = { ...defaultInfo };
        }
    };

    const removeInfo = () => {
        info.value = { ...defaultInfo };
    };

    return { info, setInfo, removeInfo };
}, { persist:{
    enabled:true
} });

export default useUserInfoStore;