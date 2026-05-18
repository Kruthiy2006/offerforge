-- OfferForge AI Sample Data
USE offerforge;

-- Sample candidates
INSERT INTO candidates (name, email, phone, current_role, department, experience_years, location) VALUES
('Sarah Chen', 'sarah.chen@email.com', '+1-555-0101', 'Senior Software Engineer', 'Engineering', 6, 'San Francisco, CA'),
('James Rodriguez', 'james.rodriguez@email.com', '+1-555-0102', 'Product Manager', 'Product', 8, 'New York, NY'),
('Priya Sharma', 'priya.sharma@email.com', '+1-555-0103', 'Data Scientist', 'Data & Analytics', 4, 'Austin, TX'),
('Michael Park', 'michael.park@email.com', '+1-555-0104', 'UX Designer', 'Design', 5, 'Seattle, WA'),
('Emily Watson', 'emily.watson@email.com', '+1-555-0105', 'DevOps Engineer', 'Infrastructure', 7, 'Denver, CO'),
('Alex Thompson', 'alex.thompson@email.com', '+1-555-0106', 'Marketing Director', 'Marketing', 10, 'Chicago, IL'),
('Lisa Chang', 'lisa.chang@email.com', '+1-555-0107', 'Frontend Developer', 'Engineering', 3, 'Portland, OR'),
('David Kim', 'david.kim@email.com', '+1-555-0108', 'Backend Engineer', 'Engineering', 5, 'Boston, MA');

-- Sample templates
INSERT INTO templates (name, description, content, category, is_premium, placeholders) VALUES
(
  'Standard Employment Offer',
  'A comprehensive standard offer letter suitable for most full-time positions.',
  'Dear {{candidate_name}},\n\nWe are thrilled to extend this offer of employment for the position of {{role}} at {{company_name}}. After careful consideration of your qualifications and experience, we believe you will be an outstanding addition to our team.\n\n**Position Details:**\n- **Role:** {{role}}\n- **Department:** {{department}}\n- **Start Date:** {{joining_date}}\n- **Reporting To:** {{hr_name}}, {{hr_title}}\n\n**Compensation:**\n- **Base Salary:** {{salary}} per annum\n- **Payment Schedule:** Bi-weekly direct deposit\n\n**Benefits Package:**\n- Comprehensive health, dental, and vision insurance\n- 401(k) retirement plan with company match up to 6%\n- 20 days paid time off (PTO) annually\n- Professional development budget of $2,500/year\n- Flexible work arrangements\n\nThis offer is contingent upon successful completion of a background check and verification of your employment eligibility.\n\nPlease confirm your acceptance by signing and returning this letter by {{valid_until}}.\n\nWe look forward to welcoming you to the {{company_name}} family!\n\nWarm regards,\n{{hr_name}}\n{{hr_title}}\n{{company_name}}',
  'general',
  FALSE,
  '["candidate_name", "role", "company_name", "department", "joining_date", "hr_name", "hr_title", "salary", "valid_until"]'
),
(
  'Executive Offer Package',
  'Premium offer letter for C-level and VP positions with enhanced compensation details.',
  'Dear {{candidate_name}},\n\nOn behalf of the Board of Directors and the leadership team at {{company_name}}, I am delighted to present you with this formal offer of employment for the position of {{role}}.\n\nYour exceptional track record, strategic vision, and leadership capabilities make you the ideal candidate for this pivotal role within our organization.\n\n**Executive Position Details:**\n- **Title:** {{role}}\n- **Department:** {{department}}\n- **Commencement Date:** {{joining_date}}\n- **Location:** {{company_name}} Headquarters\n\n**Executive Compensation Package:**\n- **Base Salary:** {{salary}} per annum\n- **Performance Bonus:** Up to 30% of base salary\n- **Equity Grant:** Stock options vesting over 4 years\n- **Signing Bonus:** Negotiable\n\n**Executive Benefits:**\n- Premium executive health plan (family coverage)\n- Executive retirement package with enhanced matching\n- Unlimited PTO policy\n- Company vehicle or transportation allowance\n- Executive education and conference budget\n- Relocation assistance (if applicable)\n\nThis offer represents our commitment to attracting and retaining world-class talent. We are confident that your contributions will drive significant value for {{company_name}} and its stakeholders.\n\nKindly review and respond by {{valid_until}}.\n\nWith great anticipation,\n{{hr_name}}\n{{hr_title}}\n{{company_name}}',
  'executive',
  TRUE,
  '["candidate_name", "role", "company_name", "department", "joining_date", "hr_name", "hr_title", "salary", "valid_until"]'
),
(
  'Tech Startup Offer',
  'Modern, casual offer letter designed for tech startups and innovative companies.',
  'Hey {{candidate_name}}! 🎉\n\nGreat news — we would love for you to join {{company_name}} as our new {{role}}!\n\nWe were blown away by your skills and passion during the interview process, and we cannot wait to see what you will build with us.\n\n**The Role:**\n- **Position:** {{role}}\n- **Team:** {{department}}\n- **Starting:** {{joining_date}}\n\n**Compensation & Perks:**\n- **Salary:** {{salary}}/year\n- **Equity:** Employee stock option plan (ESOP)\n- **Remote-first:** Work from anywhere\n- **Unlimited PTO:** We trust you to manage your time\n- **Learning Budget:** $3,000/year for courses, conferences, and books\n- **Equipment:** MacBook Pro + home office setup budget\n- **Wellness:** Monthly wellness stipend\n- **Team Events:** Quarterly off-sites and team retreats\n\nWe are building something special here, and we think you are exactly the person to help us get there.\n\nLet us know by {{valid_until}} — we hope it is a yes! 🚀\n\nCheers,\n{{hr_name}}\n{{hr_title}}\n{{company_name}}',
  'startup',
  FALSE,
  '["candidate_name", "role", "company_name", "department", "joining_date", "hr_name", "hr_title", "salary", "valid_until"]'
),
(
  'Enterprise Corporate Offer',
  'Formal corporate offer letter for large enterprise organizations.',
  'Dear {{candidate_name}},\n\nRe: Offer of Employment — {{role}}\n\nFurther to your recent interviews, I am writing to formally confirm our offer of employment with {{company_name}}. The terms and conditions of your employment are set out below.\n\n**1. Position & Duties**\nYou will be employed as {{role}} in the {{department}} department, reporting to your designated line manager. Your duties will include those commensurate with your position as may be assigned from time to time.\n\n**2. Commencement & Location**\nYour employment will commence on {{joining_date}}. Your primary place of work will be at the offices of {{company_name}}.\n\n**3. Remuneration**\nYour gross annual salary will be {{salary}}, payable in equal monthly installments via direct bank transfer. Your salary will be subject to periodic review, though this does not imply any guarantee of increase.\n\n**4. Working Hours**\nYour normal working hours are 40 hours per week, Monday to Friday. Flexibility may be required based on business needs.\n\n**5. Annual Leave**\nYou will be entitled to 25 days paid annual leave per calendar year, in addition to public holidays.\n\n**6. Benefits**\nYou will be eligible to participate in the company benefits program, including medical insurance, retirement plan, and other benefits as detailed in the Employee Handbook.\n\n**7. Probationary Period**\nYour employment is subject to satisfactory completion of a 90-day probationary period.\n\nPlease confirm your acceptance by signing below and returning by {{valid_until}}.\n\nYours sincerely,\n{{hr_name}}\n{{hr_title}}\n{{company_name}}',
  'corporate',
  TRUE,
  '["candidate_name", "role", "company_name", "department", "joining_date", "hr_name", "hr_title", "salary", "valid_until"]'
);

-- Sample offers
INSERT INTO offers (id, candidate_id, template_id, candidate_name, candidate_email, role, department, salary, joining_date, company_name, hr_name, hr_title, status, valid_until, content) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 1, 1, 'Sarah Chen', 'sarah.chen@email.com', 'Senior Software Engineer', 'Engineering', 185000.00, '2026-06-15', 'TechCorp Global Inc.', 'Jennifer Morrison', 'Head of Human Resources', 'accepted', '2026-06-01', 'Full offer content generated...'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 2, 2, 'James Rodriguez', 'james.rodriguez@email.com', 'VP of Product', 'Product', 250000.00, '2026-07-01', 'TechCorp Global Inc.', 'Jennifer Morrison', 'Head of Human Resources', 'sent', '2026-06-15', 'Full offer content generated...'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 3, 1, 'Priya Sharma', 'priya.sharma@email.com', 'Lead Data Scientist', 'Data & Analytics', 165000.00, '2026-06-20', 'TechCorp Global Inc.', 'Jennifer Morrison', 'Head of Human Resources', 'draft', '2026-06-10', 'Full offer content generated...'),
('d4e5f6a7-b8c9-0123-defa-234567890123', 5, 3, 'Emily Watson', 'emily.watson@email.com', 'Senior DevOps Engineer', 'Infrastructure', 175000.00, '2026-07-10', 'TechCorp Global Inc.', 'Jennifer Morrison', 'Head of Human Resources', 'rejected', '2026-06-20', 'Full offer content generated...'),
('e5f6a7b8-c9d0-1234-efab-345678901234', 6, 4, 'Alex Thompson', 'alex.thompson@email.com', 'Director of Marketing', 'Marketing', 195000.00, '2026-08-01', 'TechCorp Global Inc.', 'Jennifer Morrison', 'Head of Human Resources', 'draft', '2026-07-15', 'Full offer content generated...');

-- Sample status logs
INSERT INTO offer_status_logs (offer_id, old_status, new_status, changed_by, note) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'draft', 'sent', 'Jennifer Morrison', 'Offer letter sent via email'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'sent', 'accepted', 'System', 'Candidate accepted the offer'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'draft', 'sent', 'Jennifer Morrison', 'Executive offer dispatched'),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'draft', 'sent', 'Jennifer Morrison', 'Offer sent to candidate'),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'sent', 'rejected', 'System', 'Candidate declined — accepted another offer');
