
const orderForm = document.querySelector("#orderForm"); // 訂購表單

const submitFormBtn = document.querySelector("#submitFormBtn");// 送出表單按鈕
if (submitFormBtn !== null) {
    submitFormBtn.addEventListener("click", function (e) {


        // 取出表單欄位的 dom 標籤元素
        const orderName = document.querySelector("#customerName"); // 姓名
        const orderEmail = document.querySelector("#customerEmail");// Email
        const orderPhone = document.querySelector("#customerPhone");// 手機號碼
        const orderAddress = document.querySelector("#customerAddress");// 地址
        const orderTradeWay = document.querySelector("#tradeWay");// 交易方式
        const orderMessage = document.querySelector("#customerMessage");// 備註

        // 選取全部的 input 輸入欄位的 dom 標籤元素
        const inputs = document.querySelectorAll("input[type=text], input[type=tel], input[type=email],select,textarea");


        // 訂購表單的物件資料
        let orderObj = {
            name: orderName.value,
            email: orderEmail.value,
            tel: orderPhone.value,
            address: orderAddress.value,
            payment: orderTradeWay.value,
            message: orderMessage.value
        };

        // 制定驗證規則
        const constraints = {
            "姓名": {
                presence: {
                    message: "是必填欄位"
                },
            },
            "email": {
                presence: {
                    message: "是必填的欄位"
                },
                email: {
                    message: "格式輸入錯誤"
                },
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
                },
            },
            "付款方式": {
                presence: {
                    message: "是必選的欄位"
                },
            }
        };


        if (cartData.length < 1) {
            e.preventDefault();
            swalFn("購物車無商品，請去選購!", "warning", 800);
            return;
        };



        // 針對每個input 綁定 change 事件監聽驗證，逐一改變錯誤訊息狀態
        inputs.forEach((item) => {
            item.addEventListener("change", function (e) {
                item.nextElementSibling.textContent = '';
                let errors = validate(orderForm, constraints) || '';
                formCheck(errors);
            })
        });

        // 將錯誤訊息 存取在 errors 變數上
        let errors = validate(orderForm, constraints);

        // 判斷 errors 錯誤訊息
        if (errors) {
            e.preventDefault();
            formCheck(errors);
            swalFn("資料未填寫完整", "warning", 800);
        } else {
            e.preventDefault();
            swalFn("訂單已建立", "success", 800);
            // 建立訂購表單
            createForm(orderObj);
            // 清除表單資料
            orderForm.reset();
        };
    })
};

// 表單  - 建立訂購表單
function createForm(orderObj) {
    axios.post(`${apiUrl}api/${apiPath}/order`, {
        "data": {
            "user": orderObj,
        }
    })
        .then(function (reponse) {
            setTimeout(() => { window.location.href = "./payment.html"; }, 800);
            getCartList();
        })

        .catch(function (error) {
            console.log(error.data);
        })
}

// 表單 -  驗證
function formCheck(errors) {
    Object.keys(errors).forEach(function (keys) {
        document.querySelector(`[data-message="${keys}"]`).textContent = errors[keys];
        // console.log( document.querySelector(`[data-message="${keys}"]`));
    })
};
