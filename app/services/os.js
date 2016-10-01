'use strict';

openstudioApp.factory('os', [function () {
  var service = {};

  service.openstudio = require('../openstudio-node/OpenStudio.js').openstudio;
  window.openstudio = service.openstudio;
  // service.model = new service.openstudio.model.Model();
  // console.log(service.model);
  // service.openstudio.model.addSystemType7(service.model);
  // console.log(service.openstudio);
  // vt.loadModel('C:\\Users\\aswindle\\Desktop\\Axel.osm')
  var p = new service.openstudio.path('C:/Users/aswindle/Desktop/1.8.0_example_no_spaces.osm');
  // var vt = new service.openstudio.osversion.VersionTranslator();
  // var model = vt.loadModel(p);
  service.model = openstudio.model.Model.load(p).get();
  //service.model = new service.openstudio.model.Model(p);
  console.log(service.model);
  // service.model = model.get();
  return service;
}]);
