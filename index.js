module.exports = function ConnectionSpecificModels(sails) {


  var hook = {

    defaults: {
      __configKey__: {
        active: false,
        removeOriginals: false,
        targets: []
      }
    },

    configure: function() {

      if (!sails.config[this.configKey].active) {
        return sails.log.verbose("ConnectionSpecificModels hook deactivated.");
      }

      sails.log.verbose("ConnectionSpecificModels hook activated.");

      sails.on('hook:orm:models:loaded', function() {
        _.each(sails.config[hook.configKey].targets, function(target) {
          generateModels(target.models, target.connections);
        });
        if(sails.config[hook.configKey].removeOriginals)
        {
          _.each(sails.config[hook.configKey].targets, function(target) {
            removeModels(target.models);
          });
        }
      });

    }
  };

  function generateModels(models, connections) {

    var generatedModels = {};

    _.each(connections, function(connectionId) {
      _.each(models, function(modelId) {

        var originalModel = sails.models[modelId.toLowerCase()];
        var generatedModelName = modelId+'_'+connectionId;

        var generatedModel = _.merge(_.cloneDeep(originalModel), {
          tableName: generatedModelName.toLowerCase(),
          identity: generatedModelName.toLowerCase(),
          connection: connectionId,
          globalId: modelId + '_' + connectionId
        });

        _.each(generatedModel.attributes, function(attribute) {
          if(typeof attribute === 'object')
            if(attribute.model) attribute.model = attribute.model + '_' + connectionId;
            else if (attribute.collection) attribute.collection = attribute.collection + '_' + connectionId;
        });

        generatedModels[generatedModelName] = generatedModel;
        sails.log.verbose("Generated model " + generatedModelName);

      });
    });

    _.each(generatedModels, function(model, modelId) {
      sails.models[model.identity] = model;
      sails.log.verbose("Added model " + modelId);
    });
  }

  function removeModels(models) {
    _.each(models, function(modelId) {
      if(sails.models[modelId.toLowerCase()]) {
        delete sails.models[modelId.toLowerCase()];
        sails.log.verbose("Removed model " + modelId);
      }
    });
  }

  return hook;

}
