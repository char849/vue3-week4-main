import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const api = 'https://vue3-course-api.hexschool.io/v2';

const app = createApp({
    data() {
      return {              
        user: {          
          username: '',
          password: '',
        },
      }
    },
    methods: {
      login() {            
        const url = `${api}/admin/signin`;         
        axios.post(url, this.user)
        //成功的結果
          .then((res) => {
          //取出token，解構的寫法
          const { token, expired } = res.data;
          // 儲存登入的cookie token資訊
          // expires 設置有效時間 unix timestamp 時間戳     
          document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
          //轉址的動作          
          window.location = 'products.html';
        })
        //失敗結果
        .catch((err) => {  
          alert(err.response.data.message);
        });
      },
    },
  }).mount('#app');