<script lang="ts" setup>
import { onMounted, ref, useTemplateRef } from "vue";
import { timelineApi } from "@/http/api";
import { useRouter } from "vue-router";
let size = -4;
const router = useRouter();
const timelineObj = ref<Record<string, any>>({});
const timelineList = ref([]);
const getTimeline = async () => {
  const res: any = await timelineApi.getTimeline(size);
  timelineList.value.push(...res.data);
  timelineObj.value = timelineList.value.reduce((acc, item) => {
    let { year, month } = item;
    year = year + "@";
    month = month + "@";
    // 如果年份不存在，则创建年份对象
    if (!acc[year]) {
      acc[year] = {};
    }

    // 如果月份不存在，则创建月份数组
    if (!acc[year][month]) {
      acc[year][month] = [];
    }

    // 将当前项添加到对应的月份数组中
    acc[year][month].push(item);

    return acc;
  }, {});
  if (res.data.length < 4) {
    isLoaded.value = true;
  }
};
const handleNextPage = () => {
  size += 4;
  getTimeline();
};

const load = useTemplateRef("loadRef");
const isLoaded = ref(false);
const observe = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !isLoaded.value) {
      handleNextPage();
    }
  },
  {
    rootMargin: "20px", //定义根组件的边距 用于扩展/缩小检测范围
  }
);
onMounted(() => {
  if (load) {
    observe.observe(load.value);
  }
});
const formMatTime = (time: string) => {
  return new Date(time).toLocaleString().split(" ")[0].replace(/\//g, "-");
};
const handleClick = (item) => {
  router.push({
    path: `/articleDetail/${item.id}`,
  });
};

const itemMap = new WeakMap()
const isInview = (el) => {  
  return el.getBoundingClientRect().top < window.innerHeight
}
const observeItem = new IntersectionObserver(
  (entries) => {
   for (const entry of entries) {
    if (entry.isIntersecting) {
      itemMap.get(entry.target)
      entry.target.classList.add('animate__animated', 'animate__fadeInUp')
      observeItem.unobserve(entry.target)
    }
    }
  },
  {
    rootMargin: "0px", //定义根组件的边距 用于扩展/缩小检测范围
  }
)
// animate__animated animate__fadeInUp
const vSlideIn = {
  mounted(el: any) {
    if (isInview(el)) {
      return
    }
    itemMap.set(el, el)
    observeItem.observe(el);
  },
  unmounted(el: any) {
    observeItem.unobserve(el);
  },
}

</script>
<template>
  <div class="flex justify-center items-center mt-[24px]">
    <div class="max-w-[1200px]">
      <template v-for="(item, key) in timelineObj" :key="item">
        <div class="ml-12 md:ml-0">
          <div class="relative right-1.5">
            <div class="relative right-5 text-[#17CFDB] text-[32px]">
              {{ key.split("@")[0] }}
            </div>
            <div class="w-3 relative top-8 h-3 rounded-full bg-[#17CFDB]"></div>
          </div>
          <ol class="relative border-s border-black dark:border-gray-700">
            <li class="mb-8 ml-12" v-for="(subItem, subKey) in item" :key="subItem">
              <div
                class="absolute -start-[45px] mt-20 flex justify-between items-center w-[50px]"
              >
                <div class="text-sm dark:text-white text-[#1D1D1D]">
                  {{ subKey.split("@")[0] }}月
                </div>
                <div
                  class="w-3 h-3 rounded-full border bg-[#F6F6F6] dark:bg-[#2C2C2C] border-[#17CFDB] ml-0.5"
                ></div>
              </div>
              <div
                v-slide-in
                class="flex items-center mt-8 bg-[#FAFAFA] dark:bg-[#3A3A3A] rounded-xl"
                v-for="cItem in subItem"
                @click="handleClick(cItem)"
              >
                <div class="p-[32px] w-[660px]">
                  <div class="text-[24px] dark:text-white text-[#1D1D1D]">
                    {{ cItem.title }}
                  </div>
                  <div
                    class="mt-[12px] leading-8 text-sm dark:text-[#D8D8D8] text-[#7E7E7E] ellipsis line-clamp-2"
                  >
                    {{ cItem.description }}
                  </div>
                  <div class="mt-[16px] text-[12px] text-[#7E7E7E]">
                    {{ cItem.author.name }} <span class="text-[#17CFDB]">·</span> 发布于
                    {{ formMatTime(cItem.creatAt) }}
                  </div>
                </div>
                <div class="ml-auto px-4 pb-4 py-4 w-[280px] bg-cover">
                  <img class="rounded-xl" :src="cItem.cover_image" alt="封面" />
                </div>
              </div>
            </li>
          </ol>
        </div>
      </template>
      <div
        ref="loadRef"
        v-if="!isLoaded"
        class="mb-20 flex justify-center text-[#17CFDB] cursor-pointer"
      >
        加载更多...
      </div>
    </div>
  </div>
</template>
