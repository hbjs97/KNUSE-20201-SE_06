


























































$().ready(function () {
	var $container = $('#container');
	var $transferrequest;
	if ($container.is(':has(#transferrequest)')) {
		$transferrequest = $('#transferrequest');
	}

	var _fn = {
		initiate: function () {
			if (!$transferrequest) {
				return false;
			}
			_fn.loadTransferRequest();
			$transferrequest.find('a.close').on('click', function () {
				$transferrequest.hide();
			});
			$transferrequest.find('input.button[value="수락"]').on('click', function () {
				var boardId = $transferrequest.data('board_id');
				_fn.acceptTransferRequest(boardId, 1);
				return false;
			});
			$transferrequest.find('input.button[value="거절"]').on('click', function () {
				var boardId = $transferrequest.data('board_id');
				_fn.acceptTransferRequest(boardId, -1);
				return false;
			});
		},
		loadTransferRequest: function () {
			_fn.ajaxTransferRequest(function (data) {
				_fn.createTransferRequest(data);
			});
		},
		ajaxTransferRequest: function (callback) {
			$.ajax({
				url: _apiServerUrl + '/find/board/transferRequest',
				xhrFields: {withCredentials: true},
				type: 'POST',
				success: function (data) {
					if ($('response', data).text() === '0') {
						callback();
					} else {
						callback(data);
					}
				}
			});
		},
		createTransferRequest: function (data) {
			if (!data) {
				return false;
			}
			var $request = $(data).find('transferrequest');
			$transferrequest.data('board_id', $request.attr('board_id'));
			$transferrequest.find('.nickname').html($request.attr('transferer_nickname'));
			$transferrequest.find('.name').text($request.attr('board_name')).attr({
				href: '/' + $request.attr('board_id')
			});
			$transferrequest.show();
		},
		acceptTransferRequest: function (boardId, isAccepted) {
			_fn.ajaxAcceptTransferRequest(boardId, isAccepted, function (data) {
				if (data === 1) {
					alert('관리자 권한을 양도받았습니다.');
					location.href = '/' + boardId;
				} else if (data === 2) {
					alert('양도 요청을 거절하였습니다.');
				} else if (data === -1) {
					alert('학교 인증 후 양도받을 수 있습니다.');
					location.href = '/auth';
				} else if (data === -2) {
					alert('해당 게시판의 이용 권한이 없어 양도받을 수 없습니다.');
					location.href = '/' + boardId;
				} else if (data === -3) {
					alert('삭제된 게시판입니다.');
				} else if (data === -4) {
					alert('이미 다른 이용자가 양도받은 게시판입니다.');
				} else {
					alert('양도받을 수 없습니다.');
				}
				$transferrequest.hide();
			});
		},
		ajaxAcceptTransferRequest: function (boardId, isAccepted, callback) {
			$.ajax({
				url: _apiServerUrl + '/update/board/transferRequest/acceptance',
				xhrFields: {withCredentials: true},
				type: 'POST',
				data: {
					'board_id': boardId,
					'is_accepted': isAccepted
				},
				success: function (data) {
					var returns = Number($(data).find('response').text());
					callback(returns);
				}
			});
		}
	};
	_fn.initiate();
});
