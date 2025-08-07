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

export type TranslationSet = typeof en;

export const translations: Record<string, TranslationSet> = {
  en: en,
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
};
