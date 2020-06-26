$().ready(function () {
  var $container = $('#container');
  var $enterYear = $container.find('select[name="yes_id"]');
  var $campusName = $container.find('input[name="yes_password"]');
  var $campusId = $container.find('input[name="campus_id"]');
  var $campuses = $container.find('ol.campuses');
  var _set = {
    campuses: []
  };
  var _fn = {
    init: function () {
      $.ajax({
        url: _apiServerUrl + '/find/school/campus/list',
        xhrFields: {withCredentials: true},
        type: 'POST',
        success: function (response) {
          _set.campuses = $(response).find('campus').map(function () {
            return {
              id: $(this).attr('id'),
              name: $(this).attr('name'),
              lowerCaseName: $(this).attr('name').toLowerCase()
            };
          }).get();
        }
      });
      $campusName.on('keyup', function (event) {
        _fn.onKeyUpCampusName();
      }).on('focus', function () {
        _fn.onResetCampusName();
      });
      $campuses.on('click', 'li a', function () {
        _fn.onClickCampusItem($(this).parent().data());
      });
      $container.on('submit', function (event) {
        _fn.onSubmit(event);
      });
    },
    onKeyUpCampusName: function () {
      $campuses.empty();
      var keyword = $campusName.val();
      var lowerCaseKeyword = keyword.toLowerCase();
      var keywordForRegExp = new RegExp(lowerCaseKeyword);
      var matchedCampuses = _.filter(_set.campuses, function (campus) {
        return campus.lowerCaseName.match(keywordForRegExp);
      });
      if (keyword.length > 1 && matchedCampuses.length === 0) {
        // 자모음 결합 문제로 인해 마지막 한 글자 제외
        keywordForRegExp = new RegExp(lowerCaseKeyword.slice(0, -1));
        matchedCampuses = _.filter(_set.campuses, function (campus) {
          return campus.lowerCaseName.match(keywordForRegExp);
        });
        if (matchedCampuses.length === 0) {
          var html = '검색된 학교가 없습니다.<br>에브리타임은 국내 ' + _set.campuses.length + '개 대학을 지원합니다.';
          $('<li></li>').html(html).addClass('empty').appendTo($campuses);
        }
      }
      _.each(matchedCampuses, function (campus) {
        var html = '<a>' + campus.name.replace(keyword, '<strong>' + keyword + '</strong>') + '</a>';
        $('<li></li>').html(html).data(campus).appendTo($campuses);
      });
    },
    onResetCampusName: function () {
      if (!$campusId.val()) {
        return;
      }
      $campusName.val('');
      $campusId.val('');
    },
    onClickCampusItem: function (campus) {
      $campusName.val(campus.name);
      $campusId.val(campus.id);
      $campuses.empty();
    },
    onSubmit: function (event) {
      if (!$enterYear.val()) {
        alert('선택해주세요.');
        event.preventDefault();
        return;
      }
      if (!$campusId.val()) {
        alert('가입할 학교를 선택해주세요.');
        event.preventDefault();
        return;
      }
    }
  };
  _fn.init();
});
