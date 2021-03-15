$(function () {
    getUserInfo()
    //退出事件
    $('#btnLogout').on('click', function () {
        //eg1
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            localStorage.removeItem('token')
            location.href = '/login.html'
            layer.close(index);
        });

    })
})
//获取用户信息这个功能其他页面也要用
//封装成函数并且定义全局变量
function getUserInfo() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ""
        // },
        success: (res) => {
            // console.log(res);
            if (res.status === 0) {
                renderAvatar(res.data)
            } else {
                // location.href = '/login.html'   
            }
        },
    })
}
//渲染头像
function renderAvatar(user) {
    const name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp' + name)
    if (user.user_pic) {
        $('.text-avatar').hide()
        $('.userinfo img').attr('src', user.user_pic)
    } else {
        $('.userinfo img').hide()
        $('.text-avatar').html(name[0].toUpperCase())
    }
}