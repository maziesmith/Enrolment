using EnrolmentProject.Module;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Serialization;
using Newtonsoft.Json;

namespace EnrolmentProject.Ajax
{
    public partial class Ajax_About : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            GetData();
        }

        public void GetData()
        {
            DbConnector connector = new DbConnector();

            DataTable dt = connector.SpGetStudendInformation();

            JsonConvert.SerializeObject(dt);

            Result result = new Result();

            if (dt.Rows.Count > 0)
            {
                
                result.result = "success";
            }
            else
            {
                result.result = "fail";
            }

            string strReturn = JsonConvert.SerializeObject(dt);

            Response.Clear();
            Response.ContentType = "application/json; charset=UTF-8";

            Response.Write(strReturn);
        }

        class Result
        {
            public string result { get; set; }
        }
    }
}