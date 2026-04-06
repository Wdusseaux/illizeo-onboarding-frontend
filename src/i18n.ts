export type Lang = 'fr' | 'en' | 'de' | 'it' | 'es';

export const LANG_META: Record<Lang, { label: string; flag: string; nativeName: string }> = {
  fr: { label: 'Français', flag: '🇫🇷', nativeName: 'Français' },
  en: { label: 'English', flag: '🇬🇧', nativeName: 'English' },
  de: { label: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch' },
  it: { label: 'Italiano', flag: '🇮🇹', nativeName: 'Italiano' },
  es: { label: 'Español', flag: '🇪🇸', nativeName: 'Español' },
};

const translations: Record<string, Record<Lang, string>> = {
  // ─── Auth ─────────────────────────────────────────
  'auth.login': { fr: 'Connexion', en: 'Login', de: 'Anmeldung', it: 'Accesso', es: 'Iniciar sesión' },
  'auth.login_subtitle': { fr: 'Accédez à votre espace onboarding', en: 'Access your onboarding space', de: 'Zugang zu Ihrem Onboarding-Bereich', it: 'Accedi al tuo spazio onboarding', es: 'Acceda a su espacio de onboarding' },
  'auth.email': { fr: 'Email', en: 'Email', de: 'E-Mail', it: 'Email', es: 'Correo electrónico' },
  'auth.password': { fr: 'Mot de passe', en: 'Password', de: 'Passwort', it: 'Password', es: 'Contraseña' },
  'auth.submit': { fr: 'Se connecter', en: 'Sign in', de: 'Anmelden', it: 'Accedi', es: 'Iniciar sesión' },
  'auth.loading': { fr: 'Connexion...', en: 'Signing in...', de: 'Anmeldung...', it: 'Accesso...', es: 'Conectando...' },
  'auth.forgot': { fr: 'Mot de passe oublié ?', en: 'Forgot password?', de: 'Passwort vergessen?', it: 'Password dimenticata?', es: '¿Olvidó su contraseña?' },
  'auth.forgot_title': { fr: 'Réinitialiser le mot de passe', en: 'Reset password', de: 'Passwort zurücksetzen', it: 'Reimposta password', es: 'Restablecer contraseña' },
  'auth.forgot_desc': { fr: 'Entrez votre email, vous recevrez un lien de réinitialisation.', en: 'Enter your email to receive a reset link.', de: 'Geben Sie Ihre E-Mail ein, um einen Reset-Link zu erhalten.', it: 'Inserisci la tua email per ricevere un link di ripristino.', es: 'Ingrese su correo para recibir un enlace de restablecimiento.' },
  'auth.forgot_sent': { fr: 'Email envoyé !', en: 'Email sent!', de: 'E-Mail gesendet!', it: 'Email inviata!', es: '¡Correo enviado!' },
  'auth.forgot_sent_desc': { fr: 'Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.', en: 'Check your inbox to reset your password.', de: 'Überprüfen Sie Ihren Posteingang, um Ihr Passwort zurückzusetzen.', it: 'Controlla la tua casella di posta per reimpostare la password.', es: 'Revise su bandeja de entrada para restablecer su contraseña.' },
  'auth.back_to_login': { fr: 'Retour à la connexion', en: 'Back to login', de: 'Zurück zur Anmeldung', it: 'Torna al login', es: 'Volver al inicio de sesión' },
  'auth.send': { fr: 'Envoyer', en: 'Send', de: 'Senden', it: 'Invia', es: 'Enviar' },
  'auth.cancel': { fr: 'Annuler', en: 'Cancel', de: 'Abbrechen', it: 'Annulla', es: 'Cancelar' },
  'auth.demo_accounts': { fr: 'Comptes de démo :', en: 'Demo accounts:', de: 'Demo-Konten:', it: 'Account demo:', es: 'Cuentas de demostración:' },
  'auth.logout': { fr: 'Déconnexion', en: 'Sign out', de: 'Abmelden', it: 'Esci', es: 'Cerrar sesión' },
  'auth.error_credentials': { fr: 'Les identifiants sont incorrects.', en: 'Invalid credentials.', de: 'Ungültige Anmeldedaten.', it: 'Credenziali non valide.', es: 'Credenciales inválidas.' },
  'common.loading': { fr: 'Chargement...', en: 'Loading...', de: 'Laden...', it: 'Caricamento...', es: 'Cargando...' },

  // ─── Sidebar Employee ─────────────────────────────
  'sidebar.my_workspace': { fr: 'MON ESPACE DE TRAVAIL', en: 'MY WORKSPACE', de: 'MEIN ARBEITSBEREICH', it: 'IL MIO SPAZIO', es: 'MI ESPACIO' },
  'sidebar.dashboard': { fr: 'Tableau de bord', en: 'Dashboard', de: 'Dashboard', it: 'Dashboard', es: 'Panel' },
  'sidebar.my_actions': { fr: 'Mes actions', en: 'My actions', de: 'Meine Aufgaben', it: 'Le mie azioni', es: 'Mis acciones' },
  'sidebar.my_tracking': { fr: 'Mon suivi', en: 'My tracking', de: 'Mein Tracking', it: 'Il mio tracciamento', es: 'Mi seguimiento' },
  'sidebar.messaging': { fr: 'Messagerie', en: 'Messaging', de: 'Nachrichten', it: 'Messaggi', es: 'Mensajería' },
  'sidebar.notifications': { fr: 'Notifications', en: 'Notifications', de: 'Benachrichtigungen', it: 'Notifiche', es: 'Notificaciones' },
  'sidebar.company': { fr: 'Entreprise', en: 'Company', de: 'Unternehmen', it: 'Azienda', es: 'Empresa' },
  'sidebar.illizeo': { fr: 'ILLIZEO', en: 'ILLIZEO', de: 'ILLIZEO', it: 'ILLIZEO', es: 'ILLIZEO' },

  // ─── Sidebar Admin ────────────────────────────────
  'admin.dashboard_title': { fr: 'TABLEAU DE BORD', en: 'DASHBOARD', de: 'DASHBOARD', it: 'DASHBOARD', es: 'PANEL' },
  'admin.management': { fr: 'GESTION', en: 'MANAGEMENT', de: 'VERWALTUNG', it: 'GESTIONE', es: 'GESTIÓN' },
  'admin.parcours_actions': { fr: 'Parcours & Actions', en: 'Paths & Actions', de: 'Pfade & Aktionen', it: 'Percorsi & Azioni', es: 'Rutas & Acciones' },
  'admin.collaborateur_tracking': { fr: 'Suivi collaborateurs', en: 'Employee tracking', de: 'Mitarbeiter-Tracking', it: 'Monitoraggio dipendenti', es: 'Seguimiento empleados' },
  'admin.documents': { fr: 'Documents', en: 'Documents', de: 'Dokumente', it: 'Documenti', es: 'Documentos' },
  'admin.teams_groups': { fr: 'Équipes & Groupes', en: 'Teams & Groups', de: 'Teams & Gruppen', it: 'Team & Gruppi', es: 'Equipos & Grupos' },
  'admin.messaging': { fr: 'Messagerie', en: 'Messaging', de: 'Nachrichten', it: 'Messaggi', es: 'Mensajería' },
  'admin.automation': { fr: 'AUTOMATISATION', en: 'AUTOMATION', de: 'AUTOMATISIERUNG', it: 'AUTOMAZIONE', es: 'AUTOMATIZACIÓN' },
  'admin.workflows': { fr: 'Workflows', en: 'Workflows', de: 'Workflows', it: 'Workflow', es: 'Flujos de trabajo' },
  'admin.email_templates': { fr: 'Templates emails', en: 'Email templates', de: 'E-Mail-Vorlagen', it: 'Modelli email', es: 'Plantillas de email' },
  'admin.notifications': { fr: 'Notifications', en: 'Notifications', de: 'Benachrichtigungen', it: 'Notifiche', es: 'Notificaciones' },
  'admin.content': { fr: 'CONTENU', en: 'CONTENT', de: 'INHALT', it: 'CONTENUTO', es: 'CONTENIDO' },
  'admin.company_page': { fr: 'Page entreprise', en: 'Company page', de: 'Unternehmensseite', it: 'Pagina aziendale', es: 'Página de empresa' },
  'admin.equipment': { fr: 'Matériel', en: 'Equipment', de: 'Ausstattung', it: 'Attrezzature', es: 'Equipamiento' },
  'admin.signatures': { fr: 'Documents à signer', en: 'Documents to sign', de: 'Zu unterzeichnende Dokumente', it: 'Documenti da firmare', es: 'Documentos a firmar' },
  'admin.nps': { fr: 'NPS & Satisfaction', en: 'NPS & Satisfaction', de: 'NPS & Zufriedenheit', it: 'NPS & Soddisfazione', es: 'NPS & Satisfacción' },
  'admin.contracts': { fr: 'Contrats', en: 'Contracts', de: 'Verträge', it: 'Contratti', es: 'Contratos' },
  'admin.cooptation': { fr: 'Cooptation', en: 'Referral', de: 'Empfehlung', it: 'Cooptazione', es: 'Cooptación' },
  'admin.gamification': { fr: 'Gamification', en: 'Gamification', de: 'Gamification', it: 'Gamification', es: 'Gamificación' },
  'admin.integrations': { fr: 'Intégrations', en: 'Integrations', de: 'Integrationen', it: 'Integrazioni', es: 'Integraciones' },
  'admin.settings': { fr: 'PARAMÈTRES', en: 'SETTINGS', de: 'EINSTELLUNGEN', it: 'IMPOSTAZIONI', es: 'CONFIGURACIÓN' },
  'admin.users_roles': { fr: 'Utilisateurs & Rôles', en: 'Users & Roles', de: 'Benutzer & Rollen', it: 'Utenti & Ruoli', es: 'Usuarios & Roles' },
  'admin.collab_fields': { fr: 'Champs collaborateur', en: 'Employee fields', de: 'Mitarbeiterfelder', it: 'Campi dipendente', es: 'Campos del empleado' },
  'admin.appearance': { fr: 'Apparence', en: 'Appearance', de: 'Erscheinungsbild', it: 'Aspetto', es: 'Apariencia' },
  'admin.security': { fr: 'Sécurité (2FA)', en: 'Security (2FA)', de: 'Sicherheit (2FA)', it: 'Sicurezza (2FA)', es: 'Seguridad (2FA)' },
  'admin.data_rgpd': { fr: 'Données & RGPD', en: 'Data & GDPR', de: 'Daten & DSGVO', it: 'Dati & GDPR', es: 'Datos & RGPD' },
  'admin.subscription': { fr: 'Abonnement', en: 'Subscription', de: 'Abonnement', it: 'Abbonamento', es: 'Suscripción' },
  'admin.notif_config': { fr: 'Configuration des notifications', en: 'Notification settings', de: 'Benachrichtigungseinstellungen', it: 'Impostazioni notifiche', es: 'Configuración de notificaciones' },
  'badge.new': { fr: 'Nouveau badge', en: 'New badge', de: 'Neues Abzeichen', it: 'Nuovo badge', es: 'Nueva insignia' },
  'badge.edit': { fr: 'Modifier le badge', en: 'Edit badge', de: 'Abzeichen bearbeiten', it: 'Modifica badge', es: 'Editar insignia' },
  'contrat.edit': { fr: 'Modifier le contrat', en: 'Edit contract', de: 'Vertrag bearbeiten', it: 'Modifica contratto', es: 'Editar contrato' },
  'coopt.edit': { fr: 'Modifier la cooptation', en: 'Edit referral', de: 'Empfehlung bearbeiten', it: 'Modifica cooptazione', es: 'Editar cooptación' },
  'doc.edit_template': { fr: 'Modifier le template', en: 'Edit template', de: 'Vorlage bearbeiten', it: 'Modifica modello', es: 'Editar plantilla' },
  'trial.banner': { fr: "Période d'essai", en: 'Trial period', de: 'Testphase', it: 'Periodo di prova', es: 'Período de prueba' },
  'trial.days_left': { fr: 'jours restants', en: 'days left', de: 'Tage übrig', it: 'giorni rimanenti', es: 'días restantes' },
  'trial.all_features': { fr: 'Toutes les fonctionnalités sont accessibles.', en: 'All features are accessible.', de: 'Alle Funktionen sind zugänglich.', it: 'Tutte le funzionalità sono accessibili.', es: 'Todas las funcionalidades son accesibles.' },
  'trial.subscribe': { fr: 'Souscrire maintenant', en: 'Subscribe now', de: 'Jetzt abonnieren', it: 'Abbonati ora', es: 'Suscribirse ahora' },
  'messaging.title': { fr: 'Messagerie', en: 'Messaging', de: 'Nachrichten', it: 'Messaggi', es: 'Mensajería' },
  'messaging.no_conversations': { fr: 'Aucune conversation', en: 'No conversations', de: 'Keine Gespräche', it: 'Nessuna conversazione', es: 'Sin conversaciones' },
  'messaging.new': { fr: 'Nouvelle conversation', en: 'New conversation', de: 'Neues Gespräch', it: 'Nuova conversazione', es: 'Nueva conversación' },
  'messaging.select': { fr: 'Sélectionnez une conversation', en: 'Select a conversation', de: 'Gespräch auswählen', it: 'Seleziona una conversazione', es: 'Seleccione una conversación' },
  'messaging.choose_contact': { fr: 'Choisissez un contact à gauche pour commencer', en: 'Choose a contact on the left to start', de: 'Wählen Sie einen Kontakt links aus', it: 'Scegli un contatto a sinistra', es: 'Elija un contacto a la izquierda' },

  // ─── Dashboard ────────────────────────────────────
  'dashboard.title': { fr: 'Dashboard Onboarding', en: 'Onboarding Dashboard', de: 'Onboarding Dashboard', it: 'Dashboard Onboarding', es: 'Panel de Onboarding' },
  'dashboard.active_collabs': { fr: 'Collaborateurs actifs', en: 'Active employees', de: 'Aktive Mitarbeiter', it: 'Dipendenti attivi', es: 'Empleados activos' },
  'dashboard.ongoing_paths': { fr: 'Parcours en cours', en: 'Ongoing paths', de: 'Laufende Pfade', it: 'Percorsi in corso', es: 'Rutas en curso' },
  'dashboard.pending_docs': { fr: 'Documents en attente', en: 'Pending documents', de: 'Ausstehende Dokumente', it: 'Documenti in attesa', es: 'Documentos pendientes' },
  'dashboard.completion_rate': { fr: 'Taux de complétion', en: 'Completion rate', de: 'Abschlussrate', it: 'Tasso di completamento', es: 'Tasa de finalización' },
  'dashboard.recent_collabs': { fr: 'Collaborateurs récents', en: 'Recent employees', de: 'Neue Mitarbeiter', it: 'Dipendenti recenti', es: 'Empleados recientes' },
  'dashboard.status_breakdown': { fr: 'Répartition statuts', en: 'Status breakdown', de: 'Statusverteilung', it: 'Ripartizione stati', es: 'Desglose de estados' },

  // ─── Parcours ─────────────────────────────────────
  'parcours.title': { fr: 'Parcours & Actions', en: 'Paths & Actions', de: 'Pfade & Aktionen', it: 'Percorsi & Azioni', es: 'Rutas & Acciones' },
  'parcours.new': { fr: 'Nouveau parcours', en: 'New path', de: 'Neuer Pfad', it: 'Nuovo percorso', es: 'Nueva ruta' },
  'parcours.new_phase': { fr: 'Nouvelle phase', en: 'New phase', de: 'Neue Phase', it: 'Nuova fase', es: 'Nueva fase' },
  'parcours.new_action': { fr: 'Nouvelle action', en: 'New action', de: 'Neue Aktion', it: 'Nuova azione', es: 'Nueva acción' },
  'parcours.new_group': { fr: 'Nouveau groupe', en: 'New group', de: 'Neue Gruppe', it: 'Nuovo gruppo', es: 'Nuevo grupo' },
  'parcours.tab_parcours': { fr: 'Parcours', en: 'Paths', de: 'Pfade', it: 'Percorsi', es: 'Rutas' },
  'parcours.tab_phases': { fr: 'Phases', en: 'Phases', de: 'Phasen', it: 'Fasi', es: 'Fases' },
  'parcours.tab_actions': { fr: 'Actions & Tâches', en: 'Actions & Tasks', de: 'Aktionen & Aufgaben', it: 'Azioni & Compiti', es: 'Acciones & Tareas' },
  'parcours.tab_groups': { fr: 'Groupes', en: 'Groups', de: 'Gruppen', it: 'Gruppi', es: 'Grupos' },

  // ─── Collaborateurs ───────────────────────────────
  'collab.tracking_title': { fr: 'Suivi des collaborateurs', en: 'Employee tracking', de: 'Mitarbeiter-Tracking', it: 'Monitoraggio dipendenti', es: 'Seguimiento de empleados' },
  'collab.new': { fr: 'Nouveau collaborateur', en: 'New employee', de: 'Neuer Mitarbeiter', it: 'Nuovo dipendente', es: 'Nuevo empleado' },
  'collab.name': { fr: 'Collaborateur', en: 'Employee', de: 'Mitarbeiter', it: 'Dipendente', es: 'Empleado' },
  'collab.position': { fr: 'Poste', en: 'Position', de: 'Position', it: 'Posizione', es: 'Puesto' },
  'collab.site': { fr: 'Site', en: 'Location', de: 'Standort', it: 'Sede', es: 'Sede' },
  'collab.start_date': { fr: 'Date début', en: 'Start date', de: 'Startdatum', it: 'Data inizio', es: 'Fecha inicio' },
  'collab.phase': { fr: 'Phase', en: 'Phase', de: 'Phase', it: 'Fase', es: 'Fase' },
  'collab.docs': { fr: 'Docs', en: 'Docs', de: 'Docs', it: 'Doc', es: 'Docs' },
  'collab.progression': { fr: 'Progression', en: 'Progress', de: 'Fortschritt', it: 'Progresso', es: 'Progreso' },
  'collab.status': { fr: 'Statut', en: 'Status', de: 'Status', it: 'Stato', es: 'Estado' },

  // ─── Status ───────────────────────────────────────
  'status.completed': { fr: 'Terminé', en: 'Completed', de: 'Abgeschlossen', it: 'Completato', es: 'Completado' },
  'status.late': { fr: 'En retard', en: 'Late', de: 'Verspätet', it: 'In ritardo', es: 'Atrasado' },
  'status.ongoing': { fr: 'En cours', en: 'In progress', de: 'In Bearbeitung', it: 'In corso', es: 'En curso' },
  'status.active': { fr: 'Actif', en: 'Active', de: 'Aktiv', it: 'Attivo', es: 'Activo' },
  'status.draft': { fr: 'Brouillon', en: 'Draft', de: 'Entwurf', it: 'Bozza', es: 'Borrador' },
  'status.archived': { fr: 'Archivé', en: 'Archived', de: 'Archiviert', it: 'Archiviato', es: 'Archivado' },
  'status.disabled': { fr: 'Désactivé', en: 'Disabled', de: 'Deaktiviert', it: 'Disattivato', es: 'Desactivado' },

  // ─── Common ───────────────────────────────────────
  'common.save': { fr: 'Enregistrer', en: 'Save', de: 'Speichern', it: 'Salva', es: 'Guardar' },
  'common.cancel': { fr: 'Annuler', en: 'Cancel', de: 'Abbrechen', it: 'Annulla', es: 'Cancelar' },
  'common.delete': { fr: 'Supprimer', en: 'Delete', de: 'Löschen', it: 'Elimina', es: 'Eliminar' },
  'common.edit': { fr: 'Modifier', en: 'Edit', de: 'Bearbeiten', it: 'Modifica', es: 'Editar' },
  'common.create': { fr: 'Créer', en: 'Create', de: 'Erstellen', it: 'Crea', es: 'Crear' },
  'common.close': { fr: 'Fermer', en: 'Close', de: 'Schliessen', it: 'Chiudi', es: 'Cerrar' },
  'common.search': { fr: 'Rechercher...', en: 'Search...', de: 'Suchen...', it: 'Cerca...', es: 'Buscar...' },
  'common.confirm': { fr: 'Confirmation', en: 'Confirmation', de: 'Bestätigung', it: 'Conferma', es: 'Confirmación' },
  'common.yes': { fr: 'Oui', en: 'Yes', de: 'Ja', it: 'Sì', es: 'Sí' },
  'common.no': { fr: 'Non', en: 'No', de: 'Nein', it: 'No', es: 'No' },
  'common.actions': { fr: 'actions', en: 'actions', de: 'Aktionen', it: 'azioni', es: 'acciones' },
  'common.members': { fr: 'membres', en: 'members', de: 'Mitglieder', it: 'membri', es: 'miembros' },
  'common.active': { fr: 'actifs', en: 'active', de: 'aktiv', it: 'attivi', es: 'activos' },
  'common.configure': { fr: 'Configurer', en: 'Configure', de: 'Konfigurieren', it: 'Configura', es: 'Configurar' },
  'common.connect': { fr: 'Connecter', en: 'Connect', de: 'Verbinden', it: 'Connetti', es: 'Conectar' },
  'common.disconnect': { fr: 'Déconnecter', en: 'Disconnect', de: 'Trennen', it: 'Disconnetti', es: 'Desconectar' },
  'common.connected': { fr: 'Connecté', en: 'Connected', de: 'Verbunden', it: 'Connesso', es: 'Conectado' },
  'common.not_configured': { fr: 'Non configuré', en: 'Not configured', de: 'Nicht konfiguriert', it: 'Non configurato', es: 'No configurado' },
  'common.test_connect': { fr: 'Tester et connecter', en: 'Test & connect', de: 'Testen & verbinden', it: 'Testa e connetti', es: 'Probar y conectar' },
  'common.assign': { fr: 'Assigner', en: 'Assign', de: 'Zuweisen', it: 'Assegna', es: 'Asignar' },
  'common.all_collabs': { fr: 'Tous les collaborateurs', en: 'All employees', de: 'Alle Mitarbeiter', it: 'Tutti i dipendenti', es: 'Todos los empleados' },
  'common.by_employee': { fr: 'Par employé', en: 'By employee', de: 'Nach Mitarbeiter', it: 'Per dipendente', es: 'Por empleado' },
  'common.by_group': { fr: 'Par groupe', en: 'By group', de: 'Nach Gruppe', it: 'Per gruppo', es: 'Por grupo' },
  'common.selected': { fr: 'sélectionné(s)', en: 'selected', de: 'ausgewählt', it: 'selezionato/i', es: 'seleccionado(s)' },
  'common.required': { fr: 'Obligatoire', en: 'Required', de: 'Pflichtfeld', it: 'Obbligatorio', es: 'Obligatorio' },
  'common.optional': { fr: 'Optionnel', en: 'Optional', de: 'Optional', it: 'Opzionale', es: 'Opcional' },
  'common.enabled': { fr: 'activé', en: 'enabled', de: 'aktiviert', it: 'attivato', es: 'activado' },
  'common.disabled': { fr: 'désactivé', en: 'disabled', de: 'deaktiviert', it: 'disattivato', es: 'desactivado' },
  'common.back': { fr: 'Retour', en: 'Back', de: 'Zurück', it: 'Indietro', es: 'Volver' },
  'common.next': { fr: 'Suivant', en: 'Next', de: 'Weiter', it: 'Avanti', es: 'Siguiente' },
  'common.finish': { fr: 'Terminer', en: 'Finish', de: 'Fertig', it: 'Fine', es: 'Finalizar' },
  'common.duplicate': { fr: 'Dupliquer', en: 'Duplicate', de: 'Duplizieren', it: 'Duplica', es: 'Duplicar' },
  'common.disable': { fr: 'Désactiver', en: 'Disable', de: 'Deaktivieren', it: 'Disattiva', es: 'Desactivar' },
  'common.reactivate': { fr: 'Réactiver', en: 'Reactivate', de: 'Reaktivieren', it: 'Riattiva', es: 'Reactivar' },
  'common.language': { fr: 'Langue', en: 'Language', de: 'Sprache', it: 'Lingua', es: 'Idioma' },

  // ─── Messaging ────────────────────────────────────
  'msg.title': { fr: 'Messagerie', en: 'Messaging', de: 'Nachrichten', it: 'Messaggi', es: 'Mensajería' },
  'msg.no_conversations': { fr: 'Aucune conversation', en: 'No conversations', de: 'Keine Unterhaltungen', it: 'Nessuna conversazione', es: 'Sin conversaciones' },
  'msg.new_conversation': { fr: 'Nouvelle conversation', en: 'New conversation', de: 'Neue Unterhaltung', it: 'Nuova conversazione', es: 'Nueva conversación' },
  'msg.select_conversation': { fr: 'Sélectionnez une conversation', en: 'Select a conversation', de: 'Wählen Sie eine Unterhaltung', it: 'Seleziona una conversazione', es: 'Seleccione una conversación' },
  'msg.select_contact': { fr: 'Choisissez un contact à gauche pour commencer', en: 'Choose a contact on the left to start', de: 'Wählen Sie links einen Kontakt aus', it: 'Scegli un contatto a sinistra per iniziare', es: 'Elija un contacto a la izquierda' },
  'msg.placeholder': { fr: 'Écrivez votre message...', en: 'Write your message...', de: 'Schreiben Sie Ihre Nachricht...', it: 'Scrivi il tuo messaggio...', es: 'Escriba su mensaje...' },
  'msg.search_user': { fr: 'Rechercher un utilisateur...', en: 'Search a user...', de: 'Benutzer suchen...', it: 'Cerca un utente...', es: 'Buscar un usuario...' },

  // ─── Notifications ────────────────────────────────
  'notif.title': { fr: 'Notifications', en: 'Notifications', de: 'Benachrichtigungen', it: 'Notifiche', es: 'Notificaciones' },
  'notif.mark_all_read': { fr: 'Tout marquer comme lu', en: 'Mark all as read', de: 'Alle als gelesen markieren', it: 'Segna tutto come letto', es: 'Marcar todo como leído' },
  'notif.none': { fr: 'Aucune notification pour le moment', en: 'No notifications yet', de: 'Noch keine Benachrichtigungen', it: 'Nessuna notifica', es: 'Sin notificaciones' },

  // ─── Integrations ─────────────────────────────────
  'integ.title': { fr: 'Intégrations', en: 'Integrations', de: 'Integrationen', it: 'Integrazioni', es: 'Integraciones' },
  'integ.signature': { fr: 'Signature électronique', en: 'Electronic signature', de: 'Elektronische Unterschrift', it: 'Firma elettronica', es: 'Firma electrónica' },
  'integ.communication': { fr: 'Communication', en: 'Communication', de: 'Kommunikation', it: 'Comunicazione', es: 'Comunicación' },
  'integ.ats': { fr: 'ATS (Recrutement)', en: 'ATS (Recruiting)', de: 'ATS (Recruiting)', it: 'ATS (Reclutamento)', es: 'ATS (Reclutamiento)' },
  'integ.sirh': { fr: 'SIRH', en: 'HRIS', de: 'HRIS', it: 'HRIS', es: 'SIRH' },
  'integ.default_provider': { fr: 'Provider de signature par défaut', en: 'Default signature provider', de: 'Standard-Signaturanbieter', it: 'Provider di firma predefinito', es: 'Proveedor de firma predeterminado' },

  // ─── Fields ───────────────────────────────────────
  'fields.title': { fr: 'Champs collaborateur', en: 'Employee fields', de: 'Mitarbeiterfelder', it: 'Campi dipendente', es: 'Campos del empleado' },
  'fields.subtitle': { fr: 'Activez, désactivez ou ajoutez des champs personnalisés', en: 'Enable, disable or add custom fields', de: 'Benutzerdefinierte Felder aktivieren, deaktivieren oder hinzufügen', it: 'Attiva, disattiva o aggiungi campi personalizzati', es: 'Active, desactive o agregue campos personalizados' },
  'fields.personal': { fr: 'Informations personnelles', en: 'Personal information', de: 'Persönliche Informationen', it: 'Informazioni personali', es: 'Información personal' },
  'fields.contract': { fr: 'Informations contractuelles', en: 'Contract information', de: 'Vertragsinformationen', it: 'Informazioni contrattuali', es: 'Información contractual' },
  'fields.job': { fr: 'Job Information', en: 'Job Information', de: 'Stelleninformationen', it: 'Informazioni sul lavoro', es: 'Información del puesto' },
  'fields.position': { fr: 'Position Information', en: 'Position Information', de: 'Positionsinformationen', it: 'Informazioni sulla posizione', es: 'Información de la posición' },
  'fields.org': { fr: 'Informations organisationnelles', en: 'Organizational information', de: 'Organisationsinformationen', it: 'Informazioni organizzative', es: 'Información organizacional' },
  'fields.base': { fr: 'Informations de base', en: 'Basic information', de: 'Grundinformationen', it: 'Informazioni di base', es: 'Información básica' },
  'fields.add': { fr: 'Ajouter', en: 'Add', de: 'Hinzufügen', it: 'Aggiungi', es: 'Agregar' },
  'fields.field_name': { fr: 'Nom du champ', en: 'Field name', de: 'Feldname', it: 'Nome del campo', es: 'Nombre del campo' },
  'fields.section': { fr: 'Section', en: 'Section', de: 'Abschnitt', it: 'Sezione', es: 'Sección' },
  'fields.type': { fr: 'Type', en: 'Type', de: 'Typ', it: 'Tipo', es: 'Tipo' },
  'fields.translate': { fr: 'Traduction', en: 'Translation', de: 'Übersetzung', it: 'Traduzione', es: 'Traducción' },

  // ─── Users ────────────────────────────────────────
  'users.title': { fr: 'Utilisateurs & Rôles', en: 'Users & Roles', de: 'Benutzer & Rollen', it: 'Utenti & Ruoli', es: 'Usuarios & Roles' },
  'users.new': { fr: 'Nouvel utilisateur', en: 'New user', de: 'Neuer Benutzer', it: 'Nuovo utente', es: 'Nuevo usuario' },
  'users.full_name': { fr: 'Nom complet', en: 'Full name', de: 'Vollständiger Name', it: 'Nome completo', es: 'Nombre completo' },
  'users.role': { fr: 'Rôle', en: 'Role', de: 'Rolle', it: 'Ruolo', es: 'Rol' },
  'users.created_at': { fr: 'Créé le', en: 'Created on', de: 'Erstellt am', it: 'Creato il', es: 'Creado el' },
  'users.generate_pwd': { fr: 'Générer', en: 'Generate', de: 'Generieren', it: 'Genera', es: 'Generar' },

  // ─── Company ──────────────────────────────────────
  'company.title': { fr: 'Page entreprise', en: 'Company page', de: 'Unternehmensseite', it: 'Pagina aziendale', es: 'Página de empresa' },
  'company.add_block': { fr: '+ Ajouter un bloc...', en: '+ Add a block...', de: '+ Block hinzufügen...', it: '+ Aggiungi un blocco...', es: '+ Agregar un bloque...' },

  // ─── Equipment ────────────────────────────────────
  'equip.title': { fr: 'Gestion du matériel', en: 'Equipment management', de: 'Ausstattungsverwaltung', it: 'Gestione attrezzature', es: 'Gestión de equipamiento' },
  'equip.add': { fr: 'Ajouter du matériel', en: 'Add equipment', de: 'Ausstattung hinzufügen', it: 'Aggiungi attrezzatura', es: 'Agregar equipamiento' },
  'equip.inventory': { fr: 'Inventaire', en: 'Inventory', de: 'Inventar', it: 'Inventario', es: 'Inventario' },
  'equip.packages': { fr: 'Packages', en: 'Packages', de: 'Pakete', it: 'Pacchetti', es: 'Paquetes' },
  'equip.types': { fr: 'Types & Licences', en: 'Types & Licences', de: 'Typen & Lizenzen', it: 'Tipi & Licenze', es: 'Tipos & Licencias' },

  // ─── Cooptation ───────────────────────────────────
  'coopt.title': { fr: 'Cooptation & Parrainage', en: 'Referral & Sponsorship', de: 'Empfehlung & Patenschaft', it: 'Cooptazione & Patrocinio', es: 'Cooptación & Patrocinio' },
  'coopt.new': { fr: 'Nouvelle cooptation', en: 'New referral', de: 'Neue Empfehlung', it: 'Nuova cooptazione', es: 'Nueva cooptación' },
  'coopt.campaigns': { fr: 'Campagnes', en: 'Campaigns', de: 'Kampagnen', it: 'Campagne', es: 'Campañas' },
  'coopt.leaderboard': { fr: 'Classement', en: 'Leaderboard', de: 'Rangliste', it: 'Classifica', es: 'Clasificación' },

  // ─── Dossier SIRH ─────────────────────────────────
  'dossier.title': { fr: 'Dossier SIRH', en: 'HRIS File', de: 'HRIS-Akte', it: 'Fascicolo HRIS', es: 'Expediente SIRH' },
  'dossier.validate': { fr: 'Valider le dossier', en: 'Validate file', de: 'Akte validieren', it: 'Convalida fascicolo', es: 'Validar expediente' },
  'dossier.export': { fr: 'Exporter vers SIRH', en: 'Export to HRIS', de: 'Zum HRIS exportieren', it: 'Esporta verso HRIS', es: 'Exportar al SIRH' },
  'dossier.incomplete': { fr: 'Incomplet', en: 'Incomplete', de: 'Unvollständig', it: 'Incompleto', es: 'Incompleto' },
  'dossier.complete': { fr: 'Complet', en: 'Complete', de: 'Vollständig', it: 'Completo', es: 'Completo' },
  'dossier.validated': { fr: 'Validé', en: 'Validated', de: 'Validiert', it: 'Convalidato', es: 'Validado' },
  'dossier.exported': { fr: 'Exporté vers SIRH', en: 'Exported to HRIS', de: 'Zum HRIS exportiert', it: 'Esportato verso HRIS', es: 'Exportado al SIRH' },

  // ─── Apparence / Settings ─────────────────────────
  'settings.languages': { fr: 'Langues actives', en: 'Active languages', de: 'Aktive Sprachen', it: 'Lingue attive', es: 'Idiomas activos' },
  'settings.languages_desc': { fr: 'Sélectionnez les langues disponibles pour vos collaborateurs.', en: 'Select the languages available to your employees.', de: 'Wählen Sie die für Ihre Mitarbeiter verfügbaren Sprachen.', it: 'Seleziona le lingue disponibili per i tuoi dipendenti.', es: 'Seleccione los idiomas disponibles para sus empleados.' },
  'settings.default_lang': { fr: 'Langue par défaut', en: 'Default language', de: 'Standardsprache', it: 'Lingua predefinita', es: 'Idioma predeterminado' },

  // ─── KPI / Stats ─────────────────────────────────
  'kpi.total_collabs': { fr: 'Total collaborateurs', en: 'Total employees', de: 'Mitarbeiter gesamt', it: 'Totale dipendenti', es: 'Total empleados' },
  'kpi.ongoing': { fr: 'En cours', en: 'In progress', de: 'In Bearbeitung', it: 'In corso', es: 'En curso' },
  'kpi.late': { fr: 'En retard', en: 'Late', de: 'Verspätet', it: 'In ritardo', es: 'Atrasado' },
  'kpi.completed': { fr: 'Terminés', en: 'Completed', de: 'Abgeschlossen', it: 'Completati', es: 'Completados' },
  'kpi.avg_progress': { fr: 'Progression moyenne', en: 'Average progress', de: 'Durchschnittlicher Fortschritt', it: 'Progresso medio', es: 'Progreso promedio' },
  'kpi.docs_completion': { fr: 'Taux de complétion documents', en: 'Document completion rate', de: 'Dokumenten-Abschlussrate', it: 'Tasso completamento documenti', es: 'Tasa de finalización documentos' },
  'kpi.actions_completion': { fr: 'Taux de complétion actions', en: 'Action completion rate', de: 'Aktionen-Abschlussrate', it: 'Tasso completamento azioni', es: 'Tasa de finalización acciones' },
  'kpi.validated_on': { fr: 'validés sur', en: 'validated out of', de: 'validiert von', it: 'validati su', es: 'validados de' },
  'kpi.completed_on': { fr: 'complétées sur', en: 'completed out of', de: 'abgeschlossen von', it: 'completate su', es: 'completadas de' },
  'kpi.collabs_followed': { fr: 'collaborateurs suivis', en: 'employees tracked', de: 'Mitarbeiter verfolgt', it: 'dipendenti seguiti', es: 'empleados seguidos' },
  'kpi.realtime': { fr: 'Mis à jour en temps réel', en: 'Updated in real time', de: 'In Echtzeit aktualisiert', it: 'Aggiornato in tempo reale', es: 'Actualizado en tiempo real' },

  // ─── Dashboard sections ──────────────────────────
  'dash.active_parcours': { fr: 'Parcours actifs', en: 'Active paths', de: 'Aktive Pfade', it: 'Percorsi attivi', es: 'Rutas activas' },
  'dash.upcoming_actions': { fr: 'Actions à venir', en: 'Upcoming actions', de: 'Anstehende Aktionen', it: 'Azioni in arrivo', es: 'Acciones próximas' },
  'dash.status_breakdown': { fr: 'Répartition par statut', en: 'Status breakdown', de: 'Statusverteilung', it: 'Ripartizione per stato', es: 'Desglose por estado' },

  // ─── Suivi / Tracking ────────────────────────────
  'suivi.title': { fr: 'Suivi des collaborateurs', en: 'Employee tracking', de: 'Mitarbeiter-Tracking', it: 'Monitoraggio dipendenti', es: 'Seguimiento de empleados' },
  'suivi.new_collab': { fr: 'Nouveau collaborateur', en: 'New employee', de: 'Neuer Mitarbeiter', it: 'Nuovo dipendente', es: 'Nuevo empleado' },
  'suivi.no_collab_found': { fr: 'Aucun collaborateur trouvé', en: 'No employee found', de: 'Kein Mitarbeiter gefunden', it: 'Nessun dipendente trovato', es: 'Ningún empleado encontrado' },
  'suivi.invite_people': { fr: 'Inviter des personnes', en: 'Invite people', de: 'Personen einladen', it: 'Invita persone', es: 'Invitar personas' },
  'suivi.all': { fr: 'Tous', en: 'All', de: 'Alle', it: 'Tutti', es: 'Todos' },
  'suivi.overview': { fr: 'Aperçu', en: 'Overview', de: 'Übersicht', it: 'Panoramica', es: 'Resumen' },
  'suivi.informations': { fr: 'Informations', en: 'Information', de: 'Informationen', it: 'Informazioni', es: 'Información' },
  'suivi.documents': { fr: 'Documents', en: 'Documents', de: 'Dokumente', it: 'Documenti', es: 'Documentos' },
  'suivi.actions': { fr: 'Actions', en: 'Actions', de: 'Aktionen', it: 'Azioni', es: 'Acciones' },
  'suivi.team': { fr: 'Équipe', en: 'Team', de: 'Team', it: 'Team', es: 'Equipo' },
  'suivi.messages': { fr: 'Messages', en: 'Messages', de: 'Nachrichten', it: 'Messaggi', es: 'Mensajes' },
  'suivi.dossier_sirh': { fr: 'Dossier SIRH', en: 'HRIS File', de: 'HRIS-Akte', it: 'Fascicolo HRIS', es: 'Expediente SIRH' },
  'suivi.key_info': { fr: 'Informations clés', en: 'Key information', de: 'Schlüsselinformationen', it: 'Informazioni chiave', es: 'Información clave' },
  'suivi.progression': { fr: 'Progression', en: 'Progress', de: 'Fortschritt', it: 'Progresso', es: 'Progreso' },
  'suivi.assigned_path': { fr: 'Parcours assigné', en: 'Assigned path', de: 'Zugewiesener Pfad', it: 'Percorso assegnato', es: 'Ruta asignada' },
  'suivi.support_team': { fr: "Équipe d'accompagnement", en: 'Support team', de: 'Begleitteam', it: 'Team di supporto', es: 'Equipo de apoyo' },
  'suivi.edit_info': { fr: 'Modifier les informations', en: 'Edit information', de: 'Informationen bearbeiten', it: 'Modifica informazioni', es: 'Editar información' },

  // ─── Actions on collaborateurs ────────────────────
  'action.assign_path': { fr: 'Assigner un parcours', en: 'Assign a path', de: 'Pfad zuweisen', it: 'Assegna un percorso', es: 'Asignar una ruta' },
  'action.assign_team': { fr: 'Assigner une équipe', en: 'Assign a team', de: 'Team zuweisen', it: 'Assegna un team', es: 'Asignar un equipo' },
  'action.send_contract': { fr: 'Envoyer un contrat', en: 'Send a contract', de: 'Vertrag senden', it: 'Invia un contratto', es: 'Enviar un contrato' },
  'action.send_message': { fr: 'Envoyer un message', en: 'Send a message', de: 'Nachricht senden', it: 'Invia un messaggio', es: 'Enviar un mensaje' },
  'action.resend': { fr: 'Relancer', en: 'Resend', de: 'Erneut senden', it: 'Reinvia', es: 'Reenviar' },

  // ─── Workflows ────────────────────────────────────
  'wf.title': { fr: 'Workflows', en: 'Workflows', de: 'Workflows', it: 'Workflow', es: 'Flujos de trabajo' },
  'wf.new': { fr: 'Nouveau workflow', en: 'New workflow', de: 'Neuer Workflow', it: 'Nuovo workflow', es: 'Nuevo flujo de trabajo' },
  'wf.trigger': { fr: 'Déclencheur', en: 'Trigger', de: 'Auslöser', it: 'Trigger', es: 'Disparador' },
  'wf.action': { fr: 'Action', en: 'Action', de: 'Aktion', it: 'Azione', es: 'Acción' },
  'wf.recipient': { fr: 'Destinataire', en: 'Recipient', de: 'Empfänger', it: 'Destinatario', es: 'Destinatario' },

  // ─── Contrats ─────────────────────────────────────
  'contrat.title': { fr: 'Contrats', en: 'Contracts', de: 'Verträge', it: 'Contratti', es: 'Contratos' },
  'contrat.new': { fr: 'Nouveau contrat', en: 'New contract', de: 'Neuer Vertrag', it: 'Nuovo contratto', es: 'Nuevo contrato' },
  'contrat.name': { fr: 'Nom', en: 'Name', de: 'Name', it: 'Nome', es: 'Nombre' },
  'contrat.type': { fr: 'Type', en: 'Type', de: 'Typ', it: 'Tipo', es: 'Tipo' },
  'contrat.jurisdiction': { fr: 'Juridiction', en: 'Jurisdiction', de: 'Zuständigkeit', it: 'Giurisdizione', es: 'Jurisdicción' },

  // ─── Employee Dashboard ──────────────────────────
  'emp.welcome': { fr: 'Bienvenue', en: 'Welcome', de: 'Willkommen', it: 'Benvenuto', es: 'Bienvenido' },
  'emp.next_actions': { fr: 'Vos prochaines actions à réaliser', en: 'Your next actions to complete', de: 'Ihre nächsten Aufgaben', it: 'Le tue prossime azioni', es: 'Sus próximas acciones' },
  'emp.my_badges': { fr: 'Mes badges', en: 'My badges', de: 'Meine Abzeichen', it: 'I miei badge', es: 'Mis insignias' },
  'emp.my_actions': { fr: 'Mes actions', en: 'My actions', de: 'Meine Aufgaben', it: 'Le mie azioni', es: 'Mis acciones' },
  'emp.all_actions': { fr: 'Toutes', en: 'All', de: 'Alle', it: 'Tutte', es: 'Todas' },
  'emp.onboarding_actions': { fr: 'Onboarding', en: 'Onboarding', de: 'Onboarding', it: 'Onboarding', es: 'Onboarding' },
  'emp.my_recommendations': { fr: 'Mes recommandations', en: 'My recommendations', de: 'Meine Empfehlungen', it: 'Le mie raccomandazioni', es: 'Mis recomendaciones' },
  'emp.open_positions': { fr: 'Postes ouverts', en: 'Open positions', de: 'Offene Stellen', it: 'Posizioni aperte', es: 'Puestos abiertos' },
  'emp.recommend': { fr: 'Recommander', en: 'Recommend', de: 'Empfehlen', it: 'Raccomanda', es: 'Recomendar' },
  'emp.recommend_candidate': { fr: 'Recommander un candidat', en: 'Recommend a candidate', de: 'Kandidaten empfehlen', it: 'Raccomanda un candidato', es: 'Recomendar un candidato' },
  'emp.no_recommendation': { fr: "Vous n'avez pas encore recommandé de candidat.", en: 'You have not recommended any candidates yet.', de: 'Sie haben noch keinen Kandidaten empfohlen.', it: 'Non hai ancora raccomandato candidati.', es: 'Aún no ha recomendado ningún candidato.' },

  // ─── Generic labels ──────────────────────────────
  'label.name': { fr: 'Nom', en: 'Name', de: 'Name', it: 'Nome', es: 'Nombre' },
  'label.email': { fr: 'Email', en: 'Email', de: 'E-Mail', it: 'Email', es: 'Correo' },
  'label.phone': { fr: 'Téléphone', en: 'Phone', de: 'Telefon', it: 'Telefono', es: 'Teléfono' },
  'label.firstname': { fr: 'Prénom', en: 'First name', de: 'Vorname', it: 'Nome', es: 'Nombre' },
  'label.lastname': { fr: 'Nom', en: 'Last name', de: 'Nachname', it: 'Cognome', es: 'Apellido' },
  'label.position': { fr: 'Poste', en: 'Position', de: 'Position', it: 'Posizione', es: 'Puesto' },
  'label.site': { fr: 'Site', en: 'Location', de: 'Standort', it: 'Sede', es: 'Sede' },
  'label.department': { fr: 'Département', en: 'Department', de: 'Abteilung', it: 'Dipartimento', es: 'Departamento' },
  'label.start_date': { fr: 'Date de début', en: 'Start date', de: 'Startdatum', it: 'Data inizio', es: 'Fecha inicio' },
  'label.status': { fr: 'Statut', en: 'Status', de: 'Status', it: 'Stato', es: 'Estado' },
  'label.description': { fr: 'Description', en: 'Description', de: 'Beschreibung', it: 'Descrizione', es: 'Descripción' },
  'label.notes': { fr: 'Notes', en: 'Notes', de: 'Notizen', it: 'Note', es: 'Notas' },
  'label.date': { fr: 'Date', en: 'Date', de: 'Datum', it: 'Data', es: 'Fecha' },
  'label.type': { fr: 'Type', en: 'Type', de: 'Typ', it: 'Tipo', es: 'Tipo' },
  'label.active': { fr: 'Actif', en: 'Active', de: 'Aktiv', it: 'Attivo', es: 'Activo' },
  'label.inactive': { fr: 'Inactif', en: 'Inactive', de: 'Inaktiv', it: 'Inattivo', es: 'Inactivo' },
  'label.mandatory': { fr: 'Obligatoire', en: 'Mandatory', de: 'Pflichtfeld', it: 'Obbligatorio', es: 'Obligatorio' },
  'label.optional': { fr: 'Optionnel', en: 'Optional', de: 'Optional', it: 'Opzionale', es: 'Opcional' },
  'label.all': { fr: 'Tous', en: 'All', de: 'Alle', it: 'Tutti', es: 'Todos' },
  'label.none': { fr: 'Aucun', en: 'None', de: 'Keine', it: 'Nessuno', es: 'Ninguno' },
  'label.total': { fr: 'Total', en: 'Total', de: 'Gesamt', it: 'Totale', es: 'Total' },
  'label.available': { fr: 'Disponible', en: 'Available', de: 'Verfügbar', it: 'Disponibile', es: 'Disponible' },
  'label.assigned': { fr: 'Attribué', en: 'Assigned', de: 'Zugewiesen', it: 'Assegnato', es: 'Asignado' },
  'label.pending': { fr: 'En attente', en: 'Pending', de: 'Ausstehend', it: 'In attesa', es: 'Pendiente' },
  'label.refused': { fr: 'Refusé', en: 'Refused', de: 'Abgelehnt', it: 'Rifiutato', es: 'Rechazado' },
  'label.validated': { fr: 'Validé', en: 'Validated', de: 'Validiert', it: 'Convalidato', es: 'Validado' },
  'label.search': { fr: 'Rechercher collaborateur, fonctionnalité...', en: 'Search employee, feature...', de: 'Mitarbeiter, Funktion suchen...', it: 'Cerca dipendente, funzionalità...', es: 'Buscar empleado, funcionalidad...' },

  // ─── Toast messages ──────────────────────────────
  'toast.saved': { fr: 'Enregistré', en: 'Saved', de: 'Gespeichert', it: 'Salvato', es: 'Guardado' },
  'toast.deleted': { fr: 'Supprimé', en: 'Deleted', de: 'Gelöscht', it: 'Eliminato', es: 'Eliminado' },
  'toast.created': { fr: 'Créé', en: 'Created', de: 'Erstellt', it: 'Creato', es: 'Creado' },
  'toast.updated': { fr: 'Modifié', en: 'Updated', de: 'Aktualisiert', it: 'Aggiornato', es: 'Actualizado' },
  'toast.error': { fr: 'Erreur', en: 'Error', de: 'Fehler', it: 'Errore', es: 'Error' },
  'toast.copied': { fr: 'Copié !', en: 'Copied!', de: 'Kopiert!', it: 'Copiato!', es: '¡Copiado!' },

  // ─── Dashboard detail labels ─────────────────────
  'dash.docs_rate': { fr: 'Taux de complétion documents', en: 'Document completion rate', de: 'Dokumenten-Abschlussrate', it: 'Tasso completamento documenti', es: 'Tasa finalización documentos' },
  'dash.actions_rate': { fr: 'Taux de complétion actions', en: 'Action completion rate', de: 'Aktionen-Abschlussrate', it: 'Tasso completamento azioni', es: 'Tasa finalización acciones' },
  'dash.validated_of': { fr: 'validés sur', en: 'validated out of', de: 'validiert von', it: 'validati su', es: 'validados de' },
  'dash.completed_of': { fr: 'complétées sur', en: 'completed out of', de: 'abgeschlossen von', it: 'completate su', es: 'completadas de' },
  'dash.average': { fr: 'moyenne', en: 'average', de: 'Durchschnitt', it: 'media', es: 'promedio' },
  'dash.collabs_tracked': { fr: 'collaborateurs suivis', en: 'employees tracked', de: 'Mitarbeiter verfolgt', it: 'dipendenti seguiti', es: 'empleados seguidos' },
  'dash.collabs_count': { fr: 'collaborateurs', en: 'employees', de: 'Mitarbeiter', it: 'dipendenti', es: 'empleados' },
  'dash.active_paths_count': { fr: 'parcours actifs', en: 'active paths', de: 'aktive Pfade', it: 'percorsi attivi', es: 'rutas activas' },
  'dash.configured_actions': { fr: 'actions configurées', en: 'configured actions', de: 'konfigurierte Aktionen', it: 'azioni configurate', es: 'acciones configuradas' },
  'dash.collabs_label': { fr: 'collabs', en: 'emp.', de: 'Mitarb.', it: 'dip.', es: 'emp.' },
  'dash.obligatory': { fr: 'Obligatoire', en: 'Mandatory', de: 'Pflicht', it: 'Obbligatorio', es: 'Obligatorio' },

  // ─── Table headers ───────────────────────────────
  'table.collaborateur': { fr: 'Collaborateur', en: 'Employee', de: 'Mitarbeiter', it: 'Dipendente', es: 'Empleado' },
  'table.poste': { fr: 'Poste', en: 'Position', de: 'Position', it: 'Posizione', es: 'Puesto' },
  'table.site': { fr: 'Site', en: 'Location', de: 'Standort', it: 'Sede', es: 'Sede' },
  'table.progression': { fr: 'Progression', en: 'Progress', de: 'Fortschritt', it: 'Progresso', es: 'Progreso' },
  'table.statut': { fr: 'Statut', en: 'Status', de: 'Status', it: 'Stato', es: 'Estado' },
  'table.actions': { fr: 'actions', en: 'actions', de: 'Aktionen', it: 'azioni', es: 'acciones' },
  'table.documents': { fr: 'documents', en: 'documents', de: 'Dokumente', it: 'documenti', es: 'documentos' },
  'table.phases': { fr: 'phases', en: 'phases', de: 'Phasen', it: 'fasi', es: 'fases' },

  // ─── Collab profile tabs ─────────────────────────
  'tab.overview': { fr: 'Aperçu', en: 'Overview', de: 'Übersicht', it: 'Panoramica', es: 'Resumen' },
  'tab.informations': { fr: 'Informations', en: 'Information', de: 'Informationen', it: 'Informazioni', es: 'Información' },
  'tab.documents': { fr: 'Documents', en: 'Documents', de: 'Dokumente', it: 'Documenti', es: 'Documentos' },
  'tab.actions': { fr: 'Actions', en: 'Actions', de: 'Aktionen', it: 'Azioni', es: 'Acciones' },
  'tab.team': { fr: 'Équipe', en: 'Team', de: 'Team', it: 'Team', es: 'Equipo' },
  'tab.messages': { fr: 'Messages', en: 'Messages', de: 'Nachrichten', it: 'Messaggi', es: 'Mensajes' },

  // ─── Collab context menu actions ─────────────────
  'ctx.assign_path': { fr: 'Assigner un parcours', en: 'Assign a path', de: 'Pfad zuweisen', it: 'Assegna percorso', es: 'Asignar ruta' },
  'ctx.assign_team': { fr: 'Assigner une équipe', en: 'Assign a team', de: 'Team zuweisen', it: 'Assegna team', es: 'Asignar equipo' },
  'ctx.send_contract': { fr: 'Envoyer un contrat', en: 'Send contract', de: 'Vertrag senden', it: 'Invia contratto', es: 'Enviar contrato' },
  'ctx.send_message': { fr: 'Envoyer un message', en: 'Send message', de: 'Nachricht senden', it: 'Invia messaggio', es: 'Enviar mensaje' },
  'ctx.resend': { fr: 'Relancer', en: 'Resend', de: 'Erneut senden', it: 'Reinvia', es: 'Reenviar' },
  'ctx.disable': { fr: 'Désactiver', en: 'Disable', de: 'Deaktivieren', it: 'Disattiva', es: 'Desactivar' },

  // ─── Key info labels ─────────────────────────────
  'info.start_date': { fr: 'Date de début', en: 'Start date', de: 'Startdatum', it: 'Data inizio', es: 'Fecha inicio' },
  'info.current_phase': { fr: 'Phase actuelle', en: 'Current phase', de: 'Aktuelle Phase', it: 'Fase attuale', es: 'Fase actual' },
  'info.firstname': { fr: 'Prénom', en: 'First name', de: 'Vorname', it: 'Nome', es: 'Nombre' },
  'info.lastname': { fr: 'Nom', en: 'Last name', de: 'Nachname', it: 'Cognome', es: 'Apellido' },

  // ─── Documents page ──────────────────────────────
  'doc.library': { fr: 'Bibliothèque de modèles', en: 'Template library', de: 'Vorlagenbibliothek', it: 'Libreria modelli', es: 'Biblioteca de plantillas' },
  'doc.by_collab': { fr: 'Suivi par collaborateur', en: 'By employee', de: 'Nach Mitarbeiter', it: 'Per dipendente', es: 'Por empleado' },
  'doc.mass_validation': { fr: 'Validation en masse', en: 'Mass validation', de: 'Massenvalidierung', it: 'Validazione di massa', es: 'Validación masiva' },
  'doc.new_template': { fr: 'Nouveau modèle', en: 'New template', de: 'Neue Vorlage', it: 'Nuovo modello', es: 'Nueva plantilla' },
  'doc.search': { fr: 'Rechercher un document...', en: 'Search a document...', de: 'Dokument suchen...', it: 'Cerca un documento...', es: 'Buscar un documento...' },
  'doc.all_categories': { fr: 'Toutes les catégories', en: 'All categories', de: 'Alle Kategorien', it: 'Tutte le categorie', es: 'Todas las categorías' },
  'doc.pending_validation': { fr: 'En attente de validation', en: 'Pending validation', de: 'Ausstehende Validierung', it: 'In attesa di validazione', es: 'Pendiente de validación' },
  'doc.missing': { fr: 'Documents manquants', en: 'Missing documents', de: 'Fehlende Dokumente', it: 'Documenti mancanti', es: 'Documentos faltantes' },
  'doc.refused': { fr: 'Documents refusés', en: 'Refused documents', de: 'Abgelehnte Dokumente', it: 'Documenti rifiutati', es: 'Documentos rechazados' },

  // ─── Workflows ────────────────────────────────────
  'wf.trigger_doc_submitted': { fr: 'Document soumis', en: 'Document submitted', de: 'Dokument eingereicht', it: 'Documento inviato', es: 'Documento enviado' },
  'wf.trigger_doc_refused': { fr: 'Document refusé', en: 'Document refused', de: 'Dokument abgelehnt', it: 'Documento rifiutato', es: 'Documento rechazado' },
  'wf.trigger_all_docs': { fr: 'Tous documents validés', en: 'All documents validated', de: 'Alle Dokumente validiert', it: 'Tutti i documenti validati', es: 'Todos los documentos validados' },
  'wf.trigger_form_submitted': { fr: 'Formulaire soumis', en: 'Form submitted', de: 'Formular eingereicht', it: 'Formulario inviato', es: 'Formulario enviado' },
  'wf.trigger_action_completed': { fr: 'Action complétée', en: 'Action completed', de: 'Aktion abgeschlossen', it: 'Azione completata', es: 'Acción completada' },
  'wf.trigger_path_created': { fr: 'Parcours créé', en: 'Path created', de: 'Pfad erstellt', it: 'Percorso creato', es: 'Ruta creada' },
  'wf.trigger_path_completed': { fr: 'Parcours complété à 100%', en: 'Path 100% completed', de: 'Pfad 100% abgeschlossen', it: 'Percorso completato al 100%', es: 'Ruta completada al 100%' },
  'wf.trigger_new_collab': { fr: 'Nouveau collaborateur', en: 'New employee', de: 'Neuer Mitarbeiter', it: 'Nuovo dipendente', es: 'Nuevo empleado' },
  'wf.trigger_deadline_7': { fr: 'J-7 avant date limite', en: '7 days before deadline', de: '7 Tage vor Frist', it: '7 giorni prima della scadenza', es: '7 días antes del plazo' },
  'wf.trigger_trial_ended': { fr: "Période d'essai terminée", en: 'Probation period ended', de: 'Probezeit beendet', it: 'Periodo di prova terminato', es: 'Período de prueba terminado' },
  'wf.trigger_anniversary': { fr: "Anniversaire d'embauche", en: 'Hire anniversary', de: 'Einstellungsjubiläum', it: 'Anniversario assunzione', es: 'Aniversario de contratación' },
  'wf.trigger_late': { fr: 'Collaborateur en retard', en: 'Employee late', de: 'Mitarbeiter verspätet', it: 'Dipendente in ritardo', es: 'Empleado atrasado' },
  'wf.trigger_coopt': { fr: 'Cooptation validée', en: 'Referral validated', de: 'Empfehlung validiert', it: 'Cooptazione validata', es: 'Cooptación validada' },
  'wf.trigger_contract_signed': { fr: 'Contrat signé', en: 'Contract signed', de: 'Vertrag unterzeichnet', it: 'Contratto firmato', es: 'Contrato firmado' },
  'wf.trigger_nps': { fr: 'Questionnaire NPS soumis', en: 'NPS survey submitted', de: 'NPS-Umfrage eingereicht', it: 'Questionario NPS inviato', es: 'Encuesta NPS enviada' },

  // ─── Notification config ─────────────────────────
  'notifcfg.birthday': { fr: 'Anniversaire', en: 'Birthday', de: 'Geburtstag', it: 'Compleanno', es: 'Cumpleaños' },
  'notifcfg.contract_end': { fr: 'Fin de contrat', en: 'Contract end', de: 'Vertragsende', it: 'Fine contratto', es: 'Fin de contrato' },
  'notifcfg.trial_end': { fr: "Fin de période d'essai", en: 'End of probation', de: 'Ende der Probezeit', it: 'Fine periodo di prova', es: 'Fin del período de prueba' },
  'notifcfg.new_survey': { fr: 'Nouveau questionnaire disponible', en: 'New survey available', de: 'Neue Umfrage verfügbar', it: 'Nuovo questionario disponibile', es: 'Nueva encuesta disponible' },
  'notifcfg.new_task': { fr: 'Nouvelle tâche disponible', en: 'New task available', de: 'Neue Aufgabe verfügbar', it: 'Nuovo compito disponibile', es: 'Nueva tarea disponible' },
  'notifcfg.late_reminder': { fr: 'Relancer un parcours en retard', en: 'Remind late path', de: 'Verspäteten Pfad erinnern', it: 'Sollecita percorso in ritardo', es: 'Recordar ruta atrasada' },
  'notifcfg.doc_to_validate': { fr: 'Pièce administrative à valider', en: 'Document to validate', de: 'Zu validierendes Dokument', it: 'Documento da validare', es: 'Documento a validar' },
  'notifcfg.doc_complete': { fr: 'Catégorie de pièces complétée', en: 'Document category completed', de: 'Dokumentkategorie abgeschlossen', it: 'Categoria documenti completata', es: 'Categoría de documentos completada' },
  'notifcfg.doc_refused': { fr: 'Pièce administrative refusée', en: 'Document refused', de: 'Dokument abgelehnt', it: 'Documento rifiutato', es: 'Documento rechazado' },
  'notifcfg.weekly_arrivals': { fr: 'Les arrivées de la semaine', en: 'Weekly arrivals', de: 'Ankünfte der Woche', it: 'Arrivi della settimana', es: 'Llegadas de la semana' },
  'notifcfg.new_hire': { fr: 'Une nouvelle recrue arrive', en: 'A new hire is arriving', de: 'Ein neuer Mitarbeiter kommt', it: 'Un nuovo assunto sta arrivando', es: 'Un nuevo empleado llega' },
  'notifcfg.survey_complete': { fr: 'Questionnaire complété', en: 'Survey completed', de: 'Umfrage abgeschlossen', it: 'Questionario completato', es: 'Encuesta completada' },

  // ─── Content blocks ──────────────────────────────
  'block.text': { fr: 'Bloc texte', en: 'Text block', de: 'Textblock', it: 'Blocco testo', es: 'Bloque de texto' },
  'block.mission': { fr: 'Mission', en: 'Mission', de: 'Mission', it: 'Missione', es: 'Misión' },
  'block.key_figures': { fr: 'Chiffres clés', en: 'Key figures', de: 'Kennzahlen', it: 'Cifre chiave', es: 'Cifras clave' },
  'block.values': { fr: 'Valeurs', en: 'Values', de: 'Werte', it: 'Valori', es: 'Valores' },
  'block.videos': { fr: 'Vidéos', en: 'Videos', de: 'Videos', it: 'Video', es: 'Videos' },
  'block.team': { fr: 'Équipe', en: 'Team', de: 'Team', it: 'Team', es: 'Equipo' },

  // ─── NPS ─────────────────────────────────────────
  'nps.surveys': { fr: 'Questionnaires', en: 'Surveys', de: 'Umfragen', it: 'Questionari', es: 'Encuestas' },
  'nps.recent_responses': { fr: 'Réponses récentes', en: 'Recent responses', de: 'Aktuelle Antworten', it: 'Risposte recenti', es: 'Respuestas recientes' },
  'nps.new_survey': { fr: 'Nouveau questionnaire', en: 'New survey', de: 'Neue Umfrage', it: 'Nuovo questionario', es: 'Nueva encuesta' },

  // ─── Integrations ────────────────────────────────
  'integ.in_app_signature': { fr: 'Signature intégrée à Illizeo', en: 'Built-in Illizeo signature', de: 'Integrierte Illizeo-Signatur', it: 'Firma integrata Illizeo', es: 'Firma integrada en Illizeo' },
  'integ.sso_sync': { fr: 'SSO, sync utilisateurs, groupes de sécurité', en: 'SSO, user sync, security groups', de: 'SSO, Benutzersync, Sicherheitsgruppen', it: 'SSO, sync utenti, gruppi sicurezza', es: 'SSO, sync usuarios, grupos seguridad' },
  'integ.teams_desc': { fr: 'Notifications, bienvenue, réunions', en: 'Notifications, welcome, meetings', de: 'Benachrichtigungen, Willkommen, Meetings', it: 'Notifiche, benvenuto, riunioni', es: 'Notificaciones, bienvenida, reuniones' },
  'integ.slack_desc': { fr: "Notifications & messagerie d'équipe", en: 'Team notifications & messaging', de: 'Team-Benachrichtigungen & Messaging', it: 'Notifiche e messaggi del team', es: 'Notificaciones y mensajería del equipo' },

  // ─── Roles ───────────────────────────────────────
  'role.super_admin': { fr: 'Super Admin', en: 'Super Admin', de: 'Super Admin', it: 'Super Admin', es: 'Super Admin' },
  'role.admin': { fr: 'Admin', en: 'Admin', de: 'Admin', it: 'Admin', es: 'Admin' },
  'role.admin_rh': { fr: 'Admin RH', en: 'HR Admin', de: 'HR Admin', it: 'Admin HR', es: 'Admin RRHH' },
  'role.manager': { fr: 'Manager', en: 'Manager', de: 'Manager', it: 'Manager', es: 'Gerente' },
  'role.onboardee': { fr: 'Collaborateur', en: 'Employee', de: 'Mitarbeiter', it: 'Dipendente', es: 'Empleado' },

  // ─── Equipe roles ────────────────────────────────
  'team_role.manager': { fr: 'Manager', en: 'Manager', de: 'Manager', it: 'Manager', es: 'Gerente' },
  'team_role.hrbp': { fr: 'HRBP', en: 'HRBP', de: 'HRBP', it: 'HRBP', es: 'HRBP' },
  'team_role.admin_rh': { fr: 'Admin RH', en: 'HR Admin', de: 'HR Admin', it: 'Admin HR', es: 'Admin RRHH' },
  'team_role.it_support': { fr: 'IT Support', en: 'IT Support', de: 'IT Support', it: 'IT Support', es: 'Soporte IT' },
  'team_role.recruiter': { fr: 'Recruteur', en: 'Recruiter', de: 'Recruiter', it: 'Recruiter', es: 'Reclutador' },

  // ─── Misc ────────────────────────────────────────
  'misc.no_result': { fr: 'Aucun résultat', en: 'No results', de: 'Keine Ergebnisse', it: 'Nessun risultato', es: 'Sin resultados' },
  'misc.complete': { fr: 'Compléter', en: 'Complete', de: 'Vervollständigen', it: 'Completare', es: 'Completar' },
  'misc.select': { fr: '— Sélectionner —', en: '— Select —', de: '— Auswählen —', it: '— Seleziona —', es: '— Seleccionar —' },
  'misc.validate_selection': { fr: 'Valider la sélection', en: 'Validate selection', de: 'Auswahl bestätigen', it: 'Convalida selezione', es: 'Validar selección' },
  'misc.send_test': { fr: 'Envoyer un email de test à :', en: 'Send a test email to:', de: 'Test-E-Mail senden an:', it: 'Invia email di test a:', es: 'Enviar email de prueba a:' },
  'misc.edit_mode': { fr: 'Éditer', en: 'Edit', de: 'Bearbeiten', it: 'Modifica', es: 'Editar' },
  'misc.preview': { fr: 'Aperçu', en: 'Preview', de: 'Vorschau', it: 'Anteprima', es: 'Vista previa' },
  'misc.return': { fr: 'Retour', en: 'Back', de: 'Zurück', it: 'Indietro', es: 'Volver' },
  'misc.view_actions': { fr: 'Voir les actions', en: 'View actions', de: 'Aktionen anzeigen', it: 'Vedi azioni', es: 'Ver acciones' },
  'misc.disable': { fr: 'Désactiver', en: 'Disable', de: 'Deaktivieren', it: 'Disattiva', es: 'Desactivar' },
  'misc.reactivate': { fr: 'Réactiver', en: 'Reactivate', de: 'Reaktivieren', it: 'Riattiva', es: 'Reactivar' },
  'misc.active': { fr: 'actif', en: 'active', de: 'aktiv', it: 'attivo', es: 'activo' },
  'misc.draft': { fr: 'brouillon', en: 'draft', de: 'Entwurf', it: 'bozza', es: 'borrador' },
  'misc.disabled_label': { fr: 'désactivé', en: 'disabled', de: 'deaktiviert', it: 'disattivato', es: 'desactivado' },
  'misc.docs': { fr: 'docs', en: 'docs', de: 'Docs', it: 'doc', es: 'docs' },
  'misc.actifs': { fr: 'actifs', en: 'active', de: 'aktiv', it: 'attivi', es: 'activos' },
  'misc.pieces': { fr: 'pièces', en: 'items', de: 'Stücke', it: 'elementi', es: 'elementos' },
  'misc.upload_required': { fr: 'Upload requis', en: 'Upload required', de: 'Upload erforderlich', it: 'Upload richiesto', es: 'Carga requerida' },
  'misc.form_to_fill': { fr: 'Formulaire à remplir', en: 'Form to fill', de: 'Formular ausfüllen', it: 'Formulario da compilare', es: 'Formulario a rellenar' },
  'misc.template': { fr: 'Modèle', en: 'Template', de: 'Vorlage', it: 'Modello', es: 'Plantilla' },
  'misc.all_categories': { fr: 'Toutes les catégories', en: 'All categories', de: 'Alle Kategorien', it: 'Tutte le categorie', es: 'Todas las categorías' },

  // ─── Panel titles ────────────────────────────────
  'panel.edit_path': { fr: 'Modifier le parcours', en: 'Edit path', de: 'Pfad bearbeiten', it: 'Modifica percorso', es: 'Editar ruta' },
  'panel.new_path': { fr: 'Nouveau parcours', en: 'New path', de: 'Neuer Pfad', it: 'Nuovo percorso', es: 'Nueva ruta' },
  'panel.path_name': { fr: 'Nom du parcours *', en: 'Path name *', de: 'Pfadname *', it: 'Nome percorso *', es: 'Nombre de la ruta *' },
  'panel.category': { fr: 'Catégorie *', en: 'Category *', de: 'Kategorie *', it: 'Categoria *', es: 'Categoría *' },

  // ─── Documents management ────────────────────────
  'doc.title': { fr: 'Gestion Électronique des Documents', en: 'Electronic Document Management', de: 'Elektronisches Dokumentenmanagement', it: 'Gestione Elettronica Documenti', es: 'Gestión Electrónica de Documentos' },
  'doc.templates_count': { fr: 'Modèles de documents', en: 'Document templates', de: 'Dokumentvorlagen', it: 'Modelli di documenti', es: 'Plantillas de documentos' },
  'doc.search_placeholder': { fr: 'Rechercher un document...', en: 'Search a document...', de: 'Dokument suchen...', it: 'Cerca un documento...', es: 'Buscar un documento...' },

  // ─── Provisioning ────────────────────────────────
  'prov.title': { fr: 'Provisionnement', en: 'Provisioning', de: 'Bereitstellung', it: 'Provisioning', es: 'Aprovisionamiento' },

  // ─── 2FA ─────────────────────────────────────────
  'twofa.title': { fr: 'Sécurité (2FA)', en: 'Security (2FA)', de: 'Sicherheit (2FA)', it: 'Sicurezza (2FA)', es: 'Seguridad (2FA)' },

  // ─── Data / RGPD ─────────────────────────────────
  'data.title': { fr: 'Données & RGPD', en: 'Data & GDPR', de: 'Daten & DSGVO', it: 'Dati & GDPR', es: 'Datos & RGPD' },
  'data.export_all': { fr: 'Exporter toutes les données', en: 'Export all data', de: 'Alle Daten exportieren', it: 'Esporta tutti i dati', es: 'Exportar todos los datos' },
  'data.delete_account': { fr: 'Supprimer le compte', en: 'Delete account', de: 'Konto löschen', it: 'Elimina account', es: 'Eliminar cuenta' },

  // ─── Connexion / Login ───────────────────────────
  'login.title': { fr: 'Connexion', en: 'Sign in', de: 'Anmelden', it: 'Accedi', es: 'Iniciar sesión' },
  'login.space': { fr: 'Espace :', en: 'Workspace:', de: 'Bereich:', it: 'Spazio:', es: 'Espacio:' },
  'login.change': { fr: 'changer', en: 'change', de: 'ändern', it: 'cambia', es: 'cambiar' },
  'login.no_account': { fr: 'Pas encore de compte ?', en: "Don't have an account?", de: 'Noch kein Konto?', it: 'Non hai un account?', es: '¿No tiene cuenta?' },
  'login.create_space': { fr: 'Créer votre espace', en: 'Create your space', de: 'Erstellen Sie Ihren Bereich', it: 'Crea il tuo spazio', es: 'Cree su espacio' },
  'login.or': { fr: 'ou', en: 'or', de: 'oder', it: 'o', es: 'o' },
  'login.sso_microsoft': { fr: 'Se connecter avec Microsoft', en: 'Sign in with Microsoft', de: 'Mit Microsoft anmelden', it: 'Accedi con Microsoft', es: 'Iniciar sesión con Microsoft' },
};

let currentLang: Lang = (localStorage.getItem('illizeo_lang') as Lang) || 'fr';

export function t(key: string): string {
  return translations[key]?.[currentLang] || translations[key]?.fr || key;
}

export function getLang(): Lang {
  return currentLang;
}

export function setLang(lang: Lang): void {
  currentLang = lang;
  localStorage.setItem('illizeo_lang', lang);
}

export function getAllLangs(): Lang[] {
  return ['fr', 'en', 'de', 'it', 'es'];
}
