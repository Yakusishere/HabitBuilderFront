<script >
import { ref, onMounted } from "vue";
import PostCard from '@/views/community/CardPost.vue';
import instance from '@/utils/request';
import useUserInfoStore from "@/stores/userInfo.js";


export default {
    name:'userPost',
    components:{
        PostCard,

    },
    setup() {
        const posts = ref([]);
        const selectedPost = ref(null);
        const newComment = ref("");
        const isliked = ref(false)
        const isFav = ref(false)
        const isTyping = ref(false)//查看是否在打字
        const userInfoStore = useUserInfoStore();
        //调对用户获取所有帖子的接口
        const getUserPostService = (userId) => {
            return instance.get("post/getPostByUserId", { params: { userId } });
        };
        
        /* const getAllPosts = () => {
            return instance.get('/post/getAllPost');
        } */
        const getPostList = async () => {
            let res = await getUserPostService(userInfoStore.info.userId);
            console.log("method used")
            if (res.code === 0) {
                console.log("gotPosts:" + res.data)
                console.log("success got posts")
                posts.value = res.data.map(post => ({
                    id: post.postId,
                    image: post.images, // 你可以根据需要调整图片的处理方式
                    title: post.title,
                    description: post.content,
                    author: `用户${post.userId}`, // 你可以根据需要调整作者的处理方式
                    date: new Date(post.publishDate).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
                    comments: []
                }))
            }
            else {
                console.log("failed to get posts")
            }
        }
        //调用获取帖子评论接口
        const getPostComments = (postId) => {
            return instance.get('/comment/getThisPostComments', { params: { postId } });
        }
        //根据id查找用户名接口
        const getUserById = (id) => {
            return instance.get('/user/getId', { params: { id } });
        }
        //是否点赞帖子接口
        const getIfLikePost = (userId, postId) => {
            console.log("getIfLikePost:" + userId + "," + postId);
            // 创建一个 FormData 对象
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('postId', postId);
            // 发送请求
            return instance.post('/likepost/getIfLikePost', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        }
         //是否收藏帖子
         const getIfCollectPost = (userId, postId) => {
            console.log("getIfCollectPost:" + userId + "," + postId);
            // 创建一个 FormData 对象
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('postId', postId);

            // 发送请求
            return instance.post('/collectpost/getPostCollection', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        }

        const selectPost = async (postValue) => {
            selectedPost.value = postValue;
            console.log("selectedPostId:" + postValue.id);

            //判断用户是否点赞、收藏帖子
            let ifLikeRes = await getIfLikePost(1, selectedPost.value.id);
            let ifFavRes = await getIfCollectPost(1, selectedPost.value.id);
            if (ifLikeRes.code === 0 && ifFavRes.code === 0) {
                console.log("成功获取是否点赞、收藏帖子");
                if (ifLikeRes.message === "true") {
                    console.log("已点赞");
                    isliked.value = true;
                }
                else if (ifLikeRes.message === "false") {
                    console.log("未点赞");
                    isliked.value = false;
                }
                if (ifFavRes.message === "true") {
                    console.log("已收藏");
                    isFav.value = true;
                }
                else if (ifFavRes.message === "false") {
                    console.log("未收藏");
                    isFav.value = false;
                }
            }

            let res = await getPostComments(postValue.id);
            if (res.code === 0) {
                console.log("successfully get comments");

                // 使用 Promise.all 处理并发请求来调用getUserById方法，通过id获取userName来展示
                const commentsWithAuthorPromises = res.data.map(async (comment) => {
                    let userRes = await getUserById(comment.sendUserId);
                    if (userRes.code === 0) {
                        //console.log("successfully get userName:" + userRes.data.userName);
                        return {
                            id: comment.commentId,
                            count: comment.commentCount,
                            author: userRes.data.userName, // 假设后端返回的数据中有 userName 属性
                            text: comment.content,
                            likeCount: comment.likeCount,
                            replyCount: comment.replyCount,
                            replies: [],
                        };
                    } else {
                        console.log("failed to get userName");
                        // 如果获取用户名失败，则使用一个默认值
                        return {
                            id: comment.commentId,
                            count: comment.commentCount,
                            author: "未知用户",
                            text: comment.content,
                            likeCount: comment.likeCount,
                            replyCount: comment.replyCount,
                            replies: [],
                        };
                    }
                });

                // 等待所有的 getUserById 请求完成
                selectedPost.value.comments = await Promise.all(commentsWithAuthorPromises);
            }
        };
        const addCollectPost = (data) => {
            return instance.post('/collectpost/addCollection', data);
        }
        const collectPost = async () => {
            console.log("收藏帖子");
            let collectRelation = ref({
                "userId": userInfoStore.info.userId,
                "postId": selectedPost.value.id
            })
            let res = await addCollectPost(collectRelation.value);
            if (res.code === 0) {
                console.log("收藏成功")
                isFav.value = true;
            }
            else {
                console.log("点赞失败")
            }
        }
        //调用点赞帖子接口
        const addLikePost = (data) => {
            return instance.post("/likepost/addLikePost", data);
        }
        const likePost = async () => {
            console.log("调用likePost方法")
            let likeRelation = ref({
                "userId": userInfoStore.info.userId,//记得改
                "postId": selectedPost.value.id
            })
            console.log("likeRelation:" + likeRelation.value.userId + likeRelation.value.postId)
            let res = await addLikePost(likeRelation.value);
            if (res.data.code === 0) {
                console.log("点赞成功")
                isliked.value = true;
            }
            else {
                console.log("点赞失败")
            }
        }
        const addComment = () => {
            if (newComment.value.trim()) {
                selectedPost.value.comments.push({
                    id: Date.now(),
                    author: '当前用户',
                    text: newComment.value,
                    replies: []
                });
                newComment.value = "";
            }
        };

        const showReplyInput = (comment, reply = null) => {
            if (reply) {
                reply.showReplyInput = true;
            } else {
                comment.showReplyInput = true;
            }
        };

        const addReply = (comment, reply = null) => {
            if (reply) {
                if (reply.newReplyText.trim()) {
                    reply.replies = reply.replies || [];
                    reply.replies.push({
                        id: Date.now(),
                        author: '当前用户',
                        text: reply.newReplyText
                    });
                    reply.newReplyText = "";
                    reply.showReplyInput = false;
                }
            } else {
                if (comment.newReplyText.trim()) {
                    comment.replies.push({
                        id: Date.now(),
                        author: '当前用户',
                        text: comment.newReplyText,
                        replies: []
                    });
                    comment.newReplyText = "";
                    comment.showReplyInput = false;
                }
            }
        };
        const deletePost = async (postId) => {
    console.log("发起删除请求:", postId);
    try {
        const formData = new FormData();
        formData.append('postId', postId);

        const response = await instance.delete('/post/deletePost', {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        });

        console.log("服务器响应:", response);

        if (response && response.data) {
            console.log("服务器响应数据:", response.data);
            if (response.data.code === 0) {
                posts.value = posts.value.filter(post => post.id !== postId);
                if (selectedPost.value && selectedPost.value.id === postId) {
                    selectedPost.value = null;
                }
                console.log("删除成功");
            } else {
                console.log("删除失败", response.data.message);
            }
        } else {
            console.log("服务器未返回数据");
        }
    } catch (error) {
        console.error("删除帖子时发生错误", error);
    }
};





        onMounted(() => {
            //alert("created")
            getPostList()
        })

        return {
            selectedPost,
            newComment,
            selectPost,
            addComment,
            showReplyInput,
            addReply,
            posts,
            getUserPostService,
            getPostList,
            getPostComments,
            isliked,
            isFav,
            isTyping,
            likePost,
            collectPost,
            deletePost
        }
        
    },
}
</script>

<template>
    个人帖子
    <div class="common-layout">
        <el-container>
            <el-main>
                <div class="posts-container">
                    <div class="posts-wrapper">
                        <PostCard v-for="post in posts" :key="post.id" :image="post.image" :title="post.title"
                            :description="post.description" @click="selectPost(post)" />
                    </div>
                </div>
            </el-main>
            <el-aside class="aside-fixed">
                <div v-if="selectedPost" class="post-details">
                    <!-- <el-popconfirm
                        title="确认删除该帖子吗？"
                        confirm-button-text="确认"
                        cancel-button-text="取消"
                        icon="el-icon-warning"
                        @confirm="deletePost(selectedPost.id)">
                        <el-button slot="reference" type="danger" icon="el-icon-delete" class="delete-button">删除</el-button>
                    </el-popconfirm> -->
                    <el-button class="delete-button" @click="deletePost(selectedPost.id)">删除</el-button>
                    <el-button class="edit-button" @click="editPost(selectedPost.id)">编辑</el-button>
                    <h2 class="post-title">{{ selectedPost.title }}</h2>
                    <img :src="selectedPost.image" alt="Post Image" class="post-image" />
                    <p class="post-author">作者: {{ selectedPost.author }}</p>
                    <p class="post-date">发布日期: {{ selectedPost.date }}</p>
                    <p class="post-description">{{ selectedPost.description }}</p>

                    <div class="comments-section">
                        <h3>评论</h3>
                        <div v-for="comment in selectedPost.comments" :key="comment.id" class="comment">
                            <p class="comment-author">{{ comment.author }}</p>
                            <p class="comment-text">{{ comment.text }}</p>
                            <el-button type="text" @click="showReplyInput(comment)">回复</el-button>
                            <div v-if="comment.replies" class="replies">
                                <div v-for="reply in comment.replies" :key="reply.id" class="reply">
                                    <p class="reply-author">{{ reply.author }}</p>
                                    <p class="reply-text">{{ reply.text }}</p>
                                    <el-button type="text" @click="showReplyInput(comment, reply)">回复</el-button>
                                </div>
                            </div>
                            <div v-if="comment.showReplyInput" class="reply-input">
                                <el-input type="textarea" v-model="comment.newReplyText" placeholder="输入回复" rows="2" />
                                <el-button type="primary" @click="addReply(comment)">提交回复</el-button>
                            </div>
                            <div v-for="reply in comment.replies" :key="reply.id" class="reply">
                                <p class="reply-author">{{ reply.author }}</p>
                                <p class="reply-text">{{ reply.text }}</p>
                                <el-button type="text" @click="showReplyInput(comment, reply)">回复</el-button>
                                <div v-if="reply.showReplyInput" class="reply-input">
                                    <el-input type="textarea" v-model="reply.newReplyText" placeholder="输入回复"
                                        rows="2" />
                                    <el-button type="primary" @click="addReply(comment, reply)">提交回复</el-button>
                                </div>
                            </div>
                        </div>
                        <!-- 底部固定的点赞、收藏和评论框 -->
                        <div v-if="!isTyping">
                            <div class="bottom-actions">
                                <el-input type="textarea" v-model="newComment" placeholder="输入评论" rows="1"
                                    @click="isTyping = true" class="comment-input" />
                                <el-button type="primary" @click="addComment">提交评论</el-button>
                                <el-button v-if="!isliked" type="primary" @click="likePost">
                                    <div class="img-box" :class="isUp ? 'img-box-check' : ''">
                                        <img src="../assets/icons/like.png" alt="" class="like-image">
                                    </div>
                                </el-button>
                                <el-button v-if="isliked" type="primary" @click="likePost">
                                    <div class="img-box" :class="isUp ? 'img-box-check' : ''">
                                        <img src="../assets/icons/liked.png" alt="" class="like-image" />
                                    </div>
                                </el-button>
                                <el-button type="warning" @click="favoritePost"><el-icon>
                                        <Star />
                                    </el-icon></el-button>
                            </div>
                        </div>
                        <div v-if="isTyping">
                            <div class="new-comment">
                                <el-input type="textarea" v-model="newComment" placeholder="输入评论" rows="1"
                                    class="comment-input" />
                                <el-button type="primary" @click="addComment">发送</el-button>
                                <el-button type="primary" @click="isTyping = false">取消</el-button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="no-post-selected">
                    请选择一个帖子以查看详情
                </div>
            </el-aside>
        </el-container>
    </div>
</template>
<style scoped>
/* 全局样式 */
body,
html {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
}

/* 固定顶部搜索框 */
.fixed-top-bar {
    position: fixed;
    top: 0;
    left: 210px; /* 设置左边距与左侧菜单的宽度一致 */
    right: 0;
    z-index: 10;
    background-color: #fff;
    padding: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.topBar {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.center-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
}

/* 固定侧边栏 */
.aside-fixed {
    position: fixed;
    top: 60px;
    bottom: 0;
    right: 0;
    width: 45vh;
    z-index: 20;
    overflow-y: auto;
    background-color: #fff;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

.posts-container {
    margin-top: 70px;
    margin-right: 360px;
    padding: 10px;
    height: calc(100vh - 70px);
    overflow-y: auto;
}

.posts-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

.post-card {
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    max-width: 300px;
    flex: 0 0 auto;
    background-color: #fff;
}

.post-image {
    width: 100%;
    height: auto;
}

.post-content {
    padding: 15px;
}

.post-title {
    font-size: 18px;
    margin: 0 0 10px 0;
}

.post-description {
    font-size: 14px;
    color: #666;
}

.post-details {
    padding: 20px;
}

.post-author,
.post-date {
    font-size: 14px;
    color: #999;
}

.no-post-selected {
    font-size: 16px;
    color: #666;
    text-align: center;
    padding: 20px;
}

/* 操作按钮样式 */
.action-buttons {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 20px;
}

.delete-button,
.edit-button {
    width: 100px;
}

/* 评论样式 */
.comments-section {
    margin-top: 20px;
}

.comment {
    margin-bottom: 10px;
}

.comment-author {
    font-weight: bold;
}

.comment-text {
    margin: 5px 0;
}

.new-comment {
    display: flex;
    align-items: flex-start;
    margin-top: 10px;
}

.comment-input {
    flex: 1;
    margin-right: 10px;
}

.replies {
    margin-left: 20px;
    margin-top: 10px;
}

.reply {
    margin-bottom: 5px;
}

.reply-author {
    font-weight: bold;
}

.reply-text {
    margin: 5px 0;
}

.reply-input {
    margin-top: 10px;
    margin-left: 20px;
}

.el-button {
    margin-top: 10px;
}

.bottom-actions {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 45vh;
    background-color: #fff;
    /* padding: 10px 20px; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}

.like-image {
    width: 20px;
    height: 20px;
    transition: all 0.3s ease-in-out;
}

.img-box-check {
    transform: scale(1.2);
    transition: all 0.3s ease-in-out;
}

</style>
