using EnrolmentProject.Module;
using System;
using System.Collections.Generic;
using System.Data;
using System.Web.UI;

namespace EnrolmentProject
{
    public partial class Enrolment : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            DbConnector connector = new DbConnector();

            DataTable dt = connector.SpGetClassList();

            repeater.DataSource = dt;
            repeater.DataBind();
        }
    }
}