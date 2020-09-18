
const Discord = require('discord.js'); 
const csvAppend = require('csv-append');
const {prefix, token} = require('./config.json');
const { OutgoingMessage } = require('http');
const RELATIVE_PATH_TO_HOMEWORK_CSV  = `./homeworkLog.csv`;
const RELATIVE_PATH_TO_DEV_CSV = `./developerInterest.csv`;
const client = new Discord.Client();
var startTime;
/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('CrossGradingBot has started!');
   startTime = Date.now();
});

client.on('message', message => {
    if(message.content === `${prefix}commands`) {
        message.channel.send('Current commands supported by CrossGradeBot are as follows:\n!submit: create a homework submission request fulfilled by CrossGradeBot using Discord DMs.\n!develop: Be added to a list of developers who are interested in working on CrossGradeBot.\n!botinfo: Display ownership and license information for CrossGradeBot.\n!commands: View list of available commands.\n!uptime: View how long the bot has been active in minutes.');
    }

    if(message.content === `${prefix}submit`) {
        message.member.send('Hello! If you would like to submit your homework assignment for the week, please upload a file using discord and specify the homework week in the upload comment using the following format (Ex. hw1, hw2, ...).');
        message.channel.send(`${message.member.user} created a submit homework request\nUser ID: ${message.member.id}`)
    }

    if(message.content === `${prefix}botinfo`) {
        message.channel.send(`CrossGradeBot is developed and maintained by Alex Plazas\nMIT License (MIT)\nCopyright (c) 2020\nlang: js`);
    }

    if(message.content === `${prefix}develop`) {
        const {append, end} = csvAppend.csvAppend(RELATIVE_PATH_TO_DEV_CSV);
        message.channel.send(`Thank you for adding your name to the development interest list ${message.author.username}!`);
        append([{username:message.author.username}]);
    }

    if(message.content === `${prefix}uptime`) {
        let currTime = Date.now()
        let elapsedMins = (currTime - startTime)/60000; 
        message.channel.send(`CrossGradeBot has been active for ${elapsedMins} minutes.`);
    }

    if(message.attachments.size > 0) {
        attachmentsObject = message.attachments.array()[0];
        
        if(message.content.includes('hw')) {
            if(attachmentsObject.name.endsWith('.jl')) {
                const {append, end} = csvAppend.csvAppend(RELATIVE_PATH_TO_HOMEWORK_CSV);
                message.author.send(`You have submitted ${message.content}. This message serves as confirmation of submission.\nThe link to your file can be found here: ${attachmentsObject.url}\nThank you ${message.author.username}!`);
                append([{username:message.author.username, link: attachmentsObject.url, hw:message.content}]);
            } else {
                message.author.send('You tried to submit a file without the .jl extension. Please try again using a homework file with the .jl extension.');
            }    
        } else {
            message.author.send('You did not specify a homework week in the file comment. Please re-submit your file along with a comment specifying the homework week (Ex. hw1, hw2, ...)');
        }
    }
    
});    


client.login(token);
// NzU1Mjc4MjI4MjY4MjUzMjc2.X2A9qg.NBZKTYpNwq3x4I03ERb572bHSeU
