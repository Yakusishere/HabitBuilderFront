import instance from "@/utils/request.js"

export function registerService(user){
    return instance.post('/user/register',user);
}

export function loginService(user){
    return instance.post('/user/login',user);
}

export function getUserInfoService(){
    return instance.get('/user/getUserInfo');
}

export function getUserDetailService(){
    return instance.get('/user/getUserDetail')
}

export function updateUserService(user){
    return instance.post('user/update',user);
}