/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  loadBotData,
  saveBotData,
  DEMO_PROFILES,
  StoredBotData
} from './services/botStorage';
import { Sidebar, NavTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { AccessGate } from './components/AccessGate';
import { BotConnectionStatusModal } from './components/BotConnectionStatusModal';
import { OverviewModule } from './components/modules/OverviewModule';
import { CommandsModule } from './components/modules/CommandsModule';
import { TicketsModule } from './components/modules/TicketsModule';
import { TranscriptsAndSTTModule } from './components/modules/TranscriptsAndSTTModule';
import { ModerationModule } from './components/modules/ModerationModule';
import { StaffPointsModule } from './components/modules/StaffPointsModule';
import { AuditLogsModule } from './components/modules/AuditLogsModule';
import { SecurityAndIPModule } from './components/modules/SecurityAndIPModule';
import { OAuthModule } from './components/modules/OAuthModule';
import {
  CommandDefinition,
  TicketPanelConfig,
  TicketRecord,
  ModerationSettings,
  IPWhitelistEntry,
  ServerRole,
  ServerDetails
} from './types/bot';

export default function App() {
  const [data, setData] = useState<StoredBotData>(() => loadBotData());
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);

  // Sync state whenever data changes
  useEffect(() => {
    saveBotData(data);
  }, [data]);

  // Handle switching user profile (Owner, Admin, Moderator, Unauthorized Member)
  const handleSwitchUser = (profileIndex: number) => {
    const profile = DEMO_PROFILES[profileIndex] || DEMO_PROFILES[0];
    // Check if profile IP is in the current whitelist
    const isWhitelisted = data.ipWhitelist.some((w) => w.ipAddress === profile.ip && w.status === 'active');
    const updatedUser = {
      ...profile,
      isWhitelisted: profile.isOwner || isWhitelisted
    };

    setData((prev) => ({
      ...prev,
      currentUser: updatedUser
    }));
  };

  // Sync with Bot simulation
  const handleSyncBot = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      // Randomize ping slightly to reflect live connection
      setData((prev) => ({
        ...prev,
        botStats: {
          ...prev.botStats,
          pingMs: Math.floor(Math.random() * 8) + 16,
          totalCommandsExecuted: prev.botStats.totalCommandsExecuted + 1
        }
      }));
    }, 600);
  };

  const handleToggleBotOnline = () => {
    setData((prev) => ({
      ...prev,
      botStats: {
        ...prev.botStats,
        botOnline: !prev.botStats.botOnline
      }
    }));
  };

  // Update Commands
  const handleUpdateCommands = (commands: CommandDefinition[]) => {
    setData((prev) => ({
      ...prev,
      commands,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          actionType: 'command_edit',
          moderator: {
            id: prev.currentUser.id,
            name: prev.currentUser.displayName,
            avatar: prev.currentUser.avatar
          },
          details: 'تحديث أوامر التشغيل والرتب المسموحة للأوامر',
          timestamp: Date.now()
        },
        ...prev.auditLogs
      ]
    }));
  };

  // Update Ticket Config
  const handleSaveTicketConfig = (ticketConfig: TicketPanelConfig) => {
    setData((prev) => ({
      ...prev,
      ticketConfig,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          actionType: 'panel_update',
          moderator: {
            id: prev.currentUser.id,
            name: prev.currentUser.displayName,
            avatar: prev.currentUser.avatar
          },
          details: 'تحديث تصميم ورسائل لوحة التذاكر الدعم الفني',
          timestamp: Date.now()
        },
        ...prev.auditLogs
      ]
    }));
  };

  const handleSendPanelToChannel = (channelId: string) => {
    setData((prev) => ({
      ...prev,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          actionType: 'panel_update',
          moderator: {
            id: prev.currentUser.id,
            name: prev.currentUser.displayName,
            avatar: prev.currentUser.avatar
          },
          details: `إرسال لوحة التكت المحدثة إلى الروم #${channelId}`,
          timestamp: Date.now()
        },
        ...prev.auditLogs
      ]
    }));
  };

  // Update Moderation Settings
  const handleSaveModeration = (moderation: ModerationSettings) => {
    setData((prev) => ({
      ...prev,
      moderation,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          actionType: 'command_edit',
          moderator: {
            id: prev.currentUser.id,
            name: prev.currentUser.displayName,
            avatar: prev.currentUser.avatar
          },
          details: 'تحديث إعدادات الأوتومود وتوزيع نقاط العقوبات الإدارية',
          timestamp: Date.now()
        },
        ...prev.auditLogs
      ]
    }));
  };

  // Adjust Staff Points
  const handleUpdatePoints = (userId: string, deltaPoints: number, reasonText: string) => {
    setData((prev) => {
      const updatedStaff = prev.staffPoints.map((s) => {
        if (s.userId === userId) {
          return { ...s, points: Math.max(0, s.points + deltaPoints) };
        }
        return s;
      });

      const targetStaff = prev.staffPoints.find((s) => s.userId === userId);

      return {
        ...prev,
        staffPoints: updatedStaff,
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            actionType: 'points_edit',
            moderator: {
              id: prev.currentUser.id,
              name: prev.currentUser.displayName,
              avatar: prev.currentUser.avatar
            },
            target: targetStaff ? { id: targetStaff.userId, name: targetStaff.displayName } : undefined,
            details: `${deltaPoints > 0 ? 'إضافة' : 'خصم'} ${Math.abs(deltaPoints)} نقطة: ${reasonText}`,
            timestamp: Date.now()
          },
          ...prev.auditLogs
        ]
      };
    });
  };

  // IP Whitelist Actions
  const handleToggleEnforceWhitelist = () => {
    setData((prev) => ({
      ...prev,
      ipWhitelistEnforced: !prev.ipWhitelistEnforced
    }));
  };

  const handleAddWhitelistEntry = (entry: Omit<IPWhitelistEntry, 'id' | 'addedAt'>) => {
    const newEntry: IPWhitelistEntry = {
      ...entry,
      id: `ip-${Date.now()}`,
      addedAt: Date.now()
    };

    setData((prev) => {
      const updatedList = [newEntry, ...prev.ipWhitelist];
      const isCurrentUserWhitelisted =
        prev.currentUser.isOwner || updatedList.some((w) => w.ipAddress === prev.currentUser.ip && w.status === 'active');

      return {
        ...prev,
        ipWhitelist: updatedList,
        currentUser: {
          ...prev.currentUser,
          isWhitelisted: isCurrentUserWhitelisted
        },
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            actionType: 'ip_whitelist_edit',
            moderator: {
              id: prev.currentUser.id,
              name: prev.currentUser.displayName,
              avatar: prev.currentUser.avatar
            },
            details: `إضافة عنوان IP جديد (${entry.ipAddress}) لصالح ${entry.adminName}`,
            timestamp: Date.now()
          },
          ...prev.auditLogs
        ]
      };
    });
  };

  const handleRemoveWhitelistEntry = (id: string) => {
    setData((prev) => {
      const removed = prev.ipWhitelist.find((w) => w.id === id);
      const updatedList = prev.ipWhitelist.filter((w) => w.id !== id);
      const isCurrentUserWhitelisted =
        prev.currentUser.isOwner || updatedList.some((w) => w.ipAddress === prev.currentUser.ip && w.status === 'active');

      return {
        ...prev,
        ipWhitelist: updatedList,
        currentUser: {
          ...prev.currentUser,
          isWhitelisted: isCurrentUserWhitelisted
        },
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            actionType: 'ip_whitelist_edit',
            moderator: {
              id: prev.currentUser.id,
              name: prev.currentUser.displayName,
              avatar: prev.currentUser.avatar
            },
            details: `إلغاء وإزالة عنوان IP (${removed?.ipAddress || id}) من القائمة البيضاء`,
            timestamp: Date.now()
          },
          ...prev.auditLogs
        ]
      };
    });
  };

  const handleClearLogs = () => {
    setData((prev) => ({
      ...prev,
      auditLogs: []
    }));
  };

  const handleUpdateTickets = (updated: TicketRecord[]) => {
    setData((prev) => ({
      ...prev,
      tickets: updated
    }));
  };

  const handleUpdateServerDetails = (details: ServerDetails) => {
    setData((prev) => ({
      ...prev,
      serverDetails: details,
      botStats: {
        ...prev.botStats,
        totalMembers: details.totalMembers
      }
    }));
  };

  const handleAddServerRole = (newRole: ServerRole) => {
    setData((prev) => ({
      ...prev,
      serverRoles: [newRole, ...prev.serverRoles],
      serverDetails: {
        ...prev.serverDetails,
        rolesCount: prev.serverRoles.length + 1
      }
    }));
  };

  // Security Access Verification
  // 1. Role verification: Must be an Administrator
  // 2. IP Whitelisting: If enforced, user's IP must be in whitelist (or be Server Owner)
  const isRoleDenied = !data.currentUser.isAdmin;
  const isIpDenied = data.ipWhitelistEnforced && !data.currentUser.isWhitelisted && !data.currentUser.isOwner;
  const isAccessBlocked = isRoleDenied || isIpDenied;

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#e3e5e8] flex" dir="rtl">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        currentUser={data.currentUser}
        onSwitchUser={handleSwitchUser}
        botOnline={data.botStats.botOnline}
        pingMs={data.botStats.pingMs}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        serverDetails={data.serverDetails}
        onOpenConnectionModal={() => setIsConnectionModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar
          activeTab={activeTab}
          currentUser={data.currentUser}
          ipWhitelistEnforced={data.ipWhitelistEnforced}
          onOpenMobile={() => setIsOpenMobile(true)}
          onSyncBot={handleSyncBot}
          isSyncing={isSyncing}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {isAccessBlocked ? (
            /* Security Gate Screen when user does not have Administrator role or is not whitelisted */
            <AccessGate
              currentUser={data.currentUser}
              ipWhitelistEnforced={data.ipWhitelistEnforced}
              onSwitchToOwner={() => handleSwitchUser(0)}
            />
          ) : (
            /* Render Active Dashboard Module */
            <>
              {activeTab === 'overview' && (
                <OverviewModule
                  stats={data.botStats}
                  auditLogs={data.auditLogs}
                  tickets={data.tickets}
                  serverDetails={data.serverDetails}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onToggleBotOnline={handleToggleBotOnline}
                  onOpenConnectionModal={() => setIsConnectionModalOpen(true)}
                />
              )}

              {activeTab === 'commands' && (
                <CommandsModule
                  commands={data.commands}
                  onUpdateCommands={handleUpdateCommands}
                  currentUser={data.currentUser}
                  serverRoles={data.serverRoles}
                  onAddServerRole={handleAddServerRole}
                />
              )}

              {activeTab === 'tickets' && (
                <TicketsModule
                  config={data.ticketConfig}
                  onSaveConfig={handleSaveTicketConfig}
                  onSendPanelToChannel={handleSendPanelToChannel}
                  currentUser={data.currentUser}
                />
              )}

              {activeTab === 'transcripts' && (
                <TranscriptsAndSTTModule
                  tickets={data.tickets}
                  onUpdateTickets={handleUpdateTickets}
                  currentUser={data.currentUser}
                />
              )}

              {activeTab === 'moderation' && (
                <ModerationModule
                  settings={data.moderation}
                  onSaveSettings={handleSaveModeration}
                  currentUser={data.currentUser}
                />
              )}

              {activeTab === 'points' && (
                <StaffPointsModule
                  staffList={data.staffPoints}
                  onUpdatePoints={handleUpdatePoints}
                  currentUser={data.currentUser}
                />
              )}

              {activeTab === 'logs' && (
                <AuditLogsModule
                  logs={data.auditLogs}
                  onClearLogs={handleClearLogs}
                  currentUser={data.currentUser}
                />
              )}

              {activeTab === 'security' && (
                <SecurityAndIPModule
                  whitelist={data.ipWhitelist}
                  isEnforced={data.ipWhitelistEnforced}
                  onToggleEnforce={handleToggleEnforceWhitelist}
                  onAddWhitelistEntry={handleAddWhitelistEntry}
                  onRemoveWhitelistEntry={handleRemoveWhitelistEntry}
                  currentUser={data.currentUser}
                  staffList={data.staffPoints}
                  onSimulateUnauthorized={() => handleSwitchUser(3)}
                />
              )}

              {activeTab === 'oauth' && (
                <OAuthModule
                  currentUser={data.currentUser}
                  onLoginViaDiscord={() => handleSwitchUser(0)}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Bot Connection & Server Stats Modal */}
      <BotConnectionStatusModal
        isOpen={isConnectionModalOpen}
        onClose={() => setIsConnectionModalOpen(false)}
        stats={data.botStats}
        serverDetails={data.serverDetails}
        onUpdateServerDetails={handleUpdateServerDetails}
        onUpdateServerRoles={(newRoles) => {
          setData((prev) => ({
            ...prev,
            serverRoles: newRoles,
            serverDetails: {
              ...prev.serverDetails,
              rolesCount: newRoles.length
            }
          }));
        }}
        onToggleBotOnline={handleToggleBotOnline}
      />
    </div>
  );
}
