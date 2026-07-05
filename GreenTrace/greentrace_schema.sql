-- ============================================================
-- GreenTrace Database Schema
-- Run this script if you prefer manual table creation
-- instead of Hibernate DDL auto update
-- ============================================================

CREATE DATABASE IF NOT EXISTS greentrace_db;
USE greentrace_db;

-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(255),
    country VARCHAR(255),
    created_at DATETIME
);

-- System Users
CREATE TABLE IF NOT EXISTS system_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    organization_id BIGINT,
    created_at DATETIME,
    CONSTRAINT fk_user_org FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Emission Factors
CREATE TABLE IF NOT EXISTS emission_factors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    activity_type VARCHAR(255) NOT NULL,
    description TEXT,
    kg_co2_per_unit DOUBLE NOT NULL,
    unit VARCHAR(100) NOT NULL,
    created_at DATETIME
);

-- Carbon Activities
CREATE TABLE IF NOT EXISTS carbon_activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    organization_id BIGINT NOT NULL,
    emission_factor_id BIGINT NOT NULL,
    quantity DOUBLE NOT NULL,
    calculated_co2 DOUBLE NOT NULL,
    activity_date DATE NOT NULL,
    notes TEXT,
    recorded_by BIGINT,
    created_at DATETIME,
    CONSTRAINT fk_activity_org FOREIGN KEY (organization_id) REFERENCES organizations(id),
    CONSTRAINT fk_activity_factor FOREIGN KEY (emission_factor_id) REFERENCES emission_factors(id),
    CONSTRAINT fk_activity_user FOREIGN KEY (recorded_by) REFERENCES system_users(id)
);

-- Footprint Reports
CREATE TABLE IF NOT EXISTS footprint_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    organization_id BIGINT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_emissions DOUBLE NOT NULL,
    generated_at DATETIME,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    CONSTRAINT fk_report_org FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Default Admin (BCrypt hash for "admin123")
INSERT IGNORE INTO system_users (name, email, password, role, created_at)
VALUES (
    'System Admin',
    'admin@greentrace.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ROLE_SYSTEM_GOVERNOR',
    NOW()
);

-- Sample Emission Factors
INSERT IGNORE INTO emission_factors (activity_type, description, kg_co2_per_unit, unit, created_at) VALUES
('Electricity Consumption', 'Grid electricity usage', 0.82, 'kWh', NOW()),
('Natural Gas', 'Natural gas combustion', 2.04, 'cubic meter', NOW()),
('Diesel Fuel', 'Diesel combustion for transport', 2.68, 'liter', NOW()),
('Petrol/Gasoline', 'Petrol combustion for transport', 2.31, 'liter', NOW()),
('Air Travel (short haul)', 'Flights under 3700km', 0.255, 'passenger-km', NOW()),
('Air Travel (long haul)', 'Flights over 3700km', 0.195, 'passenger-km', NOW()),
('Coal Combustion', 'Coal burned for energy', 2.42, 'kg', NOW()),
('LPG', 'Liquefied petroleum gas usage', 1.51, 'liter', NOW()),
('Waste to Landfill', 'General waste sent to landfill', 0.58, 'kg', NOW()),
('Water Consumption', 'Municipal water supply usage', 0.00034, 'liter', NOW());

-- ============================================================
-- DUMMY DATA FOR API TESTING
-- ============================================================

-- Organizations
INSERT IGNORE INTO organizations (id, name, industry, country, created_at) VALUES
(1, 'GreenCorp Manufacturing', 'Manufacturing', 'India', NOW()),
(2, 'EcoTech Solutions', 'Information Technology', 'India', NOW()),
(3, 'BlueSky Airlines', 'Aviation', 'United States', NOW()),
(4, 'ClearWater Industries', 'Chemical', 'United Kingdom', NOW());

-- Users (all passwords are BCrypt of "password123")
-- BCrypt hash for "password123": $2a$10$EblZqNptyYvcLm/VwDpt./vYPJphpBL7RQqtRBxGu.gDoaEKVHXHO
INSERT IGNORE INTO system_users (id, name, email, password, role, organization_id, created_at) VALUES
(2, 'Ravi Kumar',    'ravi@greencorp.com',   '$2a$10$EblZqNptyYvcLm/VwDpt./vYPJphpBL7RQqtRBxGu.gDoaEKVHXHO', 'ROLE_ENVIRONMENTAL_AUDITOR', 1, NOW()),
(3, 'Priya Sharma',  'priya@ecotech.com',    '$2a$10$EblZqNptyYvcLm/VwDpt./vYPJphpBL7RQqtRBxGu.gDoaEKVHXHO', 'ROLE_ENVIRONMENTAL_AUDITOR', 2, NOW()),
(4, 'James Wilson',  'james@bluesky.com',    '$2a$10$EblZqNptyYvcLm/VwDpt./vYPJphpBL7RQqtRBxGu.gDoaEKVHXHO', 'ROLE_ENVIRONMENTAL_AUDITOR', 3, NOW()),
(5, 'Sarah Connor',  'sarah@clearwater.com', '$2a$10$EblZqNptyYvcLm/VwDpt./vYPJphpBL7RQqtRBxGu.gDoaEKVHXHO', 'ROLE_SYSTEM_GOVERNOR',       4, NOW()),
(6, 'Arjun Nair',    'arjun@greencorp.com',  '$2a$10$EblZqNptyYvcLm/VwDpt./vYPJphpBL7RQqtRBxGu.gDoaEKVHXHO', 'ROLE_ENVIRONMENTAL_AUDITOR', 1, NOW());

-- Carbon Activities
-- calculated_co2 = quantity * kg_co2_per_unit
-- emission_factor ids: 1=Electricity(0.82), 2=NaturalGas(2.04), 3=Diesel(2.68), 4=Petrol(2.31), 5=AirTravel-short(0.255)

INSERT IGNORE INTO carbon_activities
    (id, organization_id, emission_factor_id, quantity, calculated_co2, activity_date, notes, recorded_by, created_at)
VALUES
-- GreenCorp Manufacturing (org 1) - Ravi (user 2)
(1,  1, 1, 5000,  4100.0,  '2025-01-15', 'January factory electricity',         2, NOW()),
(2,  1, 2, 300,   612.0,   '2025-01-20', 'January heating - natural gas',        2, NOW()),
(3,  1, 3, 800,   2144.0,  '2025-02-10', 'February diesel for forklifts',        2, NOW()),
(4,  1, 1, 5200,  4264.0,  '2025-02-15', 'February factory electricity',         2, NOW()),
(5,  1, 4, 450,   1039.5,  '2025-03-05', 'March petrol for company vehicles',    6, NOW()),
(6,  1, 2, 280,   571.2,   '2025-03-18', 'March heating - natural gas',          2, NOW()),
(7,  1, 1, 4800,  3936.0,  '2025-04-15', 'April factory electricity',            2, NOW()),
(8,  1, 3, 600,   1608.0,  '2025-04-22', 'April diesel for delivery trucks',     6, NOW()),
(9,  1, 1, 5100,  4182.0,  '2025-05-15', 'May factory electricity',              2, NOW()),
(10, 1, 4, 520,   1201.2,  '2025-05-28', 'May petrol - field team vehicles',     6, NOW()),
(11, 1, 1, 5300,  4346.0,  '2025-06-15', 'June factory electricity',             2, NOW()),
(12, 1, 2, 200,   408.0,   '2025-06-25', 'June minimal heating',                 2, NOW()),

-- EcoTech Solutions (org 2) - Priya (user 3)
(13, 2, 1, 1200,  984.0,   '2025-01-10', 'January office electricity',           3, NOW()),
(14, 2, 5, 2000,  510.0,   '2025-02-05', 'Team travel to Bengaluru conference',  3, NOW()),
(15, 2, 1, 1100,  902.0,   '2025-03-10', 'March office electricity',             3, NOW()),
(16, 2, 4, 150,   346.5,   '2025-03-20', 'Client visit - petrol reimbursement',  3, NOW()),
(17, 2, 1, 1300,  1066.0,  '2025-04-10', 'April office electricity',             3, NOW()),
(18, 2, 5, 3500,  892.5,   '2025-05-12', 'Offshore client meeting - air travel', 3, NOW()),
(19, 2, 1, 1150,  943.0,   '2025-06-10', 'June office electricity',              3, NOW()),

-- BlueSky Airlines (org 3) - James (user 4)
(20, 3, 3, 50000, 134000.0,'2025-01-31', 'January jet fuel consumption',         4, NOW()),
(21, 3, 3, 48000, 128640.0,'2025-02-28', 'February jet fuel consumption',        4, NOW()),
(22, 3, 1, 8000,  6560.0,  '2025-03-15', 'Airport terminal electricity - Q1',    4, NOW()),
(23, 3, 3, 52000, 139360.0,'2025-03-31', 'March jet fuel consumption',           4, NOW()),
(24, 3, 3, 49000, 131320.0,'2025-04-30', 'April jet fuel consumption',           4, NOW()),
(25, 3, 1, 9000,  7380.0,  '2025-06-15', 'Airport terminal electricity - Q2',    4, NOW()),

-- ClearWater Industries (org 4) - Sarah (user 5)
(26, 4, 2, 1500,  3060.0,  '2025-01-25', 'January process heating - gas',        5, NOW()),
(27, 4, 1, 3000,  2460.0,  '2025-02-20', 'February plant electricity',           5, NOW()),
(28, 4, 3, 1200,  3216.0,  '2025-03-10', 'March diesel for plant machinery',     5, NOW()),
(29, 4, 2, 1400,  2856.0,  '2025-04-25', 'April process heating - gas',          5, NOW()),
(30, 4, 1, 3200,  2624.0,  '2025-05-20', 'May plant electricity',                5, NOW());

-- Footprint Reports
-- total_emissions are pre-summed from activities above per org per period
INSERT IGNORE INTO footprint_reports
    (id, organization_id, period_start, period_end, total_emissions, generated_at, status)
VALUES
-- GreenCorp Q1 (Jan-Mar 2025): activities 1+2+3+4+5+6 = 4100+612+2144+4264+1039.5+571.2 = 12730.7
(1, 1, '2025-01-01', '2025-03-31', 12730.7,  NOW(), 'FINAL'),
-- GreenCorp Q2 (Apr-Jun 2025): activities 7+8+9+10+11+12 = 4182+1608+4182+1201.2+4346+408 = 15927.2
(2, 1, '2025-04-01', '2025-06-30', 15927.2,  NOW(), 'DRAFT'),
-- EcoTech H1 2025: activities 13-19 = 984+510+902+346.5+1066+892.5+943 = 5644.0
(3, 2, '2025-01-01', '2025-06-30', 5644.0,   NOW(), 'FINAL'),
-- BlueSky Q1 2025: activities 20+21+22+23 = 134000+128640+6560+139360 = 408560
(4, 3, '2025-01-01', '2025-03-31', 408560.0, NOW(), 'FINAL'),
-- ClearWater H1 2025: activities 26-30 = 3060+2460+3216+2856+2624 = 14216
(5, 4, '2025-01-01', '2025-06-30', 14216.0,  NOW(), 'DRAFT');
