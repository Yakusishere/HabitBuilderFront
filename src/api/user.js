import { request } from "@/utils/request.js";

// 用户注册
export const userRegisterService = (registerData) => {
    return request.post('user/register', registerData)
}
