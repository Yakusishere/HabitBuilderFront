import instance from "@/utils/request.js"

export function postListService(post, pageNum, pageSize) {
    return instance.post('/post/list', post, {params: {pageNum, pageSize}});
}

export function browsePostService(postId){
    return instance.get(`/post/browsePost/${postId}`);
}

export function addPostService(post){
    return instance.post('/post/add',post);
}

export function updatePostService(post){
    return instance.put('/post/update',post);
}

export function searchPostService(title){
    return instance.get('/post/searchPost',title);
}