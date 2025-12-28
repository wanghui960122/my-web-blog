<template>
  <div class="editor-container flex-1 flex flex-col">
    <div class="header w-full flex justify-between items-center mt-6">
      <div class="title flex-1">
        <el-form-item
          label-width="108"
          label="标题："
          :rules="[{ required: true, message: '请输入标题' }]"
        >
          <el-input v-model="articleInfo.title"></el-input>
        </el-form-item>
      </div>
      <div class="description flex-1 ml-10">
        <el-form-item
          label-width="108"
          label="描述："
          :rules="[{ required: true, message: '请输入描述' }]"
        >
          <el-input v-model="articleInfo.description"></el-input>
        </el-form-item>
      </div>
    </div>
    <div class="flex items-center mt-4 mb-4">
      <div class="categary flex-1 mr-10">
        <el-form-item
          label="文章分类："
          label-width="108"
          :rules="[{ required: true, message: '请选择文章分类' }]"
        >
          <div class="flex gap-2">
            <el-tag
              v-for="tag in categaryTags"
              :key="tag"
              closable
              size="large"
              :disable-transitions="false"
              @close="handleCloseCategary(tag)"
            >
              {{ tag.label }}
            </el-tag>
            <el-select
              v-if="inputCategaryVisible"
              v-model="inputCategaryValue"
              filterable
              allow-create
              @change="handleCategaryInputConfirm"
              default-first-option
              @keyup.enter="handleCategaryInputConfirm"
              :reserve-keyword="false"
              @blur="handleCategaryInputConfirm"
              placeholder="选择文章分类"
            >
              <el-option
                v-for="item in categaryList"
                :key="item.value"
                :label="item.label"
                :value="item"
              />
            </el-select>
            <el-button
              v-else
              class="button-new-tag"
              size="middle"
              @click="showCategaryInput"
            >
              + 添加文章分类
            </el-button>
          </div>
        </el-form-item>
      </div>
      <div class="label flex-1">
        <el-form-item
          label="文章标签："
          label-width="108"
          :rules="[{ required: true, message: '请选择文章标签' }]"
        >
          <div class="flex gap-2">
            <el-tag
              v-for="tag in labelTags"
              :key="tag"
              size="large"
              closable
              :disable-transitions="false"
              @close="handleCloseLabel(tag)"
            >
              {{ tag.label }}
            </el-tag>
            <el-select
              v-if="inputLabelVisible"
              v-model="inputLabelValue"
              filterable
              allow-create
              @change="handleLabelInputConfirm"
              default-first-option
              @keyup.enter="handleLabelInputConfirm"
              :reserve-keyword="false"
              @blur="handleLabelInputConfirm"
              placeholder="选择文章标签"
              style="width: 240px"
            >
              <el-option
                v-for="item in labelList"
                :key="item.value"
                :label="item.label"
                :value="item"
              />
            </el-select>
            <el-button
              v-else
              class="button-new-tag"
              size="middle"
              @click="showLabelInput"
            >
              + 添加文章标签
            </el-button>
          </div>
        </el-form-item>
      </div>
    </div>
    <div class="uplaod flex items-center text-[#606266] mb-4">
      <div><span class="text-[red]">*</span> 封面图上传：</div>
      <div>
        <el-upload
          action="#"
          list-type="picture-card"
          v-model:file-list="uploadFile"
          :limit="1"
          :auto-upload="false"
        >
          <el-icon><Plus /></el-icon>

          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <el-icon><zoom-in /></el-icon>
                </span>
                <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <el-icon><Delete /></el-icon>
                </span>
              </span>
            </div>
          </template>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </div>
    </div>
    <div class="editor w-full flex-1 flex flex-col min-h-0">
      <MdEditor
        v-model="articleInfo.content"
        @onUploadImg="onUploadImg"
        @onSave="onSave"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick, computed, isReactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { MdEditor } from "md-editor-v3";
import { articleApi, baseUrl } from "@/http/api";
import type { InputInstance } from "element-plus";
import { useMomentStore } from "@/store/moment";

const momentStore = useMomentStore();

const labels = computed(() => momentStore.labels) as any;
const categarys = computed(() => momentStore.categarys) as any;

const route = useRoute();
const router = useRouter();
const uploadFile = ref([]);

const articleInfo = reactive({
  title: "",
  description: "",
  content: "",
  coverImage: "",
  labels: [],
  categary: [],
});

const inputLabelValue = ref({});
const inputCategaryValue = ref({});
const categaryList = ref([]);
const labelList = ref([]);
const categaryTags = ref([]);
const labelTags = ref([]);

if (labels.value.length) {
  labelList.value = labels.value.map((item) => ({
    label: item.name,
    value: item.id,
  }));
}
if (categarys.value.length) {
  categaryList.value = categarys.value.map((item) => ({
    label: item.name,
    value: item.id,
  }));
}
const inputLabelVisible = ref(false);
const inputCategaryVisible = ref(false);
const InputRef = ref<InputInstance>();

const handleCloseLabel = (tag: string) => {
  labelTags.value.splice(labelTags.value.indexOf(tag), 1);
};

const handleCloseCategary = (tag: string) => {
  categaryTags.value.splice(categaryTags.value.indexOf(tag), 1);
};

const showLabelInput = () => {
  inputLabelVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

const showCategaryInput = () => {
  inputCategaryVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

const handleLabelInputConfirm = () => {
  if (Object.keys(inputLabelValue.value).length === 0) {
    return;
  }

  if (!isReactive(inputLabelValue.value)) {
    inputLabelValue.value = reactive({
      label: inputLabelValue.value,
      value: "",
    });
  }

  labelTags.value.push(inputLabelValue.value);
  inputLabelVisible.value = false;
  inputLabelValue.value = {};
};

const handleCategaryInputConfirm = () => {
  if (Object.keys(inputCategaryValue.value).length === 0) {
    return;
  }
  if (!isReactive(inputCategaryValue.value)) {
    inputCategaryValue.value = reactive({
      label: inputCategaryValue.value,
      value: "",
    });
  }
  categaryTags.value = [];
  categaryTags.value.push(inputCategaryValue.value);
  inputCategaryVisible.value = false;
  inputCategaryValue.value = {};
};

const getArticleDetail = async (articleId) => {
  const res: Record<string, any> = await articleApi.getArticleDetail(articleId);
  if (res.code === 0) {
    articleInfo.title = res.data.title;
    articleInfo.description = res.data.description;
    articleInfo.content = res.data.content;
    articleInfo.coverImage = res.data.cover_image;
    uploadFile.value = [{ url: res.data.cover_image }];

    labelTags.value = res.data.labels.map((item) => {
      const val = labelList.value.find((subItem) => subItem.value === item.id);
      return {
        label: val.label,
        value: item.id,
      };
    });

    const val = categaryList.value.find((item) => {
      return item.value === res.data.categary_id;
    });
    categaryTags.value = [
      {
        label: val.label as string,
        value: res.data.categary_id,
      },
    ];
  }
};

let articleId = route.params.articleId as string;

if (articleId) {
  getArticleDetail(articleId);
}

const onUploadImg = async (files, callback) => {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append("articleImg", file);
        fetch(`${baseUrl}/file/upload`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          method: "POST",
          body: form,
        })
          .then((res) => res.json())
          .then((res) => rev(res))
          .catch((error) => rej(error));
      });
    })
  );

  callback(res.map((item) => item.data.url));
};

const uploadCoverImage = async () => {
  const form = new FormData();
  const file = uploadFile.value[0].raw;
  form.append("articleImg", file);
  const res1 = await fetch(`${baseUrl}/file/upload`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    method: "POST",
    body: form,
  });
  const res2 = await res1.json();
  articleInfo.coverImage = res2.data.url;
};

const onSave = async (v, h) => {
  articleInfo.content = v;
  if (!articleInfo.title || !articleInfo.description) {
    ElMessage({
      message: "请输入标题和描述",
      type: "error",
    });
    return;
  }
  if (
    Object.keys(labelTags.value).length === 0 ||
    Object.keys(categaryTags.value).length === 0
  ) {
    ElMessage({
      message: "请选择文章分类和文章标签",
      type: "error",
    });
    return;
  }
  if (uploadFile.value.length === 0) {
    ElMessage({
      message: "请上传封面图",
      type: "error",
    });
    return;
  }

  articleInfo.labels = labelTags.value;
  articleInfo.categary = categaryTags.value;
  if (!articleInfo.coverImage) {
    await uploadCoverImage();
  }
  let res = null;
  if (articleId) {
    res = await articleApi.updateArticle(articleId, articleInfo);
  } else {
    res = await articleApi.createArticle(articleInfo);
  }

  if (res.code === 0) {
    ElMessage.success("保存成功");
    articleId = res.data.insertId;
    router.replace({
      path: `/articleEdit/${res.data.insertId}`,
    });
  } else {
    ElMessage.error(res.message);
  }
};

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handleRemove = (file) => {
  articleInfo.coverImage = "";
  uploadFile.value = [];
};

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};
</script>
<style lang="scss">
.editor-container {
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
<style lang="scss" scoped>
.editor-container {
  max-height: calc(132vh - 60px - 64px);
}
</style>
