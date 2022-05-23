
// 單一產品 - 菜單規格及注意事項內容
const navTabContent = document.querySelector("#nav-tabContent");

// 單一產品 - 產品內頁資訊
function getProductItem() {
    // // 取得產品內頁網址 id
    const productId = location.href.split("=")[1];

    if (productId !== undefined) {
        // 取得單一產品
        axios.get(`${apiUrl}api/${apiPath}/product/${productId}`)
            .then(function (response) {

                // 宣告 productData 變數 儲存串接回來的資料
                let productInnerData = response.data.product;

                // 單一產品 DOM 元素
                document.querySelector("#breadcrumb-productCategory").textContent = productInnerData.category;
                document.querySelector("#breadcrumb-productTitle").textContent = productInnerData.title;
                document.querySelector("#productImg").setAttribute("src", productInnerData.imageUrl);
                document.querySelector("#productTitle").textContent = productInnerData.title;
                document.querySelector("#productDescription").textContent = productInnerData.description;
                document.querySelector("#productPrice").textContent = tothousands(productInnerData.origin_price);
                document.querySelector("#addCartBtn").setAttribute("data-product-id", productInnerData.id);

                // 渲染單一產品頁面
                renderProductItem(productInnerData);

            })
            .catch(function (error) {
                console.log(error.response.data);
            })
    };
};

// 單一產品 - 渲染產品內頁資訊
function renderProductItem(data) {
    let str = "";

    str += `<div class="tab-pane fade show active" id="nav-describe" role="tabpanel" aria-labelledby="nav-describe-tab">
   <ul class="mb-0">
       <h5 class="mb-3">嚴選食材及營養價值: </h5>
       ${data.content}
     <li>
        <div class="ratio ratio-16x9 mb-5">
           <img src="${data.imagesUrl[0]}" class="img-fluid " alt="berry">
       </div></li>
     <li>
         <div class="ratio ratio-16x9">
           <img src="${data.imagesUrl[1]}" class="img-fluid" alt="berry">
         </div>
     </li>
   </ul> 
  </div>
  <div class="tab-pane fade" id="nav-standard" role="tabpanel" aria-labelledby="nav-standard-tab">
      <ul class="mb-0">
      ${data.unit}
      </ul>
  </div>
  <div class="tab-pane fade" id="nav-delivery" role="tabpanel" aria-labelledby="nav-delivery-tab">
      <h5 class="mb-3">付款方式: </h5>
      <ul class="mb-4 ps-4">
          <li class="mb-3">電子支付: <span>Apple Pay、LINE Pay、街口支付 </span></li>
          <li>ATM轉帳: <span>四大超商、各大銀行提款機皆可操作 </span></li>
      </ul>
      <h5 class="mb-3">運送方式: </h5>
      <p class="ps-4 mb-0">外送或來店自取</p>
  </div>
  <div class="tab-pane fade" id="nav-notice" role="tabpanel" aria-labelledby="nav-notice-tab">
      <ul class="mb-0">
        <li class="mb-3"><p> 1. 餐點為當天現點現做，如有特殊飲食需求可提前來電或 Line 訊息告知。</p></li>
        <li><p> 2. 餐點最佳賞味期效為半小時內需食用完畢。</p></li>
     </ul>
  </div>`;

    navTabContent.innerHTML = str;
};


// 單一產品 - 計算產品數量
const productNumWrap = document.querySelector("#productNumWrap");

// 從數量 1 開始計算
let numSum = 1;

if (productNumWrap !== null) {
    productInnerList.addEventListener("click", function (e) {
        e.preventDefault();
        //  購買產品數量 DOM
        let productNum = document.querySelector("#productNum");

        // 減少數量
        if (e.target.getAttribute("id") === "minusNumBtn") {
            if (numSum === 1) {
                swalFn("數量最少為1", "warning", 800);
                return;
            } else {
                numSum -= 1;
            };
        } else if (e.target.getAttribute("id") === "plusNumBtn") {
            //增加數量
            numSum += 1;
        };

        //按下加減鍵開啟loading
        toggleLoading(true);
        //更新數量後， 關閉loading
        setTimeout(() => { toggleLoading(false); }, 600);

        //  呈現 目前產品數量
        productNum.value = numSum;

        // 加入購物車
        if (e.target.getAttribute("id") === "addCartBtn") {
            const productId = e.target.dataset.productId;
            let productNumSum = parseInt(productNum.value);
            addCartItem(productId, productNumSum);
            swalFn("已加入購物車", "success", 800);
        }
    })
};


// 渲染 熱銷餐點列表
const popularProductList = document.querySelector("#popularProductList");
function renderPopularProduct(arr) {
    let str = "";

    arr.forEach((productsItem) => {
        if (productsItem.category === "飲品") {
            str += `<div class="col mb-4">
            <a data-id=${productsItem.id} href="./productInner.html?id=${productsItem.id}" class="text-dark" id="productInnerUrl">
              <div class="card custom-card  shadow-sm">
              
              <button type="button" class="btn  position-absolute   shadow-none  border-0  fs-5 favoriteBtn" id="addFavorite" style="z-index: 1;">
                  <i class="bi bi-heart custom-icon-heart text-danger py-0"  data-favorite-id=${productsItem.id}></i>
             </button>
      
                <div class="card-img-wrap">
                  <img src="${productsItem.imageUrl}" class="card-img-top" alt="${productsItem.title}">
                  <p class="card-img-text mb-0  fs-5">看詳細</p>
                </div>
                <div class="card-body">
                  <h5>${productsItem.title}</h5>
                  <p class="mb-3">售價:NT$ <span> ${tothousands(productsItem.origin_price)}</span></p>
                  <button type="button" class="btn btn-outline-success shadow-none   w-100 d-flex justify-content-center align-items-center" id="addCart">
                  <i class="bi bi-cart-plus fs-5  me-2"></i>
                  加入購物車
                  </button>
                </div>
              </div>
            </a>
            </div>`;
        }
    });

    popularProductList.innerHTML = str;
};


//熱銷餐點 - 新增購物車 及 新增最愛功能
if (popularProductList !== null) {
    popularProductList.addEventListener("click", function (e) {
        if (e.target.nodeName === "BUTTON") {
            //取出產品 id
            const productId = e.target.closest("#productInnerUrl").dataset.id;

            // 加入購物車
            if (e.target.getAttribute("id") === "addCart") {
                e.preventDefault();
                addCartItem(productId, 1);
                swalFn("已加入購物車", "success", 800);
            };

            // 加入我的最愛
            if (e.target.getAttribute("id") === "addFavorite") {
                e.preventDefault();

                // 產品列表跑 forEach 將 id 取出來與 productId 比對，符合的話加入我的最愛
                productsData.forEach((productItem) => {

                    if (productItem.id !== productId) { return; }

                    // 切換愛心樣式
                    // 點擊到加入我的最愛時，沒有實心愛心就加上並新增一筆資料到favoriteData
                    if (e.target.children[0].classList.contains("bi-heart")) {
                        // 加入我的愛心
                        addFavorites(productItem, productId);
                        toggleAddFavorite(productId);
                        swalFn("已加入收藏", "success", 800);
                    } else {
                        // 有實心愛心就從 favoriteData移除一筆資料
                        delFavorite(productId)
                        toggleAddFavorite(productId);
                        swalFn("已移除收藏", "warning", 800);
                    };

                    // 將資料寫入 localStorage
                    localStorage.setItem("favoriteItem", JSON.stringify(favoriteData));
                    getFavoriteList();
                });
            };
        }
    })
};


