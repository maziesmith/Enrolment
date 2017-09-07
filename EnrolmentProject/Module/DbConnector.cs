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

        public DataTable SpSignIn(string id, string pw)
        {
            string spName = "spSignIn";

            SqlParameter[] arrPams = new SqlParameter[2];
            arrPams[0] = new SqlParameter("@user_id", SqlDbType.NVarChar);
            arrPams[0].Value = id;
            arrPams[1] = new SqlParameter("@user_pw", SqlDbType.NVarChar);
            arrPams[1].Value = pw;

            return SqlHelper.ExecuteDataset(connectionString, spName, arrPams).Tables[0];
        }

        public DataTable SpGetStudendInformation()
        {
            string spName = "spGetStudendInformation";

            SqlParameter[] arrPams = new SqlParameter[1];
            arrPams[0] = new SqlParameter("@user_id", SqlDbType.NVarChar);
            arrPams[0].Value = string.Empty;

            return SqlHelper.ExecuteDataset(connectionString, spName, arrPams).Tables[0];
        }

        public DataTable SpGetClassList()
        {
            string spName = "spGetClassList";

            SqlParameter[] arrPams = new SqlParameter[1];
            arrPams[0] = new SqlParameter("@user_id", SqlDbType.NVarChar);
            arrPams[0].Value = string.Empty;

            return SqlHelper.ExecuteDataset(connectionString, spName, arrPams).Tables[0];
        }
    }
}