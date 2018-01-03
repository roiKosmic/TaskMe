var degree;
var timer;
$("#main").on("pagebeforecreate",function(event){

	 if(window.localStorage.getItem("_tri_")){
		var tri = window.localStorage.getItem("_tri_");
		$("#tri option:selected").prop("selected",false);
		$("#tri option[value='"+tri+"']").prop("selected",true);
		if(tri === "dueDate") taches.orderByDueDate();
		if(tri === "gauge") taches.orderByGauge();
		if(tri === "startDate") taches.orderByStartDate();
		if(tri === "name") taches.orderByName();
		
   }else{
	if(taches) taches.orderByName();
   }

	$("#tri").change(function(event){
	    event.preventDefault();
	    window.localStorage.setItem("_tri_",$(this).val());
	    sortTaches();
	
	    updateTaskList();
	$("#menuPanel").panel("close");

	});
  
   $("#afficher").change(function(event){
	event.preventDefault();
	updateTaskList();
	$("#title").html("Liste des "+$("#afficher").val());
   // $("#title").hide().show(0);
	afficher = $("#afficher").val();
	$("#menuPanel").panel("close");
 
	});
  
}
);


$( '#main' ).on( 'pagebeforeshow',function(event){
	if(taches) console.log(taches.length);
	updateTaskList();
	$(document).on("swipe",function(){
    	    console.log("swipping");
    	    $("#tachesList").hide(function(){
    	    if($("#afficher").val()==="taches"){
    	        $("#afficher").val("loisirs").change();
    	    }else{
    	        $("#afficher").val("taches").change();
    	    }

    	    $("#tachesList").show(1000);});
            $("#title").html("Liste des "+$("#afficher").val());
           // $("#title").hide().show(0);


    	});
    $("#title").html("Liste des "+$("#afficher").val());
    //$("#title").hide().show(0);
});

function rotate(elm){

	 elm.css({ WebkitTransform: 'rotate(' + degree + 'deg)'});  
     elm.css({ '-moz-transform': 'rotate(' + degree + 'deg)'});
     elm.css('transform','rotate('+degree+'deg)');          
	 if(degree==-360){
		clearTimeout(timer);
	 }else{
	 degree = degree-10;
	 timer = setTimeout(function() {
            degree; rotate(elm);
        },10);
	}
}
function updateTaskList(){
$("#tachesList li").remove();
if(taches){
	var array = taches.taches;
	var afficher = $("#afficher").val();
		$.each(array, function(i){
			console.log("calculated gauge"+array[i].getGaugeValue());
			if(array[i].type === afficher){
			$("#tachesList").append(""+
			"<li position="+i+">"+
						"<a  id='myList' href='#detailPage' tacheId='"+array[i].nom+"' data-transition='pop'>"+
							"<button id='rstBtn' tacheId='"+array[i].nom+"' class='ui-btn ui-btn-inline ui-btn-fab ui-btn-raised clr-warning'><i class='zmdi zmdi-replay zmdi-hc-lg'></i></button>"+
							"<h2 style='display:inline'>&nbsp;"+array[i].nom+"</h2><div style='display:inline' id='d'>&nbsp;("+array[i].getDayToDueDate()+"j)</div><div id='date'><i class='zmdi zmdi-pin flag'><p style='display:inline'>&nbsp;"+array[i].getDueDate()+"</p></i></div>"+
								"<div class='progress' data-amount='"+array[i].getGaugeValue()+"'>"+
									"<div id='draps' class='amount'></div>"+
								"</div>"+	
						"</a>"+
					"</li>"+
			"");
			}
		
			$('#tachesList').listview('refresh');
			
		});
		
	$(".progress").each(function(index){
		var dataVal= $(this).attr("data-amount");
		$(this).children(".amount").css("width",100-dataVal+"%");
		
	});
	
	$("a").click(function(e){
		if($(this).attr("tacheId")){
			detailPage = $(this).attr("tacheId");
		}
	});
	
		$("button").click(function(e){
		if($(this).attr("id")==="rstBtn"){
			e.preventDefault();
			var t = taches.getTacheByName($(this).attr("tacheId"));
			t.reset();
			degree = 0;
			var btn = $(this);
			rotate(btn);            
			var v = $(this).parent().find('.progress .amount');
			var d =  $(this).parent().find('#date');
			var dd = $(this).parent().find('#d');
			var gauge = t.getGaugeValue();
			console.log("Gauge "+gauge);
			v.css("width",100-gauge+"%");
			v.hide().show(0);
	        sendConfigUpdate();
	        dd.html("&nbsp;("+t.getDayToDueDate()+"j)");
	        dd.hide().show("slow");
			d.children("i").children("p").html("&nbsp;"+t.getDueDate());
			d.hide().show("slow");
		}
	});

		 Waves.attach('a#myList', ['waves-button']);
		 Waves.attach('button#rstBtn', ['waves-button']);
		 Waves.init();

	 }

}

function sortTaches(){
	var tri = $("#tri").val();
	if(tri === "dueDate") taches.orderByDueDate();
	if(tri === "gauge") taches.orderByGauge();
	if(tri === "startDate") taches.orderByStartDate();
	if(tri === "name") taches.orderByName();
    if(tri === "dayToGo") taches.orderByDayToGo();
}
