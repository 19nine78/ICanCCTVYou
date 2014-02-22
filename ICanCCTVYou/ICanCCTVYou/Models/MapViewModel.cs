using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICanCCTVYou.Models
{
    public class MapViewModel
    {
        public List<Camera> Cameras { get; set; }
        public List<Camera> NearestCameras { get; set; }
    }
}