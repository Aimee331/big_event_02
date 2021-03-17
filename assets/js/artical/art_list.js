$(function () {
    //给模板字符传引入一个变量或函数
    template.defaults.imports.dateFormat = function (dtStr) {
        let dt = new Date(dtStr)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())
        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())
        function padZero(num) {
            num = num < 10 ? '0' + num : num
            return num
        }
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    //
    layer = layui.layer
    form = layui.form

    let q = {
        pagenum: 1,      //当前页码值
        pagesize: 5,      //每页显示多少条数据
        cate_id: '',       //文章分类的id
        state: ''           //文章发布状态,只有两种:已发布和草稿
    }
    initTable()
    //初始化文章表格数据,封装成函数
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    layer.msg(res.message)
                }
                const htmlStr = template('tpl-table', { data: res.data })
                $('tbody').html(htmlStr)
                //调用分页
                renderPage(res.total)
            }
        })
    }
    //获取所有文章分类并渲染
    initCate()
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            data: {},
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('抱歉,获取文章分类列表失败,请重新获取!')
                }
                //调用模板字符串进行页面渲染
                const htmlStr = template('t1-art-Cate', res)
                $('[name="cate_id"]').html(htmlStr)

                form.render()
            }
        })
    }

    //筛选功能
    $('#formSearch').on('submit', function (e) {
        e.preventDefault()
        q.cate_id = $('[name="cate_id"]').val()
        q.state = $('[name="state"]').val()
        initTable()
    })

    //分页联动
    function renderPage(total) {
        //实现分页功能
        let laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'artPage',//注意，这里的 test1 是 ID，不用加 # 号
            count: total,//数据总数，从服务端得到
            limit: q.pagesize,
            limits: [2, 3, 4, 5],
            curr: q.pagenum,
            groups: 6,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', 'refresh'],
            //页面初始化时页码改变时都会触发jump,执行回调函数
            jump: function (obj, first) {
                if (!first) {
                    //do something
                    q.pagenum = obj.curr
                    q.pagesize = obj.limit
                    initTable()
                }
            }
        });
    }

    //删除功能(事件代理)
    $('tbody').on('click', '.btn-delete', function () {
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
                    //成功,提示,重新渲染文章数据
                    layer.msg('恭喜您!删除文章成功')
                    initTable()
                }
            })
            layer.close(index);
        });
    })

})