// Discordフレームワーク読み込み
const Discord = require("discord.js");
const client = new Discord.Client({ intents: Object.keys(Discord.Intents.FLAGS) });

// dotenv読み込み
require("dotenv").config();

// Date読み込み
require("date-utils");

const { setTimeout } = require("timers/promises")

// BOTプレフィックス宣言
const prefix = "cu!";

client.on("ready", () => {
  console.log(`${new Date()}\nユーザー名 : ${client.user.tag} でログインが完了しました。\nユーザーID : ${client.user.id}`);
  client.user.setActivity("只今メンテナンス中です。動作が不安定になることがあります。", { type: "COMPETING" })
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
  const chshdata = {
    name: "channel",
    description: "チャンネルの情報を表示します",
  };
  const uscmdata = {
    type: "USER",
    name: "userinfo",
    description: "",
  };
  await client.application.commands.set([usshdata, svshdata, chshdata, uscmdata]);
  console.log(`すべてのアプリケーションコマンドを作成しました。`);
})

// Auto ThreadChannelJoin
client.on("threadCreate", (thre) => {
  console.log(`スレッドチャンネルの作成\nサーバー : ${thre.guild.name} / ${thre.guild.id}\nチャンネル : ${thre.name} / ${thre.id}`)
  if (!thre) {
    return
  }
  else {
    thre.join();
  }
});
/*
client.on("messageCreate", async msg => {
  if (msg.content === "cu!ping") {
    msg.channel.send("Oreno PongPong!\nNightPool PashaPasha!");
  }
})
*/

client.on("messageCreate", async msg => {
  if (msg.content === "cu!user") {
    const date = new Date(msg.author.createdTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
    const jndate = new Date(msg.member.joinedTimestamp);
    const jndatestr = jndate.toFormat("YYYY/MM/DD HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle("ユーザー情報")
      .setThumbnail(msg.author.displayAvatarURL({ format: "png" }))
      .setFooter({ text: `${datestr}にアカウントが作成されました。` })
      .addField("ユーザー名", msg.author.username, true)
      .addField("ユーザータグ", msg.author.discriminator, true)
      .addField("ユーザーID", `${msg.author.id}`, true)
      .addField("サーバー参加日時", `${jndatestr}`, true)
      .setColor("#05E2FF")
    console.log(msg.author.avatarURL({ format: "png" }));
    msg.channel.send({ embeds: [embed] });
  }
})

client.on("messageCreate", async msg => {
  if (msg.content === "cu!server") {
    const date = new Date(msg.guild.createdTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle("サーバー情報")
      .setThumbnail(msg.guild.iconURL({ format: "png" }))
      .setFooter({ text: `${datestr}にサーバーが作成されました。` })
      .addField("サーバー名", msg.guild.name, true)
      .addField("サーバーID", msg.guild.id, true)
      .addField("メンバー数", `${msg.guild.memberCount}`, true)
      .setColor("#05E2FF")
    console.log(msg.author.avatarURL({ format: "png" }));
    msg.channel.send({ embeds: [embed] });
  }
})

client.on("messageCreate", async msg => {
  if (msg.content === "cu!channel") {
    const date = new Date(msg.channel.createdTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle("チャンネル情報")
      .setFooter({ text: `${datestr}にチャンネルが作成されました。` })
      .addField("チャンネル名", msg.channel.name, true)
      .addField("チャンネルID", msg.channel.id, true)
      .addField("メッセージ数", `${msg.channel.messageCount}`, true)
      .addField("トピック", `${msg.channel.topic}`, true)
      .setColor("#05E2FF")
    console.log(msg.author.avatarURL({ format: "png" }));
    await msg.channel.send({ embeds: [embed] });
  }
})

/*
client.on("messageCreate", async msg => {
  if (msg.content === "!exit") {
    const embed = new Discord.MessageEmbed()
    if (msg.author.id !== "524872647042007067") {
      embed.setAuthor({ name: "エラー", iconURL: "https://cdn.discordapp.com/emojis/919045614724079687.png?size=96" })
      embed.setDescription("あなたにはこのコマンドを実行する権限がありません。\nこのコマンドは一般利用者には実行できません。\n\nお困りですか？[サポートサーバーまでどうぞ！](https://discord.gg/VvrBsaq)")
      embed.addField("エラーコード", "FOR_BIDDEN", true)
      embed.setColor("#EB3871")
      await msg.channel.send({ embeds: [embed] });
    }
    else if (msg.author.id === "524872647042007067") {
      embed.setAuthor({ name: "プロセス終了", iconURL: "https://cdn.discordapp.com/emojis/919051457557327903.png?size=96" })
      embed.setDescription(`${client.user.tag}のプロセスを終了します。`)
      embed.setColor("#08B1FF")
      await msg.channel.send({ embeds: [embed] });
      process.exit();
    }
  }
})
*/

client.on("messageCreate", async msg => {
  if (msg.content === "!myriad2") {
    const now = new Date();
    const datestr = now.toFormat("YYYY/MM/DD HH24:MI:SS");
    const myrtime = new Date();
    const myrtime2 = new Date();
    let gametype = "JPゲーム";
    let doniti = false;
    //now.setDate(24)
    //now.setHours(21);
    //now.setMinutes(30);
    //now.setSeconds(1);
    if(now.getDay() == 1){
      myrtime.setHours(20);
      myrtime.setMinutes(0);
      myrtime.setSeconds(0);
      //now.setHours(20);
      //now.setMinutes(0);
      //now.setSeconds(0);
      if(now.getTime() >= myrtime.getTime()){
        console.log("過ぎてる");
        myrtime.setDate(now.getDate()+1);
        myrtime.setHours(18);
        myrtime.setMinutes(0);
        myrtime.setSeconds(0);
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        gametype = "レース";
        console.log(datestr);
      }
      else{
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        gametype = "JPゲーム";
        console.log(datestr);
      }
    }
    else if(now.getDay() == 2){
      myrtime.setHours(18);
      myrtime.setMinutes(0);
      myrtime.setSeconds(0);
      //now.setHours(20);
      //now.setMinutes(0);
      //now.setSeconds(0);
      if(now.getTime() >= myrtime.getTime()){
        console.log("過ぎてる");
        myrtime.setDate(now.getDate()+1);
        myrtime.setHours(21);
        myrtime.setMinutes(0);
        myrtime.setSeconds(0);
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        gametype = "JPゲーム";
        console.log(datestr);
      }
      else{
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        console.log(datestr);
        gametype = "レース";
      }
    }
    else if(now.getDay() == 3){
      myrtime.setHours(21);
      myrtime.setMinutes(0);
      myrtime.setSeconds(0);
      //now.setHours(20);
      //now.setMinutes(0);
      //now.setSeconds(0);
      if(now.getTime() >= myrtime.getTime()){
        console.log("過ぎてる");
        myrtime.setDate(now.getDate()+1);
        myrtime.setHours(20);
        myrtime.setMinutes(0);
        myrtime.setSeconds(0);
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        gametype = "レース";
        console.log(datestr);
      }
      else{
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        gametype = "JPゲーム";
        console.log(datestr);
      }
    }
    else if(now.getDay() == 4){
      myrtime.setHours(20);
      myrtime.setMinutes(0);
      myrtime.setSeconds(0);
      //now.setHours(20);
      //now.setMinutes(0);
      //now.setSeconds(0);
      if(now.getTime() >= myrtime.getTime()){
        console.log("過ぎてる");
        myrtime.setDate(now.getDate()+1);
        myrtime.setHours(22);
        myrtime.setMinutes(0);
        myrtime.setSeconds(0);
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        gametype = "JPゲーム";
        console.log(datestr);
      }
      else{
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        gametype = "レース";
        console.log(datestr);
      }
    }
    else if(now.getDay() == 5){
      //myrtime.setDate(now.getDate());
      myrtime.setHours(22);
      myrtime.setMinutes(0);
      myrtime.setSeconds(0);
      //now.setHours(20);
      //now.setMinutes(0);
      //now.setSeconds(0);
      if(now.getTime() >= myrtime.getTime()){
        doniti = true;
        console.log("過ぎてる");
        myrtime.setDate(now.getDate()+1);
        myrtime.setHours(20);
        myrtime.setMinutes(0);
        myrtime.setSeconds(0);
        myrtime2.setDate(now.getDate()+1);
        myrtime2.setHours(20);
        myrtime2.setMinutes(30);
        myrtime2.setSeconds(0);
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        console.log(datestr);
      }
      else{
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        gametype = "JPゲーム";
        console.log(datestr);
      }
    }
    else if(now.getDay() == 6){
      //myrtime.setDate(now.getDate());
      //myrtime2.setDate(now.getDate());
      myrtime.setHours(20);
      myrtime.setMinutes(0);
      myrtime.setSeconds(0);
      myrtime2.setHours(20);
      myrtime2.setMinutes(30);
      myrtime2.setSeconds(0);
      //now.setHours(20);
      //now.setMinutes(0);
      //now.setSeconds(0);
      if(now.getTime() >= myrtime.getTime()){
        console.log("過ぎてる");
        doniti = true;
        myrtime.setDate(now.getDate()+1);
        myrtime.setHours(21);
        myrtime.setMinutes(0);
        myrtime.setSeconds(0);
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        console.log(datestr);
      }
      if(now.getTime() >= myrtime2.getTime()){
        console.log("過ぎてる");
        doniti = true;
        myrtime2.setDate(now.getDate()+1);
        myrtime2.setHours(21);
        myrtime2.setMinutes(30);
        myrtime2.setSeconds(0);
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        console.log(datestr);
      }
      else{
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        doniti = true;
        console.log(datestr);
      }
    }
    else if(now.getDay() == 0){
      //myrtime.setDate(now.getDate());
      //myrtime2.setDate(now.getDate());
      myrtime.setHours(21);
      myrtime.setMinutes(0);
      myrtime.setSeconds(0);
      myrtime2.setHours(21);
      myrtime2.setMinutes(30);
      myrtime2.setSeconds(0);
      //now.setHours(20);
      //now.setMinutes(0);
      //now.setSeconds(0);
      if(now.getTime() >= myrtime.getTime()){
        console.log("過ぎてる");
        myrtime.setDate(now.getDate()+1);
        myrtime.setHours(20);
        myrtime.setMinutes(0);
        myrtime.setSeconds(0);
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        console.log(datestr);
      }
      if(now.getTime() >= myrtime2.getTime()){
        console.log("過ぎてる");
        myrtime.setDate(now.getDate()+1);
        myrtime.setHours(20);
        myrtime.setMinutes(0);
        myrtime.setSeconds(0);
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        console.log(datestr);
      }
      else{
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        doniti = true;
        console.log(datestr);
      }
    }
    if(!doniti){
      await msg.channel.send(`次回は${myrtime.toFormat("YYYY年M月DD日 HH24時MI分")}にミリアド${gametype}が開催されます。\n\n開催まであと${Math.floor((myrtime.getTime()-now.getTime())/1000 / 3600)}時間${Math.floor((myrtime.getTime()-now.getTime())/1000 % 3600/60)}分${Math.floor((myrtime.getTime()-now.getTime())/1000 % 60)}秒です。`);
    }
    else{
      await msg.channel.send(`次回は${myrtime.toFormat("YYYY年M月DD日 HH24時MI分")}にミリアドJPゲーム、\n${myrtime2.toFormat("YYYY年M月DD日 HH24時MI分")}にミリアドレースが開催されます。\n\nミリアドJPゲーム開催まであと${Math.floor((myrtime.getTime()-now.getTime())/1000 / 3600)}時間${Math.floor((myrtime.getTime()-now.getTime())/1000 % 3600/60)}分${Math.floor((myrtime.getTime()-now.getTime())/1000 % 60)}秒、\nミリアドレース開催まであと${Math.floor((myrtime2.getTime()-now.getTime())/1000 / 3600)}時間${Math.floor((myrtime2.getTime()-now.getTime())/1000 % 3600/60)}分${Math.floor((myrtime2.getTime()-now.getTime())/1000 % 60)}秒です。`);
    }
  //  await msg.channel.send(`次回は${now}`);
  }
})

client.on("messageCreate", async msg => {
  if (msg.content.startsWith(prefix)) {
    try {
      const args = msg.content.trim().split(/ +/g);
      const cmd = args[0].slice(prefix.length);
      console.log(`引数 : ${args}`);
      console.log(`最初の引数 : ${cmd}`);
      if (cmd === "btn") {
        if (args[1] === "local") {
          const msgbtn1 = new Discord.MessageButton()
            .setCustomId("testBtn")
            .setStyle("PRIMARY")
            .setLabel("Click Me!!!")
          await msg.channel.send({ content: `このボタンを押してみてくださいっ！`, components: [new Discord.MessageActionRow().addComponents(msgbtn1)] });
        }
        if (!args[1]) {
          const msgbtn1 = new Discord.MessageButton()
            .setCustomId("testBtn2")
            .setStyle("PRIMARY")
            .setLabel("Click Me!!!")
          await msg.channel.send({ content: `このボタンを押してみてくださいっ！`, components: [new Discord.MessageActionRow().addComponents(msgbtn1)] });
        }
        else if (args[1] !== "local") {
          await msg.channel.send(`引数が不正です。`);
        }
      }
    }
    catch (error) {
      if (error.name !== "") {
        console.log(`${error.name} : ${error.message}`);
      }
    }
  }
});

client.on("interactionCreate", async (inter) => {
  if (inter.customId === "testBtn") {
    await inter.reply({ content: `${inter.user.username}さん、こんにちは！`, ephemeral: true });
  }
  if (inter.customId === "testBtn2") {
    await inter.reply({ content: `${inter.user.username}さん、こんにちは！`, ephemeral: false });
  }
});

client.on("interactionCreate", async (inter) => {
  if (inter.commandName === "user") {
    const date = new Date(inter.user.createdTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
    const jndate = new Date(inter.member.joinedTimestamp);
    const jndatestr = jndate.toFormat("YYYY/MM/DD HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle("ユーザー情報")
      .setThumbnail(inter.user.displayAvatarURL({ format: "png" }))
      .setFooter({ text: `${datestr}にアカウントが作成されました。` })
      .addField("ユーザー名", inter.user.username, true)
      .addField("ユーザータグ", inter.user.discriminator, true)
      .addField("ユーザーID", `${inter.user.id}`, true)
      .addField("サーバー参加日時", `${jndatestr}`, true)
      .setColor("#05E2FF")
    await inter.reply({ embeds: [embed], ephemeral: false });
  }
  else if (inter.commandName === "server") {
    const date = new Date(inter.guild.createdTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle("サーバー情報")
      .setThumbnail(inter.guild.iconURL({ format: "png" }))
      .setFooter({ text: `${datestr}にサーバーが作成されました。` })
      .addField("サーバー名", inter.guild.name, true)
      .addField("サーバーID", inter.guild.id, true)
      .addField("メンバー数", `${inter.guild.memberCount}`, true)
      .setColor("#05E2FF")
    await inter.reply({ embeds: [embed], ephemeral: false });
  }
  else if (inter.commandName === "channel") {
    const date = new Date(inter.channel.createdTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle("チャンネル情報")
      .setFooter({ text: `${datestr}にチャンネルが作成されました。` })
      .addField("チャンネル名", inter.channel.name, true)
      .addField("チャンネルID", inter.channel.id, true)
      .addField("メッセージ数", `${inter.channel.messageCount}`, true)
      .addField("トピック", `${inter.channel.topic}`, true)
      .setColor("#05E2FF")
    await inter.reply({ embeds: [embed], ephemeral: false });
  }
  else if (inter.commandName === "userinfo") {
    const date = new Date(inter.targetUser.createdTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
    const jndate = new Date(inter.targetMember.joinedTimestamp);
    const jndatestr = jndate.toFormat("YYYY/MM/DD HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle("ユーザー情報")
      .setThumbnail(inter.targetUser.displayAvatarURL({ format: "png" }))
      .setFooter({ text: `${datestr}にアカウントが作成されました。` })
      .addField("ユーザー名", inter.targetUser.username, true)
      .addField("ユーザータグ", inter.targetUser.discriminator, true)
      .addField("ユーザーID", `${inter.targetUser.id}`, true)
      .addField("サーバー参加日時", `${jndatestr}`, true)
      .setColor("#05E2FF")
    await inter.reply({ embeds: [embed], ephemeral: false });
  }
});

// ThinkingBoard
client.on("messageReactionAdd", (reaction, user) => {
  if (reaction.emoji.name === "\u{1f914}") {
    console.log(`シンキングリアクションの追加\nサーバー : ${reaction.message.guild}\nチャンネル : ${reaction.message.channel}\nユーザー : ${user.tag}\n---------------------`)
    // if(reaction.message.guildId === reaction.message.guild)
    if (reaction.message.guild.channels.cache.find((channel) => channel.name === "cu-thinking-board")) {
      const embed = new Discord.MessageEmbed()
        .setAuthor({ name: `${reaction.message.member.displayName}`, iconURL: reaction.message.author.displayAvatarURL({ format: "png" }) })
        .setDescription(`${reaction.message.content}\n\n---------------\n[Jump to message](${reaction.message.url})`)
        .setColor("#F5CE0F")
      reaction.message.guild.channels.cache.find((channel) => channel.name === "cu-thinking-board")
        .send({ content: `**ThinkingBoard**\n**TOTAL** : :thinking: **${reaction.count}**`, embeds: [embed] });
    }
    if (!reaction.message.guild.channels.cache.find((channel) => channel.name === "cu-thinking-board")) {
      console.log(`シンキングボードチャンネルが見つからなかったのでボードを生成できませんでした。`)
    }
  }
  else {
    console.log(`リアクションの追加\nサーバー : ${reaction.message.guild}\nチャンネル : ${reaction.message.channel}\nユーザー : ${user.tag}\nリアクション : ${reaction.emoji.name}\n---------------------`)
  }
});

// Audit Logs
// GuildScheduledEvent Logs
client.on("guildScheduledEventCreate", (event) => {
  console.log(`スケジュールイベントの作成\nサーバー : ${event.guild.name}\n作成者 : ${event.creator.username}`)
  if (event.guild.channels.cache.find((channel) => channel.name === "cu-audit-logs")) {
    let enttype = "他の場所";
    let desipt = "ここに説明文が入る";
    if (event.entityType === "VOICE") {
      enttype = `<#${event.channel.id}> / ${event.channel.id}\n#${event.channel.name} / ボイスCH`;
    }
    else if (event.entityType === "STAGE_INSTANCE") {
      enttype = `<#${event.channel.id}> / ${event.channel.id}\n#${event.channel.name} / ステージCH`;
    }
    else if (event.entityType === "EXTERNAL") {
      enttype = `${event.entityMetadata.location} / 他の場所`;
    }
    else if (event.entityType === "NONE") {
      enttype = "なし";
    }
    if (event.description.length <= 20) {
      desipt = `${event.description}`;
    }
    else if (event.description.length > 20) {
      desipt = `${event.description.substring(0, 20)}...`;
    }
    const date = new Date(event.scheduledStartTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
    const date2 = new Date(event.scheduledEndTimestamp);
    const datestr2 = date2.toFormat("YYYY/MM/DD HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle(`スケジュールイベントの作成`)
      // .setAuthor({name:`${reaction.message.member.displayName}`, iconURL: reaction.message.author.displayAvatarURL({ format:"png" })})
      // .setDescription(`${event.creator.username}\n\n---------------\n[Jump to message](${reaction.message.url})`)
      .setColor("#3CC761")
      .addField("イベント名", `${event.name} / ${event.id}`, true)
      .addField("説明", `${desipt}`, true)
      .addField("作成者", `${event.creator.tag} / ${event.creator.id}`)
      .addField("どこで行われる？", enttype)
      .addField("開始日時", datestr, true)
      .addField("終了日時", datestr2, true)
      .setTimestamp()
    event.guild.channels.cache.find((channel) => channel.name === "cu-audit-logs")
      .send({ embeds: [embed] });
  }
});

client.on("guildScheduledEventDelete", (event) => {
  console.log(`スケジュールイベントの削除\nサーバー : ${event.guild.name}\n作成者 : ${event.creator.username}`)
  if (event.guild.channels.cache.find((channel) => channel.name === "cu-audit-logs")) {
    let enttype = "他の場所";
    let desipt = "ここに説明文が入る";
    if (event.entityType === "VOICE") {
      enttype = `<#${event.channel.id}> / ${event.channel.id}\n#${event.channel.name} / ボイスCH`;
    }
    else if (event.entityType === "STAGE_INSTANCE") {
      enttype = `<#${event.channel.id}> / ${event.channel.id}\n#${event.channel.name} / ステージCH`;
    }
    else if (event.entityType === "EXTERNAL") {
      enttype = `${event.entityMetadata.location} / 他の場所`;
    }
    else if (event.entityType === "NONE") {
      enttype = "なし";
    }
    if (event.description.length <= 20) {
      desipt = `${event.description}`;
    }
    else if (event.description.length > 20) {
      desipt = `${event.description.substring(0, 20)}...`;
    }
    const date = new Date(event.scheduledStartTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
    const date2 = new Date(event.scheduledEndTimestamp);
    const datestr2 = date2.toFormat("YYYY/MM/DD HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle(`スケジュールイベントの削除`)
      // .setAuthor({name:`${reaction.message.member.displayName}`, iconURL: reaction.message.author.displayAvatarURL({ format:"png" })})
      // .setDescription(`${event.creator.username}\n\n---------------\n[Jump to message](${reaction.message.url})`)
      .setColor("#EB3871")
      .addField("イベント名", `${event.name} / ${event.id}`, true)
      .addField("説明", `${desipt}`, true)
      .addField("作成者", `${event.creator.tag} / ${event.creator.id}`)
      .addField("どこで行われる？", enttype)
      .addField("開始日時", datestr, true)
      .addField("終了日時", datestr2, true)
      .setTimestamp()
    event.guild.channels.cache.find((channel) => channel.name === "cu-audit-logs")
      .send({ embeds: [embed] });
  }
});

client.on("guildScheduledEventUpdate", (oldevent, event) => {
  console.log(`スケジュールイベントの変更\nサーバー : ${event.guild.name}\n作成者 : ${event.creator.username}`)
  if (event.guild.channels.cache.find((channel) => channel.name === "cu-audit-logs")) {
    let enttype = "他の場所";
    let desipt = "ここに説明文が入る";
    if (event.entityType === "VOICE") {
      enttype = `<#${event.channel.id}> / ${event.channel.id}\n#${event.channel.name} / ボイスCH`;
    }
    else if (event.entityType === "STAGE_INSTANCE") {
      enttype = `<#${event.channel.id}> / ${event.channel.id}\n#${event.channel.name} / ステージCH`;
    }
    else if (event.entityType === "EXTERNAL") {
      enttype = `${event.entityMetadata.location} / 他の場所`;
    }
    else if (event.entityType === "NONE") {
      enttype = "なし";
    }
    if (event.description.length <= 20) {
      desipt = `${event.description}`;
    }
    else if (event.description.length > 20) {
      desipt = `${event.description.substring(0, 20)}...`;
    }
    const date = new Date(event.scheduledStartTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
    const date2 = new Date(event.scheduledEndTimestamp);
    const datestr2 = date2.toFormat("YYYY/MM/DD HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle(`スケジュールイベントの変更`)
      // .setAuthor({name:`${reaction.message.member.displayName}`, iconURL: reaction.message.author.displayAvatarURL({ format:"png" })})
      .setDescription(`変更後の内容を表示します。`)
      .setColor("#08B1FF")
      .addField("イベント名", `${event.name} / ${event.id}`, true)
      .addField("説明", `${desipt}`, true)
      .addField("作成者", `${event.creator.tag} / ${event.creator.id}`)
      .addField("どこで行われる？", enttype)
      .addField("開始日時", datestr, true)
      .addField("終了日時", datestr2, true)
      .setTimestamp()
    event.guild.channels.cache.find((channel) => channel.name === "cu-audit-logs")
      .send({ embeds: [embed] });
  }
});

// Message Logs
client.on("messageDelete", (msg) => {
  console.log(`メッセージの削除\nサーバー : ${msg.guild.name}`)
  if (msg.guild.channels.cache.find((channel) => channel.name === "cu-audit-logs")) {
    if (msg.type === "DEFAULT" || msg.type === "REPLY") {
      let atch = "なし";
      let msgcont = "メッセージ";
      if (!msg.attachments.first()) {
        atch = "なし";
      }
      else if (msg.attachments.first()) {
        atch = `${msg.attachments.map(attach => `[${attach.name}](${attach.url})`)}`;
      }
      if (msg.content === "") {
        msgcont = "なし";
      }
      else if (msg.content !== "") {
        msgcont = `${msg.content}`;
      }
      const embed = new Discord.MessageEmbed()
        .setTitle(`メッセージの削除`)
        // .setAuthor({name:`${reaction.message.member.displayName}`, iconURL: reaction.message.author.displayAvatarURL({ format:"png" })})
        // .setDescription(`${event.creator.username}\n\n---------------\n[Jump to message](${reaction.message.url})`)
        .setColor("#EB3871")
        .addField("内容", msgcont)
        .addField("添付ファイル", atch)
        .addField("チャンネル", `<#${msg.channel.id}> / ${msg.channel.id}\n#${msg.channel.name}`)
        .addField("投稿者", `<@${msg.author.id}> / ${msg.author.id}\n@${msg.member.displayName}#${msg.author.discriminator}`, true)
        .setTimestamp()
      msg.guild.channels.cache.find((channel) => channel.name === "cu-audit-logs")
        .send({ embeds: [embed] });
    }
  }
});

client.on("messageUpdate", (oldmsg, msg) => {
  console.log(`メッセージの編集\nサーバー : ${msg.guild.name}`)
  if (msg.guild.channels.cache.find((channel) => channel.name === "cu-audit-logs")) {
    if (msg.type === "DEFAULT" || msg.type === "REPLY") {
      let atch = "なし";
      let msgcont = "メッセージ";
      let atch2 = "なし";
      let msgcont2 = "メッセージ";
      if (!msg.attachments.first()) {
        atch = "なし";
      }
      else if (msg.attachments.first()) {
        atch = `${msg.attachments.map(attach => `[${attach.name}](${attach.url})`)}`;
      }
      if (msg.content === "") {
        msgcont = "なし";
      }
      else if (msg.content !== "") {
        msgcont = `${msg.content}`;
      }
      if (!oldmsg.attachments.first()) {
        atch2 = "なし";
      }
      else if (oldmsg.attachments.first()) {
        atch2 = `${oldmsg.attachments.map(attach => `[${attach.name}](${attach.url})`)}`;
      }
      if (oldmsg.content === "") {
        msgcont2 = "なし";
      }
      else if (oldmsg.content !== "") {
        msgcont2 = `${oldmsg.content}`;
      }
      const embed = new Discord.MessageEmbed()
        .setTitle(`メッセージの編集`)
        // .setAuthor({name:`${reaction.message.member.displayName}`, iconURL: reaction.message.author.displayAvatarURL({ format:"png" })})
        .setDescription(`このメッセージに[ジャンプ](${msg.url})`)
        .setColor("#08B1FF")
        .addField("内容（変更前）", msgcont2)
        .addField("内容（変更後）", msgcont)
        .addField("添付ファイル（変更前）", atch2)
        .addField("添付ファイル（変更後）", atch)
        .addField("チャンネル", `<#${msg.channel.id}> / ${msg.channel.id}\n#${msg.channel.name}`)
        .addField("投稿者", `<@${msg.author.id}> / ${msg.author.id}\n@${msg.member.displayName}#${msg.author.discriminator}`, true)
        .setTimestamp()
      msg.guild.channels.cache.find((channel) => channel.name === "cu-audit-logs")
        .send({ embeds: [embed] });
    }
  }
});
// GuildMember Logs
// GuildMember Timeout Log
client.on("guildMemberUpdate", (oldmbr, mbr) => {
  if (mbr.guild.channels.cache.find((channel) => channel.name === "cu-audit-logs")) {
    if (!oldmbr.isCommunicationDisabled() && mbr.isCommunicationDisabled()) {
      const nowdate = new Date();
      const date = new Date(mbr.communicationDisabledUntilTimestamp);
      const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
      const timeoutmlSec = date - nowdate;
      const timeoutDay = parseInt(timeoutmlSec / 1000 / 60 / 60 / 24);
      const timeoutHour = parseInt(timeoutmlSec / 1000 / 60 / 60);
      const timeoutMin = parseInt(timeoutmlSec / 1000 / 60);
      const timeoutSec = parseInt(timeoutmlSec / 1000);
      const embed = new Discord.MessageEmbed()
        .setTitle(`メンバーのタイムアウト`)
        // .setAuthor({name:`${reaction.message.member.displayName}`, iconURL: reaction.message.author.displayAvatarURL({ format:"png" })})
        .setColor("#08B1FF")
        .addField("ターゲット", `<@${mbr.id}> / ${mbr.id}\n@${mbr.displayName}#${mbr.user.discriminator}`)
        .addField("期間", `${datestr} / ${timeoutDay}日${timeoutHour}時間${timeoutMin}分${timeoutSec}秒`)
        .setTimestamp()
      mbr.guild.channels.cache.find((channel) => channel.name === "cu-audit-logs")
        .send({ embeds: [embed] });
    }
    else if (oldmbr.isCommunicationDisabled() && !mbr.isCommunicationDisabled()) {
      const embed = new Discord.MessageEmbed()
        .setTitle(`メンバーのタイムアウトの解除`)
        // .setAuthor({name:`${reaction.message.member.displayName}`, iconURL: reaction.message.author.displayAvatarURL({ format:"png" })})
        .setColor("#08B1FF")
        .addField("ターゲット", `<@${mbr.id}> / ${mbr.id}\n@${mbr.displayName}#${mbr.user.discriminator}`)
        .setTimestamp()
      mbr.guild.channels.cache.find((channel) => channel.name === "cu-audit-logs")
        .send({ embeds: [embed] });
    }
  }
});

client.on("messageCreate", async msg => {
  var sendtime = Date.now();
  if (msg.content === "cu!ping") {
    var message = msg.channel.send("Pong!");
    var pongtime = Date.now();
    await setTimeout(1000);
    (await message).edit(`Pong!\n\nResponse : ${Date.now() - msg.createdTimestamp}ms\nWebSocket : ${client.ws.ping}ms`)
  }
})

client.on("messageCreate", async msg => {
  if (msg.content === "cu!exit") {
    const embed = new Discord.MessageEmbed()
    if (msg.author.id !== "524872647042007067") {
      embed.setAuthor({ name: "エラー", iconURL: "https://cdn.discordapp.com/emojis/919045614724079687.png?size=96" })
      embed.setDescription("あなたにはこのコマンドを実行する権限がありません。\nこのコマンドは一般利用者には実行できません。\n\nお困りですか？[サポートサーバーまでどうぞ！](https://discord.gg/VvrBsaq)")
      embed.addField("エラーコード", "FOR_BIDDEN", true)
      embed.setColor("#EB3871")
      await msg.channel.send({ embeds: [embed] });
    }
    else if (msg.author.id === "524872647042007067") {
      embed.setAuthor({ name: "プロセス終了", iconURL: "https://cdn.discordapp.com/emojis/919051457557327903.png?size=96" })
      embed.setDescription(`${client.user.tag}のプロセスを終了します。`)
      embed.setColor("#08B1FF")
      await msg.channel.send({ embeds: [embed] });
      process.exit();
    }
  }
})

client.on("messageCreate", async msg => {
  var sendtime = Date.now();
  if (msg.content.startsWith(prefix)) {
    try {
      const args = msg.content.trim().split(/ +/g);
      const cmd = args[0].slice(prefix.length);
      if (cmd === "rdsay") {
        if (args[1]) {
          let ct = 0;
          let rdmsg = "";
          while (ct < args[1].length) {
            var v1 = Math.floor(Math.random() * args[1].length);
            rdmsg += args[1][v1];
            ct += 1;
          }
          await msg.channel.send(`${rdmsg}`);
        }
        else {
          const rderrmsg = Math.ceil(Math.random() * 5);
          if (rderrmsg == 1) {
            await msg.reply("喋らせる言葉を引数に加えてください！！！！！！！！！！(´･_･`)");
          }
          else {
            await msg.reply("喋らせる言葉を引数に加えてください。");
          }
        }
      }
    }
    catch (error) {
      if (error.name !== "") {
        console.log(`${error.name} : ${error.message}`);
      }
    }
  }
})

let slot1 = "";
let slot2 = "";
let slot3 = "";
let playing = false;

client.on("messageCreate", async message => {
  if (message.content === "cu!slot") {
    if (!playing) {
      playing = true;
      slot1 = SlotEmoji();
      slot2 = SlotEmoji();
      slot3 = SlotEmoji();
      SlotSpEmoji();
      var msg = message.channel.send("SLOT START!");
      var pongtime = Date.now();
      await setTimeout(1500);
      (await msg).edit(`${slot1} :black_large_square: :black_large_square: `);
      await setTimeout(1000);
      (await msg).edit(`${slot1} :black_large_square: ${slot3} `);
      if (slot1 == slot3) {
        message.channel.send("REACH!!");
        await setTimeout(2000);
      }
      await setTimeout(1500);
      (await msg).edit(`${slot1} ${slot2} ${slot3} `);
      if (slot1 == slot2 && slot2 == slot3) {
        message.channel.send("**W I N !!!**");
      }
      else {
        message.channel.send("Play Again!");
      }
      if (slot1 == ":three:" && slot2 == ":three:" && slot3 == ":four:") {
        message.channel.send("なんでや！");
      }
      else if (slot1 == ":five:" && slot2 == ":one:" && slot3 == ":three:") {
        message.channel.send("あと「9」があればなぁ...");
      }
      else if (slot1 == "<:Cry:704139077162762280>" || slot2 == "<:Cry:704139077162762280>" || slot3 == "<:Cry:704139077162762280>") {
        message.channel.send("変なの出てて草");
      }
      playing = false;
    }
    else {
      message.channel.send("現在別のところでスロットが行われているため実行できません。\nしばらくしてからもう一度お試しください。");
    }
  }
})

function SlotEmoji() {
  const rdslot = Math.ceil(Math.random() * 9);
  if (rdslot == 1) {
    return ":one:";
  }
  else if (rdslot == 2) {
    return ":two:";
  }
  else if (rdslot == 3) {
    return ":three:";
  }
  else if (rdslot == 4) {
    return ":four:";
  }
  else if (rdslot == 5) {
    return ":five:";
  }
  else if (rdslot == 6) {
    return ":six:";
  }
  else if (rdslot == 7) {
    return ":seven:";
  }
  else if (rdslot == 8) {
    return ":eight:";
  }
  else if (rdslot == 9) {
    return ":nine:";
  }
}

function SlotSpEmoji() {
  const rdslot = Math.ceil(Math.random() * 40);
  if (rdslot == 40) {
    const rdslot2 = Math.ceil(Math.random() * 3);
    if (rdslot2 == 1) {
      slot1 = "<:Cry:704139077162762280>";
    }
    else if (rdslot2 == 2) {
      slot2 = "<:Cry:704139077162762280>";
    }
    else if (rdslot2 == 3) {
      slot3 = "<:Cry:704139077162762280>";
    }
  }
  else {
    return;
  }
}

let numgameplaying = false;
let numgamech = 0;
let numgameuser = 0;
let numgameres = 0;
let numgamecount = 0;
let numgametype = "100";
let numgamemax = "100";

client.on("messageCreate", async message => {
  if (message.content === "cu!num100") {
    if (!numgameplaying) {
      numgameplaying = true;
      message.channel.send("1～100までの数字を予想してください。");
      numgamech = message.channelId;
      numgameuser = message.author.id;
      numgameres = Math.ceil(Math.random() * 100);
      numgametype = "100";
    }
    else {
      message.reply("現在他のユーザーがナンバーゲームをプレイ中です。");
    }
  }
  if (message.author.id == numgameuser && message.channelId == numgamech && numgameplaying && numgametype == "100") {
    if (!isNaN(message.content.trim())) {
      if (parseInt(message.content.trim()) >= 1 && parseInt(message.content.trim()) <= 100) {
        if (numgameres < parseInt(message.content.trim())) {
          message.reply(`不正解！\n「${message.content.trim()}」より小さいです。`);
          numgamecount++;
        }
        else if (numgameres > parseInt(message.content.trim())) {
          message.reply(`不正解！\n「${message.content.trim()}」より大きいです。`);
          numgamecount++;
        }
        else if (numgameres == parseInt(message.content.trim())) {
          numgamecount++;
          message.reply(`正解！！\n正解は「${numgameres}」でした！\n${message.member.displayName}さんの挑戦数 : ${numgamecount}回`);
          numgameplaying = false;
          numgamech = 0;
          numgameuser = 0;
          numgameres = 0;
          numgamecount = 0;
        }
      }
      else {
        message.reply(`範囲外です。\n1～100までを入力してください。`);
      }
    }
    else {
      if (!message.content.startsWith(prefix)) {
        message.reply(`数字を入力してください。`);
      }
    }
  }
})

client.on("messageCreate", async message => {
  if (message.content.startsWith(prefix + "numgame")) {
    const skipstr = prefix + "numgame";
    numgamemax = message.content.substring(skipstr.length, message.content.length);
    if (!numgameplaying) {
      if (!isNaN(numgamemax)) {
        if (parseInt(numgamemax) >= 1 && parseInt(numgamemax) <= 400) {
          numgameplaying = true;
          message.channel.send(`1～${numgamemax}までの数字を予想してください。`);
          numgamech = message.channelId;
          numgameuser = message.author.id;
          numgameres = Math.ceil(Math.random() * parseInt(numgamemax));
          numgametype = "custom";
        }
        else{
          message.reply("カスタムナンバーゲームの作成に失敗しました。\n指定範囲は1～400にしてください。");
        }
      }
      else {
        message.reply("カスタムナンバーゲームの作成に失敗しました。\n\`rs!numgame\`に続く文字列を数字にしてください。");
      }
    }
    else {
      message.reply("現在他のユーザーがナンバーゲームをプレイ中です。");
    }
  }
  if (message.author.id == numgameuser && message.channelId == numgamech && numgameplaying && numgametype == "custom") {
    const skipstr = prefix + "numgame";
    //const numstr = message.content.substring(skipstr.length, message.content.length);
    if (!isNaN(message.content.trim())) {
      if (parseInt(message.content.trim()) >= 1 && parseInt(message.content.trim()) <= parseInt(numgamemax)) {
        if (numgameres < parseInt(message.content.trim())) {
          message.reply(`不正解！\n「${message.content.trim()}」より小さいです。`);
          numgamecount++;
        }
        else if (numgameres > parseInt(message.content.trim())) {
          message.reply(`不正解！\n「${message.content.trim()}」より大きいです。`);
          numgamecount++;
        }
        else if (numgameres == parseInt(message.content.trim())) {
          numgamecount++;
          message.reply(`正解！！\n正解は「${numgameres}」でした！\n${message.member.displayName}さんの挑戦数 : ${numgamecount}回`);
          numgameplaying = false;
          numgamech = 0;
          numgameuser = 0;
          numgameres = 0;
          numgamecount = 0;
        }
      }
      else {
        message.reply(`範囲外です。\n1～${numgamemax}までを入力してください。`);
      }
    }
    else {
      if (!message.content.startsWith(prefix)) {
        message.reply(`数字を入力してください。`);
      }
    }
  }
})

client.login(process.env.BOT_TOKEN)