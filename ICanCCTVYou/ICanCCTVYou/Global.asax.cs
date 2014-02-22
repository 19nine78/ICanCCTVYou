using ICanCCTVYou.Models.Indexes;
using Raven.Client.Document;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace ICanCCTVYou
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {

        public static DocumentStore DocumentStore { get; set; }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            ConfigureRaven(this);

        }

        protected void ConfigureRaven(MvcApplication application)
        {
            var store = new DocumentStore
            {
                Url = "http://127.0.0.01:8080",
                DefaultDatabase = "ICanCCTVYou"
                //ConnectionStringName = "RavenHQ"
            };

            store.Initialize();
            store.ExecuteIndex(new Camera_Index());

            MvcApplication.DocumentStore = store;

            var statistics = store.DatabaseCommands.GetStatistics();

        }
    }
}