function initService(){
    var notificationService = 'com.red_folder.phonegap.plugin.backgroundservice.taskMeSrv.NotificationSrv';
    var factory = cordova.require('com.red_folder.phonegap.plugin.backgroundservice.BackgroundService')
    myService = factory.create(notificationService);
    myService.getStatus(function(r){startService(r)}, function(e){displayError(e)});
}


function displayError(data){
    console.log("Service Error");

}




function startService(data) {
    console.log("Is service running: " + data.ServiceRunning);
   if (!data.ServiceRunning) {
      myService.startService(function(r){enableTimer(r);registerForBootStart();}, function(e){displayError(e)});

   }else{
        sendConfigUpdate();
        registerForBootStart();
   }
}

 function registerForBootStart() {
       if (myService.RegisteredForBootStart)
          console.log('Service started, timer enabled and service registered for Boot start');
       else
         myService.registerForBootStart( function(r){ console.log('Service started, timer enabled and service registered for Boot start') },
                                                              function(e){ console.log('An error has occurred in registerForBootStart') });
    }

function enableTimer(data) {
      myService.enableTimer(3600000, function(r){console.log("Service started successfully"); sendConfigUpdate();}, function(e){console.log("service start error")});
}

function sendConfigUpdate(){
    var tachescfg = taches.getSrvConfig();

    myService.setConfiguration(tachescfg, function(r){console.log("service configuration updated")},function(e){console.log("service configuration update errir");} );

}