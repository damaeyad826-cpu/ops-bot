import React, { useState } from 'react';
import {
  Terminal,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Save,
  Check,
  X,
  Play,
  Sparkles,
  Shield,
  Zap,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { CommandDefinition, ServerRole, UserSession } from '../../types/bot';
import { OPS_SERVER_ROLES } from '../../services/botStorage';

interface CommandsModuleProps {
  commands: CommandDefinition[];
  onUpdateCommands: (commands: CommandDefinition[]) => void;
  currentUser: UserSession;
  serverRoles?: ServerRole[];
  onAddServerRole?: (newRole: ServerRole) => void;
}

export const CommandsModule: React.FC<CommandsModuleProps> = ({
  commands,
  onUpdateCommands,
  currentUser,
  serverRoles = OPS_SERVER_ROLES,
  onAddServerRole
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingCommandKey, setEditingCommandKey] = useState<string | null>(null);

  // Form state for editing or creating
  const [editForm, setEditForm] = useState<CommandDefinition | null>(null);
  const [newAliasInput, setNewAliasInput] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Role selector inside form
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const [roleCategoryFilter, setRoleCategoryFilter] = useState<'all' | 'management' | 'staff' | 'community' | 'penalty'>('all');
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [newRoleForm, setNewRoleForm] = useState({ name: '', color: '#5865F2', id: '' });

  // Command simulator state
  const [simulatorInput, setSimulatorInput] = useState('!نقاط');
  const [simulatorOutput, setSimulatorOutput] = useState<Array<{ sender: string; text: string; isBot: boolean }>>([
    { sender: 'Eyad (Admin)', text: '!نقاط', isBot: false },
    { sender: 'OPS Bot', text: '## نقاط الاداريين في خادم OPS\n🥇 1. Eyad | Head Admin — 142 نقطة\n🥈 2. Faisal | High Council — 118 نقطة\n🥉 3. Salem | Lead Staff — 94 نقطة', isBot: true }
  ]);

  const categories = [
    { id: 'all', label: 'جميع الأوامر' },
    { id: 'moderation', label: 'الموديريشن والعقوبات' },
    { id: 'roles', label: 'الرتب والصلاحيات' },
    { id: 'tickets', label: 'التذاكر والدعم' },
    { id: 'points', label: 'النقاط والليدربورد' },
    { id: 'custom', label: 'الأوامر المخصصة' }
  ];

  const filteredCommands = commands.filter((cmd) => {
    const matchesCat =
      selectedCategory === 'all' ||
      cmd.category === selectedCategory ||
      (selectedCategory === 'custom' && cmd.isCustom);
    const matchesSearch =
      cmd.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.aliases.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleStartEdit = (cmd: CommandDefinition) => {
    setEditingCommandKey(cmd.key);
    setEditForm({ ...cmd, aliases: [...cmd.aliases], allowedRoles: [...cmd.allowedRoles] });
  };

  const handleCancelEdit = () => {
    setEditingCommandKey(null);
    setEditForm(null);
    setIsCreatingNew(false);
  };

  const handleSaveEdit = () => {
    if (!editForm) return;

    if (isCreatingNew) {
      if (!editForm.key.trim()) return;
      const updated = [...commands, { ...editForm, isCustom: true }];
      onUpdateCommands(updated);
      setIsCreatingNew(false);
    } else {
      const updated = commands.map((c) => (c.key === editForm.key ? editForm : c));
      onUpdateCommands(updated);
    }
    setEditingCommandKey(null);
    setEditForm(null);
  };

  const handleToggleCommand = (key: string) => {
    const updated = commands.map((c) => (c.key === key ? { ...c, enabled: !c.enabled } : c));
    onUpdateCommands(updated);
  };

  const handleDeleteCommand = (key: string) => {
    if (confirm(`هل أنت متأكد من حذف الأمر المخصص "${key}"؟`)) {
      const updated = commands.filter((c) => c.key !== key);
      onUpdateCommands(updated);
      if (editingCommandKey === key) handleCancelEdit();
    }
  };

  const handleAddAliasToForm = () => {
    if (!newAliasInput.trim() || !editForm) return;
    const clean = newAliasInput.trim().toLowerCase();
    if (!editForm.aliases.includes(clean)) {
      setEditForm({
        ...editForm,
        aliases: [...editForm.aliases, clean]
      });
    }
    setNewAliasInput('');
  };

  const handleRemoveAliasFromForm = (aliasToRemove: string) => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      aliases: editForm.aliases.filter((a) => a !== aliasToRemove)
    });
  };

  const handleToggleRoleForForm = (roleId: string) => {
    if (!editForm) return;
    const exists = editForm.allowedRoles.includes(roleId);
    setEditForm({
      ...editForm,
      allowedRoles: exists
        ? editForm.allowedRoles.filter((r) => r !== roleId)
        : [...editForm.allowedRoles, roleId]
    });
  };

  const handleStartNewCommand = () => {
    const newCmd: CommandDefinition = {
      key: `custom_${Date.now().toString().slice(-4)}`,
      label: 'أمر مخصص جديد',
      description: 'وصف الأمر المخصص الجديد وإجراءاته',
      category: 'custom',
      enabled: true,
      aliases: ['!أمر_جديد', 'أمر_جديد'],
      allowedRoles: ['1415773466715750461'],
      allowedPermissions: ['Administrator'],
      responseType: 'reply',
      customReply: 'تم تنفيذ الأمر المخصص بنجاح <:access:1547213227476262974>',
      cooldownSec: 5,
      actionPointsReward: 0,
      isCustom: true
    };
    setEditForm(newCmd);
    setIsCreatingNew(true);
    setEditingCommandKey(newCmd.key);
  };

  // Test command in the live simulator
  const handleRunSimulator = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!simulatorInput.trim()) return;

    const input = simulatorInput.trim();
    const words = input.split(/\s+/);
    const trigger = words[0]?.toLowerCase();
    const tokenNoExcl = trigger.startsWith('!') ? trigger.slice(1) : trigger;
    const tokenWithExcl = trigger.startsWith('!') ? trigger : `!${trigger}`;

    // Find matched command by alias or key
    const matched = commands.find(
      (c) =>
        c.enabled &&
        (c.key === tokenNoExcl ||
          c.aliases.includes(tokenNoExcl) ||
          c.aliases.includes(tokenWithExcl) ||
          c.aliases.includes(trigger))
    );

    const newOutputs = [...simulatorOutput, { sender: currentUser.displayName, text: input, isBot: false }];

    if (!matched) {
      newOutputs.push({
        sender: 'OPS Bot',
        text: `لم يتم التعرف على الأمر "${trigger}". تأكد من كتابة الأمر بشكل صحيح أو مراجعة لوحة التحكم.`,
        isBot: true
      });
    } else {
      // Permission check simulation
      const hasPerm =
        currentUser.isAdmin ||
        matched.allowedRoles.some((rId) => currentUser.roles.includes(rId) || rId === 'all') ||
        matched.allowedRoles.length === 0;

      if (!hasPerm) {
        newOutputs.push({
          sender: 'OPS Bot',
          text: `⚠️ لا تملك الصلاحيات الكافية لتنفيذ الأمر "${matched.key}". هذا الأمر متاح فقط للرتب المحددة في لوحة التحكم.`,
          isBot: true
        });
      } else {
        const targetArg = words[1] || '@عضو_تجريبي';
        const replyText = matched.customReply
          .replace('{target}', targetArg)
          .replace('{points}', '142')
          .replace('{num}', '1')
          .replace('{role}', '@VIP');

        newOutputs.push({
          sender: 'OPS Bot',
          text: replyText + (matched.actionPointsReward > 0 ? ` (+${matched.actionPointsReward} نقاط)` : ''),
          isBot: true
        });
      }
    }

    setSimulatorOutput(newOutputs);
    setSimulatorInput('');
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#111622] border border-[#1e2536]">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#5865F2]" />
            إدارة وتخصيص أوامر البوت (Commands & Triggers)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            خصص كلمات التشغيل (مع أو بدون علامة <code className="text-[#5865F2] font-mono">!</code>)، وحدد الرتب والصلاحيات המسموحة، أو أضف أوامر مخصصة جديدة.
          </p>
        </div>

        <button
          onClick={handleStartNewCommand}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5865F2] hover:bg-[#4752c4] active:scale-98 text-white rounded-xl text-xs font-bold shadow-md transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء أمر مخصص جديد</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن أمر، أو كلمة تشغيل (مثال: بان، كيك، !ban)..."
            className="w-full bg-[#111622] border border-[#1e2536] rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#5865F2]"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#5865F2] text-white shadow-xs'
                  : 'bg-[#111622] text-slate-300 hover:text-white border border-[#1e2536]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Commands List + Live Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Commands List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center bg-[#111622] border border-[#1e2536] rounded-2xl">
              <Terminal className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">لا توجد أوامر مطابقة لبحثك</p>
              <p className="text-xs text-slate-500 mt-1">جرب البحث بكلمة أخرى أو قم بإلغاء الفلترة</p>
            </div>
          ) : (
            filteredCommands.map((cmd) => {
              const isEditing = editingCommandKey === cmd.key;

              if (isEditing && editForm) {
                return (
                  /* Inline Command Editor Modal / Card */
                  <div
                    key={cmd.key}
                    className="p-5 rounded-2xl bg-[#141a27] border-2 border-[#5865F2] shadow-xl space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-[#222c40] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-[#5865F2]/20 text-[#5865F2]">
                          <Sliders className="w-4 h-4" />
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            {isCreatingNew ? 'إنشاء أمر مخصص' : `تعديل أمر: ${editForm.label}`}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-mono">الكود الأساسي: {editForm.key}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5865F2] hover:bg-[#4752c4] text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>حفظ التعديلات</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1.5 rounded-lg bg-[#1e2637] text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Edit Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 mb-1 block">اسم وتسمية الأمر:</label>
                        <input
                          type="text"
                          value={editForm.label}
                          onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                          className="w-full bg-[#0e121a] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 mb-1 block">الوصف:</label>
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full bg-[#0e121a] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Trigger Phrases (Aliases) */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1 block">
                        كلمات واختصارات التشغيل (Triggers):
                      </label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {editForm.aliases.map((alias) => (
                          <span
                            key={alias}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#1d2536] border border-[#2a364d] text-xs font-mono text-slate-200"
                          >
                            <span>{alias}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAliasFromForm(alias)}
                              className="text-slate-400 hover:text-rose-400 ml-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Add alias input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newAliasInput}
                          onChange={(e) => setNewAliasInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddAliasToForm();
                            }
                          }}
                          placeholder="أدخل كلمة أو اختصار جديد (مثال: طرد، !kick، برا)..."
                          className="flex-1 bg-[#0e121a] border border-[#222c40] rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddAliasToForm}
                          className="px-3 py-1.5 bg-[#263147] hover:bg-[#344360] text-slate-200 rounded-xl text-xs font-semibold transition-colors"
                        >
                          إضافة كلمة
                        </button>
                      </div>
                    </div>

                    {/* Allowed Roles */}
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <label className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>الرتب المسموح لها باستخدام هذا الأمر:</span>
                          <span className="text-[11px] font-mono text-[#5865F2] font-semibold">
                            ({editForm.allowedRoles.length === 0 ? 'متاح للجميع' : `${editForm.allowedRoles.length} رتب محددة`})
                          </span>
                        </label>

                        {/* Quick Selection Presets */}
                        <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                          <button
                            type="button"
                            onClick={() => {
                              const staffIds = serverRoles
                                .filter((r) => r.isManagement || r.category === 'staff' || r.category === 'management')
                                .map((r) => r.id);
                              setEditForm({ ...editForm, allowedRoles: staffIds });
                            }}
                            className="px-2 py-0.5 rounded-md bg-[#1e2638] hover:bg-[#2c3750] text-slate-300 transition-colors"
                          >
                            كافة رتب الإدارة
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const mgmtIds = serverRoles
                                .filter((r) => r.isManagement || r.category === 'management')
                                .map((r) => r.id);
                              setEditForm({ ...editForm, allowedRoles: mgmtIds });
                            }}
                            className="px-2 py-0.5 rounded-md bg-[#1e2638] hover:bg-[#2c3750] text-slate-300 transition-colors"
                          >
                            الإدارة العليا فقط
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditForm({ ...editForm, allowedRoles: [] })}
                            className="px-2 py-0.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold transition-colors"
                          >
                            الجميع (متاح للكل)
                          </button>
                        </div>
                      </div>

                      {/* Role Search and Filter Bar */}
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <div className="relative flex-1 w-full">
                          <input
                            type="text"
                            value={roleSearchTerm}
                            onChange={(e) => setRoleSearchTerm(e.target.value)}
                            placeholder="ابحث في رتب السيرفر بالاسم أو الآيدي..."
                            className="w-full bg-[#0b0e14] border border-[#222c40] rounded-xl pr-3 pl-3 py-1.5 text-xs text-white placeholder-slate-500"
                          />
                        </div>

                        {/* Category filter pills */}
                        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                          {[
                            { id: 'all', label: 'الكل' },
                            { id: 'management', label: 'إدارة عليا' },
                            { id: 'staff', label: 'طاقم الإشراف' },
                            { id: 'community', label: 'الأعضاء' },
                            { id: 'penalty', label: 'عقوبات' }
                          ].map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setRoleCategoryFilter(cat.id as any)}
                              className={`px-2 py-1 rounded-lg text-[11px] whitespace-nowrap transition-colors ${
                                roleCategoryFilter === cat.id
                                  ? 'bg-[#5865F2] text-white font-bold'
                                  : 'bg-[#0b0e14] text-slate-400 hover:text-slate-200 border border-[#20293b]'
                              }`}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>

                        {/* Add custom role button */}
                        <button
                          type="button"
                          onClick={() => setShowAddRoleModal(true)}
                          className="px-2.5 py-1 rounded-xl bg-[#1b2230] hover:bg-[#25324c] text-white text-xs font-semibold whitespace-nowrap border border-[#28354c] transition-colors"
                        >
                          + إضافة رتبة
                        </button>
                      </div>

                      {/* Complete Server Roles Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 bg-[#0b0e14] rounded-xl border border-[#1b2230]">
                        {serverRoles
                          .filter((role) => {
                            const matchCat = roleCategoryFilter === 'all' || role.category === roleCategoryFilter;
                            const matchSearch =
                              role.name.toLowerCase().includes(roleSearchTerm.toLowerCase()) ||
                              role.id.includes(roleSearchTerm);
                            return matchCat && matchSearch;
                          })
                          .map((role) => {
                            const isAllowed = editForm.allowedRoles.includes(role.id);
                            return (
                              <button
                                key={role.id}
                                type="button"
                                onClick={() => handleToggleRoleForForm(role.id)}
                                className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium border transition-all text-right ${
                                  isAllowed
                                    ? 'bg-[#5865F2]/20 border-[#5865F2] text-white shadow-xs'
                                    : 'bg-[#121824] border-[#1e2738] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: role.color }}
                                  />
                                  <div className="truncate">
                                    <div className="truncate font-semibold text-slate-200">{role.name}</div>
                                    {role.memberCount !== undefined && (
                                      <span className="text-[10px] text-slate-400 font-mono">
                                        {role.memberCount} عضو
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {isAllowed ? (
                                  <Check className="w-4 h-4 text-[#5865F2] flex-shrink-0" />
                                ) : (
                                  <span className="w-3.5 h-3.5 rounded-full border border-slate-700 flex-shrink-0" />
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </div>

                    {/* Add New Role Modal */}
                    {showAddRoleModal && (
                      <div className="p-3 rounded-xl bg-[#0e131d] border border-[#27354d] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">إضافة رتبة جديدة من سيرفر ديسكورد</span>
                          <button
                            type="button"
                            onClick={() => setShowAddRoleModal(false)}
                            className="text-slate-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="اسم الرتبة (مثال: @VIP+)"
                            value={newRoleForm.name}
                            onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
                            className="bg-[#141b27] border border-[#232f47] rounded-lg px-2.5 py-1 text-xs text-white"
                          />
                          <input
                            type="text"
                            placeholder="Role ID"
                            value={newRoleForm.id}
                            onChange={(e) => setNewRoleForm({ ...newRoleForm, id: e.target.value })}
                            className="bg-[#141b27] border border-[#232f47] rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={newRoleForm.color}
                              onChange={(e) => setNewRoleForm({ ...newRoleForm, color: e.target.value })}
                              className="w-8 h-7 rounded bg-transparent cursor-pointer"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!newRoleForm.name.trim()) return;
                                const createdRole: ServerRole = {
                                  id: newRoleForm.id.trim() || `role_${Date.now()}`,
                                  name: newRoleForm.name.trim(),
                                  color: newRoleForm.color,
                                  position: 30,
                                  category: 'community'
                                };
                                if (onAddServerRole) onAddServerRole(createdRole);
                                setEditForm({
                                  ...editForm,
                                  allowedRoles: [...editForm.allowedRoles, createdRole.id]
                                });
                                setShowAddRoleModal(false);
                                setNewRoleForm({ name: '', color: '#5865F2', id: '' });
                              }}
                              className="flex-1 py-1 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold"
                            >
                              إضافة واختيار
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Custom Reply Text */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1 block">
                        نص الرد التلقائي (يدعم متغيرات مثل {'{target}'} و {'{points}'}):
                      </label>
                      <input
                        type="text"
                        value={editForm.customReply}
                        onChange={(e) => setEditForm({ ...editForm, customReply: e.target.value })}
                        className="w-full bg-[#0e121a] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                );
              }

              return (
                /* Regular Command Card */
                <div
                  key={cmd.key}
                  className={`p-4 rounded-xl border transition-all bg-[#111622] ${
                    cmd.enabled ? 'border-[#1e2536] hover:border-slate-700' : 'border-rose-900/30 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-sm text-white">{cmd.label}</span>
                        {cmd.isCustom && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                            مخصص
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-mono">الكود: {cmd.key}</span>
                      </div>
                      <p className="text-xs text-slate-300 mb-3">{cmd.description}</p>

                      {/* Triggers list */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-3">
                        <span className="text-[11px] text-slate-400">كلمات التشغيل:</span>
                        {cmd.aliases.map((alias) => (
                          <span
                            key={alias}
                            className="px-2 py-0.5 rounded bg-[#182030] border border-[#25324c] text-xs font-mono text-slate-200"
                          >
                            {alias}
                          </span>
                        ))}
                      </div>

                      {/* Allowed roles list */}
                      <div className="flex items-center gap-1.5 flex-wrap text-xs">
                        <span className="text-slate-400 text-[11px]">الرتب المسموحة:</span>
                        {cmd.allowedRoles.length === 0 ? (
                          <span className="text-emerald-400 text-[11px]">الجميع</span>
                        ) : (
                          cmd.allowedRoles.map((rId) => {
                            const role = serverRoles.find((r) => r.id === rId) || OPS_SERVER_ROLES.find((r) => r.id === rId);
                            return (
                              <span
                                key={rId}
                                className="px-2 py-0.5 rounded-full bg-[#151c2a] border border-[#20293b] text-[11px] text-slate-300 flex items-center gap-1"
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: role?.color || '#94a3b8' }}
                                />
                                <span>{role?.name.split('/')[0] || rId}</span>
                              </span>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Actions: Toggle & Edit */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Enable/Disable switch */}
                      <button
                        onClick={() => handleToggleCommand(cmd.key)}
                        className={`w-10 h-6 rounded-full transition-colors relative p-0.5 flex items-center ${
                          cmd.enabled ? 'bg-[#5865F2]' : 'bg-[#2b3547]'
                        }`}
                        title={cmd.enabled ? 'إيقاف الأمر' : 'تفعيل الأمر'}
                      >
                        <span
                          className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            cmd.enabled ? 'translate-x-0' : '-translate-x-4'
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => handleStartEdit(cmd)}
                        className="p-1.5 rounded-lg bg-[#182030] hover:bg-[#26334d] text-slate-300 hover:text-white transition-colors"
                        title="تعديل الأمر"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {cmd.isCustom && (
                        <button
                          onClick={() => handleDeleteCommand(cmd.key)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="حذف الأمر المخصص"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Col: Live Discord Command Tester Simulator */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#111622] border border-[#1e2536] shadow-md">
            <div className="flex items-center justify-between mb-3 border-b border-[#1b2230] pb-2">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">محاكي اختبار الأوامر المباشر</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">#test-room</span>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              اكتب الأمر لاختبار مطابقته مع كلمات التشغيل والتحقق من صلاحيات رتبتك الحالية ({currentUser.displayName}).
            </p>

            {/* Terminal / Chat window */}
            <div className="h-64 overflow-y-auto bg-[#0b0e14] border border-[#1b2230] rounded-xl p-3 space-y-3 font-sans text-xs">
              {simulatorOutput.map((msg, idx) => (
                <div key={idx} className="flex items-start gap-2 text-right">
                  <div
                    className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-[10px] ${
                      msg.isBot ? 'bg-[#5865F2] text-white' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {msg.isBot ? 'BOT' : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-bold text-slate-200 text-[11px]">{msg.sender}</span>
                      {msg.isBot && (
                        <span className="px-1 py-0.2 rounded bg-[#5865F2]/20 text-[#5865F2] text-[9px] font-bold">
                          BOT
                        </span>
                      )}
                    </div>
                    <div className="text-slate-300 bg-[#141a27] p-2 rounded-lg whitespace-pre-line leading-relaxed font-mono">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handleRunSimulator} className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={simulatorInput}
                onChange={(e) => setSimulatorInput(e.target.value)}
                placeholder="اكتب أمر للتجربة مثل: !بان @عضو أو نقاط..."
                className="flex-1 bg-[#0b0e14] border border-[#222c40] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#5865F2]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#5865F2] hover:bg-[#4752c4] active:scale-98 text-white rounded-xl text-xs font-bold transition-all"
              >
                تشغيل
              </button>
            </form>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
              <span>جرب اختصارات سريعة:</span>
              {['!نقاط', '!بان @Ahmed', '!تحذير @Sami', 'نقاطي'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSimulatorInput(s);
                  }}
                  className="px-1.5 py-0.5 rounded bg-[#182030] hover:bg-[#222c42] text-slate-300 font-mono text-[10px]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
