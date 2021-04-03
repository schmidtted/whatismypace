$(document).ready(function(){
	
	initializeFields();
	
	function initializeFields(){
		//alert(getCookie("distance"));
		if(getCookie("distance") != ""){
			$("#distance").val(getCookie("distance"));
		}else{
			$("#distance").val("0.0");
		}
		if(getCookie("speed") != ""){
			$("#speed").val(getCookie("speed"));
		}else{
			$("#speed").val("0.0");
		}
		if(getCookie("hours") != ""){
			$("#time_hours").val(getCookie("hours"));
		}else{
			$("#time_hours").val("00");
		}
		if(getCookie("minutes") != ""){
			$("#time_minutes").val(getCookie("minutes"));
		}else{
			$("#time_minutes").val("00");
		}
		if(getCookie("seconds") != ""){
			$("#time_seconds").val(getCookie("seconds"));
		}else{
			$("#time_seconds").val("00");
		}
		
		if(getCookie("units") == "mi"){
			$(".imperialButton").prop("disabled", true);
			$(".metricButton").prop("disabled", false);
		}

	
	}	
	
		
	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	}

	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
	
	$("input[type=number]").bind('keyup input', function(){
		
		var typeOfForm = $("form").attr("id");
		
		if(basicInput() && timeInput()){
			//alert("Basic Input Met");
			switch(typeOfForm){
				case "averageSpeedForm":
					calculateAverageSpeed();
					break;
				case "distanceForm":
					calculateDistance();
					break;
				case "timeForm":					
					calculateTime();
			}
			
		}else{
			//alert("Basic Input Not Met")
			resetCalculatedFields();
		}
		
		
			
	});
	
		
	$(".timeInput").blur(function(){
		//alert($(this).val());
		if(!isNaN($(this).val())){
			$(this).val(lzero($(this).val(), 2));
		}
	});
	
	$(".metricButton").click(function(){
		$(this).prop("disabled", true);
		$(".imperialButton").prop("disabled", false);
		$("#distance").val(($("#distance").val()*1.60934).toFixed(1));
		$("#speed").val(($("#speed").val()*1.60934).toFixed(1));
		setCookie("units", "kg", 365);
		rememberCalculatorValues();
	});
	
	$(".imperialButton").click(function(){
		$(this).prop("disabled", true);
		$(".metricButton").prop("disabled", false);
		$("#distance").val(($("#distance").val()*0.621371).toFixed(1));
		$("#speed").val(($("#speed").val()*0.621371).toFixed(1));
		setCookie("units", "mi", 365);
		rememberCalculatorValues();
	});
	
	function basicInput(){
		var allFull = true;
		$(".basicInput").each(function(){
			if(isNaN($(this).val()) || $(this).val() == ""){
				allFull = false;
				return false;
			}
			
		});
		return allFull;
	}
	
	function timeInput(){
		var validTime = true;
		$(".timeInput").each(function(){
			if(parseInt($(this).val()) > 59){
				validTime = false;
				return false;
			}
			
		});
		return validTime;
	}
	
	function resetCalculatedFields(){
		$(".calculatedField").each(function(){
			$(this).val("");
		});
	}
	function rememberCalculatorValues(){
		setCookie("speed", $("#speed").val(), 365);
		setCookie("distance", $("#distance").val(), 365);
		setCookie("hours", $("#time_hours").val(), 365);
		setCookie("minutes", $("#time_minutes").val(), 365);
		setCookie("seconds", $("#time_seconds").val(), 365);
	}
	
	function calculateAverageSpeed(){
		var distanceInput = $("#distance").val();
		var timeInput = parseFloat($("#time_hours").val()) + (parseFloat($("#time_minutes").val()) / 60) + (parseFloat($("#time_seconds").val()) / 3600);
		var result;
		var paceResult;
		// this is the main formula
		result = (distanceInput / timeInput).toFixed(1);
		if(result != "Infinity" && result != "NaN"){
			$("#speed").val(result);
			rememberCalculatorValues();
		}else{
			resetCalculatedFields();
		}
	}
	
	function calculateDistance(){
		var timeInput = parseFloat($("#time_hours").val()) + (parseFloat($("#time_minutes").val()) / 60) + (parseFloat($("#time_seconds").val()) / 3600);
		var speedInput = $("#speed").val();
		$("#distance").val((speedInput * timeInput).toFixed(1));
		rememberCalculatorValues();
	}
	
	function calculateTime(){
		var distanceInput = $("#distance").val();
		var speedInput = $("#speed").val();
		var timeBaseTen = (distanceInput / speedInput);
		$("#time_hours").val(Math.floor(timeBaseTen));
		var rawMinutes = (timeBaseTen % 1 * 60);
		$("#time_minutes").val(lzero(Math.floor(rawMinutes).toFixed(0),2));
		var rawSeconds = (rawMinutes % 1 * 60);
		$("#time_seconds").val(lzero(Math.floor(rawSeconds).toFixed(0),2));
		if($(".calculatedField").val() == "NaN" || $(".calculatedField").val() == "Infinity"){
			resetCalculatedFields();
		}
		rememberCalculatorValues();
	}
	
	function lzero(str, len) {
		//alert(str);
		str += ''; // cast to string
		while(str.length < len) str = "0" + str;
		return str;
	}
	
});