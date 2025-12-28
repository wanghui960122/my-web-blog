<script setup lang="ts">
import BaseHeader from "./components/BaseHeader.vue";
import BaseFooter from "./components/BaseFooter.vue";
import { useMomentStore } from "@/store/moment";
import { useUserStore } from "@/store/user";
const momentStore = useMomentStore();
const userStore = useUserStore();
userStore.getMenu();
momentStore.getLabels();
momentStore.getCategarys();
</script>

<template>
  <div
    class="font-[PingFang] bg-white bg-cover bg-no-repeat dark:bg-[#2C2C2C] w-min-[1440px]"
  >
    <BaseHeader></BaseHeader>
    <main class="container flex flex-col max-w-[1440px] mx-auto">
      <RouterView></RouterView>
    </main>
    <el-backtop :visibility-height="200" :right="24" :bottom="200" />
    <!-- <BaseFooter></BaseFooter> -->
  </div>
</template>

<style scoped lang="scss">
.container {
  min-height: calc(100vh - 60px - 64px);
}
</style>
