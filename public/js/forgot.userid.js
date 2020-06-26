$().ready(function () {
  var $container = $('#container');
  var $form = $container.find('form');
  var _set = {
    isSubmitted: false
  };
  var _fn = {
    init: function () {
      $form.on('submit', function () {
        _fn.onSubmit();
        return false;
      });
    },
    onSubmit: function () {
      if (_set.isSubmitted === true) {
        return;
      }
      var $email = $form.find('input[name="email"]');
      if (!$email.val()) {
        alert('이메일을 입력하세요.');
        $email.focus();
        return;
      }
      _set.isSubmitted = true;
      $.ajax({
        url: _apiServerUrl + '/save/user/forgot/userid',
        xhrFields: {withCredentials: true},
        type: 'POST',
        data: {
          email: $email.val()
        },
        success: function (data) {
          _set.isSubmitted = false;
          var responseCode = $(data).find('response').text();
          if (responseCode === '-1') {
            alert('이메일을 입력하세요.');
            $email.focus();
          } else if (responseCode === '-2') {
            alert('해당 이메일로 가입된 아이디가 없습니다.');
            $email.focus();
          } else if (responseCode === '-3') {
            alert('올바르지 않은 이메일 형식으로 가입된 아이디입니다. [문의하기]를 통해 별도 문의 바랍니다.');
          } else {
            alert('안내 이메일을 발송하였습니다.\n만약 메일이 오지 않는다면, 스팸 편지함을 확인해주세요.');
            location.href = $container.data('redirecturl');
          }
        }
      });
    }
  };
  _fn.init();
});
