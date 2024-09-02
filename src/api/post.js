import instance from "@/utils/request.js"

export function postListService(post, pageNum, pageSize) {
    return instance.post('/post/list', post, {params: {pageNum, pageSize}});
}

export function browsePostService(postId){
    return instance.get(`/post/browsePost/${postId}`);
}