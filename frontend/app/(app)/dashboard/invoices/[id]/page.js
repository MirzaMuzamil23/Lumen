"use client";

import Link from "next/link";
import { findInvoice, formatCurrency } from "@/lib/invoicesData";

export default function InvoiceDetailPage({ params }) {
  const invoice = findInvoice(params.id);

  if (!invoice) {
    return (
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container" style={{ maxWidth: 560 }}>
          <div className="card">
            <h2 style={{ marginBottom: 12 }}>Invoice not found</h2>
            <p className="text-muted" style={{ marginBottom: 24 }}>
              We couldn't find an invoice with ID "{params.id}".
            </p>
            <Link href="/dashboard/invoices" className="btn btn-ghost">← Back to invoices</Link>
          </div>
        </div>
      </section>
    );
  }

  const subtotal = invoice.items.reduce((sum, item) => sum + item.qty * item.rate, 0);

  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <Link href="/dashboard/invoices" className="text-mono" style={{ fontSize: 13, color: "var(--gold-deep)" }}>
            ← Back to invoices
          </Link>
          <button className="btn btn-ghost" onClick={() => window.print()} style={{ padding: "8px 16px", fontSize: 13 }}>
            Print / Save PDF
          </button>
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, flexWrap: "wrap", gap: 20 }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 6 }}>LUMEN</div>
              <p className="text-muted" style={{ fontSize: 13 }}>
                Karachi, Pakistan<br />hello@lumen.studio
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <h1 style={{ fontSize: 26, marginBottom: 6 }}>{invoice.id}</h1>
              <span
                className="text-mono"
                style={{
                  fontSize: 12,
                  padding: "4px 12px",
                  borderRadius: 20,
                  border: "1px solid var(--border-strong)",
                  color: invoice.status === "Paid" ? "var(--sage)" : "var(--gold-deep)",
                }}
              >
                {invoice.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid-2" style={{ marginBottom: 32, gap: 24 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Billed to</div>
              <div style={{ fontSize: 14.5 }}>Your account</div>
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Issue date</div>
              <div style={{ fontSize: 14.5 }}>{invoice.date}</div>
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Due date</div>
              <div style={{ fontSize: 14.5 }}>{invoice.dueDate}</div>
            </div>
          </div>

          <div className="table-scroll">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Description", "Qty", "Rate", "Amount"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: h === "Description" ? "left" : "right",
                        padding: "12px 0",
                        fontFamily: "var(--font-mono)",
                        fontSize: 11.5,
                        textTransform: "uppercase",
                        color: "var(--porcelain-muted)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "14px 0", fontSize: 14.5 }}>{item.desc}</td>
                    <td style={{ padding: "14px 0", fontSize: 14.5, textAlign: "right" }}>{item.qty}</td>
                    <td style={{ padding: "14px 0", fontSize: 14.5, textAlign: "right" }}>{formatCurrency(item.rate)}</td>
                    <td style={{ padding: "14px 0", fontSize: 14.5, textAlign: "right" }}>{formatCurrency(item.qty * item.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <div style={{ width: 220 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14 }}>
                <span className="text-muted">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <hr className="divider" />
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", fontSize: 17, fontFamily: "var(--font-display)" }}>
                <span>Total</span>
                <span style={{ color: "var(--gold-deep)" }}>{formatCurrency(subtotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}