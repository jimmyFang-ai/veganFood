
// DOM 元素管理
// 產品列表
const productsList = document.querySelector("#productsList");
// 切換餐點按鈕群組
const btnGroup = document.querySelector("#btn-group");


// 商品資訊 - 渲染產品列表
function renderProductsList(arr) {
  let str = "";
  arr.forEach((productsItem) => {
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
            <p class="mb-3">售價: <span>NT$ ${tothousands(productsItem.origin_price)}</span></p>
            <button type="button" class="btn btn-outline-success shadow-none   w-100 d-flex justify-content-center align-items-center" id="addCart">
            <i class="bi bi-cart-plus fs-5  me-2"></i>
            加入購物車
            </button>
          </div>
        </div>
      </a>
      </div>`;
  });

  productsList.innerHTML = str;
};

// 商品資訊-  切換餐點按鈕 及 修改狀態
//預設category 分類值為全部商品
let toggleCategory = "全部商品";

// 判斷當下載入頁面是否有 btnGroup DOM 元素
if (btnGroup !== null) {
  // btnGroup 綁定監聽事件
  btnGroup.addEventListener("click", changeTab);
};
function changeTab(e) {
  // 判斷點擊到是否是按鈕"BUTTON"
  if (e.target.nodeName === "A") {

    // 取出按鈕分類的值
    toggleCategory = e.target.dataset.category;

    // 按鈕增加active 樣式
    const allbtns = document.querySelectorAll("#btn-group a");

    // allTabs 回傳類陣列跑foreach 先將 active 全部移除 再加上去
    allbtns.forEach((btn) => {
      btn.classList.remove("active");
    });

    //點擊到對應的 按鈕 再增加 active 樣式
    e.target.classList.add("active");
  };

  // 更新餐點列表
  updateProductsList();

};


// 商品資訊 - 餐點按鈕篩選資料功能
function updateProductsList() {
  // 宣告 filtersData 變數 用來儲存篩選後的資料
  let filtersData = [];

  //  顯示 麵包削產品狀態
  const productsCategory = document.querySelector("#productsCategory");

  if (toggleCategory === "全部商品") {
    filtersData = productsData;
    productsCategory.textContent = "全部商品";

  } else {
    filtersData = productsData.filter(productsItem => productsItem.category === toggleCategory);
    productsCategory.textContent = toggleCategory;

  };

  // 呈現該頁資料畫面
  renderProductsList(filtersData);

  // 呈現分頁
  renderPages(filtersData, 1);

  // 呈現愛心按鈕
  renderAddFavoriteBtn();
};



// 新增功能整合 - 新增購物車 及 新增最愛功能
if (productsList !== null) {
  // 在產品列表綁定監聽
  productsList.addEventListener("click", function (e) {

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

        // 產品列表跑 forEach 將 id 取出來與 productId 比對，符合的話加入我的最愛
        productsData.forEach((productItem) => {

          if (productItem.id !== productId) { return; }

          // 切換愛心樣式
          // 點擊到加入我的最愛時，沒有實心愛心就加上並新增一筆資料到favoriteData
          if (e.target.children[0].classList.contains("bi-heart")) {
            // 加入我的愛心
            addFavorites(productItem, productId);
            toggleAddFavorite(productId);
          } else {
            // 有實心愛心就從 favoriteData移除一筆資料
            delFavorite(productId)
            toggleAddFavorite(productId);
          };


          // 將資料寫入 localStorage
          localStorage.setItem("favoriteItem", JSON.stringify(favoriteData));
          getFavoriteList();
        });
      };
    }
  });
};



// 分頁功能 - 整體分頁功能
function renderPages(data, nowPage) {

  // 每一頁只顯示五筆資料
  const dataPerPage = 5;

  // page 按鈕總數量公式: 資料數量總額 / 每一頁要顯示的資料數量
  // 因為計算過程會有餘數產生，所以要無條件進位，使用 Math.ceil()函式取得一個大於等於指定數字的最小整數。
  const totalPages = Math.ceil(data.length / dataPerPage);


  // 頁數
  // 當前頁數，對應現在當前頁數
  let currentPage = nowPage;
  // 當 "當前頁數" 比 "總頁數" 大的時候， "當前頁數" 等於 "總頁數"
  if (currentPage > totalPages) {
    currentPage = totalPages;
  };

  // 資料筆數
  const minData = (currentPage * dataPerPage) - dataPerPage + 1; // 最小資料筆數
  const maxData = (currentPage * dataPerPage);  // 最大資料筆數

  // 取出當前頁數的資料
  const currentPageData = [];

  // // 取得 productsData 資料的索引位置
  data.forEach((item, index) => {
    //取得 data 索引位置，因為索引是從 0 開始，所以要 +1
    //當 index+1 比 minData 大且又小於 maxData 就push 進去 currentPageData 陣列
    if (index + 1 >= minData && index + 1 <= maxData) {
      currentPageData.push(item);
    };
  });


  // 物件方式傳遞資料
  const pageInfo = {
    totalPages,
    currentPage,
    hasPage: currentPage > 1,
    hasNext: currentPage < totalPages,
  };

  // 呈現出該頁資料
  renderProductsList(currentPageData);

  // 呈現出分頁按鈕
  renderPageBtn(pageInfo);

  // console.log(`全部資料:${data.length} 每一頁顯示:${dataPerPage}筆 總頁數:${totalPages}`);
};

// 取得分頁 DOM 元素
const pageId = document.querySelector("#pageId");

// 在 pageId 綁定監聽
if (pageId !== null) {
  pageId.addEventListener("click", switchPage);
};

// 分頁功能 - 渲染分頁按鈕
function renderPageBtn(pageInfo) {
  let str = "";

  const totalPages = pageInfo.totalPages;

  // 判斷 總頁數是否大於 1 頁
  if (totalPages > 1) {
    //點選上一頁
    str += (pageInfo.hasPage) ?
      `<li class="page-item"><a class="page-link" href="#"  data-page="${Number(pageInfo.currentPage) - 1}">&laquo;</a></li>`
      : `<li class="page-item disabled"><span class="page-link">&laquo;</span></li>`;

    // 點選頁數
    for (let i = 1; i <= totalPages; i++) {
      // 一開始預設顯示第一頁，如果是第一頁會加上 .active 樣式
      str += (Number(pageInfo.currentPage) === i) ?
        `<li class="page-item active"><a class="page-link" href="#" aria-label="Previous" data-page="${i}">${i}</a></li>`
        : `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
    };

    // 點選下一頁
    str += (pageInfo.hasNext) ?
      `<li class="page-item"><a class="page-link" href="#" aria-label="Next" data-page="${Number(pageInfo.currentPage) + 1}">&raquo;</a></li>`
      : `<li class="page-item disabled"><span class="page-link" >&raquo;</span></li>`;

  } else {
    //總頁數小於 1 頁，只顯示分頁按鈕
    for (let i = 1; i <= totalPages; i++) {
      // 一開始預設顯示第一頁，如果是第一頁會加上 .active 樣式
      str += (Number(pageInfo.currentPage) === i) ?
        `<li class="page-item active"><a class="page-link" href="#" aria-label="Previous" data-page="${i}">${i}</a></li>`
        : `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
    };

  };

  pageId.innerHTML = str;
};

//分頁功能 - 點擊按鈕切換頁面功能
function switchPage(e) {
  e.preventDefault();

  if (e.target.nodeName !== "A") {
    return;
  };

  const clickPage = e.target.dataset.page;

  renderPages(productsData, clickPage);

  // 渲染愛心按鈕
  renderAddFavoriteBtn();
};