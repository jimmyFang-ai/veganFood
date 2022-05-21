// apiUrl
const apiUrl = "https://vue3-course-api.hexschool.io/";
const apiPath = "veganfoodtw2";


// 全域變數
// 產品 data
let productsData = [];
// 購物車 data
let cartData = [];
// 我的最愛 Data 
let favoriteData = JSON.parse(localStorage.getItem("favoriteItem")) || [];


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
            setTimeout(() => { toggleLoading(false); }, 600);

            // 確認有 productsList DOM 才執行
            if (productsList !== null) {
                //資料回傳後渲染畫面
                renderProductsList(productsData);
                //資料回傳 寫入分頁函式
                renderPages(productsData, 1);
                // 呈現愛心按鈕
                renderAddFavoriteBtn();
            };

            // 確認有 popularProductList DOM 才執行
            if (popularProductList !== null) {
                // 呈現 熱銷餐點列表
                renderPopularProduct(productsData);
                // 呈現愛心按鈕
                renderAddFavoriteBtn();
            };

            // 確認有 selectProductsList DOM 才執行 
            if (selectProductsList !== null) {
                // 呈現 主廚推薦餐點列表
                renderSelectProducts(productsData);
                // 呈現愛心按鈕
                renderAddFavoriteBtn();
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
        arr.forEach((cartItem) => {
            //  計算總金額totalPrice.textContent = 
            finalTotal += cartItem.product.origin_price * cartItem.qty;

            str += `<li class="row  text-center gx-0  align-items-center mb-3" data-cart-id=${cartItem.id}>
       <div class="col-4">
         <img class="img-fluid" src="${cartItem.product.imageUrl}" alt="${cartItem.product.title}">
       </div>
       <div class="col-4">
         <p>${cartItem.product.title}</p>
          <small class="text-muted"> x ${cartItem.qty}</small>
       </div>
       <div class="col-3">
          <small class="text-muted"> NT$ ${tothousands(cartItem.product.origin_price * cartItem.qty)}</small>
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
    totalPrice.textContent = tothousands(finalTotal);

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
        deleteCartItem(cartId);
    }
});

function deleteCartItem(cartId) {
    axios.delete(`${apiUrl}api/${apiPath}/cart/${cartId}`)
        .then(function (reponse) {
            getCartList();
            swalFn("已刪除單筆餐點", "success", 800);
        })
        .catch(function (error) {
            console.log(error.data);
        })
};


// 我的最愛 - 將產品加入我的最愛
function addFavorites(productItem, productId) {
    // 先查找 favoriteData資料的 id 與 產品列表的 id 是一樣的，有的話就回傳 true
    favoriteData.find((favorite) => favorite.id === productId);

    // 要避免重複加入，所以用some功能比對是否有重複id
    if (favoriteData.some((favorite) => favorite.id === productId)) {
        return swalFn("重複加入", "error", 800);
    };

    favoriteData.push(productItem);
    swalFn("已加入最愛", "success", 800);
};


// 我的最愛 - 切換愛心按鈕
function toggleAddFavorite(id) {
    const addFavoriteBtn = document.querySelector(`#addFavorite i[data-favorite-id=${id}]`);
    if (addFavoriteBtn !== null) {
        addFavoriteBtn.classList.toggle("bi-heart");
        addFavoriteBtn.classList.toggle("bi-heart-fill");
    }
};

// 我的最愛 - 渲染切換愛心按鈕
function renderAddFavoriteBtn() {
    if (favoriteData !== null) {
        favoriteData.forEach((favorite) => toggleAddFavorite(favorite.id));
    }
}

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
        arr.forEach((favoritesItem) => {
            str += `<tr data-favorite-id=${favoritesItem.id}>
      <td>
        <img class="img-fluid" src="${favoritesItem.imageUrl}" alt="${favoritesItem.title}">
      </td>
      <td>${favoritesItem.title}</td>
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

    console.log(e.target);

    // 單筆刪除
    if (e.target.getAttribute("id") === "delFavoriteBtn") {
        const favoriteId = e.target.closest("#favoriteList tr").dataset.favoriteId;
        delFavorite(favoriteId)
        toggleAddFavorite(favoriteId);
    };

    // 刪除全部
    if (e.target.getAttribute("id") === "delAllFavoriteBtn") {
        favoriteData = [];
        swalFn("已移除所有收藏", "success", 800);
        getAllProducts();
    };

    // 將資料寫入 localStorage
    localStorage.setItem("favoriteItem", JSON.stringify(favoriteData));
    getFavoriteList();
});


//我的最愛 - 移除單筆最愛
function delFavorite(id) {
    // 確認 favoriteData 有資料，就會回傳true
    if (!favoriteData) { return };

    // 取得我的最愛列表內的 單一品項 id
    const delFavoriteIndex = favoriteData.findIndex(
        (favorite) => favorite.id === id
    );

    // 如果favoriteData 沒有同樣的 id 品項就return中斷
    if (delFavoriteIndex === -1) return;
    favoriteData.splice(delFavoriteIndex, 1);

    swalFn("已移除收藏", "warning", 800);
}


