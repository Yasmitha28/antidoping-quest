import { motion } from 'framer-motion';
import { Download, Printer, X } from 'lucide-react';
import type { Certificate } from '../types';

type CertificatePreviewProps = {
  certificate: Certificate | null;
  recipientName: string;
  isOpen: boolean;
  onClose: () => void;
};

export function CertificatePreview({ certificate, recipientName, isOpen, onClose }: CertificatePreviewProps) {
  if (!isOpen || !certificate) return null;

  const issuedDate = new Date(certificate.issuedAt).toLocaleDateString();

  const exportSvg = () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900">
        <rect width="1400" height="900" fill="#07111f" rx="32" />
        <rect x="40" y="40" width="1320" height="820" rx="28" fill="#0f172a" stroke="#5eead4" stroke-width="4" />
        <text x="700" y="170" fill="#f8fafc" text-anchor="middle" font-size="44" font-family="Georgia, serif">Anti-Doping Awareness Certificate</text>
        <text x="700" y="250" fill="#8b5cf6" text-anchor="middle" font-size="26" font-family="Arial, sans-serif">Presented to</text>
        <text x="700" y="340" fill="#ffffff" text-anchor="middle" font-size="60" font-family="Georgia, serif">${recipientName}</text>
        <text x="700" y="420" fill="#cbd5e1" text-anchor="middle" font-size="26" font-family="Arial, sans-serif">for achieving ${certificate.percentage}% in the anti-doping learning journey</text>
        <text x="700" y="500" fill="#f8fafc" text-anchor="middle" font-size="30" font-family="Georgia, serif">${certificate.title}</text>
        <text x="700" y="575" fill="#94a3b8" text-anchor="middle" font-size="22" font-family="Arial, sans-serif">Issued on ${issuedDate}</text>
        <text x="700" y="760" fill="#5eead4" text-anchor="middle" font-size="24" font-family="Arial, sans-serif">Score: ${certificate.score} • Recognition: ${certificate.percentage}%</text>
      </svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificate-${recipientName.replace(/\s+/g, '-').toLowerCase()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printCertificate = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate</title>
          <style>
            body { margin: 0; background: #07111f; font-family: Georgia, serif; color: #f8fafc; }
            .card { max-width: 900px; margin: 40px auto; border: 4px solid #5eead4; border-radius: 24px; padding: 48px; background: #0f172a; }
            h1 { text-align: center; font-size: 34px; margin-bottom: 16px; }
            .subtitle { text-align: center; color: #8b5cf6; margin-bottom: 24px; }
            .name { text-align: center; font-size: 42px; margin: 28px 0; }
            .details { text-align: center; color: #cbd5e1; font-size: 20px; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Anti-Doping Awareness Certificate</h1>
            <div class="subtitle">Presented to</div>
            <div class="name">${recipientName}</div>
            <div class="details">for achieving ${certificate.percentage}% in the anti-doping learning journey<br />${certificate.title}<br />Issued on ${issuedDate}</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-brand-500/20 bg-gradient-to-br from-brand-500/10 to-slate-900 p-6 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Certificate unlocked</p>
          <h2 className="text-xl font-semibold">Certificate preview</h2>
        </div>
        <button onClick={onClose} className="rounded-full border border-white/10 bg-white/10 p-2"><X size={18} /></button>
      </div>
      <div className="rounded-3xl border border-brand-500/20 bg-slate-950/70 p-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Anti-Doping Awareness Certificate</p>
        <h3 className="mt-4 text-3xl font-semibold">{recipientName}</h3>
        <p className="mt-3 text-slate-300">for achieving {certificate.percentage}% in the anti-doping learning journey</p>
        <p className="mt-2 text-lg text-brand-100">{certificate.title}</p>
        <p className="mt-4 text-sm text-slate-400">Issued on {issuedDate}</p>
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button onClick={printCertificate} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm"><Printer size={16} />Print</button>
        <button onClick={exportSvg} className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white"><Download size={16} />Download</button>
      </div>
    </motion.div>
  );
}
