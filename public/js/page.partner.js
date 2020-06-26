


























































$().ready(function () {
	var $container = $('#container');
	var isSubmitted = false;
	$('#partnerForm').on('submit', function (event) {
		var $form = $(this);
		var $company = $form.find('input[name="company"]');
		var $name = $form.find('input[name="name"]');
		var $position = $form.find('input[name="position"]');
		var $email = $form.find('input[name="email"]');
		var $phone1 = $form.find('input[name="phone1"]');
		var $phone2 = $form.find('input[name="phone2"]');
		var $phone3 = $form.find('input[name="phone3"]');
		var $title = $form.find('input[name="title"]');
		var $text = $form.find('textarea[name="text"]');
		var $agree = $form.find('input[name="agree"]');
		if ($company.val().replace(/ /gi, '').length < 2) {
			alert('회사(기관)명을 입력해주세요.');
			$company.focus();
			return false;
		} else if ($name.val().replace(/ /gi, '').length < 2) {
			alert('제안자명을 입력해주세요.');
			$name.focus();
			return false;
		} else if (!$email.val()) {
			alert('원활한 상담을 위해 이메일을 입력해주세요.');
			$email.focus();
			return false;
		} else if (!/^((\w|[\-\.])+)@((\w|[\-\.])+)\.([A-Za-z]+)$/.test($email.val())) {
			alert('올바른 이메일을 입력해주세요.');
			$email.focus();
			return false;
		} else if (!$phone1.val() || !$phone2.val() || !$phone3.val() || !/^\d+$/.test($phone1.val()) || !/^\d+$/.test($phone2.val()) || !/^\d+$/.test($phone3.val())) {
			alert('원활한 상담을 위해 연락처를 입력해주세요.');
			return false;
		} else if ($title.val().replace(/ /gi, '').length < 5) {
			alert('제목을 입력해주세요.');
			$title.focus();
			return false;
		} else if ($text.val().replace(/ /gi, '').length < 5) {
			alert('내용을 입력해주세요.');
			$text.focus();
			return false;
		} else if ($agree.is(':not(:checked)')) {
			alert('개인정보 수집 및 이용 안내에 동의해주세요.');
			return false;
		}
		if (isSubmitted) {
			event.preventDefault();
		}
		isSubmitted = true;
	});
});
