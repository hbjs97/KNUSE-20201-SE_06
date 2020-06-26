


























































$().ready(function () {
	var $container = $('#container');
	var $types;

	var _fn = {
		initiate: function () {
			if ($container.is(':has(div.type)')) {
				$types = $container.find('div.type');
			} else {
				return false;
			}
			$types.find('dt').on('click', function () {
				_fn.showAnswer($(this));
			});
		},
		showAnswer: function ($question) {
			var $answer = $question.next('dd');
			$types.find('dt').removeClass('active');
			$types.find('dd').not($answer).hide();
			if ($answer.is(':visible')) {
				$question.removeClass('active');
				$answer.hide();
			} else {
				$question.addClass('active');
				$answer.show();
			}
		}
	};
	_fn.initiate();
});
