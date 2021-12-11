// Discordフレームワーク読み込み
const Discord = require("discord.js");
const client = new Discord.Client({intents: Object.keys(Discord.Intents.FLAGS)});

// dotenv読み込み
require("dotenv").config();

// BOTプレフィックス宣言
const prefix = "fm!";

client.on("ready", () => {
  console.log(`ユーザー名 : ${client.user.tag} でログインが完了しました。\nユーザーID : ${client.user.id}`);
})

client.on("messageCreate", async msg => {
  if (msg.content === "fm!ping") {
    msg.channel.send("Oreno PongPong!\nNightPool PashaPasha!");
  }
})

client.on("messageCreate", async msg => {
  if (msg.content === "fm!user") {
    const embed = new Discord.MessageEmbed()
      .setTitle("ユーザー情報")
      .setThumbnail(msg.author.avatarURL({format:"png"}))
      .setFooter(`<t:${msg.author.createdTimestamp}>にアカウントが作成されました。`)
      .addField("ユーザー名", msg.author.username, true)
      .addField("ユーザータグ", msg.author.discriminator, true)
      .addField("ユーザーID", `${msg.author.id}`, true)
      .addField("サーバー参加日時", `<t:${msg.guild.joinedTimestamp}>`, true)
    console.log(msg.author.avatarURL({format:"png"}));
    msg.channel.send({embeds:[embed]});
  }
})

client.on("messageCreate", async msg => {
  if (msg.content === "fm!server") {
    const embed = new Discord.MessageEmbed()
      .setTitle("サーバー情報")
      .setThumbnail(msg.guild.iconURL({format:"png"}))
      .setFooter(`<t:${msg.guild.createdTimestamp}>にサーバーが作成されました。`)
      .addField("サーバー名", msg.guild.name, true)
      .addField("サーバーID", msg.guild.id, true)
      .addField("メンバー数", `${msg.guild.memberCount}`, true)
    console.log(msg.author.avatarURL({format:"png"}));
    msg.channel.send({embeds:[embed]});
  }
})

client.on("messageCreate", async msg => {
  if (msg.content === "fm!channel") {
    const embed = new Discord.MessageEmbed()
      .setTitle("チャンネル情報")
      .setFooter(`<t:${msg.channel.createdTimestamp}>にチャンネルが作成されました。`)
      .addField("チャンネル名", msg.channel.name, true)
      .addField("チャンネルID", msg.channel.id, true)
      .addField("メッセージ数", `${msg.channel.messageCount}`, true)
      .addField("トピック", `${msg.channel.topic}`, true)
    console.log(msg.author.avatarURL({format:"png"}));
    msg.channel.send({embeds:[embed]});
  }
})

client.on("messageCreate", async msg => {
  if (msg.content.startsWith(prefix)) {
  try{
    const args = msg.content.trim().split(/ +/g);
    const cmd = args[0].slice(prefix.length);
    console.log(`引数 : ${args}`);
    console.log(`最初の引数 : ${cmd}`);
    if(cmd === "btn"){
    if(args[1] === "local"){
      const msgbtn1 = new Discord.MessageButton()
        .setCustomId("testBtn")
        .setStyle("PRIMARY")
        .setLabel("Click Me!!!")
      await msg.channel.send({content:`このボタンを押してみてくださいっ！`, components:[new Discord.MessageActionRow().addComponents(msgbtn1)]});
    }
    if(!args[1]){
      const msgbtn1 = new Discord.MessageButton()
        .setCustomId("testBtn2")
        .setStyle("PRIMARY")
        .setLabel("Click Me!!!")
      await msg.channel.send({content:`このボタンを押してみてくださいっ！`, components:[new Discord.MessageActionRow().addComponents(msgbtn1)]});
    }
    else if(args[1] !== "local"){
      await msg.channel.send(`引数が不正です。`);
    }
    }
  }
  catch(error){
    if(error.name !== ""){
      console.log(`${error.name} : ${error.message}`);
    }
  }
  }
});

client.on("interactionCreate", async (inter) => {
  if(inter.customId === "testBtn"){
    await inter.reply({content:`${inter.user.username}さん、こんにちは！`, ephemeral:true});
  }
  if(inter.customId === "testBtn2"){
    await inter.reply({content:`${inter.user.username}さん、こんにちは！`, ephemeral:false});
  }
});

client.login(process.env.BOT_TOKEN) 
