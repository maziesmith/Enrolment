<%@ Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="About.aspx.cs" Inherits="EnrolmentProject.About" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <h2>학생 정보</h2>
    <img id="user_photo" src="https://fileco.jobkorea.co.kr/User_Photo/M_Photo_View.asp?FN=2014\1\8\JK_GG_papaya9342.jpg" height="130" width="100" alt="사진" style="display:none" /><br />
    이름 : <span id="aboutName"></span><br />
    전화번호 : <span id="aboutPhone"></span><br />
    성별 : <span id="aboutGender"></span><br />
    대학교 : <span id="aboutUniversity"></span><br />
    학과 : <span id="aboutDepartment"></span><br />
    학년 : <span id="aboutGrade"></span><br />
    학기 : <span id="aboutSemester"></span><br />
    상태 : <span id="aboutStatement"></span>
    <script type="text/javascript" src="Scripts/WebForms/about.js"></script>
</asp:Content>
