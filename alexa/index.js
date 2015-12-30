var request = require('request');

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
	try {
		console.log("event.session.application.applicationId=" + event.session.application.applicationId);

		/**
		 * Uncomment this if statement and populate with your skill's application ID to
		 * prevent someone else from configuring a skill that sends requests to this function.
		 */
		/*
		if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
			 context.fail("Invalid Application ID");
		}
		*/

		if (event.session.new) {
			onSessionStarted({requestId: event.request.requestId}, event.session);
		}

		if (event.request.type === "LaunchRequest") {
			onLaunch(event.request,
				event.session,
				function callback(sessionAttributes, speechletResponse) {
					context.succeed(buildResponse(sessionAttributes, speechletResponse));
				});
		} else if (event.request.type === "IntentRequest") {
			onIntent(event.request,
				event.session,
				function callback(sessionAttributes, speechletResponse) {
					context.succeed(buildResponse(sessionAttributes, speechletResponse));
				});
		} else if (event.request.type === "SessionEndedRequest") {
			onSessionEnded(event.request, event.session);
			context.succeed();
		}
	} catch (e) {
		context.fail("Exception: " + e);
	}
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
	console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
		", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
	console.log("onLaunch requestId=" + launchRequest.requestId +
		", sessionId=" + session.sessionId);

	// Dispatch to your skill's launch.
	getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
	console.log("onIntent requestId=" + intentRequest.requestId +
		", sessionId=" + session.sessionId);

	var intent = intentRequest.intent,
	    intentName = intentRequest.intent.name;

	// Dispatch to your skill's intent handlers
	if ("Movie" === intentName) {
		playMovie(intent, session, callback);
	} else if ("Shows" === intentName) {
		playShow(intent, session, callback);
	} else if ("AMAZON.HelpIntent" === intentName) {
		getWelcomeResponse(callback);
	} else {
		throw "Invalid intent";
	}
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
	console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId + ", sessionId=" + session.sessionId);
	// Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
	// If we wanted to initialize the session to have some attributes we could add those here.
	var sessionAttributes = {};
	var cardTitle = "Welcome";
	var speechOutput = "Welcome to Kodi. You can ask me what movie you would like to watch";
	// If the user either does not reply to the welcome message or says something that is not understood, they will be prompted again with this text.
	var repromptText = "Please tell me what movie you would like to watch.";
	var shouldEndSession = false;

	callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function playMovie(intent, session, callback) {
	var cardTitle = intent.name,
	    movieTitleSlot = intent.slots.MovieTitle,
	    repromptText = "",
	    sessionAttributes = {},
	    shouldEndSession = true,
	    speechOutput = "";

	if (movieTitleSlot) {
		var movieTitle = movieTitleSlot.value;

		request({
			url: 'http://jefftherobot.com:3000/movie', //URL to hit
			qs: {title: movieTitleSlot.value}, //Query string data
			method: 'GET',
		}, function(error, response, body){
			if(error) {
				console.log(error);
				speechOutput = "There was an error playing " + movieTitle;
				repromptText = "I can't find that movie. You can ask me what movie you want to watch by saying, watch and then the movie title";
			} else {
				console.log(response.statusCode, body);
				speechOutput = JSON.parse(body).message;
				repromptText = JSON.parse(body).reprompt;
			}
			callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
		});
	}

	
}

function playShow(intent, session, callback) {
	var cardTitle = intent.name,
	    showTitleSlot = intent.slots.ShowTitle,
	    repromptText = "",
	    sessionAttributes = {},
	    shouldEndSession = true,
	    speechOutput = "";

	if (showTitleSlot) {
		var showTitle = showTitle.value;

		request({
			url: 'http://jefftherobot.com:3000/show', //URL to hit
			qs: {title: showTitleSlot.value}, //Query string data
			method: 'GET',
		}, function(error, response, body){
			if(error) {
				console.log(error);
				speechOutput = "There was an error playing " + showTitle;
				repromptText = "I can't find that movie. You can ask me what movie you want to watch by saying, watch and then the movie title";
			} else {
				console.log(response.statusCode, body);
				speechOutput = JSON.parse(body).message;
				repromptText = JSON.parse(body).reprompt;
			}
			callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
		});
	}

	
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
			title: "SessionSpeechlet - " + title,
			content: "SessionSpeechlet - " + output
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