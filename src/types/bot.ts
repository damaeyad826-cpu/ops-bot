export type CommandCategory = 'moderation' | 'tickets' | 'roles' | 'points' | 'general' | 'custom';

export interface CommandDefinition {
  key: string;
  label: string;
  description: string;
  category: CommandCategory;
  enabled: boolean;
  aliases: string[]; // trigger phrases, e.g. ["!بان", "بان", "حظر", "!ban"]
  allowedRoles: string[]; // Role IDs or names
  allowedPermissions: string[]; // e.g. ["Administrator", "BanMembers"]
  responseType: 'reply' | 'container' | 'modal';
  customReply: string;
  cooldownSec: number;
  actionPointsReward: number;
  isCustom?: boolean;
}

export interface TicketPanelConfig {
  panelTitle: string;
  panelDescription: string;
  panelNotes: string[];
  buttonLabel: string;
  buttonEmoji: string;
  buttonColor: 'Primary' | 'Success' | 'Danger' | 'Secondary';
  channelId: string;
  categoryId: string;
  claimButtonLabel: string;
  claimButtonEmoji: string;
  claimButtonColor: 'Primary' | 'Success' | 'Danger' | 'Secondary';
  imageUrl: string;
  welcomeMessage: string;
  ticketNameFormat: string;
  requireReason: boolean;
  supportRoleIds: string[];
  staffRoleIds: string[];
}

export interface TranscriptMessage {
  id: string;
  author: string;
  authorAvatar: string;
  isBot: boolean;
  content: string;
  timestamp: string;
}

export interface TicketRecord {
  channelId: string;
  channelName: string;
  ownerId: string;
  ownerTag: string;
  ownerAvatar: string;
  openedAt: number;
  closedAt?: number;
  claimedBy?: string;
  claimedByTag?: string;
  status: 'open' | 'claimed' | 'closed';
  reason: string;
  transcript: TranscriptMessage[];
  feedbackRating?: number; // 1 to 5 stars
  feedbackComment?: string;
  voiceTranscript?: string;
}

export interface StaffPointUser {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  roles: string[];
  points: number;
  ticketsClaimed: number;
  warningsIssued: number;
  timeoutsIssued: number;
  rank?: number;
}

export interface AuditLogEntry {
  id: string;
  actionType:
    | 'warning'
    | 'timeout'
    | 'kick'
    | 'ban'
    | 'unban'
    | 'prison'
    | 'pardon'
    | 'ticket_claim'
    | 'ticket_create'
    | 'ticket_close'
    | 'command_edit'
    | 'ip_whitelist_edit'
    | 'points_edit'
    | 'panel_update';
  moderator: {
    id: string;
    name: string;
    avatar: string;
  };
  target?: {
    id: string;
    name: string;
  };
  details: string;
  timestamp: number;
  meta?: Record<string, any>;
}

export interface IPWhitelistEntry {
  id: string;
  ipAddress: string;
  adminName: string;
  adminId: string;
  addedAt: number;
  notes: string;
  status: 'active' | 'revoked';
}

export interface UserSession {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  roles: string[];
  permissions: string[];
  isOwner: boolean;
  isAdmin: boolean;
  ip: string;
  isWhitelisted: boolean;
}

export interface ModerationSettings {
  antiSpam: boolean;
  antiSpamThreshold: number;
  antiMassMention: boolean;
  maxMentions: number;
  linkFilter: boolean;
  badWordsFilter: boolean;
  badWordsList: string[];
  prisonRoleId: string;
  memberRoleId: string;
  fireRole1Id: string;
  fireRole2Id: string;
  firedRoleId: string;
  actionPoints: {
    ticket_claim: number;
    warning: number;
    timeout: number;
    prison: number;
  };
  warningReasons: Record<
    string,
    {
      label: string;
      durationText: string;
      durationMs: number;
    }
  >;
}

export interface BotActivityStats {
  botOnline: boolean;
  uptimeSeconds: number;
  pingMs: number;
  memoryMb: number;
  cpuPercent: number;
  activeGuilds: number;
  totalMembers: number;
  activeTicketsCount: number;
  totalWarningsCount: number;
  messagesProcessed: number;
  totalCommandsExecuted: number;
}

export interface ServerRole {
  id: string;
  name: string;
  color: string;
  position: number;
  category?: 'management' | 'staff' | 'community' | 'penalty';
  memberCount?: number;
  isManagement?: boolean;
}

export interface ServerDetails {
  guildId: string;
  name: string;
  icon: string;
  totalMembers: number;
  onlineMembers: number;
  idleMembers: number;
  dndMembers: number;
  offlineMembers: number;
  botsCount: number;
  rolesCount: number;
  channelsCount: number;
  boostLevel: number;
  boostCount: number;
  ownerTag: string;
  createdDate: string;
}
