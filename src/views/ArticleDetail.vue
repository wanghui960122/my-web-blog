<script lang="ts" setup>
import { useRoute } from "vue-router";
import { articleApi } from "@/http/api";
import { ref } from "vue";
import ArticleComment from "./components/ArticleComment.vue";
import ArticleBack from "./components/ArticleBack.vue";

import { MdPreview, MdCatalog } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";

document.body.scrollTop = 0;

const id = "preview-only";
const text = ref("");
const scrollElement = document.documentElement;
const route = useRoute();
const articleId = route.params.articleId;
const articleInfo = ref<Record<string, any>>({});
const getArticleDetail = async (articleId) => {
  const res: any = await articleApi.getArticleDetail(articleId);
  if (res.code === 0) {
    text.value = res.data.content;
    articleInfo.value = res.data;
    articleInfo.value.creatAt = new Date(articleInfo.value.creatAt)
      .toLocaleString()
      .split(" ")[0];
    articleInfo.value.updateAt = new Date(articleInfo.value.updateAt)
      .toLocaleString()
      .split(" ")[0];
  }
};

if (articleId) {
  getArticleDetail(articleId);
}
</script>
<template>
  <div class="article-detail">
    <ArticleBack :articleInfo="articleInfo"></ArticleBack>

    <div class="article-detail-content flex">
      <div class="left mb-20 flex-1 mt-[60px] ml-[100px]">
        <MdPreview class="pl-12 pr-12" :id="id" :modelValue="text" />
        <ArticleComment></ArticleComment>
      </div>
      <div class="right dark:text-[#fff] w-[254px] font-[14px]">
        <div class="top-[87px] sticky rounded mt-[80px] ml-[48px]">
          <MdCatalog class="md-catalog" :editorId="id" :scrollElement="scrollElement" />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.article-detail {
  ol {
    list-style-type: decimal;
    padding-left: 2em;
  }

  /* 恢复无序列表样式 */
  ul {
    list-style-type: disc;
    padding-left: 2em;
  }
}
</style>
<style lang="scss">
.md-catalog {
  :dep(.md-editor-catalog-wrapper) {
    span {
      font-size: 14px !important;
    }
  }
}
</style>
