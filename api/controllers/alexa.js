//https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference#Examples

module.exports = function() {
	return {
		init: function(req, res) {

			var type = req.body.request.type;

			console.log(type);

			res.json({ message: 'init' });
		}
	}
}