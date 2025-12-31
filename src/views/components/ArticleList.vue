<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { homeApi, labelApi } from "@/http/api";
import { useMomentStore } from "@/store/moment";

interface MyProps {
  propSize: number;
  tagId?: number;
}
const props = withDefaults(defineProps<MyProps>(), {
  propSize: 6,
});

const activeId = ref(0);
let activeCategary = ref("全部文章");
let offset = 0;
let size = 6;

const getArticleList = async () => {
  const res: any = await homeApi.getMoments(offset, size, activeId.value);
  // labelApi.getCommentsBylabel(offset, size, activeId.value)
  articleList.value = res.data.result;
  total.value = res.data.total;
};
const getArticleListByLabelId = async () => {
  const res: any = await labelApi.getCommentsBylabel(offset, size, props.tagId);
  articleList.value = res.data.result;
  total.value = res.data.total;
};

watch(
  () => props.propSize,
  (newVal) => {
    size = newVal;
    if (!props.tagId) {
      getArticleList();
    }
  },
  { immediate: true }
);

watch(
  () => props.tagId,
  (newVal) => {
    if (newVal) {
      getArticleListByLabelId();
    } else {
      getArticleList();
    }
  },
  { immediate: true }
);

const router = useRouter();
const route = useRoute();

const isTag = route.path == "/tag";
const isCategary = route.path == "/category";
const momentStore = useMomentStore();
const categaryList = computed(() => momentStore.categarys);
const getLabelName = (id: string) => {
  const item = categaryList.value.find((item) => item.id == id);
  if (item) {
    return item.name;
  }
};
const articleList = ref([]);
const handleClick = (item) => {
  activeId.value = item.id;
  activeCategary.value = item.name || "全部文章";
  offset = 0;
  getArticleList();
};
const total = ref(0);

const formMatTime = (time: string) => {
  return new Date(time).toLocaleString().split(" ")[0].replace(/\//g, "-");
};

const handleChange = (val) => {
  offset = (val - 1) * size;
  if (props.tagId) {
    getArticleListByLabelId();
  } else {
    getArticleList();
  }
};

const goToArticleDetail = (item) => {
  router.push({
    path: `/articleDetail/${item.id}`,
  });
};
</script>
<template>
  <div class="article-list mt-[32px]">
    <div
      class="el-scrollbar"
      :class="{
        flex: propSize == 8,
        'justify-center': propSize == 8,
      }"
    >
      <div v-if="!isTag" class="el-scrollbar__wrap el-scrollbar__wrap--hidden-default">
        <div class="el-scrollbar__view">
          <div class="flex items-center rounded-xl">
            <div
              @click="handleClick({ id: 0 })"
              class="py-[6px] mr-[16px] px-[8px] cursor-pointer bg-[#FAFAFA] hover:text-[#17CFDB] rounded-xl dark:bg-[#3A3A3A] dark:hover:text-[#17CFDB] dark:text-[#7E7E7E] scrollbar-demo-item"
              :class="{
                active: activeId == 0,
              }"
            >
              全部文章
            </div>
            <template v-for="item in categaryList" :key="item">
              <div class="scrollbar-demo-item" @click="handleClick(item)">
                <div
                  class="py-[6px] mr-[16px] px-[8px] cursor-pointer bg-[#FAFAFA] hover:text-[#17CFDB] rounded-xl dark:bg-[#3A3A3A] dark:hover:text-[#17CFDB] dark:text-[#7E7E7E]"
                  :class="{
                    active: activeId == item.id,
                  }"
                >
                  {{ item.name }}
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="el-scrollbar__bar is-horizontal" style="display: none">
        <div class="el-scrollbar__thumb" style="transform: translateX(0%)"></div>
      </div>
      <div class="el-scrollbar__bar is-vertical" style="display: none">
        <div class="el-scrollbar__thumb" style="transform: translateY(0%)"></div>
      </div>
    </div>
    <template v-if="propSize === 8 && isCategary">
      <div
        class="text-[#1D1D1D] dark:text-white mt-[48px] text-[32px] font-bold justify-center items-center flex"
      >
        {{ activeCategary }}
      </div>
      <div
        class="flex dark:text-[#FFFFFF] text-[#7E7E7E] text-sm justify-center items-center mt-[12px]"
      >
        以下内容均是关于{{ activeCategary }}的记录
      </div>
    </template>
    <div
      class="flex flex-wrap gap-8 mt-4"
      :class="{
        'ml-12 animate__animated animate__fadeInUp': isCategary,
      }"
    >
      <template v-for="item in articleList" :key="item">
        <div
          class="bg-[#FAFAFA] dark:bg-[#3A3A3A] text-[#FFFFFF] rounded-xl transition duration-150 ease-in-out hover:-translate-y-2"
          :class="[
            propSize == 6 ? 'w-auto-width-home' : isCategary ? 'w-auto-width' : '',
            isTag ? 'flex w-[508px] p-3 w-auto-width-tag' : 'w-[309px]',
          ]"
          @click="goToArticleDetail(item)"
        >
          <div
            class="rounded-xl bg-cover"
            :class="[
              !isTag && !isCategary ? 'box' : '',
              isTag ? 'w-[200px] shrink-0' : 'w-full h-[200px]',
            ]"
            :style="{
              'background-image': `url(${item.cover_image})`,
            }"
          >
            <div v-if="!isTag && !isCategary" class="text-white">
              <div
                class="text-sm whitespace-nowrap rounded p-1 inline-block"
                :class="{
                  'backdrop-blur-3xl': !isTag && !isCategary,
                }"
              >
                {{ getLabelName(item.categary_id) }}
              </div>
            </div>
          </div>
          <div class="mx-[16px] mt-[8px]">
            <span
              class="title dark:text-white cursor-pointer text-[#1D1D1D] text-[24px] font-bold line-clamp-1"
              >{{ item.title }}</span
            >
            <div
              v-if="!isTag"
              class="flex gap-[12px] mt-[4px] text-[12px] text-[#17CFDB]"
            >
              <div v-for="subItem in item.labels"># {{ subItem.name }}</div>
            </div>
            <div
              class="mt-[12px] dark:text-[#D8D8D8] text-[#7E7E7E] text-[14px] leading-6 ellipsis line-clamp-2"
            >
              {{ item.description }}
            </div>
            <div class="mt-[8px] text-[12px] text-[#7E7E7E] mb-[20px]">
              <span
                >{{ item.author.name }}
                <span class="text-[#17CFDB]">·</span>
                发布于{{ formMatTime(item.creatAt) }}</span
              >
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="mt-10 mb-20 flex w-full justify-center pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        size="large"
        :page-size="size"
        @current-change="handleChange"
        :total="total"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.animate__animated {
  --animate-duration: .5s; /* 持续时间改为2秒 */
}
:deep(.el-page .is-active) {
  background-color: rgb(23, 207, 219);
}
.active {
  color: white;
  background: rgb(23, 207, 219);
}
.box {
  mask-image: linear-gradient(rgb(227, 227, 227), 80%, transparent);
}
.title {
  background: linear-gradient(to right, #ff5f5f, #28c849) no-repeat right bottom;
  background-size: 0 2px;
  transition: background-size 0.5s;
  &:hover {
    background-position: left bottom;
    background-size: 100% 2px;
  }
}
.w-auto-width {
  @media (width < 1440px) {
    width: 295px;
  }
  @media (width < 1280px) {
    width: 255px;
  }
}
.w-auto-width-home {
  @media (width < 1440px) {
    width: 285px;
  }
  @media (width < 1280px) {
    width: 360px;
  }
}
.w-auto-width-tag {
 @media (width < 1320px) {
    width: 495px;
  }
  @media (width < 1280px) {
    width: 442px;
  }
}
</style>
