$(function () {
    //登录和注册页面切换
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })


    //表单验证
    const form = layui.form
    console.log(form);
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value, item) {
            let pwdValue = $('.reg-box [name="password"]').val()
            // console.log($('.reg-box [name="password"]'));
            // console.log(pwdValue);
            if (value !== pwdValue) return '抱歉,两次输入密码不一致,请重新输入!'
        }
    })

    //注册表单绑定提交事件
    $('#reg-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: $('.reg-box input[name="username"]').val(),
                password: $('.reg-box input[name="password"]').val()
            },
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    layer.msg(res.message, { icon: 5 })
                } else {
                    //清空表单
                    layer.msg(res.message, { icon: 6 })
                    $('#reg-form')[0].reset()
                    $('#link_login').click()
                }
            }
        })
    })


    //登录表单的绑定提交事件
    $('#login-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $('#login-form').serialize(),
            success: (res) => {
                console.log(res);
                if (res.status === 0) return location.href = '/index.html'
                layer.msg(res.message, { icon: 5 })
                $('#login-form')[0].reset()
            }
        })
    })
})