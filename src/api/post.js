import instance from "@/utils/request.js"

export function postListService(post, pageNum, pageSize) {
    return instance.post('/post/list', post, {params: {pageNum, pageSize}});
}

export function browsePostService(postId){
    return instance.get(`/post/browsePost/${postId}`);
}

export function uploadService(formData){
    // 发送 FormData 数据
    return instance.post('/post/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data' // 设置请求头为 multipart/form-data
        }
    });
}

export function addPostService(post){
    return instance.post('/post/add',post);
}

export function updatePostService(post){
    return instance.put('/post/update',post);
}

export function myPostListService(){
    return instance.get('/post/myPostList');
}

export function favPostListService(){
    return instance.get('/post/favPostList');
}

export function likePostListService(){
    return instance.get('/post/likePostList');
}