using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace ICanCCTVYou.Controllers
{
    public class BaseController : Controller
    {



        public double Lat { get; set; }
        public double Lng { get; set; }


        public BaseController()
        {
            

        }

        protected override void Initialize(RequestContext requestContext)
        {
            base.Initialize(requestContext);
            if (!String.IsNullOrEmpty(HttpContext.Request.Headers["X-Latitude"]))
            {
                Lat = double.Parse(Request.Headers["X-Latitude"]);
                Lng = double.Parse(Request.Headers["X-Longitude"]);
            }
        }
    }
}