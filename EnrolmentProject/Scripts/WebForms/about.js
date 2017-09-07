data = {

}

fnAjax('/Ajax/Ajax_About.aspx', 'GET', data, function (response) {
    $('#user_photo').show();
    $('#aboutName').text(response[0].student_name);
    $('#aboutPhone').text(response[0].phone);
    $('#aboutGender').text(response[0].gender);
    $('#aboutUniversity').text(response[0].university_name);
    $('#aboutDepartment').text(response[0].department_name);
    $('#aboutGrade').text(response[0].grade);
    $('#aboutSemester').text(response[0].semester);
    $('#aboutStatement').text(response[0].statement);
}, function (response) {
    alert('에러가 발생하였습니다.');
});