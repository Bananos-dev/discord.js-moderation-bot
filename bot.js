const Discord = require("discord.js")
const { Permissions } = require('discord.js');
const config = require("./config.json")
const client = new Discord.Client({
    restTimeOffset: 0,
    allowedMentions: {
        parse: [],
        repliedUser: false,
    },
    partials: [ "MESSAGE", "CHANNEL", "REACTION"],
    intents: [
        //Uncomment these as you need!
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_BANS,
        //Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        //Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        //Discord.Intents.FLAGS.GUILD_WEBHOOKS,
        //Discord.Intents.FLAGS.GUILD_INVITES,
        //Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        //Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        //Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        //Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        //Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    ],
    presence: {
        activity: {
            name: "some valorant",
            type: "WATCHING", //You can also put "PLAYING" or "LISTENING" here!
            //url: "discord.com"
        },
        status: "online" //You can also use "idle", "dnd" or "offline"
    }
});

client.on("ready", () => {
    console.log("Loaded up!");
});

client.on("messageCreate", async (message) => {
    if(!message.guild || message.author.bot) return; 

    let { prefix } = config;
    let args = message.content.slice(prefix.length).trim().split(/ +/);
    let command = args.shift()?.toLowerCase();

    if(command && command.length > 0) {
        switch(command) {
            //If you want to add your own commands, just add the name in the case name, and place the code to be executed in the curly braces. The "ping" command serves as an example.
            case "ping": {
                message.reply(`Pong! Latency: \`\`${client.ws.ping}ms\`\``);
            }
            break;
            case "help": {
                const helpEmbed = new Discord.MessageEmbed()
                .setTitle(`${client.user.username}'s commands`)
                .setDescription(`**Prefix:** ${config.prefix}`)
                .addField(`\`ping\``, `Check your bot's ping`)
                .addField(`\`kick\``, `Usage: **${config.prefix}kick [@User]**\n**${config.prefix}kick [@User][Reason]**`)
                .addField(`\`ban\``, `Usage: **${config.prefix}ban [@User]**\n**${config.prefix}ban [@User][Reason]**`)
                .addField(`\`add\``, `Adds a role to a user \nUsage: **${config.prefix}add [@User] [Role]**`)
                .addField(`\`remove\``, `Removes a role from a user \nUsage: **${config.prefix}remove [@User] [Role]**`)
                .addField(`\`purge\``, `Clears a number of messages between 2 or 100 \nUsage: **${config.prefix}purge [number]**`)
                .addField(`\`rps\``, `Play rock paper scissors`)
                .addField(`\`say\``, `Have the bot say something`)
                
                message.reply({ embeds: [helpEmbed] })
            }
            break;
            case "kick": {
                let member = message.mentions.members.first();
                let reason = args.slice(1).join(/ +/);

                if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
                    return message.reply("Insufficient permissions (Requires permission `Kick members`)").then(msg => {
                        setTimeout(() => msg.delete(), 10000) //This will delete the message after 10 seconds.
                    }).catch; //The catch function is here to prevent the bot from crashing if deleting the message fails for some reason.
                }
                if (!member) {
                    return message.reply("Please mention a user you wish to kick!").then(msg => {
                        setTimeout(() => msg.delete(), 10000) //This will delete the message after 10 seconds.
                    }).catch; //The catch function is here to prevent the bot from crashing if deleting the message fails for some reason.
                }
                if (!member.kickable) {
                    return message.reply("This user cannot be kicked.").then(msg => {
                        setTimeout(() => msg.delete(), 10000) //This will delete the message after 10 seconds.
                    }).catch; //The catch function is here to prevent the bot from crashing if deleting the message fails for some reason.
                }

                //DM's the kicked user to notify them about their punishment. The "try" and "catch" functions are there to prevent the bot from crashing if it fails for some reason.
                try {
                    if(reason) {
                        await member.send(`**Punishment updated in ${message.guild.name}**\nYou have been kicked from ${message.guild.name} for:\n\`\`${reason}\`\``);
                    } else {
                        await member.send(`**Punishment updated in ${message.guild.name}**\nYou have been kicked from ${message.guild.name}.`);
                    }
                } catch(error) {
                    console.warn(error)
                }

                if (member) {
                    if (reason) {
                        member.kick().then(member => {
                            message.reply(`${member.user.tag} was kicked for \`\`${reason}\`\`.`);
                        })
                    }
                    else {
                        member.kick().then(member => {
                            message.reply(`${member.user.tag} was kicked.`);
                        })
                    }
                    
                }
            }
            break;
            case "ban": {
                let member = message.mentions.members.first();
                let reason = args.slice(1).join(/ +/);

                if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
                    return message.reply("Insufficient permissions (Requires permission `Ban members`)").then(msg => {
                        setTimeout(() => msg.delete(), 10000) //This will delete the message after 10 seconds.
                    }).catch; //The catch function is here to prevent the bot from crashing if deleting the message fails for some reason.
                }
                if (!member) {
                    return message.reply("Please mention a user you wish to ban!").then(msg => {
                        setTimeout(() => msg.delete(), 10000) //This will delete the message after 10 seconds.
                    }).catch; //The catch function is here to prevent the bot from crashing if deleting the message fails for some reason.
                }
                if (!member.bannable) {
                    return message.reply("This user cannot be banned.").then(msg => {
                        setTimeout(() => msg.delete(), 10000) //This will delete the message after 10 seconds.
                    }).catch; //The catch function is here to prevent the bot from crashing if deleting the message fails for some reason.
                }

                //DM's the kicked user to notify them about their punishment. The "try" and "catch" functions are there to prevent the bot from crashing if it fails for some reason.
                try {
                    if(reason) {
                        await member.send(`**Punishment updated in ${message.guild.name}**\nYou have been banned from ${message.guild.name} for:\n\`\`${reason}\`\``);
                    } else {
                        await member.send(`**Punishment updated in ${message.guild.name}**\nYou have been banned from ${message.guild.name}.`);
                    }
                } catch(error) {
                    console.warn(error)
                }

                if (member) {
                    if (reason) {
                        member.ban().then(member => {
                            message.reply(`${member.user.tag} was banned for \`\`${reason}\`\`.`);
                        });
                    }
                    else {
                        member.ban().then(member => {
                            message.reply(`${member.user.tag} was banned.`);
                        })
                    }
                    
                }
            }
            break;

            //NOTE: All commands below this comment were not updated or changed by me in any way other than making them fit into my new command handler. They were created by "diggadoodoo". I cannot guarantee them working properly.
            case "add": {
                if (!message.member.hasPermission('MANAGE_ROLES'))
            return message.channel.send("Insufficient permissions (Requires permission `Manage roles`)").then(msg => {
        msg.delete({ timeout: 30000 })
    })
        const member = message.mentions.members.first()
        if (!member)
            return message.channel.send("You have not mentioned a user").then(msg => {
        msg.delete({ timeout: 30000 })
    })
        const add = args.slice(1).join(" ")
        if (!add)
            return message.channel.send("You have not specified a role").then(msg => {
        msg.delete({ timeout: 30000 })
    })
        const roleAdd = message.guild.roles.cache.find(role => role.name === add)
        if (!roleAdd)
            return message.channel.send("This role does not exist").then(msg => {
        msg.delete({ timeout: 30000 })
    })
        if (member.roles.cache.get(roleAdd.id))
            return message.channel.send(`This user already has the ${add} role`).then(msg => {
        msg.delete({ timeout: 30000 })
    })
        member.roles.add(roleAdd.id).then((member) => {
            message.channel.send(`${add} added to ${member.displayName}`)
        })
    
            }
            break;
            case "remove": {
                if (!message.member.hasPermission('MANAGE_ROLES'))
                return message.channel.send("Insufficient permissions (Requires permission `Manage roles`)").then(msg => {
            msg.delete({ timeout: 30000 })
        })
            const member = message.mentions.members.first()
            if (!member)
                return message.channel.send("You have not mentioned a user").then(msg => {
            msg.delete({ timeout: 30000 })
        })
            const remove = args.slice(1).join(" ")
            if (!remove)
                return message.channel.send("You have not specified a role").then(msg => {
            msg.delete({ timeout: 30000 })
        })
            const roleRemove = message.guild.roles.cache.find(role => role.name === remove)
            if (!roleRemove)
                return message.channel.send("This role does not exist").then(msg => {
            msg.delete({ timeout: 30000 })
        })
            if (!member.roles.cache.get(roleRemove.id))
                return message.channel.send(`This user does not have the ${remove} role`).then(msg => {
            msg.delete({ timeout: 30000 })
        })
            member.roles.remove(roleRemove.id).then((member) => {
                message.channel.send(`${remove} removed from ${member.displayName}`)
            })
            }
            break;
            case "say": {
                const text = args.join(" ")
                if(!text) return message.channel.send("You have not specified something to say").then(msg => {
                    msg.delete({ timeout: 30000 })
                })
                message.channel.send(text)
            }
            break;
            case "purge": {
                if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Insufficient permissions (requires permission `Manage messages`)").then(msg => {
                    msg.delete({ timeout: 30000 })
                })
            }
            break;
            case "rps": {
                const options = [
                    "rock :shell: ",
                    "paper :newspaper2:",
                    "scissors :scissors: "
                ]
                const option = options[Math.floor(Math.random() * options.length)]
                message.channel.send(`You got ${option}`)
            }
            break;
            default: {
                message.reply("This command does not exist! Please check your spelling and try again.");
            }
        }
    }
});

client.login(config.token)
