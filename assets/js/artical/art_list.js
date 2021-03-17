$(function () {
    //给模板字符串引入一个变量或者函数
    template.defaults.imports.dateFormat = function (dtStr) {
        let dt = new Date(dtStr)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())
        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    //自动补零
    function padZero(num) {
        num = num < 10 ? '0' + num : num
        return num
    }
    //
    const layer = layui.layer
    const form = layui.form
    //初始化文章列表数据
    let q = {
        pagenum: 1,
        pagesize: 3,
        cate_id: '',
        state: '',
    }
    initArtList()
    function initArtList() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                const htmlStr = template('tpl-art-list', res)
                $('tbody').html(htmlStr)
                //调用分页
                renderPage(res.total)
            }
        })
    }

    //渲染所有分类
    initCate()
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            data: {},
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('抱歉,获取文章分类列表失败,请重新获取!')
                }
                //调用模板字符串进行页面渲染
                const htmlStr = template('tpl-art-cate', res)
                $('[name="cate_id"]').html(htmlStr)
                form.render()
            }
        })
    }

    //筛选功能
    $('#formFilter').on('submit', function (e) {
        e.preventDefault()
        q.cate_id = $('[name="cate_id"]').val()
        q.state = $('[name="state"]').val()
        initArtList()
    })

    //分页功能,封装成函数
    function renderPage(total) {
        var laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'boxPage', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            limits: [2, 3, 4, 5],
            curr: q.pagenum,
            groups: 6,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', 'refresh'],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，
                if (!first) {
                    //do something
                    q.pagenum = obj.curr
                    q.pagesize = obj.limit
                    initArtList()
                }
            }
        });
    }

    //删除文章(事件委托)
    $('tbody').on('click', '.btnDelete', function () {
        let Id = $(this).attr('data-id')
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + Id,
                success: (res) => {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    //成功,提示,关闭弹出框,重新渲染文章数据
                    layer.msg('恭喜您!文章删除成功')
                    layer.close(index);
                    //如果所在页码大于1,且当前页面数据个数等于1,则pagenum--
                    if ($('.btnDelete').length == 1 && q.pagenum > 1) {
                        q.pagenum--;
                    }
                    initArtList()
                }
            })
        });
    })
})