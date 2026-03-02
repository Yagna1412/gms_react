import jsPDF from "jspdf";

export const downloadInvoicePDF = (invoice) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Invoice", 14, 20);

  doc.setFontSize(12);
  doc.text(`Invoice ID: ${invoice.id}`, 14, 35);
  doc.text(`Customer: ${invoice.customer}`, 14, 45);
  doc.text(`Branch: ${invoice.branch}`, 14, 55);
  doc.text(`Date: ${invoice.date}`, 14, 65);
  doc.text(`Status: ${invoice.status}`, 14, 75);

  doc.setFontSize(14);
  doc.text(`Total Amount: ₹${invoice.amount}`, 14, 95);

  doc.save(`${invoice.id}.pdf`);
};
