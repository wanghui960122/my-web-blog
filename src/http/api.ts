import fetchService from './index'

export const baseUrl = 'http://47.97.105.140:8000'

// 添加一个请求拦截器
fetchService.addRequestInterceptor((url, options) => {
    options.headers = {
      ...options.headers,
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    };
});
 
// 添加一个响应拦截器
fetchService.addResponseInterceptor(response => {
  if (response.status === 401) {
    console.error('Unauthorized!');
  }
});

 

export const userApi = {
  loginApi(params?: { name?: string; password?: string }) {
    return fetchService.post(baseUrl + '/login', params);
  },
}

export const timelineApi = {
  getTimeline(size: number) {
    return fetchService.get(baseUrl + `/timeline?size=${size}`);
  }
}


export const commentApi = {
  getAllComments() {
    return fetchService.get(baseUrl + '/comment');
  }
}

export const messageApi = {
  getMessages() {
    return fetchService.get(baseUrl + '/message');
  },
  addMessage(params?: { content: string, username: string }) {
    return fetchService.post(baseUrl + `/message`, params);
  },
  replyMessage(params?: { messageId: string, parentId: string, content: string, username: string, replyName: string }) {
    return fetchService.post(baseUrl + `/message/reply`, params);
  }
}

export const homeApi = {
  getBanner() {
    return fetchService.get(baseUrl + '/moment?offset=0&size=3');
  },
  getCount() {
    return fetchService.get(baseUrl + '/count');
  },
  getHoilday() {
    const year = new Date().getFullYear();
    return fetchService.get(`https://unpkg.com/holiday-calendar@1.3.0/data/CN/${year}.json/`);
  },
  getLabels () {
    return fetchService.get(baseUrl + '/label');
  },
  getMoments (offset: number = 0, size: number = 10, id?: number) {
    if (id) {
      return fetchService.get(baseUrl + `/moment?offset=${offset}&size=${size}&id=${id}`);
    }
    return fetchService.get(baseUrl + `/moment?offset=${offset}&size=${size}`);
  }
}

export const articleApi = {
  createArticle(params?: { title: string; content: string, description: string, coverImage: string}) {
    return fetchService.post(baseUrl + '/moment', params);
  },
  updateArticle(id: string, params?: { title: string; content: string, description: string, coverImage: string}) {
    return fetchService.post(baseUrl + `/moment/update/${id}`, params);
  },
  getArticleDetail(id: string) {
    return fetchService.get(baseUrl + `/moment/${id}`);
  },
  addArticleComment (params?: { content: string, momentId: string, username: string }) {
    return fetchService.post(baseUrl + `/comment/`, params);
  },
  replyArticleComment (params?: { commentId: string, parentId: string, content: string, momentId: string, username: string, replyName: string}) {
    return fetchService.post(baseUrl + `/comment/reply`, params);
  },
  getArticleComments(id: string) {
    return fetchService.get(baseUrl + `/comment/${id}`);
  }
}

export const labelApi = {
  getLabels() {
    return fetchService.get(baseUrl + `/label`);
  },
  getCategarys() {
    return fetchService.get(baseUrl + `/label/categary`);
  },
  getCommentsBylabel(offset: number = 0, size: number = 10, id?: number) {
    if (id) {
      return fetchService.get(baseUrl + `/moment/label?offset=${offset}&size=${size}&id=${id}`);
    }
    return fetchService.get(baseUrl + `/moment/label?offset=${offset}&size=${size}`);
  }
}

 