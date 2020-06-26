


























































$().ready(function () {

	var $container = $('#container');
	var $form = $container.find('#qnaForm');
	var $email = $form.find('input[name="email"]');
	var $text = $form.find('textarea[name="text"]');
	var $attach = $form.find('input[name="attach"]');
	var $attachFilename = $form.find('input[name="attach_filename"]');
	var $attachButton = $form.find('input[name="attach_button"]');

	$attachButton.on('click', function () {
		if ($attachFilename.val()) {
			// <=IE10에서 value 초기화가 불가능한 문제 대안으로, 복사 후 삭제.
			var $clone = $attach.clone(true).insertAfter($attach);
			$attach.remove();
			$attach = $clone;
			$attachFilename.val('');
			$attachButton.val('파일 선택');
		} else {
			$attach.click();
		}
	});

	$attach.on('change', function () {
		var filename = $(this).val().split(/(\\|\/)/g).pop();
		$attachFilename.val(filename);
		$attachButton.val('첨부 취소');
	});

	var isSubmitted = false;
	$form.on('submit', function (event) {
		if (!$email.val().replace(/ /gi, '').length) {
			alert('연락받을 이메일을 입력해주세요.');
			$email.focus();
			return false;
		} else if (!/^((\w|[\-\.])+)@((\w|[\-\.])+)\.([A-Za-z]+)$/.test($email.val())) {
			alert('올바른 이메일을 입력해주세요.');
			$email.focus();
			return false;
		} else if (!$text.val().replace(/ /gi, '').length) {
			alert('문의 내용을 입력해주세요.');
			$text.focus();
			return false;
		} else if ($form.find('input[name="agree"]').is(':not(:checked)')) {
			alert('개인정보 수집 및 이용 안내에 동의해주세요.');
			return false;
		}
		if (isSubmitted) {
			event.preventDefault();
		}
		isSubmitted = true;
	});
});
