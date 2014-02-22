using Raven.Client.Indexes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICanCCTVYou.Models.Indexes
{
    public class Camera_Index : AbstractIndexCreationTask<Camera>
    {
        public Camera_Index()
        {
            Map = cameras => from camera in cameras
                             select new
                             {
                                 _ = SpatialGenerate("Coordinates", camera.Latitude, camera.Longitude),
                                camera.CameraRadius
                             };

            Spatial(x => x.CameraRadius, options => options.Geography.Default());
            
        }
    }
}