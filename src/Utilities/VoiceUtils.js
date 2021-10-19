const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

async function join(
  Client,
  Channel,
  JoinChannelOptions = {
    force: false,
  },
) {
  let VoiceConnection = getVoiceConnection(Channel.guild.id);
  if (VoiceConnection && !JoinChannelOptions.force) return VoiceConnection;

  VoiceConnection = joinVoiceChannel({
    channelId: Channel.id,
    guildId: Channel.guild.id,
    adapterCreator: Channel.guild.voiceAdapterCreator,
  });
  Channel = Client.channels.cache.get(`${Channel.id}`)
    ?? (await Client.channels.fetch(`${Channel.id}`));
  if (
    Channel.guild.me
    && Channel.guild.me.voice
    && Channel.type === 'GUILD_STAGE_VOICE'
  ) {
    Channel.guild.me.voice.setSuppressed(false).catch((err) => VoiceConnection);
    return VoiceConnection;
  } return VoiceConnection;
}

function disconnect(
  GuildId,
  DisconnectChannelOptions = {
    destroy: true,
  },
) {
  const VoiceConnection = getVoiceConnection(GuildId);
  if (VoiceConnection && DisconnectChannelOptions.destroy) { return VoiceConnection.destroy(true); }
  if (VoiceConnection) return VoiceConnection.disconnect();
  throw Error('Voice Connection is not Found to disconnect/destroy');
}

module.exports = { join, disconnect };
