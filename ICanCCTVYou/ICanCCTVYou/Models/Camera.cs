using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICanCCTVYou.Models
{
    public class Camera
    {
        public string Id { get; set; }
        public string CameraNumber { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string LocationName { get; set; }
        public string CCTVScheme { get; set; }
        public string CameraRadius { get; set; }
    }
}