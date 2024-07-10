
import { defineStore } from 'pinia'
import { ref } from 'vue'
const useUserInfoStore = defineStore('userInfo', () => {
    //定义状态相关的内容
    const info = ref({
        userId:0,
        userName:"",
        avatarImg:"",
        myScore:0,
    })
    const setInfo = (newInfo) => {
        info.value = {
            userId: newInfo.userId,
            userName: newInfo.userName,
            avatarImg: newInfo.avatarImg,
            myScore: newInfo.myScore
        };
    }
    const removeInfo = () => {
        info.value = {}
    }
    return { info, setInfo, removeInfo }
}, { persist: true })
export default useUserInfoStore;

/* import { defineStore } from 'pinia';
import { ref } from 'vue';

// 定义类型
interface UserInfo {
  userName: string;
  // 其他属性根据需要添加
}

// 使用 defineStore 创建 store
const useUserInfoStore = defineStore('userInfo', () => {
  // 定义状态相关的内容
  const info = ref<UserInfo>({ userName: '' });

  const setInfo = (newInfo: UserInfo) => {
    info.value = newInfo;
  };

  const removeInfo = () => {
    info.value = { userName: '' };
  };

  return { info, setInfo, removeInfo };
}, { persist: true });

export default useUserInfoStore;
 */