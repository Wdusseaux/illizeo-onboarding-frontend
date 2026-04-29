// ─── MOCK DATA — extracted from Onboarding_v1.tsx ────────────

import React from "react";
import { C } from "./constants";
import type { Collaborateur, ParcourTemplate, ActionTemplate, ActionType, GroupePersonnes, DocCategory, WorkflowRule, EmailTemplate, TeamMember } from "./types";
import {
  FileUp, ClipboardList, GraduationCap, ListChecks, ShieldCheck, PenTool,
  BookOpen, CalendarClock, MessageSquare, MessageCircle, Clock, MapPin, ArrowRight,
  Hand, PartyPopper, Dumbbell, Package
} from "lucide-react";

// ─── MOCK DATA ───────────────────────────────────────────────
export const TEAM_MEMBERS: TeamMember[] = [
  { initials: "AL", name: "Amira LAROUSSI", role: "Recruteur(se)", color: "#E41076", email: "amira.laroussi@illizeo.com", telephone: "+41 22 555 01 23" } as any,
  { initials: "JP", name: "Julie PERRIN", role: "HRBP", hasPhoto: true, color: "#8D6E63", email: "julie.perrin@illizeo.com", telephone: "+41 22 555 02 34" } as any,
  { initials: "RN", name: "Romain NDIAYE", role: "DSI", color: "#1A73E8", email: "romain.ndiaye@illizeo.com", telephone: "+41 22 555 03 45" } as any,
  { initials: "SB", name: "Sarah BLANC", role: "Admin RH", color: "#7B5EA7", email: "sarah.blanc@illizeo.com", telephone: "+41 22 555 04 56" } as any,
  { initials: "MK", name: "Mehdi KESSLER", role: "Manager", color: "#4CAF50", email: "mehdi.kessler@illizeo.com", telephone: "+41 22 555 05 67" } as any,
  { initials: "LV", name: "Lucas VIEIRA", role: "IT Suisse", color: "#F9A825", email: "lucas.vieira@illizeo.com", telephone: "+41 22 555 06 78" } as any,
];

export const DOC_CATEGORIES = [
  { id: "complementaires", title: "Documents administratifs complémentaires", missing: 2, docs: ["IBAN/BIC *", "Certificats De Travail et Diplômes *"] },
  { id: "formulaires", title: "Formulaires à remplir et à renvoyer", missing: 9, docs: ["Formulaire permis résident Vaud", "Formulaire frontalier Genève", "Déclaration impôt Vaudois", "Fiche identification *"] },
  { id: "suisse", title: "Documents administratifs – Suisse", missing: 4, docs: ["Pièce d'identité / Passeport *", "Carte d'assuré social", "Permis de travail ou de résidence", "Photo d'identité *"] },
  { id: "supplementaires", title: "Documents administratifs supplémentaires", missing: 7, docs: ["Pièce justificative", "Pièce justificative", "Pièce justificative"] },
];

export const ACTIONS = [
  { id: 1, title: "Compléter mon dossier administratif", subtitle: "Il vous reste 4 pièces administratives à fournir", icon: null, iconBg: C.redLight, iconColor: C.red, urgent: true, type: "admin" as const },
  { id: 2, title: "Compléter les pièces administratives suivantes : Documents administratifs supplémentaires", date: "02 mars", badge: "Onboarding", iconBg: C.greenLight, iconColor: C.green, type: "task" as const },
  { id: 3, title: "Découvre le groupe Illizeo", date: "09 mars", badge: "Onboarding", iconBg: C.blueLight, iconColor: C.blue, type: "task" as const },
  { id: 4, title: "A la rencontre de nos leaders !", date: "06 avril", badge: "Onboarding", iconBg: C.greenLight, iconColor: C.green, type: "future" as const },
  { id: 5, title: "Lire le document suivant : IMPORTANT– Informations relatives aux envois des documents administratifs", date: "11 mai", badge: "Onboarding", iconBg: C.pinkLight, iconColor: C.pink, type: "future" as const },
];

export const _MOCK_NOTIFICATIONS_LIST = [
  "Anniversaire", "Changement de rôle avant la date de début du parcours", "Changement de rôle sur un parcours en cours",
  "Délégation créée", "Delegation Deleted", "Delegation Ended", "Délégation modifiée", "La délégation a commencé",
  "Fin de contrat", "Fin de la période d'essai", "Fin de la période d'essai renouvelée", "Gazette",
  "Invitation d'un utilisateur standard", "Relancer un parcours en retard pour le collaborateur",
  "Relancer les participants à un parcours en retard", "Les arrivées de la semaine", "Une nouvelle recrue arrive",
  "Nouveau questionnaire disponible", "Nouvelle tâche disponible", "Relance des invitations",
  "Pièce administrative à signer disponible", "Catégorie de pièces administratives complétée",
  "Catégorie de pièce administrative refusée", "Catégorie de pièce administrative à valider",
  "Pièce administrative complétée", "La ressource a été mise à jour", "Pièces administratives signées", "Questionnaire complété",
  "Nouveau message reçu", "Document validé", "Badge obtenu", "Cooptation — Statut mis à jour",
  "Parcours terminé", "Signature de contrat requise", "Rappel pré-arrivée J-3",
  "Feedback buddy / parrain demandé", "Mobilité interne — Début de parcours",
  "Retour de congé — Parcours initié", "Résumé hebdomadaire collaborateur", "NPS — Nouvelle enquête disponible"
];

export const NOTIF_RESOURCES = ["Événements"];

// ─── ADMIN MOCK DATA ─────────────────────────────────────────
export const _MOCK_COLLABORATEURS: Collaborateur[] = [
  { id: 1, prenom: "Nadia", nom: "FERREIRA", poste: "Chef de Projet", site: "Genève", departement: "B030-Switzerland", dateDebut: "01/06/2026", phase: "Avant date d'arrivée", progression: 15, status: "en_retard", docsValides: 1, docsTotal: 5, actionsCompletes: 0, actionsTotal: 7, initials: "NF", color: "#E41076", parcours_id: 1 },
  { id: 2, prenom: "Antoine", nom: "MOREL", poste: "Développeur Full Stack", site: "Paris", departement: "Tech-France", dateDebut: "15/06/2026", phase: "Avant date d'arrivée", progression: 45, status: "en_cours", docsValides: 3, docsTotal: 4, actionsCompletes: 2, actionsTotal: 5, initials: "AM", color: "#1A73E8", parcours_id: 1 },
  { id: 3, prenom: "Inès", nom: "CARPENTIER", poste: "UX Designer", site: "Lyon", departement: "Design-France", dateDebut: "01/07/2026", phase: "Avant date d'arrivée", progression: 80, status: "en_cours", docsValides: 4, docsTotal: 4, actionsCompletes: 4, actionsTotal: 5, initials: "IC", color: "#4CAF50", parcours_id: 2 },
  { id: 4, prenom: "Youssef", nom: "HADJ", poste: "Data Analyst", site: "Genève", departement: "Data-Switzerland", dateDebut: "10/03/2026", phase: "Première semaine", progression: 100, status: "termine", docsValides: 5, docsTotal: 5, actionsCompletes: 7, actionsTotal: 7, initials: "YH", color: "#7B5EA7", parcours_id: 1 },
  { id: 5, prenom: "Clara", nom: "VOGEL", poste: "Consultante", site: "Lausanne", departement: "Consulting-CH", dateDebut: "20/06/2026", phase: "Avant date d'arrivée", progression: 0, status: "en_retard", docsValides: 0, docsTotal: 6, actionsCompletes: 0, actionsTotal: 8, initials: "CV", color: "#F9A825", parcours_id: 4 },
];

export const _MOCK_PARCOURS_TEMPLATES: ParcourTemplate[] = [
  // Onboarding
  { id: 1, nom: "Onboarding Standard", phases: ["Avant le premier jour", "Premier jour", "Première semaine", "3 premiers mois"], actionsCount: 12, docsCount: 22, collaborateursActifs: 4, status: "actif", categorie: "onboarding" },
  { id: 2, nom: "Onboarding Cadres", phases: ["Pré-arrivée", "Jour 1", "Mois 1", "6 premiers mois"], actionsCount: 18, docsCount: 28, collaborateursActifs: 1, status: "actif", categorie: "onboarding" },
  { id: 3, nom: "Onboarding Stagiaires", phases: ["Avant l'arrivée", "Premier jour", "Première semaine"], actionsCount: 6, docsCount: 8, collaborateursActifs: 0, status: "brouillon", categorie: "onboarding" },
  // Offboarding
  { id: 4, nom: "Départ standard", phases: ["Annonce", "Transition", "Dernier jour", "Post-départ"], actionsCount: 14, docsCount: 6, collaborateursActifs: 2, status: "actif", categorie: "offboarding" },
  { id: 5, nom: "Départ retraite", phases: ["Célébration", "Passation longue", "Administratif", "Alumni"], actionsCount: 18, docsCount: 8, collaborateursActifs: 1, status: "actif", categorie: "offboarding" },
  { id: 6, nom: "Fin de contrat", phases: ["Bilan", "Administratif", "Dernier jour"], actionsCount: 8, docsCount: 4, collaborateursActifs: 0, status: "actif", categorie: "offboarding" },
  // Crossboarding
  { id: 7, nom: "Mobilité interne standard", phases: ["Annonce mobilité", "Transition poste", "Intégration équipe", "Suivi J+30"], actionsCount: 10, docsCount: 3, collaborateursActifs: 1, status: "actif", categorie: "crossboarding" },
  { id: 8, nom: "Promotion managériale", phases: ["Formation management", "Prise de poste", "Coaching 90 jours"], actionsCount: 14, docsCount: 5, collaborateursActifs: 0, status: "brouillon", categorie: "crossboarding" },
  // Reboarding
  { id: 9, nom: "Retour congé maternité/parental", phases: ["Pré-retour J-14", "Jour de retour", "Réintégration"], actionsCount: 8, docsCount: 2, collaborateursActifs: 1, status: "actif", categorie: "reboarding" },
  { id: 10, nom: "Retour maladie longue durée", phases: ["Pré-retour", "Aménagement poste", "Suivi médical", "Réintégration complète"], actionsCount: 12, docsCount: 4, collaborateursActifs: 0, status: "actif", categorie: "reboarding" },
];

export const _MOCK_ACTION_TEMPLATES: ActionTemplate[] = [
  { id: 1, titre: "Compléter mon dossier administratif", type: "document", phase: "Avant le premier jour", delaiRelatif: "J-30", obligatoire: true, description: "L'employé doit fournir tous les documents administratifs requis", assignation: { mode: "tous", valeurs: [] }, parcours: "Onboarding Standard", piecesRequises: ["Pièce d'identité / Passeport", "RIB / IBAN", "Attestation sécurité sociale", "Photo d'identité"] },
  { id: 2, titre: "Découvre le groupe Illizeo", type: "formation", phase: "Avant le premier jour", delaiRelatif: "J-14", obligatoire: true, description: "Vidéo de présentation du groupe et de ses valeurs", assignation: { mode: "tous", valeurs: [] }, lienExterne: "https://illizeo.com/onboard/decouverte", dureeEstimee: "15 min", parcours: "Onboarding Standard" },
  { id: 3, titre: "A la rencontre de nos leaders !", type: "formation", phase: "Premier jour", delaiRelatif: "J+0", obligatoire: false, description: "Vidéos capsules des leaders de l'entreprise", assignation: { mode: "tous", valeurs: [] }, lienExterne: "https://illizeo.com/onboard/leaders", dureeEstimee: "20 min", parcours: "Onboarding Standard" },
  { id: 4, titre: "Questionnaire d'intégration", type: "questionnaire", phase: "Première semaine", delaiRelatif: "J+7", obligatoire: true, description: "Feedback sur la première semaine d'intégration", assignation: { mode: "tous", valeurs: [] }, parcours: "Onboarding Standard" },
  { id: 5, titre: "Lire le règlement intérieur", type: "lecture", phase: "Avant le premier jour", delaiRelatif: "J-7", obligatoire: true, description: "Document PDF à lire obligatoirement avant l'arrivée", assignation: { mode: "tous", valeurs: [] }, parcours: "Onboarding Standard" },
  { id: 19, titre: "Informations d'arrivée", type: "rdv", phase: "Avant le premier jour", delaiRelatif: "J-3", obligatoire: true, description: "Date, lieu et personne à demander le premier jour. À renseigner par le RH ou le manager pour chaque collaborateur.", assignation: { mode: "tous", valeurs: [] }, parcours: "Onboarding Standard" },
  { id: 6, titre: "Visite des locaux", type: "rdv", phase: "Premier jour", delaiRelatif: "J+0", obligatoire: true, description: "Visite guidée des bureaux et espaces communs", assignation: { mode: "site", valeurs: ["Genève"] }, dureeEstimee: "45 min", parcours: "Onboarding Standard" },
  { id: 7, titre: "Signer la charte informatique", type: "signature", phase: "Premier jour", delaiRelatif: "J+0", obligatoire: true, description: "Signature électronique de la charte d'utilisation des outils IT", assignation: { mode: "tous", valeurs: [] }, parcours: "Onboarding Standard" },
  { id: 8, titre: "Se présenter à l'équipe", type: "message", phase: "Première semaine", delaiRelatif: "J+1", obligatoire: false, description: "Petit message de présentation pour briser la glace", assignation: { mode: "groupe", valeurs: ["Nouveaux arrivants Genève"] }, parcours: "Onboarding Standard" },
  { id: 9, titre: "Compléter les formulaires Suisse", type: "formulaire", phase: "Avant le premier jour", delaiRelatif: "J-21", obligatoire: true, description: "Formulaires permis, déclaration IS, fiche identification", assignation: { mode: "site", valeurs: ["Genève", "Lausanne"] }, parcours: "Onboarding Standard", piecesRequises: ["Formulaire permis résident Vaud", "Formulaire frontalier Genève", "Déclaration impôt Vaudois", "Fiche identification"] },
  { id: 10, titre: "Planifier le point manager", type: "rdv", phase: "Première semaine", delaiRelatif: "J+3", obligatoire: true, description: "Réserver un créneau de 30 min avec votre manager direct", assignation: { mode: "tous", valeurs: [] }, dureeEstimee: "30 min", parcours: "Onboarding Standard" },
  { id: 11, titre: "Quiz culture d'entreprise", type: "questionnaire", phase: "3 premiers mois", delaiRelatif: "J+30", obligatoire: false, description: "Testez vos connaissances sur Illizeo après 1 mois", assignation: { mode: "parcours", valeurs: ["Onboarding Standard"] }, parcours: "Onboarding Cadres" },
  { id: 12, titre: "Rapport d'étonnement", type: "entretien", phase: "3 premiers mois", delaiRelatif: "J+60", obligatoire: false, description: "Entretien structuré pour recueillir les impressions du collaborateur après 2 mois", assignation: { mode: "contrat", valeurs: ["CDI"] }, parcours: "Onboarding Standard" },
  // Onboarding — new actions
  { id: 13, titre: "Provisioning IT — Accès & matériel", type: "checklist_it", phase: "Avant le premier jour", delaiRelatif: "J-7", obligatoire: true, description: "Préparer l'ensemble des accès et du matériel pour le nouveau collaborateur", assignation: { mode: "groupe", valeurs: ["Équipe IT"] }, parcours: "Onboarding Standard" },
  { id: 14, titre: "Rencontrer son buddy", type: "visite", phase: "Premier jour", delaiRelatif: "J+0", obligatoire: true, description: "Premier contact avec le parrain/marraine d'intégration", assignation: { mode: "tous", valeurs: [] }, dureeEstimee: "30 min", parcours: "Onboarding Standard" },
  { id: 15, titre: "Déjeuner d'équipe", type: "visite", phase: "Premier jour", delaiRelatif: "J+0", obligatoire: false, description: "Déjeuner informel avec l'équipe pour faire connaissance", assignation: { mode: "groupe", valeurs: ["Nouveaux arrivants Genève"] }, dureeEstimee: "1h", parcours: "Onboarding Standard" },
  { id: 16, titre: "Point de suivi J+15", type: "entretien", phase: "Première semaine", delaiRelatif: "J+15", obligatoire: true, description: "Entretien de suivi avec le manager après 2 semaines", assignation: { mode: "tous", valeurs: [] }, dureeEstimee: "30 min", parcours: "Onboarding Standard" },
  { id: 17, titre: "Formation sécurité & RGPD", type: "formation", phase: "Première semaine", delaiRelatif: "J+3", obligatoire: true, description: "Module e-learning obligatoire sur la sécurité informatique et la protection des données", assignation: { mode: "tous", valeurs: [] }, lienExterne: "https://illizeo.com/elearning/rgpd", dureeEstimee: "45 min", parcours: "Onboarding Standard" },
  { id: 18, titre: "Définir les objectifs avec le manager", type: "rdv", phase: "3 premiers mois", delaiRelatif: "J+30", obligatoire: true, description: "Fixer les objectifs des 3 premiers mois avec le manager direct", assignation: { mode: "tous", valeurs: [] }, dureeEstimee: "1h", parcours: "Onboarding Standard" },
  // Offboarding
  { id: 20, titre: "Restitution matériel IT", type: "checklist_it", phase: "Annonce", delaiRelatif: "J-7", obligatoire: true, description: "Restituer ordinateur, badge, téléphone et tout matériel professionnel", assignation: { mode: "tous", valeurs: [] }, parcours: "Départ standard" },
  { id: 21, titre: "Désactivation des accès", type: "checklist_it", phase: "Dernier jour", delaiRelatif: "J+0", obligatoire: true, description: "Désactiver email, VPN, Slack, accès aux drives et tous les comptes", assignation: { mode: "tous", valeurs: [] }, parcours: "Départ standard" },
  { id: 22, titre: "Entretien de départ", type: "entretien", phase: "Transition", delaiRelatif: "J-14", obligatoire: true, description: "Entretien confidentiel avec le HRBP pour recueillir le feedback", assignation: { mode: "tous", valeurs: [] }, dureeEstimee: "45 min", parcours: "Départ standard" },
  { id: 23, titre: "Plan de passation", type: "passation", phase: "Transition", delaiRelatif: "J-21", obligatoire: true, description: "Transférer les connaissances, projets en cours et contacts clés", assignation: { mode: "tous", valeurs: [] }, parcours: "Départ standard" },
  { id: 24, titre: "Solde de tout compte", type: "signature", phase: "Dernier jour", delaiRelatif: "J+0", obligatoire: true, description: "Signature du solde de tout compte et des documents de fin de contrat", assignation: { mode: "tous", valeurs: [] }, parcours: "Départ standard" },
  { id: 25, titre: "Certificat de travail", type: "document", phase: "Post-départ", delaiRelatif: "J+7", obligatoire: true, description: "Génération et remise du certificat de travail", assignation: { mode: "tous", valeurs: [] }, parcours: "Départ standard" },
  { id: 26, titre: "Communication départ à l'équipe", type: "message", phase: "Transition", delaiRelatif: "J-7", obligatoire: false, description: "Message informant l'équipe du départ et de la transition", assignation: { mode: "tous", valeurs: [] }, parcours: "Départ standard" },
  { id: 27, titre: "Invitation réseau alumni", type: "message", phase: "Post-départ", delaiRelatif: "J+14", obligatoire: false, description: "Envoi de l'invitation au réseau alumni Illizeo", assignation: { mode: "tous", valeurs: [] }, parcours: "Départ standard" },
  // Crossboarding
  { id: 30, titre: "Rencontre nouvelle équipe", type: "visite", phase: "Intégration équipe", delaiRelatif: "J+0", obligatoire: true, description: "Présentation et rencontre avec les membres de la nouvelle équipe", assignation: { mode: "tous", valeurs: [] }, dureeEstimee: "1h", parcours: "Mobilité interne standard" },
  { id: 31, titre: "Formation nouveau poste", type: "formation", phase: "Transition poste", delaiRelatif: "J-7", obligatoire: true, description: "Formation aux outils et processus spécifiques du nouveau poste", assignation: { mode: "tous", valeurs: [] }, dureeEstimee: "2h", parcours: "Mobilité interne standard" },
  { id: 32, titre: "Transfert des projets en cours", type: "passation", phase: "Transition poste", delaiRelatif: "J-14", obligatoire: true, description: "Handover complet des projets au successeur ou à l'équipe", assignation: { mode: "tous", valeurs: [] }, parcours: "Mobilité interne standard" },
  { id: 33, titre: "Avenant au contrat", type: "signature", phase: "Annonce mobilité", delaiRelatif: "J-21", obligatoire: true, description: "Signature de l'avenant de mobilité interne", assignation: { mode: "tous", valeurs: [] }, parcours: "Mobilité interne standard" },
  { id: 34, titre: "Point de cadrage avec nouveau manager", type: "entretien", phase: "Suivi J+30", delaiRelatif: "J+30", obligatoire: true, description: "Bilan du premier mois dans le nouveau poste", assignation: { mode: "tous", valeurs: [] }, dureeEstimee: "45 min", parcours: "Mobilité interne standard" },
  // Reboarding
  { id: 40, titre: "Point de reprise avec le manager", type: "entretien", phase: "Jour de retour", delaiRelatif: "J+0", obligatoire: true, description: "Entretien de réaccueil pour faire le point sur le retour", assignation: { mode: "tous", valeurs: [] }, dureeEstimee: "30 min", parcours: "Retour congé maternité/parental" },
  { id: 41, titre: "Mise à jour des accès IT", type: "checklist_it", phase: "Pré-retour J-14", delaiRelatif: "J-7", obligatoire: true, description: "Réactivation des accès email, VPN, outils, vérification du matériel", assignation: { mode: "tous", valeurs: [] }, parcours: "Retour congé maternité/parental" },
  { id: 42, titre: "Briefing changements", type: "formation", phase: "Jour de retour", delaiRelatif: "J+0", obligatoire: true, description: "Présentation des changements survenus pendant l'absence (équipe, projets, outils)", assignation: { mode: "tous", valeurs: [] }, dureeEstimee: "1h", parcours: "Retour congé maternité/parental" },
  { id: 43, titre: "Aménagement du poste", type: "tache", phase: "Réintégration", delaiRelatif: "J+7", obligatoire: false, description: "Vérifier si un aménagement du poste ou des horaires est nécessaire", assignation: { mode: "tous", valeurs: [] }, parcours: "Retour congé maternité/parental" },
];

export const _MOCK_GROUPES: GroupePersonnes[] = [
  { id: 1, nom: "Nouveaux arrivants Genève", description: "Tous les collaborateurs intégrant le site de Genève", membres: ["Nadia Ferreira", "Youssef Hadj", "Clara Vogel"], couleur: "#E41076", critereAuto: { type: "site", valeur: "Genève" } },
  { id: 2, nom: "Équipe Tech", description: "Développeurs, data analysts et IT", membres: ["Antoine Morel", "Youssef Hadj"], couleur: "#1A73E8", critereAuto: { type: "departement", valeur: "Tech" } },
  { id: 3, nom: "CDI France & Suisse", description: "Tous les contrats CDI", membres: ["Nadia Ferreira", "Antoine Morel", "Inès Carpentier"], couleur: "#4CAF50", critereAuto: { type: "contrat", valeur: "CDI" } },
  { id: 4, nom: "Managers Suisse", description: "Managers sur les sites suisses", membres: ["Mehdi Kessler"], couleur: "#F9A825" },
  { id: 5, nom: "Stagiaires & Alternants", description: "Contrats stage et alternance", membres: [], couleur: "#7B5EA7", critereAuto: { type: "contrat", valeur: "Stage" } },
  { id: 6, nom: "Équipe IT", description: "Équipe IT/SI en charge du provisioning matériel et des accès", membres: ["Antoine Morel", "Youssef Hadj"], couleur: "#0D47A1", critereAuto: { type: "departement", valeur: "IT" } },
];

export const ACTION_TYPE_META: Record<ActionType, { label: string; description: string; Icon: React.FC<{ size?: number; color?: string }>; bg: string; color: string }> = {
  document: { label: "Document", description: "Pièce à téléverser ou document à fournir (IBAN, pièce d'identité, certificats…).", Icon: FileUp, bg: "#E3F2FD", color: "#1A73E8" },
  formulaire: { label: "Formulaire", description: "Formulaire personnalisé à remplir par l'employé (champs configurables).", Icon: ClipboardList, bg: "#FFF0F5", color: "#E41076" },
  formation: { label: "Formation", description: "Module e-learning ou formation présentielle (lien, durée, validation).", Icon: GraduationCap, bg: "#E8F5E9", color: "#4CAF50" },
  questionnaire: { label: "Questionnaire", description: "Quiz ou enquête avec questions multiples (libre, choix, NPS).", Icon: ListChecks, bg: "#F3E5F5", color: "#7B5EA7" },
  tache: { label: "Tâche", description: "Tâche simple à cocher (sans contenu spécifique attaché).", Icon: ShieldCheck, bg: "#E8F5E9", color: "#388E3C" },
  signature: { label: "Signature", description: "Document à signer électroniquement (contrat personnalisé ou document identique).", Icon: PenTool, bg: "#FFF8E1", color: "#F9A825" },
  lecture: { label: "Lecture", description: "Document ou page à lire avec confirmation de lecture (règlement, charte).", Icon: BookOpen, bg: "#E8EAF6", color: "#3949AB" },
  rdv: { label: "Rendez-vous", description: "Rencontre informelle/logistique avec un lieu (café buddy, welcome DG, visite locaux). Léger, sans agenda précis.", Icon: CalendarClock, bg: "#FCE4EC", color: "#D81B60" },
  message: { label: "Message", description: "Notification automatique à envoyer (in-app, email, Slack, Teams) avec template.", Icon: MessageSquare, bg: "#E0F7FA", color: "#00897B" },
  entretien: { label: "Entretien", description: "Échange structuré avec une trame de points à aborder (cadrage objectifs, bilan période d'essai, 1:1 manager). Plus formel qu'un Rendez-vous.", Icon: MessageCircle, bg: "#FFF3E0", color: "#E65100" },
  checklist_it: { label: "Checklist IT", description: "Liste de provisionnement IT (poste, comptes, accès, équipements).", Icon: Clock, bg: "#E3F2FD", color: "#0D47A1" },
  passation: { label: "Passation", description: "Transfert de dossiers/responsabilités du sortant vers l'arrivant (offboarding/crossboarding).", Icon: ArrowRight, bg: "#F3E5F5", color: "#6A1B9A" },
  visite: { label: "Visite", description: "Tour des bureaux, atelier, site industriel — visite physique guidée.", Icon: MapPin, bg: "#E8F5E9", color: "#2E7D32" },
};

export const PHASE_ICONS: Record<string, React.FC<{ size?: number; color?: string }>> = {
  "Avant le premier jour": Hand,
  "Premier jour": PartyPopper,
  "Première semaine": Dumbbell,
  "3 premiers mois": Package,
};

export const SITES = ["Genève", "Lausanne", "Paris", "Lyon", "Fribourg"];
export const DEPARTEMENTS = ["B030-Switzerland", "Tech-France", "Design-France", "Data-Switzerland", "Consulting-CH", "RH", "Finance"];
export const TYPES_CONTRAT = ["CDI", "CDD", "Stage", "Alternance", "Freelance"];

export const _MOCK_ADMIN_DOC_CATEGORIES: DocCategory[] = [
  { id: "complementaires", titre: "Documents administratifs complémentaires", pieces: [
    { nom: "IBAN/BIC", obligatoire: true, type: "upload" },
    { nom: "Certificats De Travail et Diplômes", obligatoire: true, type: "upload" },
  ]},
  { id: "formulaires", titre: "Formulaires à remplir et à renvoyer", pieces: [
    { nom: "Formulaire permis résident Vaud", obligatoire: false, type: "formulaire" },
    { nom: "Formulaire frontalier Genève", obligatoire: false, type: "formulaire" },
    { nom: "Déclaration impôt Vaudois", obligatoire: false, type: "formulaire" },
    { nom: "Fiche identification", obligatoire: true, type: "formulaire" },
  ]},
  { id: "suisse", titre: "Documents administratifs – Suisse", pieces: [
    { nom: "Pièce d'identité / Passeport", obligatoire: true, type: "upload" },
    { nom: "Carte d'assuré social", obligatoire: false, type: "upload" },
    { nom: "Permis de travail ou de résidence", obligatoire: false, type: "upload" },
    { nom: "Photo d'identité", obligatoire: true, type: "upload" },
  ]},
  { id: "supplementaires", titre: "Documents administratifs supplémentaires", pieces: [
    { nom: "Pièce justificative 1", obligatoire: false, type: "upload" },
    { nom: "Pièce justificative 2", obligatoire: false, type: "upload" },
    { nom: "Pièce justificative 3", obligatoire: false, type: "upload" },
  ]},
];

export const _MOCK_WORKFLOW_RULES: WorkflowRule[] = [
  { id: 1, nom: "Validation pièce d'identité", declencheur: "Document soumis", action: "Envoyer pour validation au Manager", destinataire: "Manager direct", actif: true },
  { id: 2, nom: "Relance documents en retard", declencheur: "J-7 avant date limite", action: "Envoyer email de relance", destinataire: "Collaborateur", actif: true },
  { id: 3, nom: "Notification nouveau collaborateur", declencheur: "Parcours créé", action: "Notifier l'équipe RH", destinataire: "Équipe RH", actif: true },
  { id: 4, nom: "Validation dossier complet", declencheur: "Tous documents validés", action: "Envoyer confirmation au collaborateur", destinataire: "Collaborateur", actif: false },
  { id: 5, nom: "Approbation formulaires Suisse", declencheur: "Formulaire soumis", action: "Envoyer pour approbation Admin RH", destinataire: "Admin RH Suisse", actif: true },
  { id: 6, nom: "Alerte collaborateur en retard", declencheur: "Collaborateur en retard", action: "Envoyer email de relance", destinataire: "Manager direct", actif: true },
  { id: 7, nom: "Message bienvenue IllizeoBot", declencheur: "Nouveau collaborateur", action: "Envoyer un message IllizeoBot", destinataire: "Collaborateur", actif: true },
  { id: 8, nom: "Notification Teams — Nouveau", declencheur: "Nouveau collaborateur", action: "Envoyer via Teams", destinataire: "Équipe RH", actif: true },
  { id: 9, nom: "Badge parcours terminé", declencheur: "Parcours complété à 100%", action: "Attribuer un badge", destinataire: "Collaborateur", actif: true },
  { id: 10, nom: "Évaluation fin période d'essai", declencheur: "Période d'essai terminée", action: "Envoyer pour validation au Manager", destinataire: "Manager direct", actif: true },
  { id: 11, nom: "Relance document refusé", declencheur: "Document refusé", action: "Envoyer email de relance", destinataire: "Collaborateur", actif: true },
  { id: 12, nom: "Alerte NPS négatif", declencheur: "Questionnaire NPS soumis", action: "Notifier l'équipe RH", destinataire: "Équipe RH", actif: true },
  { id: 13, nom: "Récompense cooptation", declencheur: "Cooptation validée", action: "Notifier l'équipe RH", destinataire: "Équipe RH", actif: false },
  { id: 14, nom: "Félicitations anniversaire", declencheur: "Anniversaire d'embauche", action: "Envoyer un message IllizeoBot", destinataire: "Collaborateur", actif: true },
  { id: 15, nom: "Désactivation accès offboarding", declencheur: "Fin de parcours offboarding", action: "Notifier l'équipe RH", destinataire: "Équipe RH", actif: true },
  { id: 16, nom: "Rappel pré-arrivée J-3", declencheur: "J-3 avant date d'arrivée", action: "Envoyer email pré-arrivée", destinataire: "Collaborateur", actif: true },
  { id: 17, nom: "Feedback buddy J+14", declencheur: "J+14 après arrivée", action: "Envoyer demande feedback", destinataire: "Buddy / Parrain", actif: true },
  { id: 18, nom: "Confirmation document validé", declencheur: "Document validé", action: "Envoyer email confirmation", destinataire: "Collaborateur", actif: true },
  { id: 19, nom: "Envoi contrat à signer", declencheur: "Contrat prêt", action: "Envoyer email signature", destinataire: "Collaborateur", actif: true },
  { id: 20, nom: "Relance signature J+3", declencheur: "J+3 après envoi signature", action: "Envoyer relance signature", destinataire: "Collaborateur", actif: true },
  { id: 21, nom: "Résumé hebdomadaire collaborateur", declencheur: "Hebdomadaire (lundi)", action: "Envoyer résumé semaine", destinataire: "Collaborateur", actif: true },
  { id: 22, nom: "Rapport RH — Retards hebdo", declencheur: "Hebdomadaire (lundi)", action: "Envoyer rapport retards", destinataire: "Équipe RH", actif: true },
  { id: 23, nom: "Notification nouveau message", declencheur: "Nouveau message reçu", action: "Envoyer notification email", destinataire: "Destinataire du message", actif: true },
  { id: 24, nom: "Notification mobilité interne", declencheur: "Parcours crossboarding créé", action: "Envoyer email mobilité", destinataire: "Collaborateur", actif: true },
  { id: 25, nom: "Notification retour de congé", declencheur: "Parcours reboarding créé", action: "Envoyer email bienvenue retour", destinataire: "Collaborateur", actif: true },
  { id: 26, nom: "Envoi formulaire fin de période d'essai", declencheur: "Période d'essai terminée", action: "Envoyer formulaire évaluation", destinataire: "Manager direct", actif: true },
  { id: 27, nom: "Envoi entretien de sortie", declencheur: "Parcours offboarding créé", action: "Envoyer questionnaire exit interview", destinataire: "Collaborateur", actif: true },
  { id: 28, nom: "Envoi rapport d'étonnement J+30", declencheur: "J+30 après arrivée", action: "Envoyer questionnaire rapport d'étonnement", destinataire: "Collaborateur", actif: true },
];

export const _MOCK_EMAIL_TEMPLATES: EmailTemplate[] = [
  { id: 1, nom: "Invitation onboarding", sujet: "Bienvenue chez Illizeo – Ton parcours d'intégration", declencheur: "Création du parcours", variables: ["{{prenom}}", "{{date_debut}}", "{{site}}"], actif: true },
  { id: 2, nom: "Relance documents", sujet: "Rappel : documents à compléter", declencheur: "J-7 avant deadline documents", variables: ["{{prenom}}", "{{nb_docs_manquants}}", "{{date_limite}}"], actif: true },
  { id: 3, nom: "Confirmation dossier complet", sujet: "Ton dossier est complet !", declencheur: "Tous documents validés", variables: ["{{prenom}}", "{{date_debut}}"], actif: true },
  { id: 4, nom: "Bienvenue premier jour", sujet: "C'est le grand jour {{prenom}} !", declencheur: "J+0", variables: ["{{prenom}}", "{{site}}", "{{adresse}}", "{{manager}}"], actif: false },
  { id: 5, nom: "Fin de parcours", sujet: "Félicitations – Parcours terminé", declencheur: "Parcours complété à 100%", variables: ["{{prenom}}", "{{parcours_nom}}"], actif: true },
  { id: 6, nom: "Document refusé", sujet: "Document refusé — Action requise", declencheur: "Document refusé", variables: ["{{prenom}}", "{{document_nom}}"], actif: true },
  { id: 7, nom: "Action assignée", sujet: "Nouvelle tâche : {{action_nom}}", declencheur: "Action assignée", variables: ["{{prenom}}", "{{action_nom}}", "{{date_limite}}"], actif: true },
  { id: 8, nom: "Rappel action en retard", sujet: "Rappel : {{action_nom}} est en retard", declencheur: "J-7 avant deadline documents", variables: ["{{prenom}}", "{{action_nom}}", "{{date_limite}}"], actif: true },
  { id: 9, nom: "Validation manager requise", sujet: "Validation requise pour {{collab_nom}}", declencheur: "Tous documents validés", variables: ["{{manager}}", "{{collab_nom}}", "{{parcours_nom}}"], actif: true },
  { id: 10, nom: "Fin période d'essai", sujet: "Période d'essai — Évaluation de {{prenom}}", declencheur: "Parcours complété à 100%", variables: ["{{manager}}", "{{prenom}}", "{{date_fin_essai}}"], actif: true },
  { id: 11, nom: "Anniversaire d'embauche", sujet: "Joyeux anniversaire professionnel {{prenom}} !", declencheur: "Parcours complété à 100%", variables: ["{{prenom}}", "{{annees}}", "{{date_debut}}"], actif: true },
  { id: 12, nom: "Offboarding — Début", sujet: "Départ de {{prenom}} — Procédure initiée", declencheur: "Création du parcours", variables: ["{{prenom}}", "{{date_depart}}", "{{manager}}"], actif: true },
  { id: 13, nom: "Offboarding — Checklist IT", sujet: "Checklist IT — Désactivation des accès de {{prenom}}", declencheur: "Action assignée", variables: ["{{prenom}}", "{{email}}", "{{date_depart}}"], actif: true },
  { id: 14, nom: "Cooptation — Récompense", sujet: "Votre cooptation a été validée !", declencheur: "Tous documents validés", variables: ["{{prenom}}", "{{candidat_nom}}", "{{montant}}"], actif: false },
  { id: 15, nom: "NPS — Enquête satisfaction", sujet: "Comment s'est passé votre onboarding ?", declencheur: "Parcours complété à 100%", variables: ["{{prenom}}", "{{parcours_nom}}", "{{lien}}"], actif: true },
  { id: 16, nom: "Badge obtenu", sujet: "Vous avez obtenu un nouveau badge ! 🏅", declencheur: "Attribution de badge", variables: ["{{prenom}}", "{{badge_nom}}"], actif: true },
  // Onboarding complémentaires
  { id: 17, nom: "Rappel pré-arrivée J-3", sujet: "Plus que 3 jours avant votre premier jour {{prenom}} !", declencheur: "J-3", variables: ["{{prenom}}", "{{site}}", "{{adresse}}", "{{manager}}"], actif: true },
  { id: 18, nom: "Notification manager — Nouvel arrivant", sujet: "Nouvel arrivant dans votre équipe : {{collab_nom}}", declencheur: "Création du collaborateur", variables: ["{{manager}}", "{{collab_nom}}", "{{poste}}", "{{date_debut}}", "{{parcours_nom}}"], actif: true },
  { id: 19, nom: "Feedback buddy / parrain", sujet: "Comment se passe l'intégration de {{collab_nom}} ?", declencheur: "J+14", variables: ["{{prenom}}", "{{collab_nom}}", "{{parcours_nom}}", "{{lien}}"], actif: true },
  // Document validé
  { id: 20, nom: "Document validé", sujet: "Votre document a été validé ✓", declencheur: "Document validé", variables: ["{{prenom}}", "{{document_nom}}"], actif: true },
  // Signatures
  { id: 21, nom: "Signature contrat", sujet: "Votre contrat est prêt à signer", declencheur: "Signature requise", variables: ["{{prenom}}", "{{document_nom}}", "{{lien}}"], actif: true },
  { id: 22, nom: "Relance signature", sujet: "Rappel : document en attente de signature", declencheur: "J+3 après signature requise", variables: ["{{prenom}}", "{{document_nom}}", "{{lien}}"], actif: true },
  // Crossboarding / Reboarding
  { id: 23, nom: "Mobilité interne — Début", sujet: "Votre transition vers {{poste}} commence !", declencheur: "Création du parcours", variables: ["{{prenom}}", "{{poste}}", "{{site}}", "{{manager}}", "{{parcours_nom}}"], actif: true },
  { id: 24, nom: "Retour de congé — Bienvenue", sujet: "Content de vous retrouver {{prenom}} !", declencheur: "Création du parcours", variables: ["{{prenom}}", "{{site}}", "{{manager}}", "{{parcours_nom}}"], actif: true },
  // Communication
  { id: 25, nom: "Nouveau message reçu", sujet: "Vous avez un nouveau message de {{collab_nom}}", declencheur: "Nouveau message", variables: ["{{prenom}}", "{{collab_nom}}", "{{lien}}"], actif: true },
  { id: 26, nom: "Résumé hebdomadaire", sujet: "Votre semaine d'intégration — {{prenom}}", declencheur: "Hebdomadaire (lundi)", variables: ["{{prenom}}", "{{nb_docs_manquants}}", "{{parcours_nom}}", "{{lien}}"], actif: true },
  // Rappel RH
  { id: 27, nom: "Rappel RH — Actions en retard", sujet: "Rapport : {{nb_retards}} action(s) en retard", declencheur: "Hebdomadaire (lundi)", variables: ["{{nb_retards}}", "{{lien}}"], actif: true },
  // Évaluations
  { id: 28, nom: "Évaluation fin de période d'essai", sujet: "Évaluation de fin de période d'essai — {{collab_nom}}", declencheur: "Parcours complété à 100%", variables: ["{{manager}}", "{{collab_nom}}", "{{date_fin_essai}}", "{{lien}}"], actif: true, contenu: "<h2>Bonjour {{manager}},</h2><p>La période d'essai de <strong>{{collab_nom}}</strong> arrive à son terme le <strong>{{date_fin_essai}}</strong>.</p><p>Merci de compléter le formulaire d'évaluation afin de confirmer ou non la poursuite du contrat.</p><p><a href='{{lien}}' style='display:inline-block;padding:10px 28px;background:#E41076;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;'>Compléter l'évaluation</a></p>" },
  { id: 29, nom: "Entretien de sortie (Exit Interview)", sujet: "Votre avis compte — Entretien de sortie", declencheur: "Création du parcours", variables: ["{{prenom}}", "{{date_depart}}", "{{lien}}"], actif: true, contenu: "<h2>Bonjour {{prenom}},</h2><p>Votre départ est prévu le <strong>{{date_depart}}</strong>. Nous aimerions recueillir votre retour d'expérience afin d'améliorer continuellement notre environnement de travail.</p><p>Ce questionnaire est confidentiel et prend environ 5 minutes.</p><p><a href='{{lien}}' style='display:inline-block;padding:10px 28px;background:#E41076;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;'>Répondre au questionnaire</a></p>" },
  { id: 30, nom: "Rapport d'étonnement (1 mois)", sujet: "Votre regard compte — Rapport d'étonnement", declencheur: "J+30", variables: ["{{prenom}}", "{{parcours_nom}}", "{{lien}}"], actif: true, contenu: "<h2>Bonjour {{prenom}},</h2><p>Cela fait maintenant 1 mois que vous avez rejoint l'équipe. Nous aimerions recueillir votre regard neuf sur notre entreprise.</p><p><a href='{{lien}}' style='display:inline-block;padding:10px 28px;background:#E41076;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;'>Partager mon retour</a></p>" },
];
export const TPL_CATEGORIES: Record<string, { label: string; color: string; bg: string }> = {
  onboarding: { label: "Onboarding", color: "#4CAF50", bg: "#E8F5E9" },
  offboarding: { label: "Offboarding", color: "#E53935", bg: "#FFEBEE" },
  crossboarding: { label: "Crossboarding", color: "#00897B", bg: "#E0F2F1" },
  relance: { label: "Relance", color: "#F9A825", bg: "#FFF8E1" },
  signature: { label: "Signature", color: "#E65100", bg: "#FFF3E0" },
  communication: { label: "Communication", color: "#5C6BC0", bg: "#E8EAF6" },
  admin: { label: "Admin / RH", color: "#1A73E8", bg: "#E3F2FD" },
  cooptation: { label: "Cooptation", color: "#7B5EA7", bg: "#F3E5F5" },
};
export function guessTplCategory(nom: string): string {
  const n = nom.toLowerCase();
  if (n.includes("offboard") || n.includes("départ") || n.includes("checklist it")) return "offboarding";
  if (n.includes("mobilité") || n.includes("crossboard") || n.includes("retour de congé") || n.includes("reboard")) return "crossboarding";
  if (n.includes("signature") || n.includes("contrat")) return "signature";
  if (n.includes("message") || n.includes("résumé hebdo") || n.includes("communication")) return "communication";
  if (n.includes("relance") || n.includes("rappel") || n.includes("retard")) return "relance";
  if (n.includes("validation") || n.includes("période") || n.includes("nps") || n.includes("anniversaire")) return "admin";
  if (n.includes("cooptation")) return "cooptation";
  return "onboarding";
}

export const _MOCK_PHASE_DEFAULTS = [
  { id: 1, nom: "Avant le premier jour", delaiDebut: "J-30", delaiFin: "J-1", couleur: "#4CAF50", iconName: "Hand" as const, actionsDefaut: 4 },
  { id: 2, nom: "Premier jour", delaiDebut: "J+0", delaiFin: "J+0", couleur: "#1A73E8", iconName: "PartyPopper" as const, actionsDefaut: 3 },
  { id: 3, nom: "Première semaine", delaiDebut: "J+1", delaiFin: "J+7", couleur: "#F9A825", iconName: "Dumbbell" as const, actionsDefaut: 3 },
  { id: 4, nom: "3 premiers mois", delaiDebut: "J+8", delaiFin: "J+90", couleur: "#E41076", iconName: "Package" as const, actionsDefaut: 2 },
];

export const EQUIPE_ROLES = [
  { role: "Manager", description: "Responsable hiérarchique direct", obligatoire: true },
  { role: "HRBP", description: "Business Partner RH référent", obligatoire: true },
  { role: "Buddy/Parrain", description: "Accompagnateur d'intégration", obligatoire: false },
  { role: "Admin RH", description: "Gestionnaire administratif", obligatoire: true },
  { role: "IT", description: "Support technique / accès", obligatoire: false },
  { role: "Recruteur", description: "Personne en charge du recrutement", obligatoire: false },
];

