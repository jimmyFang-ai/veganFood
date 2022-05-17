// apiUrl
const apiUrl = "https://vue3-course-api.hexschool.io/";
const apiPath = "veganfoodtw2";


// 全域變數
// 產品 data
let productsData = [];
// 購物車 data
let cartData = [];
// 我的最愛 Data 
let favoriteData = [];


// DOM 元素管理
// const productsList = document.querySelector("#productsList");
const cartList = document.querySelector("#cartList");
const favoriteList = document.querySelector("#favoriteList");


// 初始化
function init() {
    getAllProducts(); // 取得全部產品
    getProductItem(); // 取得產品內頁資訊
    getCartList();// 取得購物車列表
    getFavoriteList(); // 取得我的最愛列表
    getOrderList();// 取的訂單資訊

    AOS.init({
        duration: 1500,
        easing: 'ease',
        once: true,
    }); // 初始化 Aos動畫套件
};
init();


  


// 商品資訊 - 取得所有產品
function getAllProducts() {
    //等待資料回傳前， 載入loading
    toggleLoading(true);

    axios.get(`${apiUrl}api/${apiPath}/products`)
        .then(function (response) {
            productsData = response.data.products;

            //資料回傳後， 關閉loading
            setTimeout(() => {toggleLoading(false);}, 600);
    
            // 確認有 productsList DOM 才執行
            if (productsList !== null) {
                //資料回傳後渲染畫面
                renderProductsList(productsData);
                //資料回傳 寫入分頁函式
                renderPages(productsData, 1);
            };

            // 確認有 popularProductList DOM 才執行
            if (popularProductList !== null) {
                // 呈現 熱銷餐點列表
                renderPopularProduct(productsData);
            };

            // 確認有 selectProductsList DOM 才執行 
            if (selectProductsList !== null) {
                // 呈現 主廚推薦餐點列表
                renderSelectProducts(productsData);
            };


        })

        .catch(function (error) {
            console.log(error.response.data);
        })
};


//  購物車 - 取得購物車資訊
function getCartList() {
    axios.get(`${apiUrl}api/${apiPath}/cart`)
        .then(function (response) {
            cartData = response.data.data.carts;


            // 呈現購物車列表
            renderCartList(cartData);

            // 確認購物車頁面 - 呈現購物車列表
            if (checkCartList !== null) {
                renderCheckCartList(cartData);
            };
        })
        .catch(function (error) {
            console.log(error.response.data);
        })
};


//  購物車 - 渲染購物車列表
function renderCartList(arr) {
    let str = "";

    // 初始化組金額 為 0
    let finalTotal = 0;

    // DOM 元素
    // 結帳
    const account = document.querySelector("#account");
    // 計算購物車數量
    const cartNum = document.querySelector("#cartNum");
    // 計算總金額
    const totalPrice = document.querySelector("#totalPrice");

    // 如果購物車數量小於 1 就顯示立即點餐資訊
    if (arr.length < 1) {
        str += `<li class="row gx-0 align-items-center">
         <div class="col">
           <h5 class="mb-5 text-center">購物車內沒有商品，趕快去逛逛吧!</h5>
           <a class="btn btn-primary btn-lg w-100" href="./productLists.html">立即點餐</a>
         </div>
        </li>`;

        // 結帳畫面消失
        account.classList.add("d-none");
    } else {
        arr.forEach((item) => {
            //  計算總金額totalPrice.textContent = 
            finalTotal += item.product.origin_price * item.qty;

            str += `<li class="row  text-center gx-0  align-items-center mb-3" data-cart-id=${item.id}>
       <div class="col-4">
         <img class="img-fluid" src="${item.product.imageUrl}" alt="${item.product.title}">
       </div>
       <div class="col-4">
         <p>${item.product.title}</p>
          <small class="text-muted"> x ${item.qty}</small>
       </div>
       <div class="col-3">
          <small class="text-muted"> NT$ ${tothousands(item.product.origin_price * item.qty)}</small>
       </div>
       <div class="col-1 px-0 mb-0">
         <button type="button" class="btn  shadow-none  border-0 p-0" id="delCartBtn">
         <i class="bi bi-trash-fill text-danger custom-icon-middle"></i>
         </button>
        </div>
     </li>`
        });

        // 結帳畫面 出現
        account.classList.remove("d-none");
    };

    // 呈現購物車數量
    cartNum.textContent = arr.length;

    // 呈現總金額
    totalPrice.textContent =  tothousands(finalTotal);

    // 呈現購物車產品列表
    cartList.innerHTML = str;
};

//  購物車 - 加入購物車
function addCartItem(productId, productNum) {
    axios.post(`${apiUrl}api/${apiPath}/cart`, {
        "data": {
            "product_id": productId,
            "qty": productNum
        }
    })
        .then(function (response) {
            getCartList();
        })

        .catch(function (error) {
            console.log(error.response.data);
        })
};


//  購物車 - 單筆刪除
cartList.addEventListener("click", function (e) {
    const cartId = e.target.closest("li").dataset.cartId;

    if (e.target.getAttribute("id") === "delCartBtn") {
        swalFn("已刪除單筆餐點", "success", 800);
        deleteCartItem(cartId);
    }
});

function deleteCartItem(cartId) {
    axios.delete(`${apiUrl}api/${apiPath}/cart/${cartId}`)
        .then(function (reponse) {
            getCartList();
        })
        .catch(function (error) {
            console.log(error.data);
        })
};


// 我的最愛 - 將產品加入我的最愛
function addFavoriteItem(heartIcon, productId) {
    productsData.forEach((item) => {
        if (item.id === productId) {
            // 製作 愛心切換功能
            if (heartIcon.classList.contains("bi-heart")) {
                swalFn("已加入收藏", "success", 800);
                // 新增一筆產品到我的最愛
                favoriteData.push(item)
                heartIcon.classList.remove("bi-heart");
                heartIcon.classList.add("bi-heart-fill");
                console.log(heartIcon, productId);
            } else {
                swalFn("已移除收藏", "warning", 800);
                favoriteData = favoriteData.filter((item) => item.id !== productId);
                heartIcon.classList.remove("bi-heart-fill");
                heartIcon.classList.add("bi-heart");
                console.log(heartIcon, productId);
            };
        }
    });

    // 取得我的最愛資訊
    getFavoriteList(favoriteData);
};

// 我的最愛 - 取得收藏產品列表 
function getFavoriteList() {
    // 確認 產品列表DOM才執行
    if (productsList !== null) {
        renderFavoriteList(favoriteData);
    };

    // 確認 熱銷產品列表DOM才執行
    if (popularProductList !== null) {
        renderFavoriteList(favoriteData);
    };

    // 確認有 主廚推薦列表DOM才執行
    if (selectProductsList !== null) {
        renderFavoriteList(favoriteData);
    };

};

// 我的最愛 - 渲染收藏產品列表
function renderFavoriteList(arr) {
    let str = "";

    // 我的最愛數量
    const favoriteNum = document.querySelector("#favoriteNum");

    // 刪除我的最愛全部按鈕
    const delAllFavoriteBtn = document.querySelector("#delAllFavoriteBtn");

    if (arr.length < 1) {
        str += `<tr><td colspan="3">
        <h5 class="py-4 text-muted">美食收藏是空的唷!
            快去逛逛吧!
        </h5>
      </td>
      </tr>`;

        delAllFavoriteBtn.setAttribute("disabled", "");
    } else {
        arr.forEach((item) => {
            str += `<tr data-favorite-id=${item.id}>
      <td>
        <img class="img-fluid" src="${item.imageUrl}" alt="${item.title}">
      </td>
      <td>${item.title}</td>
      <td>
        <button type="button" class="btn  shadow-none  border-0 p-0" id="delFavoriteBtn">
          <i class="bi bi-trash-fill text-danger custom-icon-middle"></i>
        </button>
            </td></tr>`;
        });
        delAllFavoriteBtn.removeAttribute("disabled");
    };


    // 呈現我的最愛數量
    favoriteNum.textContent = favoriteData.length;

    // 呈現我的最愛列表
    favoriteList.innerHTML = str;
};

// 我的最愛 - 功能整合:單筆刪除、全部刪除
// 我的最愛表單綁上間聽事件
const favoriteTable = document.querySelector("#favoriteTable");
favoriteTable.addEventListener("click", function (e) {
    e.preventDefault();

    // 單筆刪除
    if (e.target.getAttribute("id") === "delFavoriteBtn") {

        const favoriteId = e.target.closest("#favoriteList tr").dataset.favoriteId;
        
        favoriteData = favoriteData.filter((item) => item.id !== favoriteId);
        swalFn("已移除收藏", "success", 800);
        // 移除 愛心icon 的狀態
        heartIcon.classList.remove("bi-heart-fill");
        heartIcon.classList.add("bi-heart");
        // 重新取得我的最愛資訊
        getFavoriteList();
    };

    // 刪除全部
    if (e.target.getAttribute("id") === "delAllFavoriteBtn") {
        favoriteData = [];
        swalFn("已移除所有收藏", "success", 800);

        // 重新取得我的最愛資訊
        getFavoriteList();
        // 重新取得產品列表
        getAllProducts();
    };

});



