
// 數字轉換千分位函式
function tothousands(num) {
    let parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
};

// loading 載入動態
function toggleLoading(show) {
    //show的參數，從外部傳入如果是true 就 開啟loading，flase 就關閉
    document.querySelector(".loading").style.display = show ? 'block' : 'none';
};


// gotop 回到頂部 
// goTop Dom
const goTopBtn = document.querySelector("#goTopBtn");

if (goTopBtn !== null) {
    //點擊 goTopBtn監聽事件，如果scrollY != 0 的話，執行 Window.scrollTo() 內的 平滑滾動至 0
    goTopBtn.addEventListener("click", scrollGoTop);
    //當使用者y軸  超過 800 出現 goTopBtn ，反之消失
    document.addEventListener("scroll", handleScroll);
};


//  回到頂端
function handleScroll() {
    if (window.scrollY >= 600) {
        goTopBtn.classList.remove("d-none");
        goTopBtn.classList.add("d-block");

    } else {
        goTopBtn.classList.remove("d-block");
        goTopBtn.classList.add("d-none");
    }
};

function scrollGoTop() {
    if (window.scrollY != 0) {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }
};



// 隨機篩選