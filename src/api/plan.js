import instance from "@/utils/request.js"

export function dailyPlanOptionsService(date){
    return instance.get('/plan/dailyPlanOptions',{params:{date}});
}

export function dailyEventService(date){
    return instance.get('/plan/dailyEvent',{params:{date}});
}

export function completeEventService(eventId){
    return instance.get('/plan/completeEvent',{params:{eventId}});
}

export function autoAddPlanService(plan){
    return instance.post("/plan/autoAddPlan", plan);
};

export function getPlanList()  {
    return instance({
        url:'/manager/getPlanList',
        method:'get',
    }).then(res=>{
        return res;
    }).catch(err=>{
        console.log(err);
    });
}

export function getUserPlanList(userId)  {
    return instance({
        url:'/plan/myPlan',
        method:'get',
        params:{
            userId:userId
        }
    }).then(res=>{
        return res;
    }).catch(err=>{
        console.log(err);
    });
}

export function searchPlan(title,tag,userId)  {
    return instance({
        url:'/plan/searchPlan',
        method:'post',
        params:{
            title:title,
            tag:tag,
            userId:userId
        }
    }).then(res=>{
        return res;
    }).catch(err=>{
        console.log(err);
    });
}

export function deletePlan(planId)  {
    return instance({
        url:'/plan/deletePlan',
        method:'delete',
        params:{
            planId:planId
        }
    }).then(res=>{
        return res;
    }).catch(err=>{
        console.log(err);
    })
}

export function searchByTag(tag,userId){
    return instance({
        url:'/plan/searchByTag',
        method:'get',
        params:{
            tag:tag,
            userId:userId
        }
    }).then(res=>{
        return res;
    }).catch(err=>{
        console.log(err);
    })
}

export function getEventList(planId){
    return instance({
        url:'/event/getPlanEvents',
        method:'get',
        params:{
            planId:planId,
        }
    }).then(res=>{
        let eventList = [];
        res.data.forEach(item=>{
            eventList.push({
                eventId:item.eventId,
                planId:item.planId,
                description:item.description,
                startTime:item.startTime,
                endTime:item.endTime,
            });
        })
        return eventList
    }).catch(err=>{
        console.log(err);
    })
}

export function createPlan(plan) {
    return instance({
        url:'/plan/addPlan',
        method:'post',
        data:plan
    }).then(res=>{
        return res;
    }).catch(err=>{
        console.log(err);
    })
}

export function updatePlan(plan){
    return instance({
        url:'/plan/updatePlan',
        method:'post',
        data:plan
    }).then(res=>{
        return res;
    }).catch(err=>{
        console.log(err);
    })
}
export function createEvent(event){
    return instance({
        url:'/plan/createEvent',
        method:'post',
        data:event
    }).then(res=>{
        return res;
    }).catch(err=>{
        console.log(err);
    })
}
export function changeEvent(event){
    return instance({
        url:'/plan/changeEvent',
        method:'put',
        data:event
    }).then(res=>{
        return res;
    }).catch(err=>{
        console.log(err);
    })
}

export function delEvent(eventId){
    return instance({
        url:'/plan/deleteEvent',
        method:'delete',
        params:{
            eventId:eventId
        }
    }).then(res=>{
        return res;
    }).catch(err=>{
        console.log(err);
    })
}

export function setColor(date){
    return instance.get('/event/setColor',{params:{date}});
}