$(function () {
    //表单验证
    const form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length < 1 || value.length > 6) {
                return '用户昵称必须在1-6个字符之间!'
            }
        }
    })
    //渲染用户信息封装成函数
    initUserInfo()
    function initUserInfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                }
                form.val('formUserInfo', res.data)
            }
        })
    }

    //修改用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                }
                layui.layer.msg('恭喜您,用户信息修改成功!', { icon: 6 })
                window.parent.getUserInfo()
            }
        })
    })

    //重置事件
    $('.layui-form').on('reset', function (e) {
        e.preventDefault()
        initUserInfo()
    })


    
})