import instance from "@/utils/request.js"

export function addCommentService(comment){
    return instance.post("/comment/add",comment)
}