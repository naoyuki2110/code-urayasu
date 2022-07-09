// Discordフレームワーク読み込み
const Discord = require("discord.js");
const client = new Discord.Client({ intents: Object.keys(Discord.Intents.FLAGS) });

// dotenv読み込み
require("dotenv").config();

// Date読み込み
require("date-utils");

const { setTimeout } = require("timers/promises")

// データ保存システム読み込み
const Keyv = require("keyv");

const svmccdiv = new Keyv("sqlite://sqlite.db",{table:"svmccdiv"});
const svsccdiv = new Keyv("sqlite://sqlite.db",{table:"svsccdiv"});
const svpprccdiv = new Keyv("sqlite://sqlite.db");
svmccdiv.on("error", err => console.log("Keyv error:",err));
svsccdiv.on("error", err => console.log("Keyv error:",err));
svpprccdiv.on("error", err => console.log("Keyv error:",err));

// BOTプレフィックス宣言
const prefix = "cu!";

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

client.on("ready", () => {
  console.log(`${new Date()}\nユーザー名 : ${client.user.tag} でログインが完了しました。\nユーザーID : ${client.user.id}`);
  client.user.setActivity("現在はテストバージョンでの提供となります。", { type: "PLAYING" })
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
  console.log(await svpprccdiv.get("pprmccdiv"));
  console.log(await svpprccdiv.get("pprsccdiv"));
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
  if (msg.content === "cu!help") {
    msg.channel.send(`Code-Urayasuの使い方
Prefixは \`cu!\`

コマンド編
\`cu!num100\` : 1～100までの数字あてゲームがプレイできます。
\`cu!numgame<1~400までの数字>\` : numgameのあとの数字分数字あてゲームがプレイできます。
\`!myriad2\` : PNR2の次回のミリアド時刻・相対時刻を表示します
\`cu!rdsay\` <文字列> : 指定した文字列をランダムに並べ替えて表示します
\`cu!user\` : ユーザー情報を表示します
\`cu!server\` : サーバー情報を表示します
\`cu!channel\` : チャンネル情報を表示します
\`cu!ping\` : 通信速度を表示します
\`cu!slot\` : 3リールスロットを実行します
\`cu!pusher1\` : プッシャーを実行します ※開発中

簡易コマンド編
\`MCC\` : 仮想マウンテンクルーンチャレンジを実行します
\`SLCC\` : 仮想ソルナクルーンチャレンジを実行します
\`MJPC\` : 仮想マウンテンJPチャンスを実行します
\`SLJPC\` : 仮想ソルナJPチャンスを実行します

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
      .addField("ユーザー名", msg.author.username, true)
      .addField("ユーザータグ", msg.author.discriminator, true)
      .addField("ユーザーID", `${msg.author.id}`, true)
      .addField("サーバー参加日時", `${jndatestr}`, true)
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
      .addField("サーバー名", msg.guild.name, true)
      .addField("サーバーID", msg.guild.id, true)
      .addField("メンバー数", `${msg.guild.memberCount}`, true)
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
      .addField("チャンネル名", msg.channel.name, true)
      .addField("チャンネルID", msg.channel.id, true)
      .addField("メッセージ数", `${msg.channel.messageCount}`, true)
      .addField("トピック", `${msg.channel.topic}`, true)
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
    }
    catch (error) {
      if (error.name !== "") {
        console.log(`${error.name} : ${error.message}`);
        // await msg.channel.send(`エラーが発生しました。\n解決できない場合はスクショを撮って[サポートサーバー](https://discord.gg/VvrBsaq)までご連絡ください。\n\`\`\`${error.name} : ${error.message}\`\`\``);
        const embed = new Discord.MessageEmbed()
        embed.setAuthor({ name: "エラー", iconURL: "https://cdn.discordapp.com/emojis/919045614724079687.png?size=96" })
        embed.setDescription(`エラーが発生しました。\n解決できない場合はスクショを撮って[サポートサーバー](https://discord.gg/VvrBsaq)までご連絡ください。\n\`\`\`${error.name} : ${error.message}\`\`\``)
        embed.addField("エラーコード", "CODE_ERROR", true)
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
      embed.addField("エラーコード", "FOR_BIDDEN", true)
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

  if (msg.content === "cu!slot") {
    if (!playing) {
      playing = true;
      slot1 = SlotEmoji();
      slot2 = SlotEmoji();
      slot3 = SlotEmoji();
      SlotSpEmoji();
      var slmsg = msg.channel.send("SLOT START!");
      var pongtime = Date.now();
      await setTimeout(1500);
      (await slmsg).edit(`${slot1} :black_large_square: :black_large_square: `);
      await setTimeout(1000);
      (await slmsg).edit(`${slot1} :black_large_square: ${slot3} `);
      if (slot1 == slot3) {
        msg.channel.send("REACH!!");
        await setTimeout(2000);
      }
      await setTimeout(1500);
      (await slmsg).edit(`${slot1} ${slot2} ${slot3} `);
      if (slot1 == slot2 && slot2 == slot3) {
        msg.channel.send("**W I N !!!**");
      }
      else {
        msg.channel.send("Play Again!");
      }
      if (slot1 == ":three:" && slot2 == ":three:" && slot3 == ":four:") {
        msg.channel.send("なんでや！");
      }
      else if (slot1 == ":five:" && slot2 == ":one:" && slot3 == ":three:") {
        msg.channel.send("あと「9」があればなぁ...");
      }
      else if (slot1 == "<:Cry:704139077162762280>" || slot2 == "<:Cry:704139077162762280>" || slot3 == "<:Cry:704139077162762280>") {
        msg.channel.send("変なの出てて草");
      }
      playing = false;
    }
    else {
      msg.channel.send("現在別のところでスロットが行われているため実行できません。\nしばらくしてからもう一度お試しください。");
    }
  }

  if (msg.content === "cu!num100") {
    if (!numgameplaying) {
      numgameplaying = true;
      msg.channel.send("1～100までの数字を予想してください。");
      numgamech = msg.channelId;
      numgameuser = msg.author.id;
      numgameres = Math.ceil(Math.random() * 100);
      numgametype = "100";
    }
    else {
      msg.reply("現在他のユーザーがナンバーゲームをプレイ中です。");
    }
  }
  if (msg.author.id == numgameuser && msg.channelId == numgamech && numgameplaying && numgametype == "100") {
    if (!isNaN(msg.content.trim())) {
      if (parseInt(msg.content.trim()) >= 1 && parseInt(msg.content.trim()) <= 100) {
        if (numgameres < parseInt(msg.content.trim())) {
          msg.reply(`不正解！\n「${msg.content.trim()}」より小さいです。`);
          numgamecount++;
        }
        else if (numgameres > parseInt(msg.content.trim())) {
          msg.reply(`不正解！\n「${msg.content.trim()}」より大きいです。`);
          numgamecount++;
        }
        else if (numgameres == parseInt(msg.content.trim())) {
          numgamecount++;
          msg.reply(`正解！！\n正解は「${numgameres}」でした！\n${msg.member.displayName}さんの挑戦数 : ${numgamecount}回`);
          numgameplaying = false;
          numgamech = 0;
          numgameuser = 0;
          numgameres = 0;
          numgamecount = 0;
        }
      }
      else {
        msg.reply(`範囲外です。\n1～100までを入力してください。`);
      }
    }
    else {
      if (!msg.content.startsWith(prefix)) {
        msg.reply(`数字を入力してください。`);
      }
    }
  }

  if (msg.content.startsWith(prefix + "numgame")) {
    const skipstr = prefix + "numgame";
    if (!numgameplaying) {
      numgamemax = msg.content.substring(skipstr.length, msg.content.length);
      if (!isNaN(numgamemax)) {
        if (parseInt(numgamemax) >= 1 && parseInt(numgamemax) <= 400) {
          numgameplaying = true;
          msg.channel.send(`1～${numgamemax}までの数字を予想してください。`);
          numgamech = msg.channelId;
          numgameuser = msg.author.id;
          numgameres = Math.ceil(Math.random() * parseInt(numgamemax));
          numgametype = "custom";
        }
        else {
          msg.reply("カスタムナンバーゲームの作成に失敗しました。\n指定範囲は1～400にしてください。");
        }
      }
      else {
        msg.reply("カスタムナンバーゲームの作成に失敗しました。\n\`rs!numgame\`に続く文字列を数字にしてください。");
      }
    }
    else {
      msg.reply("現在他のユーザーがナンバーゲームをプレイ中です。");
    }
  }
  if (msg.author.id == numgameuser && msg.channelId == numgamech && numgameplaying && numgametype == "custom") {
    const skipstr = prefix + "numgame";
    //const numstr = msg.content.substring(skipstr.length, msg.content.length);
    if (!isNaN(msg.content.trim())) {
      if (parseInt(msg.content.trim()) >= 1 && parseInt(msg.content.trim()) <= parseInt(numgamemax)) {
        if (numgameres < parseInt(msg.content.trim())) {
          msg.reply(`不正解！\n「${msg.content.trim()}」より小さいです。`);
          numgamecount++;
        }
        else if (numgameres > parseInt(msg.content.trim())) {
          msg.reply(`不正解！\n「${msg.content.trim()}」より大きいです。`);
          numgamecount++;
        }
        else if (numgameres == parseInt(msg.content.trim())) {
          numgamecount++;
          msg.reply(`正解！！\n正解は「${numgameres}」でした！\n${msg.member.displayName}さんの挑戦数 : ${numgamecount}回`);
          numgameplaying = false;
          numgamech = 0;
          numgameuser = 0;
          numgameres = 0;
          numgamecount = 0;
        }
      }
      else {
        msg.reply(`範囲外です。\n1～${numgamemax}までを入力してください。`);
      }
    }
    else {
      if (!msg.content.startsWith(prefix)) {
        msg.reply(`数字を入力してください。`);
      }
    }
  }

  if (msg.content === "cu!pusher1") {
    const row = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setCustomId("pusher1coininput")
          .setLabel("1枚投入")
          .setStyle("PRIMARY"),
        new Discord.MessageButton()
          .setCustomId("pusher1showcoin")
          .setLabel(`${coinstock}枚`)
          .setStyle("SECONDARY")
          .setDisabled(true),
        new Discord.MessageButton()
          .setCustomId("pusher1exit")
          .setLabel("終了")
          .setStyle("DANGER")
      );
    pusher1msg = msg.channel.send({ content: `NORMAL MODE\nSatelliteChallenge : 0`, components: [row] });
  }
  /*
  if (msg.content === "MCC") {
    if (!mccplaying) {
      mccplaying = true;
      var mccmsg = msg.channel.send(`マウンテンクルーンチャレンジ！スタート！\n\n${mccpoks[0]}　${mccpoks[1]}　${mccpoks[2]}　${mccpoks[3]}　${mccpoks[4]}　${mccpoks[5]}　${mccpoks[6]}　${mccpoks[7]}　${mccpoks[8]}　${mccpoks[9]}`);
      var pongtime = Date.now();
      await setTimeout(1500);
      const wincoin = Math.ceil(Math.random() * 4);
      const rdpok = Math.floor(Math.random() * 10);
      (await mccmsg).edit(`ステーション1、${mccpoks[rdpok]}を獲得しました！\n\n${mccpoks[0]}　${mccpoks[1]}　${mccpoks[2]}　${mccpoks[3]}　${mccpoks[4]}　${mccpoks[5]}　${mccpoks[6]}　${mccpoks[7]}　${mccpoks[8]}　${mccpoks[9]}`)
      const colecttext = mccpoks[rdpok];
      MCCLevelUp(rdpok);
      await setTimeout(2000);
      if (colecttext != "マウンテンJPC") {
        (await mccmsg).edit(`ステーション1、${colecttext}を獲得しました！\nポケットレベルアップ！\n\n${mccpoks[0]}　${mccpoks[1]}　${mccpoks[2]}　${mccpoks[3]}　${mccpoks[4]}　${mccpoks[5]}　${mccpoks[6]}　${mccpoks[7]}　${mccpoks[8]}　${mccpoks[9]}`)
      }
      else {
        (await mccmsg).edit(`ステーション1、${colecttext}を獲得しました！\n\n${mccpoks[0]}　${mccpoks[1]}　${mccpoks[2]}　${mccpoks[3]}　${mccpoks[4]}　${mccpoks[5]}　${mccpoks[6]}　${mccpoks[7]}　${mccpoks[8]}　${mccpoks[9]}`)
      }
      mccplaying = false;
    }
    else {
      msg.reply("現在別の場所でマウンテンクルーンチャレンジが行われています。");
    }
  }
  if (msg.content === "SCC") {
    if (!sccplaying) {
      sccplaying = true;
      var sccmsg = msg.channel.send(`ソルナクルーンチャレンジ！スタート！\n\n${sccpoks[0]}　${sccpoks[1]}　${sccpoks[2]}　${sccpoks[3]}　${sccpoks[4]}　${sccpoks[5]}　${sccpoks[6]}　${sccpoks[7]}　${sccpoks[8]}　${sccpoks[9]}`);
      var pongtime = Date.now();
      await setTimeout(1500);
      const wincoin = Math.ceil(Math.random() * 4);
      const rdpok = Math.floor(Math.random() * 10);
      (await sccmsg).edit(`ステーション1、${sccpoks[rdpok]}を獲得しました！\n\n${sccpoks[0]}　${sccpoks[1]}　${sccpoks[2]}　${sccpoks[3]}　${sccpoks[4]}　${sccpoks[5]}　${sccpoks[6]}　${sccpoks[7]}　${sccpoks[8]}　${sccpoks[9]}`)
      const colecttext = sccpoks[rdpok];
      SCCLevelUp(rdpok);
      await setTimeout(2000);
      if (colecttext != "ソルナJPC") {
        (await sccmsg).edit(`ステーション1、${colecttext}を獲得しました！\nポケットレベルアップ！\n\n${sccpoks[0]}　${sccpoks[1]}　${sccpoks[2]}　${sccpoks[3]}　${sccpoks[4]}　${sccpoks[5]}　${sccpoks[6]}　${sccpoks[7]}　${sccpoks[8]}　${sccpoks[9]}`)
      }
      else {
        (await sccmsg).edit(`ステーション1、${colecttext}を獲得しました！\n\n${sccpoks[0]}　${sccpoks[1]}　${sccpoks[2]}　${sccpoks[3]}　${sccpoks[4]}　${sccpoks[5]}　${sccpoks[6]}　${sccpoks[7]}　${sccpoks[8]}　${sccpoks[9]}`)
      }
      sccplaying = false;
    }
    else {
      msg.reply("現在別の場所でソルナクルーンチャレンジが行われています。");
    }
  }
  */
  if (msg.content === "MCC") {
    if (!mccplaying) {
      mccplaying = true;
      if(await svpprccdiv.get("pprmccdiv")){
  
      }
      else{
        await svpprccdiv.set("pprmccdiv",["30枚", "30枚", "50枚", "30枚", "30枚", "30枚", "50枚", "30枚", "30枚", "マウンテンJPC"]);
      }
      mccpoks = await svpprccdiv.get("pprmccdiv");
      let svmccpoks = await svpprccdiv.get("pprmccdiv");
      console.log(svmccpoks);
      var mccmsg = msg.channel.send(`マウンテンクルーンチャレンジ！スタート！\n\n${svmccpoks[0]}　${svmccpoks[1]}　${svmccpoks[2]}　${svmccpoks[3]}　${svmccpoks[4]}　${svmccpoks[5]}　${svmccpoks[6]}　${svmccpoks[7]}　${svmccpoks[8]}　${svmccpoks[9]}`);
      var pongtime = Date.now();
      await setTimeout(1500);
      const wincoin = Math.ceil(Math.random() * 4);
      const rdpok = Math.floor(Math.random() * 10);
      (await mccmsg).edit(`ステーション1、${svmccpoks[rdpok]}を獲得しました！\n\n${svmccpoks[0]}　${svmccpoks[1]}　${svmccpoks[2]}　${svmccpoks[3]}　${svmccpoks[4]}　${svmccpoks[5]}　${svmccpoks[6]}　${svmccpoks[7]}　${svmccpoks[8]}　${svmccpoks[9]}`)
      const colecttext = mccpoks[rdpok];
      MCCLevelUp(rdpok);
      await svpprccdiv.set("pprmccdiv",mccpoks);
      svmccpoks = await svpprccdiv.get("pprmccdiv");
      await setTimeout(2000);
      if (colecttext != "マウンテンJPC") {
        (await mccmsg).edit(`ステーション1、${colecttext}を獲得しました！\nポケットレベルアップ！\n\n${svmccpoks[0]}　${svmccpoks[1]}　${svmccpoks[2]}　${svmccpoks[3]}　${svmccpoks[4]}　${svmccpoks[5]}　${svmccpoks[6]}　${svmccpoks[7]}　${svmccpoks[8]}　${svmccpoks[9]}`)
      }
      else {
        (await mccmsg).edit(`ステーション1、${colecttext}を獲得しました！\n\n${svmccpoks[0]}　${svmccpoks[1]}　${svmccpoks[2]}　${svmccpoks[3]}　${svmccpoks[4]}　${svmccpoks[5]}　${svmccpoks[6]}　${svmccpoks[7]}　${svmccpoks[8]}　${svmccpoks[9]}`)
      }
      mccplaying = false;
    }
    else {
      msg.reply("現在別の場所でマウンテンクルーンチャレンジが行われています。");
    }
  }
  if (msg.content === "SLCC") {
    if (!sccplaying) {
      sccplaying = true;
      if(await svpprccdiv.get("pprsccdiv")){
  
      }
      else{
        await svpprccdiv.set("pprsccdiv",["30枚", "30枚", "50枚", "30枚", "30枚", "30枚", "50枚", "30枚", "30枚", "ソルナJPC"]);
      }
      sccpoks = await svpprccdiv.get("pprsccdiv");
      let svsccpoks = await svpprccdiv.get("pprsccdiv");
      var sccmsg = msg.channel.send(`ソルナクルーンチャレンジ！スタート！\n\n${svsccpoks[0]}　${svsccpoks[1]}　${svsccpoks[2]}　${svsccpoks[3]}　${svsccpoks[4]}　${svsccpoks[5]}　${svsccpoks[6]}　${svsccpoks[7]}　${svsccpoks[8]}　${svsccpoks[9]}`);
      var pongtime = Date.now();
      await setTimeout(1500);
      const wincoin = Math.ceil(Math.random() * 4);
      const rdpok = Math.floor(Math.random() * 10);
      (await sccmsg).edit(`ステーション1、${svsccpoks[rdpok]}を獲得しました！\n\n${svsccpoks[0]}　${svsccpoks[1]}　${svsccpoks[2]}　${svsccpoks[3]}　${svsccpoks[4]}　${svsccpoks[5]}　${svsccpoks[6]}　${svsccpoks[7]}　${svsccpoks[8]}　${svsccpoks[9]}`)
      const colecttext = sccpoks[rdpok];
      SCCLevelUp(rdpok);
      await svpprccdiv.set("pprsccdiv",sccpoks);
      svsccpoks = await svpprccdiv.get("pprsccdiv");
      await setTimeout(2000);
      if (colecttext != "ソルナJPC") {
        (await sccmsg).edit(`ステーション1、${colecttext}を獲得しました！\nポケットレベルアップ！\n\n${svsccpoks[0]}　${svsccpoks[1]}　${svsccpoks[2]}　${svsccpoks[3]}　${svsccpoks[4]}　${svsccpoks[5]}　${svsccpoks[6]}　${svsccpoks[7]}　${svsccpoks[8]}　${svsccpoks[9]}`)
      }
      else {
        (await sccmsg).edit(`ステーション1、${colecttext}を獲得しました！\n\n${svsccpoks[0]}　${svsccpoks[1]}　${svsccpoks[2]}　${svsccpoks[3]}　${svsccpoks[4]}　${svsccpoks[5]}　${svsccpoks[6]}　${svsccpoks[7]}　${svsccpoks[8]}　${svsccpoks[9]}`)
      }
      sccplaying = false;
    }
    else {
      msg.reply("現在別の場所でソルナクルーンチャレンジが行われています。");
    }
  }
  if (msg.content === "MJPC") {
    if (!mjpcplaying) {
      mjpcplaying = true;
      var mjpcmsg = msg.channel.send(`マウンテンJPチャンス！スタート！`);
      var pongtime = Date.now();
      await setTimeout(1500);
      const wincoin = Math.ceil(Math.random() * 4);
      const rdpok = Math.floor(Math.random() * 15);
      (await mjpcmsg).edit(`MountainJP : ${mountainjp}枚`);
      await setTimeout(1000);
      for (let i = 1; Math.ceil(Math.random() * 65) > i; i++) {
        if (mountainjp > 10000) {
          mountainjp = 10000;
        }
        let jpup = MJPCJpUp(1);
        (await mjpcmsg).edit(`MountainJP : ${mountainjp}枚\n${jpup}`);
        // const colecttext = mccpoks[rdpok];
        await setTimeout(2500);
      }
      (await mjpcmsg).edit(`MountainJP : ${mountainjp}枚\n**IN!**`);
      await setTimeout(1500);
      const colecttext = mjpcpoks[rdpok];
      if (colecttext != "MountainJP") {
        (await mjpcmsg).edit(`MountainJP : ${mountainjp}枚\nステーション1、${colecttext}を獲得しました！`);
      }
      else {
        (await mjpcmsg).edit(`MountainJP : ${mountainjp}枚\nステーション1、${colecttext} (${mountainjp}枚)を獲得しました！`);
      }
      mountainjp = 1000;
      maxmjpupct = 20;
      mjpcplaying = false;
    }
    else {
      msg.reply("現在別の場所でマウンテンJPチャンスが行われています。");
    }
  }
  if (msg.content === "cu!clearpprcroon") {
    const embed = new Discord.MessageEmbed()
    if (msg.author.id !== "524872647042007067" && msg.author.id !== "692980438729228329") {
      embed.setAuthor({ name: "エラー", iconURL: "https://cdn.discordapp.com/emojis/919045614724079687.png?size=96" })
      embed.setDescription("あなたにはこのコマンドを実行する権限がありません。\nこのコマンドは一般利用者には実行できません。\n\nお困りですか？[サポートサーバーまでどうぞ！](https://discord.gg/VvrBsaq)")
      embed.addField("エラーコード", "FOR_BIDDEN", true)
      embed.setColor("#EB3871")
      await msg.channel.send({ embeds: [embed] });
    }
    else if (msg.author.id === "524872647042007067" || msg.author.id === "692980438729228329") {
      await svpprccdiv.delete("pprmccdiv");
      await svpprccdiv.delete("pprsccdiv");
      embed.setAuthor({ name: "成功", iconURL: "https://cdn.discordapp.com/emojis/919051457557327903.png?size=96" })
      embed.setDescription(`PPRクルーンデータを削除しました。`)
      embed.setColor("#08B1FF")
      await msg.channel.send({ embeds: [embed] });
    }
  }
  if (msg.content === "CJPC" || msg.content === "ColorantJPC") {
    if (!cjpcplaying) {
      cjpcplaying = true;
      var cjpcmsg = msg.channel.send(`ColorantJP : ${colorjp}\n\n0Win\n\n1  1  1`);
      var pongtime = Date.now();
      await setTimeout(1500);
      await setTimeout(1000);
      let cjpcwin = 0;
      let jpclot1 = CJPCLot(1);
      let jpclot2 = CJPCLot(2);
      let jpclot3 = CJPCLot(3);
      let jpstep1 = "";
      let jpstep2 = "";
      let jpstep3 = "";
      let jpbool = true;
      for (let i = 1; 34 > i; i++) {
        jpclot1 = CJPCLot(1);
        jpclot2 = CJPCLot(2);
        jpclot3 = CJPCLot(3);
        
        if(jpclot1 === jpclot2 && jpclot2 === jpclot3){
          cjpcwin += 50;
        }
        if(jpclot1 === "+15"){
          cjpcwin += 15;
        }
        if(jpclot2 === "+15"){
          cjpcwin += 15;
        }
        if(jpclot3 === "+15"){
          cjpcwin += 15;
        }
        if((jpclot1 === "JP" && jpstep1 === "JP") || (jpclot2 === "JP" && jpstep2 === "JP") || (jpclot3 === "JP" && jpstep3 === "JP")){
          cjpcwin += 500;
        }
        if(jpclot1 === "JP"){
          jpstep1 = "JP";
        }
        if(jpclot2 === "JP"){
          jpstep2 = "JP";
        }
        if(jpclot3 === "JP"){
          jpstep3 = "JP";
        }
        if(jpstep1 === "JP" && jpstep2 === "JP" && jpstep3 === "JP" && jpbool){
          cjpcwin += colorjp;
          jpbool = false;
        }
        await setTimeout(1000);
        (await cjpcmsg).edit(`ColorantJP : ${colorjp}\n\n${cjpcwin}Win\n\n${jpclot1}  ${jpclot2}  ${jpclot3}\n${jpstep1}  ${jpstep2}  ${jpstep3}`);
        // const colecttext = mccpoks[rdpok];
      }
      await setTimeout(1000);
      (await cjpcmsg).edit(`ColorantJP : ${colorjp}\n\n${cjpcwin}Win\n\n${jpclot1}  ${jpclot2}  ${jpclot3}\n${jpstep1}  ${jpstep2}  ${jpstep3}`);
      await setTimeout(2000);
      if(jpstep1 === "JP" && jpstep2 === "JP" && jpstep3 === "JP"){
        (await cjpcmsg).edit(`ColorantJP : ${colorjp}\n\n${cjpcwin}Win\n\n${jpclot1}  ${jpclot2}  ${jpclot3}\n${jpstep1}  ${jpstep2}  ${jpstep3}\n\nColorantJP\n${colorjp}`);
      }
      else{
        (await cjpcmsg).edit(`ColorantJP : ${colorjp}\n\n${cjpcwin}Win\n\n${jpclot1}  ${jpclot2}  ${jpclot3}\n${jpstep1}  ${jpstep2}  ${jpstep3}\n\nResult\n${cjpcwin}`);
      }
      cjpcplaying = false;
    }
    else {
      msg.reply("現在別の場所でColorantJPチャンスが行われています。");
    }
  }
  if (msg.content === "cu!bugreportbtn") {
    if((msg.author.id == 524872647042007067 || msg.author.id == 692980438729228329) && msg.guild.id == 666188622575173652){
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
    await msg.channel.send({content:"【不具合報告へのご協力ありがとうございます】\n下の「不具合報告をする」より、表示されたモーダルに必要事項を記入して送信してください。\n\n__**※このシステムはベータ版であり、今後仕様を変更する場合があります。**__", components:[acrow]});
  }
  else{
    const embed = new Discord.MessageEmbed();
    embed.setAuthor({ name: "エラー", iconURL: "https://cdn.discordapp.com/emojis/919045614724079687.png?size=96" })
    embed.setDescription("あなたにはこのコマンドを実行する権限がありません。\n利用権限が付与されていないか、\nご利用のサーバーでは利用できません。\n\nお困りですか？[サポートサーバーまでどうぞ！](https://discord.gg/VvrBsaq)")
    embed.addField("エラーコード", "FOR_BIDDEN", true)
    embed.setColor("#EB3871")
    await msg.channel.send({ embeds: [embed] });
  }
  }
  if (msg.content === "cu!delerrmsg") {
    if((msg.author.id == 524872647042007067 || msg.author.id == 692980438729228329)){
    
      var fetmsg = await msg.channel.messages.fetch({limit:7,before:993046115580645446});
      var fil = fetmsg.filter(m => m.author.id == 754190285382352920);
      msg.channel.bulkDelete(fil);
      //var succmsg = await msg.channel.send("完了");
      //setTimeout(2000);
      //succmsg.delete();
  }
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

client.on("interactionCreate", async (inter) => {
  if (inter.customId === "testBtn") {
    await inter.reply({ content: `${inter.user.username}さん、こんにちは！`, ephemeral: true });
  }
  if (inter.customId === "testBtn2") {
    await inter.reply({ content: `${inter.user.username}さん、こんにちは！`, ephemeral: false });
  }

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
  if (inter.customId === "pusher1coininput") {
    coinstock -= 1;
    console.log(coinstock);
    const row = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setCustomId("pusher1coininput")
          .setLabel("1枚投入")
          .setStyle("PRIMARY"),
        new Discord.MessageButton()
          .setCustomId("pusher1showcoin")
          .setLabel(`${coinstock}枚`)
          .setStyle("SECONDARY")
          .setDisabled(true),
        new Discord.MessageButton()
          .setCustomId("pusher1exit")
          .setLabel("終了")
          .setStyle("DANGER")
      );
    inter.update({ content: `NORMAL MODE\nSatelliteChallenge : 0`, components: [row] })
  }
  if (inter.customId === "pusher1exit") {
    const row = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setCustomId("pusher1coininput")
          .setLabel("1枚投入")
          .setStyle("PRIMARY")
          .setDisabled(true),
        new Discord.MessageButton()
          .setCustomId("pusher1showcoin")
          .setLabel(`${coinstock}枚`)
          .setStyle("SECONDARY")
          .setDisabled(true),
        new Discord.MessageButton()
          .setCustomId("pusher1exit")
          .setLabel("終了")
          .setStyle("DANGER")
          .setDisabled(true)
      );
    inter.update({ content: `NORMAL MODE\nSatelliteChallenge : 0`, components: [row] })
  }
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
    modal.addComponents(acrow1,acrow2,acrow3,acrow4,acrow5);
    //await inter.reply({ content: `${inter.user.username}さん、こんにちは！`, ephemeral: true });
    inter.showModal(modal);
  }
  if (inter.customId === "bugreportconfirm") {
    inter.reply({content:"不具合報告へのご協力ありがとうございます。\n内容が開発チームに送られました。", ephemeral:true});
    const field = inter.fields;
    let sendmsg = `${inter.member.displayName}#${inter.user.discriminator}(${inter.user.id}) さんからの不具合報告です。\n\n【対象のゲーム】 : ${field.getTextInputValue("bugreportcomp1")}\n【アプリのバージョン】 : ${field.getTextInputValue("bugreportcomp2")}\n【対象のシーン】 : ${field.getTextInputValue("bugreportcomp3")}\n【不具合を発生させるのに必要な操作・反応】 : ${field.getTextInputValue("bugreportcomp4")}\n【不具合の詳細】 : ${field.getTextInputValue("bugreportcomp5")}`;
    let sendmsg2 = sendmsg;
    if(sendmsg.length > 2000){
      sendmsg2 = `${sendmsg.substring(0,1996)}...`;
    }
    client.channels.cache.get("993040671407616020").send(`${sendmsg2}`);
  }
  if (inter.customId === "howbugreport") {
    inter.reply({content:`【対象のゲーム】・
　「ブロック崩し3D」
　「ボタポッチ」
　「スペースプッシャー」
　「CubeAvoid」
　「Colorant Echo」
から選択してください。

【アプリのバージョン】・
各アプリのタイトル画面の右下に書いてあるバージョンを記入してください。

【対象のシーン】・
CubeAvoidなら「ステージ２」や「ステージ１クリア画面」、Colorant Echoなら「Tenth Green」「ColorantJPC」など`, ephemeral:true});
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

// 必要関数
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

function MCCLevelUp(via) {
  if (mccpoks[via] == "30枚") {
    mccpoks[via] = "50枚";
  }
  else if (mccpoks[via] == "50枚") {
    mccpoks[via] = "80枚";
  }
  else if (mccpoks[via] == "80枚") {
    mccpoks[via] = "マウンテンJPC";
  }
  else if (mccpoks[via] == "マウンテンJPC" && mccpoks.filter(val => val == "マウンテンJPC").length > 1) {
    mccpoks[via] = "30枚";
  }
}

function SCCLevelUp(via) {
  if (sccpoks[via] == "30枚") {
    sccpoks[via] = "50枚";
  }
  else if (sccpoks[via] == "50枚") {
    sccpoks[via] = "80枚";
  }
  else if (sccpoks[via] == "80枚") {
    sccpoks[via] = "ソルナJPC";
  }
  else if (sccpoks[via] == "ソルナJPC" && sccpoks.filter(val => val == "ソルナJPC").length > 1) {
    sccpoks[via] = "30枚";
  }
}

let maxmjpupct = 20;
function MJPCJpUp(via) {
  const rdjpup = Math.ceil(Math.random() * maxmjpupct);
  if (rdjpup >= 1 && rdjpup <= 8) {
    mountainjp += 100;
    return "100枚アップ！";
  }
  else if (rdjpup >= 9 && rdjpup <= 13) {
    mountainjp += 200;
    return "200枚アップ！";
  }
  else if (rdjpup >= 14 && rdjpup <= 17) {
    mountainjp += 300;
    return "300枚アップ！";
  }
  else if (rdjpup >= 18 && rdjpup <= 19) {
    mountainjp += 400;
    return "400枚アップ！";
  }
  else if (rdjpup == 20) {
    mountainjp = mountainjp * 2;
    maxmjpupct = 19;
    return "JP2倍！";
  }
}

let maxcjpct = 34;
function CJPCLot(via) {
  const rdjpup = Math.ceil(Math.random() * 254);
  if (rdjpup >= 1 && rdjpup <= 40) {
    // mountainjp += 100;
    return "1";
  }
  else if (rdjpup >= 41 && rdjpup <= 80) {
    // mountainjp += 200;
    return "2";
  }
  else if (rdjpup >= 81 && rdjpup <= 120) {
    // mountainjp += 300;
    return "3";
  }
  else if (rdjpup >= 121 && rdjpup <= 160) {
    // mountainjp += 400;
    return "4";
  }
  else if (rdjpup >= 161 && rdjpup <= 200) {
    // mountainjp += 400;
    return "5";
  }
  else if (rdjpup >= 201 && rdjpup <= 250) {
    // mountainjp += 400;
    return "+15";
  }
  else if (rdjpup >= 251 && rdjpup <= 254) {
    // mountainjp += 400;
    return "JP";
  }
}

client.login(process.env.BOT_TOKEN)
