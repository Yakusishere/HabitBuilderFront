<template>
    <div class="post-card">
      <img :src="image" alt="Post Image" class="post-image" />
      <div class="post-content">
        <h3 class="post-title">{{ title }}</h3>
        <p class="post-description">{{ description }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PostCard',
    props: {
      image: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .post-card {
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin: 20px;
    max-width: 300px;
    flex: 0 0 auto;
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
  </style>
  