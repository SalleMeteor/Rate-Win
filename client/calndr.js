CalEvents = new Meteor.Collection('calevents');
Session.setDefault('editingCalEvent', null);
Session.setDefault('showEditEvent', false);
Session.setDefault('lastMod', null);

if (Meteor.user()) {
    Router.map(function () {
      this.route('home', {
        path: '/'
      });
      this.route('calendar', {
        path: '/calendar'
      });
    });
}

Template.calendar.showEditEvent = function() {
  return Session.get('showEditEvent');
}

Template.editevent.evt = function() {
  var calEvent =  CalEvents.findOne({_id:Session.get('editingCalEvent')});
  return calEvent;
}

Template.editevent.events({
	'click .save':function(evt,tmpl) {
		updateCalEvent(Session.get('editingCalEvent'),tmpl.find('.title').value);
		//Session.set('editingCalEvent',null); //shouldn't it be editingCalEvent? Where did this variable come from?
    Session.set('editing_event', null);
		Session.set('showEditEvent',false);
		Session.set('lastMod',new Date());
	}
})

Template.calendar.rendered = function() {
	$('#calendar').fullCalendar({
			dayClick:function(date, allDay, jsEvent, view) {
         CalEvents.insert({title: 'New Event', start: date, end: date});
         Session.set('lastMod',new Date());
			},
    
			eventClick:function(calEvent,jsEvent,view) {
				 Session.set('editingCalEvent', calEvent.id);
         Session.st('showEditEvent', true);
			},
    
      eventDrop:function(calEvent){
				 CalEvents.update(calEvent.id, {$set: {start:calEvent.start,end:calEvent.end}});
				 Session.set('lastMod',new Date());
			},
			events: function(start, end, callback) {
         var events = [];
         calEvents = CalEvents.find();
         calEvents.forEach(function(evt) {
           events.push({
             id: evt._id,
             title: evt.title,
             start: evt.start,
             end: evt.end
           });
         });
         callback(events);
			 },
       editable:true
		 });
}

Template.calendar.lastMod = function() {
    return Session.get('lastMod');
}

var updateCalEvent = function(id, title) {
    CalEvents.update(id, {$set: {title:title}});
	  return true;
}