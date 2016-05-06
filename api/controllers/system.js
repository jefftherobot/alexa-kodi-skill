var wol = require('wake_on_lan');

var actions = {
	on : function(res, kodi){
		res.json({ message: 'Turning T.V. on' });
		console.log('turning tv on...')
		wake_kodi()
	},
	off: function(res, kodi){
		res.json({ message: 'Turning T.V. off' });
		console.log('turning tv off...')
		kodi.System.Suspend();
	},
	stop : function(res, kodi){
		res.json({ message: 'Stopping playback' });
		kodi.Player.Stop({'playerid':1});
		console.log('stopping.')
	},
}


function wake_kodi(){
	var mac = process.env.KODI_MAC;
	
	wol.wake(mac,{ address: '192.168.0.255'});
}


module.exports = function(kodi) {
	return {
		action: function(req, res) {
			var action = req.params.action;
			if(actions[action]){
				actions[action](res, kodi);
			}else{
				res.json({ message: 'System command not found' });
			}
		}
	}
}
