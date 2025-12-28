<script lang="ts" setup>
  import { watch, ref } from 'vue'

  import { useUserStore } from '@/store/user'
  const userStore = useUserStore()

  import { userApi } from '@/http/api'

  interface MyProps {
    visable: boolean
  }
  const props =  withDefaults(defineProps<MyProps>(), {
    visable: false
  })


  const emits = defineEmits(['close'])

  const isShow = ref(false)

  const user  = ref({
    name: '',
    password: ''
  })

  watch(() => props.visable, () => {    
    isShow.value = props.visable
  })


  const handleClose = () => {
    emits('close')
  }

  const handleSubmit = async () => {
    const res: any =  await userApi.loginApi(user.value)
    if (res.code === 0) {
      userStore.setIsLogin(true)
      localStorage.setItem('token', res.data.token)
      isShow.value = false
    }
  }

</script>
<template>
  <el-dialog
    v-model="isShow"
    title="Fractures的个人博客"
    width="620"
    align-center
    @close="handleClose"
  >
    <el-form label-width="120" v-model="user">
      <el-form-item label="用户名:" props="name">
        <el-input v-model="user.name"></el-input>
      </el-form-item>
      <el-form-item label="密码:" props="password">
        <el-input type="password" v-model="user.password"></el-input>
      </el-form-item>
       <el-form-item>
       <div class="w-full text-center">
          <el-button type="primary" @click="handleSubmit">确定</el-button>
       </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>