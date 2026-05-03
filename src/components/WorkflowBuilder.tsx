import { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { C } from '../constants';
import {
  Zap, Mail, Bell, MessageSquare, Users, Award, Plus, X, Trash2,
  FileText, UserCheck, Send, GitBranch, Timer, Play, Settings,
  ChevronUp, ChevronDown, ArrowRight, FileUp, XCircle, CheckCircle,
  ClipboardList, CheckSquare, Rocket, Trophy, LogOut, UserPlus,
  Clock, Calendar, Gift, AlertTriangle, Handshake, PenTool, Star,
} from 'lucide-react';

// ── Constants ──
const TRIGGER_OPTIONS = [
  { value: 'Document soumis', label: 'Document soumis', icon: FileUp, color: '#1A73E8' },
  { value: 'Document refusé', label: 'Document refusé', icon: XCircle, color: '#E53935' },
  { value: 'Tous documents validés', label: 'Tous documents validés', icon: CheckCircle, color: '#4CAF50' },
  { value: 'Formulaire soumis', label: 'Formulaire soumis', icon: ClipboardList, color: '#7B5EA7' },
  { value: 'Action complétée', label: 'Action complétée', icon: CheckSquare, color: '#4CAF50' },
  { value: 'Parcours créé', label: 'Parcours créé', icon: Rocket, color: '#E91E63' },
  { value: 'Parcours complété à 100%', label: 'Parcours complété', icon: Trophy, color: '#F9A825' },
  { value: 'Fin de parcours offboarding', label: 'Fin offboarding', icon: LogOut, color: '#FF9800' },
  { value: 'Nouveau collaborateur', label: 'Nouveau collaborateur', icon: UserPlus, color: '#7B5EA7' },
  { value: 'J-7 avant date limite', label: 'J-7 date limite', icon: Clock, color: '#F9A825' },
  { value: "J-3 avant date d'arrivée", label: 'J-3 pré-arrivée', icon: Clock, color: '#FF9800' },
  { value: "Jour d'arrivée (J+0)", label: "Jour d'arrivée (J+0)", icon: Rocket, color: '#4CAF50' },
  { value: 'Milestone post-arrivée', label: 'Milestone J+14/J+30', icon: Calendar, color: '#7B5EA7' },
  { value: "Période d'essai terminée", label: 'Fin période essai', icon: Calendar, color: '#FF9800' },
  { value: "Fin de période d'essai (J-15)", label: "Fin période essai J-15", icon: Clock, color: '#FF9800' },
  { value: 'Renouvellement CDD (J-60)', label: 'Renouvellement CDD J-60', icon: PenTool, color: '#E91E63' },
  { value: "Anniversaire d'embauche", label: 'Anniversaire embauche', icon: Gift, color: '#E91E63' },
  { value: 'Anniversaire personnel', label: 'Anniversaire personnel', icon: Gift, color: '#7B5EA7' },
  { value: 'Collaborateur en retard', label: 'Collaborateur en retard', icon: AlertTriangle, color: '#E53935' },
  { value: 'Cooptation validée', label: 'Cooptation validée', icon: Handshake, color: '#4CAF50' },
  { value: 'Contrat prêt', label: 'Contrat prêt', icon: FileText, color: '#1A73E8' },
  { value: 'Contrat signé', label: 'Contrat signé', icon: PenTool, color: '#1A73E8' },
  { value: 'Questionnaire NPS soumis', label: 'NPS soumis', icon: Star, color: '#F9A825' },
  { value: 'Document validé', label: 'Document validé', icon: CheckCircle, color: '#4CAF50' },
  { value: 'J+3 après envoi signature', label: 'Relance signature J+3', icon: Send, color: '#E91E63' },
  { value: 'Hebdomadaire (lundi)', label: 'Hebdomadaire (lundi)', icon: Calendar, color: '#1A73E8' },
  { value: 'Nouveau message reçu', label: 'Nouveau message', icon: MessageSquare, color: '#1A73E8' },
];

const ACTION_OPTIONS = [
  { value: 'Envoyer email de relance', label: 'Email de relance', icon: Mail, color: '#1A73E8', hasEmailConfig: true },
  { value: 'Envoyer confirmation au collaborateur', label: 'Confirmation', icon: Send, color: '#4CAF50', hasEmailConfig: true },
  { value: 'Envoyer pour validation au Manager', label: 'Validation Manager', icon: UserCheck, color: '#7B5EA7', hasEmailConfig: true },
  { value: 'Envoyer pour approbation Admin RH', label: 'Approbation RH', icon: UserCheck, color: '#E91E63', hasEmailConfig: true },
  { value: "Notifier l'équipe RH", label: 'Notifier RH', icon: Bell, color: '#F9A825' },
  { value: 'Envoyer un message IllizeoBot', label: 'Message Bot', icon: MessageSquare, color: '#1A73E8', hasBotConfig: true },
  { value: 'Envoyer via Teams', label: 'Teams', icon: Send, color: '#6264A7', requiresIntegration: 'teams' as const },
  { value: 'Envoyer pour signature', label: 'Signature', icon: FileText, color: '#E91E63', requiresIntegration: 'signature' as const },
  { value: 'Assigner action automatiquement', label: 'Assigner action', icon: Zap, color: '#FF9800', hasActionConfig: true },
  { value: 'Changer statut du parcours', label: 'Changer statut', icon: Play, color: '#4CAF50' },
  { value: 'Attribuer un badge', label: 'Badge', icon: Award, color: '#F9A825', hasBadgeConfig: true },
  { value: 'Ajouter au groupe', label: 'Ajouter au groupe', icon: Users, color: '#7B5EA7', hasGroupConfig: true },
  { value: 'Générer un document', label: 'Générer document', icon: FileText, color: '#1A73E8', hasDocConfig: true },
];

const RECIPIENT_OPTIONS = [
  'Collaborateur', 'Manager direct', 'Parrain/Buddy', 'N+2',
  'Équipe RH', 'Tous les participants', 'Utilisateur spécifique', 'Groupe spécifique',
];

const CONDITION_FIELDS = [
  { value: 'site', label: 'Site' },
  { value: 'departement', label: 'Département' },
  { value: 'poste', label: 'Poste' },
  { value: 'type_contrat', label: 'Type de contrat' },
  { value: 'pays', label: 'Pays' },
];

// ── Custom Nodes ──

function TriggerNode({ data }: { data: any }) {
  const trigger = TRIGGER_OPTIONS.find(t => t.value === data.trigger) || TRIGGER_OPTIONS[0];
  const TriggerIcon = trigger.icon;
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', minWidth: 220, border: `2px solid ${trigger.color}`, boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: trigger.color, textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.5 }}>Déclencheur</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${trigger.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <TriggerIcon size={16} color={trigger.color} />
        </div>
        <select value={data.trigger} onChange={e => data.onChange?.(e.target.value)}
          style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, fontWeight: 600, color: '#1a1a2e', cursor: 'pointer', outline: 'none' }}>
          {TRIGGER_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: trigger.color, width: 10, height: 10, border: '2px solid #fff' }} />
    </div>
  );
}

function ActionNode({ data }: { data: any }) {
  const action = ACTION_OPTIONS.find(a => a.value === data.action) || ACTION_OPTIONS[0];
  const Icon = action.icon;
  const hasConfig = action.hasEmailConfig || action.hasBotConfig || action.hasBadgeConfig || action.hasGroupConfig;
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', minWidth: 240, border: `2px solid ${data.selected ? C.pink : action.color}`, boxShadow: data.selected ? '0 0 0 3px rgba(233,30,99,.15)' : '0 2px 8px rgba(0,0,0,.08)', transition: 'all .2s' }}>
      <Handle type="target" position={Position.Top} style={{ background: action.color, width: 10, height: 10, border: '2px solid #fff' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: action.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>Action</div>
        <div style={{ display: 'flex', gap: 2 }}>
          {hasConfig && <button onClick={() => data.onSelect?.()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }} title="Configurer"><Settings size={12} color={data.selected ? C.pink : '#bbb'} /></button>}
          {data.onMoveUp && <button onClick={data.onMoveUp} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }} title="Monter"><ChevronUp size={12} color="#bbb" /></button>}
          {data.onMoveDown && <button onClick={data.onMoveDown} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }} title="Descendre"><ChevronDown size={12} color="#bbb" /></button>}
          {data.onDelete && <button onClick={data.onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }} title="Supprimer"><Trash2 size={12} color="#ccc" /></button>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: `${action.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={14} color={action.color} /></div>
        <select value={data.action} onChange={e => data.onChange?.('action', e.target.value)}
          style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 12, fontWeight: 600, color: '#1a1a2e', cursor: 'pointer', outline: 'none' }}>
          {ACTION_OPTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: 10, color: '#888' }}>→</span>
        <select value={data.destinataire || 'Collaborateur'} onChange={e => data.onChange?.('destinataire', e.target.value)}
          style={{ flex: 1, border: 'none', background: '#f5f5f5', borderRadius: 6, padding: '4px 8px', fontSize: 11, color: '#666', cursor: 'pointer', outline: 'none' }}>
          {RECIPIENT_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      {/* Show config summary if has settings */}
      {data.email_subject && <div style={{ marginTop: 6, fontSize: 10, color: '#999', display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={9} /> {data.email_subject}</div>}
      {data.badge_name && <div style={{ marginTop: 6, fontSize: 10, color: '#999', display: 'flex', alignItems: 'center', gap: 4 }}><Award size={9} /> {data.badge_name}</div>}
      <Handle type="source" position={Position.Bottom} style={{ background: action.color, width: 10, height: 10, border: '2px solid #fff' }} />
    </div>
  );
}

function ConditionNode({ data }: { data: any }) {
  const fieldLabel = CONDITION_FIELDS.find(f => f.value === data.field)?.label || data.field;
  const opLabel = data.operator === '==' ? '=' : data.operator === '!=' ? '≠' : '∋';
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', minWidth: 260, border: '2px solid #FF9800', boxShadow: '0 2px 8px rgba(0,0,0,.08)', position: 'relative' }}>
      <Handle type="target" position={Position.Top} style={{ background: '#FF9800', width: 10, height: 10, border: '2px solid #fff' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#FF9800', textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 4 }}><GitBranch size={12} /> Condition</div>
        <div style={{ display: 'flex', gap: 2 }}>
          {data.onMoveUp && <button onClick={data.onMoveUp} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}><ChevronUp size={12} color="#bbb" /></button>}
          {data.onMoveDown && <button onClick={data.onMoveDown} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}><ChevronDown size={12} color="#bbb" /></button>}
          {data.onDelete && <button onClick={data.onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}><Trash2 size={12} color="#ccc" /></button>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <select value={data.field || 'site'} onChange={e => data.onChange?.('field', e.target.value)}
          style={{ flex: 1, border: '1px solid #e0e0e0', borderRadius: 6, padding: '4px 6px', fontSize: 11, outline: 'none' }}>
          {CONDITION_FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <select value={data.operator || '=='} onChange={e => data.onChange?.('operator', e.target.value)}
          style={{ width: 50, border: '1px solid #e0e0e0', borderRadius: 6, padding: '4px 4px', fontSize: 11, outline: 'none' }}>
          <option value="==">= </option>
          <option value="!=">≠</option>
          <option value="contains">∋</option>
        </select>
        <input value={data.value || ''} onChange={e => data.onChange?.('value', e.target.value)} placeholder="valeur"
          style={{ flex: 1, border: '1px solid #e0e0e0', borderRadius: 6, padding: '4px 6px', fontSize: 11, outline: 'none' }} />
      </div>
      {/* Visual branching labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 9, fontWeight: 600 }}>
        <span style={{ color: '#4CAF50' }}>✓ Vrai → continuer</span>
        <span style={{ color: '#E53935' }}>✗ Faux → arrêter</span>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: '#4CAF50', width: 10, height: 10, border: '2px solid #fff' }} />
    </div>
  );
}

function DelayNode({ data }: { data: any }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', minWidth: 200, border: '2px solid #9C27B0', boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
      <Handle type="target" position={Position.Top} style={{ background: '#9C27B0', width: 10, height: 10, border: '2px solid #fff' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#9C27B0', textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 4 }}><Timer size={12} /> Délai</div>
        <div style={{ display: 'flex', gap: 2 }}>
          {data.onMoveUp && <button onClick={data.onMoveUp} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}><ChevronUp size={12} color="#bbb" /></button>}
          {data.onMoveDown && <button onClick={data.onMoveDown} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}><ChevronDown size={12} color="#bbb" /></button>}
          {data.onDelete && <button onClick={data.onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}><Trash2 size={12} color="#ccc" /></button>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12, color: '#666' }}>Attendre</span>
        <input type="number" value={data.delay_value || 1} onChange={e => data.onChange?.('delay_value', Number(e.target.value))} min={1}
          style={{ width: 50, border: '1px solid #e0e0e0', borderRadius: 6, padding: '4px 6px', fontSize: 12, textAlign: 'center', outline: 'none' }} />
        <select value={data.delay_unit || 'days'} onChange={e => data.onChange?.('delay_unit', e.target.value)}
          style={{ border: '1px solid #e0e0e0', borderRadius: 6, padding: '4px 6px', fontSize: 11, outline: 'none' }}>
          <option value="hours">heures</option>
          <option value="days">jours</option>
          <option value="weeks">semaines</option>
        </select>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: '#9C27B0', width: 10, height: 10, border: '2px solid #fff' }} />
    </div>
  );
}

const nodeTypes = { trigger: TriggerNode, action: ActionNode, condition: ConditionNode, delay: DelayNode };

// ── Config Panel ──

function StepConfigPanel({ step, stepIndex, onChange, onClose, groups, users, actions = [], integrations = {} }: any) {
  const action = ACTION_OPTIONS.find(a => a.value === step.action);
  if (!action) return null;

  const update = (field: string, val: any) => onChange(stepIndex, { ...step, [field]: val });

  // Surface integration warning at the top if the action requires one and it's not configured.
  const integrationKey = (action as any).requiresIntegration as string | undefined;
  const integrationActive = integrationKey
    ? (integrationKey === 'signature'
        ? (integrations.docusign?.actif || integrations.ugosign?.actif)
        : !!integrations[integrationKey]?.actif)
    : true;

  return (
    <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: '100%', background: '#fff', borderLeft: `1px solid ${C.border}`, zIndex: 20, display: 'flex', flexDirection: 'column', boxShadow: '-2px 0 12px rgba(0,0,0,.05)' }}>
      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Configuration</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} color="#999" /></button>
      </div>
      <div style={{ flex: 1, padding: 16, overflow: 'auto', fontSize: 12 }}>
        {/* Integration warning */}
        {integrationKey && !integrationActive && (
          <div style={{ marginBottom: 14, padding: '10px 12px', background: '#FFEBEE', border: '1px solid #E5737333', borderRadius: 8, fontSize: 11, color: '#C62828', lineHeight: 1.5 }}>
            <strong>Intégration {integrationKey === 'signature' ? 'signature électronique' : integrationKey} requise.</strong><br />
            Configure-la dans <em>Intégrations</em> avant d'activer ce workflow, sinon l'action échouera silencieusement.
          </div>
        )}

        {/* Email config */}
        {action.hasEmailConfig && (
          <>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: 'block', marginBottom: 4 }}>Sujet de l'email</label>
              <input value={step.email_subject || ''} onChange={e => update('email_subject', e.target.value)}
                placeholder="Laisser vide = sujet par défaut" style={{ width: '100%', padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, outline: 'none' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: 'block', marginBottom: 4 }}>Corps de l'email</label>
              <textarea value={step.email_body || ''} onChange={e => update('email_body', e.target.value)}
                placeholder="Variables : {{prenom}}, {{nom}}, {{parcours_nom}}, {{date_debut}}"
                style={{ width: '100%', padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, minHeight: 100, resize: 'vertical', outline: 'none' }} />
            </div>
            <div style={{ padding: '8px 10px', background: '#f5f5f5', borderRadius: 6, fontSize: 10, color: '#888', marginBottom: 12 }}>
              Variables disponibles : {'{{prenom}}'}, {'{{nom}}'}, {'{{date_debut}}'}, {'{{site}}'}, {'{{poste}}'}, {'{{departement}}'}, {'{{parcours_nom}}'}, {'{{manager}}'}, {'{{action_nom}}'}, {'{{document_nom}}'}
            </div>
          </>
        )}

        {/* Bot message config */}
        {action.hasBotConfig && (
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: 'block', marginBottom: 4 }}>Message du bot</label>
            <textarea value={step.bot_message || ''} onChange={e => update('bot_message', e.target.value)}
              placeholder="Message personnalisé"
              style={{ width: '100%', padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, minHeight: 80, resize: 'vertical', outline: 'none' }} />
          </div>
        )}

        {/* Badge config */}
        {action.hasBadgeConfig && (
          <>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: 'block', marginBottom: 4 }}>Nom du badge</label>
              <input value={step.badge_name || ''} onChange={e => update('badge_name', e.target.value)} placeholder="Ex: Champion Onboarding"
                style={{ width: '100%', padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: 'block', marginBottom: 4 }}>Icône</label>
                <select value={step.badge_icon || 'trophy'} onChange={e => update('badge_icon', e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }}>
                  {['trophy', 'star', 'award', 'target', 'sparkles', 'gift', 'check-circle'].map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: 'block', marginBottom: 4 }}>Couleur</label>
                <input type="color" value={step.badge_color || '#F9A825'} onChange={e => update('badge_color', e.target.value)}
                  style={{ width: 40, height: 34, border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer', padding: 2 }} />
              </div>
            </div>
          </>
        )}

        {/* Group config */}
        {action.hasGroupConfig && groups.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: 'block', marginBottom: 4 }}>Groupe cible</label>
            <select value={step.target_group_id || ''} onChange={e => update('target_group_id', e.target.value ? Number(e.target.value) : null)}
              style={{ width: '100%', padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }}>
              <option value="">— Sélectionner —</option>
              {groups.map((g: any) => <option key={g.id} value={g.id}>{g.nom}</option>)}
            </select>
          </div>
        )}

        {/* Action assignment config */}
        {action.hasActionConfig && (
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: 'block', marginBottom: 4 }}>Action à assigner</label>
            {actions.length === 0 ? (
              <div style={{ padding: '8px 10px', background: '#FFF8E1', border: '1px solid #FFC107', borderRadius: 8, fontSize: 11, color: '#5D4037' }}>
                Aucune action disponible. Crée d'abord une action template dans <em>Parcours &amp; Actions</em>.
              </div>
            ) : (
              <select value={step.target_action_id || ''} onChange={e => update('target_action_id', e.target.value ? Number(e.target.value) : null)}
                style={{ width: '100%', padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }}>
                <option value="">— Sélectionner une action —</option>
                {actions.map((a: any) => <option key={a.id} value={a.id}>{a.titre || a.nom}</option>)}
              </select>
            )}
            <div style={{ padding: '8px 10px', background: '#f5f5f5', borderRadius: 6, fontSize: 10, color: '#888', marginTop: 8, lineHeight: 1.5 }}>
              L'action sera créée automatiquement dans le parcours du collaborateur (statut « à faire »).
            </div>
          </div>
        )}

        {/* Document generation config — reuses email_subject + email_body */}
        {action.hasDocConfig && (
          <>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: 'block', marginBottom: 4 }}>Titre du document</label>
              <input value={step.email_subject || ''} onChange={e => update('email_subject', e.target.value)}
                placeholder="Ex: Attestation d'embauche {{prenom}} {{nom}}"
                style={{ width: '100%', padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, outline: 'none' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: 'block', marginBottom: 4 }}>Contenu du document (HTML)</label>
              <textarea value={step.email_body || ''} onChange={e => update('email_body', e.target.value)}
                placeholder="<p>Bonjour {{prenom}},</p><p>Voici votre attestation...</p>"
                style={{ width: '100%', padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, minHeight: 140, resize: 'vertical', outline: 'none', fontFamily: 'monospace' }} />
            </div>
            <div style={{ padding: '8px 10px', background: '#f5f5f5', borderRadius: 6, fontSize: 10, color: '#888', marginBottom: 12, lineHeight: 1.5 }}>
              Le document sera généré en PDF et ajouté au dossier du collaborateur. Variables : {'{{prenom}}'}, {'{{nom}}'}, {'{{date_debut}}'}, {'{{site}}'}, {'{{poste}}'}, {'{{departement}}'}.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Component ──

interface WorkflowBuilderProps {
  workflow: any;
  onChange: (workflow: any) => void;
  groups?: any[];
  users?: any[];
  actions?: any[];
  integrations?: Record<string, { actif?: boolean }>;
}

export default function WorkflowBuilder({ workflow, onChange, groups = [], users = [], actions = [], integrations = {} }: WorkflowBuilderProps) {
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const steps = workflow.steps || [];

  const moveStep = (index: number, dir: -1 | 1) => {
    const newSteps = [...steps];
    const target = index + dir;
    if (target < 0 || target >= newSteps.length) return;
    [newSteps[index], newSteps[target]] = [newSteps[target], newSteps[index]];
    onChange({ ...workflow, steps: newSteps });
    if (selectedStep === index) setSelectedStep(target);
  };

  const updateStep = (index: number, updatedStep: any) => {
    const newSteps = [...steps];
    newSteps[index] = updatedStep;
    onChange({ ...workflow, steps: newSteps });
  };

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    nodes.push({
      id: 'trigger', type: 'trigger', position: { x: 250, y: 20 },
      data: {
        trigger: workflow.declencheur || TRIGGER_OPTIONS[0].value,
        onChange: (val: string) => onChange({ ...workflow, declencheur: val }),
      },
    });

    if (steps.length === 0 && workflow.action) {
      nodes.push({
        id: 'step-0', type: 'action', position: { x: 250, y: 160 },
        data: {
          action: workflow.action, destinataire: workflow.destinataire,
          onChange: (field: string, val: string) => onChange({ ...workflow, [field]: val }),
        },
      });
      edges.push({ id: 'e-trigger-0', source: 'trigger', target: 'step-0', style: { stroke: '#ccc', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ccc' } });
    } else {
      steps.forEach((step: any, i: number) => {
        nodes.push({
          id: `step-${i}`, type: step.type || 'action', position: { x: 250, y: 160 + i * 150 },
          data: {
            ...step,
            selected: selectedStep === i,
            onChange: (field: string, val: any) => {
              const ns = [...steps]; ns[i] = { ...ns[i], [field]: val };
              onChange({ ...workflow, steps: ns });
            },
            onSelect: () => setSelectedStep(selectedStep === i ? null : i),
            onDelete: () => { onChange({ ...workflow, steps: steps.filter((_: any, j: number) => j !== i) }); if (selectedStep === i) setSelectedStep(null); },
            onMoveUp: i > 0 ? () => moveStep(i, -1) : undefined,
            onMoveDown: i < steps.length - 1 ? () => moveStep(i, 1) : undefined,
          },
        });
        edges.push({
          id: `e-${i === 0 ? 'trigger' : `step-${i - 1}`}-step-${i}`,
          source: i === 0 ? 'trigger' : `step-${i - 1}`, target: `step-${i}`,
          style: { stroke: steps[i > 0 ? i - 1 : 0]?.type === 'condition' ? '#4CAF50' : '#ccc', strokeWidth: 2, strokeDasharray: step.type === 'delay' ? '6 3' : undefined },
          markerEnd: { type: MarkerType.ArrowClosed, color: steps[i > 0 ? i - 1 : 0]?.type === 'condition' ? '#4CAF50' : '#ccc' },
          label: steps[i > 0 ? i - 1 : 0]?.type === 'condition' ? '✓ Vrai' : undefined,
          labelStyle: { fontSize: 9, fontWeight: 700, fill: '#4CAF50' },
          labelBgStyle: { fill: '#fff', fillOpacity: 0.9 },
        });
      });
    }
    return { initialNodes: nodes, initialEdges: edges };
  }, [workflow, selectedStep]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  useMemo(() => { setNodes(initialNodes); setEdges(initialEdges); }, [initialNodes, initialEdges]);

  const addStep = (type: 'action' | 'condition' | 'delay') => {
    const newStep: any = { type };
    if (type === 'action') { newStep.action = ACTION_OPTIONS[0].value; newStep.destinataire = 'Collaborateur'; }
    else if (type === 'condition') { newStep.field = 'site'; newStep.operator = '=='; newStep.value = ''; }
    else if (type === 'delay') { newStep.delay_value = 1; newStep.delay_unit = 'days'; }
    onChange({ ...workflow, steps: [...steps, newStep] });
    setAddMenuOpen(false);
  };

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes} fitView proOptions={{ hideAttribution: true }} style={{ background: '#fafafa' }}
        onPaneClick={() => setSelectedStep(null)}
      >
        <Background color="#e0e0e0" gap={20} />
        <Controls showInteractive={false} position="bottom-left" />
      </ReactFlow>

      {/* Add step FAB */}
      <div style={{ position: 'absolute', bottom: 16, right: selectedStep !== null ? 316 : 16, zIndex: 10, transition: 'right .2s' }}>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setAddMenuOpen(!addMenuOpen)}
            style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: C.pink, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(233,30,99,.3)' }}>
            <Plus size={22} />
          </button>
          {addMenuOpen && (
            <div style={{ position: 'absolute', bottom: 52, right: 0, background: '#fff', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,.15)', padding: 8, minWidth: 180 }}>
              <button onClick={() => addStep('action')} style={menuItemStyle}><Zap size={14} color="#1A73E8" /> Action</button>
              <button onClick={() => addStep('condition')} style={menuItemStyle}><GitBranch size={14} color="#FF9800" /> Condition</button>
              <button onClick={() => addStep('delay')} style={menuItemStyle}><Timer size={14} color="#9C27B0" /> Délai</button>
            </div>
          )}
        </div>
      </div>

      {/* Step config panel */}
      {selectedStep !== null && steps[selectedStep] && steps[selectedStep].type === 'action' && (
        <StepConfigPanel
          step={steps[selectedStep]}
          stepIndex={selectedStep}
          onChange={updateStep}
          onClose={() => setSelectedStep(null)}
          groups={groups}
          users={users}
          actions={actions}
          integrations={integrations}
        />
      )}
    </div>
  );
}

const menuItemStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px',
  border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
  color: '#333', borderRadius: 6, textAlign: 'left',
};
