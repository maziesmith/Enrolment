using EnrolmentProject.Module;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Serialization;

namespace EnrolmentProject.Ajax
{
    public partial class Ajax_Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            SignIn();
        }

        public void SignIn()
        {
            string id = Request["id"];
            string pw = Request["pw"];

            DbConnector connector = new DbConnector();

            DataTable dt = connector.SpSignIn(id, pw);

            SignInResult result = new SignInResult();

            if (dt.Rows.Count > 0)
            {
                result.id = dt.Rows[0]["user_id"].ToString();
                result.pw = dt.Rows[0]["user_id"].ToString();
                result.result = "success";
            }
            else
            {
                result.result = "fail";
            }

            JavaScriptSerializer js = new JavaScriptSerializer();
            string strReturn = js.Serialize(result);

            Response.Clear();
            Response.ContentType = "application/json; charset=euc-kr";

            Response.Write(strReturn);
        }
    }

    class SignInResult
    {
        public string id { get; set; }
        public string pw { get; set; }
        public string result { get; set; }
    }
}