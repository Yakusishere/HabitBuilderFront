import {createRouter, createWebHistory} from 'vue-router'
//导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'
import PlanPageVue from '@/views/plan/PlanPage.vue'
import AIVue from '@/views/plan/AI.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import UserPostVue from '@/views/user/UserPost.vue'
import UserResetInfoVue from '@/views/user/UserResetInfo.vue'
import CommunityPageVue from '@/views/community/CommunityPage.vue'
import makePlan from "@/views/plan/makePlan.vue";
//import PostVue from '@/views/community/com/CommunityPage.vue'
//定义路由关系
const routes = [
    /*{path:'/',component:LoginVue},*/
    {path: '/', redirect: '/plan/planpage'},
    {
        path: '/', component: LayoutVue,
        children: [
            {path: '/plan/makePlan', component: makePlan},
            {path: '/plan/planPage', component: PlanPageVue},
            {path: '/plan/AI', component: AIVue},
            {path: '/user/userinfo', component: UserInfoVue},
            {path: '/user/userPost', component: UserPostVue},
            {path: '/user/userResetInfo', component: UserResetInfoVue},
            {path: '/community/communityPage', component: CommunityPageVue},
        ]
    },
]
//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})
//导出路由
export default router