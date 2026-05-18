const PDFDocument = require('pdfkit');

const COLORS = {
  primary: '#4F46E5',
  primaryDark: '#3730A3',
  secondary: '#7C3AED',
  accent: '#06B6D4',
  text: '#1E293B',
  textLight: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  bgLight: '#F8FAFC',
  white: '#FFFFFF',
  success: '#10B981',
  warning: '#F59E0B'
};

function generatePDF(offer) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 60, right: 60 },
        bufferPages: true,
        info: {
          Title: `Offer Letter - ${offer.candidate_name}`,
          Author: offer.company_name,
          Subject: `Employment Offer for ${offer.role}`,
          Creator: 'OfferForge AI'
        }
      });

      const buffers = [];
      doc.on('data', chunk => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const salary = parseFloat(offer.salary);
      const formattedSalary = `$${salary.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
      const formattedDate = new Date(offer.joining_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const issuedDate = new Date(offer.generated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const validUntil = offer.valid_until ? new Date(offer.valid_until).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

      // ======== PAGE 1: HEADER & OFFER DETAILS ========
      drawHeader(doc, offer, pageWidth);
      drawWatermark(doc);

      // Reference and date
      doc.moveDown(1);
      doc.fontSize(9).fillColor(COLORS.textLight);
      doc.text(`Ref: ${offer.id}`, { align: 'left' });
      doc.text(`Date: ${issuedDate}`, { align: 'left' });
      doc.moveDown(1);

      // Candidate address block
      doc.fontSize(11).fillColor(COLORS.text);
      doc.text(offer.candidate_name, { continued: false });
      if (offer.candidate_email) {
        doc.fontSize(10).fillColor(COLORS.textLight);
        doc.text(offer.candidate_email);
      }
      doc.moveDown(1.5);

      // Subject line
      doc.fontSize(12).fillColor(COLORS.primary).font('Helvetica-Bold');
      doc.text(`Re: Offer of Employment — ${offer.role}`, { underline: false });
      doc.moveDown(0.5);

      // Decorative line
      doc.moveTo(doc.x, doc.y).lineTo(doc.x + pageWidth, doc.y).strokeColor(COLORS.primary).lineWidth(2).stroke();
      doc.moveDown(1);

      // Greeting
      doc.fontSize(11).fillColor(COLORS.text).font('Helvetica');
      doc.text(`Dear ${offer.candidate_name},`, { lineGap: 4 });
      doc.moveDown(0.5);

      // Opening paragraph
      doc.fontSize(10.5).fillColor(COLORS.text).font('Helvetica');
      doc.text(
        `On behalf of the entire team at ${offer.company_name}, we are thrilled to extend this formal offer of employment ` +
        `for the position of ${offer.role}${offer.department ? ` within our ${offer.department} department` : ''}. ` +
        `After careful consideration of your qualifications, experience, and the outstanding impression you made during the interview process, ` +
        `we are confident that you will be an invaluable addition to our organization.`,
        { lineGap: 3, align: 'justify' }
      );
      doc.moveDown(0.8);

      doc.text(
        `Your unique blend of skills and expertise aligns perfectly with our company's vision and strategic direction. ` +
        `We believe this role presents an exceptional opportunity for you to make a significant impact while advancing your professional career.`,
        { lineGap: 3, align: 'justify' }
      );
      doc.moveDown(1.5);

      // Position Details Box
      drawSectionHeader(doc, 'POSITION DETAILS', pageWidth);
      doc.moveDown(0.5);

      const posDetails = [
        ['Position Title', offer.role],
        ['Department', offer.department || 'General'],
        ['Employment Type', 'Full-Time, Permanent'],
        ['Start Date', formattedDate],
        ['Work Location', offer.company_address || `${offer.company_name} Headquarters`],
        ['Reporting To', `${offer.hr_name}, ${offer.hr_title || 'Head of Human Resources'}`]
      ];

      drawInfoTable(doc, posDetails, pageWidth);
      doc.moveDown(1.5);

      // ======== PAGE 2: COMPENSATION & BENEFITS ========
      doc.addPage();
      drawPageHeader(doc, offer, pageWidth);
      drawWatermark(doc);

      drawSectionHeader(doc, 'COMPENSATION PACKAGE', pageWidth);
      doc.moveDown(0.5);

      // Salary breakdown table
      const monthlySalary = salary / 12;
      const biweeklySalary = salary / 26;
      const performanceBonus = salary * 0.15;

      const compDetails = [
        ['Annual Base Salary', formattedSalary],
        ['Monthly Gross', `$${monthlySalary.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`],
        ['Bi-Weekly Gross', `$${biweeklySalary.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`],
        ['Performance Bonus (up to)', `$${performanceBonus.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} (15% of base)`],
        ['Payment Method', 'Direct Deposit (Bi-Weekly)'],
        ['Currency', offer.currency || 'USD']
      ];

      drawInfoTable(doc, compDetails, pageWidth);
      doc.moveDown(0.5);

      doc.fontSize(9).fillColor(COLORS.textLight).font('Helvetica-Oblique');
      doc.text('* Salary is subject to applicable tax withholdings and deductions as required by law.', { lineGap: 2 });
      doc.text('* Performance bonus is discretionary and based on individual and company performance.', { lineGap: 2 });
      doc.font('Helvetica');
      doc.moveDown(1.5);

      // Benefits Section
      drawSectionHeader(doc, 'EMPLOYEE BENEFITS', pageWidth);
      doc.moveDown(0.5);

      const benefits = offer.benefits || [
        'Comprehensive Health, Dental & Vision Insurance',
        '401(k) Retirement Plan with 6% Company Match',
        '20 Days Paid Time Off + 10 Company Holidays',
        'Life Insurance & Long-term Disability Coverage',
        'Professional Development Budget ($2,500/year)',
        'Flexible Work Arrangements & Remote Options',
        'Employee Assistance Program (EAP)',
        'Gym & Wellness Membership Reimbursement'
      ];

      const benefitCategories = [
        {
          title: 'Health & Wellness',
          items: [
            'Premium medical, dental, and vision coverage for you and your dependents',
            'Health Savings Account (HSA) with employer contribution',
            'Mental health support and Employee Assistance Program',
            'Annual wellness stipend and gym membership reimbursement'
          ]
        },
        {
          title: 'Financial Benefits',
          items: [
            '401(k) retirement plan with up to 6% company match',
            'Company-paid life insurance (2x annual salary)',
            'Short-term and long-term disability insurance',
            'Employee Stock Purchase Plan (where applicable)'
          ]
        },
        {
          title: 'Time Off & Flexibility',
          items: [
            '20 days paid time off (PTO) annually',
            '10 company-observed holidays',
            'Flexible work schedule and hybrid work options',
            'Paid parental leave (12 weeks)'
          ]
        },
        {
          title: 'Growth & Development',
          items: [
            '$2,500 annual professional development budget',
            'Conference and training attendance',
            'Internal mentorship programs',
            'Tuition reimbursement for approved programs'
          ]
        }
      ];

      benefitCategories.forEach(cat => {
        doc.fontSize(10).fillColor(COLORS.primaryDark).font('Helvetica-Bold');
        doc.text(`▸ ${cat.title}`, { lineGap: 2 });
        doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.text);
        cat.items.forEach(item => {
          doc.text(`    •  ${item}`, { lineGap: 2 });
        });
        doc.moveDown(0.4);
      });

      // ======== PAGE 3: TERMS & CONDITIONS, SIGNATURES ========
      doc.addPage();
      drawPageHeader(doc, offer, pageWidth);
      drawWatermark(doc);

      drawSectionHeader(doc, 'TERMS & CONDITIONS', pageWidth);
      doc.moveDown(0.5);

      const terms = [
        {
          title: '1. Probationary Period',
          text: 'Your employment will be subject to a 90-day probationary period during which either party may terminate the employment relationship with two weeks\' written notice.'
        },
        {
          title: '2. At-Will Employment',
          text: `Your employment with ${offer.company_name} is "at-will," meaning that either you or the Company may terminate the employment relationship at any time, with or without cause, and with or without notice, subject to applicable law.`
        },
        {
          title: '3. Background Verification',
          text: 'This offer is contingent upon the successful completion of a background check, verification of employment eligibility, and any other pre-employment screenings deemed necessary by the Company.'
        },
        {
          title: '4. Confidentiality & Non-Disclosure',
          text: `As a condition of your employment, you will be required to sign ${offer.company_name}'s standard Confidentiality and Non-Disclosure Agreement. You agree to protect all proprietary information, trade secrets, and confidential business information during and after your employment.`
        },
        {
          title: '5. Intellectual Property',
          text: 'All work product, inventions, designs, and creative works developed during the course of your employment shall be the exclusive property of the Company.'
        },
        {
          title: '6. Code of Conduct',
          text: `You will be expected to comply with all Company policies, procedures, and the ${offer.company_name} Code of Conduct as outlined in the Employee Handbook, which will be provided to you on your first day.`
        },
        {
          title: '7. Non-Compete',
          text: 'You agree that during your employment and for a period of twelve (12) months following termination, you will not engage in any activity that directly competes with the Company\'s business interests.'
        }
      ];

      terms.forEach(term => {
        doc.fontSize(10).fillColor(COLORS.primaryDark).font('Helvetica-Bold');
        doc.text(term.title, { lineGap: 2 });
        doc.fontSize(9.5).fillColor(COLORS.text).font('Helvetica');
        doc.text(term.text, { lineGap: 2, align: 'justify' });
        doc.moveDown(0.5);
      });

      doc.moveDown(0.5);

      // Acceptance section
      drawSectionHeader(doc, 'OFFER ACCEPTANCE', pageWidth);
      doc.moveDown(0.5);

      doc.fontSize(10).fillColor(COLORS.text).font('Helvetica');
      doc.text(
        `Please indicate your acceptance of this offer by signing below and returning this letter by ${validUntil}. ` +
        `If we do not receive your signed acceptance by this date, this offer will be considered withdrawn.`,
        { lineGap: 3, align: 'justify' }
      );
      doc.moveDown(0.5);
      doc.text(
        'By signing below, you acknowledge that you have read, understood, and agree to the terms and conditions outlined in this offer letter.',
        { lineGap: 3, align: 'justify' }
      );
      doc.moveDown(1.5);

      // Signature blocks
      const sigY = doc.y;
      const halfWidth = pageWidth / 2 - 20;

      // HR signature (left)
      doc.fontSize(9).fillColor(COLORS.textLight);
      doc.text('For and on behalf of the Company:', doc.page.margins.left, sigY);
      doc.moveDown(2);
      doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.margins.left + halfWidth, doc.y).strokeColor(COLORS.border).lineWidth(1).stroke();
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor(COLORS.text).font('Helvetica-Bold');
      doc.text(offer.hr_name, doc.page.margins.left);
      doc.fontSize(9).fillColor(COLORS.textLight).font('Helvetica');
      doc.text(offer.hr_title || 'Head of Human Resources');
      doc.text(offer.company_name);
      const afterHrSig = doc.y;

      // Candidate signature (right)
      const rightX = doc.page.margins.left + halfWidth + 40;
      doc.fontSize(9).fillColor(COLORS.textLight);
      doc.text('Acceptance by Candidate:', rightX, sigY);
      doc.moveDown(2);
      doc.moveTo(rightX, doc.y).lineTo(rightX + halfWidth, doc.y).strokeColor(COLORS.border).lineWidth(1).stroke();
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor(COLORS.text).font('Helvetica-Bold');
      doc.text(offer.candidate_name, rightX);
      doc.fontSize(9).fillColor(COLORS.textLight).font('Helvetica');
      doc.text('Date: ____________________', rightX);

      doc.y = Math.max(afterHrSig, doc.y) + 20;

      // Date line
      doc.fontSize(9).fillColor(COLORS.textLight);
      doc.text(`Date of Issue: ${issuedDate}`, doc.page.margins.left);
      doc.text(`Offer Valid Until: ${validUntil}`, doc.page.margins.left);

      // Add page numbers and footers
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);

        // Footer line
        const footerY = doc.page.height - 40;
        doc.moveTo(doc.page.margins.left, footerY - 10)
          .lineTo(doc.page.width - doc.page.margins.right, footerY - 10)
          .strokeColor(COLORS.border).lineWidth(0.5).stroke();

        // Footer text
        doc.fontSize(7.5).fillColor(COLORS.textMuted);
        doc.text(
          `${offer.company_name} | Confidential Employment Offer`,
          doc.page.margins.left, footerY - 5,
          { width: pageWidth / 2, align: 'left' }
        );
        doc.text(
          `Page ${i + 1} of ${totalPages}`,
          doc.page.margins.left, footerY - 5,
          { width: pageWidth, align: 'right' }
        );

        // Offer ID in footer
        doc.fontSize(6.5).fillColor(COLORS.textMuted);
        doc.text(
          `Offer ID: ${offer.id}`,
          doc.page.margins.left, footerY + 5,
          { width: pageWidth, align: 'center' }
        );
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

function drawHeader(doc, offer, pageWidth) {
  // Gradient header bar
  const headerHeight = 80;
  const grad = doc.linearGradient(0, 0, doc.page.width, 0);
  grad.stop(0, COLORS.primary);
  grad.stop(1, COLORS.secondary);

  doc.save();
  doc.rect(0, 0, doc.page.width, headerHeight).fill(grad);

  // Company name in header
  doc.fontSize(22).fillColor(COLORS.white).font('Helvetica-Bold');
  doc.text(offer.company_name.toUpperCase(), doc.page.margins.left, 22, {
    width: pageWidth,
    align: 'left'
  });

  // Tagline
  doc.fontSize(9).fillColor('#E0E7FF').font('Helvetica');
  doc.text('OFFICIAL OFFER OF EMPLOYMENT', doc.page.margins.left, 50, {
    width: pageWidth,
    align: 'left',
    characterSpacing: 2
  });

  doc.restore();
  doc.y = headerHeight + 15;
  doc.x = doc.page.margins.left;
}

function drawPageHeader(doc, offer, pageWidth) {
  // Simpler header for continuation pages
  const headerHeight = 45;
  const grad = doc.linearGradient(0, 0, doc.page.width, 0);
  grad.stop(0, COLORS.primary);
  grad.stop(1, COLORS.secondary);

  doc.save();
  doc.rect(0, 0, doc.page.width, headerHeight).fill(grad);

  doc.fontSize(12).fillColor(COLORS.white).font('Helvetica-Bold');
  doc.text(offer.company_name, doc.page.margins.left, 15, {
    width: pageWidth / 2,
    align: 'left'
  });

  doc.fontSize(8).fillColor('#E0E7FF').font('Helvetica');
  doc.text(`Offer Letter — ${offer.candidate_name}`, doc.page.margins.left + pageWidth / 2, 18, {
    width: pageWidth / 2,
    align: 'right'
  });

  doc.restore();
  doc.y = headerHeight + 15;
  doc.x = doc.page.margins.left;
}

function drawSectionHeader(doc, title, pageWidth) {
  const y = doc.y;

  // Background bar
  doc.save();
  doc.rect(doc.page.margins.left - 5, y - 3, pageWidth + 10, 22)
    .fillColor('#EEF2FF')
    .fill();

  // Left accent bar
  doc.rect(doc.page.margins.left - 5, y - 3, 3, 22)
    .fillColor(COLORS.primary)
    .fill();

  doc.restore();

  doc.fontSize(11).fillColor(COLORS.primary).font('Helvetica-Bold');
  doc.text(title, doc.page.margins.left + 5, y + 2, { characterSpacing: 1.5 });
  doc.moveDown(0.8);
  doc.font('Helvetica');
}

function drawInfoTable(doc, data, pageWidth) {
  const colWidth = pageWidth / 2;
  const rowHeight = 22;
  const startX = doc.page.margins.left;
  let startY = doc.y;

  data.forEach((row, i) => {
    const y = startY + (i * rowHeight);

    // Alternating row background
    if (i % 2 === 0) {
      doc.save();
      doc.rect(startX, y - 2, pageWidth, rowHeight).fillColor('#F8FAFC').fill();
      doc.restore();
    }

    // Label
    doc.fontSize(9.5).fillColor(COLORS.textLight).font('Helvetica');
    doc.text(row[0], startX + 5, y + 4, { width: colWidth - 10 });

    // Value
    doc.fontSize(9.5).fillColor(COLORS.text).font('Helvetica-Bold');
    doc.text(row[1], startX + colWidth, y + 4, { width: colWidth - 5 });
  });

  doc.y = startY + (data.length * rowHeight) + 5;
  doc.font('Helvetica');
}

function drawWatermark(doc) {
  doc.save();
  doc.fontSize(60).fillColor(COLORS.primary).opacity(0.03).font('Helvetica-Bold');
  doc.translate(doc.page.width / 2, doc.page.height / 2);
  doc.rotate(-45, { origin: [0, 0] });
  doc.text('CONFIDENTIAL', -180, -30);
  doc.restore();
  doc.opacity(1);
}

module.exports = { generatePDF };
