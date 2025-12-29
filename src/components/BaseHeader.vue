<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import Login from "@/views/components/Login.vue";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const isLogin = ref(false);
const themeStyle = ref("light");
watch(
  () => route.name,
  (newVal) => {
    const findItem = linkList.find((item) => item.name === newVal);
    if (findItem) {
      userStore.setMenu(newVal as string);
    }
  }
);
const isActive = computed(() => userStore.isActiveMenu);

const linkList = [
  { name: "Home", url: "/", label: "首页" },
  { name: "Category", url: "/category", label: "分类" },
  { name: "Tag", url: "/tag", label: "标签" },
  { name: "Timeline", url: "/timeline", label: "归档" },
  { name: "Message", url: "/message", label: "留言" },
  { name: "Link", url: "/link", label: "友链" },
];

const handleChangeTheme = () => {
  if (themeStyle.value === "light") {
    themeStyle.value = "dark";
    document.documentElement.className = "dark";
  } else {
    themeStyle.value = "light";
    document.documentElement.className = "";
  }
};

const handleChangeMenu = (name: string) => {
  userStore.setMenu(name);
  router.push({
    name,
  });
};

const handleClickLogin = () => {
  isLogin.value = !isLogin.value;
};

const handleClickAdd = () => {
  router.push({
    name: "ArticleEdit",
  });
};
</script>

<template>
  <div class="header">
    <header class="flex h-[64px] top-0 z-10">
      <nav
        class="content h-[64px] dark:bg-[#262626] fixed w-full z-20 top-0 start-0 dark:border-gray-600"
      >
        <div
          class="flex h-[64px] max-w-[1440px] flex-wrap items-center justify-between mx-auto p-0 h-[16]"
        >
          <a
            href="http://47.97.122.135"
            class="flex items-center space-x-3 rtl:space-x-reverse"
            ><img src="@/static/png/logo.jpg" class="h-16 w-32.5" alt="logo"
          /></a>
          <div class="flex space-x-0 order-2 rtl: mr-10">
            <button
              @click="handleChangeTheme"
              id="theme-toggle"
              type="button"
              class="text-[#1D1D1D] dark:text-white rounded-lg text-sm p-2.5 mr-3 cursor-pointer w-4.5"
            >
              <svg
                v-if="themeStyle === 'dark'"
                width="16"
                height="16"
                class="w-[18px] h-[18px] text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 5V3m0 18v-2M7 7 5.7 5.7m12.8 12.8L17 17M5 12H3m18 0h-2M7 17l-1.4 1.4M18.4 5.6 17 7.1M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                ></path>
              </svg>
              <svg
                v-else
                width="16"
                height="16"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M28.0527 4.41085C22.5828 5.83695 18.5455 10.8106 18.5455 16.7273C18.5455 23.7564 24.2436 29.4545 31.2727 29.4545C37.1894 29.4545 42.1631 25.4172 43.5891 19.9473C43.8585 21.256 44 22.6115 44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C25.3885 4 26.744 4.14149 28.0527 4.41085Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="4"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </button>
            <button
              v-if="!userStore.isLogin"
              type="button"
              class="text-black order-2 font-medium rounded-lg px-4 py-2 text-center dark:text-white cursor-pointer"
              @click="handleClickLogin"
            >
              登录
            </button>
            <button
              v-else
              type="button"
              class="text-black order-2 font-medium rounded-lg px-4 py-2 text-center dark:text-white cursor-pointer"
              @click="handleClickAdd"
            >
              新增
            </button>
          </div>
          <div
            class="items-center justify-between flex w-auto order-1"
            id="navbar-sticky"
          >
            <ul class="text-[14px] flex p-0 rounded-lg space-x-8 flex-row mt-0">
              <li
                v-for="item in linkList"
                :key="item.name"
                @click="handleChangeMenu(item.name)"
              >
                <div
                  class="block py-2 hover:cursor-pointer px-3 text-[#1D1D1D] rounded bg-transparent hover:text-[#17CFDB] p-0 dark:text-white"
                  aria-current="page"
                  :style="isActive === item.name ? 'color: rgb(23, 207, 219)' : ''"
                >
                  {{ item.label }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    <Login :visable="isLogin" @close="handleClickLogin"></Login>
  </div>
</template>
<style lang="scss">
.content {
  background-color: #c8c8c81a;
  -webkit-backdrop-filter: blur(15px);
  backdrop-filter: blur(15px);
}
</style>
