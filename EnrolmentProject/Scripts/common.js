/*
 *  Forever21 common.js
 */
//var SITE_PREFIX = '';
var SITE_PREFIX = '/gl/shop';

$(document).ready(function () {
    // check basket/wishlist count;
    var basketCount = getCookie('UserTraceGlobal', 'basketCount');
    var wishListCount = getCookie('UserTraceGlobal', 'wishListCount');
    var currentUserId = fnGetUserId();
    var currentLang = getCurrentLanguage();
    // basketCount=0&wishListCount=0&basketSubTotal=0&firstLoadBasketCount=1	

    //Setting display area
    fnSetLanguageArea(currentLang);

    var commonResource = getResourceData('Common', currentLang);
    if (currentUserId != '') {
        // create 'UserTraceGlobal' cookie

        if (basketCount === '') {
            // Get basket count
            executeAJAX("/CheckOut/GetBasketCount", "POST", "JSON", { userId: currentUserId }, true
                , function (response) {
                    if (response.ReturnCode == '00') {
                        setUserBasicData(response.Count, '', '', 1);
                        fnSetHeaderBasketCount(response.Count);
                    }
                }
            );
        }
        else {
            fnSetHeaderBasketCount(basketCount);
        }

        if (wishListCount === '') {
            executeAJAX("/Account/GetWishlist", "POST", "JSON", { userId: currentUserId }, true
                , function (response) {
                    if (response.ReturnCode == '00') {
                        var wishlistCount = 0;
                        if (response.WishListDetails) {
                            wishlistCount = response.WishListDetails.length;
                            // Create Wishlist cookie
                            fnUpdateWishlistCookie(response.WishListDetails);
                        }

                        setUserBasicData('', wishlistCount, '', 1);
                        fnSetHeaderWishListCount(wishlistCount);
                    }
                }
            );
        }
        else {
            fnSetHeaderWishListCount(wishListCount);
        }

        //Mobile Left Menu User Status
        if (fnIsLoggedIn() && fnGetUserId() != "") {
            $('#m_left_username').text(getItemFromJsonObject(commonResource, 'Key', 'lbMobileLeftMenu_MarkOfNextHelloText')[0].Value + ' ' + fnGetUserName());

            //Header User Status
            $('#w_header_status_area').html('<a href="' + SITE_PREFIX + '/Account">' +
                getItemFromJsonObject(commonResource, 'Key', 'lbHello')[0].Value +
                getItemFromJsonObject(commonResource, 'Key', 'lbMobileLeftMenu_MarkOfNextHelloText')[0].Value +
                ' ' + fnGetUserName() + '</a>');

            $('#div_m_left_sign_link').html('<span onclick="fnLogOut(); return false;" class="underline t_normal">' + getItemFromJsonObject(commonResource, 'Key', 'lbSignOut')[0].Value + '</span>');
        }
    }
    //AnonymousUser
    else {
        //Basket count
        fnSetHeaderBasketCount(basketCount);
        //Wishlist count
        fnSetHeaderWishListCount(wishListCount);

        //Mobile Left Menu
        $('#m_left_username').text(getItemFromJsonObject(commonResource, 'Key', 'lbMobileLeftMenu_MarkOfNextHelloText')[0].Value + ' ' + getItemFromJsonObject(commonResource, 'Key', 'lbSignIn')[0].Value);
        $('#div_m_left_sign_link').html('');
    }

    //prevent to disable spaces in password input box
    $(document).on('keydown', 'input[type=password]', function (e) {
        if (e.keyCode == 32) return false;
    });

    //Check cookie popup
    fnCheckShowCookiePopup();
});

$(window).on("beforeunload", function () {
    //페이지에서 나갈 때 발생하는 이벤트.
    //포지션을 sessionStorage 에 저장합니다.
    fnSetNavigation();
});

// According to header type, Set basket count
var fnSetHeaderBasketCount = function (basketCount) {
    // class case : BasketCountHeader
    if ($('.BasketCountHeader:not(.top_count)').length > 0) {
        $('.BasketCountHeader').html(basketCount > 0 ? basketCount : 0).show();
    }
    // class case : top_count BasketCountHeader
    else {
        if (basketCount > 0)
            $('.BasketCountHeader').html(basketCount).show();
        else
            $('.BasketCountHeader').hide();
    }
};

// According to header type, Set wishlist count
var fnSetHeaderWishListCount = function (wishlistCount) {
    // class case : WishlistCountHeader
    if ($('.WishlistCountHeader:not(.top_count)').length > 0) {
        $('.WishlistCountHeader').html(wishlistCount > 0 ? wishlistCount : 0).show();
    }
    // class case : top_count WishlistCountHeader
    else {
        if (wishlistCount > 0)
            $('.WishlistCountHeader').html(wishlistCount).show();
        else
            $('.WishlistCountHeader').hide();
    }
};

//-- Get Cookie --
var getCookie = function () {
    var cname = null;
    var pname = null;

    var ca = '';
    var name = '';

    if (arguments.length == 2) {
        cname = arguments[0];
        pname = arguments[1];

        var user = getCookie(cname);
        name = pname + "=";
        ca = user.split('&');
    }
    else if (arguments.length == 1) {
        cname = arguments[0];

        name = cname + "=";
        ca = document.cookie.split(';');
    }
    else {
        alert('Parameter Error');
        return;
    }

    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
};

//-- Set Cookie --
var setCookie = function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
};

//-- Delete Cookie --
var deleteCookie = function (cname) {
    var expireDate = new Date();

    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cname + "= ; expires=" + expireDate.toGMTString() + "; path=/";
};

// -- Get resource json data from .resx files --
var getResourceData = function (resourceFileName, locale) {
    var retVal;
    executeAJAX("/Layout/GetResourceData/" + resourceFileName + "/" + locale, "GET", "JSON", null, false
                , function (response) {
                    retVal = response;
                }
            );

    return retVal;
};

// -- get item from json object --
var getItemFromJsonObject = function (obj, key, val) {
    var objects = [];
    if (val != null) {
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(getItemFromJsonObject(obj[i], key, val));
            } else if (i == key && obj[key] == val) {
                objects.push(obj);
            }
        }

        return objects;
    }
    else {
        var name;

        $.each($.category.resourceData, function (index, value) {
            if (value.Key == key) {
                name = value.Value;
                return false;
            }
        });

        return name;
    }
};

var fnShuffleArray = function (sourceArray) {
    for (var i = 0; i < sourceArray.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));

        var temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
}

var getCurrentLanguage = function () {
    var lang = getCookie('_clGlobal');
    if (lang != null && (lang == '' || lang == 'undefined'))
        lang = 'en-US';
    return lang;
};

var getUrlParameter = function getUrlParameter() {
    if (arguments.length == 1) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1).toLowerCase()),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === arguments[0]) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    }
    else if (arguments.length == 2) {
        var sPageURL = decodeURIComponent(arguments[0].substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0].toLowerCase() === arguments[1].toLowerCase()) {
                return sParameterName[1].toLowerCase() === undefined ? true : sParameterName[1].toLowerCase();
            }
        }

    }
};

var fnUpdateWishlistCookie = function (wishlistData) {
    var wishlistCount = 0;

    if (wishlistData) {
        var arrItems = [];
        wishlistCount = wishlistData.length;

        $(wishlistData).each(function () {
            arrItems.push({
                ID: this.ProductId,
                VID: this.VariantId,
                LID: this.LineItemId,
                Q: this.Quantity,
                PC: this.CategoryName
            });
        });

        // wishlist cookie
        setCookie('WishListDataGlobal', JSON.stringify(arrItems), 365);
        // user basic cookie
        setUserBasicData('', wishlistCount, '', 1);
    }
    else {
        setCookie('WishListDataGlobal', '', 365);
        // user basic cookie
        setUserBasicData('', 0, '', 1);
    }

    // set header wishlist icon
    $('.WishlistCountHeader').html(wishlistCount);

    if (wishlistCount > 0)
        $('.WishlistCountHeader').show();
    else
        $('.WishlistCountHeader').hide();
};

var setUserBasicData = function (basketCount, wishlistCount, basketTotal, firstLoadBasketCount) {
    if (basketCount === '')
        basketCount = getCookie('UserTraceGlobal', 'basketCount');

    if (wishlistCount === '')
        wishlistCount = getCookie('UserTraceGlobal', 'wishListCount');

    if (basketTotal === '')
        basketTotal = getCookie('UserTraceGlobal', 'basketSubTotal');

    if (basketCount === '')
        basketCount = 0;

    if (wishlistCount === '')
        wishlistCount = 0;

    if (basketTotal === '')
        basketTotal = 0;

    var cookieVal = 'basketCount=' + basketCount
        + '&wishListCount=' + wishlistCount
        + '&basketSubTotal=' + basketTotal
        + '&firstLoadBasketCount=' + firstLoadBasketCount;
    setCookie('UserTraceGlobal', cookieVal, 365);
};


var AcctInfoCookieName = 'UPGlobal';
//------ set user info ------//
var fnSetAccntInfoDataCookie = function (isReset, id, firstName, lastName, email, gender, guest, preferredAddress) {
    var content = {};
    if (!isReset && getCookie(AcctInfoCookieName) != '') {
        content = JSON.parse(getCookie(AcctInfoCookieName))
    }
    else {
        content = {
            Id: '',
            FirstName: '',
            LastName: '',
            Email: '',
            Gender: '',
            Guest: '',
            PreferredAddress: ''
        };
    }

    if (id !== '')
        content.Id = id;

    if (firstName !== '')
        content.FirstName = firstName;

    if (lastName !== '')
        content.LastName = lastName;

    if (email !== '')
        content.Email = email;

    if (gender !== '')
        content.Gender = gender;

    if (guest !== '')
        content.Guest = guest;

    if (preferredAddress !== '')
        content.PreferredAddress = preferredAddress;

    setCookie(AcctInfoCookieName, JSON.stringify(content), 365);
};

var fnGetAcctInfoFromCookie = function () {
    var content = {};
    if (getCookie(AcctInfoCookieName) != '')
        content = JSON.parse(getCookie(AcctInfoCookieName));
    else
        content = {
            Id: '',
            FirstName: '',
            LastName: '',
            Email: '',
            Gender: '',
            Guest: '',
            PreferredAddress: ''
        };
    return content;
}

var fnChangeLanguage = function (lang) {
    setCookie('_clGlobal', lang, 365);

    var hash = '';
    var locationHref = window.location.href;

    if (location.hash != '') {
        hash = location.hash;
        locationHref = locationHref.replace(hash, '');
    }
    if (window.location.href.indexOf("lang=") > -1) {
        window.location.href = locationHref.substring(0, locationHref.indexOf("lang=")) + "lang=" + lang + hash;
    }
    else {
        if (window.location.href.indexOf("?") > -1) {
            window.location.href = locationHref + "&lang=" + lang + hash;
        }
        else {
            window.location.href = locationHref + "?lang=" + lang + hash;
        }
    }
};

// Setting current language area
var fnSetLanguageArea = function (lang) {
    var language = '';
    switch (lang) {
        case 'en-US':
            language = 'English';
            break;
        case 'ko-KR':
            language = 'Korean';
            break;
        case 'zh-TW':
            language = 'Chinese';
            break;
        case 'ja-JP':
            language = 'Japanese';
            break;
        default:
            language = 'English';
            break;
    }

    $('#current_language_header').text(language);
    $('#current_language_m_left').html(language.toUpperCase());
};

var fnRemoveDOM = function (id) {
    $('#' + id).remove();
}

function executeCategoryAJAX() {
    var url = null;
    var type = "POST";
    var contentType = "application/json";
    var data = null;
    var successFunction = null;

    if ($.category.flagData.reload == true) {
        $('.loading').show();
    }

    url = arguments[0];
    data = arguments[1];
    successFunction = arguments[2];

    $.ajax({
        url: SITE_PREFIX + url,
        type: type,
        contentType: contentType,
        data: data,
        aysncType: true,
        dataType: "JSON",
        success: function (result) {
            successFunction(result);
            $('.loading').hide();
        },
        error: function (e) {
            $('.loading').hide();
        }
    });
};


function executeAJAXToModel() {
    var url = null;
    var type = "POST";
    var contentType = "application/json";
    var data = null;
    var successFunction = null;
    var errorFunction = null;
    var isLoadingOpt = null;

    if (true) {
        $('.loading').show();
    }

    url = arguments[0];
    data = arguments[1];
    successFunction = arguments[2];
    errorFunction = arguments[3];
    isLoadingOpt = arguments[4];

    $.ajax({
        url: SITE_PREFIX + url,
        type: type,
        contentType: contentType,
        data: data,
        aysncType: true,
        dataType: "JSON",
        success: function (result) {
            if (successFunction) {
                successFunction(result);
            }
            else {
                //alert(result);
            }
            $('.loading').hide();
        },
        error: function (e) {
            if (errorFunction) {
                errorFunction(e);
            }

            if (isLoadingOpt)
                $('.loading').hide();
        }
    });
};

//-- AJAX JQuery overloading function --
//How to use ->
//executeAJAX('/catalog/category', 'POST', 'JSON', {name:"sijun",age:"28"});
//executeAJAX('/catalog/category', 'POST', 'JSON', {name:"sijun",age:"28"}, true);
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

var fnRenderHTML = function () {
    var container = null, htmlTemplate = null, items = null, helpers = null, afterRenderFunction = null;

    if (arguments.length >= 6 || arguments.length < 3) {
        return alert("Parameter Error");
    }
    else if (arguments.length == 5) {
        container = arguments[0];
        htmlTemplate = arguments[1];
        items = arguments[2];
        helpers = arguments[3];
        afterRenderFunction = arguments[4];
    }
    else if (arguments.length == 4) {
        container = arguments[0];
        htmlTemplate = arguments[1];
        items = arguments[2];
        helpers = arguments[3];
    }
    else {
        container = arguments[0];
        htmlTemplate = arguments[1];
        items = arguments[2];
    }

    if (helpers != null) {
        $.templates({
            tmpl: {
                markup: htmlTemplate,
                helpers: helpers
            }
        });

        $(container).html($.render.tmpl(items));
    }
    else {
        tmpl = $.templates(htmlTemplate);
        $(container).html(tmpl.render(items));
    }


    if (afterRenderFunction != null) {
        afterRenderFunction();
    }
};

var fnLoadTemplate = function () {
    var templateURL = null;
    var successFunction = null;
    var errorFunction = null;
    var resourceData = null;

    if (arguments.length >= 5 || arguments.length < 1) {
        return alert("Parameter Error");
    }
    else if (arguments.length == 4) {
        templateURL = arguments[0];
        successFunction = arguments[1];
        errorFunction = arguments[2];
        resourceData = arguments[3];
    }
    else if (arguments.length == 3) {
        templateURL = arguments[0];
        successFunction = arguments[1];
        errorFunction = arguments[2];
    }
    else if (arguments.length == 2) {
        templateURL = arguments[0];
        successFunction = arguments[1];
    }
    else {
        templateURL = arguments[0];
    }

    $.get(SITE_PREFIX + '/' + STATICFILELOCATION + '/templates' + templateURL, function (data) {
        // replace all resource text
        if (resourceData != null) {
            data = fnReplaceTextUsingResourceData(resourceData, data);
        }

        if (successFunction != null) {
            successFunction(data);
        }
        else { }

    }).fail(function () {
        if (errorFunction != null) {
            errorFunction();
        }
        //else { alert('failed to load template'); }
    });
};

var fnReplaceTextUsingResourceData = function (resourceData, textData) {
    var matches = textData.match(/[^<%]+(?=\%>)/g);
    $(matches).each(function () {
        var resource = getItemFromJsonObject(resourceData, 'Key', this);
        if (resource == null || resource.length == 0) {
            textData = textData.replace('<%' + this + '%>', '');
        }
        else {
            textData = textData.replace('<%' + this + '%>', resource[0].Value);
        }

    });

    return textData;
};

var fnOpenModalPop = function () {
    var controlId = null;
    var title = null;
    var contents = null;
    var okFunction = null;
    var cancelFunction = null;

    if (arguments.length >= 6 || arguments.length < 3) {
        return alert("Parameter Error");
    }
    else if (arguments.length == 5) {
        controlId = arguments[0];
        title = arguments[1];
        contents = arguments[2];
        okFunction = arguments[3];
        cancelFunction = arguments[4];
    }
    else if (arguments.length == 4) {
        controlId = arguments[0];
        title = arguments[1];
        contents = arguments[2];
        okFunction = arguments[3];
    }
    else {
        controlId = arguments[0];
        title = arguments[1];
        contents = arguments[2];
    }

    $.flexModal.add(controlId, function () {
        var $modalContent = $(this).children();
        $modalContent.html('');

        var response = {};
        response.Title = title;
        response.Contents = contents;

        fnLoadTemplate('/account/confirm.html',
            function (data) {
                var helpers = {};

                fnRenderHTML($modalContent, data, response, helpers);
                if (cancelFunction != null) {
                    $('#btn_cancel').show();
                    $('#btn_cancel').on('click', function () {
                        cancelFunction();
                    });
                }
                if (okFunction != null) {
                    $('#btn_ok').show();
                    $('#btn_ok').on('click', function () {
                        okFunction();
                    });
                }
            }, null, getResourceData('Account', getCurrentLanguage())
        );

        $(controlId).addClass("flex-modal-item flex-modal-item--ready flex-modal-item--visible");
    });
};

var fnOpenModalPopForOneButton = function () {
    var controlId = null;
    var title = null;
    var contents = null;
    var okFunction = null;
    var btnOK_Text = null;

    if (arguments.length >= 6 || arguments.length < 3) {
        return alert("Parameter Error");
    }
    else if (arguments.length == 5) {
        controlId = arguments[0];
        title = arguments[1];
        contents = arguments[2];
        okFunction = arguments[3];
        btnOK_Text = arguments[4];
    }
    else if (arguments.length == 4) {
        controlId = arguments[0];
        title = arguments[1];
        contents = arguments[2];
        okFunction = arguments[3];
    }
    else {
        controlId = arguments[0];
        title = arguments[1];
        contents = arguments[2];
    }

    $.flexModal.add(controlId, function () {
        var $modalContent = $(this).children();
        $modalContent.html('');

        var response = {};
        response.Title = title;
        response.Contents = contents;

        fnLoadTemplate('/account/confirmonebutton.html',
            function (data) {
                var helpers = {};

                fnRenderHTML($modalContent, data, response, helpers);
                if (okFunction != null) {
                    $('#btn_ok').show();
                    $('#btn_ok').on('click', function () {
                        okFunction();
                    });
                }
                //Change button text
                if (btnOK_Text) {
                    $('#btn_ok').text(btnOK_Text);
                }
            }, null, getResourceData('Account', getCurrentLanguage())
        );

        $(controlId).addClass("flex-modal-item flex-modal-item--ready flex-modal-item--visible");
    });
};

//function fnMakeSelectControlObject(deviceType, items) {
//    var result = '';
//    var template = '';

//    if (deviceType.toUpperCase() == 'DESKTOP')
//        template = '<dd><a href="#"{{if isSelect == true}} class="t_pink"{{/if}}>{{:name}}</a></dd>';
//    else
//        template = '<option value="{{:value}}"{{if isSelect == true}} selected{{/if}}>{{:name}}</option>';

//    var tmpl = $.templates(template);
//    return tmpl.render(items);
//}


/******************************************************
//-- Common Validator --
No. : Date        : Name            : Detail
1   : 03/06/2017  : dayeon.k        : Created
*******************************************************
how to use : 
  addMethod -> [{ name: "nonSpecialChar"
                , method: function (value, element) { return this.optional(element) || !(/[@~!\#$^&*\=+|:;?"<,.>']/.test(value));}
                , message: "Do not use special characters such as #, $, or &amp;"}]
  rules    -> Ex) { 'txt_ex': { required: true, email: true } }
  messages -> Ex) { 'txt_ex': { required: 'Please enter email address', email: 'Invalid email' } }
  errorPlacement -> Customize placement of created error labels.
                    Ex) <input type="email" id="txt_ex" name="txt_ex" data-error="#tooltip_ex">
                        <div id="tooltip_ex" style="display: none;"></div>
*/
function fnInitValidate(contolFormId, rules, messages, addMethodArr) {
    //Add a custom validation method.
    // [{ name, method, message }, ...]
    if (addMethodArr != null && addMethodArr.length > 0) {
        for (var i = 0; i < addMethodArr.length; i++) {
            jQuery.validator.addMethod(addMethodArr[i].name, addMethodArr[i].method, addMethodArr[i].message);
        }
    }

    //jquery validation
    return $(contolFormId).validate({
        ignore: [],
        errorElement: "div",
        errorClass: "tooltip",
        highlight: false,
        rules: rules,
        messages: messages,
        errorPlacement: function (error, element) {
            var placement = $(element).data('error');
            if (placement) {
                $(placement).html(error);
                $(placement).show();
            } else {
                error.insertAfter(element);
            }
        }
    });
};

function fnIsGuest() {
    //"UPGlobal" cookie 값에서
    // Y : Guest
    if (fnGetAcctInfoFromCookie() != null && fnGetAcctInfoFromCookie().Guest.toUpperCase() == "Y") {
        return true;
    }
    return false;
};

function fnIsLoggedIn() {
    //"LoggedInGlobal" cookie 값
    // 0 : 
    // 1 : LoggedIn
    if (getCookie("LoggedInGlobal") != '' && getCookie("LoggedInGlobal") == "1") {
        return true;
    }
    return false;
};

function fnGetUserId() {
    if (fnGetAcctInfoFromCookie() != null && fnGetAcctInfoFromCookie().Id != '') {
        return fnGetAcctInfoFromCookie().Id;
    }
    return "";
};

function fnGetUserName() {
    if (fnGetAcctInfoFromCookie() != null && fnGetAcctInfoFromCookie().FirstName != '') {
        return fnGetAcctInfoFromCookie().FirstName;
    }
    return "";
};

var fnSearch = function () {
    var searchText = $('#ihKeyword').val();
    if (searchText === '')
        searchText = $('#ihKeyword_mobile').val();

    if (searchText !== '')
        location.href = SITE_PREFIX + '/search/?val=' + searchText;

    return false;
};

//-- common LogOut function --
function fnLogOut() {
    var rediretURL = null;

    //remove cookies
    if (getCookie("chkMigrateBasket") != '')
        deleteCookie("chkMigrateBasket");
    if (getCookie("WishListData") != '')
        deleteCookie("WishListData");
    if (getCookie("MyDefaultList") != '')
        deleteCookie("MyDefaultList");
    if (getCookie("LoginCheckGlobal") != '')
        deleteCookie("LoginCheckGlobal");
    if (getCookie("UserTraceGlobal") != '')
        deleteCookie("UserTraceGlobal");
    if (getCookie("WishListDataGlobal") != '')
        deleteCookie("WishListDataGlobal");
    if (getCookie("RecentlyViewedGlobal") != '')
        deleteCookie("RecentlyViewedGlobal");
    //remove user info
    if (getCookie(AcctInfoCookieName) != '')
        deleteCookie(AcctInfoCookieName);

    //추가한거
    //delete
    if (getCookie("LoggedInGlobal") != '')
        deleteCookie("LoggedInGlobal");

    if (arguments.length == 1) {
        rediretURL = arguments[0];
    }
    else {
        rediretURL = SITE_PREFIX + '/';
    }

    location.href = rediretURL;
};

//-- Check logged in, before page Load
function fnPreloadForLoggedin(isCheckForLoggedin, rediretURL, firstFunction) {
    if (firstFunction !== undefined || firstFunction != null) {
        firstFunction();
    }

    // isCheckForLoggedin: true -> do redirect when user logged in.
    if (isCheckForLoggedin) {
        if (fnIsLoggedIn() && fnGetUserId() != "" && !fnIsGuest()) {
            location.href = rediretURL;
        }
    }
    // isCheckForLoggedin: false -> do redirect when user not logged in.
    else {
        if (!fnIsLoggedIn() || fnGetUserId() == "") {
            location.href = rediretURL;
        }
    }
};

var fnToggleContent = function (titleId, contentId) {
    $('#' + titleId).toggleClass('active');
    $('#' + contentId).slideToggle();
};

var formatCurrency = function (num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + '$' + num + '.' + cents);
};

//-- Password Show & Hide event 
var fnClickShowPW = function () {
    var control = [];
    var showText = 'SHOW', hideText = 'HIDE';

    //Because it does not work on Firefox, must defined evnet.
    var event;
    if (arguments.length == 5) {
        event = arguments[0], showText = arguments[1], hideText = arguments[2], control[0] = arguments[3], control[1] = arguments[4];
    }
    else if (arguments.length == 4) {
        event = arguments[0], showText = arguments[1], hideText = arguments[2], control[0] = arguments[3];
    }
    else {
        return alert("Parameter Error");
    }

    //if (!event) event = window.event;

    for (var i = 0; i < control.length; i++) {
        if ($(control[i]).attr('type') == 'password') {
            $(control[i]).attr('type', 'text');
            event.target.innerHTML = hideText;
        }
        else if ($(control[i]).attr('type') == 'text') {
            $(control[i]).attr('type', 'password');
            event.target.innerHTML = showText;
        }
    }
};

//-- Syncronize value 
var fnSyncValueDoubleControl = function (control, toSyncControl) {
    $(toSyncControl).val($(control).val());
}

//-- check byte
var checkByte = function (str) {
    var passValue = true;
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 127) {
            passValue = false;
            break;
        }
    }
    return passValue;
};

//-- on key press
var fnOnKeyPressSubmit = function (e, submitFunc) {
    var code = e.charCode || e.keyCode;
    // Enter pressed?
    if (code == 10 || code == 13) {
        if (submitFunc != null) submitFunc();
    }
    return false;
};

//-- Get AM/PM date format like 10:00 AM
var fnFormatAMPM = function (date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
};

//-- Open new window
var fnOpenNewWindow = function (url, target) {
    window.open(url, target);
};


var fnSetPager = function (no, size, total, selector, isShowText, isAddClassfr) {
    html = '', first = 1, end = Math.ceil(total / size);
    var class_fr = "class='fr'";
    var previousTextTag = "<span class='hide_mobile'>Previous</span>";
    var nextTextTag = "<span class='hide_mobile'>Next</span>";

    if (isAddClassfr == null) isAddClassfr = true;
    if (isShowText == null) isShowText = false;

    if (end < 6) {
        html = "<ul " + (isAddClassfr ? class_fr : '') + ">" +
            "<li class='pageno'><span class='p_prev'></span>" + (isShowText ? previousTextTag : "") + "</li>";

        for (var i = 0; i < end; i++) {
            if (no == first + i) {
                html += "<li class='t_pink underline pageno'>" + (first + i) + "</li>";
            }
            else {
                html += "<li class='pageno'>" + (first + i) + "</li>";
            }
        }

        html += "<li class='pageno'>" + (isShowText ? nextTextTag : "") + "<span class='p_next'></span></li>" +
            "</ul>";
    }
    else {
        if (no <= 2) {
            html = "<ul " + (isAddClassfr ? class_fr : '') + ">" +
                "<li class='pageno'><span class='p_prev'></span>" + (isShowText ? previousTextTag : "") + "</li>";

            for (var i = 0; i < 3; i++) {
                if (no == first + i) {
                    html += "<li class='t_pink underline pageno'>" + (first + i) + "</li>";
                }
                else {
                    html += "<li class='pageno'>" + (first + i) + "</li>";
                }
            }

            html += "<li class='dot'>...</li>" +
                "<li class='pageno'>" + end + "</li>" +
                "<li class='pageno'>" + (isShowText ? nextTextTag : "") + "<span class='p_next'></span></li>" +
                "</ul>";
        }
        else if (2 < no && no < end - 1) {
            html = "<ul " + (isAddClassfr ? class_fr : '') + ">" +
                "<li class='pageno'><span class='p_prev'></span>" + (isShowText ? previousTextTag : "") + "</li>" +
                "<li class='pageno'>" + first + "</li>" +
                "<li class='dot'>...</li>" +
                "<li class='pageno'>" + (no - 1) + "</li>" +
                "<li class='t_pink underline pageno'>" + (no) + "</li>" +
                "<li class='pageno'>" + (parseInt(no) + 1) + "</li>" +
                "<li class='dot'>...</li>" +
                "<li class='pageno'>" + end + "</li>" +
                "<li class='pageno'>" + (isShowText ? nextTextTag : "") + "<span class='p_next'></span></li>" +
                "</ul>";
        }
        else if (end - 2 <= no) {
            html = "<ul " + (isAddClassfr ? class_fr : '') + ">" +
                "<li class='pageno'><span class='p_prev'></span>" + (isShowText ? previousTextTag : "") + "</li>" +
                "<li class='pageno'>" + first + "</li>" +
                "<li class='dot'>...</li>";
            for (var i = 2; i >= 0; i--) {
                if (no == end - i) {
                    html += "<li class='t_pink underline pageno'>" + (end - i) + "</li>";
                }
                else {
                    html += "<li class='pageno'>" + (end - i) + "</li>";
                }
            }
            html += "<li class='pageno'>" + (isShowText ? nextTextTag : "") + "<span class='p_next'></span></li>" +
                "</ul>";
        }
    }

    $.each(selector, function (index, value) {
        $(value).html(html);
    });
};

var fnRequestForgotPassword = function () {
    var requestEmail = null;
    var successFunction = null;
    var errorFunction = null;
    var isLoadingOption = null;

    if (arguments.length >= 5 || arguments.length < 1) {
        return alert("Parameter Error");
    }
    else if (arguments.length == 4) {
        requestEmail = arguments[0];
        successFunction = arguments[1];
        errorFunction = arguments[2];
        isLoadingOption = arguments[3];
    }
    else if (arguments.length == 3) {
        requestEmail = arguments[0];
        successFunction = arguments[1];
        errorFunction = arguments[2];
        isLoadingOption = false;
    }
    else if (arguments.length == 2) {
        requestEmail = arguments[0];
        successFunction = arguments[1];
        isLoadingOption = false;
    }
    else {
        requestEmail = arguments[0];
        isLoadingOption = false;
    }


    executeAJAX("/Account/ForgetPassword", "POST", "JSON",
        {
            email: requestEmail
        },
        true,
        successFunction,
        errorFunction,
        isLoadingOption
    );
};

//정규식 검사를 하는 함수입니다.
//검사를 위한 정규식 패턴과 검사 문자열을 매개변수로 받습니다.
//검사를 완료하고 검사 결과를 리턴합니다.
//함수를 호출한 곳에서는 리턴값의 null 여부를 확인하고 사용합니다.
var fnRegExec = function (pattern, text) {

    obj = pattern.exec(text);

    if (obj) {
        return obj[0];
    }
    else {
        return null;
    }
};

//To trim spaces from the start and end of the string.
var fnTrimStartEnd = function (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

//Same as .NET String.Format function
String.Format = function (b) {
    var a = arguments;
    return b.replace(/(\{\{\d\}\}|\{\d\})/g, function (b) {
        if (b.substring(0, 2) == "{{") return b;
        var c = parseInt(b.match(/\d/)[0]);
        return a[c + 1]
    })
};

//현재 페이지의 스크롤 포지션 정보를 저장하는 함수입니다.
//얻은 데이터는 페이지의 URI 와 함께 sessionStorage 에 저장됩니다.
var fnSetNavigation = function () {
    var storredData = [];
    var data = {
        'url': document.URL,
        'position': $(document).scrollTop()
    };

    if (JSON.parse(sessionStorage.getItem('storredData') != null)) {
        storredData = JSON.parse(sessionStorage.getItem('storredData'));
        sessionStorage.removeItem('storredData');

        $.each(storredData, function (index, value) {
            if (value != undefined && value.url == document.URL) {
                storredData.splice(index, 1);
            }
        });
    }

    storredData.push(data);

    sessionStorage.setItem('storredData', JSON.stringify(storredData));
}

// Click event for customId Question icon
var fnClickCustomIDQuestion = function () {
    var countrycode = '';

    // if selected country
    if ($('#hd_country'))
        countrycode = $('#hd_country').val();

    if (getCurrentLanguage() == 'ko-KR' || countrycode == 'KR') {
        fnOpenNewWindow('https://unipass.customs.go.kr/csp/persIndex.do', '_blank');
    }
}

//현재 접속한 환경의 디바이스 정보를 확인합니다.
//접속한 디바이스의 환경을 조회하고 싶을 때는 object 에 값을 추가하도록 함수를 수정합니다.
//함수를 호출한 곳에서는 data 의 error 값을 확인한 뒤 isMobile 값으로 디바이스의 환경을 확인합니다.
var fnCheckDeviceType = function (data) {
    if (!Array.isArray(data) && typeof data == "object") {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            data.isMobile = true;
            //data.deviceName = '';
        }
        else {
            data.isMobile = false;
        }
        data.error = false;
    }
    else {
        data.error = true;
    }
}

//--CookiePopup
var fnCheckShowCookiePopup = function () {
    var hideCookiePopup = getCookie('hideCookieNotice');

    if (hideCookiePopup !== 'Y') {
        $('.cookie').show();
    }
}

var fnClosePop_CookieNotice = function () {
    setCookie('hideCookieNotice', 'Y', 30);
    $('.cookie').hide();
}

//--Event Bind
var fnNewEventBind = function (id, event, functionContent) {
    $('#' + id).on(event, function () {
        functionContent();
    });
}

var fnNewEventunBind = function (id, event) {
    $('#' + id).off(event);
}