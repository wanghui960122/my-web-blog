<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useMomentStore } from "@/store/moment";
import ArticleList from "./components/ArticleList.vue";

const momentStore = useMomentStore();
const route = useRoute();
const tagId = computed(() => route.params.tagId);
const activeId = ref(0);

const handleClick = (item: any) => {
  activeId.value = item.id;
};
if (tagId.value) {
  handleClick({
    id: tagId.value,
  });
}
const labels = computed(() => momentStore.labels);
</script>
<template>
  <div class="ml-12 flex">
    <div class="el-scrollbar shrink-0">
      <div class="el-scrollbar__wrap el-scrollbar__wrap--hidden-default">
        <div class="el-scrollbar__view" style="">
          <div class="md:block flex w-52">
            <div
              class="dark:text-white scrollbar-demo-item text-[#1D1D1D] hover:text-[#17CFDB] hover:cursor-pointer md:mt-8 mt-4"
              @click="
                handleClick({
                  id: 0,
                })
              "
              :class="{
                'is-active': activeId == 0,
              }"
            >
              # 全部
            </div>
            <div
              v-for="item in labels"
              :key="item"
              @click="handleClick(item)"
              class="flex dark:text-white scrollbar-demo-item text-[#1D1D1D] hover:text-[#17CFDB] hover:cursor-pointer md:ml-0 ml-4 mt-4"
              :class="{
                'is-active': activeId == item.id,
              }"
            >
              # {{ item.name }} {{ item.link_count }}
            </div>
          </div>
        </div>
      </div>
      <div class="el-scrollbar__bar is-vertical" style="display: none">
        <div class="el-scrollbar__thumb" style="transform: translateY(0%)"></div>
      </div>
    </div>
    <div class="w-full">
      <ArticleList :prop-size="8" :tag-id="activeId" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.is-active {
  color: rgb(23, 207, 219);
}
</style>
