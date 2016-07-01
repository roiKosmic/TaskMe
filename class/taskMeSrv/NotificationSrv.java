package com.red_folder.phonegap.plugin.backgroundservice.taskMeSrv;
import com.kosmic.taskMe.R;
import com.red_folder.phonegap.plugin.backgroundservice.BackgroundService;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;


import android.app.Notification;
import android.app.NotificationManager;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by vincent on 20/06/2016.
 */


public class NotificationSrv extends BackgroundService {
    private final static String TAG = NotificationSrv.class.getSimpleName();
    private final static int FL_TODELETE = 2;
    private final static int FL_NOTIFIED = 1;
    private final static int FL_UNNOTIFIED = 0;

    @Override
    protected JSONObject doWork() {
        SharedPreferences sharedPrefs = PreferenceManager.getDefaultSharedPreferences(this);
        SharedPreferences.Editor editor = sharedPrefs.edit();
        Log.d(TAG,"Logging the config"+sharedPrefs.getString(this.getClass().getName() + ".config",""));
        try {
            JSONArray mySavedConfig = new JSONArray(sharedPrefs.getString(this.getClass().getName() + ".config", ""));
            for (int i = 0; i < mySavedConfig.length(); i++) {
                JSONObject sobj = mySavedConfig.optJSONObject(i);
                Date dueDate = new Date(sobj.getLong("dueDate"));
                Date now = new Date();
                if (sobj.getInt("flag") == FL_UNNOTIFIED) {
                    SimpleDateFormat fmt = new SimpleDateFormat("yyyyMMdd");
                    SimpleDateFormat fmt2 = new SimpleDateFormat("dd/MM/yyyy");
                    //On notifie les taches du jours
                    if (fmt.format(dueDate).equals(fmt.format(now)) || (now.getTime() > dueDate.getTime()) ) {
                        sobj.put("flag", FL_NOTIFIED);

                        //On notifie les taches expirés non notifiée et les taches du jours non notifié
                        Notification n  = new Notification.Builder(this)
                                .setContentTitle("TaskMe : "+sobj.getString("nom"))
                                .setSmallIcon(R.drawable.icon)
                                .setContentText(sobj.getString("nom")+" est arrivé à échéance le "+fmt2.format(dueDate)).build();


                        NotificationManager notificationManager =
                                (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

                        notificationManager.notify(0, n);

                }
            }
        }
            editor.putString(this.getClass().getName() + ".config",mySavedConfig.toString());
            editor.commit();
        }catch (JSONException e) {
            Log.d(TAG,"Json error "+e);
        }
        /*SimpleDateFormat fmt = new SimpleDateFormat("yyyyMMdd");
        return fmt.format(date1).equals(fmt.format(date2));
        */

        return null;
    }

    @Override
    protected JSONObject getConfig() {
        SharedPreferences sharedPrefs = PreferenceManager.getDefaultSharedPreferences(this);
        try {
        JSONObject result = new JSONObject();
        result.put("config",sharedPrefs.getString(this.getClass().getName() + ".config",""));
        return result;

        } catch (JSONException e) {
            Log.d(TAG,"Json error "+e);
        }
        return null;

    }

    @Override
    protected void setConfig(JSONObject config) {
        Log.d(TAG,"setConfig called"+config.toString());
        SharedPreferences sharedPrefs = PreferenceManager.getDefaultSharedPreferences(this);
        SharedPreferences.Editor editor = sharedPrefs.edit();
        try {
            JSONArray mySavedConfig = new JSONArray(sharedPrefs.getString(this.getClass().getName() + ".config",""));
            JSONArray myNewConfig = config.optJSONArray("config");


            //MAJ des éléments sauvegardés
            for(int i = 0; i < mySavedConfig.length(); i++){
                JSONObject sobj = mySavedConfig.optJSONObject(i);
                boolean toDelete = true;
                for(int j=0;j < myNewConfig.length();j++) {
                    JSONObject obj = myNewConfig.optJSONObject(j);
                    if(obj.getString("nom").equals(sobj.getString("nom"))){
                        toDelete = false;
                        if(sobj.has("flag")){
                            switch (sobj.getInt("flag")) {
                                case FL_NOTIFIED:
                                    if (sobj.getLong("dueDate") != obj.getLong("dueDate")) {
                                        //MAJ de la DATE
                                        sobj.put("dueDate", obj.getLong("dueDate"));
                                        sobj.put("flag", FL_UNNOTIFIED);
                                    }
                                    break;
                                case FL_UNNOTIFIED:
                                    if (sobj.getLong("dueDate") != obj.getLong("dueDate")) {
                                        //MAJ de la DATE
                                        sobj.put("dueDate", obj.getLong("dueDate"));
                                        sobj.put("flag", FL_UNNOTIFIED);
                                    }
                                    break;
                                case FL_TODELETE:
                                    sobj.put("dueDate", obj.getLong("dueDate"));
                                    sobj.put("flag", FL_UNNOTIFIED);
                                    break;

                            }
                        }
                        else{
                            sobj.put("flag",FL_UNNOTIFIED);
                        }

                    }

                }
                if(toDelete){
                    sobj.put("flag",FL_TODELETE);

                }
            }
            //Ajout des nouveaux éléments
            for(int i = 0; i < myNewConfig.length(); i++) {
                JSONObject obj = myNewConfig.optJSONObject(i);
                boolean newObject = true;
                for (int j = 0; j < mySavedConfig.length(); j++) {
                    JSONObject sobj = mySavedConfig.optJSONObject(j);
                    if(obj.getString("nom").equals(sobj.getString("nom"))) {
                        newObject = false;
                    }
                }
                if(newObject){
                    JSONObject newTask = new JSONObject();
                    newTask.put("nom",obj.getString("nom"));
                    newTask.put("dueDate", obj.getLong("dueDate"));
                    newTask.put("flag", FL_UNNOTIFIED);
                    mySavedConfig.put(newTask);

                }
            }

            //Suppression des éléments flag FL_TODELETE
            JSONArray Njarray=new JSONArray();
            for(int i=0;i<mySavedConfig.length();i++) {
                if (mySavedConfig.optJSONObject(i).getInt("flag") != FL_TODELETE) {
                    Njarray.put(mySavedConfig.get(i));
                }
            }

            editor.putString(this.getClass().getName() + ".config",Njarray.toString());

        }catch(JSONException e) {
            Log.d(TAG,"Json error "+e);
            editor.putString(this.getClass().getName() + ".config","[]");
        }


        editor.commit();
    }

    @Override
    protected JSONObject initialiseLatestResult() {
        return null;
    }


}
