const {
  User, Client, VoiceChannel, StageChannel,
} = require('discord.js');
const {
  AudioResource,
  PlayerSubscription,
  VoiceConnection,
} = require('@discordjs/voice');
const Queue = require('../Handlers/Queue');
const Player = require('../Handlers/Player');

/**
 * @typedef {Object} DefaultProgressBar
 * @property {String} CompleteIcon Emoji for starting background Same as "Remaining Icon"  | Default -> " ▬ "
 * @property {String} TargetIcon Emoji for Progress Pointer in Bar , Accurate Pointing in Progress Bar  | Default -> " 🔘 "
 * @property {String} RemainingIcon Emoji for Ednding background Same as "Complete Icon"  | Default -> " ▬ "
 * @property {String} StartingIcon Emoji for Starting Bar to make actual Progress Bar | Default -> "Timecodes | "
 * @property {String} EndIcon Emoji for Ending Bar to make actual Progress Bar | Default -> "| Timecodes"
 */
const DefaultProgressBar = {
  CompleteIcon: '▬',
  TargetIcon: '🔘',
  RemainingIcon: '▬',
  StartingIcon: undefined,
  EndIcon: undefined,
};

/**
 * @typedef {Object} DefaultcurrentTimestamp
 * @property {String} track_ms Current Track Duration in Milliseconds But return as String
 * @property {String} totaltrack_ms Total Tracks Duration in Milliseconds But return as String
 * @property {String} previoustracks_ms Previous Track Duration in Milliseconds But return as String
 * @property {String} saved_queue_ms Saved Queue Duration in Milliseconds But return as String
 * @property {String} queue_ms Queue Duration in Milliseconds But return as String
 * @property {String} remainqueue_ms Remaining Queue Duration in Milliseconds But return as String
 * @property {String} human_track Total Tracks Duration in Milliseconds But return as String
 * @property {String} human_totaltrack Human Readable Current Track Duration in "Time-Codes"
 * @property {String} human_previoustracks Human Readable Total Tracks Duration in "Time-Codes"
 * @property {String} human_totalqueue Human Readable Total Queue Duration in "Time-Codes"
 * @property {String} human_saved_queue Human Readable Saved Queue Duration in "Time-Codes"
 * @property {String} human_queue Human Readable Queue Duration in "Time-Codes"
 * @property {String} human_remainqueue Human Readable Remaining Queue Duration in "Time-Codes"
 */

const DefaultcurrentTimestamp = {
  track_ms: '',
  totaltrack_ms: '',
  previoustracks_ms: '',
  totalqueue_ms: '',
  saved_queue_ms: '',
  queue_ms: '',
  remainqueue_ms: '',
  human_track: '',
  human_totaltrack: '',
  human_previoustracks: '',
  human_totalqueue: '',
  human_saved_queue: '',
  human_queue: '',
  human_remainqueue: '',
};

/**
 * @typedef {Object} DefaultPlayerMode
 * @property {String} mode Player Mode name like -> "autoplay"/"repeat"/"loop"/undefined
 * @property {String} type Player Mode type like -> "queue"/"track"
 * @property {String} times Player Mode Work times lin Number | Majourly for Repeat Mode Name
 */

const DefaultPlayerMode = {
  mode: '',
  type: '',
  times: '',
};

/**
 * @typedef {Object} DefaultModesName
 * @property {String} Loop Loop Mode for Queue and Player | "loop"
 * @property {String} Repeat Repeat Mode enum for Queue | "repeat"
 * @property {String} Autoplay AutoPlauy Mode enum for Queue and Player | "autoplay"
 */
const DefaultModesName = {
  Loop: 'loop',
  Repeat: 'repeat',
  Autoplay: 'autoplay',
};

/**
 * @typedef {Object} DefaultModesType
 * @property {String} Track
 * @property {String} Queue
 * @property {String} Off
 */
const DefaultModesType = {
  Track: 'track',
  Queue: 'queue',
  Off: 'off',
};

/**
 * @typedef {Object} DefaultJoinChannelOptions
 * @property {Boolean} force
 */
const DefaultJoinChannelOptions = {
  force: false,
};

/**
 * @typedef {Object} DefaultDisconnectChannelOptions
 * @property {Boolean} destroy
 */
const DefaultDisconnectChannelOptions = {
  destroy: true,
  MusicPlayer: undefined,
  Subscription: undefined,
  Player: undefined,
};

/**
 * @typedef {Object} DefaultExtractorStreamOptions
 * @property {Number} Limit
 * @property {String} Quality
 * @property {String} Cookies
 * @property {Boolean} ByPassYoutubeDLRatelimit
 * @property {String} YoutubeDLCookiesFilePath
 * @property {String[]} Proxy
 */
const DefaultExtractorStreamOptions = {
  Limit: 1,
  Quality: 'high',
  Cookies: undefined,
  ByPassYoutubeDLRatelimit: true,
  YoutubeDLCookiesFilePath: undefined,
  Proxy: undefined,
  UserAgents: undefined,
};

/**
 * @typedef {Object} DefaultTrack
 * @property {Number} Id
 * @property {String} url
 * @property {String} video_Id
 * @property {User} requestedBy
 * @property {String} title
 * @property {String} description
 * @property {Number} duration
 * @property {String} human_duration
 * @property {String} thumbnail
 * @property {String} channelId
 * @property {String} channel_url
 * @property {Number} likes
 * @property {Boolean} is_live
 * @property {Number} dislikes
 */

const DefaultTrack = {
  Id: 0,
  url: undefined,
  video_Id: undefined,
  requestedBy: undefined,
  title: undefined,
  description: undefined,
  duration: 0,
  human_duration: undefined,
  thumbnail: undefined,
  channelId: undefined,
  channel_url: undefined,
  likes: 0,
  is_live: false,
  dislikes: 0,
};

/**
 * @private
 * @typedef {Object} DefaultStream
 * @property {Number} Id
 * @property {String} url
 * @property {String} video_Id
 * @property {User} requestedBy
 * @property {String} title
 * @property {String} description
 * @property {String} custom_extractor
 * @property {String} duration
 * @property {String} human_duration
 * @property {String} preview_stream_url
 * @property {String} stream
 * @property {String} stream_type
 * @property {String} stream_duration
 * @property {String} stream_video_Id
 * @property {Number} stream_human_duration
 * @property {String} orignal_extractor
 * @property {String} thumbnail
 * @property {String} channelId
 * @property {String} channel_url
 * @property {Number} likes
 * @property {Boolean} is_live
 * @property {Number} dislikes
 */

const DefaultStream = {
  Id: 0,
  url: undefined,
  video_Id: undefined,
  title: undefined,
  author: undefined,
  author_link: undefined,
  description: undefined,
  custom_extractor: undefined,
  duration: 0,
  human_duration: undefined,
  preview_stream_url: undefined,
  stream: undefined,
  stream_url: undefined,
  stream_type: undefined,
  stream_duration: 0,
  stream_video_Id: undefined,
  stream_human_duration: undefined,
  orignal_extractor: undefined,
  thumbnail: undefined,
  channelId: undefined,
  channel_url: undefined,
  likes: 0,
  is_live: false,
  dislikes: 0,
  tampered: false,
};

/**
 * @typedef {Object} DefaultChunk
 * @property {Boolean} playlist
 * @property {DefaultTrack[]} tracks
 * @property {DefaultStream[]} streamdatas
 * @property {String} error
 */

const DefaultChunk = {
  playlist: false,
  tracks: [DefaultTrack],
  streamdatas: [DefaultStream],
  error: undefined,
};

/**
 * @typedef {Object} DefaultStreamPacket
 * @property {Client} Client
 * @property {VoiceChannel|StageChannel} VoiceChannel
 * @property {String} extractor
 * @property {DefaultTrack[]} searches
 * @property {DefaultStream[]} tracks
 * @property {PlayerSubscription} subscription
 * @property {any} metadata
 * @property {String} guildId
 * @property {DefaultExtractorStreamOptions} ExtractorStreamOptions
 * @property {Boolean} IgnoreError
 * @property {any} Player
 * @property {Number} volume
 * @property {AudioResource} AudioResource
 * @property {DefaultTrack[]} previousTracks
 */

const DefaultStreamPacket = {
  Client: undefined,
  VoiceChannel: undefined,
  extractor: undefined,
  searches: undefined,
  tracks: undefined,
  subscription: undefined,
  metadata: undefined,
  guildId: undefined,
  ExtractorStreamOptions: DefaultExtractorStreamOptions,
  IgnoreError: undefined,
  Player: undefined,
  volume: 0,
  AudioResource: undefined,
  previousTracks: undefined,
  TrackTimeStamp: undefined,
};

/**
 * @typedef {Object} DefaultFetchOptions
 * @property {Boolean} IgnoreError
 * @property {DefaultExtractorStreamOptions} ExtractorStreamOptions
 * @property {Boolean} NoStreamif
 */

const DefaultFetchOptions = {
  IgnoreError: true,
  ExtractorStreamOptions: DefaultExtractorStreamOptions,
  NoStreamif: false,
};

/**
 * @typedef {Object} DefaultExtractorData
 * @property {Boolean} playlist
 * @property {DefaultStream} tracks
 * @property {String} error
 */
const DefaultExtractorData = {
  playlist: false,
  tracks: DefaultStream,
  error: undefined,
};

/**
 * @typedef {Object} DefaultStreamCreateOptions
 * @property {User} requestedBy
 * @property {Boolean} IgnoreError
 * @property {DefaultExtractorStreamOptions} ExtractorStreamOptions
 */

const DefaultStreamCreateOptions = {
  requestedBy: undefined,
  IgnoreError: true,
  ExtractorStreamOptions: DefaultExtractorStreamOptions,
};

/**
 * @typedef {Object} DefaultJerichoPlayerOptions
 * @property {String} extractor
 * @property {DefaultExtractorStreamOptions} ExtractorStreamOptions
 * @property {Boolean} IgnoreError
 * @property {Boolean} LeaveOnEmpty
 * @property {Boolean} LeaveOnEnd
 * @property {Boolean} LeaveOnBotOnly
 * @property {Number} LeaveOnEmptyTimedout
 * @property {Number} LeaveOnEndTimedout
 * @property {Number} LeaveOnBotOnlyTimedout
 * @property {Boolean} NoMemoryLeakMode
 */

const DefaultJerichoPlayerOptions = {
  extractor: 'play-dl',
  ExtractorStreamOptions: DefaultExtractorStreamOptions,
  IgnoreError: true,
  LeaveOnEmpty: true,
  LeaveOnEnd: true,
  LeaveOnBotOnly: true,
  LeaveOnEmptyTimedout: 0,
  LeaveOnEndTimedout: 0,
  LeaveOnBotOnlyTimedout: 0,
  NoMemoryLeakMode: false,
};

/**
 * @typedef {Object} DefaultQueueCreateOptions
 * @property {String} extractor
 * @property {any} metadata
 * @property {DefaultExtractorStreamOptions} ExtractorStreamOptions
 * @property {Boolean} IgnoreError
 * @property {Boolean} LeaveOnEmpty
 * @property {Boolean} LeaveOnEnd
 * @property {Boolean} LeaveOnBotOnly
 * @property {Number} LeaveOnEmptyTimedout
 * @property {Number} LeaveOnEndTimedout
 * @property {Number} LeaveOnBotOnlyTimedout
 * @property {Boolean} NoMemoryLeakMode
 */

const DefaultQueueCreateOptions = {
  extractor: 'play-dl',
  metadata: null,
  ExtractorStreamOptions: DefaultExtractorStreamOptions,
  IgnoreError: true,
  LeaveOnEmpty: true,
  LeaveOnEnd: true,
  LeaveOnBotOnly: true,
  LeaveOnEmptyTimedout: 0,
  LeaveOnEndTimedout: 0,
  LeaveOnBotOnlyTimedout: 0,
  NoMemoryLeakMode: false,
};

/**
 * @typedef {Object} DefaultUserDrivenAudioFilters
 * @property {Boolean} bassboost_low
 * @property {Boolean} bassboost
 * @property {Boolean} bassboost_high
 * @property {Boolean} "3D"
 * @property {Boolean} "8D"
 * @property {Boolean} vaporwave
 * @property {Boolean} nightcore
 * @property {Boolean} phaser
 * @property {Boolean} tremolo
 * @property {Boolean} vibrato
 * @property {Boolean} reverse
 * @property {Boolean} treble
 * @property {Boolean} normalizer
 * @property {Boolean} normalizer2
 * @property {Boolean} surrounding
 * @property {Boolean} pulsator
 * @property {Boolean} subboost
 * @property {Boolean} karaoke
 * @property {Boolean} flanger
 * @property {Boolean} gate
 * @property {Boolean} haas
 * @property {Boolean} mcompand
 * @property {Boolean} mono
 * @property {Boolean} mstlr
 * @property {Boolean} mstrr
 * @property {Boolean} compressor
 * @property {Boolean} expander
 * @property {Boolean} softlimiter
 * @property {Boolean} chorus
 * @property {Boolean} chorus2d
 * @property {Boolean} chorus3d
 * @property {Boolean} fadein
 * @property {Boolean} dim
 * @property {Boolean} earrape
 * @property {Boolean} echo
 */

const DefaultUserDrivenAudioFilters = {
  bassboost_low: false,
  bassboost: false,
  bassboost_high: false,
  '3D': false,
  '8D': false,
  vaporwave: false,
  nightcore: false,
  phaser: false,
  tremolo: false,
  vibrato: false,
  reverse: false,
  treble: false,
  normalizer: false,
  normalizer2: false,
  surrounding: false,
  pulsator: false,
  subboost: false,
  karaoke: false,
  flanger: false,
  gate: false,
  haas: false,
  mcompand: false,
  mono: false,
  mstlr: false,
  mstrr: false,
  compressor: false,
  expander: false,
  softlimiter: false,
  chorus: false,
  chorus2d: false,
  chorus3d: false,
  fadein: false,
  dim: false,
  earrape: false,
  echo: false,
};

/**
 * @private
 * @typedef {Object} DefaultAudioFilters
 * @property {String} bassboost_low
 * @property {String} bassboost
 * @property {String} bassboost_high
 * @property {String} "3D"
 * @property {String} "8D"
 * @property {String} vaporwave
 * @property {String} nightcore
 * @property {String} phaser
 * @property {String} tremolo
 * @property {String} vibrato
 * @property {String} reverse
 * @property {String} treble
 * @property {String} normalizer
 * @property {String} normalizer2
 * @property {String} surrounding
 * @property {String} pulsator
 * @property {String} subboost
 * @property {String} karaoke
 * @property {String} flanger
 * @property {String} gate
 * @property {String} haas
 * @property {String} mcompand
 * @property {String} mono
 * @property {String} mstlr
 * @property {String} mstrr
 * @property {String} compressor
 * @property {String} expander
 * @property {String} softlimiter
 * @property {String} chorus
 * @property {String} chorus2d
 * @property {String} chorus3d
 * @property {String} fadein
 * @property {String} dim
 * @property {String} earrape
 * @property {String} echo
 */

const DefaultAudioFilters = {
  bassboost_low: 'bass=g=15:f=110:w=0.3',
  bassboost: 'bass=g=20:f=110:w=0.3',
  bassboost_high: 'bass=g=30:f=110:w=0.3',
  '3d': 'apulsator=hz=0.125',
  '8D': 'apulsator=hz=0.09',
  vaporwave: 'aresample=48000,asetrate=48000*0.8',
  nightcore: 'aresample=48000,asetrate=48000*1.25',
  phaser: 'aphaser=in_gain=0.4',
  tremolo: 'tremolo',
  vibrato: 'vibrato=f=6.5',
  reverse: 'areverse',
  treble: 'treble=g=5',
  normalizer: 'dynaudnorm=g=101',
  normalizer2: 'acompressor',
  surrounding: 'surround',
  pulsator: 'apulsator=hz=1',
  subboost: 'asubboost',
  karaoke: 'stereotools=mlev=0.03',
  flanger: 'flanger',
  gate: 'agate',
  haas: 'haas',
  mcompand: 'mcompand',
  mono: 'pan=mono|c0=.5*c0+.5*c1',
  mstlr: 'stereotools=mode=ms>lr',
  mstrr: 'stereotools=mode=ms>rr',
  compressor: 'compand=points=-80/-105|-62/-80|-15.4/-15.4|0/-12|20/-7.6',
  expander:
    'compand=attacks=0:points=-80/-169|-54/-80|-49.5/-64.6|-41.1/-41.1|-25.8/-15|-10.8/-4.5|0/0|20/8.3',
  softlimiter:
    'compand=attacks=0:points=-80/-80|-12.4/-12.4|-6/-8|0/-6.8|20/-2.8',
  chorus: 'chorus=0.7:0.9:55:0.4:0.25:2',
  chorus2d: 'chorus=0.6:0.9:50|60:0.4|0.32:0.25|0.4:2|1.3',
  chorus3d: 'chorus=0.5:0.9:50|60|40:0.4|0.32|0.3:0.25|0.4|0.3:2|2.3|1.3',
  fadein: 'afade=t=in:ss=0:d=10',
  dim:
    "afftfilt=\"'real=re * (1-clip((b/nb)*b,0,1))':imag='im * (1-clip((b/nb)*b,0,1))'\"",
  earrape: 'channelsplit,sidechaingate=level_in=64',
  echo: 'aecho=0.8:0.9:1000:0.3',
};

/**
 * @typedef {Object} DefaultPlayerEvents
 * @property {Object} error Player Error Events and should be handled Properly
 * @property {Object} channelEmpty When Noone is there in Channel
 * @property {Object} botDisconnect If Bot got disconnected from Voice Channel
 * @property {Object} trackEnd Event for Song got Ended Perfectly
 * @property {Object} trackStart Event for Starting of Songs
 * @property {Object} connectionError Connection Error for Join Channel Configs and Methods
 * @property {Boolean} playlistAdd Event for if Playlist has been Parsed and Tracks will be returned
 * @property {Object} tracksAdd Event for Tracks Added currently if playlist got stuck and even single Track will also emit this event
 */

const DefaultPlayerEvents = {
  error: {
    message: '',
    queue: Queue || Player || undefined,
    extradata: undefined,
  },

  channelEmpty: {
    queue: Queue,
    voiceChannel: VoiceChannel || StageChannel || undefined,
  },

  botDisconnect: {
    queue: Queue,
    voiceChannel: VoiceChannel || StageChannel || undefined,
  },

  trackEnd: {
    queue: Queue,
    track: DefaultTrack,
  },

  trackStart: {
    queue: Queue,
    track: DefaultTrack,
  },

  connectionError: {
    message: '',
    queue: Queue,
    connection: VoiceConnection || undefined,
    guildId: String,
  },

  playlistAdd: {
    queue: Queue,
    tracks: [DefaultTrack],
  },

  tracksAdd: {
    queue: Queue,
    tracks: [DefaultTrack],
  },
};

/**
 * @typedef {Object} DefaultSearchResults
 * @property {Boolean} playlist Boolean value if Query was Playlist "true/false"
 * @property {Array<DefaultTrack>} tracks Array of tracks on Positive Search Results from extractors
 */

const DefaultSearchResults = {
  playlist: false,
  tracks: [DefaultTrack],
};

module.exports = {
  DefaultQueueCreateOptions,
  DefaultJerichoPlayerOptions,
  DefaultExtractorStreamOptions,
  DefaultStreamCreateOptions,
  DefaultProgressBar,
  DefaultChunk,
  DefaultStream,
  DefaultTrack,
  DefaultStreamPacket,
  DefaultDisconnectChannelOptions,
  DefaultJoinChannelOptions,
  DefaultExtractorData,
  DefaultFetchOptions,
  DefaultModesName,
  DefaultModesType,
  DefaultPlayerMode,
  DefaultcurrentTimestamp,
  DefaultPlayerEvents,
  DefaultUserDrivenAudioFilters,
  DefaultAudioFilters,
  DefaultSearchResults,
};
