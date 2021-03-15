$(function () {
    //重置密码表单校验
    const form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        newPwd: function (value) {
            if (value === $('[name="oldPwd"]').val()) {
                return '新密码和旧密码不能一致,请重新输入!'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name="newPwd"]').val()) {
                return '确认密码和新密码不一致,请重新输入!'
            }
        }
    })
    //修改密码,表单提交
    $('form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                //状态判断
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                }
                $(this)[0].reset()
                layui.layer.msg('恭喜您,密码修改成功', { icon: 6 })
                console.log(1);
            }
        })
    })
})