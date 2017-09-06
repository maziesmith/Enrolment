//executeAJAX('/catalog/category', 'POST', 'JSON', {name:"sijun",age:"28"}, true, function(names) { console.log(name) });
function executeAJAX() {
    var url = null;
    var type = null;
    var dataType = null;
    var data = null;
    var asyncType = null;
    var successFunction = null;
    var errorFunction = null;
    var isLoadingOpt = null;

    if (arguments.length >= 9 || arguments.length < 3) {
        return alert("Parameter Error");
    }
    else if (arguments.length == 8) {
        url = arguments[0];
        type = arguments[1];
        dataType = arguments[2];
        data = arguments[3];
        asyncType = arguments[4];
        successFunction = arguments[5];
        errorFunction = arguments[6];
        isLoadingOpt = arguments[7];
    }
    else if (arguments.length == 7) {
        url = arguments[0];
        type = arguments[1];
        dataType = arguments[2];
        data = arguments[3];
        asyncType = arguments[4];
        successFunction = arguments[5];
        errorFunction = arguments[6];
    }
    else if (arguments.length == 6) {
        url = arguments[0];
        type = arguments[1];
        dataType = arguments[2];
        data = arguments[3];
        asyncType = arguments[4];
        successFunction = arguments[5];
    }
    else if (arguments.length == 5) {
        url = arguments[0];
        type = arguments[1];
        dataType = arguments[2];
        data = arguments[3];
        asyncType = arguments[4];
    }
    else if (arguments.length == 4) {
        url = arguments[0];
        type = arguments[1];
        dataType = arguments[2];
        data = arguments[3];
        asyncType = true;
    }
    else {
        url = arguments[0];
        type = arguments[1];
        dataType = arguments[2];
        data = "GET";
        asyncType = true;
    }

    if (isLoadingOpt)
        $('.loading').show();

    $.ajax({
        url: SITE_PREFIX + url,
        type: type,
        dataType: dataType,
        data: data,
        async: asyncType,
        success: function (result) {
            if (successFunction != null) {
                successFunction(result);
            }
            else {
                //alert(result);
            }

            if (isLoadingOpt)
                $('.loading').hide();
        },
        error: function (e) {
            if (errorFunction != null) {
                errorFunction(e);
            }
            else {
                //alert("Error");
            }

            if (isLoadingOpt)
                $('.loading').hide();
        }
    });
};

$("#DefaultOk").click(function () {
    var id = $("#DefaultId").val();
    var pw = $("#DefaultPw").val();

    executeAJAX('/App_Code/Ajax/Ajax_Default.aspx',
        'POST',
        'JSON', {
            id: id, pw: pw
        },true, function (result) {

        }
    );
});
