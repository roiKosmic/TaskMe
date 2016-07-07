# TaskMe

##Pré-requis
* Cette application est écrite en HTML5/jquery/jquery mobile et à besoin de cordova pour génére l'application pour l'OS cible (Android/IOS...)
* Un paquet dans le dossier apk a été généré pour Android. Il a été testé sur Android 4.2 et 5.1
* L'apk disponible peut être installé manuellement, il faut autoriser l'installation de paquet autosigné.
  Voici comment faire : http://www.frandroid.com/comment-faire/lemultimedia/231266_autoriserlessourcesinconnues


##Warnings
L'application a été testée uniquement sur des smartphones Android 4.2 et 5.1. Du fait de l'utilisation du plugin bgs-core, l'application n'est compatible que sur Android en l'état. Des modifications sont nécessaire pour le rendre compatible IOS (gestion des notifications notamment)

##Installation
###Utilisateur (android)
* Télécharger l'apk disponible sur le repository dans le dossier apk.
* Copier l'apk sur votre téléphone mobile
* Autoriser l'installation de paquets autosignés
* Cliquer sur l'apk depuis votre téléphone pour l'installer

##Développeur
* Installer cordova
* Créer le projet TaskMe
```
cordova create TaskMe com.kosmic.taskMe TaskMe  
```
* Build pour la plateforme Android
```
cd TaskMe
cordova platform add android 
```
* Installer le plugin bg-core
```
cordova plugin add https://github.com/Red-Folder/bgs-core.git
````
* Mise à jours du AndroidManifest
``` 
cd TaskMe\platforms\android\AndroidManifest.xml
``` 
``` xml
        <receiver android:name="com.red_folder.phonegap.plugin.backgroundservice.BootReceiver">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
            </intent-filter>
        </receiver>
        <service android:name="com.red_folder.phonegap.plugin.backgroundservice.taskMeSrv.NotificationSrv">
            <intent-filter>
                <action android:name="com.red_folder.phonegap.plugin.backgroundservice.taskMeSrv.NotificationSrv" />
            </intent-filter>
        </service>
```
* copier le dossier www du repository dans votre dossier TaskMe\www

* copier le contenu du  dossier class dans votre dossier TaskMe\platforms\android\src\com\red_folder\phonegap\plugin\backgroundservice

* Construire votre projet
``` 
cordova build android
``` 


##Crédits
* L'application utilise le framework jquery, jquerymobile
* L'application utilise la librairie nativedroid2 http://nativedroid.godesign.ch/material/
* Nativedroid2 utilise plusieurs librairies dont wow.js wave.js animate.css
* L'application utilise le plugin bgs-core pour cordova https://github.com/Red-Folder/bgs-core
