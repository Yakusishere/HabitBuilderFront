<template>
  <n-flex justify="center">
    <div style="width: 600px;">
      <n-card>
        <template #header>
          {{title}}
        </template>
        <template #header-extra>
          <n-button type="primary" @click="openEventList(planId)">
            查看详情
          </n-button>
        </template>
        {{description}}
        <template #footer>
          {{ startTime }} - {{endTime}}
        </template>
      </n-card>
    </div>
  </n-flex>

  <div v-if="showEventsModal" class="modal-overlay" @click="showEventsModal=false">
      <div class="modal-content">
        <div v-for="(event, index) in eventList" :key="index" class="event-list-container">
          <n-card>
            <template #header>
              {{ event.title }}
            </template>
            {{event.description}}
            <template #footer>
               {{event.executionDate}} {{event.startTime}} - {{event.executionDate}} {{event.endTime}}
            </template>
          </n-card>
        </div>
      </div>
  </div>

</template>

<script>
import {ref} from "vue";
import {eventListService} from "@/api/event.js";

export default {
  name: 'PlanCard',
  props: {
    planId: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  setup() {
    const showEventsModal = ref(false);
    const eventList = ref([]);
    const openEventList = async (planId) =>{

      let res = await eventListService({"planId":planId});
      if(res.code === 0){
        eventList.value=res.data;
        showEventsModal.value = true;
      }
    }

    return {
      showEventsModal,
      eventList,
      openEventList
    }
  }
}

</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  margin-top: -60px;
  border-radius: 10px;
  width: 800px;
  height: 600px;
  overflow-y: auto;
  /*padding-right: 400px;*/
}

.event-list-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>