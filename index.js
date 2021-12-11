// Discordフレームワーク読み込み
const Discord = require("discord.js");
const client = new Discord.Client({intents: Object.keys(Discord.Intents.FLAGS)});

// dotenv読み込み
require("dotenv").config();

// Date読み込み
require("date-utils");

// BOTプレフィックス宣言
const prefix = "fm!";

client.on("ready", () => {
  console.log(`ユーザー名 : ${client.user.tag} でログインが完了しました。\nユーザーID : ${client.user.id}`);
})

client.on("ready", async () => {
  const usshdata = {
    name: "user",
    description: "ユーザーの情報を表示します",
  };
  const svshdata = {
    name: "server",
    description: "サーバーの情報を表示します",
  };
  const chshdata ={
    name: "channel",
    description: "チャンネルの情報を表示します",
  };
  await client.application.commands.set([usshdata,svshdata,chshdata]);
  console.log(`すべてのスラッシュコマンドを作成しました。`);
})

client.on("messageCreate", async msg => {
  if (msg.content === "fm!ping") {
    msg.channel.send("Oreno PongPong!\nNightPool PashaPasha!");
  }
})

client.on("messageCreate", async msg => {
  if (msg.content === "fm!user") {
    const date = new Date(msg.author.createdTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD/ HH24:MI:SS");
    const jndate = new Date(msg.member.joinedTimestamp);
    const jndatestr = jndate.toFormat("YYYY/MM/DD/ HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle("ユーザー情報")
      .setThumbnail(msg.author.displayAvatarURL({format:"png"}))
      .setFooter(`${datestr}にアカウントが作成されました。`)
      .addField("ユーザー名", msg.author.username, true)
      .addField("ユーザータグ", msg.author.discriminator, true)
      .addField("ユーザーID", `${msg.author.id}`, true)
      .addField("サーバー参加日時", `${jndatestr}`, true)
      .setColor("#05E2FF")
    console.log(msg.author.avatarURL({format:"png"}));
    msg.channel.send({embeds:[embed]});
  }
})

client.on("messageCreate", async msg => {
  if (msg.content === "fm!server") {
    const date = new Date(msg.guild.createdTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD/ HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle("サーバー情報")
      .setThumbnail(msg.guild.iconURL({format:"png"}))
      .setFooter(`${datestr}にサーバーが作成されました。`)
      .addField("サーバー名", msg.guild.name, true)
      .addField("サーバーID", msg.guild.id, true)
      .addField("メンバー数", `${msg.guild.memberCount}`, true)
      .setColor("#05E2FF")
    console.log(msg.author.avatarURL({format:"png"}));
    msg.channel.send({embeds:[embed]});
  }
})

client.on("messageCreate", async msg => {
  if (msg.content === "fm!channel") {
    const date = new Date(msg.channel.createdTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD/ HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle("チャンネル情報")
      .setFooter(`${datestr}にチャンネルが作成されました。`)
      .addField("チャンネル名", msg.channel.name, true)
      .addField("チャンネルID", msg.channel.id, true)
      .addField("メッセージ数", `${msg.channel.messageCount}`, true)
      .addField("トピック", `${msg.channel.topic}`, true)
      .setColor("#05E2FF")
    console.log(msg.author.avatarURL({format:"png"}));
    await msg.channel.send({embeds:[embed]});
  }
})

client.on("messageCreate", async msg => {
  if (msg.content === "fm!exit") {
    const embed = new Discord.MessageEmbed()
    if(msg.author.id !== "524872647042007067"){
        embed.setAuthor("エラー", "https://cdn.discordapp.com/emojis/919045614724079687.png?size=96")
        embed.setDescription("あなたにはこのコマンドを実行する権限がありません。\nこのコマンドは一般利用者には実行できません。\n\nお困りですか？[サポートサーバーまでどうぞ！](https://discord.gg/VvrBsaq)")
        embed.addField("エラーコード", "FOR_BIDDEN", true)
        embed.setColor("#FA2911")
      await msg.channel.send({embeds:[embed]});
    }
    else if(msg.author.id === "524872647042007067"){
        embed.setAuthor("プロセス終了", "https://cdn.discordapp.com/emojis/919051457557327903.png?size=96")
        embed.setDescription(`${client.user.tag}のプロセスを終了します。`)
        embed.setColor("#05E2FF")
      await msg.channel.send({embeds:[embed]});
      process.exit();
    }
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

client.on("interactionCreate", async (inter) => {
  if(inter.commandName === "user"){
    const date = new Date(inter.user.createdTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD/ HH24:MI:SS");
    const jndate = new Date(inter.member.joinedTimestamp);
    const jndatestr = jndate.toFormat("YYYY/MM/DD/ HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle("ユーザー情報")
      .setThumbnail(inter.user.displayAvatarURL({format:"png"}))
      .setFooter(`${datestr}にアカウントが作成されました。`)
      .addField("ユーザー名", inter.user.username, true)
      .addField("ユーザータグ", inter.user.discriminator, true)
      .addField("ユーザーID", `${inter.user.id}`, true)
      .addField("サーバー参加日時", `${jndatestr}`, true)
      .setColor("#05E2FF")
    await inter.reply({embeds:[embed], ephemeral:false});
  }
  else if(inter.commandName === "server"){
    const date = new Date(inter.guild.createdTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD/ HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle("サーバー情報")
      .setThumbnail(inter.guild.iconURL({format:"png"}))
      .setFooter(`${datestr}にサーバーが作成されました。`)
      .addField("サーバー名", inter.guild.name, true)
      .addField("サーバーID", inter.guild.id, true)
      .addField("メンバー数", `${inter.guild.memberCount}`, true)
      .setColor("#05E2FF")
    await inter.reply({embeds:[embed], ephemeral:false});
  }
  else if(inter.commandName === "channel"){
    const date = new Date(inter.channel.createdTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD/ HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle("チャンネル情報")
      .setFooter(`${datestr}にチャンネルが作成されました。`)
      .addField("チャンネル名", inter.channel.name, true)
      .addField("チャンネルID", inter.channel.id, true)
      .addField("メッセージ数", `${inter.channel.messageCount}`, true)
      .addField("トピック", `${inter.channel.topic}`, true)
      .setColor("#05E2FF")
    await inter.reply({embeds:[embed], ephemeral:false});
  }
});

client.login(process.env.BOT_TOKEN) 
