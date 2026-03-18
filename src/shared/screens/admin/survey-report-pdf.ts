import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { QuestionChartData } from './survey-analytics.type';

export type { QuestionChartData };

// ── Layout constants (A4 = 210×297 mm) ───────────────────────────────────────
const PAGE_W      = 210;
const MARGIN      = 14;
const COL_GAP     = 5;                                   // gap between two columns
const CHART_W     = (PAGE_W - MARGIN * 2 - COL_GAP) / 2; // ≈ 88.5 mm per column
const CHART_H     = 58;                                  // mm — chart image height
const LABEL_H     = 13;                                  // mm — reserved above each chart (q-text + count)
const ROW_H       = LABEL_H + CHART_H + 8;              // ≈ 79 mm per grid row  → ~4 charts / page
const COL_X       = [MARGIN, MARGIN + CHART_W + COL_GAP] as const;

// ── Colour palette ────────────────────────────────────────────────────────────
const PALETTE = [
  '#E8505E', '#4ECDC4', '#45B7D1', '#96CEB4', '#F7DC6F',
  '#DDA0DD', '#98D8C8', '#BB8FCE', '#85C1E9', '#82E0AA',
  '#F1948A', '#AED6F1', '#A9DFBF', '#FAD7A0', '#A8D8EA',
];

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

// ── Canvas chart helpers ──────────────────────────────────────────────────────

/** Doughnut pie chart — compact (legend below if many items). */
function drawPieChart(labels: string[], values: number[]): string {
  const W = 480, H = 280;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  const total = values.reduce((s, v) => s + v, 0);
  if (total === 0) {
    ctx.fillStyle = '#aaa'; ctx.font = '16px Arial'; ctx.textAlign = 'center';
    ctx.fillText('No data', W / 2, H / 2);
    return canvas.toDataURL('image/png');
  }

  // Pie area on left, legend on right
  const cx = 135, cy = 135, outerR = 108, innerR = 44;
  let angle = -Math.PI / 2;

  for (let i = 0; i < values.length; i++) {
    const slice = (values[i] / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, angle, angle + slice);
    ctx.closePath();
    ctx.fillStyle = PALETTE[i % PALETTE.length];
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (slice > 0.22) {
      const mid = angle + slice / 2;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${((values[i] / total) * 100).toFixed(0)}%`,
        cx + outerR * 0.67 * Math.cos(mid),
        cy + outerR * 0.67 * Math.sin(mid) + 4,
      );
    }
    angle += slice;
  }

  // Doughnut hole + center label
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.fillStyle = '#333';
  ctx.font = 'bold 15px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(String(total), cx, cy + 2);
  ctx.font = '10px Arial';
  ctx.fillStyle = '#999';
  ctx.fillText('total', cx, cy + 16);

  // Legend — right column, wraps if needed
  const legX = 262, legStartY = 22, rowH = 22;
  ctx.textAlign = 'left';
  for (let i = 0; i < labels.length; i++) {
    const lY = legStartY + i * rowH;
    if (lY + 14 > H) break;
    const [r, g, b] = hexToRgb(PALETTE[i % PALETTE.length]);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(legX, lY - 10, 12, 12);
    ctx.fillStyle = '#333';
    ctx.font = '11px Arial';
    const pct = ((values[i] / total) * 100).toFixed(0);
    const lbl = labels[i].length > 18 ? labels[i].slice(0, 16) + '…' : labels[i];
    ctx.fillText(`${lbl}  (${pct}%)`, legX + 16, lY);
  }

  return canvas.toDataURL('image/png');
}

/** Horizontal bar chart — compact, suitable for many options. */
function drawBarHorizontal(labels: string[], values: number[]): string {
  const barH = 22, topPad = 16, botPad = 12, leftPad = 130, rightPad = 50;
  const W = 480;
  const H = topPad + labels.length * (barH + 8) + botPad;
  const maxVal = Math.max(...values, 1);
  const barAreaW = W - leftPad - rightPad;

  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = Math.max(H, 120);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, canvas.height);

  for (let i = 0; i < labels.length; i++) {
    const bW = (values[i] / maxVal) * barAreaW;
    const bY = topPad + i * (barH + 8);

    ctx.fillStyle = PALETTE[i % PALETTE.length];
    ctx.fillRect(leftPad, bY, Math.max(bW, 1), barH);

    ctx.fillStyle = '#333';
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';
    const lbl = labels[i].length > 19 ? labels[i].slice(0, 17) + '…' : labels[i];
    ctx.fillText(lbl, leftPad - 8, bY + barH / 2 + 4);

    ctx.textAlign = 'left';
    ctx.font = 'bold 11px Arial';
    ctx.fillText(String(values[i]), leftPad + bW + 5, bY + barH / 2 + 4);
  }

  return canvas.toDataURL('image/png');
}

/** Vertical bar chart — for ratings / daily counts. */
function drawBarVertical(labels: string[], values: number[]): string {
  const W = 480, H = 260;
  const topPad = 26, botPad = 64, leftPad = 36, rightPad = 16;
  const barAreaH = H - topPad - botPad;
  const maxVal = Math.max(...values, 1);
  const count = labels.length;
  const barW = Math.max(8, Math.min(34, (W - leftPad - rightPad) / count - 5));
  const gap   = (W - leftPad - rightPad - barW * count) / Math.max(count - 1, 1);

  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // Baseline
  ctx.strokeStyle = '#ddd'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(leftPad, topPad + barAreaH);
  ctx.lineTo(W - rightPad, topPad + barAreaH);
  ctx.stroke();

  for (let i = 0; i < count; i++) {
    const bH  = (values[i] / maxVal) * barAreaH;
    const bX  = leftPad + i * (barW + gap);
    const bY  = topPad + barAreaH - bH;

    ctx.fillStyle = PALETTE[i % PALETTE.length];
    ctx.fillRect(bX, bY, barW, bH);

    if (values[i] > 0) {
      ctx.fillStyle = '#333'; ctx.font = 'bold 9px Arial'; ctx.textAlign = 'center';
      ctx.fillText(String(values[i]), bX + barW / 2, bY - 4);
    }

    ctx.save();
    ctx.translate(bX + barW / 2, topPad + barAreaH + 8);
    if (count > 7) { ctx.rotate(-Math.PI / 3.5); ctx.textAlign = 'right'; }
    else            { ctx.textAlign = 'center'; }
    ctx.fillStyle = '#555'; ctx.font = '9px Arial';
    const lbl = labels[i].length > 9 ? labels[i].slice(0, 7) + '…' : labels[i];
    ctx.fillText(lbl, 0, 0);
    ctx.restore();
  }

  return canvas.toDataURL('image/png');
}

// ── Data extractor ────────────────────────────────────────────────────────────

function extractOptions(q: QuestionChartData): { label: string; count: number }[] {
  if (!q.data || !Array.isArray(q.data)) return [];
  return (q.data as Record<string, unknown>[]).map(d => ({
    label: String(d.name ?? d.label ?? ''),
    count: Number(d.value ?? d.count ?? 0),
  }));
}

function buildChartImage(q: QuestionChartData): string | null {
  const options = extractOptions(q);
  if (options.length === 0) return null;
  const lbls = options.map(o => o.label);
  const vals = options.map(o => o.count);

  switch (q.chartType) {
    case 'bar-horizontal': return drawBarHorizontal(lbls, vals);
    case 'bar-vertical':
    case 'rating-distribution': return drawBarVertical(lbls, vals);
    default: return drawPieChart(lbls, vals); // pie / unknown → doughnut
  }
}

// ── PDF generation ────────────────────────────────────────────────────────────

type JsPDFWithAT = jsPDF & { lastAutoTable: { finalY: number } };

export function generateSurveyReportPdf(params: {
  surveyLabel: string;
  totalResponses: number;
  questionCharts: QuestionChartData[];
  zonalStats: { zone: string; count: number }[];
  districtStats: { district: string; count: number }[];
  dailyStats: { date: string; count: number }[];
  topUsers: { displayName?: string; zone: string; total: number; todayCount: number }[];
}): void {
  const { surveyLabel, totalResponses, questionCharts, zonalStats, districtStats, dailyStats, topUsers } = params;
  const doc = new jsPDF() as JsPDFWithAT;
  let y = 20;

  const checkPage = (need: number) => {
    if (y + need > 278) { doc.addPage(); y = 20; }
  };

  const sectionTitle = (title: string) => {
    checkPage(14);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(232, 80, 94);
    doc.text(title, MARGIN, y);
    const w = doc.getTextWidth(title);
    doc.setDrawColor(232, 80, 94);
    doc.setLineWidth(0.35);
    doc.line(MARGIN, y + 1.2, MARGIN + w, y + 1.2);
    doc.setDrawColor(0);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    y += 8;
  };

  /** Renders a single question card (label + chart) at a given x position. */
  const renderCard = (q: QuestionChartData, cardX: number, cardY: number) => {
    const img = buildChartImage(q);
    const options = extractOptions(q);

    // Question label (truncated to 1 line at small font)
    const label = `Q${q.order ?? ''}: ${q.questionText}`;
    const truncated = label.length > 52 ? label.slice(0, 50) + '…' : label;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(truncated, cardX, cardY, { maxWidth: CHART_W });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(130, 130, 130);
    doc.text(`${q.totalAnswered ?? q.totalResponses ?? 0} responses`, cardX, cardY + 5);
    doc.setTextColor(0, 0, 0);

    if (!img) {
      // Text / numeric question — no chart, show "Open-ended" placeholder
      doc.setFontSize(7.5);
      doc.setTextColor(170, 170, 170);
      doc.text('Open-ended / numeric', cardX, cardY + LABEL_H + CHART_H / 2);
      doc.setTextColor(0, 0, 0);
      return;
    }

    // Bar-horizontal height scales with option count, capped to CHART_H
    let imgH = CHART_H;
    if (q.chartType === 'bar-horizontal') {
      imgH = Math.min(CHART_H, Math.max(28, options.length * 8 + 16));
    }

    doc.addImage(img, 'PNG', cardX, cardY + LABEL_H, CHART_W, imgH);
  };

  // ── Cover header ─────────────────────────────────────────────────────────────
  doc.setFillColor(232, 80, 94);
  doc.rect(0, 0, PAGE_W, 36, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(surveyLabel, MARGIN, 14);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Analytics Report  ·  Generated: ${new Date().toLocaleDateString()}  ·  Total Responses: ${totalResponses}`,
    MARGIN, 26,
  );
  doc.setTextColor(0, 0, 0);
  y = 44;

  // ── Question Analysis — 2-column grid ────────────────────────────────────────
  sectionTitle('Question Analysis');

  for (let i = 0; i < questionCharts.length; i += 2) {
    checkPage(ROW_H);
    const rowY = y;

    renderCard(questionCharts[i], COL_X[0], rowY);
    if (questionCharts[i + 1]) {
      renderCard(questionCharts[i + 1], COL_X[1], rowY);
    }

    // Thin divider between rows
    const divY = rowY + ROW_H - 3;
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, divY, PAGE_W - MARGIN, divY);
    doc.setDrawColor(0);

    y += ROW_H;
  }

  // ── Zone + District side-by-side (if both present) ───────────────────────────
  if (zonalStats.length > 0 || districtStats.length > 0) {
    checkPage(ROW_H + 10);
    const statsY = y;

    if (zonalStats.length > 0 && districtStats.length > 0) {
      // Side by side
      sectionTitle('Zone & District Breakdown');
      const zImg = zonalStats.length <= 10
        ? drawPieChart(zonalStats.map(z => z.zone), zonalStats.map(z => z.count))
        : drawBarHorizontal(zonalStats.map(z => z.zone), zonalStats.map(z => z.count));
      const dImg = districtStats.length <= 10
        ? drawPieChart(districtStats.map(d => d.district), districtStats.map(d => d.count))
        : drawBarHorizontal(districtStats.map(d => d.district), districtStats.map(d => d.count));

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text('Zone Breakdown', COL_X[0], y);
      doc.text('District Breakdown', COL_X[1], y);
      doc.setFont('helvetica', 'normal');
      y += 5;

      doc.addImage(zImg, 'PNG', COL_X[0], y, CHART_W, CHART_H);
      doc.addImage(dImg, 'PNG', COL_X[1], y, CHART_W, CHART_H);
      y += CHART_H + 8;
    } else if (zonalStats.length > 0) {
      sectionTitle('Zone Breakdown');
      const zImg = zonalStats.length <= 10
        ? drawPieChart(zonalStats.map(z => z.zone), zonalStats.map(z => z.count))
        : drawBarHorizontal(zonalStats.map(z => z.zone), zonalStats.map(z => z.count));
      doc.addImage(zImg, 'PNG', MARGIN, y, PAGE_W - MARGIN * 2, CHART_H + 10);
      y += CHART_H + 18;
    } else {
      sectionTitle('District Breakdown');
      const dImg = districtStats.length <= 10
        ? drawPieChart(districtStats.map(d => d.district), districtStats.map(d => d.count))
        : drawBarHorizontal(districtStats.map(d => d.district), districtStats.map(d => d.count));
      doc.addImage(dImg, 'PNG', MARGIN, y, PAGE_W - MARGIN * 2, CHART_H + 10);
      y += CHART_H + 18;
    }

    void statsY; // suppress unused warning
  }

  // ── Daily Submissions ────────────────────────────────────────────────────────
  if (dailyStats.length > 0) {
    checkPage(CHART_H + 20);
    sectionTitle('Daily Submissions');
    const img = drawBarVertical(dailyStats.map(d => d.date), dailyStats.map(d => d.count));
    doc.addImage(img, 'PNG', MARGIN, y, PAGE_W - MARGIN * 2, CHART_H + 8);
    y += CHART_H + 18;
  }

  // ── Top Contributors ─────────────────────────────────────────────────────────
  if (topUsers.length > 0) {
    checkPage(30);
    sectionTitle('Top Contributors');
    autoTable(doc, {
      startY: y,
      head: [['Name', 'Zone', 'Total', 'Today']],
      body: topUsers.map(u => [u.displayName || 'Unknown', u.zone, u.total, u.todayCount]),
      margin: { left: MARGIN },
      styles: { fontSize: 8 },
      headStyles: { fillColor: [232, 80, 94] },
      alternateRowStyles: { fillColor: [255, 245, 246] },
    });
    y = doc.lastAutoTable.finalY + 6;
  }

  doc.save(`${surveyLabel.replace(/\s+/g, '_')}_Report.pdf`);
}
