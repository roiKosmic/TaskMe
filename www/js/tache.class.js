var Tache = function (_nom,_unite,_duree,_date,_type) {
		this.nom = _nom;
		this.unite=_unite
		this.duree=_duree;
		this.date = _date;
		if(_type===""){
			this.type = "taches";
		}else{
			this.type = _type;
		}
	};
	
	Tache.prototype.save= function(){
		this.delete();
		window.localStorage.setItem(this.nom,this.toString());
	};
	
	Tache.prototype.getNom= function(){
		return this.nom;
	};
	Tache.prototype.delete=function(){
		window.localStorage.removeItem(this.nom);
	
	};
	Tache.prototype.reset=function(){
		this.date =  Date.now();
		this.save();
	};
	Tache.prototype.toString=function(){
		return JSON.stringify(this);
	};
	Tache.prototype.getGaugeValue= function(){
		var value = Math.ceil(0.75*100*((Date.now()-this.date)/(this.getDueDateMS()-this.date)));
		if(value>100) return 100;
		if(value<0) return 0;
		return value;
		
	};
	
	Tache.prototype.getDueDateMS=function(){
		var date = new Date(this.date);
		switch (this.unite){
			case "jours":
				date.setTime(this.date+this.duree*24*60*60*1000);
				break;
			case "semaines":
				date.setTime(this.date+this.duree*7*24*60*60*1000);
				break;
			case "mois":
				date.setMonth(date.getMonth()+this.duree);
				break;
			case "annees":
				date.setYear(new Date(this.date).getFullYear()+this.duree);
				break;
		}
		return date;
	};

	Tache.prototype.getDayToDueDate=function(){
	    var now = Date.now()
	    var dueDate = this.getDueDateMS();
	    var dueDay = (now-dueDate)/(24*60*60*1000)
        return Math.round(dueDay);
	};
	
	Tache.prototype.getDueDate=function(){
		var date = this.getDueDateMS();
		var day = date.getDate();
		var month = date.getMonth()+1
		if(month < 10){month = '0' + month;}
		if(day < 10){day = '0' + day;}
		return day+"/"+month+"/"+date.getFullYear();
	};


var TacheArray = function(){
		this.length = 0;
		this.taches = new Array();
	};
	
	TacheArray.prototype.add=function(obj){
		this.taches.push(obj);
		this.length = this.length+1;
		return true;
	};

	TacheArray.prototype.getSrvConfig=function(){
	    var dateDuJour = Date.now()-(24*60*60*1000);
	    var jsonResult = {
	        "config":[]
	    };

	    var array = this.taches;

            $.each(array, function(i){
        			if(array[i].getDueDateMS()>= dateDuJour) {
        				//console.log("removing obj at:"+i);
        				var r = {
        				    nom:  array[i].nom,
        				    dueDate: array[i].getDueDateMS().getTime()
        				    };
        			    jsonResult.config.push(r);
        			}
        	});

        return jsonResult;

	};

	TacheArray.prototype.removeTacheByName=function(_nom){
		var find = false;
		var array = this.taches;
		$.each(array, function(i){
			//console.log("array loop:"+i);
			if(array[i].nom === _nom) {
				//console.log("removing obj at:"+i);
				array[i].delete();
				array.splice(i,1);
				find = true;
				return false;
			}
			
			return true;
		});
		if(find){
			this.length = this.length-1;
		}
		return find;
	};
	TacheArray.prototype.getTacheByName=function(_nom){
		var tache = {};
		var array = this.taches;
		$.each(array, function(i){
			if(array[i].nom === _nom) {
				tache = array[i];
				return false;
			}
			
			return true;
		});
		return tache;
	
	};
	TacheArray.prototype.loadFromLocalStorage=function(){
		var _this = this;
		$.each(window.localStorage, function(key, value){
			if(key!=="_tri_"){
				var t = JSON.parse(value);
				if(t.type){
					var obj = new Tache(t.nom,t.unite,t.duree,t.date,t.type);
				}else{
					var obj = new Tache(t.nom,t.unite,t.duree,t.date,"");
				}
				_this.add(obj);
			}

		});
	
	};
	TacheArray.prototype.toString=function(){
		return JSON.stringify(this.taches);
		
	};
	TacheArray.prototype.orderByDueDate=function(){
		this.taches.sort(function(a,b){
			return a.getDueDateMS()-b.getDueDateMS();
		
		});
	};
	
	TacheArray.prototype.orderByDayToGo=function(){
    		this.taches.sort(function(a,b){
    			return b.getDayToDueDate()-a.getDayToDueDate();
    		});

    };
	TacheArray.prototype.orderByGauge=function(){
    		this.taches.sort(function(a,b){
    			return b.getGaugeValue()-a.getGaugeValue();
    		});

    	};
	TacheArray.prototype.orderByStartDate=function(){
		this.taches.sort(function(a,b){
			return a.date-b.date;
		
		});
	
	};
	
	TacheArray.prototype.orderByName=function(){
		this.taches.sort(function (a,b){
			return a.nom > b.nom;
		});
	};
	TacheArray.prototype.save=function(){
		var array = this.taches
		$.each(array, function(i){
			array[i].save();
		}
		);
	
	};
	