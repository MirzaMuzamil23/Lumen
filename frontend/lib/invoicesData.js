export const INVOICES = [
  {
    id: "INV-1042",
    date: "2026-07-01",
    dueDate: "2026-07-15",
    amount: 4800,
    status: "Paid",
    items: [
      { desc: "Studio plan — July", qty: 1, rate: 4800 },
    ],
  },
  {
    id: "INV-1031",
    date: "2026-06-01",
    dueDate: "2026-06-15",
    amount: 4800,
    status: "Paid",
    items: [
      { desc: "Studio plan — June", qty: 1, rate: 4800 },
    ],
  },
  {
    id: "INV-1019",
    date: "2026-05-01",
    dueDate: "2026-05-15",
    amount: 4800,
    status: "Paid",
    items: [
      { desc: "Studio plan — May", qty: 1, rate: 4800 },
    ],
  },
];

export function findInvoice(id) {
  return INVOICES.find((inv) => inv.id === id);
}

export function formatCurrency(n) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}