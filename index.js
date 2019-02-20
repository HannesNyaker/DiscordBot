const botconfig = require ("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client();

bot.login(botconfig.token);

const options = ['🇦','🇧','🇨','🇩','🇪','🇫','🇬','🇭','🇮','🇯','🇰','🇱','🇲','🇳','🇴','🇵','🇶','🇷','🇸','🇹','🇺','🇻','🇼','🇽','🇾','🇿',];

bot.on("message", async message => {
    //ignores any message from the bot itself and direct messages from anyone
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    //the prefix is "!" (see botconfig.json)
    let prefix = botconfig.prefix;
    //splits the messageArray every time a space occurs
    let messageArray = message.content.split(" ");
    //command is in the first slice, after the prefix
    let cmd = messageArray[0];
    //args is the message after the command (after the first space)
    let args = messageArray.slice(1);

    //commandlist command (shows every single bot command available
    if (cmd === `${prefix}commands`){
        let commandsembed = new Discord.RichEmbed()
            .setTitle("Command List")
            .setDescription("Here's a list of everything you can tell me to do :)")
            .setColor("#009900")
            .addField("!hello","say hello to me!")
            .addField("!botinfo", "info about me")
            .addField("!serverinfo", "info about this server")
            .addField("!roll", "roll a random number between 1 and 100")
            .addField("!poll", 'create a poll by typing: !poll "Question" "Optional answer A" "Optional answer B" "And so on..."');
        return message.channel.send(commandsembed);
    }

    //checks what command is entered, if it's "hello" the bot will reply
    if (cmd === `${prefix}hello`){
        return message.channel.send("Hello!");
    }

    //botinfo command
    if (cmd === `${prefix}botinfo`){
        let bicon = bot.user.displayAvatarURL;
        let botembed = new Discord.RichEmbed()
            .setDescription("Here is some info about me!")
            .setColor("#009900")
            .setThumbnail(bicon)
            .addField("Bot Name", bot.user.username)
            .addField("Created by", message.guild.owner); //tells that server owner is the creator of the bot, since it's used on my own server
        return message.channel.send(botembed);
    }

    //serverinfo command
    if (cmd === `${prefix}serverinfo`){
        let sicon = message.guild.iconURL;
        let serverembed = new Discord.RichEmbed()
            .setDescription("Server Info")
            .setColor("#009900")
            .setThumbnail(sicon)
            .addField("Server Name", message.guild.name)
            .addField("Created On", message.guild.createdAt)
            .addField("Total Members", message.guild.memberCount)
            .addField("You Joined", message.member.joinedAt);
        return message.channel.send(serverembed);
    }

    //rolls a number ranging from 1 to 100
    if (cmd === `${prefix}roll`){
        var roll = Math.floor(Math.random() *100)+1;
        message.channel.send(`${message.author.username}` + " rolled " + roll + " out of 100");
    }

    //poll command
    if (cmd === `${prefix}poll`){
        //Permission verification
        if (!message.member.hasPermission("ADMINISTRATOR")){
            return message.channel.send("This requires the permission: ADMINISTRATOR");
        }

        let args = message.content.match(/"(.+?)"/g);
        if (args.length === 1){
            const question = args[0].replace(/"/g, '');
            const pollembed = new Discord.RichEmbed()
                .setColor("#009900")
                .setFooter("React to vote!")
                .setDescription(`Poll created by ${message.author.username}`)
                .setTitle(question);

            let msg = await message.channel.send(pollembed);

            //Using discord reactions to vote in the poll
            await msg.react("✅");
            await msg.react("⛔");
        } else {
            args = args.map(a => a.replace(/"/g, ''));
            const question = args[0];
            const nOptions = args.length -1;

            //line between options to make it clearer
            const line = "--------------------";
            const pollembed = new Discord.RichEmbed()
                .setColor("#009900")
                .setFooter("React to vote!")
                .setDescription(`Poll created by ${message.author.username}`)
                .setTitle(question)
                for (let i = 0; i < nOptions; i++) {
                    pollembed.addField(options[i] + " " + args[i+1], line)
                }

            let msg = await message.channel.send(pollembed);
            
            //Using discord reactions to vote in the poll
            for (let i = 0; i < nOptions; i++) {
                await msg.react(options[i]);
            }
        }
        //deletes the command message after 1 second
        message.delete({timeout: 1000});
    }
});

//Prints ready when bot goes online
bot.on("ready", function(){
    console.log(`${bot.user.username} is up and running!`);
    //Sets the bot's discord status as "Watching Netflix!"
    bot.user.setActivity("Netflix", {type: "WATCHING"});
});