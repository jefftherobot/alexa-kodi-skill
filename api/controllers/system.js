var wol = require('wake_on_lan');

var actions = {
	on : function(res){
		res.json({ message: 'Turning T.V. on' });
		console.log('turning tv on...')
	},
	off: function(res){
		res.json({ message: 'Turning T.V. off' });
		console.log('turning tv off...')
	},
	stop : function(res){
		res.json({ message: 'Stopping playback' });
		console.log('stopping.')
	},
}


module.exports = function(kodi) {
	return {
		action: function(req, res) {
			var action = req.params.action;
			if(actions[action]){
				actions[action](res);
			}else{
				res.json({ message: 'System command not found' });
			}
		}
	}
}
