-- OfferForge AI Database Schema
-- Run: mysql -u root < schema.sql

CREATE DATABASE IF NOT EXISTS offerforge;
USE offerforge;

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  current_role VARCHAR(255),
  department VARCHAR(255),
  experience_years INT DEFAULT 0,
  location VARCHAR(255),
  status ENUM('active', 'inactive', 'hired') DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  content LONGTEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'general',
  is_premium BOOLEAN DEFAULT FALSE,
  placeholders JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Offers table
CREATE TABLE IF NOT EXISTS offers (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id INT,
  template_id INT,
  candidate_name VARCHAR(255) NOT NULL,
  candidate_email VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  salary DECIMAL(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  joining_date DATE NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  company_address TEXT,
  hr_name VARCHAR(255) NOT NULL,
  hr_title VARCHAR(255) DEFAULT 'Head of Human Resources',
  hr_email VARCHAR(255),
  content LONGTEXT,
  benefits JSON,
  status ENUM('draft', 'sent', 'accepted', 'rejected', 'expired', 'revoked') DEFAULT 'draft',
  valid_until DATE,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE SET NULL,
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_candidate_email (candidate_email),
  INDEX idx_generated_at (generated_at)
);

-- Offer status logs table
CREATE TABLE IF NOT EXISTS offer_status_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  offer_id VARCHAR(36) NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by VARCHAR(255) DEFAULT 'System',
  note TEXT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE,
  INDEX idx_offer_id (offer_id)
);
