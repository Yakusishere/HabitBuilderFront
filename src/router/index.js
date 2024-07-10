import {createRouter,createWebHistory} from 'vue-router'
//导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'
import PlanPageVue from '@/views/plan/PlanPage.vue'
import AIVue from '@/views/plan/AI.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import UserPostVue from '@/views/user/UserPost.vue'
import UserResetInfoVue from '@/views/user/UserResetInfo.vue'
import CommunityPageVue from '@/views/community/CommunityPage.vue'
//import PostVue from '@/views/community/com/CommunityPage.vue'
//定义路由关系
const routes=[
    {path:'/',component:LoginVue},
    {
        path:'/main',component:LayoutVue,
        children:[
            {path:'/main/plan/planpage',component:PlanPageVue},
            {path:'/main/plan/ai',component:AIVue},
            {path:'/main/user/userinfo',component:UserInfoVue},
            {path:'/main/user/userpost',component:UserPostVue},
            {path:'/main/user/userresetinfo',component:UserResetInfoVue},
            {
                path:'/main/community/communitypage',component:CommunityPageVue,
                /* children:[
                    {path:'/main/community/communitypage/post',component:PostVue},
                ] */
            },
        ]
    },
]
//创建路由器
const router =createRouter({
    history:createWebHistory(),
    routes:routes
})
//导出路由
export default router