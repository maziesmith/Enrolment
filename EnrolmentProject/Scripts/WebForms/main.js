$("#DefaultOk").click(function () {
    var data = {
        id: $("#DefaultId").val(),
        pw: $("#DefaultPw").val()
    }

    fnAjax('/Ajax/Ajax_Default.aspx', 'GET', data, function (response) {
        if (response.result == 'success') {
            fnSetCookie('id', data.id, 1);
            fnSetCookie('pw', data.pw, 1);
            alert(data.id + '님 로그인되었습니다.');
            location.href = '/About';
        } 
        else {
            alert('아이디와 패스워드를 다시 확인해주세요.');
        }
    }, function (response) {
        alert('에러가 발생하였습니다.');
    });
});


