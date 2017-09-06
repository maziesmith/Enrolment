using EnrolmentProject.Module;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace EnrolmentProject.App_Code.Ajax
{
    public partial class Ajax_Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string id = Request["id"];
            string pw = Request["pw"];

            DbConnector connector = new DbConnector();

            DataTable dt = connector.SpTest("sijun");

            string str = dt.Rows[0].ToString();
        }
    }
}