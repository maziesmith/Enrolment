function fnSetCookie(cName, cValue, cDay) {
    var expire = new Date();
    expire.setDate(expire.getDate() + cDay);
    cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
    if (typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
    document.cookie = cookies;
}

function fnGetCookie(cName) {
    cName = cName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cName);
    var cValue = '';
    if (start != -1) {
        start += cName.length;
        var end = cookieData.indexOf(';', start);
        if (end == -1) end = cookieData.length;
        cValue = cookieData.substring(start, end);
    }
    return unescape(cValue);
}

function fnAjax(url, type, data, successFunction, failFunction) {
    $.ajax({
        url: url,
        type: type,
        data: data,
        success: function (response) {
            successFunction(response);
        },
        failure: function (response) {
            failFunction(response);
        }
    });
};

function fnSignIn() {
    data = {
        id: fnGetCookie('id'),
        pw: fnGetCookie('pw')
    }

    if (data.id != "" && data.pw != "") {
        fnAjax('/Ajax/Ajax_Default.aspx', 'GET', data, function (response) {
            if (response.result == 'fail') {
                alert('로그인 해주세요.');
                fnSetCookie('id', '', 1);
                fnSetCookie('pw', '', 1);
                location.href = '/';
            }
        }, function (response) {
            alert('로그인 해주세요.');
            location.href = '/';
        });
    }
}

fnSignIn();