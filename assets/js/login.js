// 全局
$(function() {
  // 点击”去注册账号”，跳转注册页面
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  // 点击”去登录账号”，跳转登录页面
  $('#link_login').on('click', function () {
    $('.reg-box').hide()
    $('.login-box').show()
  })

  // 从 layui 中获取form对象
  var form = layui.form

  // 从 layui中获取 layer对象
  var layer = layui.layer
  // 通过 form.verify() 函数自定义校验规则
  form.verify({
    username: function(value, item){ //value：表单的值、item：表单的DOM对象
      if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
        return '用户名不能有特殊字符';
      }
      if(/(^\_)|(\__)|(\_+$)/.test(value)){
        return '用户名首尾不能出现下划线\'_\'';
      }
      if(/^\d+\d+\d$/.test(value)){
        return '用户名不能全为数字';
      }
      
      //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
      if(value === 'xxx'){
        alert('用户名不能为敏感词');
        return true;
      }
    }
    
    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    ,pass: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ] 
    ,repass: function(value) {
      //通过形参拿到的是确认密码框框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败，则return 一个提示消息即可
      var pass = $('.reg-box [name=password]').val()
      // 上面是获取pass 密码框里的值
      if (pass !== value) {
        return '两次密码不一致！'
      }
    }
  })

  // 监听注册表单的提交事件
  $('#form_reg').on('submit', function(e) {
    e.preventDefault()
    var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
    $.post('/api/reguser', data, function(res) {
      if (res.status !== 0) {
        // return console.log(res.message)
        // res.message = 用户名被占用，请输入其他用户名
        return layer.msg(res.message)
      }
      // console.log('注册成功！')
      layer.msg('注册成功，请登录！')
      // 模拟人的点击事件
      $('#link_login').click()
    })
  })

  // 监听登录表单的提价事件
  $('#form_login').submit(function(e) {
    // 阻止默认提交行为
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登录失败！')
        }
        layer.msg('登录成功!')
        // 将登录成功得到的 token 字符串， 保存到 localStorage 中
        localStorage.setItem('token', res.token)
        // 跳转到后台主页
        // localStorage.href = '/index.html'
        location.href = '/index.html'
      }
    });
  })
})