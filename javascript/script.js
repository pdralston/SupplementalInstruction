//script.js

$(document).ready(function(){

	$(".calendar").fullCalendar({
		defaultView: 'agendaWeek',
		showNonCurrentDates: "false",
		header: {
			left: "prev,next today",
			center: "",
			right: "title",
		},
		googleCalendarApiKey: '',
		events: {
			googleCalendarId: ''
		},
	});

});
