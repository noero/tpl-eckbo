document.addEventListener('DOMContentLoaded', function() {

    var events_Museum_Place = {
        events: [
            {
                daysOfWeek: [ '0', '1','2', '3', '4', '5', '6' ],
                startTime: '08:00:00',
                endTime: '09:00:00',
                backgroundColor: '#97bd8c'
            },
            {
                daysOfWeek: [ '0', '1','2', '3', '4', '5', '6' ],
                startTime: '09:00:00',
                endTime: '10:00:00',
                backgroundColor: '#97bd8c'
            },
            {
                daysOfWeek: [ '0', '1','2', '3', '4', '5', '6' ],
                startTime: '10:00:00',
                endTime: '11:00:00',
                backgroundColor: '#97bd8c'
            },
            {
                daysOfWeek: [ '0', '1','2', '3', '4', '5', '6' ],
                startTime: '11:00:00',
                endTime: '12:00:00',
                backgroundColor: '#97bd8c'
            },
            {
                daysOfWeek: [ '0', '1','2', '3', '4', '5', '6' ],
                startTime: '14:00:00',
                endTime: '15:00:00',
                backgroundColor: '#97bd8c'
            },
            {
                daysOfWeek: [ '0', '1','2', '3', '4', '5', '6' ],
                startTime: '15:00:00',
                endTime: '16:00:00',
                backgroundColor: '#97bd8c'
            },
            {
                daysOfWeek: [ '0', '1','2', '3', '4', '5', '6' ],
                startTime: '16:00:00',
                endTime: '17:00:00',
                backgroundColor: '#97bd8c'
            },
            {
                daysOfWeek: [ '0', '1','2', '3', '4', '5', '6' ],
                startTime: '17:00:00',
                endTime: '18:00:00',
                backgroundColor: '#97bd8c'
            },
        ],
    }

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        expandRows: true,
        height: '100%',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: ''
        },
        themeSystem: 'bootstrap5',
        locale: 'fr',
        firstDay: 1,
        initialView: 'timeGridWeek',
        allDaySlot: false,
        slotMinTime: '07:00:00',
        slotMaxTime: '19:00:00',
        selectable: true,
        eventSources: [events_Museum_Place],
        eventDisplay: 'block',
        eventClick: function(info) {
            console.log(info.event.backgroundColor)
            if (info.event.backgroundColor === '#97bd8c') {
                info.event.setProp('backgroundColor', '#ff5354');
                info.event.setProp('borderColor', '#ff5354');
                info.event.setProp('textColor', 'white');
            } else {
                info.event.setProp('backgroundColor', '#97bd8c');
                info.event.setProp('borderColor', '#97bd8c');
                info.event.setProp('textColor', 'black');
            }

        },
        eventColor: '#97bd8c',
        eventTextColor: 'black'
    });
    calendar.render();

});