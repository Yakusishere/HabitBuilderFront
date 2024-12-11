import instance from "@/utils/request.js"

export function addConversation(conversation){
    return instance.post('/conversation/addConversation',conversation);
}