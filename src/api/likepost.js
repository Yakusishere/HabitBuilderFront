import instance from "@/utils/request.js"

export function likePostService(postId) {
    return instance.post(`/likepost/add/${postId}`);
}

export function deleteLikePostService(postId){
    return instance.delete(`/likepost/deleteLikePost/${postId}`);
}

