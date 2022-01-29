// Discordフレームワーク読み込み
const Discord = require("discord.js");
const client = new Discord.Client({ intents: Object.keys(Discord.Intents.FLAGS) });

// dotenv読み込み
require("dotenv").config();

// Date読み込み
require("date-utils");

// BOTプレフィックス宣言
const prefix = "fm!";

client.on("ready", () => {
  console.log(`ユーザー名 : ${client.user.tag} でログインが完了しました。\nユーザーID : ${client.user.id}`);
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
  await client.application.commands.set([usshdata, svshdata, chshdata]);
  console.log(`すべてのスラッシュコマンドを作成しました。`);
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

client.on("messageCreate", async msg => {
  if (msg.content === "fm!ping") {
    msg.channel.send("Oreno PongPong!\nNightPool PashaPasha!");
  }
})

client.on("messageCreate", async msg => {
  if (msg.content === "fm!user") {
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
  if (msg.content === "fm!server") {
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
  if (msg.content === "fm!channel") {
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

client.on("messageCreate", async msg => {
  if (msg.content === "fm!exit") {
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
      if(!msg.attachments.first()){
        atch = "なし";
      }
      else if(msg.attachments.first()){
        atch = `${msg.attachments.map(attach => `[${attach.name}](${attach.url})`)}`;
      }
      if(msg.content === ""){
        msgcont = "なし";
      }
      else if(msg.content !== ""){
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
        .addField("投稿者", `<@${msg.author.id}> / ${msg.author.id}\n${msg.author.tag}`, true)
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
      if(!msg.attachments.first()){
        atch = "なし";
      }
      else if(msg.attachments.first()){
        atch = `${msg.attachments.map(attach => `[${attach.name}](${attach.url})`)}`;
      }
      if(msg.content === ""){
        msgcont = "なし";
      }
      else if(msg.content !== ""){
        msgcont = `${msg.content}`;
      }
      if(!oldmsg.attachments.first()){
        atch2 = "なし";
      }
      else if(oldmsg.attachments.first()){
        atch2 = `${oldmsg.attachments.map(attach => `[${attach.name}](${attach.url})`)}`;
      }
      if(oldmsg.content === ""){
        msgcont2 = "なし";
      }
      else if(oldmsg.content !== ""){
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
        .addField("投稿者", `<@${msg.author.id}> / ${msg.author.id}\n${msg.author.tag}`, true)
        .setTimestamp()
      msg.guild.channels.cache.find((channel) => channel.name === "cu-audit-logs")
        .send({ embeds: [embed] });
    }
  }
});

client.login(process.env.BOT_TOKEN)