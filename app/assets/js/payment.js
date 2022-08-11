let orderData = [];
let orderProductsData = [];

const orderformInfo = document.querySelector("#orderformInfo");
const orderProdcuts = document.querySelector("#orderProdcuts");

// 付款 - 取得訂單資訊
function getOrderList() {
    axios.get(`${apiUrl}api/${apiPath}/orders`)
        .then(function (reponse) {
            // 訂單資料
            orderData = reponse.data.orders[0];
            
            // Object.values 物件迴圈取值，取出訂單資料內的產品物件
            orderProductsData = Object.values(reponse.data.orders[0].products);

            let orderId = orderData.id;

            if (orderProdcuts) {
                renderOrderProdcuts(orderProductsData);
            };

            if (orderformInfo) {
                renderOrderForm(orderData);
            };


            // 付款結帳
            payment(orderId);
        })

        .catch(function (error) {
            console.log(error.data);
        })
}

//付款 - 渲染訂單內的表單資料 
function renderOrderForm(arr) {

    // 要渲染表單和產品
    let str = "";

    str += `<div class="mb-3">
        <label for="customerName" class="form-label">姓名</label>
        <input type="text" class="form-control" placeholder="${arr.user.name}" disabled>
    </div>
    <div class="mb-3">
        <label for="customerEmail" class="form-label">電子郵件</label>
        <input type="email" class="form-control" placeholder="${arr.user.email}" disabled>
    </div>
    <div class="mb-3">
        <label for="customerPhone" class="form-label">手機號碼</label>
        <input type="tel" class="form-control" placeholder="${arr.user.tel}" disabled>
    </div>
    <div class="mb-3">
        <label for="customerAddress" class="form-label">地址</label>
        <input type="text" class="form-control" placeholder="${arr.user.address}" disabled>
    </div>
    <div class="mb-3">
        <label for="tradeWay" class="form-label">付款方式</label>
        <select class="form-select"  disabled>
            <option value="${arr.user.payment}">Apple Pay</option>
        </select>
    </div>
    <div class="mb-5">
        <label for="customerMessage" class="form-label">備註</label>
        <textarea name="Remarks" class="form-control" placeholder="${arr.user.message}" cols="30" rows="5"
            disabled></textarea>
    </div>`;

    orderformInfo.innerHTML = str;
}

//付款 - 渲染訂單內的產品資料
function renderOrderProdcuts(arr) {
    // 初始化組金額 為 0
    let finalTotal = 0;

    let str = "";

    // 取的總金額 DOM 元素
    const orderTotalPrice = document.querySelector("#orderTotalPrice");

    arr.forEach((orderItem) => {
        str += `<li class="card  mb-3 shadow-sm">
        <div class="row align-items-center g-0">
            <div class="col">
                <div class="ratio ratio-4x3">
                    <img src="${orderItem.product.imageUrl}" class="img-fluid  rounded-start"
                        alt="${orderItem.product.title}">
                </div>
            </div>
            <div class="col">
                <div class="card-body py-0">
                    <h5 class="fs-6 fs-md-5 card-title">${orderItem.product.title}</h5>
                    <p class="card-text mb-2">數量:${orderItem.qty} </p>
                    <p class="card-text">總價: <span>NT$ ${tothousands(orderItem.qty * orderItem.product.origin_price)} </span></p>
                </div>
            </div>
        </div>
    </li>`;

        // 計算總金額
        finalTotal += orderItem.qty * orderItem.product.origin_price;
    })

    // 呈現在付款頁面
    orderTotalPrice.textContent = tothousands(finalTotal);
    orderProdcuts.innerHTML = str;
}


//付款 - 結帳
const payBtn = document.querySelector("#payBtn");

function payment(orderId) {
    if (payBtn) {
        payBtn.addEventListener("click", function (e) {
            e.preventDefault();
            axios.post(`${apiUrl}api/${apiPath}/pay/${orderId}`)
                .then(function (response) {
                    swalFn("付款完成", "success", 800);
                    setTimeout(() => {window.location.href ="./orderSuccess.html";}, 800);
                })

                .catch(function (error) {
                    console.log(error.data);
                })
        })
    }
}



