using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICanCCTVYou.Models
{
    public class CsvRow
    {
        public string OBJECTID { get; set; }
        public string ORIG_NUM { get; set; }
        public string CAM_NUM { get; set; }
        public string X_COORD { get; set; }
        public string Y_COORD { get; set; }
        public double Latitude{get;set;}
        public double Longitude{get;set;}
        public string LOCATION { get; set; }
        public string CCTV_SCHEME { get; set; }
        public string Done { get; set; }
    }
}