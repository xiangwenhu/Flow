   const InteractEmitter = require('../events/InteractEmitter'),
       ActivityEmitter = require('../events/ActivityEmitter'),
       interactEmitter = new InteractEmitter(),
       statusEmitter = new ActivityEmitter()

   module.exports = {
       interactEmitter,
       statusEmitter
   }