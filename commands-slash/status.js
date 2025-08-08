const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const os = require("os");

module.exports = {
  data: new SlashCommandBuilder().setName("status").setDescription("See the status of the Bot"),

  async execute(client, interaction) {
    const embed = new EmbedBuilder().setColor(0x990000).setTitle("💻 Gathering all the needed data...");
    try {
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }

    function formatUptime(seconds) {
      const days = Math.floor(seconds / (60 * 60 * 24));
      const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((seconds % (60 * 60)) / 60);
      const secs = Math.floor(seconds % 60);
      return `${days}d, ${hours}h, ${minutes}m, ${secs}s`;
    }

    function formatMemory(total, free) {
      const totalGB = Math.round((total / (1024 * 1024 * 1024)) * 100) / 100;
      const usedGB = Math.round(((total - free) / (1024 * 1024 * 1024)) * 100) / 100;
      return `${usedGB}GB/${totalGB}GB`;
    }

    function cpuUsage() {
      const cpus = os.cpus();
      let user = 0;
      let system = 0;
      let idle = 0;

      for (const cpu of cpus) {
        user += cpu.times.user;
        system += cpu.times.sys;
        idle += cpu.times.idle;
      }

      const total = user + system + idle;
      return { user, system, idle, total };
    }

    const firstCPU = cpuUsage();

    setTimeout(async () => {
      const secondCPU = cpuUsage();

      const totalDiff = secondCPU.total - firstCPU.total;
      const idleDiff = secondCPU.idle - firstCPU.idle;

      let cpuPercent = 0;
      if (totalDiff > 0) {
        cpuPercent = Math.round(100 * (1 - idleDiff / totalDiff) * 10) / 10;
      }

      let totalMembers = 0;
      client.guilds.cache.forEach((guild) => {
        totalMembers += guild.memberCount;
      });

      embed
        .setColor(0x990000)
        .setTitle("⚙️ Server status")
        .setDescription(["Here you can see all of my hardware and Discord's stats"].join(""))
        .addFields({
          name: "**Discord stats:**",
          value: [
            "Total servers: `" + client.guilds.cache.size + "`",
            "Total users: `" + totalMembers + "`",
            "Latency to Discord: `" + client.ws.ping + "ms`",
          ].join("\n"),
          inline: false,
        })
        .addFields({
          name: "**Hardware stats:**",
          value: [
            "OS: `" + os.type() + "`",
            "OS Architecture: `" + os.arch() + "`",
            "Kernel version: `" + os.release() + "`",
            "System uptime: `" + formatUptime(os.uptime()) + "`",
            "CPU usage: `" + cpuPercent + "%`",
            "RAM usage: `" + formatMemory(os.totalmem(), os.freemem()) + "`",
          ].join("\n"),
          inline: false,
        });

      try {
        return await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }, 2000);
  },
};
