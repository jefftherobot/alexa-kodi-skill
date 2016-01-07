//https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference#Examples

var requestType = {
	/**
	 * Called when the user launches the skill without specifying what they want.
	 */

	LaunchRequest : function(req, res){
		console.log('LaunchRequest')
		console.log("onLaunch requestId=" + req.body.request.requestId + ", sessionId=" + req.body.session.sessionId);

		var response = getWelcomeResponse();

		res.json(response);
	},

	/**
	 * Called when the user specifies an intent for this skill.
	 */
	IntentRequest: function(req, res){
		console.log('IntentRequest')
	},

	/**
	 * Called when the user ends the session.
	 * Is not called when the skill returns shouldEndSession=true.
	 */
	SessionEndedRequest : function(req, res){
		console.log('SessionEndedRequest.')
	}
}

// --------------- Functions that control the skill's behavior -----------------------


function getWelcomeResponse() {
	// If we wanted to initialize the session to have some attributes we could add those here.
	var sessionAttributes = {},
	    cardTitle = "Kodi",
	    speechOutput = "You can ask me what you would like to watch or what artist to hear in your Kodi.",
	    repromptText = "Please tell me what you would like to do with Kodi.",
	    shouldEndSession = false;

	return buildResponse(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession) )
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
	return {
		outputSpeech: {
			type: "PlainText",
			text: output
		},
		card: {
			type: "Simple",
			title: title,
			content: output
		},
		reprompt: {
			outputSpeech: {
				type: "PlainText",
				text: repromptText
			}
		},
		shouldEndSession: shouldEndSession
	};
}

function buildResponse(sessionAttributes, speechletResponse) {
	return {
		version: "1.0",
		sessionAttributes: sessionAttributes,
		response: speechletResponse
	};
}


module.exports = function(event, context) {
	return {
		init: function(req, res) {
			var type = req.body.request.type;

			if(requestType[type]){
				requestType[type](req, res);
			}else{
				res.json({ message: 'Request type not found' });
			}
		}
	}
}