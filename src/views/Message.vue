<template>
  <div class="message-container">
    <div class="danmu w-full h-200px pt-4">
      <vue-danmaku
        v-model:danmus="danmus"
        loop
        :channels="4"
        :speeds="100"
        style="height: 200px"
      >
        <template v-slot:danmu="{ index, danmu }">
          <span
            class="bg-gray-100 rounded-3xl flex mt-2 items-center px-2 bg-linear-to-r from-[#17CFDB] dark:to-[#2b3131] to-[#FFFFFF]"
          >
            <div class="avatar">
              <el-avatar :size="16" :icon="UserFilled"></el-avatar>
            </div>
            <div class="mr-6 text-sm text-black dark:text-white">
              &nbsp;{{ danmu.text }}
            </div></span
          >
        </template>
      </vue-danmaku>
    </div>
    <div class="max-w-[1200px] mx-auto mt-10">
      <div class="dark:text-[#FFFFFF]">
        <span class="text-[28px] dark:text-white px-1 font-bold">留言板</span>
        <div class="font-bold items-center flex mt-[24px]">
          <svg
            class="mr-3 w-5 h-5 text-gray-800 dark:text-[#17CFDB]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 12"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5.917 5.724 10.5 15 1.5"
            ></path></svg
          ><span
            >如果有什么 <span class="text-[#17CFDB]">想说的、想问的</span> 或者
            发现了<span class="text-[#17CFDB]">本站的BUG</span>，欢迎留言告知😊。</span
          >
        </div>
        <div class="font-bold items-center flex mt-[16px]">
          <svg
            class="mr-3 w-5 h-5 text-gray-800 dark:text-[#17CFDB]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 19 19"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11.013 7.962a3.519 3.519 0 0 0-4.975 0l-3.554 3.554a3.518 3.518 0 0 0 4.975 4.975l.461-.46m-.461-4.515a3.518 3.518 0 0 0 4.975 0l3.553-3.554a3.518 3.518 0 0 0-4.974-4.975L10.3 3.7"
            ></path></svg
          ><span>若想 <span class="text-[#17CFDB]">添加友链</span> 可留言申请😄。</span>
        </div>
        <MessageComment :propMessageList="messageList" @refresh="getMessages" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import vueDanmaku from "vue-danmaku";
import { ref } from "vue";
import { messageApi } from "@/http/api";
import MessageComment from "./components/MessageComment.vue";
import { UserFilled } from "@element-plus/icons-vue";

const danmus = ref([]);
const messageList = ref([]);
const getMessages = async () => {
  const res: any = await messageApi.getMessages();
  danmus.value = res.data;
  messageList.value = res.data;
  danmus.value = danmus.value.map((item) => {
    return {
      text: item.content,
    };
  });
};
getMessages();
</script>
