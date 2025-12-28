<script lang="ts" setup>
import { useMomentStore } from "@/store/moment";
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { articleApi } from "@/http/api";
const route = useRoute();
interface MyProps {
  articleInfo: Record<string, any>;
}
const props = withDefaults(defineProps<MyProps>(), {
  articleInfo: () => ({}),
});

const articleId = route.params.articleId as string;
const comments = ref([]);
const getComments = async () => {
  const res: any = await articleApi.getArticleComments(articleId);
  comments.value = res.data;
};
if (articleId) {
  getComments();
}
const momentStore = useMomentStore();

const categarys = computed(() => momentStore.categarys) as any;
const labels = computed(() => momentStore.labels) as any;

const catagaryName = ref("");
const labelTags = ref([]);

watch(
  () => props.articleInfo,
  () => {
    if (props.articleInfo.categary_id && categarys.value.length) {
      const val = categarys.value.find(
        (item: any) => item.id === props.articleInfo.categary_id
      );
      catagaryName.value = val.name;
    }

    if (props.articleInfo.labels && labels.value.length) {
      labelTags.value = props.articleInfo.labels.map((item) => {
        const val = labels.value.find((subItem) => item.id === subItem.id);
        return {
          label: val.name,
          value: item.id,
        };
      });
    }
  }
);
</script>
<template>
  <div class="article-back">
    <div
      class="text-white p-10 bg-cover bgImg h-[87vh]"
      :style="{
        'background-image': `url(${articleInfo.cover_image})`,
      }"
    >
      <div class="absolute left-[10%] bottom-[10%] ml-[80px]">
        <div class="text-[32px] font-bold">{{ articleInfo.title }}</div>
        <div class="mt-[16px] flex items-center">
          <div class="mr-[1px] flex items-center">
            <el-icon size="16"><Files /></el-icon>
          </div>
          <div class="text-sm mr-[24px]">{{ catagaryName }}</div>
          <div class="gap-[16px] text-sm" v-for="item in labelTags">
            #{{ item.label }}&nbsp;
          </div>
        </div>
        <div class="mt-[32px] flex gap-6 text-[12px]">
          <div class="p-[16px] min-w-[180px] rounded-xl backdrop-blur-3xl">
            <div class="mr-[1px]">
              <el-icon size="16"><Calendar /></el-icon>
            </div>
            <div class="mt-[8px]">发布时间 : {{ articleInfo.creatAt }}</div>
            <div class="mt-[8px]">编辑时间 : {{ articleInfo.updateAt }}</div>
          </div>
          <div class="p-[16px] mt-0 min-w-[180px] rounded-xl backdrop-blur-3xl">
            <div class="mr-[1px]">
              <el-icon size="16px"><Reading /></el-icon>
            </div>
            <div class="mt-[8px]">
              字数统计 : 约 {{ (articleInfo.content?.length / 1000).toFixed(1) }} k
            </div>
            <div class="mt-[8px]">
              阅读时间 : 约 {{ (articleInfo.content?.length / 300).toFixed(1) }}分钟
            </div>
          </div>
          <div class="p-[16px] mt-0 min-w-[180px] rounded-xl backdrop-blur-3xl">
            <div class="mr-[1px]">
              <el-icon size="14"><Star /></el-icon>
            </div>
            <div class="mt-[8px]">阅读次数 : {{ articleInfo.read_count }}</div>
            <div class="mt-[8px]">评论次数 : {{ comments.length }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script></script>
<style lang="scss" scoped>
.article-back {
  margin: 0 calc((100% - 100vw) / 2);
}
.bgImg {
  background-attachment: fixed;
}
</style>
