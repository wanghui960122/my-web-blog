import { defineStore  } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    token: '',
    isLogin: false,
    isActiveMenu: 'Home'
  }),
  actions: {
    setUser(user: any) {
      this.user = user;
    },
    setToken(token: string) {
      this.token = token;
    },
    setIsLogin(isLogin: boolean) {
      this.isLogin = isLogin;
    },
    setMenu(menu: string) {
      localStorage.setItem('menu', menu)
      this.isActiveMenu = menu
    },
    getMenu() {
      const menu = localStorage.getItem('menu')
      this.isActiveMenu = menu || 'Home'
    }
  }
})