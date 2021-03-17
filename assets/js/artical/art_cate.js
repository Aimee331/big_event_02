$(function () {
    //
    const layer = layui.layer
    const form = layui.form
    //初始化文章分类
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
                const htmlStr = template('t1-art-list', { list: res.data })
                $('tbody').html(htmlStr)
            }
        })
    }

    //添加分类功能
    $('#btnAddCate').on('click', function () {
        //弹出框
        let indexAddCate = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#tplAddCate').html()
        });
        //提交添加类别信息(事件委托)
        $('body').on('submit', '#formAddCate', function (e) {
            e.preventDefault()
            $.ajax({
                method: 'post',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: (res) => {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    //重新渲染文章分类,关闭层,提示
                    layer.msg('恭喜您,添加分类成功!')
                    layer.close(indexAddCate)
                    initCate()
                }
            })
        })
    })

    //修改分类(事件委托)
    $('tbody').on('click', '.btnEdit', function () {
        //弹出框
        let indexEditCate = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#tplEditCate').html()
        });
        //显示对应的编辑项
        let Id = $(this).attr('data-id')
        renderEditCate()
        function renderEditCate() {
            $.ajax({
                method: 'get',
                url: '/my/article/cates/' + Id,
                success: (res) => {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    form.val('formEditCate', res.data)
                }
            })
        }
        //提交修改类别信息(事件委托)
        $('body').on('submit', '#formEditCate', function (e) {
            e.preventDefault()
            $.ajax({
                method: 'post',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: (res) => {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    //重新渲染文章分类,关闭层,提示
                    layer.msg('恭喜您,修改分类成功!')
                    layer.close(indexEditCate)
                    initCate()
                }
            })
        })
    })

    //删除分类(事件委托)
    $('tbody').on('click', '.btnDelete', function () {
        let Id = $(this).attr('data-id')
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            //点击确定之后做的事情
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + Id,
                success: (res) => {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    //成功,提示,关闭弹出框,重新渲染分类列表数据
                    layer.msg('恭喜您!分类删除成功')
                    layer.close(index);
                    initCate()
                }
            })
        });
    })
})