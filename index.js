// Discordフレームワーク読み込み
const Discord = require("discord.js");
const client = new Discord.Client({ intents: Object.keys(Discord.Intents.FLAGS), partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER'] });

// dotenv読み込み
require("dotenv").config();

// Date読み込み
require("date-utils");

const { setTimeout } = require("timers/promises")

// データ保存システム読み込み
const Keyv = require("keyv");

const svmccdiv = new Keyv("sqlite://sqlite.db", { table: "svmccdiv" });
const svsccdiv = new Keyv("sqlite://sqlite.db", { table: "svsccdiv" });
const svpprccdiv = new Keyv("sqlite://sqlite.db");
svmccdiv.on("error", err => console.log("Keyv error:", err));
svsccdiv.on("error", err => console.log("Keyv error:", err));
svpprccdiv.on("error", err => console.log("Keyv error:", err));

const puppeteer = require("puppeteer");

const path = require("path");

const vercompslib = require("./data/ver_comps");
const vercomps = vercompslib[path.basename(__filename).replace(".js", "")];
console.log(path.basename(__filename));

// BOTプレフィックス宣言
const prefix = vercomps.prefix;

// 必要変数
let slot1 = "";
let slot2 = "";
let slot3 = "";
let playing = false;

let numgameplaying = false;
let numgamech = 0;
let numgameuser = 0;
let numgameres = 0;
let numgamecount = 0;
let numgametype = "100";
let numgamemax = "100";

let coinstock = 1000;

let browser;
let page;
let page2;
let page3;
let pupterrcount = 0;

(async () => {

  try {
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disabled-setuid-sandbox'] });
    // page = await browser.newPage();

    // await page.goto("https://pnr2.patolesoft.net/bbs.html", { waitUntil: "networkidle2" });
    // page2 = await browser.newPage();
    page3 = await browser.newPage();
    //await browser.close();
  }
  catch (err) {
    pupterrcount++;
    console.log("puppeteer起動エラー");
    if (pupterrcount > 3) {
      console.log("puppeteer起動エラー。プロセスを終了します");
      process.exit();
    }
  }
})();

client.on("ready", async () => {
  console.log(`${[await client.guilds.cache.map((guilds) => guilds.name + " : " + guilds.id)]}`);
  console.log(`${new Date()}\nユーザー名 : ${client.user.tag} でログインが完了しました。\nユーザーID : ${client.user.id}`);
  client.user.setActivity(vercomps.playgameMsg, { type: "PLAYING" })
})
/*
puppeteer.launch({ args: ['--no-sandbox', '--disabled-setuid-sandbox']}).then(async browser => {
  const page = await browser.newPage();
  await page.goto("https://pnr2.patolesoft.net/bbs.html",{waitUntil:"networkidle2"});
  var item = await page.$$("body > #thread > div > div > div > div > .card-header");
  var data = await (await item[0].getProperty('textContent')).jsonValue();
  console.log(data);
  browser.close();
});
*/

client.on("ready", async () => {
  const usshdata = {
    name: "user",
    description: "ユーザーの情報を表示します",
    options: [{
      type: "STRING",
      name: "userid",
      description: "情報を表示するユーザーのID、またはユーザーメンション",
    }]
  };
  const svshdata = {
    name: "server",
    description: "サーバーの情報を表示します",
    options: [{
      type: "STRING",
      name: "serverid",
      description: "情報を表示するサーバーのID",
    }]
  };
  const chshdata = {
    name: "channel",
    description: "チャンネルの情報を表示します",
    options: [{
      type: "STRING",
      name: "channelid",
      description: "情報を表示するチャンネルのID、またはチャンネルメンション",
    }]
  };
  const uscmdata = {
    type: "USER",
    name: "userinfo",
    description: "",
  };
  const testtodo = {
    name: "testtodo",
    description: "テストのTODOリスト",
  };
  await client.application.commands.set([usshdata, svshdata, chshdata, uscmdata]);
  await client.application.commands.set([], "666188622575173652");
  console.log(`すべてのアプリケーションコマンドを作成しました。`);
  //console.log(await svpprccdiv.get("pprmccdiv"));
  //console.log(await svpprccdiv.get("pprsccdiv"));
})

// Auto ThreadChannelJoin
client.on("threadCreate", (thre) => {
  console.log(`スレッドチャンネルの作成\nサーバー : ${thre.guild.name} / ${thre.guild.id}\nチャンネル : ${thre.name} / ${thre.id}`)
  if (!thre) {
    return;
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
  if (msg.content === "cu!help") {
    msg.channel.send(`Code-Urayasuの使い方
Prefixは \`cu!\`

コマンド編

\`!myriad2\` : PNR2の次回のミリアド時刻・相対時刻を表示します

\`cu!user\` : ユーザー情報を表示します
\`cu!server\` : サーバー情報を表示します
\`cu!channel\` : チャンネル情報を表示します
\`cu!ping\` : 通信速度を表示します


その他
\`cu-thinking-board\` というチャンネルを作成すると、サーバー内でシンキングリアクションがされたときにそのチャンネルでボードが表示されます。
\`cu-audit-logs\` というチャンネルを作成すると、サーバー内で何か行動をしたときに監査ログとしてそのチャンネルにメッセージが送信されます。

お問い合わせは naoyuki#5883 まで。`);
  }

  if (msg.content === "cu!user") {
    const date = new Date(msg.author.createdTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
    const jndate = new Date(msg.member.joinedTimestamp);
    const jndatestr = jndate.toFormat("YYYY/MM/DD HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle("ユーザー情報")
      .setThumbnail(msg.author.displayAvatarURL({ format: "png" }))
      .setFooter({ text: `${datestr}にアカウントが作成されました。` })
      .addFields({ name: "ユーザー名", value: msg.author.username, inline: true })
      .addFields({ name: "ユーザータグ", value: msg.author.discriminator, inline: true })
      .addFields({ name: "ユーザーID", value: `${msg.author.id}`, inline: true })
      .addFields({ name: "サーバー参加日時", value: `${jndatestr}`, inline: true })
      .setColor("#05E2FF")
    console.log(msg.author.avatarURL({ format: "png" }));
    msg.channel.send({ embeds: [embed] });
  }

  if (msg.content === "cu!server") {
    const date = new Date(msg.guild.createdTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle("サーバー情報")
      .setThumbnail(msg.guild.iconURL({ format: "png" }))
      .setFooter({ text: `${datestr}にサーバーが作成されました。` })
      .addFields({ name: "サーバー名", value: msg.guild.name, inline: true })
      .addFields({ name: "サーバーID", value: msg.guild.id, inline: true })
      .addFields({ name: "メンバー数", value: `${msg.guild.memberCount}`, inline: true })
      .setColor("#05E2FF")
    console.log(msg.author.avatarURL({ format: "png" }));
    msg.channel.send({ embeds: [embed] });
  }

  if (msg.content === "cu!channel") {
    const date = new Date(msg.channel.createdTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle("チャンネル情報")
      .setFooter({ text: `${datestr}にチャンネルが作成されました。` })
      .addFields({ name: "チャンネル名", value: msg.channel.name, inline: true })
      .addFields({ name: "チャンネルID", value: msg.channel.id, inline: true })
      .addFields({ name: "メッセージ数", value: `${msg.channel.messageCount}`, inline: true })
      .addFields({ name: "トピック", value: `${msg.channel.topic}`, inline: true })
      .setColor("#05E2FF")
    console.log(msg.author.avatarURL({ format: "png" }));
    await msg.channel.send({ embeds: [embed] });
  }

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
    if (now.getDay() == 1) {
      myrtime.setHours(20);
      myrtime.setMinutes(0);
      myrtime.setSeconds(0);
      //now.setHours(20);
      //now.setMinutes(0);
      //now.setSeconds(0);
      if (now.getTime() >= myrtime.getTime()) {
        console.log("過ぎてる");
        myrtime.setDate(now.getDate() + 1);
        myrtime.setHours(18);
        myrtime.setMinutes(0);
        myrtime.setSeconds(0);
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        gametype = "レース";
        console.log(datestr);
      }
      else {
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        gametype = "JPゲーム";
        console.log(datestr);
      }
    }
    else if (now.getDay() == 2) {
      myrtime.setHours(18);
      myrtime.setMinutes(0);
      myrtime.setSeconds(0);
      //now.setHours(20);
      //now.setMinutes(0);
      //now.setSeconds(0);
      if (now.getTime() >= myrtime.getTime()) {
        console.log("過ぎてる");
        myrtime.setDate(now.getDate() + 1);
        myrtime.setHours(21);
        myrtime.setMinutes(0);
        myrtime.setSeconds(0);
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        gametype = "JPゲーム";
        console.log(datestr);
      }
      else {
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        console.log(datestr);
        gametype = "レース";
      }
    }
    else if (now.getDay() == 3) {
      myrtime.setHours(21);
      myrtime.setMinutes(0);
      myrtime.setSeconds(0);
      //now.setHours(20);
      //now.setMinutes(0);
      //now.setSeconds(0);
      if (now.getTime() >= myrtime.getTime()) {
        console.log("過ぎてる");
        myrtime.setDate(now.getDate() + 1);
        myrtime.setHours(20);
        myrtime.setMinutes(0);
        myrtime.setSeconds(0);
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        gametype = "レース";
        console.log(datestr);
      }
      else {
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        gametype = "JPゲーム";
        console.log(datestr);
      }
    }
    else if (now.getDay() == 4) {
      myrtime.setHours(20);
      myrtime.setMinutes(0);
      myrtime.setSeconds(0);
      //now.setHours(20);
      //now.setMinutes(0);
      //now.setSeconds(0);
      if (now.getTime() >= myrtime.getTime()) {
        console.log("過ぎてる");
        myrtime.setDate(now.getDate() + 1);
        myrtime.setHours(22);
        myrtime.setMinutes(0);
        myrtime.setSeconds(0);
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        gametype = "JPゲーム";
        console.log(datestr);
      }
      else {
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        gametype = "レース";
        console.log(datestr);
      }
    }
    else if (now.getDay() == 5) {
      //myrtime.setDate(now.getDate());
      myrtime.setHours(22);
      myrtime.setMinutes(0);
      myrtime.setSeconds(0);
      //now.setHours(20);
      //now.setMinutes(0);
      //now.setSeconds(0);
      if (now.getTime() >= myrtime.getTime()) {
        doniti = true;
        console.log("過ぎてる");
        myrtime.setDate(now.getDate() + 1);
        myrtime.setHours(20);
        myrtime.setMinutes(0);
        myrtime.setSeconds(0);
        myrtime2.setDate(now.getDate() + 1);
        myrtime2.setHours(20);
        myrtime2.setMinutes(30);
        myrtime2.setSeconds(0);
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        console.log(datestr);
      }
      else {
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        gametype = "JPゲーム";
        console.log(datestr);
      }
    }
    else if (now.getDay() == 6) {
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
      if (now.getTime() >= myrtime.getTime()) {
        console.log("過ぎてる");
        doniti = true;
        myrtime.setDate(now.getDate() + 1);
        myrtime.setHours(21);
        myrtime.setMinutes(0);
        myrtime.setSeconds(0);
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        console.log(datestr);
      }
      if (now.getTime() >= myrtime2.getTime()) {
        console.log("過ぎてる");
        doniti = true;
        myrtime2.setDate(now.getDate() + 1);
        myrtime2.setHours(21);
        myrtime2.setMinutes(30);
        myrtime2.setSeconds(0);
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        console.log(datestr);
      }
      else {
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        doniti = true;
        console.log(datestr);
      }
    }
    else if (now.getDay() == 0) {
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
      if (now.getTime() >= myrtime.getTime()) {
        console.log("過ぎてる");
        myrtime.setDate(now.getDate() + 1);
        myrtime.setHours(20);
        myrtime.setMinutes(0);
        myrtime.setSeconds(0);
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        console.log(datestr);
      }
      if (now.getTime() >= myrtime2.getTime()) {
        console.log("過ぎてる");
        myrtime.setDate(now.getDate() + 1);
        myrtime.setHours(20);
        myrtime.setMinutes(0);
        myrtime.setSeconds(0);
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        console.log(datestr);
      }
      else {
        const datestr = myrtime.toFormat("YYYY/MM/DD HH24:MI:SS");
        doniti = true;
        console.log(datestr);
      }
    }
    if (!doniti) {
      await msg.channel.send(`次回は${myrtime.toFormat("YYYY年M月DD日 HH24時MI分")}にミリアド${gametype}が開催されます。\n\n開催まであと${Math.floor((myrtime.getTime() - now.getTime()) / 1000 / 3600)}時間${Math.floor((myrtime.getTime() - now.getTime()) / 1000 % 3600 / 60)}分${Math.floor((myrtime.getTime() - now.getTime()) / 1000 % 60)}秒です。`);
    }
    else {
      await msg.channel.send(`次回は${myrtime.toFormat("YYYY年M月DD日 HH24時MI分")}にミリアドJPゲーム、\n${myrtime2.toFormat("YYYY年M月DD日 HH24時MI分")}にミリアドレースが開催されます。\n\nミリアドJPゲーム開催まであと${Math.floor((myrtime.getTime() - now.getTime()) / 1000 / 3600)}時間${Math.floor((myrtime.getTime() - now.getTime()) / 1000 % 3600 / 60)}分${Math.floor((myrtime.getTime() - now.getTime()) / 1000 % 60)}秒、\nミリアドレース開催まであと${Math.floor((myrtime2.getTime() - now.getTime()) / 1000 / 3600)}時間${Math.floor((myrtime2.getTime() - now.getTime()) / 1000 % 3600 / 60)}分${Math.floor((myrtime2.getTime() - now.getTime()) / 1000 % 60)}秒です。`);
    }
    //  await msg.channel.send(`次回は${now}`);
  }

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

      else if (cmd === "scrshot") {
        if ((msg.author.id == 524872647042007067 || msg.author.id == 692980438729228329) && msg.guild.id == 666188622575173652) {
          let scratch;
          const embed = new Discord.MessageEmbed()
            .setTitle("ページのスクリーンショット")
            .setDescription("撮影中です...");
          let fmsg = await msg.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
          await page3.goto(args[1], { waitUntil: "networkidle2" });
          await page3.screenshot()
            .then(data => scratch = new Discord.MessageAttachment(data, "screenshot.png"))
          const nembed = new Discord.MessageEmbed()
            .setTitle("ページのスクリーンショット")
            .setDescription(`${args[1]}`)
            .setImage("attachment://screenshot.png");
          fmsg.edit({ embeds: [nembed], files: [scratch] });
          //page.close();
          var pages = await browser.pages();
          console.log(pages.length);
          //});
        }
        else {
          const embed = new Discord.MessageEmbed();
          embed.setAuthor({ name: "エラー", iconURL: "https://cdn.discordapp.com/emojis/919045614724079687.png?size=96" })
          embed.setDescription("あなたにはこのコマンドを実行する権限がありません。\n利用権限が付与されていないか、\nご利用のサーバーでは利用できません。\n\nお困りですか？[サポートサーバーまでどうぞ！](https://discord.gg/VvrBsaq)")
          embed.addFields({ name: "エラーコード", value: "FOR_BIDDEN", inline: true })
          embed.setColor("#EB3871")
          await msg.channel.send({ embeds: [embed] });
        }
      }
    }
    catch (error) {
      if (error.name !== "") {
        console.log(`${error.name} : ${error.message}\n${error.stack}`);
        // await msg.channel.send(`エラーが発生しました。\n解決できない場合はスクショを撮って[サポートサーバー](https://discord.gg/VvrBsaq)までご連絡ください。\n\`\`\`${error.name} : ${error.message}\`\`\``);
        const embed = new Discord.MessageEmbed()
        embed.setAuthor({ name: "エラー", iconURL: "https://cdn.discordapp.com/emojis/919045614724079687.png?size=96" })
        embed.setDescription(`エラーが発生しました。\n解決できない場合はスクショを撮って[サポートサーバー](https://discord.gg/VvrBsaq)までご連絡ください。\n\`\`\`${error.name} : ${error.message}\n${error.stack}\`\`\``)
        embed.addFields({ name: "エラーコード", value: "CODE_ERROR", inline: true })
        embed.setColor("#FC0341")
        await msg.channel.send({ embeds: [embed] });
      }
    }
  }

  var sendtime = Date.now();
  if (msg.content === "cu!ping") {
    var pongmsg = msg.channel.send("Pong!");
    var pongtime = Date.now();
    await setTimeout(1000);
    (await pongmsg).edit(`Pong!\n\nResponse : ${pongtime - msg.createdTimestamp}ms\nWebSocket : ${client.ws.ping}ms`)
  }

  if (msg.content === "cu!exit") {
    const embed = new Discord.MessageEmbed()
    if (msg.author.id !== "524872647042007067" && msg.author.id !== "692980438729228329") {
      embed.setAuthor({ name: "エラー", iconURL: "https://cdn.discordapp.com/emojis/919045614724079687.png?size=96" })
      embed.setDescription("あなたにはこのコマンドを実行する権限がありません。\nこのコマンドは一般利用者には実行できません。\n\nお困りですか？[サポートサーバーまでどうぞ！](https://discord.gg/VvrBsaq)")
      embed.addFields({ name: "エラーコード", value: "FOR_BIDDEN", inline: true })
      embed.setColor("#EB3871")
      await msg.channel.send({ embeds: [embed] });
    }
    else if (msg.author.id === "524872647042007067" || msg.author.id === "692980438729228329") {
      embed.setAuthor({ name: "プロセス終了", iconURL: "https://cdn.discordapp.com/emojis/919051457557327903.png?size=96" })
      embed.setDescription(`${client.user.tag}のプロセスを終了します。`)
      embed.setColor("#08B1FF")
      await msg.channel.send({ embeds: [embed] });
      process.exit();
    }
  }

  var sendtime = Date.now();

  // NGW不具合報告メッセージ
  if (msg.content === "cu!bugreportbtn") {
    if ((msg.author.id == 524872647042007067 || msg.author.id == 692980438729228329) && msg.guild.id == 666188622575173652) {
      const acrow = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId("bugreportbtn")
            .setLabel("不具合報告をする")
            .setStyle('PRIMARY'),
          new Discord.MessageButton()
            .setCustomId("howbugreport")
            .setLabel("書き方を確認")
            .setStyle('SECONDARY'),
        );
      await msg.channel.send({ content: "【不具合報告へのご協力ありがとうございます】\n下の「不具合報告をする」より、表示されたモーダルに必要事項を記入して送信してください。\n\n__**※このシステムはベータ版であり、今後仕様を変更する場合があります。**__", components: [acrow] });
    }
    else {
      const embed = new Discord.MessageEmbed();
      embed.setAuthor({ name: "エラー", iconURL: "https://cdn.discordapp.com/emojis/919045614724079687.png?size=96" })
      embed.setDescription("あなたにはこのコマンドを実行する権限がありません。\n利用権限が付与されていないか、\nご利用のサーバーでは利用できません。\n\nお困りですか？[サポートサーバーまでどうぞ！](https://discord.gg/VvrBsaq)")
      embed.addFields({ name: "エラーコード", value: "FOR_BIDDEN", inline: true })
      embed.setColor("#EB3871")
      await msg.channel.send({ embeds: [embed] });
    }
  }
  if (msg.content === "cu!delerrmsg") {
    if ((msg.author.id == 524872647042007067 || msg.author.id == 692980438729228329)) {

      var fetmsg = await msg.channel.messages.fetch({ limit: 7, before: 993046115580645446 });
      var fil = fetmsg.filter(m => m.author.id == 754190285382352920);
      msg.channel.bulkDelete(fil);
      //var succmsg = await msg.channel.send("完了");
      //setTimeout(2000);
      //succmsg.delete();
    }
  }
  if (msg.content === "cu!bugreportbtndev") {
    if ((msg.author.id == 524872647042007067 || msg.author.id == 692980438729228329) && msg.guild.id == 666188622575173652) {
      const acrow = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId("bugreportbtndev")
            .setLabel("不具合報告をする")
            .setStyle('PRIMARY'),
          new Discord.MessageButton()
            .setCustomId("howbugreport")
            .setLabel("書き方を確認")
            .setStyle('SECONDARY'),
        );
      await msg.channel.send({ content: "【不具合報告へのご協力ありがとうございます】\n下の「不具合報告をする」より、表示されたモーダルに必要事項を記入して送信してください。\n\n__**※このシステムはベータ版であり、今後仕様を変更する場合があります。**__", components: [acrow] });
    }
    else {
      const embed = new Discord.MessageEmbed();
      embed.setAuthor({ name: "エラー", iconURL: "https://cdn.discordapp.com/emojis/919045614724079687.png?size=96" })
      embed.setDescription("あなたにはこのコマンドを実行する権限がありません。\n利用権限が付与されていないか、\nご利用のサーバーでは利用できません。\n\nお困りですか？[サポートサーバーまでどうぞ！](https://discord.gg/VvrBsaq)")
      embed.addFields({ name: "エラーコード", value: "FOR_BIDDEN", inline: true })
      embed.setColor("#EB3871")
      await msg.channel.send({ embeds: [embed] });
    }
  }
  if (msg.mentions.users.has(client.user.id)) {
    msg.reply({ content: "お呼びですか？\n私はCode-Urayasuです。\n何でもお申し付けください。", allowedMentions: { repliedUser: false } });
    //console.log("ユニークメッセージ発動:乱数500の訪れ");
  }
});

let mccpok1 = "30枚";
let mccpok2 = "30枚";
let mccpok3 = "50枚";
let mccpok4 = "30枚";
let mccpok5 = "30枚";
let mccpok6 = "30枚";
let mccpok7 = "50枚";
let mccpok8 = "30枚";
let mccpok9 = "30枚";
let mccpok10 = "マウンテンJPC";
let mccpoks = ["30枚", "30枚", "50枚", "30枚", "30枚", "30枚", "50枚", "30枚", "30枚", "マウンテンJPC"];
let sccpoks = ["30枚", "30枚", "50枚", "30枚", "30枚", "30枚", "50枚", "30枚", "30枚", "ソルナJPC"];
let mccplaying = false;
let sccplaying = false;
let mountainjp = 1000;
let soljp = 1800;
let lunajp = 1500;
let mjpcpoks = ["100枚", "100枚", "150枚", "200枚", "100枚", "150枚", "100枚", "200枚", "100枚", "200枚", "300枚", "150枚", "CHANCE", "CHANCE", "MountainJP"];
let sjpcpoks = ["50枚", "50枚", "100枚", "200枚", "50枚", "50枚", "100枚", "50枚", "100枚", "200枚", "300枚", "50枚", "CHANCE", "CHANCE", "SolJP", "LunaJP"];
let mjpcup = ["100枚", "200枚", "300枚", "400枚", "2倍"];
let mjpcplaying = false;
let sjpcplaying = false;
let cjpcplaying = false;
let colorjp = 10000;
/*
if(savedb.get("pprmccdiv")){
  
}
else{
  savedb.set("pprmccdiv",["30枚", "30枚", "50枚", "30枚", "30枚", "30枚", "50枚", "30枚", "30枚", "マウンテンJPC"]);
}
*/

//var item;
//var item2;
//var item3;

client.on("interactionCreate", async (inter) => {
  if (inter.customId === "testBtn") {
    await inter.reply({ content: `${inter.user.username}さん、こんにちは！`, ephemeral: true });
  }
  if (inter.customId === "testBtn2") {
    await inter.reply({ content: `${inter.user.username}さん、こんにちは！`, ephemeral: false });
  }

  if (inter.commandName === "userold") {
    const date = new Date(inter.user.createdTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
    const jndate = new Date(inter.member.joinedTimestamp);
    const jndatestr = jndate.toFormat("YYYY/MM/DD HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle("ユーザー情報")
      .setThumbnail(inter.user.displayAvatarURL({ format: "png" }))
      .setFooter({ text: `${datestr}にアカウントが作成されました。` })
      .addFields({ name: "ユーザー名", value: inter.user.username, inline: true })
      .addFields({ name: "ユーザータグ", value: inter.user.discriminator, inline: true })
      .addFields({ name: "ユーザーID", value: `${inter.user.id}`, inline: true })
      .addFields({ name: "サーバー参加日時", value: `${jndatestr}`, inline: true })
      .setColor("#05E2FF")
    await inter.reply({ embeds: [embed], ephemeral: false });
  }
  else if (inter.commandName === "user") {
    if (inter.options.getString("userid") === null) {
      const date = new Date(inter.user.createdTimestamp);
      const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
      const jndate = new Date(inter.member.joinedTimestamp);
      const jndatestr = jndate.toFormat("YYYY/MM/DD HH24:MI:SS");
      const embed = new Discord.MessageEmbed()
        .setTitle("ユーザー情報")
        .setThumbnail(inter.user.displayAvatarURL({ format: "png" }))
        .setFooter({ text: `${datestr}にアカウントが作成されました。` })
        .addFields({ name: "ユーザー名", value: inter.user.username, inline: true })
        .addFields({ name: "ユーザータグ", value: inter.user.discriminator, inline: true })
        .addFields({ name: "ユーザーID", value: `${inter.user.id}`, inline: true })
        .addFields({ name: "サーバー参加日時", value: `${jndatestr}`, inline: true })
        .setColor("#05E2FF")
      await inter.reply({ embeds: [embed], ephemeral: false });
    }
    else {
      if (!client.users.cache.get(inter.options.getString("userid").replace(/<|@|!|>/g, ""))) {
        const embed = new Discord.MessageEmbed()
        embed.setAuthor({ name: "エラー", iconURL: "https://cdn.discordapp.com/emojis/919045614724079687.png?size=96" })
        embed.setDescription("ユーザーが見つかりませんでした。\nオプションの値を見直してみてください。\n\nお困りですか？[サポートサーバーまでどうぞ！](https://discord.gg/VvrBsaq)")
        embed.addFields({ name: "エラーコード", value: "NOT_FOUND", inline: true })
        embed.setColor("#FC0341")
        await inter.reply({ embeds: [embed] });
      }
      else {
        const embed = new Discord.MessageEmbed()
        const fetuser = client.users.cache.get(inter.options.getString("userid").replace(/<|@|!|>/g, ""));
        const date = new Date(fetuser.createdTimestamp);
        const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
        embed.setTitle("ユーザー情報")
        embed.setThumbnail(fetuser.displayAvatarURL({ format: "png" }))
        embed.setFooter({ text: `${datestr}にアカウントが作成されました。` })
        embed.addFields({ name: "ユーザー名", value: fetuser.username, inline: true })
        embed.addFields({ name: "ユーザータグ", value: fetuser.discriminator, inline: true })
        embed.addFields({ name: "ユーザーID", value: `${fetuser.id}`, inline: true })
        //embed.addField("サーバー参加日時", `${jndatestr}`, true)
        embed.setColor("#05E2FF")
        if (client.guilds.cache.get(inter.guild.id).members.cache.get(inter.options.getString("userid").replace(/<|@|!|>/g, ""))) {
          const jndate = new Date(client.guilds.cache.get(inter.guild.id).members.cache.get(inter.options.getString("userid").replace(/<|@|!|>/g, "")).joinedTimestamp);
          const jndatestr = jndate.toFormat("YYYY/MM/DD HH24:MI:SS");
          embed.addFields({ name: "サーバー参加日時", value: `${jndatestr}`, inline: true });
        }
        await inter.reply({ embeds: [embed], ephemeral: false });
      }
    }
  }
  else if (inter.commandName === "serverold") {
    const date = new Date(inter.guild.createdTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle("サーバー情報")
      .setThumbnail(inter.guild.iconURL({ format: "png" }))
      .setFooter({ text: `${datestr}にサーバーが作成されました。` })
      .addFields({ name: "サーバー名", value: inter.guild.name, inline: true })
      .addFields({ name: "サーバーID", value: inter.guild.id, inline: true })
      .addFields({ name: "メンバー数", value: `${inter.guild.memberCount}`, inline: true })
      .setColor("#05E2FF")
    await inter.reply({ embeds: [embed], ephemeral: false });
  }
  else if (inter.commandName === "server") {
    if (inter.options.getString("serverid") === null) {
      const date = new Date(inter.guild.createdTimestamp);
      const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
      const embed = new Discord.MessageEmbed()
        .setTitle("サーバー情報")
        .setThumbnail(inter.guild.iconURL({ format: "png" }))
        .setFooter({ text: `${datestr}にサーバーが作成されました。` })
        .addFields({ name: "サーバー名", value: inter.guild.name, inline: true })
        .addFields({ name: "サーバーID", value: inter.guild.id, inline: true })
        .addFields({ name: "メンバー数", value: `${inter.guild.memberCount}`, inline: true })
        .setColor("#05E2FF")
      await inter.reply({ embeds: [embed], ephemeral: false });
    }
    else {
      if (!client.guilds.cache.get(inter.options.getString("serverid"))) {
        const embed = new Discord.MessageEmbed()
        embed.setAuthor({ name: "エラー", iconURL: "https://cdn.discordapp.com/emojis/919045614724079687.png?size=96" })
        embed.setDescription("サーバーが見つかりませんでした。\nオプションの値を見直してみてください。\n\nお困りですか？[サポートサーバーまでどうぞ！](https://discord.gg/VvrBsaq)")
        embed.addFields({ name: "エラーコード", value: "NOT_FOUND", inline: true })
        embed.setColor("#FC0341")
        await inter.reply({ embeds: [embed] });
      }
      else {
        const fetguild = client.guilds.cache.get(inter.options.getString("serverid"));
        const date = new Date(fetguild.createdTimestamp);
        const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
        const embed = new Discord.MessageEmbed()
          .setTitle("サーバー情報")
          .setThumbnail(fetguild.iconURL({ format: "png" }))
          .setFooter({ text: `${datestr}にサーバーが作成されました。` })
          .addFields({ name: "サーバー名", value: fetguild.name, inline: true })
          .addFields({ name: "サーバーID", value: fetguild.id, inline: true })
          .addFields({ name: "メンバー数", value: `${fetguild.memberCount}`, inline: true })
          .setColor("#05E2FF")
        await inter.reply({ embeds: [embed], ephemeral: false });
      }
    }
  }
  else if (inter.commandName === "channelold") {
    const date = new Date(inter.channel.createdTimestamp);
    const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
    const embed = new Discord.MessageEmbed()
      .setTitle("チャンネル情報")
      .setFooter({ text: `${datestr}にチャンネルが作成されました。` })
      .addFields({ name: "チャンネル名", value: inter.channel.name, inline: true })
      .addFields({ name: "チャンネルID", value: inter.channel.id, inline: true })
      .addFields({ name: "メッセージ数", value: `${inter.channel.messageCount}`, inline: true })
      .addFields({ name: "トピック", value: `${inter.channel.topic}`, inline: true })
      .setColor("#05E2FF")
    await inter.reply({ embeds: [embed], ephemeral: false });
  }
  else if (inter.commandName === "channel") {
    if (inter.options.getString("channelid") === null) {
      const date = new Date(inter.channel.createdTimestamp);
      const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
      const embed = new Discord.MessageEmbed()
        .setTitle("チャンネル情報")
        .setFooter({ text: `${datestr}にチャンネルが作成されました。` })
        .addFields({ name: "チャンネル名", value: inter.channel.name, inline: true })
        .addFields({ name: "チャンネルID", value: inter.channel.id, inline: true })
        .addFields({ name: "メッセージ数", value: `${inter.channel.messageCount}`, inline: true })
        .addFields({ name: "トピック", value: `${inter.channel.topic}`, inline: true })
        .setColor("#05E2FF")
      await inter.reply({ embeds: [embed], ephemeral: false });
    }
    else {
      if (!client.guilds.cache.get(inter.guild.id).channels.cache.get(inter.options.getString("channelid").replace(/<|#|>/g, ""))) {
        const embed = new Discord.MessageEmbed()
        embed.setAuthor({ name: "エラー", iconURL: "https://cdn.discordapp.com/emojis/919045614724079687.png?size=96" })
        embed.setDescription("チャンネルが見つかりませんでした。\nオプションの値を見直してみてください。\n\nお困りですか？[サポートサーバーまでどうぞ！](https://discord.gg/VvrBsaq)")
        embed.addFields({ name: "エラーコード", value: "NOT_FOUND", inline: true })
        embed.setColor("#FC0341")
        await inter.reply({ embeds: [embed] });
      }
      else {
        const fetchnel = client.guilds.cache.get(inter.guild.id).channels.cache.get(inter.options.getString("channelid").replace(/<|#|>/g, ""));
        const date = new Date(fetchnel.createdTimestamp);
        const datestr = date.toFormat("YYYY/MM/DD HH24:MI:SS");
        const embed = new Discord.MessageEmbed()
          .setTitle("チャンネル情報")
          .setFooter({ text: `${datestr}にチャンネルが作成されました。` })
          .addFields({ name: "チャンネル名", value: fetchnel.name, inline: true })
          .addFields({ name: "チャンネルID", value: fetchnel.id, inline: true })
          .addFields({ name: "メッセージ数", value: `${fetchnel.messageCount}`, inline: true })
          .addFields({ name: "トピック", value: `${fetchnel.topic}`, inline: true })
          .setColor("#05E2FF")
        await inter.reply({ embeds: [embed], ephemeral: false });
      }
    }
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
      .addFields({ name: "ユーザー名", value: inter.targetUser.username, inline: true })
      .addFields({ name: "ユーザータグ", value: inter.targetUser.discriminator, inline: true })
      .addFields({ name: "ユーザーID", value: `${inter.targetUser.id}`, inline: true })
      .addFields({ name: "サーバー参加日時", value: `${jndatestr}`, inline: true })
      .setColor("#05E2FF")
    await inter.reply({ embeds: [embed], ephemeral: false });
  }

  // NGW不具合報告ボタンクリック
  if (inter.customId === "bugreportbtn") {
    const modal = new Discord.Modal()
      .setCustomId('bugreportconfirm')
      .setTitle('不具合報告フォーム');
    const acrow1 = new Discord.MessageActionRow()
      .addComponents(
        new Discord.TextInputComponent()
          .setCustomId("bugreportcomp1")
          .setLabel("対象のゲーム")
          .setStyle('SHORT')
          .setPlaceholder("（例）Colorant Echo"),
      );
    const acrow2 = new Discord.MessageActionRow()
      .addComponents(
        new Discord.TextInputComponent()
          .setCustomId("bugreportcomp2")
          .setLabel("アプリのバージョン")
          .setStyle('SHORT')
          .setPlaceholder("（例）Ver.1.2.5"),
      );
    const acrow3 = new Discord.MessageActionRow()
      .addComponents(
        new Discord.TextInputComponent()
          .setCustomId("bugreportcomp3")
          .setLabel("対象のシーン")
          .setStyle('SHORT')
          .setPlaceholder("（例）Tenth Green"),
      );
    const acrow4 = new Discord.MessageActionRow()
      .addComponents(
        new Discord.TextInputComponent()
          .setCustomId("bugreportcomp4")
          .setLabel("不具合を発生させるのに必要な操作・反応")
          .setStyle('SHORT')
          .setPlaceholder("（例）GreenChallengeに突入する"),
      );
    const acrow5 = new Discord.MessageActionRow()
      .addComponents(
        new Discord.TextInputComponent()
          .setCustomId("bugreportcomp5")
          .setLabel("不具合の詳細")
          .setStyle('PARAGRAPH')
          .setPlaceholder("（例）稀にクルーン上のボールが止まってしまい、進行不可能になる。"),
      );
    modal.addComponents(acrow1, acrow2, acrow3, acrow4, acrow5);
    //await inter.reply({ content: `${inter.user.username}さん、こんにちは！`, ephemeral: true });
    inter.showModal(modal);
  }

  // NGW不具合報告送信ボタンクリック
  if (inter.customId === "bugreportconfirm") {
    inter.reply({ content: "不具合報告へのご協力ありがとうございます。\n内容が開発チームに送られました。", ephemeral: true });
    const field = inter.fields;
    let sendmsg = `${inter.member.displayName}#${inter.user.discriminator}(${inter.user.id}) さんからの不具合報告です。\n\n【対象のゲーム】 : ${field.getTextInputValue("bugreportcomp1")}\n【アプリのバージョン】 : ${field.getTextInputValue("bugreportcomp2")}\n【対象のシーン】 : ${field.getTextInputValue("bugreportcomp3")}\n【不具合を発生させるのに必要な操作・反応】 : ${field.getTextInputValue("bugreportcomp4")}\n【不具合の詳細】 : ${field.getTextInputValue("bugreportcomp5")}`;
    let sendmsg2 = sendmsg;
    if (sendmsg.length > 2000) {
      sendmsg2 = `${sendmsg.substring(0, 1996)}...`;
    }
    client.channels.cache.get("993040671407616020").send(`${sendmsg2}`);
  }

  // NGW不具合報告入力方法
  if (inter.customId === "howbugreport") {
    inter.reply({
      content: `【対象のゲーム】・
　「ブロック崩し3D」
　「ボタポッチ」
　「スペースプッシャー」
　「CubeAvoid」
　「Colorant Echo」
から選択してください。

【アプリのバージョン】・
各アプリのタイトル画面の左下に書いてあるバージョンを記入してください。

【対象のシーン】・
CubeAvoidなら「ステージ２」や「ステージ１クリア画面」、Colorant Echoなら「Tenth Green」「ColorantJPC」など`, ephemeral: true
    });
  }

  // NGW不具合報告DEV
  if (inter.customId === "bugreportbtndev") {
    const modal = new Discord.Modal()
      .setCustomId('bugreportconfirmdev')
      .setTitle('不具合報告フォーム（Dev）');
    const acrow1 = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId("bugreportcomp1dev")
          .setOptions([
            {
              label: "BlockBreak3D",
              value: "a",
            },
            {
              label: "BotaPochi",
              value: "b",
            },
            {
              label: "SpacePusher",
              value: "c",
            }
          ])
          .setPlaceholder("（例）Colorant Echo"),
      );
    const acrow2 = new Discord.MessageActionRow()
      .addComponents(
        new Discord.TextInputComponent()
          .setCustomId("bugreportcomp2dev")
          .setLabel("アプリのバージョン")
          .setStyle('SHORT')
          .setPlaceholder("（例）Ver.1.2.5"),
      );
    modal.addComponents(acrow1, acrow2);
    //await inter.reply({ content: `${inter.user.username}さん、こんにちは！`, ephemeral: true });
    inter.showModal(modal);
  }
  if (inter.customId === "bugreportconfirmdev") {
    inter.reply({ content: "不具合報告へのご協力ありがとうございます。\n内容が開発チームに送られました。", ephemeral: true });
    const field = inter.fields;
    console.log(field.components[1].components);
    let sendmsg = `Devバージョンです。\n${inter.member.displayName}#${inter.user.discriminator}(${inter.user.id}) さんからの不具合報告です。\n\n【対象のゲーム】 : ${field.getField("bugreportcomp1dev").value}\n【アプリのバージョン】 : ${field.getTextInputValue("bugreportcomp2dev")}`;
    let sendmsg2 = sendmsg;
    if (sendmsg.length > 2000) {
      sendmsg2 = `${sendmsg.substring(0, 1996)}...`;
    }
    client.channels.cache.get("993040671407616020").send(`${sendmsg2}`);
  }

  // DEV版TODOリスト
  if (inter.commandName === "testtodo") {
    let todolistadjust = "";
    for(var i = 0; i < testtodolist.length; i++){
      if(testtodolist[i].todobool){
        todolistadjust += testtodolist[i].selecting ? "> " : "";
        todolistadjust += "✅ ";
      }
      else {
        todolistadjust += testtodolist[i].selecting ? "> " : "";
        todolistadjust += "🟩 ";
      }
      todolistadjust += testtodolist[i].todocontent + "\n";
    }
    const acrow = new Discord.MessageActionRow()
      .addComponents(
      new Discord.MessageButton()
      .setLabel("上へ")
      .setCustomId("testtodoselectup")
      .setStyle("SECONDARY"), 
      new Discord.MessageButton()
      .setLabel("下へ")
      .setCustomId("testtodoselectdown")
      .setStyle("SECONDARY"), 
      new Discord.MessageButton()
      .setLabel("トグル")
      .setCustomId("testtodotoggle")
      .setStyle("SUCCESS"),
      new Discord.MessageButton()
      .setLabel("追加")
      .setCustomId("testtodoadd")
      .setStyle("PRIMARY"),
      new Discord.MessageButton()
      .setLabel("削除")
      .setCustomId("testtodoremove")
      .setStyle("DANGER")
      );
    await inter.reply({ content: todolistadjust, ephemeral: false, components: [acrow] });
  }
  if (inter.customId === "testtodoselectup") {
    let todolistadjust = "";
    let newselecting = 0;
    for(var i = 0; i < testtodolist.length; i++){
      if(testtodolist[i].selecting){
        testtodolist[i].selecting = false;
        newselecting = i - 1;
        if(newselecting < 0){
          newselecting = testtodolist.length - 1;
        }
      }
    }
    testtodolist[newselecting].selecting = true;
    for(var i = 0; i < testtodolist.length; i++){
      if(testtodolist[i].todobool){
        todolistadjust += testtodolist[i].selecting ? "> " : "";
        todolistadjust += "✅ ";
      }
      else {
        todolistadjust += testtodolist[i].selecting ? "> " : "";
        todolistadjust += "🟩 ";
      }
      todolistadjust += testtodolist[i].todocontent + "\n";
    }
    const acrow = new Discord.MessageActionRow()
      .addComponents(
      new Discord.MessageButton()
      .setLabel("上へ")
      .setCustomId("testtodoselectup")
      .setStyle("SECONDARY"), 
      new Discord.MessageButton()
      .setLabel("下へ")
      .setCustomId("testtodoselectdown")
      .setStyle("SECONDARY"), 
      new Discord.MessageButton()
      .setLabel("トグル")
      .setCustomId("testtodotoggle")
      .setStyle("SUCCESS"),
      new Discord.MessageButton()
      .setLabel("追加")
      .setCustomId("testtodoadd")
      .setStyle("PRIMARY"),
      new Discord.MessageButton()
      .setLabel("削除")
      .setCustomId("testtodoremove")
      .setStyle("DANGER")
      );
    await inter.update({ content: todolistadjust, ephemeral: false, components: [acrow] });
  }
  if (inter.customId === "testtodoselectdown") {
    let todolistadjust = "";
    let newselecting = 0;
    for(var i = 0; i < testtodolist.length; i++){
      if(testtodolist[i].selecting){
        testtodolist[i].selecting = false;
        newselecting = i + 1;
        if(newselecting >= testtodolist.length){
          newselecting = 0;
        }
      }
    }
    testtodolist[newselecting].selecting = true;
    for(var i = 0; i < testtodolist.length; i++){
      if(testtodolist[i].todobool){
        todolistadjust += testtodolist[i].selecting ? "> " : "";
        todolistadjust += "✅ ";
      }
      else {
        todolistadjust += testtodolist[i].selecting ? "> " : "";
        todolistadjust += "🟩 ";
      }
      todolistadjust += testtodolist[i].todocontent + "\n";
    }
    const acrow = new Discord.MessageActionRow()
      .addComponents(
      new Discord.MessageButton()
      .setLabel("上へ")
      .setCustomId("testtodoselectup")
      .setStyle("SECONDARY"), 
      new Discord.MessageButton()
      .setLabel("下へ")
      .setCustomId("testtodoselectdown")
      .setStyle("SECONDARY"), 
      new Discord.MessageButton()
      .setLabel("トグル")
      .setCustomId("testtodotoggle")
      .setStyle("SUCCESS"),
      new Discord.MessageButton()
      .setLabel("追加")
      .setCustomId("testtodoadd")
      .setStyle("PRIMARY"),
      new Discord.MessageButton()
      .setLabel("削除")
      .setCustomId("testtodoremove")
      .setStyle("DANGER")
      );
    await inter.update({ content: todolistadjust, ephemeral: false, components: [acrow] });
  }
  if (inter.customId === "testtodotoggle") {
    let todolistadjust = "";
    for(var i = 0; i < testtodolist.length; i++){
      if(testtodolist[i].selecting){
        testtodolist[i].todobool = !testtodolist[i].todobool;
      }
    }
    for(var i = 0; i < testtodolist.length; i++){
      if(testtodolist[i].todobool){
        todolistadjust += testtodolist[i].selecting ? "> " : "";
        todolistadjust += "✅ ";
      }
      else {
        todolistadjust += testtodolist[i].selecting ? "> " : "";
        todolistadjust += "🟩 ";
      }
      todolistadjust += testtodolist[i].todocontent + "\n";
    }
    const acrow = new Discord.MessageActionRow()
      .addComponents(
      new Discord.MessageButton()
      .setLabel("上へ")
      .setCustomId("testtodoselectup")
      .setStyle("SECONDARY"), 
      new Discord.MessageButton()
      .setLabel("下へ")
      .setCustomId("testtodoselectdown")
      .setStyle("SECONDARY"), 
      new Discord.MessageButton()
      .setLabel("トグル")
      .setCustomId("testtodotoggle")
      .setStyle("SUCCESS"),
      new Discord.MessageButton()
      .setLabel("追加")
      .setCustomId("testtodoadd")
      .setStyle("PRIMARY"),
      new Discord.MessageButton()
      .setLabel("削除")
      .setCustomId("testtodoremove")
      .setStyle("DANGER")
      );
    await inter.update({ content: todolistadjust, ephemeral: false, components: [acrow] });
  }
  if (inter.customId === "testtodoadd") {
    let todolistadjust = "";
    const todoaddmodal = new Discord.Modal()
    .setTitle("TODO アイテム追加")
    .setCustomId("testtodoaddsubmit")
    .addComponents(
      new Discord.MessageActionRow()
      .addComponents(
        new Discord.TextInputComponent()
        .setCustomId("testtodoaddinput01")
        .setLabel("追加するアイテム名")
        .setPlaceholder("何をする予定ですか？")
        .setRequired(true)
        .setMaxLength(50)
        .setStyle("SHORT")
      )
    );
    await inter.showModal(todoaddmodal);
  }
  if (inter.customId === "testtodoaddsubmit") {
    let todolistadjust = "";
    testtodolist.push({ todobool: false, todocontent: inter.fields.getTextInputValue("testtodoaddinput01"), selecting:false});
    for(var i = 0; i < testtodolist.length; i++){
      if(testtodolist[i].todobool){
        todolistadjust += testtodolist[i].selecting ? "> " : "";
        todolistadjust += "✅ ";
      }
      else {
        todolistadjust += testtodolist[i].selecting ? "> " : "";
        todolistadjust += "🟩 ";
      }
      todolistadjust += testtodolist[i].todocontent + "\n";
    }
    const acrow = new Discord.MessageActionRow()
      .addComponents(
      new Discord.MessageButton()
      .setLabel("上へ")
      .setCustomId("testtodoselectup")
      .setStyle("SECONDARY"), 
      new Discord.MessageButton()
      .setLabel("下へ")
      .setCustomId("testtodoselectdown")
      .setStyle("SECONDARY"), 
      new Discord.MessageButton()
      .setLabel("トグル")
      .setCustomId("testtodotoggle")
      .setStyle("SUCCESS"),
      new Discord.MessageButton()
      .setLabel("追加")
      .setCustomId("testtodoadd")
      .setStyle("PRIMARY"),
      new Discord.MessageButton()
      .setLabel("削除")
      .setCustomId("testtodoremove")
      .setStyle("DANGER")
      );
    await inter.update({ content: todolistadjust, ephemeral: false, components: [acrow] });
  }
  if (inter.customId === "testtodoremove") {
    let todolistadjust = "";
    for(var i = 0; i < testtodolist.length; i++){
      if(testtodolist[i].selecting){
        testtodolist.splice(i, 1);
        if(i >= testtodolist.length - 1 && testtodolist.length != 0 && i != 0){
          testtodolist[testtodolist.length - 1].selecting = true;
        }
        else if(i == 0 && testtodolist.length != 0){
          testtodolist[0].selecting = true;
        }
        else if(testtodolist.length != 0){
          testtodolist[i].selecting = true;
        }
      }
    }
    for(var i = 0; i < testtodolist.length; i++){
      if(testtodolist[i].todobool){
        todolistadjust += testtodolist[i].selecting ? "> " : "";
        todolistadjust += "✅ ";
      }
      else {
        todolistadjust += testtodolist[i].selecting ? "> " : "";
        todolistadjust += "🟩 ";
      }
      todolistadjust += testtodolist[i].todocontent + "\n";
    }
    const acrow = new Discord.MessageActionRow()
      .addComponents(
      new Discord.MessageButton()
      .setLabel("上へ")
      .setCustomId("testtodoselectup")
      .setStyle("SECONDARY"), 
      new Discord.MessageButton()
      .setLabel("下へ")
      .setCustomId("testtodoselectdown")
      .setStyle("SECONDARY"), 
      new Discord.MessageButton()
      .setLabel("トグル")
      .setCustomId("testtodotoggle")
      .setStyle("SUCCESS"),
      new Discord.MessageButton()
      .setLabel("追加")
      .setCustomId("testtodoadd")
      .setStyle("PRIMARY"),
      new Discord.MessageButton()
      .setLabel("削除")
      .setCustomId("testtodoremove")
      .setStyle("DANGER")
      );
      todolistadjust = testtodolist.length == 0 ? "TODOリストは空です。" : todolistadjust;
    await inter.update({ content: todolistadjust, ephemeral: false, components: [acrow] });
  }
  if (inter.customId === "testselectmenu") {
    inter.update(inter.values.toString());
    console.log(inter.values);
  }
});

let testtodolist = [{ todobool: true, todocontent: "テストをする", selecting:true}, { todobool: true, todocontent: "テレビを見る", selecting:false}, { todobool: false, todocontent: "寝る", selecting:false}];

// ThinkingBoard
client.on("messageReactionAdd", async (reaction, user) => {
  console.log(`リアクション追加`);
  if (reaction.emoji.name === "\u{1f914}") {
    console.log(`シンキングリアクションの追加\nサーバー : ${reaction.message.guild}\nチャンネル : ${reaction.message.channel}\nユーザー : ${user.tag}\n---------------------`)
    // if(reaction.message.guildId === reaction.message.guild)
    if (reaction.message.guild.channels.cache.find((channel) => channel.name === "cu-thinking-board")) {
      if (reaction.message.partial) {
        await reaction.fetch();
      }
      const embed = new Discord.MessageEmbed()
      console.log(reaction.message.author.name);
      let atchb = `${reaction.message.attachments.map(attach => `[${attach.name}](${attach.url})`)}`;
      let embdesc = `${reaction.message.content}\n\n---------------\n[Jump to message](${reaction.message.url})\n<#${reaction.message.channel.id}> #${reaction.message.channel.name}`;
      let embauth = "";
      if (reaction.message.attachments.first()) {
        embdesc = `${reaction.message.content}\n${atchb}\n\n---------------\n[Jump to message](${reaction.message.url})\n<#${reaction.message.channel.id}> #${reaction.message.channel.name}`;
        if (!reaction.message.attachments.first().spoiler) {
          embed.setImage(reaction.message.attachments.first().url);
        }
        if (reaction.message.channel.nsfw) {
          if (reaction.message.guild.channels.cache.find((channel) => channel.name === "cu-thinking-board").nsfw && !reaction.message.attachments.first().spoiler) {
            embed.setImage(reaction.message.attachments.first().url);
          }
          else {
            embed.setImage(null);
          }
        }
      }
      if (reaction.message.webhookId) {
        embauth = `${reaction.message.author.tag}`;
      }
      else {
        embauth = `${reaction.message.member.displayName}`;
      }
      embed.setAuthor({ name: embauth, iconURL: reaction.message.author.displayAvatarURL({ format: "png" }) })
      embed.setDescription(embdesc)
      embed.setColor("#F5CE0F")
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
      .addFields({ name: "イベント名", value: `${event.name} / ${event.id}`, inline: true })
      .addFields({ name: "説明", value: `${desipt}`, inline: true })
      .addFields({ name: "作成者", value: `${event.creator.tag} / ${event.creator.id}` })
      .addFields({ name: "どこで行われる？", value: enttype })
      .addFields({ name: "開始日時", value: datestr, inline: true })
      .addFields({ name: "終了日時", value: datestr2, inline: true })
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
      .addFields({ name: "イベント名", value: `${event.name} / ${event.id}`, inline: true })
      .addFields({ name: "説明", value: `${desipt}`, inline: true })
      .addFields({ name: "作成者", value: `${event.creator.tag} / ${event.creator.id}` })
      .addFields({ name: "どこで行われる？", value: enttype })
      .addFields({ name: "開始日時", value: datestr, inline: true })
      .addFields({ name: "終了日時", value: datestr2, inline: true })
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
      .addFields({ name: "イベント名", value: `${event.name} / ${event.id}`, inline: true })
      .addFields({ name: "説明", value: `${desipt}`, inline: true })
      .addFields({ name: "作成者", value: `${event.creator.tag} / ${event.creator.id}` })
      .addFields({ name: "どこで行われる？", value: enttype })
      .addFields({ name: "開始日時", value: datestr, inline: true })
      .addFields({ name: "終了日時", value: datestr2, inline: true })
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
        .addFields({ name: "内容", value: msgcont })
        .addFields({ name: "添付ファイル", value: atch })
        .addFields({ name: "チャンネル", value: `<#${msg.channel.id}> / ${msg.channel.id}\n#${msg.channel.name}` })
        .addFields({ name: "投稿者", value: `<@${msg.author.id}> / ${msg.author.id}\n@${msg.member.displayName}#${msg.author.discriminator}`, inline: true })
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
        .addFields({ name: "内容（変更前）", value: msgcont2 })
        .addFields({ name: "内容（変更後）", value: msgcont })
        .addFields({ name: "添付ファイル（変更前）", value: atch2 })
        .addFields({ name: "添付ファイル（変更後）", value: atch })
        .addFields({ name: "チャンネル", value: `<#${msg.channel.id}> / ${msg.channel.id}\n#${msg.channel.name}` })
        .addFields({ name: "投稿者", value: `<@${msg.author.id}> / ${msg.author.id}\n@${msg.member.displayName}#${msg.author.discriminator}`, inline: true })
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
        .addFields({ name: "ターゲット", value: `<@${mbr.id}> / ${mbr.id}\n@${mbr.displayName}#${mbr.user.discriminator}` })
        .addFields({ name: "期間", value: `${datestr} / ${timeoutDay}日${timeoutHour}時間${timeoutMin}分${timeoutSec}秒` })
        .setTimestamp()
      mbr.guild.channels.cache.find((channel) => channel.name === "cu-audit-logs")
        .send({ embeds: [embed] });
    }
    else if (oldmbr.isCommunicationDisabled() && !mbr.isCommunicationDisabled()) {
      const embed = new Discord.MessageEmbed()
        .setTitle(`メンバーのタイムアウトの解除`)
        // .setAuthor({name:`${reaction.message.member.displayName}`, iconURL: reaction.message.author.displayAvatarURL({ format:"png" })})
        .setColor("#08B1FF")
        .addFields({ name: "ターゲット", value: `<@${mbr.id}> / ${mbr.id}\n@${mbr.displayName}#${mbr.user.discriminator}` })
        .setTimestamp()
      mbr.guild.channels.cache.find((channel) => channel.name === "cu-audit-logs")
        .send({ embeds: [embed] });
    }
  }
});

// 必要関数


client.login(vercomps.botToken);
