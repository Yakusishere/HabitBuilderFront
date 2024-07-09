<script>
import PostCard from './CardPost.vue';

export default {
    name:'viewPosts',
    components: {
        PostCard
    },
    data() {
        return {
            posts: [
                {
                    id: 1,
                    image: 'https://via.placeholder.com/300',
                    title: 'Post 1',
                    description: 'This is the description for post 1.'
                },
                {
                    id: 2,
                    image: 'https://via.placeholder.com/300',
                    title: 'Post 2',
                    description: 'This is the description for post 2.'
                },
                {
                    id: 3,
                    image: 'https://via.placeholder.com/300',
                    title: 'Post 3',
                    description: 'This is the description for post 3.'
                },
                {
                    id: 4,
                    image: 'https://via.placeholder.com/300',
                    title: 'Post 4',
                    description: 'This is the description for post 4.'
                },
                {
                    id: 5,
                    image: 'https://via.placeholder.com/300',
                    title: 'Post 5',
                    description: 'This is the description for post 5.'
                },
                {
                    id: 6,
                    image: 'https://via.placeholder.com/300',
                    title: 'Post 6',
                    description: 'This is the description for post 6.'
                },
                {
                    id: 7,
                    image: 'https://via.placeholder.com/300',
                    title: 'Post 7',
                    description: 'This is the description for post 7.'
                },
                {
                    id: 8,
                    image: 'https://via.placeholder.com/300',
                    title: 'Post 8',
                    description: 'This is the description for post 8.'
                },
                {
                    id: 9,
                    image: 'https://via.placeholder.com/300',
                    title: 'Post 9',
                    description: 'This is the description for post 9.'
                },
                {
                    id: 10,
                    image: 'https://via.placeholder.com/300',
                    title: 'Post 10',
                    description: 'This is the description for post 10.'
                }
            ]
        };
    }
};
</script>

<template>
    <div id='viewPosts'>
        <div class="posts-container">
            <div class="posts-wrapper">
                <PostCard v-for="post in posts" :key="post.id" :image="post.image" :title="post.title"
                    :description="post.description" />
            </div>
        </div>
    </div>
</template>

<style>
#app {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 20px;
}

.posts-container {
    overflow-x: scroll;
    padding: 10px;
    max-width: 100%;
}

.posts-container::-webkit-scrollbar {
    display: none;
    /* Hide scrollbar for WebKit browsers */
}

.posts-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.post-card {
    flex: 0 0 calc(33.333% - 20px);
    /* Adjust the width of each card */
    box-sizing: border-box;
}
</style>