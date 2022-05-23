
// 主廚推薦餐點列表 DOM
const selectProductsList = document.querySelector("#selectProductsList");

// 渲染 主廚推薦餐點列表
function renderSelectProducts(arr) {
    let str = "";

    arr.forEach((productsItem) => {
        if (productsItem.category === "主餐") {
            str += `<div class="col mb-4">
            <a data-id=${productsItem.id} href="./productInner.html?id=${productsItem.id}" class="text-dark" id="productInnerUrl">
              <div class="card custom-card  shadow-sm">
              
              <button type="button" class="btn  position-absolute   shadow-none  border-0  fs-5 favoriteBtn" id="addFavorite" style="z-index: 1;">
                  <i class="bi bi-heart custom-icon-heart text-danger py-0" data-favorite-id=${productsItem.id}></i>
             </button>
      
                <div class="card-img-wrap">
                  <img src="${productsItem.imageUrl}" class="card-img-top" alt="${productsItem.title}">
                  <p class="card-img-text mb-0  fs-5">看詳細</p>
                </div>
                <div class="card-body">
                  <h5>${productsItem.title}</h5>
                  <p class="mb-3">售價: NT$ <span> ${tothousands(productsItem.origin_price)}</span></p>
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

if (selectProductsList !== null) {
    selectProductsList.addEventListener("click", function (e) {
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


