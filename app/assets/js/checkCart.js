
const checkCartList = document.querySelector("#checkCartList");


// 確認購物車 - 渲染購物車列表
function renderCheckCartList(arr) {

    let str = "";

    // 初始化組金額 為 0
    let finalTotal = 0;

    // DOM 元素
    // 結帳
    const cartAccout = document.querySelector("#cartAccout");

    // 計算總金額
    const cartTotalPrice = document.querySelector("#cartTotalPrice");


    if (arr.length < 1) {
        str += `<tr><td colspan="6" class="py-6">
        <h5 class="mb-5 text-center">購物車內沒有商品，趕快去逛逛吧!
            </h5>
        <a class="btn btn-primary btn-lg" href="./productLists.html">立即點餐</a>
      </td>
      </tr>`;

        cartAccout.classList.add("d-none");
    } else {
        arr.forEach((item, index) => {
            str += `<tr data-cart-id=${item.id}>
            <td>

            <div class="row gx-0 align-items-center">
            <div class="col-6 d-none d-md-block">
                <img class="img-fluid" src="${item.product.imageUrl}" alt="巴西莓果碗">
            </div>
            <div class="col col-md-6">
                <p class="mb-2">${item.product.title}</p>
                <span>NT$ ${item.product.origin_price}</span>
            </div>
        </div>
            </td>
            <td>
            <div class="d-flex justify-content-center">
            <div class="input-group text-center" style="max-width: 160px;">
                <button type="button" class="btn text-success fs-4 shadow-none px-1 px-md-3" id="minusNumBtn" data-product-num="${index}"  data-product-id="${item.product_id}">
                    -
                </button>
                <input type="number" class="form-control text-center w-25 px-1 px-md-2 " id="productNumInput"  data-product-num="${index}"   value="${item.qty}" min="1" >
                    <button type="button" class="btn text-success fs-4  shadow-none px-1 px-md-3" id="plusNumBtn"data-product-num="${index}"  data-product-id="${item.product_id}"> 
                      +
                    </button>
            </div>
        </div>
            </td>
            <td>NT$ ${tothousands(item.product.origin_price * item.qty)}</td>
            <td>
                <button type="button" class="btn  shadow-none  border-0 p-0" id="delCartBtn">
                    <i class="bi bi-trash-fill text-danger custom-icon-middle"></i>
                </button>
            </td>
            </tr>`;

            //  計算總金額
            finalTotal += item.product.origin_price * item.qty;


        });

        cartAccout.classList.remove("d-none");
    }

    // 呈現總金額
    cartTotalPrice.textContent = tothousands(finalTotal);

    // 呈現購物車產品列表
    checkCartList.innerHTML = str;
};

// 確認購物車 - 功能整合 (刪除和修改)
if (checkCartList !== null) {
    checkCartList.addEventListener("click", function (e) {

        // 取出 購物車id
        const cartId = e.target.closest("tr").dataset.cartId;

        // 取出 購物車產品 id
        const productId = e.target.dataset.productId;

        // 取出 DOM id
        const btnId = e.target.getAttribute("id");

        if (e.target.nodeName !== "BUTTON") {
            return;
        };

        // 單筆刪除
        if (e.target.getAttribute("id") === "delCartBtn") {
            e.preventDefault();
            swalFn("已刪除單筆餐點", "success", 800);
            deleteCartItem(cartId);
        };

        // 修改購物車數量
        if (btnId === "plusNumBtn" || btnId === "minusNumBtn") {
            e.preventDefault();
            // 取出 購物車產品的數量
            const productNum = e.target.dataset.productNum;
            changeCartNum(btnId, cartId, productId, productNum);
        };
    });
};


// 確認購物車 -  全部刪除
const delAllCartBtn = document.querySelector("#delAllCartBtn");
if (delAllCartBtn !== null) {
    delAllCartBtn.addEventListener("click", function (e) {
        e.preventDefault();

        axios.delete(`${apiUrl}api/${apiPath}/carts`)
            .then(function (reponse) {
                swalFn("購物車已清空", "success", 800);
                getCartList();
            })

            .catch(function (error) {
                console.log(error.data);
            })

    })
};


// 確認購物車 - 修改購物車數量
function changeCartNum(btnId, cartId, productId, productNum) {
    const productNumInput = document.querySelectorAll("#productNumInput"); // 將所有產品數字 DOM元素全部選取
    let productNumDom = productNumInput[productNum]; //取出 productNumInput 類陣列的索引位置的 DOM元素
    let numSum = parseInt(productNumDom.value); // 將 productNumInput 類陣列的索引位置的 DOM元素的值取出 並轉換為數字

    // 減少數量
    if (btnId === "minusNumBtn") {
        if (numSum === 1) {
            swalFn("數量最少為1", "warning", 800);
            return;
        } else {
            numSum -= 1;
        };
    } else if (btnId === "plusNumBtn") {
        //增加數量
        numSum += 1;
    }

    //按下加減鍵開啟loading
    toggleLoading(true);

    axios.put(`${apiUrl}api/${apiPath}/cart/${cartId}`, {
        "data":
        {
            "product_id": productId, "qty": numSum
        }
    })
        .then(function (reponse) {
            //更新數量後， 關閉loading
            setTimeout(() => { toggleLoading(false); }, 600);
            getCartList();
        })

        .catch(function (error) {
            console.log(error.data);
        })
};

