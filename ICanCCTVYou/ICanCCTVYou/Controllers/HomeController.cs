using CsvHelper;
using CsvHelper.Configuration;
using ICanCCTVYou.Models;
using ICanCCTVYou.Models.Indexes;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Globalization;

namespace ICanCCTVYou.Controllers
{
    public class HomeController : BaseController
    {
        //
        // GET: /Home/
        public ActionResult Index()
        {
            var cams = new List<Camera>();
            
            using (var session = MvcApplication.DocumentStore.OpenSession())
            {
                cams = session.Query<Camera, Camera_Index>()
                       .Customize(x => x.WithinRadiusOf(
                            fieldName: "Coordinates",
                            radius: 0.1,
                            latitude: 55.856076,
                            longitude: -4.2573179,
                            radiusUnits: Raven.Abstractions.Indexing.SpatialUnits.Kilometers)
                            )
                            .ToList();
            }


            return View();
        }

        public ActionResult GetCameras(double north, double east, double south, double west)
        {
            var rectangle = string.Format(CultureInfo.InvariantCulture, "BOX ({0:F6} {1:F6}, {2:F6} {3:F6})", west, south, east, north);

            using (var session = MvcApplication.DocumentStore.OpenSession())
            {
                var cameras = session.Query<Camera, Camera_Index>()
                    .Customize(x => x.RelatesToShape("Coordinates", rectangle, Raven.Abstractions.Indexing.SpatialRelation.Within)
                                     .SortByDistance())
                    .Take(1024)
                    .ToList();

               // var circle = string.Format(CultureInfo.InvariantCulture, "Circle({0:F6} {1:F6} d=0.05)", Lng, Lat);
                var point = string.Format(CultureInfo.InvariantCulture, "Point({0:F6} {1:F6})", Lng, Lat);


                var nearest = session.Query<Camera, Camera_Index>()
                    .Customize(x => x.WithinRadiusOf(
                        fieldName: "Coordinates",
                        radius: 0.1,
                        latitude: Lat,
                        longitude: Lng,
                        radiusUnits: Raven.Abstractions.Indexing.SpatialUnits.Kilometers
                        ).SortByDistance()).ToList();

                var tmp = session.Query<Camera, Camera_Index>()
                    .Spatial(x => x.CameraRadius, criteria => criteria.Intersects(point))
                    .ToList();

                var viewModel = new MapViewModel()
                {
                    Cameras = cameras,
                    NearestCameras = tmp
                };

                return Json(viewModel, JsonRequestBehavior.AllowGet);
            }



        }

        public ActionResult Import()
        {
            var csvFile = @"c:\users\alastair\documents\visual studio 2013\Projects\ICanCCTVYou\ICanCCTVYou\App_Data\CCTV.csv";
            using (var session = MvcApplication.DocumentStore.OpenSession())
            using (var reader = new StreamReader(csvFile))
            using (var csv = new CsvReader(reader, new CsvConfiguration() { CultureInfo = System.Globalization.CultureInfo.InvariantCulture }))
            {
                var CsvRows = csv.GetRecords<CsvRow>();
                foreach (var row in CsvRows)
                {
                    var camera = new Camera
                    {
                        Id = row.OBJECTID,
                        CameraNumber = row.CAM_NUM,
                        CCTVScheme = row.CCTV_SCHEME,
                        LocationName = row.LOCATION,
                        Latitude = row.Latitude,
                        Longitude = row.Longitude,
                        CameraRadius = string.Format(CultureInfo.InvariantCulture, "Circle({0:F6} {1:F6} d=0.1)", row.Longitude, row.Latitude)
                    };

                    session.Store(camera);
                    
                }

                session.SaveChanges();
            }

            return View();
        }
    }
}