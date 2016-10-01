'use strict';

openstudioApp.controller('ZonesCtrl', ['$scope', '$log', 'os', 'uiGridConstants', function ($scope, $log, os, uiGridConstants) {
  $scope.zones = [];

  function Zone(os_zone) {
    var self = this;
    self.model_object = os_zone;
    Object.defineProperties(this, {
      name: {
        get: function () {
          return self.model_object.name().get();
        },
        set: function (_name) {
          self.model_object.setName(_name);
        }
      },
      multiplier: {
        get: function () {
          return self.model_object.multiplier();
        },
        set: function (_value) {
          if (Number.isInteger(_value)) self.model_object.setMultiplier(_value);
        }
      },
      heatingSchedule: {
        get: function () {
          if (self.model_object.thermostatSetpointDualSetpoint().is_initialized()) {
            var tstat = self.model_object.thermostatSetpointDualSetpoint().get();
            if (tstat.getHeatingSchedule().is_initialized()) {
              return tstat.getHeatingSchedule().get().name().get();
            }
            return 'NOT INITIALIZED: thermostatSetpointDualSetpoint heatingSchedule';
          }
          return 'NOT INITIALIZED: thermostatSetpointDualSetpoint';
        },
        set: function (_value) {
          var scheduleRuleset = scheduleRulesets.get(_value);
          if (self.model_object.thermostatSetpointDualSetpoint().is_initialized()) {
            var tstat = self.model_object.thermostatSetpointDualSetpoint().get();
            tstat.setHeatingSetpointTemperatureSchedule(scheduleRuleset);
          }
        }
      },
      sizingZone: {
        get: function () {
          return self.model_object.sizingZone().zoneCoolingDesignSupplyAirTemperature();
        },
        set: function (_value) {
          if (Number.isInteger(_value)) self.model_object.sizingZone().setZoneCoolingDesignSupplyAirTemperature(_value);
        }
      }
    });
  }

  function ZoneEquipment(os_zone_equipment) {
    var self = this;
    self.model_object = os_zone_equipment;
    Object.defineProperties(this, {
      name: {
        get: function () {
          var name = self.model_object.name();
          if (name.is_initialized()) return name.get();
          return 'NOT INITIALIZED: equipment';
        },
        set: function (_name) {
          self.model_object.setName(_name);
        }
      }
    });
  }

  var os_zones = os.openstudio.model.getThermalZones(os.model);
  window.zones = os_zones;
  for (var i = 0; i < os_zones.size(); ++i) {
    var _zone = new Zone(os_zones.get(i));
    _zone.children = [];
    for (var j = 0; j < os_zones.get(i).equipment().size(); ++j) {
      var equipment = os_zones.get(i).equipment().get(j);
      _zone.children.push(new ZoneEquipment(equipment));
    }
    $scope.zones.push(_zone);
  }

  $scope.scheduleRulesetNames = [];
  var scheduleRulesets = os.openstudio.model.getScheduleRulesets(os.model);
  for (var i = 0; i < scheduleRulesets.size(); ++i) {
    var ruleset = scheduleRulesets.get(i);
    $scope.scheduleRulesetNames.push({id: i, name: ruleset.name().get()});
  }

  $scope.addZone = function () {
    var os_zone = new os.openstudio.model.ThermalZone(os.model);
    var _zone = new Zone(os_zone);
    $scope.zones.push(_zone);
  };

  $scope.removeZone = function (_zone) {
    $scope.zones.splice($scope.zones.indexOf(_zone), 1);
    _zone.model_object.remove();
  };

  $scope.treeOptions = {
    nodeChildren: "children",
    dirSelectable: true,
    equality: function (a, b) {
      if (_.has(a, 'name') && _.has(b, 'name')) return a.name == b.name;
      return false;
    },
    multiSelection: false,
    injectClasses: {
      ul: "a1",
      li: "a2",
      liSelected: "a7",
      iExpanded: "a3",
      iCollapsed: "a4",
      iLeaf: "a5",
      label: "a6",
      labelSelected: "a8"
    }
  };

  $scope.showSelected = function (node) {
    console.log('Selected:', node);
  };

  $scope.gridOptions = {
    data: 'zones',
    enableSorting: true,
    columnDefs: [
      {
        name: 'name',
        type: 'numberStr',
        sort: {
          direction: uiGridConstants.ASC
        }
      }, {
        name: 'multiplier'
      }, {
        name: 'sizingZone'
      }, {
        name: 'heatingSchedule',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownOptionsArray: $scope.scheduleRulesetNames,
        editDropdownValueLabel: 'name'
      }
    ],
    onRegisterApi: function (gridApi) {
      $scope.grid1Api = gridApi;
    }
  };
}]);
