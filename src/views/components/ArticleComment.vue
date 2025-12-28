<script lang="ts" setup>
import { UserFilled } from "@element-plus/icons-vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { articleApi } from "@/http/api";

const route = useRoute();
const articleId = route.params.articleId as string;
const commentList = ref([]);
const comments = ref([]);
const getArticleComments = async (articleId) => {
  const res: any = await articleApi.getArticleComments(articleId);
  if (res.code === 0) {
    commentList.value = res.data;
    comments.value = res.data;
    const replyComments = commentList.value.filter((item) => {
      item.creatAt = new Date(item.creatAt).toLocaleString();
      return item.parent_id;
    });
    commentList.value = commentList.value.filter((item) => !item.parent_id);
    commentList.value.forEach((item) => {
      item.replyComments = [];
      replyComments.forEach((replyItem) => {
        if (item.id === replyItem.parent_id) {
          item.replyComments.push(replyItem);
        }
      });
    });
  }
};

if (articleId) {
  getArticleComments(articleId);
}
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
  const res: any = await articleApi.addArticleComment({
    momentId: articleId,
    username: username.value,
    content: content.value,
  });
  if (res.code === 0) {
    getArticleComments(articleId);
  }
};

const replyContent = ref("");
const replyUsername = ref("");
const replyCommnetId = ref("");
const replyParentId = ref("");
const replyNameRef = ref("");
const handleReplyComment = (parentId: string, commentId: string, replyName: string) => {
  replyContent.value = "";
  replyUsername.value = "访客";
  replyCommnetId.value = commentId;
  replyNameRef.value = replyName;
  replyParentId.value = parentId;
};
const handleReplyCommentCard = async () => {
  if (!replyContent.value) {
    ElMessage.error("评论内容不能为空");
    return;
  }
  if (!replyUsername.value) {
    ElMessage.error("用户名不能为空");
    return;
  }
  const res: any = await articleApi.replyArticleComment({
    commentId: replyCommnetId.value,
    momentId: articleId,
    username: replyUsername.value,
    content: replyContent.value,
    parentId: replyParentId.value,
    replyName: replyNameRef.value,
  });
  if (res.code === 0) {
    getArticleComments(articleId);
  }
};
</script>
<template>
  <div class="article-comment mt-8">
    <div class="comment-header">
      <div class="comment-header-title text-[22px] dark:text-[#fff]">
        评论 ({{ comments.length }})
      </div>
      <div class="comment-header-input flex flex-col items-center mt-6">
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
                class="dark:focus:border-[#D8D8D8] focus:border-[#17CFDB] dark:bg-gradient-to-b dark:from-[#2C2C2C] dark:to-[#333333] dark:placeholder-[#D8D8D8] dark:text-white"
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
    <div class="comment-list mt-8">
      <template v-for="item in commentList" :key="item">
        <div class="item dark:text-[#fff] mt-4">
          <div class="item-header flex items-center">
            <div class="comment-avatar mr-2">
              <el-avatar :size="40" :icon="UserFilled"></el-avatar>
            </div>
            <div class="comment-name text-[14px]">{{ item.user_name }}</div>
          </div>
          <div class="comment-content ml-12 bg-transparent">{{ item.content }}</div>
          <div class="comment-time text-[12px] ml-12 mt-2">
            {{ item.creatAt }}
            <el-popover
              :width="420"
              trigger="click"
              popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
            >
              <template #reference>
                <span
                  class="ml-4 text-[#17cfdb] cursor-pointer"
                  @click="handleReplyComment(item.id, item.id, item.user_name)"
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
                      <el-button size="large" @click="handleReplyCommentCard"
                        >发表</el-button
                      >
                    </div>
                  </div>
                </div>
              </template>
            </el-popover>
          </div>
          <template v-for="subItem in item.replyComments" :key="subItem">
            <div
              class="comment-reply bg-[#FAFAFA] dark:bg-[#3A3A3A] ml-12 p-4 rounded-lg mt-4"
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
                      @click="handleReplyComment(item.id, subItem.id, subItem.user_name)"
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
                          <el-button size="large" @click="handleReplyCommentCard"
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
