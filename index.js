//necessary for bot token to work
require('dotenv').config()

//define requirements as constants
const fs = require('fs');
const Discord = require('discord.js');

//create new client
const client = new Discord.Client();

//define folder from which to fetch Kissa pictures
let kissadir = "petpics/kissa"

//create array of all files in kissadir directory
let kissafiles = fs.readdirSync(kissadir);

//define folder from which to fetch Patch pictures
let patchdir = "petpics/patch"

//create array of all files in patchdir directory
let patchfiles = fs.readdirSync(patchdir);

//display console message on login

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity('pets!help')
});

//set prefix for bot to listen to
let prefix = "pets!"
//define timeStart, timediff and n as variables
//when a message has just been sent, timeStart is set to the timestamp at which the message was set.
//when the next message is sent, timeStart is subtracted from the timestamp to create timediff.
//If timediff is smaller than a certain value, the bot will send a cooldown message and n will be increased by one. n is reset when a message is received after timediff > 3.
//If a message is sent while n > 1, and timediff is < 3, the bot will spam the user back, in private DM's.
let timeStart;
let timediff;
let n;
//listen for message
client.on('message', message => {
	//so bot doesn't reply to itself
	if (message.author.bot) return;
	
	// Check if the message starts with the `pets!` trigger
	if (message.content.startsWith(prefix)) {
		// Get the user's message excluding the `pets!`
		let text = message.content.substring(5);
		//check if sufficient time has elapsed since previous message
		//if not enough time has elapsed and therefore timediff < 3
		timediff= Math.round((new Date().getTime() - timeStart)/1000);
		if (timediff < 3 && n > 1) {
			//spam user in DM's; if they're this annoying, they deserve it!
			message.author.send("stop spamming!");
			return;
		}
		if(timediff < 3) { 
			//send slowmode reply
			message.reply("not so fast!");
			n = n+1;
			return;
			//else, if enough time has elapsed and timediff > 3
		} else {
			n = 0;
			//help instance
			if (text === "help") {
				//send help reply
				message.reply(
					"I'm a pet pictures bot, developed by PH-KDX. \n To view pictures of Patch, type pets!patch. \n To view pictures of Kissa, type pets!kissa. \n To test my connection speed, type pets!ping."
					);
			}
			//instance for if Kissa is requested
			if (text === "kissa") {
				//select random picture from kissafiles array, and concatenate with kissadir prefix
				let rand = kissadir.concat("/", kissafiles[Math.floor(Math.random() * kissafiles.length)]);
				//post message and picture
				message.reply("here's a KissaPic for you!", {files: [rand]});
			}
			//instance for if Patch is requested
			if (text === "patch") {
				//select random picture from patchfiles array, and concatenate with patchdir prefix
				let rand = patchdir.concat("/", patchfiles[Math.floor(Math.random() * patchfiles.length)]);
				//post message and picture
				message.reply("here's a PatchPic for you!", {files: [rand]});
			}
			//ping instance
			if (text === "ping") {
				message.channel.send(new Date().getTime() - message.createdTimestamp + " ms");
			}
			//test instance
			if (text === "test") {
				message.channel.send({embed: {
					color: 3447003,
					author: {
					  name: client.user.username,
					  icon_url: client.user.avatarURL
					},
					title: "PetPic commands:",
					description: "Here's a list of the commands I currently support:",
					fields: [
						{
							name: "Commands:",
							value: "testing"
						}
					],
					timestamp: new Date(),
					footer: {
					  icon_url: client.user.avatarURL,
					  text: "© Example"
					}
				  }
				});
			}
			//reset timeStart, as message has just been sent
			timeStart = new Date().getTime();    
		}
	} else {
		return;
	}
});

//login token

client.login(process.env.BOT_TOKEN);

//TODO
//host bot (check out VPS, perhaps?)
//upload to GitHub?
