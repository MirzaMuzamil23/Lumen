"use client";

import Link from "next/link";
import { INVOICES, formatCurrency } from "@/lib/invoicesData";

const statusColor = (s) => (s === "Paid" ? "var(--sage)" : "var(--gold)");

export default function InvoicesPage() {
  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="container">
        <div style={{ marginBottom: 8 }} className="eyebrow">Billing</div>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Invoices</h1>
        <p className="text-muted" style={{ marginBottom: 32, fontSize: 14 }}>
          Demo data — connect a billing provider to replace this with real invoices.
        </p>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="table-scroll">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Invoice", "Date", "Amount", "Status", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "16px 24px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "var(--porcelain-muted)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv, i) => (
                <tr key={inv.id} style={{ borderBottom: i < INVOICES.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td style={{ padding: "16px 24px", fontFamily: "var(--font-mono)", fontSize: 14 }}>{inv.id}</td>
                  <td style={{ padding: "16px 24px", fontSize: 14 }}>{inv.date}</td>
                  <td style={{ padding: "16px 24px", fontSize: 14 }}>{formatCurrency(inv.amount)}</td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{ fontSize: 13, color: statusColor(inv.status) }}>● {inv.status}</span>
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <Link href={`/dashboard/invoices/${inv.id}`} className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: 12.5 }}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </section>
  );
}