$(function () {
    //
    const layer = layui.layer
    const form = layui.form

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
                    return layer.msg('抱歉,获取文章分类列表失败,请重新获取!')
                }
                //调用模板字符串进行页面渲染
                const htmlStr = template('t1-art-pub', res)
                $('[name="cate_id"]').html(htmlStr)
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    //选择要上传的图片
    $('#btnChooseCover').on('click', function () {
        $('#coverFile').click()
        //上传图片
        $('#coverFile').on('change', function (e) {
            var file = e.target.files[0]
            if (!file) {
                return layer.msg('您可以选择一张图片作为文章封面!')
            }
            var newImgURL = URL.createObjectURL(file)
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', newImgURL)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域
        })
    })


    //确认发布状态,默认是已发布
    let state = '已发布'
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    //发布文章
    $('#artPublish').on('submit', function (e) {
        e.preventDefault()
        //涉及文件上传,需要用FormData
        let fd = new FormData(this)
        fd.append('state', state)
        // console.log(...fd);
        let file = $('#coverFile')[0].files[0]
        // console.log(file);
        fd.append('cover_img', file)
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            //涉及文件上传要阻止jQuery底层把数据转成字符串,设cp,两个false
            processData: false,
            contentType: false,
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //成功,提示,页面跳转
                layer.msg('恭喜您!文章发布成功!')
                setTimeout(function () {
                    window.parent.document.getElementById('artList').click()
                }, 1500)

            }
        })
    })

})