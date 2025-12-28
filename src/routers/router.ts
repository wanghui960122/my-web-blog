const router = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/category',
    name: "Category",
    component: () => import('@/views/Category.vue')
  },
  {
    path: '/tag/:tagId?',
    name: "Tag",
    component: () => import('@/views/Tag.vue')
  },
  {
    path: '/timeline',
    name: "Timeline",
    component: () => import('@/views/Timeline.vue')
  },
  {
    path: '/message',
    name: "Message",
    component: () => import('@/views/Message.vue')
  },
  {
    path: '/link',
    name: "Link",
    component: () => import('@/views/Link.vue')
  },
  {
    path: '/articleEdit/:articleId?',
    name: "ArticleEdit",
    component: () => import('@/views/ArticleEdit.vue')
  },
  {
    path: '/articleDetail/:articleId',
    name: "ArticleDetail",
    component: () => import('@/views/ArticleDetail.vue')
  }
]

export default router;