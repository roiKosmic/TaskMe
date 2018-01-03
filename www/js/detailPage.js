$( "#detailPage" ).on( "pagecreate", function( event ) {
	console.log("creating detail page - binding events");
	$("#unite").change(function(e){
		console.log("changing unite");
		$("#duree").val(1);
		updateSliceByUnite($(this).val());
				
	});
	$("#cancelBtn").click(function(e){
		e.preventDefault();
		$( "#popupDialog" ).popup( "close" );
	});
	
	$("#confirmBtn").click(function(e){
		e.preventDefault();
		console.log("confirmedButton clicked: Removing"+detailPage);
		taches.removeTacheByName(detailPage);
		$( "#popupDialog" ).popup( "close" );
		$.mobile.navigate("#main");
		sendConfigUpdate();
	});
	
	$("#saveBtn").click(function(e){
		e.preventDefault();
		var nom = $("#nom").val();
		var unite = $("#unite").val();
		var duree =  parseInt($("#duree").val());
		var date = convertDateToUnix($("#inputDate").val());
		var type = $("#type").val();
		if(detailPage==="_new_"){
			console.log("creating a new Task");
			var newTask = taches.getTacheByName(nom);
			if(!(Object.keys(newTask).length)){
			    var t = new Tache(nom,unite,duree,date,type);
			    t.save();
			    taches.add(t);
			    sortTaches();
			    console.log(t.toString());
			    $.mobile.navigate("#main");
                sendConfigUpdate();
			}else{
			    console.log("error task exist");
			    $( "#popupCtrlDialog" ).popup( "open" );
			}
		}else{
			console.log("updating current task");
			var updatedTache = taches.getTacheByName(detailPage);
			updatedTache.nom = nom;
			updatedTache.unite = unite;
			updatedTache.duree = duree;
			updatedTache.date = date;
			updatedTache.type = type;
			updatedTache.save();
			sortTaches();
			console.log(updatedTache.toString());
			$.mobile.navigate("#main");
            sendConfigUpdate();
		}

	}
	);


});


$( '#detailPage' ).on( 'pagebeforeshow',function(event){
	console.log("clicked from"+detailPage);
	
	
	if(detailPage!=="_new_"){
		var updatedTache = taches.getTacheByName(detailPage);
		
		$("#nom").val(updatedTache.nom);
		$("#nom").prop("disabled",true);
		$("#unite option[value='"+updatedTache.unite+"']").prop("selected",true);
		$("#duree").val(updatedTache.duree);
		$("#inputDate").val(convertDateToRFC(updatedTache.date));
		$("#unite").selectmenu("refresh");
		updateSliceByUnite(updatedTache.unite);
		$("#trash").show(0);
		$("#type").val(updatedTache.type);
		$("#type").selectmenu("refresh");
	}else{
		$("#trash").hide();
		$("#nom").val("");
		$("#nom").prop("disabled",false);
		$("#unite option:selected").prop("selected",false);
		$("#unite option[value='semaines']").prop("selected",true);
		$("#unite").selectmenu("refresh");
		updateSliceByUnite("semaines");
		$("#duree").val(1);
		$("#duree").slider( "refresh" );
		$("#inputDate").val(convertDateToRFC(Date.now()));
		$("#type").val(afficher);
		$("#type").selectmenu("refresh");
	}

    
});

function updateSliceByUnite(myUnite){
	var nMax;
		switch(myUnite){
			case "jours":
				nMax=30;
				break
			case "semaines":
				nMax = 10;
				break;
			case "mois":
				nMax = 18;
				break;
			case "annees":
				nMax = 5;
				break;
		}
		$("#duree").attr("max",nMax);
		$( "#duree" ).slider( "refresh" );


}

function convertDateToUnix(maDate){
	var d = new Date();
	var dA = maDate.split("-");
	d.setFullYear(dA[0]);
	d.setMonth(dA[1]-1);
	d.setDate(dA[2]);
	return d.getTime();

}

function convertDateToRFC(unixDate){
	var date = new Date(unixDate);
	var day = date.getDate();
	var month = date.getMonth()+1
	if(month < 10){month = '0' + month;}
	if(day < 10){day = '0' + day;}
	return date.getFullYear()+"-"+month+"-"+day;

}