-- Personal Finance Tracker Database Schema for MySQL
-- This would be used in Laravel migrations

-- Users table (Laravel default with some customizations)
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- Categories table
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#3b82f6', -- Hex color code
    icon VARCHAR(255) NULL, -- Icon name or class
    is_default BOOLEAN DEFAULT FALSE, -- System-provided categories
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_type (type),
    INDEX idx_name (name)
);

-- Transactions table
CREATE TABLE transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    
    INDEX idx_user_id (user_id),
    INDEX idx_category_id (category_id),
    INDEX idx_type (type),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_user_date (user_id, transaction_date)
);

-- Budgets table
CREATE TABLE budgets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    budget_limit DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_category (user_id, category_id),
    INDEX idx_user_id (user_id)
);

-- Personal access tokens table (Laravel Sanctum)
CREATE TABLE personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_tokenable (tokenable_type, tokenable_id)
);

-- Insert default categories
INSERT INTO categories (name, type, color, is_default, created_at, updated_at) VALUES
-- Income categories
('Salary', 'income', '#22c55e', TRUE, NOW(), NOW()),
('Freelance', 'income', '#16a34a', TRUE, NOW(), NOW()),
('Investment', 'income', '#15803d', TRUE, NOW(), NOW()),
('Business', 'income', '#166534', TRUE, NOW(), NOW()),
('Other Income', 'income', '#14532d', TRUE, NOW(), NOW()),

-- Expense categories
('Food & Dining', 'expense', '#ef4444', TRUE, NOW(), NOW()),
('Transportation', 'expense', '#f97316', TRUE, NOW(), NOW()),
('Shopping', 'expense', '#eab308', TRUE, NOW(), NOW()),
('Entertainment', 'expense', '#a855f7', TRUE, NOW(), NOW()),
('Bills & Utilities', 'expense', '#3b82f6', TRUE, NOW(), NOW()),
('Healthcare', 'expense', '#06b6d4', TRUE, NOW(), NOW()),
('Education', 'expense', '#8b5cf6', TRUE, NOW(), NOW()),
('Travel', 'expense', '#ec4899', TRUE, NOW(), NOW()),
('Insurance', 'expense', '#84cc16', TRUE, NOW(), NOW()),
('Other Expenses', 'expense', '#6b7280', TRUE, NOW(), NOW());

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_type_date ON transactions(user_id, type, transaction_date);
CREATE INDEX idx_transactions_amount ON transactions(amount);

-- Views for common queries
CREATE VIEW user_monthly_stats AS
SELECT 
    t.user_id,
    YEAR(t.transaction_date) as year,
    MONTH(t.transaction_date) as month,
    t.type,
    SUM(t.amount) as total_amount,
    COUNT(*) as transaction_count
FROM transactions t
GROUP BY t.user_id, YEAR(t.transaction_date), MONTH(t.transaction_date), t.type;

CREATE VIEW user_category_stats AS
SELECT 
    t.user_id,
    t.category_id,
    c.name as category_name,
    c.color as category_color,
    t.type,
    SUM(t.amount) as total_amount,
    COUNT(*) as transaction_count
FROM transactions t
JOIN categories c ON t.category_id = c.id
GROUP BY t.user_id, t.category_id, c.name, c.color, t.type;