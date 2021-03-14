$(function () {
    getUser()
})
//获取用户信息这个功能其他页面也要用
//封装成函数并且定义全局变量
function getUser() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        headers:localStorage.getItem('token'),
        data: {},
        success: (res) => {
            console.log(res);
        }
    })
}