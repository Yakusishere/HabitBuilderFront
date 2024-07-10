<template>
    <div>
      <h1>{{ childCount }}</h1>
      <mytest2 ref="childComponent" />
      <button @click="showChildCount">Show Child Count</button>
    </div>
  </template>
  
  <script>
  import { ref, defineComponent, onMounted } from 'vue'
  import mytest2 from './mytest2.vue' // 确保文件路径正确且文件名正确
  
  export default defineComponent({
    name: 'mytest1',
    components: {
      mytest2
    },
    setup() {
      const childComponent = ref(null)
      const childCount = ref(0)
  
      const showChildCount = () => {
        if (childComponent.value) {
          // 访问子组件的 count 属性
          childCount.value = childComponent.value.count
          console.log("childValue:"+childCount.value)
        }
      }
  
      onMounted(() => {
        if (childComponent.value) {
          console.log(childComponent.value.count.value) // 子组件的 count 值
        }
        childComponent.value.childMethod();
      })
  
      return {
        childComponent,
        childCount,
        showChildCount
      }
    }
  })
  </script>
  
  <style scoped>
  h1 {
    margin-bottom: 20px;
  }
  </style>
  