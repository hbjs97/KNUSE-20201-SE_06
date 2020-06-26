


























































$().ready(function () {
	var $titles = $('#container dl dt');
	var $answers = $('#container dl dd');
	$answers.hide();
	$titles.on('click', function () {
		var $title = $(this);
		var $answer = $(this).next('dd');
		if ($title.hasClass('active')) {
			$titles.removeClass('active');
			$answer.hide();
		} else {
			$titles.not($title).removeClass('active');
			$title.addClass('active');
			$answer.show();
			$answers.not($answer).hide();
		}
	});
});
