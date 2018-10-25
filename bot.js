const Discord = require("discord.js");
const tokens = require('./tokens.json');
const bot = new Discord.Client();
const colors = require('colors');
const fs = require('fs');


bot.on("ready", () => {
    console.log(`Ready to serve in ${bot.channels.size} channels on ${bot.guilds.size} servers, for a total of ${bot.users.size} users.`.yellow);
});

let points = JSON.parse(fs.readFileSync('levelcount.json', 'utf8'));
bot.on("message", msg => {
    if (msg.author.bot) return;
    if (!points[msg.author.id]) {
        points[msg.author.id] = {
            exp: 0,
            exptotal: 0,
            level: 1,
            hp: 15,
            att: 3,
            spd: 4,
            rep: 0,
            wins: 0,
            losses: 0,
            notice: 1,
            noticed: 0,
            fight: 0
        };
    }
    if (msg.content.length > 200) {
        points[msg.author.id].exp = points[msg.author.id].exp + Math.floor((msg.content.length / 20));
        points[msg.author.id].exptotal = points[msg.author.id].exptotal + Math.floor((msg.content.length / 20));
    } else {
        points[msg.author.id].exp = points[msg.author.id].exp + Math.floor((msg.content.length / 5));
        points[msg.author.id].exptotal = points[msg.author.id].exptotal + Math.floor((msg.content.length / 5));
    }
    if (points[msg.author.id].noticed >= 0 && points[msg.author.id].noticed <= 4) {
        if (points[msg.author.id].rep >= 50 && points[msg.author.id].rep < 100 && points[msg.author.id].noticed === 0) {
            msg.reply("you currently have 50 rep, if you want to spend them to gain 5 hp type: *!spend 50*");
            points[msg.author.id].noticed = 1;
        } else if (points[msg.author.id].rep >= 100 && points[msg.author.id].rep < 250 && points[msg.author.id].noticed === 1) {
            msg.reply("you currently have 100 rep, if you want to spend them to gain 10 hp and 2 attack type: *!spend 50*");
            points[msg.author.id].noticed = 2;
        } else if (points[msg.author.id].rep >= 250 && points[msg.author.id].rep < 500 && points[msg.author.id].noticed === 2) {
            msg.reply("you currently have 250 rep, if you want to spend them to gain 20 hp and 4 attack and 3 speed type: *!spend 50*");
            points[msg.author.id].noticed = 3;
        } else if (points[msg.author.id].rep >= 500 && points[msg.author.id].rep < 1000 && points[msg.author.id].noticed === 3) {
            msg.reply("you currently have 500 rep, if you want to spend them to gain 45 hp and 10 attack and 8 speed type: *!spend 50*");
            points[msg.author.id].noticed = 4;
        } else if (points[msg.author.id].rep >= 1000 && points[msg.author.id].noticed === 4) {
            msg.reply("you currently have 1000 rep, if you want to spend them to gain 100 hp and 25 attack and 20 speed type: *!spend 50*");
            points[msg.author.id].noticed = 5;
        }
    }
    levelup = (points[msg.author.id].level * 20);
    if (points[msg.author.id].exp >= levelup) {
        let thisuser = points[msg.author.id];
        exprest = thisuser.exp - levelup;
        thisuser.exp = 0 + exprest;
        thisuser.level = thisuser.level + 1;
        thisuser.fight = 0;
        thisuser.notice = thisuser.notice + 1;
        if (thisuser.notice === 5) {
            thisuser.notice = 0;
            msg.channel.sendMessage(msg.author + " you have reached level: " + thisuser.level);
        }
        switch (Math.floor((Math.random() * 10) + 1)) {
            case 1:
                hp = 8;
                break;
            case 2:
                hp = 7;
                break;
            case 3:
                hp = 7;
                break;
            case 4:
                hp = 7;
                break;
            default:
                hp = 6;
        }
        switch (Math.floor((Math.random() * 10) + 1)) {
            case 1:
                attack = 3;
                break;
            case 2:
                attack = 2;
                break;
            case 3:
                attack = 2;
                break;
            case 4:
                attack = 2;
                break;
            default:
                attack = 1;
        }
        switch (Math.floor((Math.random() * 10) + 1)) {
            case 1:
                speed = 3;
                break;
            case 2:
                speed = 2;
                break;
            case 3:
                speed = 2;
                break;
            case 4:
                speed = 2;
                break;
            default:
                speed = 1;
        }
        thisuser.hp = thisuser.hp + hp
        thisuser.att = thisuser.att + attack
        thisuser.spd = thisuser.spd + speed
    }
    json = JSON.stringify(points, null, "\t");
    fs.writeFileSync('levelcount.json', json, 'utf8');
    let prefix = "!";
    if (!msg.content.startsWith(prefix)) return;
    if (msg.content.toLowerCase().startsWith(prefix + "level")) {
        if (msg.mentions.users.size === 0) {
            let thisuser = points[msg.author.id];
            const embed = new Discord.RichEmbed()
                .setAuthor(msg.author.username + "#" + msg.author.discriminator, msg.author.avatarURL)
                .setColor('#0A599F')
                .setTimestamp()
                .addField('level:', `${thisuser.level}`, true)
                .addField('experience:', `${thisuser.exp}`, true)
                .addField('exptotal:', `${thisuser.exptotal}`, true)
                .addField('reputation:', `${thisuser.rep}`, true)
                .addField('wins:', `${thisuser.wins}`, true)
                .addField('losses:', `${thisuser.losses}`, true)
                .addField('health points:', `${thisuser.hp}`, true)
                .addField('attack:', `${thisuser.att}`, true)
                .addField('speed:', `${thisuser.spd}`, true)
            msg.channel.sendEmbed(embed, {
                disableEveryone: true
            });
            return;
        }
        if (!points[msg.mentions.users.first().id]) {
            points[msg.mentions.users.first().id] = {
                exp: 0,
                exptotal: 0,
                level: 1,
                hp: 15,
                att: 3,
                spd: 4,
                rep: 0,
                wins: 0,
                losses: 0,
                notice: 1,
                noticed: 0,
                fight: 0
            };
        }
        let thatuser = points[msg.mentions.users.first().id];
        const embed = new Discord.RichEmbed()
            .setAuthor(msg.mentions.users.first().username + "#" + msg.mentions.users.first().discriminator, msg.mentions.users.first().avatarURL)
            .setColor('#0A599F')
            .setTimestamp()
            .addField('level:', `${thatuser.level}`, true)
            .addField('experience:', `${thatuser.exp}`, true)
            .addField('exptotal:', `${thatuser.exptotal}`, true)
            .addField('reputation:', `${thatuser.rep}`, true)
            .addField('wins:', `${thatuser.wins}`, true)
            .addField('losses:', `${thatuser.losses}`, true)
            .addField('health points:', `${thatuser.hp}`, true)
            .addField('attack:', `${thatuser.att}`, true)
            .addField('speed:', `${thatuser.spd}`, true)
        msg.channel.sendEmbed(embed, {
            disableEveryone: true
        });
    }
    if (msg.content.toLowerCase().startsWith(prefix + "rep")) {
        msg.reply("you can spend an amount of rep you have to gain stats by typing !spend amount, example: *!spend 50*, the amounts you can spend are: 50, 100, 250, 500 and 1000" +
            "\nthe amount of stats you gain will depend on how much you spend, the more you spend the more you gain." +
            "\nspend 50 rep to permanently gain 5 hp" +
            "\nspend 100 rep to permanently gain 10 hp and 2 attack" +
            "\nspend 250 rep to permanently gain 20 hp and 4 attack and 3 speed" +
            "\nspend 500 rep to permanently gain 45 hp and 10 attack and 8 speed" +
            "\nspend 1000 rep to permanently gain 100 hp, 25 attack and 20 speed");
    }
    if (msg.content.toLowerCase().startsWith(prefix + "spend")) {
        let thisuser = points[msg.author.id];
        let number1 = msg.content.split(" ").slice(1, 2).join(" ");
        let isnumber = isNaN(number1);
        if (isnumber === true) {
            msg.reply("please insert a number, *example: !spend 100*");
            return;
        }
        let number = Number(number1);
        if (thisuser.rep < 50 || thisuser.rep < number) {
            msg.reply("you do not have enough rep to spend")
            return;
        }
        if (number === 50 || number === 100 || number === 250 || number === 500 || number === 1000) {
            knowhp = thisuser.hp;
            knowatt = thisuser.att;
            knowspd = thisuser.spd;
            thisuser.rep = thisuser.rep - msg.content.split(" ").slice(1, 2).join(" ");
            switch (number) {
                case 50:
                    thisuser.hp = thisuser.hp + 5;
                    break;
                case 100:
                    thisuser.hp = thisuser.hp + 10;
                    thisuser.att = thisuser.att + 2;
                    break;
                case 250:
                    thisuser.hp = thisuser.hp + 20;
                    thisuser.att = thisuser.att + 4;
                    thisuser.spd = thisuser.spd + 3;
                    break;
                case 500:
                    thisuser.hp = thisuser.hp + 45;
                    thisuser.att = thisuser.att + 10;
                    thisuser.spd = thisuser.spd + 8;
                    break;
                default:
                    thisuser.hp = thisuser.hp + 100;
                    thisuser.att = thisuser.att + 25;
                    thisuser.spd = thisuser.spd + 20;
            }
            knowhp = thisuser.hp - knowhp;
            knowatt = thisuser.att - knowatt;
            knowspd = thisuser.spd - knowspd;
            msg.reply("you have spent: " + number + " rep, and you have gained" +
                "\nhp: " + knowhp +
                "\nattack: " + knowatt +
                "\nspeed: " + knowspd);
            thisuser.noticed = 0;
        } else {
            msg.reply("please choose one of the following amount of rep to spend: 50, 100, 250, 500 or 1000");
        }
    }
    if (msg.content.toLowerCase().startsWith(prefix + "fight")) {
        if (msg.mentions.users.size === 0) {
            msg.reply("pls mention someone to fight!");
            return;
        }
        if (!points[msg.mentions.users.first().id]) {
            points[msg.mentions.users.first().id] = {
                exp: 0,
                exptotal: 0,
                level: 1,
                hp: 15,
                att: 3,
                spd: 4,
                rep: 0,
                wins: 0,
                losses: 0,
                notice: 1,
                noticed: 0,
                fight: 0
            };
        }
        if (msg.author.id === msg.mentions.users.first().id) {
            msg.reply("no i won't let you lose against yourself dummy");
            return;
        }
        let thisuser = points[msg.author.id];
        let thatuser = points[msg.mentions.users.first().id];
        fightable = Math.floor(thisuser.level / 2);
        if (thisuser.fight === fightable) {
            msg.reply("you have reached the fight limit, the fight limit depends on your level");
            return;
        }
        if (thisuser.level <= 10 || thatuser.level <= 10) {
            tobig = thisuser.level + 5;
            tolow = thisuser.level - 5;
        } else if ((thisuser.level <= 20 && thisuser.level > 10) || (thatuser.level > 10 && thatuser.level <= 20)) {
            tobig = thisuser.level + 10;
            tolow = thisuser.level - 10;
        } else if ((thisuser.level <= 40 && thisuser.level > 20) || (thatuser.level > 20 && thatuser.level <= 40)) {
            tobig = thisuser.level + 15;
            tolow = thisuser.level - 15;
        } else {
            tobig = thisuser.level + 25;
            tolow = thisuser.level - 25;
        }
        if (thisuser.level === 1 || thatuser.level === 1) {
            msg.reply("you can't fight if you or the person you want to fight is level 1");
            return;
        }
        if (tobig < thatuser.level || tolow > thatuser.level) {
            msg.reply("level difference to high");
            return;
        }
        thisuserreset = thisuser.hp;
        thatuserreset = thatuser.hp;
        if (thisuser.spd > thatuser.spd) {
            while ((thisuser.hp > 0) || (thatuser.hp > 0)) {
                switch (Math.floor((Math.random() * 3) + 1)) {
                    case 1:
                        thatuser.hp = thatuser.hp - (thisuser.att - 1);
                        break;
                    case 2:
                        thatuser.hp = thatuser.hp - thisuser.att;
                        break;
                    default:
                        thatuser.hp = thatuser.hp - (thisuser.att + 1);
                }
                if (thatuser.hp <= 0) {
                    break;
                }
                switch (Math.floor((Math.random() * 3) + 1)) {
                    case 1:
                        thisuser.hp = thisuser.hp - (thatuser.att - 1);
                        break;
                    case 2:
                        thisuser.hp = thisuser.hp - thatuser.att;
                        break;
                    default:
                        thisuser.hp = thisuser.hp - (thatuser.att + 1);
                }
                if (thisuser.hp <= 0) {
                    break;
                }
            }
        } else if (thisuser.spd < thatuser.spd) {
            while ((thisuser.hp > 0) || (thatuser.hp > 0)) {
                switch (Math.floor((Math.random() * 3) + 1)) {
                    case 1:
                        thisuser.hp = thisuser.hp - (thatuser.att - 1);
                        break;
                    case 2:
                        thisuser.hp = thisuser.hp - thatuser.att;
                        break;
                    default:
                        thisuser.hp = thisuser.hp - (thatuser.att + 1);
                }
                if (thisuser.hp <= 0) {
                    break;
                }
                switch (Math.floor((Math.random() * 3) + 1)) {
                    case 1:
                        thatuser.hp = thatuser.hp - (thisuser.att - 1);
                        break;
                    case 2:
                        thatuser.hp = thatuser.hp - thisuser.att;
                        break;
                    default:
                        thatuser.hp = thatuser.hp - (thisuser.att + 1);
                }
                if (thatuser.hp <= 0) {
                    break;
                }
            }
        } else {
            msg.reply("can't fight if same speed (gotta fix so that you can fight)");
        }
        if (thisuser.hp <= 0) {
            remaininghp = thatuser.hp;
            thisuser.hp = thisuserreset;
            thatuser.hp = thatuserreset;
            gainedexp = thatuser.exp;
            gainedrep = thatuser.rep;
            lostrep = thisuser.rep;
            if (thatuser.level > thisuser.level) {
                thatuser.exp = thatuser.exp + (10 + (thatuser.level * 2) - (thatuser.level - thisuser.level));
                thatuser.rep = thatuser.rep + (10 - (thatuser.level - thisuser.level));
                thisuser.rep = thisuser.rep - (10 + (thisuser.level - thatuser.level));
                thatuser.exptotal = thatuser.exptotal + (10 + (thatuser.level * 2) - (thatuser.level - thisuser.level));
            } else if (thatuser.level < thisuser.level) {
                thatuser.exp = thatuser.exp + (10 + (thatuser.level * 2) + (thatuser.level - thisuser.level));
                thatuser.rep = thatuser.rep + (10 - (thatuser.level - thisuser.level));
                thisuser.rep = thisuser.rep - (10 - (thisuser.level - thatuser.level));
                thatuser.exptotal = thatuser.exptotal + (10 + (thatuser.level * 2) + (thatuser.level - thisuser.level));
            } else {
                thatuser.exp = thatuser.exp + 10 + (thatuser.level * 2);
                thatuser.rep = thatuser.rep + 10;
                thisuser.rep = thisuser.rep - 10;
                thatuser.exptotal = thatuser.exptotal + 10 + (thatuser.level * 2);
            }
            thatuser.wins = thatuser.wins + 1;
            thisuser.losses = thisuser.losses + 1;
            gainedexp = thatuser.exp - gainedexp;
            gainedrep = thatuser.rep - gainedrep;
            lostrep = thisuser.rep - lostrep;
            msg.channel.sendMessage(msg.author + " vs " + msg.mentions.users.first() +
                "\n" + msg.mentions.users.first() + " has won the battle with " + remaininghp + " hp remaining" +
                "\n" + msg.mentions.users.first() + " has gained: " + gainedexp + " exp and: " + gainedrep + " rep." +
                "\nsadly, " + msg.author + " lost: " + lostrep + " rep.");
        } else if (thatuser.hp <= 0) {
            remaininghp = thisuser.hp;
            thisuser.hp = thisuserreset;
            thatuser.hp = thatuserreset;
            gainedexp = thisuser.exp;
            gainedrep = thisuser.rep;
            lostrep = thatuser.rep;
            if (thisuser.level > thatuser.level) {
                thisuser.exp = thisuser.exp + (10 + (thisuser.level * 2) - (thisuser.level - thatuser.level));
                thisuser.rep = thisuser.rep + (10 - (thisuser.level - thatuser.level));
                thatuser.rep = thatuser.rep - (10 + (thatuser.level - thisuser.level));
                thisuser.exptotal = thisuser.exptotal + (10 + (thisuser.level * 2) - (thisuser.level - thatuser.level));
            } else if (thisuser.level < thatuser.level) {
                thisuser.exp = thisuser.exp + (10 + (thisuser.level * 2) + (thisuser.level - thatuser.level));
                thisuser.rep = thisuser.rep + (10 - (thisuser.level - thatuser.level));
                thatuser.rep = thatuser.rep - (10 - (thatuser.level - thisuser.level));
                thisuser.exptotal = thisuser.exptotal + (10 + (thisuser.level * 2) + (thisuser.level - thatuser.level));
            } else {
                thisuser.exp = thisuser.exp + 10 + (thisuser.level * 2);
                thisuser.rep = thisuser.rep + 10;
                thatuser.rep = thatuser.rep - 10;
                thisuser.exptotal = thisuser.exptotal + 10 + (thisuser.level * 2);
            }
            thisuser.wins = thisuser.wins + 1;
            thatuser.losses = thatuser.losses + 1;
            gainedexp = thisuser.exp - gainedexp;
            gainedrep = thisuser.rep - gainedrep;
            lostrep = thatuser.rep - lostrep;
            msg.channel.sendMessage(msg.author + " vs " + msg.mentions.users.first() +
                "\n" + msg.author + " has won the battle with " + remaininghp + " hp remaining" +
                "\n" + msg.author + " has gained: " + gainedexp + " exp and: " + gainedrep + " rep." +
                "\nsadly, " + msg.mentions.users.first() + " lost: " + lostrep + " rep.");
        }
        thisuser.fight = thisuser.fight + 1;
    }
});


bot.login(tokens.d_token);
