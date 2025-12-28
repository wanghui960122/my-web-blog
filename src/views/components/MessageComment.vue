<script lang="ts" setup>
import { UserFilled } from "@element-plus/icons-vue";
import { ref, watch } from "vue";
import { messageApi } from "@/http/api";

interface MyProps {
  propMessageList: Array<any>;
}
const props = withDefaults(defineProps<MyProps>(), {
  propMessageList: () => [],
});

const emits = defineEmits(["refresh"]);

watch(
  () => props.propMessageList,
  (newVal) => {
    messageList.value = newVal;
    messages.value = newVal;
    const replyMessages = messageList.value.filter((item) => {
      item.creatAt = new Date(item.creatAt).toLocaleString();
      return item.parent_id;
    });
    messageList.value = messageList.value.filter((item) => !item.parent_id);
    messageList.value.forEach((item) => {
      item.replyMessages = [];
      replyMessages.forEach((replyItem) => {
        if (item.id === replyItem.parent_id) {
          item.replyMessages.push(replyItem);
        }
      });
    });
  }
);

const messageList = ref([]);
const messages = ref([]);

const username = ref("访客");
const content = ref("");

const handleReply = async () => {
  if (!content.value) {
    ElMessage.error("评论内容不能为空");
    return;
  }
  if (!username.value) {
    ElMessage.error("用户名不能为空");
    return;
  }
  const res: any = await messageApi.addMessage({
    username: username.value,
    content: content.value,
  });
  if (res.code === 0) {
    emits("refresh");
  }
};

const replyContent = ref("");
const replyUsername = ref("");
const replyMessageId = ref("");
const replyParentId = ref("");
const replyNameRef = ref("");
const handleReplyMessage = (parentId: string, messageId: string, replyName: string) => {
  replyContent.value = "";
  replyUsername.value = "访客";
  replyMessageId.value = messageId;
  replyNameRef.value = replyName;
  replyParentId.value = parentId;
};
const handleReplyMessageCard = async () => {
  if (!replyContent.value) {
    ElMessage.error("评论内容不能为空");
    return;
  }
  if (!replyUsername.value) {
    ElMessage.error("用户名不能为空");
    return;
  }
  const res: any = await messageApi.replyMessage({
    messageId: replyMessageId.value,
    username: replyUsername.value,
    content: replyContent.value,
    parentId: replyParentId.value,
    replyName: replyNameRef.value,
  });
  if (res.code === 0) {
    emits("refresh");
  }
};
</script>
<template>
  <div class="article-message mt-8">
    <div class="message-header">
      <div class="message-header-title text-[22px] dark:text-[#fff]">
        评论 ({{ messages.length }})
      </div>
      <div class="message-header-input flex flex-col items-center mt-6">
        <textarea
          id="textarea"
          rows="4"
          v-model="content"
          class="w-full px-4 dark:focus:border-[#D8D8D8] outline-0 border-1 p-1.5 focus:border-[#17CFDB] dark:bg-[#2C2C2C] rounded-xl dark:text-white dark:placeholder-[#D8D8D8]"
          placeholder="说点什么~"
        ></textarea>
        <div class="flex items-center justify-between mt-4 w-full">
          <div class="flex items-center">
            <div class="username mr-4">
              <el-input
                maxlength="10"
                placeholder="用户名"
                size="large"
                v-model="username"
              ></el-input>
            </div>
            <div class="avatar">
              <el-avatar :size="40" :icon="UserFilled"></el-avatar>
            </div>
          </div>
          <div class="right btn">
            <el-button size="large" @click="handleReply">发表</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="message-list mt-8">
      <template v-for="item in messageList" :key="item">
        <div class="item dark:text-[#fff] mt-4">
          <div class="item-header flex items-center">
            <div class="message-avatar mr-2">
              <el-avatar :size="40" :icon="UserFilled"></el-avatar>
            </div>
            <div class="message-name text-[14px]">{{ item.user_name }}</div>
          </div>
          <div class="message-content ml-12 bg-transparent">{{ item.content }}</div>
          <div class="message-time text-[12px] ml-12 mt-2">
            {{ item.creatAt }}
            <el-popover
              :width="420"
              trigger="click"
              popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
            >
              <template #reference>
                <span
                  class="ml-4 text-[#17cfdb] cursor-pointer"
                  @click="handleReplyMessage(item.id, item.id, item.user_name)"
                  >回复</span
                >
              </template>
              <template #default>
                <div class="flex flex-col items-center mt-6">
                  <textarea
                    id="textarea"
                    rows="4"
                    v-model="replyContent"
                    class="w-full px-4 dark:focus:border-[#D8D8D8] outline-0 border-1 p-1.5 focus:border-[#17CFDB] dark:bg-[#2C2C2C] rounded-xl dark:text-white dark:placeholder-[#D8D8D8]"
                    placeholder="说点什么~"
                  ></textarea>
                  <div class="flex items-center justify-between mt-4 w-full">
                    <div class="flex items-center">
                      <div class="username mr-4">
                        <el-input
                          maxlength="10"
                          placeholder="用户名"
                          size="large"
                          v-model="replyUsername"
                        ></el-input>
                      </div>
                      <div class="avatar">
                        <el-avatar :size="40" :icon="UserFilled"></el-avatar>
                      </div>
                    </div>
                    <div class="right btn">
                      <el-button size="large" @click="handleReplyMessageCard"
                        >发表</el-button
                      >
                    </div>
                  </div>
                </div>
              </template>
            </el-popover>
          </div>
          <template v-for="subItem in item.replyMessages" :key="subItem">
            <div
              class="message-reply bg-[#FAFAFA] dark:bg-[#3A3A3A] ml-12 p-4 rounded-lg mt-4"
            >
              <div class="reply-header flex items-center">
                <div class="reply-avatar mr-2">
                  <el-avatar :size="40" :icon="UserFilled"></el-avatar>
                </div>
                <div class="reply-name text-[14px]">
                  <b>{{ subItem.user_name }}</b> 回复 {{ subItem.reply_name }}
                </div>
              </div>
              <div class="reply-content ml-12 bg-transparent">{{ subItem.content }}</div>
              <div class="reply-time text-[12px] ml-12 mt-2">
                {{ subItem.creatAt }}
                <el-popover
                  :width="420"
                  trigger="click"
                  popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                >
                  <template #reference>
                    <span
                      class="ml-4 text-[#17cfdb] cursor-pointer"
                      @click="handleReplyMessage(item.id, subItem.id, subItem.user_name)"
                      >回复</span
                    >
                  </template>
                  <template #default>
                    <div class="flex flex-col items-center mt-6">
                      <textarea
                        id="textarea"
                        rows="4"
                        v-model="replyContent"
                        class="w-full px-4 dark:focus:border-[#D8D8D8] outline-0 border-1 p-1.5 focus:border-[#17CFDB] dark:bg-[#2C2C2C] rounded-xl dark:text-white dark:placeholder-[#D8D8D8]"
                        placeholder="说点什么"
                      ></textarea>
                      <div class="flex items-center justify-between mt-4 w-full">
                        <div class="flex items-center">
                          <div class="username mr-4">
                            <el-input
                              maxlength="10"
                              placeholder="用户名"
                              size="large"
                              v-model="replyUsername"
                            ></el-input>
                          </div>
                          <div class="avatar">
                            <el-avatar :size="40" :icon="UserFilled"></el-avatar>
                          </div>
                        </div>
                        <div class="right btn">
                          <el-button size="large" @click="handleReplyMessageCard"
                            >发表</el-button
                          >
                        </div>
                      </div>
                    </div>
                  </template>
                </el-popover>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
