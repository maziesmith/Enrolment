<%@ Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Enrolment.aspx.cs" Inherits="EnrolmentProject.Enrolment" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <asp:Repeater ID="repeater" runat="server">
        <ItemTemplate>
            <table>
                <tr>
                    <td>
                        <spanp><%# Eval("class_name") %></spanp>
                        <spanp><%# Eval("professor_name") %></spanp>
                        <spanp><%# Eval("first_time") %></spanp>
                        <spanp><%# Eval("second_time") %></spanp>
                        <spanp><%# Eval("third_time") %></spanp>
                    </td>
                    <br />
                </tr>
            </table>
            
        </ItemTemplate>
    </asp:Repeater>
</asp:Content>