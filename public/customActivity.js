'use strict';

define(function (require) {
	var Postmonger = require('postmonger');
	var connection = new Postmonger.Session();
	var payload = {};
	var steps = [
		{'key': 'eventdefinitionkey', 'label': 'Event Definition Key'}
	];
	var currentStep = steps[0].key;

	$(window).ready(function () {
		connection.trigger('ready');
	});
	
	connection.on('requestedTriggerEventDefinition',
	function(eventDefinitionModel) {
    		if(eventDefinitionModel){
       			eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
		}
	});

	function initialize (data) {
		if (data) {
			payload = data;
			var winid = payload['arguments'].execute.inArguments;
			console.log("hello boy "+JSON.stringify(winid));
			//console.log(JSON.stringify(payload));
		}
	}

	function onClickedNext () {
		if (currentStep.key === 'eventdefinitionkey') {
			save();
		} else {
			connection.trigger('nextStep');
		}
	}

	function onClickedBack () {
		connection.trigger('prevStep');
	}

	function onGotoStep (step) {
		showStep(step);
		connection.trigger('ready');
	}

	function showStep (step, stepIndex) {
		if (stepIndex && !step) {
			step = steps[stepIndex - 1];
		}

		currentStep = step;

		$('.step').hide();

		switch 	(currentStep.key) {
		case 'eventdefinitionkey':
			$('#step1').show();
			$('#step1 input').focus();
			break;
		}
	}

	function save () {
		var eventDefinitionKey = $('#select-entryevent-defkey').val();
		console.log("event key is "+JSON.stringify(eventDefinitionKey));
		payload['arguments'] = payload['arguments'] || {};
		payload['arguments'].execute = payload['arguments'].execute || {};
		console.log("hello sonny boy "+JSON.stringify(payload));
		
		payload['arguments'].execute.inArguments = [{
			'serviceCloudId': '{{Event.' + eventDefinitionKey + '.\"Test__c:Id\"}}'
		}];

		payload['metaData'] = payload['metaData'] || {};
		payload['metaData'].isConfigured = true;

		

		connection.trigger('updateActivity', payload);
	}

	connection.on('initActivity', initialize);
	connection.on('clickedNext', onClickedNext);
	connection.on('clickedBack', onClickedBack);
	connection.on('gotoStep', onGotoStep);
});
