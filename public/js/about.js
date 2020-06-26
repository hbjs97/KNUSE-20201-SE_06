


























































$().ready(function () {
	var $initTarget, $serviceTarget, $communityTarget, initStartY, initEndY, serviceStartY, serviceEndY, communityStartY, communityEndY;
	var $searchForm, $campusList;
	var serviceAnimating = false;
	var _fn = {
		initiate: function () {
			_fn.resized();
			$(window).on('resize', function () {
				_fn.resized();
			});
			_fn.scrolled();
			$(window).on('scroll', function () {
				_fn.scrolled();
			});
			if ($('body').is(':has(aside)')) {
				$searchForm = $('aside > form.search');
				$campusList = $('aside > div.campuslist > a');
				$searchForm.on('submit', function () {
					return false;
				});
				$searchForm.on('keyup', 'input[name="name"]', function () {
					var name = $(this).val();
					_fn.filterCampusList(name);
				});
			}
		},
		resized: function () {
			$initTarget = $('section.init > div.wrap > div.device');
			$serviceTarget = $('section.service > div.figures');
			$communityTarget = $('section.community > div.figures');
			initStartY = $initTarget.offset().top;
			initEndY = initStartY + $initTarget.height();
			serviceStartY = $serviceTarget.offset().top;
			serviceEndY = serviceStartY + $serviceTarget.height();
			communityStartY = $communityTarget.offset().top;
			communityEndY = communityStartY + $communityTarget.height();
		},
		scrolled: function () {
			var $window = $(window);
			var viewStartY = $window.scrollTop();
			var viewEndY = viewStartY + $window.height();
			if (viewStartY <= initEndY && viewEndY >= initStartY) {
				$initTarget.addClass('active');
			} else {
				$initTarget.removeClass('active');
			}
			if (viewStartY <= serviceEndY && viewEndY >= serviceStartY) {
				if (!serviceAnimating) {
					_fn.startServiceAnimation();
				}
				serviceAnimating = true;
			} else {
				serviceAnimating = false;
			}
			if (viewStartY <= communityEndY && viewEndY >= communityStartY) {
				$communityTarget.addClass('active');
			} else {
				$communityTarget.removeClass('active');
			}
		},
		startServiceAnimation: function () {
			var $serviceFigureDivs = $serviceTarget.find('div');
			setTimeout(function () {
				_fn.putTargetNumber($serviceFigureDivs.eq(0).find('p.number > strong'));
			}, 150);
			setTimeout(function () {
				_fn.putTargetNumber($serviceFigureDivs.eq(1).find('p.number > strong'));
			}, 300);
			setTimeout(function () {
				_fn.putTargetNumber($serviceFigureDivs.eq(2).find('p.number > strong'));
			}, 450);
			setTimeout(function () {
				_fn.putTargetNumber($serviceFigureDivs.eq(3).find('p.number > strong'));
			}, 600);
			setTimeout(function () {
				_fn.putTargetNumber($serviceFigureDivs.eq(4).find('p.number > strong').eq(1));
			}, 750);
		},
		putTargetNumber: function ($target) {
			var target = Number($target.data('number'));
			var count = 0;
			counter();
			function counter() {
				var diff = target - count;
				if (diff > 0) count += Math.ceil(diff / 2);
				if (target > count) setTimeout(function () {
					counter();
				}, 30);
				$target.text(format(count));
			}
			function format(number) {
				var regex = /(\d+)(\d{3})/;
				number = number.toString();
				while (regex.test(number)) {
					number = number.replace(regex, '$1' + ',' + '$2');
				}
				return number;
			}
		},
		filterCampusList: function (name) {
			var nameForRegExp = new RegExp(name.toLowerCase());
			var $matchedCampus = $campusList.filter(function () {
				var thisName = $(this).find('> span.name').text().toLowerCase();
				return thisName.match(nameForRegExp);
			});
			if (!$matchedCampus.length && name.length > 1) {
				nameForRegExp = new RegExp(name.toLowerCase().substring(0, name.length - 1));
				$matchedCampus = $campusList.filter(function () {
					var thisName = $(this).find('> span.name').text().toLowerCase();
					return thisName.match(nameForRegExp);
				});
			}
			$campusList.hide();
			$matchedCampus.each(function () {
				$(this).show();
			});
		}
	};
	_fn.initiate();
});
