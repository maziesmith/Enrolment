<%@ Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="EnrolmentProject._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div style="background-color:deepskyblue;width:250px;height:250px;margin: auto;margin-top: 300px;">
        <p>ID</p>
        <input id="DefaultId" type="text" />
        <p>PW</p>
        <input id="DefaultPw" type="password" />
        <br />
        <input id="DefaultOk" value="확인" type="button">
    </div>
</asp:Content>