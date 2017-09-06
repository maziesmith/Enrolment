using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace EnrolmentProject.Module
{
    public class DbConnector
    {
        private string connectionString = ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;

        public DataTable SpTest(string str)
        {
            string spName = "spTest";

            SqlParameter[] arrPams = new SqlParameter[1];
            arrPams[0] = new SqlParameter("@Name", SqlDbType.NVarChar);
            arrPams[0].Value = str;

            return SqlHelper.ExecuteDataset(connectionString, spName, arrPams).Tables[0];
        }
    }
}