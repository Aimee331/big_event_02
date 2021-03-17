$(function () {
    const layer = layui.layer
    const form = layui.form
    //初始化文章分类
    // 初始化富文本编辑器
    // 初始化富文本编辑器
    initEditor()
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
                const htmlStr = template('tpl-art-pub', res)
                $('[name="cate_id"]').html(htmlStr)
                form.render()
            }
        })
    }

    //实现基本裁剪效果
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //上传图片
    $('#btnChooseCover').on('click', function () {
        $('#coverFile').click()
        //选择图片
        $('#coverFile').on('change', function (e) {
            var file = e.target.files[0]
            if (!file) {
                return layer.msg('您可以选择一张图片作为文件封面')
            }
            var newImgURL = URL.createObjectURL(file)
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', newImgURL)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域
        })
    })
    //设置状态
    let state = '已发布'
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    //发布文章
    $('#formPub').on('submit', function (e) {
        e.preventDefault()
        //有文件上传,需要用到FormData
        let fd = new FormData(this)
        fd.append('state', state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // console.log(...fd);
                publishArt(fd)
            });
        function publishArt(fd) {
            //提交数据,发送请求
            $.ajax({
                method: 'post',
                url: '/my/article/add',
                data: fd,
                processData: false,
                contentType: false,
                success: (res) => {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    //成功,提示,页面跳转
                    layer.msg('恭喜您!文章发布成功')
                    setTimeout(function () {
                        window.parent.document.getElementById('artList').click()
                    }, 1500)
                }
            })
        }
    })
})
