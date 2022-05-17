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
    showConfirmButton: false,
  })
};

