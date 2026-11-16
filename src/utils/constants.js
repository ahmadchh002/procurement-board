export const DIRECTOR_LIMIT = 50000;

export const STAGE_PAGE_PATHS = {
  pending: "/pendingreview",
  director: "/directorapproval",
  po: "/POIssue",
  delivered: "/delieverd",
};

export const STAGES = [
  { id: "pending", title: "Pending Review", accent: "var(--amber)" },
  { id: "director", title: "Director Approval", accent: "var(--purple)" },
  { id: "po", title: "PO Issued", accent: "var(--blue)" },
  { id: "delivered", title: "Delivered", accent: "var(--green)" },
];
