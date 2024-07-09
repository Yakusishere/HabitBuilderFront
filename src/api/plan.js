import { request } from "@/utils/request.js";

export const getDailyEvent = (data: any): Promise<any> => request({
    url: '/plan/dailyEvent',
    method: 'GET',
/* headers:{
        Authorization:"Bearer"+ tokenUtils.getToken()
    } */
});