

var getQueryVariable = function(variable) {
	var query = window.location.search.substring(1);
	var preVars = query.split('/');
	var vars = preVars[0].split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (decodeURIComponent(pair[0]) == variable) {
			return decodeURIComponent(pair[1]);
		}
	}
	console.log('Query variable %s not found', variable);
}

var isValid = {
	email: function(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	},
	phone: function(phone) {
		var stripPhone = phone.replace(/\D/g,'');
		if (stripPhone.length >= 10) return true;
		else false;
	}
}

var formatPhone10 = function(phone){
	var stripPhone = phone.replace(/\D/g,'');
	var dash = "";
	var openParen = "";
	var closedParen = "";
	if (stripPhone.length > 0) openParen = "(";
	if (stripPhone.length > 3) closedParen = ")";
	if (stripPhone.length > 6) dash = "-";
	var formattedPhone = openParen + stripPhone.substring(0,3) + closedParen + stripPhone.substring(3,6) + dash + stripPhone.substring(6,10);
	return formattedPhone;
}

var getTimezoneOffset = function(){
	function pad(number, length){
		 var str = "" + number
		 while (str.length < length) {
			  str = '0'+str
		 }
		 return str
	}
	var date = new Date();
	var offset = date.getTimezoneOffset();
	return ((offset<0? '+':'-') + pad(parseInt(Math.abs(offset/60)), 2)+ pad(Math.abs(offset%60), 2));
}
var getAMPMTime = function(date) {

    var hours = date.getHours() == 0 ? "12" : date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    var minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    var ampm = date.getHours() < 12 ? "am" : "pm";
    var formattedTime = hours + ":" + minutes + ampm;
    return formattedTime;

}

var createTimeDate = function(date, time){
	var milestoneDate = new Date(date);
	var strSplit = time.split(':');
	var hour = parseInt(strSplit[0]);
	var minute = parseInt(strSplit[1].substring(0,2));
	var set = strSplit[1].substring(2,4);
	if (hour === 12) {
		if (set === "am") hour = 0;
		else hour = 12;
	} else if (set === "pm") hour += 12;
	milestoneDate.setHours(hour);
	milestoneDate.setMinutes(minute);
	milestoneDate.setMinutes(milestoneDate.getMinutes() -  milestoneDate.getTimezoneOffset());
	return milestoneDate.toISOString();
}

/**
* Converts a day number to a string.
*
* @method dayOfWeekAsString
* @param {Number} dayIndex
* @return {Number} Returns day as number
*/
var dayOfWeekAsString = function(dayIndex) {
  return ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dayIndex];
}


export { getQueryVariable, isValid, formatPhone10, getTimezoneOffset, getAMPMTime, createTimeDate, dayOfWeekAsString }
