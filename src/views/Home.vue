<script lang="ts" setup>
import { ref, computed, useTemplateRef, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMomentStore } from "@/store/moment";
import { homeApi } from "@/http/api";
import HolidayCalendar from "holiday-calendar";
import jsCalendar from "js-calendar-converter";
import ArticleList from "./components/ArticleList.vue";
import Typed from "typed.js";
const typedElement = useTemplateRef("typedElement");
const calendar = new HolidayCalendar();

const momentStore = useMomentStore();
const router = useRouter();

const labels = computed(() => momentStore.labels);

const bannerList = ref([]);
const count = ref<Record<string, any>>({});

function getDaysBetweenDates(date1, date2) {
  const timeDiff = Math.abs(new Date(date1).getTime() - new Date(date2).getTime());
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
}

const dayRef = ref<string | number>("");
const year_month = ref("");
const weekDay = ref<string | number>("");

const date = new Date();
const year = date.getFullYear();
let month = (date.getMonth() + 1) as string | number;
const day = date.getDate();
weekDay.value = date.getDay();
const distDay = ref(0);
const holiday = ref("");
year_month.value = `${year}年${month}月`;
dayRef.value = day;
let calYear = year;

if ((day as number) < 10) {
  dayRef.value = `0${day}`;
}

if ((month as number) < 10) {
  month = `0${month}`;
}

if (`${month}-${day}` > "10-01") {
  calYear = year + 1;
}

const lunarDay = jsCalendar.solar2lunar(year, month, day);

calendar.getDates("CN", calYear).then((dates) => {
  for (let i = 0; i < dates.length; i++) {
    if (dates[i].type === "public_holiday" && dates[i].date > `${year}-${month}-${day}`) {
      distDay.value = getDaysBetweenDates(`${year}-${month}-${day}`, dates[i].date);
      holiday.value = dates[i].name;
      break;
    }
  }
});

const getWeekDays = computed(() => {
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  return "星期" + weekDays[weekDay.value];
});

const RunDays = computed(() => {
  return getDaysBetweenDates("2025-12-20", `${year}-${month}-${day}`);
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const momentCount = ref(0);
const bgId = computed(() => getRandomInt(77, 76 + momentCount.value));

const lastUpdateDay = ref("");
const getMomments = async () => {
  const res: any = await homeApi.getMoments(0, 1000);
  if (res.code === 0) {
    momentCount.value = res.data.total;
    lastUpdateDay.value = new Date(res.data.result[res.data.result.length - 1].updateAt)
      .toLocaleDateString()
      .replace(/\//g, ".")
      .split(" ")[0];
  }
};
getMomments();
const getCount = async () => {
  const res: any = await homeApi.getCount();
  if (res.code === 0) {
    count.value = res.data;
  }
};
getCount();

const getBanner = async () => {
  const res: any = await homeApi.getBanner();
  if (res.code === 0) {
    bannerList.value = res.data.result;
    bannerList.value.forEach((item: any) => {
      item.creatAt = new Date(item.creatAt)
        .toLocaleString()
        .split(" ")[0]
        .replace(/\//g, "-");
    });
  }
};
getBanner();
const handleClick = (val) => {
  router.push({
    path: `/articleDetail/${val.id}`,
  });
};

const handleClickTag = (val) => {
  console.log(val);
  router.push({
    path: `/tag/${val.id}`,
  });
};

onMounted(() => {
  new Typed(typedElement.value, {
    strings: [
      "^1000 欢迎光临",
      "^1000 似旅行、似流浪，亦是逃亡",
      "^1000 遇见，获得，失去，成长，释怀，完结，我与旧事归与尽，来年依旧迎花开",
      "^1000 人人都想要结果，但有时经过就是结果",
      "^1000 成为任何角色之前先成为最好的自己",
      "^1000 放下面子赚钱，才是成年人最大的体面",
      "^1000 人生有如一股奔流，没有暗礁，激不起美丽的浪花",
      "^1000 跳出三贷之外，不在五险之中",
      "^1000 日落跌入昭昭星野，人间忽晚，山河已秋",
      "^1000 切视他人之凝目如盏盏鬼火，大胆去走自己的夜路",
    ],
    backDelay: 1500,
    typeSpeed: 100,
    backSpeed: 50,
    loop: true,
  });
});

const handleScroll = () => {
  window.scrollTo({
    top: window.innerHeight - 64,
    behavior: "smooth",
  });
};
</script>

<template>
  <div class="home-container">
    <div
      class="home-bg animate__animated animate__fadeIn bg-cover bg-fixed"
      ref="homeBg"
      :style="{
        'background-image': `url(http://120.55.66.25:8000/file/${bgId})`,
        margin: '0 calc((100% - 100vw) / 2)',
        height: 'calc(100vh - 64px)',
      }"
    >
      <div
        class="flex flex-col justify-around items-center"
        :style="{
          height: 'calc(100vh - 64px)',
        }"
      >
        <div class="flex flex-col items-center mt-32">
          <div class="home-bg-title text-5xl text-white font-bold">Fractures_的博客</div>
          <div class="home-bg-content text-2xl text-white mt-8 flex">
            <span ref="typedElement"></span>
          </div>
        </div>
        <div class="animate-bounce">
          <el-icon @click="handleScroll" class="rotate-90" size="48" color="#fff"
            ><DArrowRight
          /></el-icon>
        </div>
      </div>
      <div class="max-w-[1440px]" style="margin: 0 auto">
        <div class="banner mx-[40px]">
          <!-- <div class="title flex h-[60px] items-center jutify-center">
          <img class="h-[18px] w-[18px]" src="@/assets/notice.svg" alt="" srcset="" />
          <span>&nbsp;我这个人走得很慢，但是我从不后退。</span>
        </div> -->
          <div class="banner-content border-rad mt-4">
            <el-carousel :interval="3000" arrow="always" class="rounded-xl">
              <el-carousel-item
                v-for="item in bannerList"
                :key="item"
                @click="handleClick(item)"
                :style="{ backgroundImage: `url(${item.cover_image})` }"
              >
                <div
                  class="backdrop-blur-xl font-[PingFang] text-white w-full h-full flex"
                >
                  <img :src="item.cover_image" class="carouselLeft" alt="" />
                  <div class="mx-[72px]">
                    <div class="mt-[32px] text-sm">{{ item.creatAt }}</div>
                    <div class="mt-[43px] text-[34px] font-bold cursor-pointer">
                      {{ item.title }}
                    </div>
                    <div class="mt-[32px] font-bold">
                      <span
                        class="text-[16px] w-3/4 leading-8 line-clamp-2 overflow-hidden overflow-ellipsis"
                        >{{ item.description }}</span
                      >
                    </div>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <div class="home-container-content flex mt-[12px]">
          <div class="left mt-[40px] ml-[40px] w-[335px]" style="flex-shrink: 0">
            <div class="bg-[#FAFAFA] rounded-lg overflow-hidden dark:bg-[#3A3A3A]">
              <div class="flex flex-col items-center">
                <div class="relative">
                  <img
                    class="avatar w-[100px] h-[100px] mb-[24px] mt-[42px] rounded-full"
                    src="../static/png/avatar.jpg"
                    alt="avatar"
                  />
                </div>
                <span class="text-[24px] dark:text-white text-[#1D1D1D] font-[DINPro]"
                  >Fractures_</span
                ><span
                  class="dark:text-[#D8D8D8] decoration-sky-500 mt-[12px] font-[DINPro]"
                  >保持热爱，奔赴山海</span
                >
                <div class="flex w-full mt-[32px]">
                  <div class="flex-1 flex justify-center items-center">
                    <div class="mr-[1px]">
                      <svg style="width: 52px; height: 52px">
                        <use xlink:href="#icon-qq" fill="red"></use>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 flex justify-center items-center">
                    <div class="mr-[1px]">
                      <svg style="width: 52px; height: 52px">
                        <use xlink:href="#icon-email" fill="red"></use>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 flex justify-center items-center">
                    <div class="mr-[1px]">
                      <svg style="width: 52px; height: 52px">
                        <use xlink:href="#icon-weixin" fill="red"></use>
                      </svg>
                    </div>
                  </div>
                </div>
                <div
                  class="text-[#1D1D1D] flex w-full text-[14px] mb-[42px] font-bold hover:cursor-pointer mt-[32px] justify-center items-center dark:text-white text-center"
                >
                  <div class="hover:text-[#17CFDB] flex-1">
                    <div class="text-[24px] font-[DINPro]">{{ count.moment }}</div>
                    <div>文章</div>
                  </div>
                  <div class="hover:text-[#17CFDB] flex-1">
                    <div class="text-[24px] font-[DINPro]">{{ count.categary }}</div>
                    <div>分类</div>
                  </div>
                  <div class="hover:text-[#17CFDB] flex-1">
                    <div class="text-[24px] font-[DINPro]">{{ count.label }}</div>
                    <div>标签</div>
                  </div>
                  <div class="hover:text-[#17CFDB] flex-1">
                    <div class="text-[24px] font-[DINPro]">{{ count.message }}</div>
                    <div>留言</div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="mt-[32px] hover:border-black block p-6 dark:text-white text-[#1D1D1D] bg-[#FAFAFA] rounded-lg dark:bg-[#3A3A3A]"
            >
              <div class="flex font-[DINPro] gap-8">
                <div class="ml-3">{{ year_month }}</div>
                <div>
                  {{ lunarDay.gzYear }}{{ lunarDay.Animal }}年 {{ lunarDay.IMonthCn
                  }}{{ lunarDay.IDayCn }}
                </div>
              </div>
              <div class="flex gap-8 font-[DINPro]">
                <div class="font-[DINPro] text-[60pt]">{{ dayRef }}</div>
                <div class="mt-8">
                  <div class="text-xl">{{ getWeekDays }}</div>
                  <div class="mt-2">距离{{ holiday }}还有{{ distDay }}天</div>
                </div>
              </div>
              <hr class="h-px bg-gray-200 border-0 dark:bg-white" />
              <div class="text-sm mt-4 font-[DINPro] dark:text-[#D8D8D8]">
                <div class="mt-2">粗茶淡饭不要紧，朋友散场没关系</div>
                <div class="mt-2">兵荒马乱也无所谓</div>
                <div class="mt-2">只要你拥有热气腾腾的灵魂，日子就不会差</div>
              </div>
            </div>
            <div
              class="mt-[32px] hover:border-black block p-6 bg-[#FAFAFA] rounded-lg dark:bg-[#3A3A3A]"
            >
              <div class="flex items-center">
                <span class="text-[#1D1D1D] text-[20px] dark:text-white px-1 font-bold"
                  >标签</span
                >
              </div>
              <div class="break-words mt-[12px]">
                <template v-for="item in labels" :key="item">
                  <span
                    @click="handleClickTag(item)"
                    class="hover:text-[#17CFDB] dark:hover:text-[#17CFDB] text-[#1D1D1D] leading-10 dark:text-[#D8D8D8] text-[14px] hover:cursor-pointer mr-[24px]"
                  >
                    #{{ item.name }}
                    <span class="text-[#17CFDB]">{{ item.link_count }}</span></span
                  >
                </template>
              </div>
            </div>
            <div
              class="mt-[32px] mb-[72px] block dark:text-gray-500 p-6 bg-[#FAFAFA] rounded-lg dark:bg-[#3A3A3A] dark:border-[#3A3A3A]"
            >
              <div class="flex items-center">
                <span class="text-[#1D1D1D] text-[20px] dark:text-white px-1 font-bold"
                  >网站资讯</span
                >
              </div>
              <div class="flex text-[14px] text-[#1D1D1D] dark:text-[#D8D8D8]">
                <div>
                  <span class="flex mt-[24px]"
                    ><p>文章数目: {{ momentCount }}</p></span
                  ><span class="flex mt-[16px]"
                    ><p>最后更新: {{ lastUpdateDay }}</p></span
                  >
                </div>
                <div class="ml-[24px]">
                  <span class="flex mt-[24px]"
                    ><p>运行时长: {{ RunDays }} 天</p></span
                  >
                </div>
              </div>
              <span class="flex text-[14px] mt-[24px] text-[#17CFDB]"
                >欢迎各位友友光临 🎉</span
              >
            </div>
          </div>
          <div class="right ml-10 mt-10 flex-1">
            <span class="text-[20px] text-[#1D1D1D] dark:text-white px-1 font-bold"
              >文章列表</span
            >
            <ArticleList :prop-size="6"></ArticleList>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.typed-cursor {
  color: white;
  font-weight: bold;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
<style lang="scss" scoped>
.animate__animated {
  --animate-duration: 1.5s; /* 持续时间改为2秒 */
}
.home-container {
  .banner {
    .banner-content {
      .carouselLeft {
        -webkit-clip-path: polygon(0% 0%, 100% 0%, 90% 100%, 0% 100%);
        clip-path: polygon(0% 0%, 100% 0%, 90% 100%, 0% 100%);
      }
    }
  }
}
</style>
