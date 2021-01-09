module.exports = function Gathering(mod) {
	let mobid = [],
		gatherMarker = [];

	function gatheringStatus() {
		sendStatus("",
			"Gathering: " + (mod.settings.enabled  ? "On"   : "Off"),
			"alert: " + (mod.settings.sendToAlert  ? "on" : "off"),
			"plants: " + (mod.settings.plantsMarkers ? "on" : "off"),
			"ore: " + (mod.settings.miningMarkers ? "on" : "off"),
			"energy: " + (mod.settings.energyMarkers ? "on" : "off"),
			"duranium: " + (mod.settings.duraniumMarkers ? "on" : "off")
		);
	}

	function sendStatus(msg) {
		sendMessage([...arguments].join('\n\t'));
	}

	mod.command.add("gat", (arg) => {
		if (!arg) {
			mod.settings.enabled = !mod.settings.enabled;
			if (!mod.settings.enabled) {
				for (let itemId of mobid) {
					despawnItem(itemId);
				}
			}
			gatheringStatus();
		} else {
			switch (arg) {
				case "alert":
					mod.settings.sendToAlert = !mod.settings.sendToAlert;
					sendMessage("Warning message: " + (mod.settings.sendToAlert ? "on" : "off"));
					break
				case "status":
					gatheringStatus();
					break
				case "plants":
					mod.settings.plantsMarkers = !mod.settings.plantsMarkers;
					sendMessage("Plants: " + (mod.settings.plantsMarkers ? "on" : "off"));
					break
				case "ore":
					mod.settings.miningMarkers = !mod.settings.miningMarkers;
					sendMessage("Ore: " + (mod.settings.miningMarkers ? "on" : "off"));
					break
				case "energy":
					mod.settings.energyMarkers = !mod.settings.energyMarkers;
					sendMessage("Energy: " + (mod.settings.energyMarkers ? "on" : "off"));
					break
				case "duranium":
					mod.settings.duraniumMarkers = !mod.settings.duraniumMarkers;
					sendMessage("Duranium: " + (mod.settings.duraniumMarkers ? "on" : "off"));
					break	
				default:
					sendStatus("",
						"gat",
						"gat alert",
						"gat status",
						"gat ore",
						"gat plants",
						"gat energy"
					);
					break
			}
		}
	})

	mod.game.me.on('change_zone', (zone, quick) => {
		mobid = [];
	})

	mod.hook('S_SPAWN_COLLECTION', 4, (event) => {
		if (mod.settings.enabled) {
			//sendMessage( ("Found [" + event.id + "] " ), 44);
			if (mod.settings.plantsMarkers && (gatherMarker = mod.settings.plants.find(obj => obj.id === event.id))) {
				if (mod.settings.sendToAlert) {
					sendAlert( ("Found [" + gatherMarker.name + "] " + gatherMarker.msg), 44);
					sendMessage("Found [" + gatherMarker.name + "] " + gatherMarker.msg);
				}
			} else if (mod.settings.miningMarkers && (gatherMarker = mod.settings.mining.find(obj => obj.id === event.id))) {
				if (mod.settings.sendToAlert) {
					sendAlert( ("Found [" + gatherMarker.name + "] " + gatherMarker.msg), 44);
					sendMessage("Found [" + gatherMarker.name + "] " + gatherMarker.msg);
				}
			} else if (mod.settings.duraniumMarkers && (gatherMarker = mod.settings.duranium.find(obj => obj.id === event.id))) {
				if (mod.settings.sendToAlert) {
					sendAlert( ("Found [" + gatherMarker.name + "] " + gatherMarker.msg), 44);
					sendMessage("Found [" + gatherMarker.name + "] " + gatherMarker.msg);
				}				
			} else if (mod.settings.energyMarkers && (gatherMarker = mod.settings.energy.find(obj => obj.id === event.id))) {
				if (mod.settings.sendToAlert) {
					sendAlert( ("Found [" + gatherMarker.name + "] " + gatherMarker.msg), 44);
					sendMessage("Found [" + gatherMarker.name + "] " + gatherMarker.msg);
				}
			} else {
				//sendAlert( ("Found [" + event.id + "] " ), 44);
				return true;
			}

			spawnItem(event.gameId, event.loc);
			mobid.push(event.gameId);
		}
	})

	mod.hook('S_DESPAWN_COLLECTION', 2, (event) => {
		if (mobid.includes(event.gameId)) {
			gatherMarker = [];
			despawnItem(event.gameId);
			mobid.splice(mobid.indexOf(event.gameId), 1);
		}
	})

	function spawnItem(gameId, loc) {
		loc.z -= 40;
		mod.send('S_SPAWN_DROPITEM', 9, {
			gameId: gameId*10n,
			loc: loc,
			item: 88704, // velika banket coin
			amount: 1,
			expiry: 0,
			owners: []
		});
	}

	function despawnItem(gameId) {
		mod.send('S_DESPAWN_DROPITEM', 4, {
			gameId: gameId*10n
		});
	}
	
	function sendMessage(msg) { mod.command.message(msg) }

	function sendAlert(msg, type) {
		mod.send('S_DUNGEON_EVENT_MESSAGE', 2, {
			type: type,
			chat: false,
			channel: 0,
			message: msg,
		});
	}
}
