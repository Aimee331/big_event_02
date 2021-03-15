$(function () {
    $.ajaxPrefilter(function (options) {
        const baseURL = 'http://api-breakingnews-web.itheima.net'
        options.url = baseURL + options.url

        if (options.url.indexOf('/my/') != -1) {
            options.headers = {
                Authorization: localStorage.getItem('token') || ""
            }
            //登录拦截
            options.complete = function (res) {
                // console.log(res);
                const obj = res.responseJSON
                if (obj.status === 1 && obj.message === '身份认证失败！') {
                    location.href = '/login.html'
                }
            }
        }
    })
})