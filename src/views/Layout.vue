<template>
  <n-layout has-sider position="absolute">
    <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
    >
      <div class="aside-user-info" v-if="!collapsed">
        <n-avatar
            round
            size="medium"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
        />
      </div>
      <n-menu
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          :theme-overrides="themeOverrides"
          key-field="menuKey"
          label-field="menuLabel"
          children-field="menuChildren"
          @update:value="handleMenuClick"
      />
    </n-layout-sider>
    <n-layout>
      <router-view></router-view>
    </n-layout>
  </n-layout>
</template>

<script>
import {defineComponent, h, ref} from "vue";
import {NIcon} from "naive-ui";
import {
  PersonOutline as PersonIcon,
  Calendar as PlanIcon,
  ChatbubblesOutline as communityIcon,
} from "@vicons/ionicons5";
import {useRouter} from "vue-router";

function renderIcon(icon) {
  return () => h(NIcon, null, {default: () => h(icon)});
}

const menuOptions = [
  {
    menuLabel: "计划",
    menuKey: "/plan",
    icon: renderIcon(PlanIcon),
    menuChildren: [
      {
        menuLabel: "计划总览",
        menuKey: "/plan/planPage"
      },
      {
        menuLabel: "制定计划",
        menuKey: "/plan/makePlan"
      },
      {
        menuLabel: "AI助手",
        menuKey: "/plan/AI"
      }
    ]
  },
  {
    menuLabel: "社区",
    menuKey: "/community/communityPage",
    icon: renderIcon(communityIcon),
  },
  {
    menuLabel: "我的",
    menuKey: "/user",
    icon: renderIcon(PersonIcon),
    menuChildren: [
      {
        menuLabel: "用户信息",
        menuKey: "/user/userinfo"
      },
      {
        menuLabel: "用户帖子",
        menuKey: "/user/userPost"
      },
      {
        menuLabel: "修改信息",
        menuKey: "/user/userResetInfo"
      }
    ]
  },
];

const themeOverrides = {
  common: {
    primaryColor: '#807ce8', // 主要颜色
  },
};

export default defineComponent({
  setup() {
    const router = useRouter();

    const handleMenuClick = (menuKey) => {
      console.log(menuKey);
      router.push(menuKey);
    }
    return {
      collapsed: ref(true),
      menuOptions,
      themeOverrides,
      handleMenuClick,
    };
  }
});
</script>


<style lang="scss" scoped>
.layout-container {
  height: 100%;
  width: 100%;
}

.aside {
  background-color: #333333;
  height: 100%;
  width: 200px;
  position: fixed;
}

.aside-user-info {
  padding: 10px;
  height: 50px;
}

.main {
  height: 100vh;
  margin-left: 300px;
}

</style>
  