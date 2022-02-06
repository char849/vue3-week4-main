import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

//預設滙入
import pagination from './pagination.js';

const api = 'https://vue3-course-api.hexschool.io/v2';
const path = 'charlotte-hexschool';

let productModal = {};
let delProductModal = {};

const app = createApp({
  //區域註冊 - 分頁元件  
  components: {
    pagination
  },
  data() {
    return {      
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
      pagination: {}
    }
  },
  methods: {
    checkApi() {
      // 取出 Token
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      axios.defaults.headers.common.Authorization = token;  

      const url = `${api}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message)
          window.location = 'login.html';
        })
    },

    //取得產品列表
    getProducts(page = 1) {
      //陣列包物件      
      const url = `${api}/api/${path}/admin/products/?page=${page}`;
      //物件包物件            
      //const url = `${api}/api/${path}/admin/products/all`;
      axios.get(url)
        .then((res) => {          
          this.products = res.data.products;
          this.pagination = res.data.pagination;
        })
        .catch((err) => {
          alert(err.data.message);
        })
          //物件跑迴圈二種方式 - 實戰常用        
          // Object.value(this.products).forEach((item) => { 
          //   console.log(item);
          // })

          // Object.keys(this.products).forEach((key) => { 
          //   console.log(this.products[key], key);
          // })         
    },
    openModal(status, product) {
      console.log(status, product);
      if (status === 'isNew') {
        this.tempProduct = {
          imagesUrl: [],
        }
        this.isNew = true;
        productModal.show();        
      } else if (status === 'edit') {
        this.tempProduct = JSON.parse(JSON.stringify(product));         
        this.isNew = false;
        productModal.show();
        if(!this.tempProduct.imagesUrl){
          this.tempProduct.imagesUrl = []
        }
      } else if (status === 'delete'){
        this.tempProduct = JSON.parse(JSON.stringify(product));
        delProductModal.show();
        
      }
      
    },

    
  },
  
  //初使化
  mounted() {
    //執行驗證登入Token   
    this.checkApi();  

    //建立modal
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false,  //防止按到esc不小心關閉model
      backdrop: 'static' //指定static在單擊時不關閉模式的背景
    });

    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false,
      backdrop: 'static'  
    });      
  }
});

// 全域註冊
// 產品新增/編輯元件
app.component('productModal', {
  template: '#productModal',
  props: ['tempProduct', 'isNew'],  
  methods: {
    updateProduct() {
      let url = `${api}/api/${path}/admin/product`;
      let httpApi = 'post';
      if(!this.isNew) {
        url = `${api}/api/${path}/admin/product/${this.tempProduct.id}`;
        httpApi = 'put';
      }

      axios[httpApi](url, {data: this.tempProduct})
        .then((res) => {            
          productModal.hide();   
          this.$emit('get-products');  //內層用('get-products')的事件, emit 來觸發外層getProducts的方法
          //this.getProducts(); 沒有getProducts, 它是外層的方法          
          
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  }
})

// 產品刪除元件
app.component('delProductModal', {
  template: '#delProductModal',
  props: ['tempProduct'],
  methods: {
    //刪除一個產品
    delProduct() {  
      const url = `${api}/api/${path}/admin/product/${this.tempProduct.id}`;         
      axios.delete(url)
      .then((res) => {           
        delProductModal.hide();  
        this.$emit('get-products');        
        //this.getProducts(); 
          
      })
      //失敗結果
      .catch((err) => {
        alert(err.data.message);        
      })
    },
  }
})

app.mount('#app');
