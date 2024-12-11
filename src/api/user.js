import instance from "@/utils/request.js"

export function registerService(user){
    return instance.post('/user/register',user);
}

export function loginService(user){
    return instance.post('/user/login',user);
}