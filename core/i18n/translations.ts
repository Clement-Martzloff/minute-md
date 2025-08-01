// Définit la structure pour un ensemble de traductions
const en = {
  summary: "Summary",
  participants: "Participants",
  agenda: "Agenda",
  discussion: "Discussion",
  actionItems: "Action Items",
  actionItemsDescription: "Description",
  actionItemsOwner: "Owner",
  actionItemsDueDate: "Due Date",
  noActionItems: "No action items were assigned.",
};

// Exporter un type pour garantir que toutes les langues ont les mêmes clés
export type TranslationSet = typeof en;

// Collection de toutes les traductions disponibles
export const translations: Record<string, TranslationSet> = {
  // Anglais (par défaut)
  en: en,

  // Français
  fr: {
    summary: "Résumé",
    participants: "Participants",
    agenda: "Ordre du jour",
    discussion: "Discussion",
    actionItems: "Points d'action",
    actionItemsDescription: "Description",
    actionItemsOwner: "Responsable",
    actionItemsDueDate: "Date d'échéance",
    noActionItems: "Aucun point d'action n'a été assigné.",
  },

  // Ajoutez d'autres langues ici...
  // es: { ... },
  // de: { ... },
};
