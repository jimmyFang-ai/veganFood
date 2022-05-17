"use strict";

// apiUrl
var apiUrl = "https://vue3-course-api.hexschool.io/";
var apiPath = "veganfoodtw2"; // 全域變數
// 產品 data

var productsData = []; // 購物車 data

var cartData = []; // 我的最愛 Data 

var favoriteData = []; // DOM 元素管理
// const productsList = document.querySelector("#productsList");

var cartList = document.querySelector("#cartList");
var favoriteList = document.querySelector("#favoriteList"); // 初始化

function init() {
  getAllProducts(); // 取得全部產品

  getProductItem(); // 取得產品內頁資訊

  getCartList(); // 取得購物車列表

  getFavoriteList(); // 取得我的最愛列表

  getOrderList(); // 取的訂單資訊

  AOS.init({
    duration: 1500,
    easing: 'ease',
    once: true
  }); // 初始化 Aos動畫套件
}

;
init(); // 商品資訊 - 取得所有產品

function getAllProducts() {
  //等待資料回傳前， 載入loading
  toggleLoading(true);
  axios.get("".concat(apiUrl, "api/").concat(apiPath, "/products")).then(function (response) {
    productsData = response.data.products; //資料回傳後， 關閉loading

    setTimeout(function () {
      toggleLoading(false);
    }, 600); // 確認有 productsList DOM 才執行

    if (productsList !== null) {
      //資料回傳後渲染畫面
      renderProductsList(productsData); //資料回傳 寫入分頁函式

      renderPages(productsData, 1);
    }

    ; // 確認有 popularProductList DOM 才執行

    if (popularProductList !== null) {
      // 呈現 熱銷餐點列表
      renderPopularProduct(productsData);
    }

    ; // 確認有 selectProductsList DOM 才執行 

    if (selectProductsList !== null) {
      // 呈現 主廚推薦餐點列表
      renderSelectProducts(productsData);
    }

    ;
  })["catch"](function (error) {
    console.log(error.response.data);
  });
}

; //  購物車 - 取得購物車資訊

function getCartList() {
  axios.get("".concat(apiUrl, "api/").concat(apiPath, "/cart")).then(function (response) {
    cartData = response.data.data.carts; // 呈現購物車列表

    renderCartList(cartData); // 確認購物車頁面 - 呈現購物車列表

    if (checkCartList !== null) {
      renderCheckCartList(cartData);
    }

    ;
  })["catch"](function (error) {
    console.log(error.response.data);
  });
}

; //  購物車 - 渲染購物車列表

function renderCartList(arr) {
  var str = ""; // 初始化組金額 為 0

  var finalTotal = 0; // DOM 元素
  // 結帳

  var account = document.querySelector("#account"); // 計算購物車數量

  var cartNum = document.querySelector("#cartNum"); // 計算總金額

  var totalPrice = document.querySelector("#totalPrice"); // 如果購物車數量小於 1 就顯示立即點餐資訊

  if (arr.length < 1) {
    str += "<li class=\"row gx-0 align-items-center\">\n         <div class=\"col\">\n           <h5 class=\"mb-5 text-center\">\u8CFC\u7269\u8ECA\u5167\u6C92\u6709\u5546\u54C1\uFF0C\u8D95\u5FEB\u53BB\u901B\u901B\u5427!</h5>\n           <a class=\"btn btn-primary btn-lg w-100\" href=\"./productLists.html\">\u7ACB\u5373\u9EDE\u9910</a>\n         </div>\n        </li>"; // 結帳畫面消失

    account.classList.add("d-none");
  } else {
    arr.forEach(function (item) {
      //  計算總金額totalPrice.textContent = 
      finalTotal += item.product.origin_price * item.qty;
      str += "<li class=\"row  text-center gx-0  align-items-center mb-3\" data-cart-id=".concat(item.id, ">\n       <div class=\"col-4\">\n         <img class=\"img-fluid\" src=\"").concat(item.product.imageUrl, "\" alt=\"").concat(item.product.title, "\">\n       </div>\n       <div class=\"col-4\">\n         <p>").concat(item.product.title, "</p>\n          <small class=\"text-muted\"> x ").concat(item.qty, "</small>\n       </div>\n       <div class=\"col-3\">\n          <small class=\"text-muted\"> NT$ ").concat(tothousands(item.product.origin_price * item.qty), "</small>\n       </div>\n       <div class=\"col-1 px-0 mb-0\">\n         <button type=\"button\" class=\"btn  shadow-none  border-0 p-0\" id=\"delCartBtn\">\n         <i class=\"bi bi-trash-fill text-danger custom-icon-middle\"></i>\n         </button>\n        </div>\n     </li>");
    }); // 結帳畫面 出現

    account.classList.remove("d-none");
  }

  ; // 呈現購物車數量

  cartNum.textContent = arr.length; // 呈現總金額

  totalPrice.textContent = tothousands(finalTotal); // 呈現購物車產品列表

  cartList.innerHTML = str;
}

; //  購物車 - 加入購物車

function addCartItem(productId, productNum) {
  axios.post("".concat(apiUrl, "api/").concat(apiPath, "/cart"), {
    "data": {
      "product_id": productId,
      "qty": productNum
    }
  }).then(function (response) {
    getCartList();
  })["catch"](function (error) {
    console.log(error.response.data);
  });
}

; //  購物車 - 單筆刪除

cartList.addEventListener("click", function (e) {
  var cartId = e.target.closest("li").dataset.cartId;

  if (e.target.getAttribute("id") === "delCartBtn") {
    swalFn("已刪除單筆餐點", "success", 800);
    deleteCartItem(cartId);
  }
});

function deleteCartItem(cartId) {
  axios["delete"]("".concat(apiUrl, "api/").concat(apiPath, "/cart/").concat(cartId)).then(function (reponse) {
    getCartList();
  })["catch"](function (error) {
    console.log(error.data);
  });
}

; // 我的最愛 - 將產品加入我的最愛

function addFavoriteItem(heartIcon, productId) {
  productsData.forEach(function (item) {
    if (item.id === productId) {
      // 製作 愛心切換功能
      if (heartIcon.classList.contains("bi-heart")) {
        swalFn("已加入收藏", "success", 800); // 新增一筆產品到我的最愛

        favoriteData.push(item);
        heartIcon.classList.remove("bi-heart");
        heartIcon.classList.add("bi-heart-fill");
        console.log(heartIcon, productId);
      } else {
        swalFn("已移除收藏", "warning", 800);
        favoriteData = favoriteData.filter(function (item) {
          return item.id !== productId;
        });
        heartIcon.classList.remove("bi-heart-fill");
        heartIcon.classList.add("bi-heart");
        console.log(heartIcon, productId);
      }

      ;
    }
  }); // 取得我的最愛資訊

  getFavoriteList(favoriteData);
}

; // 我的最愛 - 取得收藏產品列表 

function getFavoriteList() {
  // 確認 產品列表DOM才執行
  if (productsList !== null) {
    renderFavoriteList(favoriteData);
  }

  ; // 確認 熱銷產品列表DOM才執行

  if (popularProductList !== null) {
    renderFavoriteList(favoriteData);
  }

  ; // 確認有 主廚推薦列表DOM才執行

  if (selectProductsList !== null) {
    renderFavoriteList(favoriteData);
  }

  ;
}

; // 我的最愛 - 渲染收藏產品列表

function renderFavoriteList(arr) {
  var str = ""; // 我的最愛數量

  var favoriteNum = document.querySelector("#favoriteNum"); // 刪除我的最愛全部按鈕

  var delAllFavoriteBtn = document.querySelector("#delAllFavoriteBtn");

  if (arr.length < 1) {
    str += "<tr><td colspan=\"3\">\n        <h5 class=\"py-4 text-muted\">\u7F8E\u98DF\u6536\u85CF\u662F\u7A7A\u7684\u5537!\n            \u5FEB\u53BB\u901B\u901B\u5427!\n        </h5>\n      </td>\n      </tr>";
    delAllFavoriteBtn.setAttribute("disabled", "");
  } else {
    arr.forEach(function (item) {
      str += "<tr data-favorite-id=".concat(item.id, ">\n      <td>\n        <img class=\"img-fluid\" src=\"").concat(item.imageUrl, "\" alt=\"").concat(item.title, "\">\n      </td>\n      <td>").concat(item.title, "</td>\n      <td>\n        <button type=\"button\" class=\"btn  shadow-none  border-0 p-0\" id=\"delFavoriteBtn\">\n          <i class=\"bi bi-trash-fill text-danger custom-icon-middle\"></i>\n        </button>\n            </td></tr>");
    });
    delAllFavoriteBtn.removeAttribute("disabled");
  }

  ; // 呈現我的最愛數量

  favoriteNum.textContent = favoriteData.length; // 呈現我的最愛列表

  favoriteList.innerHTML = str;
}

; // 我的最愛 - 功能整合:單筆刪除、全部刪除
// 我的最愛表單綁上間聽事件

var favoriteTable = document.querySelector("#favoriteTable");
favoriteTable.addEventListener("click", function (e) {
  e.preventDefault(); // 單筆刪除

  if (e.target.getAttribute("id") === "delFavoriteBtn") {
    var favoriteId = e.target.closest("#favoriteList tr").dataset.favoriteId;
    favoriteData = favoriteData.filter(function (item) {
      return item.id !== favoriteId;
    });
    swalFn("已移除收藏", "success", 800); // 移除 愛心icon 的狀態

    heartIcon.classList.remove("bi-heart-fill");
    heartIcon.classList.add("bi-heart"); // 重新取得我的最愛資訊

    getFavoriteList();
  }

  ; // 刪除全部

  if (e.target.getAttribute("id") === "delAllFavoriteBtn") {
    favoriteData = [];
    swalFn("已移除所有收藏", "success", 800); // 重新取得我的最愛資訊

    getFavoriteList(); // 重新取得產品列表

    getAllProducts();
  }

  ;
});
"use strict";

var checkCartList = document.querySelector("#checkCartList"); // 確認購物車 - 渲染購物車列表

function renderCheckCartList(arr) {
  var str = ""; // 初始化組金額 為 0

  var finalTotal = 0; // DOM 元素
  // 結帳

  var cartAccout = document.querySelector("#cartAccout"); // 計算總金額

  var cartTotalPrice = document.querySelector("#cartTotalPrice");

  if (arr.length < 1) {
    str += "<tr><td colspan=\"6\" class=\"py-6\">\n        <h5 class=\"mb-5 text-center\">\u8CFC\u7269\u8ECA\u5167\u6C92\u6709\u5546\u54C1\uFF0C\u8D95\u5FEB\u53BB\u901B\u901B\u5427!\n            </h5>\n        <a class=\"btn btn-primary btn-lg\" href=\"./productLists.html\">\u7ACB\u5373\u9EDE\u9910</a>\n      </td>\n      </tr>";
    cartAccout.classList.add("d-none");
  } else {
    arr.forEach(function (item, index) {
      str += "<tr data-cart-id=".concat(item.id, ">\n            <td>\n\n            <div class=\"row gx-0 align-items-center\">\n            <div class=\"col-6 d-none d-md-block\">\n                <img class=\"img-fluid\" src=\"").concat(item.product.imageUrl, "\" alt=\"\u5DF4\u897F\u8393\u679C\u7897\">\n            </div>\n            <div class=\"col col-md-6\">\n                <p class=\"mb-2\">").concat(item.product.title, "</p>\n                <span>NT$ ").concat(item.product.origin_price, "</span>\n            </div>\n        </div>\n            </td>\n            <td>\n            <div class=\"d-flex justify-content-center\">\n            <div class=\"input-group text-center\" style=\"max-width: 160px;\">\n                <button type=\"button\" class=\"btn text-success fs-4 shadow-none px-1 px-md-3\" id=\"minusNumBtn\" data-product-num=\"").concat(index, "\"  data-product-id=\"").concat(item.product_id, "\">\n                    -\n                </button>\n                <input type=\"number\" class=\"form-control text-center w-25 px-1 px-md-2 \" id=\"productNumInput\"  data-product-num=\"").concat(index, "\"   value=\"").concat(item.qty, "\" min=\"1\" >\n                    <button type=\"button\" class=\"btn text-success fs-4  shadow-none px-1 px-md-3\" id=\"plusNumBtn\"data-product-num=\"").concat(index, "\"  data-product-id=\"").concat(item.product_id, "\"> \n                      +\n                    </button>\n            </div>\n        </div>\n            </td>\n            <td>NT$ ").concat(tothousands(item.product.origin_price * item.qty), "</td>\n            <td>\n                <button type=\"button\" class=\"btn  shadow-none  border-0 p-0\" id=\"delCartBtn\">\n                    <i class=\"bi bi-trash-fill text-danger custom-icon-middle\"></i>\n                </button>\n            </td>\n            </tr>"); //  計算總金額

      finalTotal += item.product.origin_price * item.qty;
    });
    cartAccout.classList.remove("d-none");
  } // 呈現總金額


  cartTotalPrice.textContent = tothousands(finalTotal); // 呈現購物車產品列表

  checkCartList.innerHTML = str;
}

; // 確認購物車 - 功能整合 (刪除和修改)

if (checkCartList !== null) {
  checkCartList.addEventListener("click", function (e) {
    // 取出 購物車id
    var cartId = e.target.closest("tr").dataset.cartId; // 取出 購物車產品 id

    var productId = e.target.dataset.productId; // 取出 DOM id

    var btnId = e.target.getAttribute("id");

    if (e.target.nodeName !== "BUTTON") {
      return;
    }

    ; // 單筆刪除

    if (e.target.getAttribute("id") === "delCartBtn") {
      e.preventDefault();
      swalFn("已刪除單筆餐點", "success", 800);
      deleteCartItem(cartId);
    }

    ; // 修改購物車數量

    if (btnId === "plusNumBtn" || btnId === "minusNumBtn") {
      e.preventDefault(); // 取出 購物車產品的數量

      var productNum = e.target.dataset.productNum;
      changeCartNum(btnId, cartId, productId, productNum);
    }

    ;
  });
}

; // 確認購物車 -  全部刪除

var delAllCartBtn = document.querySelector("#delAllCartBtn");

if (delAllCartBtn !== null) {
  delAllCartBtn.addEventListener("click", function (e) {
    e.preventDefault();
    axios["delete"]("".concat(apiUrl, "api/").concat(apiPath, "/carts")).then(function (reponse) {
      swalFn("購物車已清空", "success", 800);
      getCartList();
    })["catch"](function (error) {
      console.log(error.data);
    });
  });
}

; // 確認購物車 - 修改購物車數量

function changeCartNum(btnId, cartId, productId, productNum) {
  var productNumInput = document.querySelectorAll("#productNumInput"); // 將所有產品數字 DOM元素全部選取

  var productNumDom = productNumInput[productNum]; //取出 productNumInput 類陣列的索引位置的 DOM元素

  var numSum = parseInt(productNumDom.value); // 將 productNumInput 類陣列的索引位置的 DOM元素的值取出 並轉換為數字
  // 減少數量

  if (btnId === "minusNumBtn") {
    if (numSum === 1) {
      swalFn("數量最少為1", "warning", 800);
      return;
    } else {
      numSum -= 1;
    }

    ;
  } else if (btnId === "plusNumBtn") {
    //增加數量
    numSum += 1;
  } //按下加減鍵開啟loading


  toggleLoading(true);
  axios.put("".concat(apiUrl, "api/").concat(apiPath, "/cart/").concat(cartId), {
    "data": {
      "product_id": productId,
      "qty": numSum
    }
  }).then(function (reponse) {
    //更新數量後， 關閉loading
    setTimeout(function () {
      toggleLoading(false);
    }, 600);
    getCartList();
  })["catch"](function (error) {
    console.log(error.data);
  });
}

;
"use strict";

// 主廚推薦餐點列表 DOM
var selectProductsList = document.querySelector("#selectProductsList"); // 渲染 主廚推薦餐點列表

function renderSelectProducts(arr) {
  var str = "";
  arr.forEach(function (item) {
    if (item.category === "主餐") {
      str += "<div class=\"col mb-4\">\n            <a data-id=".concat(item.id, " href=\"./productInner.html?id=").concat(item.id, "\" class=\"text-dark\" id=\"productInnerUrl\">\n              <div class=\"card custom-card  shadow-sm\">\n              \n              <button type=\"button\" class=\"btn  position-absolute   shadow-none  border-0  fs-5 favoriteBtn\" id=\"addFavorite\" style=\"z-index: 1;\">\n                  <i class=\"bi bi-heart custom-icon-heart text-danger py-0\" ></i>\n             </button>\n      \n                <div class=\"card-img-wrap\">\n                  <img src=\"").concat(item.imageUrl, "\" class=\"card-img-top\" alt=\"").concat(item.title, "\">\n                  <p class=\"card-img-text mb-0  fs-5\">\u770B\u8A73\u7D30</p>\n                </div>\n                <div class=\"card-body\">\n                  <h5>").concat(item.title, "</h5>\n                  <p class=\"mb-3\">\u552E\u50F9: <span>NT$ ").concat(tothousands(item.origin_price), "</span></p>\n                  <button type=\"button\" class=\"btn btn-outline-success shadow-none   w-100 d-flex justify-content-center align-items-center\" id=\"addCart\">\n                  <i class=\"bi bi-cart-plus fs-5  me-2\"></i>\n                  \u52A0\u5165\u8CFC\u7269\u8ECA\n                  </button>\n                </div>\n              </div>\n            </a>\n            </div>");
    }
  });
  selectProductsList.innerHTML = str;
}

; // 主廚推薦餐點 - 新增購物車 及 新增最愛功能
// 初始化 愛心icon

var heartIcon = "";

if (selectProductsList !== null) {
  selectProductsList.addEventListener("click", function (e) {
    if (e.target.nodeName === "BUTTON") {
      //取出產品 id
      var productId = e.target.closest("#productInnerUrl").dataset.id; // 加入購物車

      if (e.target.getAttribute("id") === "addCart") {
        e.preventDefault();
        swalFn("已加入購物車", "success", 800);
        addCartItem(productId, 1);
      }

      ; // 加入我的最愛

      if (e.target.getAttribute("id") === "addFavorite") {
        e.preventDefault(); // 取得 愛心icon DOM 元素

        heartIcon = e.target.firstElementChild;
        addFavoriteItem(heartIcon, productId);
      }

      ;
    }
  });
}

;
"use strict";

var orderForm = document.querySelector("#orderForm"); // 訂購表單

var submitFormBtn = document.querySelector("#submitFormBtn"); // 送出表單按鈕

if (submitFormBtn !== null) {
  submitFormBtn.addEventListener("click", function (e) {
    // 取出表單欄位的 dom 標籤元素
    var orderName = document.querySelector("#customerName"); // 姓名

    var orderEmail = document.querySelector("#customerEmail"); // Email

    var orderPhone = document.querySelector("#customerPhone"); // 手機號碼

    var orderAddress = document.querySelector("#customerAddress"); // 地址

    var orderTradeWay = document.querySelector("#tradeWay"); // 交易方式

    var orderMessage = document.querySelector("#customerMessage"); // 備註
    // 選取全部的 input 輸入欄位的 dom 標籤元素

    var inputs = document.querySelectorAll("input[type=text], input[type=tel], input[type=email],select,textarea"); // 訂購表單的物件資料

    var orderObj = {
      name: orderName.value,
      email: orderEmail.value,
      tel: orderPhone.value,
      address: orderAddress.value,
      payment: orderTradeWay.value,
      message: orderMessage.value
    }; // 制定驗證規則

    var constraints = {
      "姓名": {
        presence: {
          message: "是必填欄位"
        }
      },
      "email": {
        presence: {
          message: "是必填的欄位"
        },
        email: {
          message: "格式輸入錯誤"
        }
      },
      "手機號碼": {
        presence: {
          message: "是必填的欄位"
        },
        format: {
          pattern: /^09\d{2}-?\d{3}-?\d{3}$/,
          message: "開頭須為09"
        },
        length: {
          is: 10,
          message: "長度須為10碼"
        }
      },
      "地址": {
        presence: {
          message: "是必填的欄位"
        }
      },
      "付款方式": {
        presence: {
          message: "是必選的欄位"
        }
      }
    };

    if (cartData.length < 1) {
      e.preventDefault();
      swalFn("購物車無商品，請去選購!", "warning", 800);
      return;
    }

    ; // 針對每個input 綁定 change 事件監聽驗證，逐一改變錯誤訊息狀態

    inputs.forEach(function (item) {
      item.addEventListener("change", function (e) {
        item.nextElementSibling.textContent = '';
        var errors = validate(orderForm, constraints) || '';
        formCheck(errors);
      });
    }); // 將錯誤訊息 存取在 errors 變數上

    var errors = validate(orderForm, constraints); // 判斷 errors 錯誤訊息

    if (errors) {
      e.preventDefault();
      formCheck(errors);
      swalFn("資料未填寫完整", "warning", 800);
    } else {
      e.preventDefault();
      swalFn("訂單已建立", "success", 800); // 建立訂購表單

      createForm(orderObj); // 清除表單資料

      orderForm.reset();
    }

    ;
  });
}

; // 表單  - 建立訂購表單

function createForm(orderObj) {
  axios.post("".concat(apiUrl, "api/").concat(apiPath, "/order"), {
    "data": {
      "user": orderObj
    }
  }).then(function (reponse) {
    setTimeout(function () {
      window.location.href = "./payment.html";
    }, 800);
    getCartList();
  })["catch"](function (error) {
    console.log(error.data);
  });
} // 表單 -  驗證


function formCheck(errors) {
  Object.keys(errors).forEach(function (keys) {
    document.querySelector("[data-message=\"".concat(keys, "\"]")).textContent = errors[keys]; // console.log( document.querySelector(`[data-message="${keys}"]`));
  });
}

;
"use strict";

var orderData = [];
var orderProductsData = [];
var orderformInfo = document.querySelector("#orderformInfo");
var orderProdcuts = document.querySelector("#orderProdcuts"); // 付款 - 取得訂單資訊

function getOrderList() {
  axios.get("".concat(apiUrl, "api/").concat(apiPath, "/orders")).then(function (reponse) {
    // 訂單資料
    orderData = reponse.data.orders[0]; // Object.keys 物件迴圈取值，取出訂單資料內的產品物件

    orderProductsData = Object.values(reponse.data.orders[0].products);
    var orderId = orderData.id;

    if (orderProdcuts !== null) {
      renderOrderProdcuts(orderProductsData);
    }

    ;

    if (orderformInfo !== null) {
      renderOrderForm(orderData);
    }

    ; // 付款結帳

    payment(orderId);
  })["catch"](function (error) {
    console.log(error.data);
  });
} //付款 - 渲染訂單內的表單資料 


function renderOrderForm(arr) {
  // 要渲染表單和產品
  var str = "";
  str += "<div class=\"mb-3\">\n        <label for=\"customerName\" class=\"form-label\">\u59D3\u540D</label>\n        <input type=\"text\" class=\"form-control\" placeholder=\"".concat(arr.user.name, "\" disabled>\n    </div>\n    <div class=\"mb-3\">\n        <label for=\"customerEmail\" class=\"form-label\">\u96FB\u5B50\u90F5\u4EF6</label>\n        <input type=\"email\" class=\"form-control\" placeholder=\"").concat(arr.user.email, "\" disabled>\n    </div>\n    <div class=\"mb-3\">\n        <label for=\"customerPhone\" class=\"form-label\">\u624B\u6A5F\u865F\u78BC</label>\n        <input type=\"tel\" class=\"form-control\" placeholder=\"").concat(arr.user.tel, "\" disabled>\n    </div>\n    <div class=\"mb-3\">\n        <label for=\"customerAddress\" class=\"form-label\">\u5730\u5740</label>\n        <input type=\"text\" class=\"form-control\" placeholder=\"").concat(arr.user.address, "\" disabled>\n    </div>\n    <div class=\"mb-3\">\n        <label for=\"tradeWay\" class=\"form-label\">\u4ED8\u6B3E\u65B9\u5F0F</label>\n        <select class=\"form-select\"  disabled>\n            <option value=\"").concat(arr.user.payment, "\">Apple Pay</option>\n        </select>\n    </div>\n    <div class=\"mb-5\">\n        <label for=\"customerMessage\" class=\"form-label\">\u5099\u8A3B</label>\n        <textarea name=\"Remarks\" class=\"form-control\" placeholder=\"").concat(arr.user.message, "\" cols=\"30\" rows=\"5\"\n            disabled></textarea>\n    </div>");
  orderformInfo.innerHTML = str;
} //付款 - 渲染訂單內的產品資料


function renderOrderProdcuts(arr) {
  // 初始化組金額 為 0
  var finalTotal = 0;
  var str = ""; // 取的總金額 DOM 元素

  var orderTotalPrice = document.querySelector("#orderTotalPrice");
  arr.forEach(function (item) {
    str += "<li class=\"card  mb-3 shadow-sm\">\n        <div class=\"row align-items-center g-0\">\n            <div class=\"col\">\n                <div class=\"ratio ratio-4x3\">\n                    <img src=\"".concat(item.product.imageUrl, "\" class=\"img-fluid  rounded-start\"\n                        alt=\"").concat(item.product.title, "\">\n                </div>\n            </div>\n            <div class=\"col\">\n                <div class=\"card-body\">\n                    <h5 class=\"card-title\">").concat(item.product.title, "</h5>\n                    <p class=\"card-text mb-2\">\u6578\u91CF:").concat(item.qty, " </p>\n                    <p class=\"card-text\">\u7E3D\u50F9: <span>NT$ ").concat(item.qty * item.product.origin_price, " </span></p>\n                </div>\n            </div>\n        </div>\n    </li>"); // 計算總金額

    finalTotal += item.qty * item.product.origin_price;
  }); // 呈現在付款頁面

  orderTotalPrice.textContent = finalTotal;
  orderProdcuts.innerHTML = str;
} //付款 - 結帳


var payBtn = document.querySelector("#payBtn");

function payment(orderId) {
  if (payBtn !== null) {
    payBtn.addEventListener("click", function (e) {
      e.preventDefault();
      axios.post("".concat(apiUrl, "api/").concat(apiPath, "/pay/").concat(orderId)).then(function (response) {
        swalFn("付款完成", "success", 800);
        setTimeout(function () {
          window.location.href = "./orderSuccess.html";
        }, 800);
      })["catch"](function (error) {
        console.log(error.data);
      });
    });
  }
}
"use strict";

// 單一產品 - 菜單規格及注意事項內容
var navTabContent = document.querySelector("#nav-tabContent"); // 單一產品 - 產品內頁資訊

function getProductItem() {
  // // 取得產品內頁網址 id
  var productId = location.href.split("=")[1];

  if (productId !== undefined) {
    // 取得單一產品
    axios.get("".concat(apiUrl, "api/").concat(apiPath, "/product/").concat(productId)).then(function (response) {
      // 宣告 productData 變數 儲存串接回來的資料
      var productInnerData = response.data.product; // 單一產品 DOM 元素

      document.querySelector("#breadcrumb-productCategory").textContent = productInnerData.category;
      document.querySelector("#breadcrumb-productTitle").textContent = productInnerData.title;
      document.querySelector("#productImg").setAttribute("src", productInnerData.imageUrl);
      document.querySelector("#productTitle").textContent = productInnerData.title;
      document.querySelector("#productDescription").textContent = productInnerData.description;
      document.querySelector("#productPrice").textContent = tothousands(productInnerData.origin_price);
      document.querySelector("#addCartBtn").setAttribute("data-product-id", productInnerData.id); // 渲染單一產品頁面

      renderProductItem(productInnerData);
    })["catch"](function (error) {
      console.log(error.response.data);
    });
  }

  ;
}

; // 單一產品 - 渲染產品內頁資訊

function renderProductItem(data) {
  var str = "";
  str += "<div class=\"tab-pane fade show active\" id=\"nav-describe\" role=\"tabpanel\" aria-labelledby=\"nav-describe-tab\">\n   <ul class=\"mb-0\">\n       <h5 class=\"mb-3\">\u56B4\u9078\u98DF\u6750\u53CA\u71DF\u990A\u50F9\u503C: </h5>\n       ".concat(data.content, "\n     <li>\n        <div class=\"ratio ratio-16x9 mb-5\">\n           <img src=\"").concat(data.imagesUrl[0], "\" class=\"img-fluid \" alt=\"berry\">\n       </div></li>\n     <li>\n         <div class=\"ratio ratio-16x9\">\n           <img src=\"").concat(data.imagesUrl[1], "\" class=\"img-fluid\" alt=\"berry\">\n         </div>\n     </li>\n   </ul> \n  </div>\n  <div class=\"tab-pane fade\" id=\"nav-standard\" role=\"tabpanel\" aria-labelledby=\"nav-standard-tab\">\n      <ul class=\"mb-0\">\n      ").concat(data.unit, "\n      </ul>\n  </div>\n  <div class=\"tab-pane fade\" id=\"nav-delivery\" role=\"tabpanel\" aria-labelledby=\"nav-delivery-tab\">\n      <h5 class=\"mb-3\">\u4ED8\u6B3E\u65B9\u5F0F: </h5>\n      <ul class=\"mb-4 ps-4\">\n          <li class=\"mb-3\">\u96FB\u5B50\u652F\u4ED8: <span>Apple Pay\u3001LINE Pay\u3001\u8857\u53E3\u652F\u4ED8 </span></li>\n          <li>ATM\u8F49\u5E33: <span>\u56DB\u5927\u8D85\u5546\u3001\u5404\u5927\u9280\u884C\u63D0\u6B3E\u6A5F\u7686\u53EF\u64CD\u4F5C </span></li>\n      </ul>\n      <h5 class=\"mb-3\">\u904B\u9001\u65B9\u5F0F: </h5>\n      <p class=\"ps-4 mb-0\">\u5916\u9001\u6216\u4F86\u5E97\u81EA\u53D6</p>\n  </div>\n  <div class=\"tab-pane fade\" id=\"nav-notice\" role=\"tabpanel\" aria-labelledby=\"nav-notice-tab\">\n      <ul class=\"mb-0\">\n        <li class=\"mb-3\"><p> 1. \u9910\u9EDE\u70BA\u7576\u5929\u73FE\u9EDE\u73FE\u505A\uFF0C\u5982\u6709\u7279\u6B8A\u98F2\u98DF\u9700\u6C42\u53EF\u63D0\u524D\u4F86\u96FB\u6216 Line \u8A0A\u606F\u544A\u77E5\u3002</p></li>\n        <li><p> 2. \u9910\u9EDE\u6700\u4F73\u8CDE\u5473\u671F\u6548\u70BA\u534A\u5C0F\u6642\u5167\u9700\u98DF\u7528\u5B8C\u7562\u3002</p></li>\n     </ul>\n  </div>");
  navTabContent.innerHTML = str;
}

; // 單一產品 - 計算產品數量

var productNumWrap = document.querySelector("#productNumWrap"); // 從數量 1 開始計算

var numSum = 1;

if (productNumWrap !== null) {
  productInnerList.addEventListener("click", function (e) {
    e.preventDefault(); //  購買產品數量 DOM

    var productNum = document.querySelector("#productNum"); // 減少數量

    if (e.target.getAttribute("id") === "minusNumBtn") {
      if (numSum === 1) {
        swalFn("數量最少為1", "warning", 800);
        return;
      } else {
        numSum -= 1;
      }

      ;
    } else if (e.target.getAttribute("id") === "plusNumBtn") {
      //增加數量
      numSum += 1;
    }

    ; //按下加減鍵開啟loading

    toggleLoading(true); //更新數量後， 關閉loading

    setTimeout(function () {
      toggleLoading(false);
    }, 600); //  呈現 目前產品數量

    productNum.value = numSum; // 加入購物車

    if (e.target.getAttribute("id") === "addCartBtn") {
      var productId = e.target.dataset.productId;
      var productNumSum = parseInt(productNum.value);
      swalFn("已加入購物車", "success", 800);
      addCartItem(productId, productNumSum);
    }
  });
}

; // 渲染 熱銷餐點列表

var popularProductList = document.querySelector("#popularProductList");

function renderPopularProduct(arr) {
  var str = "";
  arr.forEach(function (item) {
    if (item.category === "飲品") {
      str += "<div class=\"col mb-4\">\n            <a data-id=".concat(item.id, " href=\"./productInner.html?id=").concat(item.id, "\" class=\"text-dark\" id=\"productInnerUrl\">\n              <div class=\"card custom-card  shadow-sm\">\n              \n              <button type=\"button\" class=\"btn  position-absolute   shadow-none  border-0  fs-5 favoriteBtn\" id=\"addFavorite\" style=\"z-index: 1;\">\n                  <i class=\"bi bi-heart custom-icon-heart text-danger py-0\" ></i>\n             </button>\n      \n                <div class=\"card-img-wrap\">\n                  <img src=\"").concat(item.imageUrl, "\" class=\"card-img-top\" alt=\"").concat(item.title, "\">\n                  <p class=\"card-img-text mb-0  fs-5\">\u770B\u8A73\u7D30</p>\n                </div>\n                <div class=\"card-body\">\n                  <h5>").concat(item.title, "</h5>\n                  <p class=\"mb-3\">\u552E\u50F9: <span>NT$ ").concat(tothousands(item.origin_price), "</span></p>\n                  <button type=\"button\" class=\"btn btn-outline-success shadow-none   w-100 d-flex justify-content-center align-items-center\" id=\"addCart\">\n                  <i class=\"bi bi-cart-plus fs-5  me-2\"></i>\n                  \u52A0\u5165\u8CFC\u7269\u8ECA\n                  </button>\n                </div>\n              </div>\n            </a>\n            </div>");
    }
  });
  popularProductList.innerHTML = str;
}

; //熱銷餐點 - 新增購物車 及 新增最愛功能
// 初始化 愛心icon

var heartIcon = "";

if (popularProductList !== null) {
  popularProductList.addEventListener("click", function (e) {
    if (e.target.nodeName === "BUTTON") {
      //取出產品 id
      var productId = e.target.closest("#productInnerUrl").dataset.id; // 加入購物車

      if (e.target.getAttribute("id") === "addCart") {
        e.preventDefault();
        swalFn("已加入購物車", "success", 800);
        addCartItem(productId, 1);
        return;
      }

      ; // 加入我的最愛

      if (e.target.getAttribute("id") === "addFavorite") {
        e.preventDefault(); // 取得 愛心icon DOM 元素

        heartIcon = e.target.firstElementChild;
        addFavoriteItem(heartIcon, productId);
      }

      ;
    }
  });
}

;
"use strict";

// DOM 元素管理
// 產品列表
var productsList = document.querySelector("#productsList"); // 切換餐點按鈕群組

var btnGroup = document.querySelector("#btn-group"); // 商品資訊 - 渲染產品列表

function renderProductsList(arr) {
  var str = "";
  arr.forEach(function (item) {
    str += "<div class=\"col mb-4\">\n      <a data-id=".concat(item.id, " href=\"./productInner.html?id=").concat(item.id, "\" class=\"text-dark\" id=\"productInnerUrl\">\n        <div class=\"card custom-card  shadow-sm\">\n        \n        <button type=\"button\" class=\"btn  position-absolute   shadow-none  border-0  fs-5 favoriteBtn\" id=\"addFavorite\" style=\"z-index: 1;\">\n            <i class=\"bi bi-heart custom-icon-heart text-danger py-0\" ></i>\n       </button>\n\n          <div class=\"card-img-wrap\">\n            <img src=\"").concat(item.imageUrl, "\" class=\"card-img-top\" alt=\"").concat(item.title, "\">\n            <p class=\"card-img-text mb-0  fs-5\">\u770B\u8A73\u7D30</p>\n          </div>\n          <div class=\"card-body\">\n            <h5>").concat(item.title, "</h5>\n            <p class=\"mb-3\">\u552E\u50F9: <span>NT$ ").concat(tothousands(item.origin_price), "</span></p>\n            <button type=\"button\" class=\"btn btn-outline-success shadow-none   w-100 d-flex justify-content-center align-items-center\" id=\"addCart\">\n            <i class=\"bi bi-cart-plus fs-5  me-2\"></i>\n            \u52A0\u5165\u8CFC\u7269\u8ECA\n            </button>\n          </div>\n        </div>\n      </a>\n      </div>");
  });
  productsList.innerHTML = str;
}

; // 商品資訊-  切換餐點按鈕 及 修改狀態
//預設category 分類值為全部商品

var toggleCategory = "全部商品"; // 判斷當下載入頁面是否有 btnGroup DOM 元素

if (btnGroup !== null) {
  // btnGroup 綁定監聽事件
  btnGroup.addEventListener("click", changeTab);
}

;

function changeTab(e) {
  // 判斷點擊到是否是按鈕"BUTTON"
  if (e.target.nodeName === "A") {
    // 取出按鈕分類的值
    toggleCategory = e.target.dataset.category; // 按鈕增加active 樣式

    var allbtns = document.querySelectorAll("#btn-group a"); // allTabs 回傳類陣列跑foreach 先將 active 全部移除 再加上去

    allbtns.forEach(function (item) {
      item.classList.remove("active");
    }); //點擊到對應的 按鈕 再增加 active 樣式

    e.target.classList.add("active");
  }

  ; // 更新餐點列表

  updateProductsList();
}

; // 商品資訊 - 餐點按鈕篩選資料功能

function updateProductsList() {
  // 宣告 filtersData 變數 用來儲存篩選後的資料
  var filtersData = []; //  顯示 麵包削產品狀態

  var productsCategory = document.querySelector("#productsCategory");

  if (toggleCategory === "全部商品") {
    filtersData = productsData;
    productsCategory.textContent = "全部商品";
  } else {
    filtersData = productsData.filter(function (item) {
      return item.category === toggleCategory;
    });
    productsCategory.textContent = toggleCategory;
  }

  ; // 呈現該頁資料畫面

  renderProductsList(filtersData); // 呈現分頁

  renderPages(filtersData, 1);
}

; // 新增功能整合 - 新增購物車 及 新增最愛功能
// 初始化 愛心icon

var heartIcon = "";

if (productsList !== null) {
  // 在產品列表綁定監聽
  productsList.addEventListener("click", function (e) {
    if (e.target.nodeName === "BUTTON") {
      //取出產品 id
      var productId = e.target.closest("#productInnerUrl").dataset.id; // 加入購物車

      if (e.target.getAttribute("id") === "addCart") {
        e.preventDefault();
        swalFn("已加入購物車", "success", 800);
        addCartItem(productId, 1);
        return;
      }

      ; // 加入我的最愛

      if (e.target.getAttribute("id") === "addFavorite") {
        e.preventDefault(); // 取得 愛心icon DOM 元素

        heartIcon = e.target.firstElementChild;
        addFavoriteItem(heartIcon, productId);
      }

      ;
    }
  });
}

; // 分頁功能 - 整體分頁功能

function renderPages(data, nowPage) {
  // 每一頁只顯示五筆資料
  var dataPerPage = 5; // page 按鈕總數量公式: 資料數量總額 / 每一頁要顯示的資料數量
  // 因為計算過程會有餘數產生，所以要無條件進位，使用 Math.ceil()函式取得一個大於等於指定數字的最小整數。

  var totalPages = Math.ceil(data.length / dataPerPage); // 頁數
  // 當前頁數，對應現在當前頁數

  var currentPage = nowPage; // 當 "當前頁數" 比 "總頁數" 大的時候， "當前頁數" 等於 "總頁數"

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  ; // 資料筆數

  var minData = currentPage * dataPerPage - dataPerPage + 1; // 最小資料筆數

  var maxData = currentPage * dataPerPage; // 最大資料筆數
  // 取出當前頁數的資料

  var currentPageData = []; // // 取得 productsData 資料的索引位置

  data.forEach(function (item, index) {
    //取得 data 索引位置，因為索引是從 0 開始，所以要 +1
    //當 index+1 比 minData 大且又小於 maxData 就push 進去 currentPageData 陣列
    if (index + 1 >= minData && index + 1 <= maxData) {
      currentPageData.push(item);
    }

    ;
  }); // 物件方式傳遞資料

  var pageInfo = {
    totalPages: totalPages,
    currentPage: currentPage,
    hasPage: currentPage > 1,
    hasNext: currentPage < totalPages
  }; // 呈現出該頁資料

  renderProductsList(currentPageData); // 呈現出分頁按鈕

  renderPageBtn(pageInfo); // console.log(`全部資料:${data.length} 每一頁顯示:${dataPerPage}筆 總頁數:${totalPages}`);
}

; // 取得分頁 DOM 元素

var pageId = document.querySelector("#pageId"); // 在 pageId 綁定監聽

if (pageId !== null) {
  pageId.addEventListener("click", switchPage);
}

; // 分頁功能 - 渲染分頁按鈕

function renderPageBtn(pageInfo) {
  var str = "";
  var totalPages = pageInfo.totalPages; // 判斷 總頁數是否大於 1 頁

  if (totalPages > 1) {
    //點選上一頁
    str += pageInfo.hasPage ? "<li class=\"page-item\"><a class=\"page-link\" href=\"#\"  data-page=\"".concat(Number(pageInfo.currentPage) - 1, "\">&laquo;</a></li>") : "<li class=\"page-item disabled\"><span class=\"page-link\">&laquo;</span></li>"; // 點選頁數

    for (var i = 1; i <= totalPages; i++) {
      // 一開始預設顯示第一頁，如果是第一頁會加上 .active 樣式
      str += Number(pageInfo.currentPage) === i ? "<li class=\"page-item active\"><a class=\"page-link\" href=\"#\" aria-label=\"Previous\" data-page=\"".concat(i, "\">").concat(i, "</a></li>") : "<li class=\"page-item\"><a class=\"page-link\" href=\"#\" data-page=\"".concat(i, "\">").concat(i, "</a></li>");
    }

    ; // 點選下一頁

    str += pageInfo.hasNext ? "<li class=\"page-item\"><a class=\"page-link\" href=\"#\" aria-label=\"Next\" data-page=\"".concat(Number(pageInfo.currentPage) + 1, "\">&raquo;</a></li>") : "<li class=\"page-item disabled\"><span class=\"page-link\" >&raquo;</span></li>";
  } else {
    //總頁數小於 1 頁，只顯示分頁按鈕
    for (var _i = 1; _i <= totalPages; _i++) {
      // 一開始預設顯示第一頁，如果是第一頁會加上 .active 樣式
      str += Number(pageInfo.currentPage) === _i ? "<li class=\"page-item active\"><a class=\"page-link\" href=\"#\" aria-label=\"Previous\" data-page=\"".concat(_i, "\">").concat(_i, "</a></li>") : "<li class=\"page-item\"><a class=\"page-link\" href=\"#\" data-page=\"".concat(_i, "\">").concat(_i, "</a></li>");
    }

    ;
  }

  ;
  pageId.innerHTML = str;
}

; //分頁功能 - 點擊按鈕切換頁面功能

function switchPage(e) {
  e.preventDefault();

  if (e.target.nodeName !== "A") {
    return;
  }

  ;
  var clickPage = e.target.dataset.page;
  renderPages(productsData, clickPage);
}

;
"use strict";

// sweetAlert
// 提示訊息
// success 成功, error 錯誤, warning 驚嘆號 , info 說明
function swalFn(title, icon, time) {
  swal.fire({
    toast: true,
    position: 'top-end',
    title: title,
    icon: icon,
    timer: time,
    showConfirmButton: false
  });
}

;
"use strict";

// 首頁 heroBanner 
var swiperHeroBanner = new Swiper(".swiper-heroBanner", {
  slidesPerView: 1,
  loop: true,
  autoplay: {
    disableOnInteraction: false,
    delay: 4000
  }
}); // 顧客評價

var swiperRecommend = new Swiper(".swiper-recommend", {
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  autoplay: {
    disableOnInteraction: false,
    delay: 3500
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
      spaceBetween: 30
    }
  }
}); //  最新消息

var swiperNews = new Swiper(".swiper-news", {
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  autoplay: {
    disableOnInteraction: false,
    delay: 3500
  },
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets'
  },
  breakpoints: {
    768: {
      slidesPerView: 1,
      spaceBetween: 30
    }
  }
});
"use strict";

// 數字轉換千分位函式
function tothousands(num) {
  var parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

; // loading 載入動態

function toggleLoading(show) {
  //show的參數，從外部傳入如果是true 就 開啟loading，flase 就關閉
  document.querySelector(".loading").style.display = show ? 'block' : 'none';
}

; // gotop 回到頂部 
// goTop Dom

var goTopBtn = document.querySelector("#goTopBtn"); //當使用者y軸  超過 800 出現 goTopBtn ，反之消失

document.addEventListener("scroll", handleScroll); //點擊 goTopBtn監聽事件，如果scrollY != 0 的話，執行 Window.scrollTo() 內的 平滑滾動至 0

if (goTopBtn !== null) {
  goTopBtn.addEventListener("click", scrollGoTop);
}

function handleScroll() {
  if (window.scrollY >= 800) {
    goTopBtn.classList.remove("d-none");
    goTopBtn.classList.add("d-block");
  } else {
    goTopBtn.classList.remove("d-block");
    goTopBtn.classList.add("d-none");
  }
}

;

function scrollGoTop() {
  if (window.scrollY != 0) {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
}

;
//# sourceMappingURL=all.js.map
