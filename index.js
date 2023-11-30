const { Client, GatewayIntentBits } = require("discord.js");

const { EmbedBuilder } = require("discord.js");

const settings = {
  prefix: "!",
  token:
    "MTEwODMzNTQ4MTM3ODMxNjMyOQ.Gs1sNs.OHy1bAlaW4c1Oe23FDmvzfTC_661rCMCMJ1RmY",
};

// On crée une instance du client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages, // Nous autorise à accéder aux messages
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// On agit quand le bot est "prêt"
client.on("ready", () => {
  console.log("Bot connecté en tant que " + client.user.tag);

  client.user.setPresence({
    activities: [
      {
        name: "vous assistez dans vos taches",
      },
    ],
    status: "dnd",
  });
});

const { Player } = require("discord-music-player");
const player = new Player(client);

client.player = player;
const { RepeatMode } = require("discord-music-player");

client.on("messageCreate", async (message) => {
  const args = message.content
    .slice(settings.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift();

  let guildQueue = client.player.getQueue(message.guild.id);

  if (command === "play") {
    let queue = client.player.createQueue(message.guild.id);
    await queue.join(message.member.voice.channel);

    try {
      let song = await queue.play(args.join(" "));
      console.log("Started playing song:", song);

      queue.connection.on("error", (error) => {
        console.error("Playback error:", error);
      });

      queue.connection.on("finish", () => {
        console.log("Song playback finished");
      });

      queue.connection.on("end", () => {
        console.log("Song playback ended");
      });

      queue.connection.on("disconnect", () => {
        console.log("Bot disconnected from voice channel");
      });
    } catch (error) {
      console.error("Error during song playback:", error);
      if (!guildQueue) queue.stop();
    }
  }

  if (command === "playlist") {
    let queue = client.player.createQueue(message.guild.id);
    await queue.join(message.member.voice.channel);
    let song = await queue.playlist(args.join(" ")).catch((err) => {
      console.log(err);
      if (!guildQueue) queue.stop();
    });
  }

  if (command === "skip") {
    guildQueue.skip();
  }

  if (command === "stop") {
    guildQueue.stop();
  }

  if (command === "removeLoop") {
    guildQueue.setRepeatMode(RepeatMode.DISABLED); // or 0 instead of RepeatMode.DISABLED
  }

  if (command === "toggleLoop") {
    guildQueue.setRepeatMode(RepeatMode.SONG); // or 1 instead of RepeatMode.SONG
  }

  if (command === "toggleQueueLoop") {
    guildQueue.setRepeatMode(RepeatMode.QUEUE); // or 2 instead of RepeatMode.QUEUE
  }

  if (command === "setVolume") {
    guildQueue.setVolume(parseInt(args[0]));
  }

  if (command === "getVolume") {
    console.log(guildQueue.volume);
  }

  if (command === "clearQueue") {
    guildQueue.clearQueue();
  }

  if (command === "getQueue") {
    console.log(guildQueue);
  }

  if (command === "nowPlaying") {
    console.log(`Now playing: ${guildQueue.nowPlaying}`);
  }

  if (command === "pause") {
    guildQueue.setPaused(true);
  }

  if (command === "resume") {
    guildQueue.setPaused(false);
  }

  if (command === "remove") {
    guildQueue.remove(parseInt(args[0]));
  }

  if (command === "aide") {
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Aide")
      .setDescription("Voici la liste des commandes pour le bot Music4000")
      .setThumbnail("https://imgur.com/cm2J2rL.png")
      .addFields(
        { name: "lancer une musique", value: "``!play``" },
        { name: "pour mettre des musiques à la suite", value: "``!playlist``" },
        { name: "pour passer la musique", value: "``!skip``" },
        { name: "pour arreter la musique", value: "``!stop``" },
        { name: "pour arreter la lecture en boucle", value: "``!removeLoop``" },
        {
          name: "active la lecture en boucle (musique)",
          value: "``!toggleLoop``",
        },
        { name: "pour mettre des musiques à la suite", value: "``!playlist``" },
        { name: "pour mettre des musiques à la suite", value: "``!playlist``" },
        { name: "pour mettre des musiques à la suite", value: "``!playlist``" },
        { name: "pour mettre des musiques à la suite", value: "``!playlist``" },
        { name: "pour mettre des musiques à la suite", value: "``!playlist``" }
      )
      .setTimestamp();
    message.channel.send({ embeds: [exampleEmbed] });
  }
});

//       message.channel.send(
//         "Voici la documentation du bot\n
//          : \n
//          : \n
//          : \n
//          : \n
//         ! : \n
//         !toggleQueueLoop : active la lecture en boucle (playlist)\n
//         !setVolume : pour définir le volume de la musique\n
//         !getVolume : voir le volume de la musique\n
//         !clearQueue : pour supprimer les prochaines musiques de la playlist\n
//         !getQueue : voir la playlist\n
//         !nowPlaying : voir la musique actuelle\n
//         !pause : mettre la musique sur pause\n
//         !resume : relancer la musique\n
//         !remove : enlever la musique"
// );

// On connecte le bot
client.login(settings.token);
