exports.name = 'programs_view_controller'

exports.inject = (app) ->
  app.controller exports.name,
    [
      '$scope'
      exports.controller
    ]
  exports.controller

exports.controller = ($scope) ->
  $scope.test = 'Hello from programs-view-controller.coffee'
  return