import {
  CommandDefinition,
  TicketPanelConfig,
  TicketRecord,
  StaffPointUser,
  AuditLogEntry,
  IPWhitelistEntry,
  UserSession,
  ModerationSettings,
  BotActivityStats,
  ServerRole,
  ServerDetails
} from '../types/bot';

const BOT_STORAGE_KEY = 'probot_ops_bot_data_v1';

export const OPS_SERVER_ROLES: ServerRole[] = [
  { id: '1415773466715750460', name: '👑 Owner / مالك السيرفر', color: '#ff0055', position: 100, category: 'management', memberCount: 1, isManagement: true },
  { id: '1415773466715750461', name: '🔴 Management / إدارة عليا', color: '#ef4444', position: 99, category: 'management', memberCount: 3, isManagement: true },
  { id: '1487083076713713787', name: '🟠 High Council / مجلس القيادة', color: '#f97316', position: 95, category: 'management', memberCount: 5, isManagement: true },
  { id: '1415773466715750459', name: '🟡 Head Admin / رئيس الإداريين', color: '#eab308', position: 90, category: 'management', memberCount: 4, isManagement: true },
  { id: '1415773466715750458', name: '🟢 Administrator / مدير عام', color: '#10b981', position: 85, category: 'management', memberCount: 8, isManagement: true },
  { id: '1485358712880369808', name: '🔵 Senior Moderator / مشرف متقدم', color: '#2563eb', position: 82, category: 'staff', memberCount: 10 },
  { id: '1387461999146827858', name: '🟣 Staff Team / طاقم الإشراف', color: '#8b5cf6', position: 80, category: 'staff', memberCount: 16 },
  { id: '1476256575634149447', name: '🔷 Support / دعم فني', color: '#0284c7', position: 75, category: 'staff', memberCount: 12 },
  { id: '1415773466715750457', name: '💠 Moderator / مشرف معتمد', color: '#0d9488', position: 70, category: 'staff', memberCount: 18 },
  { id: '1415773466715750456', name: '🟪 Trial Mod / مشرف متدرب', color: '#9333ea', position: 65, category: 'staff', memberCount: 6 },
  { id: '1415773466715750455', name: '💎 Server Booster / داعم السيرفر', color: '#f43f5e', position: 55, category: 'community', memberCount: 34 },
  { id: '1415773466715750454', name: '⭐ VIP Member / عضو مميز', color: '#eab308', position: 50, category: 'community', memberCount: 85 },
  { id: '1415773466715750453', name: '🔥 Active Member / متفاعل متألق', color: '#06b6d4', position: 45, category: 'community', memberCount: 210 },
  { id: '1415773466715750452', name: '🏆 Level 50+ / رتبة لفل 50', color: '#db2777', position: 40, category: 'community', memberCount: 64 },
  { id: '1415773466715750451', name: '🎯 Level 20+ / رتبة لفل 20', color: '#8b5cf6', position: 35, category: 'community', memberCount: 340 },
  { id: '1359738865144954981', name: '👥 Member / عضو السيرفر', color: '#10b981', position: 25, category: 'community', memberCount: 1220 },
  { id: '1415773466715750450', name: '🌱 Newcomer / عضو جديد', color: '#64748b', position: 20, category: 'community', memberCount: 240 },
  { id: '1514040527899594762', name: '⛓️ Prisoner / سجين إداري', color: '#475569', position: 10, category: 'penalty', memberCount: 6 },
  { id: '1415773466715750449', name: '🔇 Muted / مكتوم عن الشات', color: '#334155', position: 8, category: 'penalty', memberCount: 3 },
  { id: '1491088654318174458', name: '🚫 Fired / مفصول من الإدارة', color: '#1e293b', position: 5, category: 'penalty', memberCount: 4 },
  { id: '@everyone', name: '🌐 @everyone / الجميع', color: '#94a3b8', position: 0, category: 'community', memberCount: 1482 }
];

export const INITIAL_SERVER_DETAILS: ServerDetails = {
  guildId: '1415773466715750450',
  name: 'OPS Community | السيرفر الرسمي',
  icon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop&crop=face',
  totalMembers: 1482,
  onlineMembers: 384,
  idleMembers: 96,
  dndMembers: 72,
  offlineMembers: 930,
  botsCount: 14,
  rolesCount: 21,
  channelsCount: 42,
  boostLevel: 2,
  boostCount: 11,
  ownerTag: 'Eyad#0001 (Owner)',
  createdDate: '15/08/2023'
};

export const INITIAL_COMMANDS: CommandDefinition[] = [
  {
    key: 'بان',
    label: 'بان (حظر عضو)',
    description: 'حظر عضو من السيرفر مع التحقق من الهرم الإداري وصلاحيات البوت',
    category: 'moderation',
    enabled: true,
    aliases: ['!بان', 'بان', '!ban', 'ban', 'حظر'],
    allowedRoles: ['1415773466715750461', '1487083076713713787'],
    allowedPermissions: ['Administrator', 'BanMembers'],
    responseType: 'reply',
    customReply: '**تم حظر {target} من السيرفر** <:access:1547213227476262974>',
    cooldownSec: 5,
    actionPointsReward: 0
  },
  {
    key: 'كيك',
    label: 'كيك (طرد عضو)',
    description: 'طرد عضو من السيرفر بموجب الصلاحيات والهرم الرتبي',
    category: 'moderation',
    enabled: true,
    aliases: ['!كيك', 'كيك', '!kick', 'kick', 'طرد'],
    allowedRoles: ['1415773466715750461', '1487083076713713787', '1387461999146827858'],
    allowedPermissions: ['Administrator', 'KickMembers'],
    responseType: 'reply',
    customReply: '**تم طرد {target} من السيرفر** <:access:1547213227476262974>',
    cooldownSec: 5,
    actionPointsReward: 0
  },
  {
    key: 'ارجع',
    label: 'ارجع (فك حظر عضو)',
    description: 'فك الحظر عن عضو محظور باستخدام الآيدي الخاص به',
    category: 'moderation',
    enabled: true,
    aliases: ['!ارجع', 'ارجع', '!unban', 'فك-حظر'],
    allowedRoles: ['1415773466715750461', '1487083076713713787'],
    allowedPermissions: ['Administrator', 'BanMembers'],
    responseType: 'reply',
    customReply: '**تم فك الحظر عن العضو بنجاح** <:access:1547213227476262974>',
    cooldownSec: 5,
    actionPointsReward: 0
  },
  {
    key: 'رول',
    label: 'رول (إعطاء/سحب رتبة)',
    description: 'إعطاء أو سحب رتبة معينة لعضو حسب الصلاحيات المعطاة',
    category: 'roles',
    enabled: true,
    aliases: ['!رول', 'رول', '!role', 'role', 'رتبة'],
    allowedRoles: ['1415773466715750461', '1487083076713713787', '1387461999146827858'],
    allowedPermissions: ['Administrator', 'ManageRoles'],
    responseType: 'reply',
    customReply: '**تم تعديل الرول {role} للعضو {target} بنجاح** <:access:1547213227476262974>',
    cooldownSec: 3,
    actionPointsReward: 0
  },
  {
    key: 'فصل',
    label: 'فصل (فصل إداري وسحب الرتب)',
    description: 'فصل إداري وسحب جميع رتب الإدارة وإعطائه رتبة المفصول',
    category: 'moderation',
    enabled: true,
    aliases: ['!فصل', 'فصل', '!fire', 'طرد-اداري'],
    allowedRoles: ['1415773466715750461', '1487083076713713787'],
    allowedPermissions: ['Administrator'],
    responseType: 'reply',
    customReply: '**تم فصل {target} وازالة رتب الإدارة وإعطائه رتبة الفصل بنجاح** <:access:1547213227476262974>',
    cooldownSec: 10,
    actionPointsReward: 0
  },
  {
    key: 'تحذير',
    label: 'تحذير (تحذير عضو)',
    description: 'فتح قائمة أسباب التحذير الرسمية وإضافة نقاط تحذير للمشرف',
    category: 'moderation',
    enabled: true,
    aliases: ['!تحذير', 'تحذير', '!warn', 'warn', 'انذار'],
    allowedRoles: ['1387461999146827858', '1476256575634149447'],
    allowedPermissions: ['Administrator', 'ModerateMembers'],
    responseType: 'container',
    customReply: '**اختار سبب تحذير {target}**',
    cooldownSec: 3,
    actionPointsReward: 1
  },
  {
    key: 'تحذيرات',
    label: 'تحذيرات (عرض تحذيرات عضو)',
    description: 'استعراض سجل التحذيرات الفعالة الخاصة بعضو معين',
    category: 'moderation',
    enabled: true,
    aliases: ['!تحذيرات', 'تحذيرات', '!warnings', 'انذارات'],
    allowedRoles: ['1387461999146827858', '1476256575634149447'],
    allowedPermissions: ['ModerateMembers'],
    responseType: 'reply',
    customReply: '### 📋 تحذيرات العضو {target}',
    cooldownSec: 3,
    actionPointsReward: 0
  },
  {
    key: 'شيل',
    label: 'شيل (حذف تحذير)',
    description: 'حذف تحذير محدد بالرقم من سجل تحذيرات العضو',
    category: 'moderation',
    enabled: true,
    aliases: ['!شيل', 'شيل', '!unwarn', 'مسح-تحذير'],
    allowedRoles: ['1415773466715750461', '1487083076713713787'],
    allowedPermissions: ['Administrator'],
    responseType: 'reply',
    customReply: '**تم إزالة التحذير رقم {num} بنجاح** <:access:1547213227476262974>',
    cooldownSec: 3,
    actionPointsReward: 0
  },
  {
    key: 'سجن',
    label: 'سجن (سجن عضو)',
    description: 'سحب رتب العضو وإعطائه رتبة السجن المحددة مع قائمة الأسباب',
    category: 'moderation',
    enabled: true,
    aliases: ['!سجن', 'سجن', '!prison', 'jail', 'حبس'],
    allowedRoles: ['1415773466715750461', '1487083076713713787', '1387461999146827858'],
    allowedPermissions: ['Administrator', 'ManageRoles'],
    responseType: 'container',
    customReply: '**اختار سبب سجن {target}**',
    cooldownSec: 5,
    actionPointsReward: 3
  },
  {
    key: 'عفو',
    label: 'عفو (فك السجن)',
    description: 'إزالة رتبة السجن عن العضو وإرجاع رتبة الميمبر الطبيعية',
    category: 'moderation',
    enabled: true,
    aliases: ['!عفو', 'عفو', '!pardon', 'unjail', 'فك-سجن'],
    allowedRoles: ['1415773466715750461', '1487083076713713787'],
    allowedPermissions: ['Administrator'],
    responseType: 'reply',
    customReply: '**تم عمل عفو عن العضو {target} وإزالة رتبة السجن وإرجاع رتبة الميمبر بنجاح** <:access:1547213227476262974>',
    cooldownSec: 5,
    actionPointsReward: 0
  },
  {
    key: 'تايم',
    label: 'تايم (إعطاء تايم أوت)',
    description: 'إعطاء مهلة صمت (Timeout) مع تحديد المدة والسبب عبر نافذة مخصصة',
    category: 'moderation',
    enabled: true,
    aliases: ['!تايم', 'تايم', '!timeout', 'mute', 'صمت'],
    allowedRoles: ['1387461999146827858', '1476256575634149447'],
    allowedPermissions: ['ModerateMembers'],
    responseType: 'modal',
    customReply: '**اختار مدة التايم ل {target}** <:by_ops_116:1484226095610986679>',
    cooldownSec: 3,
    actionPointsReward: 2
  },
  {
    key: 'انتايم',
    label: 'انتايم (فك التايم أوت)',
    description: 'فك التايم أوت ورفع الحظر الصوتي والكتابي عن العضو',
    category: 'moderation',
    enabled: true,
    aliases: ['!انتايم', 'انتايم', '!untimeout', 'انتيام', 'فك-تايم'],
    allowedRoles: ['1387461999146827858', '1476256575634149447'],
    allowedPermissions: ['ModerateMembers'],
    responseType: 'reply',
    customReply: '**تم فك التايم عن العضو {target} بنجاح** <:access:1547213227476262974>',
    cooldownSec: 3,
    actionPointsReward: 0
  },
  {
    key: 'نقاطي',
    label: 'نقاطي (عرض نقاطك)',
    description: 'عرض رصيد نقاط الإشراف الحالية الخاصة بالإداري',
    category: 'points',
    enabled: true,
    aliases: ['!نقاطي', 'نقاطي', '!mypoints', 'نقاطي-انا'],
    allowedRoles: ['1387461999146827858', '1476256575634149447'],
    allowedPermissions: [],
    responseType: 'reply',
    customReply: '**عدد نقاطك الحاليه هيا "{points}"** <:white_money_nc:1542652571427012658>',
    cooldownSec: 3,
    actionPointsReward: 0
  },
  {
    key: 'نقاط',
    label: 'نقاط (توب نقاط الإدارة)',
    description: 'عرض قائمة أعلى 10 إداريين حاصلين على نقاط في الخادم',
    category: 'points',
    enabled: true,
    aliases: ['!نقاط', 'نقاط', '!top', 'توب', 'ليدربورد'],
    allowedRoles: ['1387461999146827858', '1476256575634149447'],
    allowedPermissions: [],
    responseType: 'container',
    customReply: '## نقاط الاداريين في خادم OPS',
    cooldownSec: 5,
    actionPointsReward: 0
  },
  {
    key: 'رولات',
    label: 'رولات (إعطاء حزمة رتب)',
    description: 'إعطاء رتبة أو سلسلة رتب محصورة بين رتبتين للعضو',
    category: 'roles',
    enabled: true,
    aliases: ['!رولات', 'رولات', '!roles', 'باكج-رتب'],
    allowedRoles: ['1415773466715750461', '1487083076713713787'],
    allowedPermissions: ['Administrator', 'ManageRoles'],
    responseType: 'reply',
    customReply: '**تمام, هات ايدي الرتبه او منشن الرتبه الي انت عايز تضيفها ل {target}**',
    cooldownSec: 10,
    actionPointsReward: 0
  },
  {
    key: 'add',
    label: 'add (إضافة عضو للتكت)',
    description: 'إضافة عضو جديد لرؤية والمشاركة داخل التذكرة الحالية',
    category: 'tickets',
    enabled: true,
    aliases: ['!add', 'add', '!اضافة', 'اضف'],
    allowedRoles: ['1387461999146827858', '1476256575634149447'],
    allowedPermissions: [],
    responseType: 'reply',
    customReply: '**تمت إضافة {target} إلى التكت بنجاح** <:access:1547213227476262974>',
    cooldownSec: 2,
    actionPointsReward: 0
  },
  {
    key: 'delete',
    label: 'delete (حذف التكت)',
    description: 'حذف التذكرة الحالية مع حفظ السجل والترانسكربت النهائي',
    category: 'tickets',
    enabled: true,
    aliases: ['!delete', 'delete', '!حذف', 'close', '!close'],
    allowedRoles: ['1387461999146827858', '1476256575634149447'],
    allowedPermissions: ['Administrator'],
    responseType: 'reply',
    customReply: '**جاري حذف التكت وحفظ الأرشيف** <:access:1547213227476262974>',
    cooldownSec: 2,
    actionPointsReward: 0
  }
];

export const INITIAL_TICKET_CONFIG: TicketPanelConfig = {
  panelTitle: 'الدعم الفني | OPS Support Center',
  panelDescription:
    '[📌] | **للحصول على مساعدة، اضغط على الزر أدناه لفتح تذكرة .**\n\nتواصل مباشرة مع الطاقم الإداري لحل استفساراتك ومشكلاتك بأسرع وقت ممكن.',
  panelNotes: [
    'يرجي عدم ازعاج طاقم الدعم اثناء الانتظار',
    'ممنوع التعامل بطريقه فظه مع الطاقم الاداري',
    'ممنوع فتح التكت للاستهبال وتضييع الوقت'
  ],
  buttonLabel: 'Create Ticket',
  buttonEmoji: '🎫',
  buttonColor: 'Primary',
  channelId: '1551238208216506559',
  categoryId: '1384340024849465354',
  claimButtonLabel: 'استلام',
  claimButtonEmoji: '⚡',
  claimButtonColor: 'Success',
  imageUrl:
    'https://media.discordapp.net/attachments/1387374026917286058/1492314189627265288/2-1.png?ex=6ab26ea4&is=6ab11d24&hm=38c150934198728b1e7926d66bb0bbdc5a6374d56e40a0e5bc11e6951771302c&=&format=webp&quality=lossless',
  welcomeMessage:
    '**Please Wait For :**\n- **<@&1387461999146827858> <@&1476256575634149447>**\n\n`•` **حــيــاك الله فـي الــدعــم الـفـنــي لــ خـادم OPS**\n`•` **هـنـا انت في تواصل مـع الدعم الفني يرجي شرح مشكلتك بالتفصيل**\n\n༺═────────═༻\n\n`#` | **يرجى الإنتظار قليلا لــ مجيء طاقم الدعم**',
  ticketNameFormat: 'ticket-{username}',
  requireReason: true,
  supportRoleIds: ['1476256575634149447'],
  staffRoleIds: ['1387461999146827858', '1415773466715750461', '1487083076713713787']
};

export const INITIAL_MODERATION: ModerationSettings = {
  antiSpam: true,
  antiSpamThreshold: 5,
  antiMassMention: true,
  maxMentions: 4,
  linkFilter: true,
  badWordsFilter: true,
  badWordsList: ['سب', 'قذف', 'سيرفر', 'discord.gg/', 'شتم'],
  prisonRoleId: '1514040527899594762',
  memberRoleId: '1359738865144954981',
  fireRole1Id: '1476256575634149447',
  fireRole2Id: '1485358712880369808',
  firedRoleId: '1491088654318174458',
  actionPoints: {
    ticket_claim: 3,
    warning: 1,
    timeout: 2,
    prison: 3
  },
  warningReasons: {
    warning_room: { label: 'روم غير مخصص', durationText: '3 أيام', durationMs: 3 * 24 * 60 * 60 * 1000 },
    warning_spam: { label: 'سبام', durationText: 'يومين', durationMs: 2 * 24 * 60 * 60 * 1000 },
    warning_insult: { label: 'سب', durationText: 'أسبوع', durationMs: 7 * 24 * 60 * 60 * 1000 },
    warning_promo: { label: 'ترويج', durationText: 'أسبوع', durationMs: 7 * 24 * 60 * 60 * 1000 }
  }
};

export const INITIAL_STAFF_POINTS: StaffPointUser[] = [
  {
    userId: '1415773466715750461',
    username: 'eyad_admin',
    displayName: 'Eyad | Head Admin',
    avatar: 'https://cdn.discordapp.com/embed/avatars/1.png',
    roles: ['Management / إدارة عليا'],
    points: 142,
    ticketsClaimed: 38,
    warningsIssued: 19,
    timeoutsIssued: 14,
    rank: 1
  },
  {
    userId: '1487083076713713787',
    username: 'faisalo_ops',
    displayName: 'Faisal | High Council',
    avatar: 'https://cdn.discordapp.com/embed/avatars/2.png',
    roles: ['High Council / القيادة'],
    points: 118,
    ticketsClaimed: 31,
    warningsIssued: 15,
    timeoutsIssued: 10,
    rank: 2
  },
  {
    userId: '1387461999146827858',
    username: 'salem_staff',
    displayName: 'Salem | Lead Staff',
    avatar: 'https://cdn.discordapp.com/embed/avatars/3.png',
    roles: ['Staff Team / إداري'],
    points: 94,
    ticketsClaimed: 24,
    warningsIssued: 12,
    timeoutsIssued: 8,
    rank: 3
  },
  {
    userId: '1476256575634149447',
    username: 'khalid_sup',
    displayName: 'Khalid | Support Agent',
    avatar: 'https://cdn.discordapp.com/embed/avatars/4.png',
    roles: ['Support / دعم فني'],
    points: 76,
    ticketsClaimed: 22,
    warningsIssued: 6,
    timeoutsIssued: 4,
    rank: 4
  },
  {
    userId: '1504895490700083302',
    username: 'nawaf_mod',
    displayName: 'Nawaf | Moderator',
    avatar: 'https://cdn.discordapp.com/embed/avatars/5.png',
    roles: ['Staff Team / إداري'],
    points: 62,
    ticketsClaimed: 16,
    warningsIssued: 8,
    timeoutsIssued: 3,
    rank: 5
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-101',
    actionType: 'warning',
    moderator: { id: '1387461999146827858', name: 'Salem | Lead Staff', avatar: 'https://cdn.discordapp.com/embed/avatars/3.png' },
    target: { id: '9847291837482', name: 'RayanGamer' },
    details: 'تم تحذير العضو بسبب "سبام" لمدة يومين (+1 نقطة)',
    timestamp: Date.now() - 1000 * 60 * 12
  },
  {
    id: 'log-102',
    actionType: 'ticket_claim',
    moderator: { id: '1476256575634149447', name: 'Khalid | Support Agent', avatar: 'https://cdn.discordapp.com/embed/avatars/4.png' },
    target: { id: '772918349102', name: 'Mohamed_99' },
    details: 'استلام التذكرة #ticket-mohamed_99 بنجاح (+3 نقاط)',
    timestamp: Date.now() - 1000 * 60 * 35
  },
  {
    id: 'log-103',
    actionType: 'timeout',
    moderator: { id: '1415773466715750461', name: 'Eyad | Head Admin', avatar: 'https://cdn.discordapp.com/embed/avatars/1.png' },
    target: { id: '661829103982', name: 'SpamBot99' },
    details: 'إعطاء تايم أوت لمدة 2h بسبب "إزعاج الأعضاء في الشات العام" (+2 نقطة)',
    timestamp: Date.now() - 1000 * 60 * 90
  },
  {
    id: 'log-104',
    actionType: 'command_edit',
    moderator: { id: '1415773466715750461', name: 'Eyad | Head Admin', avatar: 'https://cdn.discordapp.com/embed/avatars/1.png' },
    details: 'تحديث أوامر التشغيل والرتب المسموحة لأمر "بان"',
    timestamp: Date.now() - 1000 * 60 * 180
  },
  {
    id: 'log-105',
    actionType: 'ip_whitelist_edit',
    moderator: { id: '1415773466715750461', name: 'Eyad | Head Admin', avatar: 'https://cdn.discordapp.com/embed/avatars/1.png' },
    details: 'إضافة عنوان IP موثوق 197.34.12.89 إلى القائمة البيضاء',
    timestamp: Date.now() - 1000 * 60 * 320
  }
];

export const INITIAL_WHITELIST: IPWhitelistEntry[] = [
  {
    id: 'ip-1',
    ipAddress: '197.34.12.89',
    adminName: 'Eyad (Owner / Head Admin)',
    adminId: '1415773466715750461',
    addedAt: Date.now() - 1000 * 60 * 60 * 48,
    notes: 'Primary Office Network / Static Fiber',
    status: 'active'
  },
  {
    id: 'ip-2',
    ipAddress: '151.248.80.12',
    adminName: 'Faisal (High Council)',
    adminId: '1487083076713713787',
    addedAt: Date.now() - 1000 * 60 * 60 * 24,
    notes: 'Authorized Cloud Proxy / Riyadh Home IP',
    status: 'active'
  }
];

export const INITIAL_TICKETS: TicketRecord[] = [
  {
    channelId: 'ticket-901',
    channelName: 'ticket-mohamed_99',
    ownerId: '772918349102',
    ownerTag: 'Mohamed_99#1204',
    ownerAvatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
    openedAt: Date.now() - 1000 * 60 * 50,
    claimedBy: '1476256575634149447',
    claimedByTag: 'Khalid | Support Agent',
    status: 'claimed',
    reason: 'مشكلة في تفعيل رتبة VIP وروم الفويس الخاص',
    transcript: [
      {
        id: 'msg-1',
        author: 'Mohamed_99',
        authorAvatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
        isBot: false,
        content: 'السلام عليكم، اشتريت رتبة VIP من الموقع وما نزلت لي في السيرفر',
        timestamp: '14:20'
      },
      {
        id: 'msg-2',
        author: 'OPS Bot',
        authorAvatar: 'https://cdn.discordapp.com/embed/avatars/1.png',
        isBot: true,
        content: 'تم استلام التذكرة بنجاح بواسطة Khalid | Support (+3 نقاط)',
        timestamp: '14:22'
      },
      {
        id: 'msg-3',
        author: 'Khalid | Support',
        authorAvatar: 'https://cdn.discordapp.com/embed/avatars/4.png',
        isBot: false,
        content: 'أهلاً بك يا محمد، ممكن تزودني برقم الفاتورة أو وصل التحويل؟',
        timestamp: '14:23'
      },
      {
        id: 'msg-4',
        author: 'Mohamed_99',
        authorAvatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
        isBot: false,
        content: 'تفضل هذا رقم الفاتورة #INV-883492',
        timestamp: '14:25'
      }
    ],
    feedbackRating: 5,
    feedbackComment: 'الدعم سريع جداً وتعامله محترم ومساعد',
    voiceTranscript: 'السلام عليكم يا شباب تم مراجعة الفاتورة والرتبة تم تفعيلها تلقائياً، شكراً لكم.'
  },
  {
    channelId: 'ticket-902',
    channelName: 'ticket-saad_gaming',
    ownerId: '883912049182',
    ownerTag: 'Saad_Gaming#4401',
    ownerAvatar: 'https://cdn.discordapp.com/embed/avatars/2.png',
    openedAt: Date.now() - 1000 * 60 * 120,
    closedAt: Date.now() - 1000 * 60 * 30,
    claimedBy: '1387461999146827858',
    claimedByTag: 'Salem | Lead Staff',
    status: 'closed',
    reason: 'استفسار بخصوص شروط التقديم على طاقم الإدارة',
    transcript: [
      {
        id: 'msg-1',
        author: 'Saad_Gaming',
        authorAvatar: 'https://cdn.discordapp.com/embed/avatars/2.png',
        isBot: false,
        content: 'السلام عليكم، متى يفتح تقديم الإدارة وشو الشروط المطلوبة؟',
        timestamp: '13:00'
      },
      {
        id: 'msg-2',
        author: 'Salem | Lead Staff',
        authorAvatar: 'https://cdn.discordapp.com/embed/avatars/3.png',
        isBot: false,
        content: 'وعليكم السلام، التقديم يفتح بداية كل شهر في روم #announcements ويشترط التواجد اليومي والخبرة.',
        timestamp: '13:05'
      }
    ],
    feedbackRating: 5,
    feedbackComment: 'إجابة واضحة وسريعة شكراً سالم',
    voiceTranscript: 'تم إغلاق التذكرة بعد إفادة العضو بشروط التقديم الرسمية.'
  }
];

export const DEMO_PROFILES: UserSession[] = [
  {
    id: '1415773466715750461',
    username: 'eyad_owner',
    displayName: 'Eyad | Server Owner & Admin',
    avatar: 'https://cdn.discordapp.com/embed/avatars/1.png',
    roles: ['Management / إدارة عليا', 'Server Owner'],
    permissions: ['Administrator', 'ManageGuild', 'BanMembers', 'KickMembers', 'ManageRoles'],
    isOwner: true,
    isAdmin: true,
    ip: '197.34.12.89',
    isWhitelisted: true
  },
  {
    id: '1487083076713713787',
    username: 'faisal_mgmt',
    displayName: 'Faisal | High Council Admin',
    avatar: 'https://cdn.discordapp.com/embed/avatars/2.png',
    roles: ['High Council / القيادة'],
    permissions: ['Administrator', 'BanMembers', 'KickMembers', 'ManageRoles'],
    isOwner: false,
    isAdmin: true,
    ip: '151.248.80.12',
    isWhitelisted: true
  },
  {
    id: '1387461999146827858',
    username: 'salem_staff',
    displayName: 'Salem | Staff Moderator',
    avatar: 'https://cdn.discordapp.com/embed/avatars/3.png',
    roles: ['Staff Team / إداري'],
    permissions: ['ModerateMembers', 'KickMembers'],
    isOwner: false,
    isAdmin: false,
    ip: '185.12.44.10',
    isWhitelisted: false
  },
  {
    id: '998877665544',
    username: 'unauth_user',
    displayName: 'Regular Member (Unauthorized)',
    avatar: 'https://cdn.discordapp.com/embed/avatars/5.png',
    roles: ['Member / ميمبر'],
    permissions: [],
    isOwner: false,
    isAdmin: false,
    ip: '82.102.16.5',
    isWhitelisted: false
  }
];

export interface StoredBotData {
  commands: CommandDefinition[];
  ticketConfig: TicketPanelConfig;
  tickets: TicketRecord[];
  moderation: ModerationSettings;
  staffPoints: StaffPointUser[];
  auditLogs: AuditLogEntry[];
  ipWhitelist: IPWhitelistEntry[];
  ipWhitelistEnforced: boolean;
  currentUser: UserSession;
  botStats: BotActivityStats;
  serverRoles: ServerRole[];
  serverDetails: ServerDetails;
}

export function loadBotData(): StoredBotData {
  const defaultData: StoredBotData = {
    commands: INITIAL_COMMANDS,
    ticketConfig: INITIAL_TICKET_CONFIG,
    tickets: INITIAL_TICKETS,
    moderation: INITIAL_MODERATION,
    staffPoints: INITIAL_STAFF_POINTS,
    auditLogs: INITIAL_AUDIT_LOGS,
    ipWhitelist: INITIAL_WHITELIST,
    ipWhitelistEnforced: true,
    currentUser: DEMO_PROFILES[0],
    serverRoles: OPS_SERVER_ROLES,
    serverDetails: INITIAL_SERVER_DETAILS,
    botStats: {
      botOnline: true,
      uptimeSeconds: 843920,
      pingMs: 18,
      memoryMb: 142.4,
      cpuPercent: 3.2,
      activeGuilds: 1,
      totalMembers: 1482,
      activeTicketsCount: 3,
      totalWarningsCount: 148,
      messagesProcessed: 68420,
      totalCommandsExecuted: 12490
    }
  };

  try {
    const raw = localStorage.getItem(BOT_STORAGE_KEY);
    if (!raw) {
      saveBotData(defaultData);
      return defaultData;
    }
    const parsed = JSON.parse(raw);
    return {
      ...defaultData,
      ...parsed,
      // Guarantee key defaults in case schema updated
      commands: parsed.commands?.length ? parsed.commands : defaultData.commands,
      ticketConfig: parsed.ticketConfig || defaultData.ticketConfig,
      moderation: parsed.moderation || defaultData.moderation,
      currentUser: parsed.currentUser || defaultData.currentUser,
      serverRoles: parsed.serverRoles?.length ? parsed.serverRoles : defaultData.serverRoles,
      serverDetails: parsed.serverDetails || defaultData.serverDetails
    };
  } catch (err) {
    console.error('Error loading bot storage:', err);
    return defaultData;
  }
}

export function saveBotData(data: StoredBotData): void {
  try {
    localStorage.setItem(BOT_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving bot storage:', err);
  }
}
