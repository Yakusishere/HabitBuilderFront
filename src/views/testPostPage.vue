<script>
import { Search } from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";
import PostCard from './CardPost.vue';
import PublishPost from './publishPost.vue'
import instance from '@/utils/request';

export default {
    name: 'communityPage',
    components: {
        PostCard,
        PublishPost
    },
    setup() {
        const search = ref("");
        const selectedPost = ref(null);
        const newComment = ref("");

        //调用获取所有帖子接口
        const getAllPosts = () => {
            return instance.get('/post/getAllPost');
        }
        const getPostList = async () => {
            let res = await getAllPosts();
            console.log("method used")
            if (res.code === 0) {
                console.log("gotPosts:" + res.data)
                console.log("success got posts")
                posts.value = res.data.map(post => ({
                    id: post.postId,
                    image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // 你可以根据需要调整图片的处理方式
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
            return instance.get('comment/getThisPostComments', { params: { postId } });
        }
        const getUserById = (id) => {
            return instance.get('user/getId', { params: { id } });
        }
        const selectPost = async (postValue) => {
            selectedPost.value = postValue;
            console.log("selectedPostId:" + postValue.id);

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

        const posts = ref([]);

        onMounted(() => {
            //alert("created")
            getPostList()
        })

        return {
            search,
            selectedPost,
            newComment,
            selectPost,
            addComment,
            showReplyInput,
            addReply,
            posts,
            getAllPosts,
            getPostList,
            getPostComments
        }
    }
}


</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-main>
                <div class="topBar fixed-top-bar">
                    <div class="center-container">
                        <el-input :prefix-icon="Search" placeholder="输入搜索内容" clearable v-model="search"
                            style="width: 240px" size="large"></el-input>
                        <el-button class="button" type="primary" auto-insert-space>搜索</el-button>
                        <PublishPost />
                    </div>
                </div>
                <div class="posts-container">
                    <div class="posts-wrapper">
                        <PostCard v-for="post in posts" :key="post.id" :image="post.image" :title="post.title"
                            :description="post.description" @click="selectPost(post)" />
                    </div>
                </div>
            </el-main>
            <el-aside class="aside-fixed">
                <div v-if="selectedPost" class="post-details">
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
                        <div class="new-comment">
                            <el-input type="textarea" v-model="newComment" placeholder="输入评论" rows="3" />
                            <el-button type="primary" @click="addComment">提交评论</el-button>
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
    left: 0;
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
    width: 350px;
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
    margin-top: 10px;
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
</style>
