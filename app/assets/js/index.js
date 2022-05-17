
// 主廚推薦餐點列表 DOM
const selectProductsList = document.querySelector("#selectProductsList");

// 渲染 主廚推薦餐點列表
function renderSelectProducts(arr) {
    let str = "";

    arr.forEach((item) => {
        if (item.category === "主餐") {
            str += `<div class="col mb-4">
            <a data-id=${item.id} href="./productInner.html?id=${item.id}" class="text-dark" id="productInnerUrl">
              <div class="card custom-card  shadow-sm">
              
              <button type="button" class="btn  position-absolute   shadow-none  border-0  fs-5 favoriteBtn" id="addFavorite" style="z-index: 1;">
                  <i class="bi bi-heart custom-icon-heart text-danger py-0" ></i>
             </button>
      
                <div class="card-img-wrap">
                  <img src="${item.imageUrl}" class="card-img-top" alt="${item.title}">
                  <p class="card-img-text mb-0  fs-5">看詳細</p>
                </div>
                <div class="card-body">
                  <h5>${item.title}</h5>
                  <p class="mb-3">售價: <span>NT$ ${tothousands(item.origin_price)}</span></p>
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

    selectProductsList.innerHTML = str;
};

// 主廚推薦餐點 - 新增購物車 及 新增最愛功能
// 初始化 愛心icon
let heartIcon = "";

if (selectProductsList !== null) {
    selectProductsList.addEventListener("click", function (e) {
        if (e.target.nodeName === "BUTTON") {
            //取出產品 id
            const productId = e.target.closest("#productInnerUrl").dataset.id;

            // 加入購物車
            if (e.target.getAttribute("id") === "addCart") {
                e.preventDefault();
                swalFn("已加入購物車", "success", 800);
                addCartItem(productId, 1);
            };

            // 加入我的最愛
            if (e.target.getAttribute("id") === "addFavorite") {
                e.preventDefault();
                // 取得 愛心icon DOM 元素
                heartIcon = e.target.firstElementChild;
                addFavoriteItem(heartIcon, productId);
            };
        }
    })
};