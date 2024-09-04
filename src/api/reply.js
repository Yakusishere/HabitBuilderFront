import instance from "@/utils/request.js"

export function addReplyService(reply) {
    return instance.post('/reply/add', reply);
}