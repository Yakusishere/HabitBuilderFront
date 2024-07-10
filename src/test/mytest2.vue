<template>
    <button @click="addOne">
      click
    </button>
  </template>
  
  <script>
  import { ref, defineComponent } from 'vue'
  
  export default defineComponent({
    name: 'mytest2',
    setup(_, { expose }) {
      const count = ref(0)
      const addOne = () => {
        count.value += 1
        console.log("message"+count.value)
      }
      const childMethod = () =>{
        alert("I'm your dad")
      }
      expose({
        count,
        addOne,
        childMethod
      })
      return {
        addOne,
        count
      }
    }
  })
  </script>
  