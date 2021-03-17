$(function () {
    const layer = layui.layer
    const form = layui.form

    //获取文章分类列表
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
    //初始化弹出框索引
    let indexAddCate
    //添加类别弹出框
    $('#btnAddCate').on('click', function () {
        indexAddCate = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
        //添加类别表格提交事件(弹出框是动态生成的,需要用事件委托,父元素是body标签)
        $('body').on('submit', '#form-add', function (e) {
            e.preventDefault()
            $.ajax({
                method: 'post',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: (res) => {
                    console.log(res);
                    if (res.status !== 0) {
                        layer.msg(res.message)
                    }
                    //成功,更新分类列表,清空表单,关闭弹出框
                    layer.msg('恭喜您,添加文章分类成功!')
                    initCate()
                    $(this)[0].reset()
                    layer.close(indexAddCate)
                }
            })
        })
    })



    //初始化弹出框索引
    let indexEditCate
    //编辑文章分类弹出框(事件委托)
    $('tbody').on('click', '.btn-edit', function () {
        indexEditCate = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        //获取对应文章分类信息并渲染
        let Id = $(this).attr('data-id')
        renderCate()
        function renderCate() {
            $.ajax({
                method: 'get',
                url: '/my/article/cates/' + Id,
                success: (res) => {
                    console.log(res);
                    if (res.status !== 0) {
                        layer.msg(res.messgge)
                    }
                    form.val('dialog-edi', res.data)
                }
            })
        }
        //编辑文章分类弹出框提交事件
        $('body').on('submit', '#form-edit', function (e) {
            e.preventDefault()
            $.ajax({
                method: 'post',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: (res) => {
                    console.log(res);
                    if (res.status !== 0) {
                        layer.msg(res.message)
                    }
                    //成功,更新分类列表,清空表单,关闭弹出框
                    layer.msg('恭喜您,修改文章分类成功!')
                    initCate()
                    $(this)[0].reset()
                    layer.close(indexEditCate)
                }
            })
        })
    })


    //删除文章分类弹出框(事件委托)
    $('tbody').on('click', '.btn-delete', function () {
        //获取对应的Id值
        let Id = $(this).attr('data-id')
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + Id,
                success: (res) => {
                    console.log(res);
                    if (res.status !== 0) {
                        layer.msg(res.message)
                    }
                    //成功 提示,重新渲染分类列表
                    layer.msg("恭喜您!删除分类成功")
                    initCate()
                }
            })

            layer.close(index);
        });
    })
})