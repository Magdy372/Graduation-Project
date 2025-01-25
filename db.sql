-- Create the user_documents table
CREATE TABLE user_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, -- Primary key
    license_file VARCHAR(255),            -- License file path
    profession_license_file VARCHAR(255), -- Profession license file path
    syndicate_card_file VARCHAR(255),     -- Syndicate card file path
    commercial_register_file VARCHAR(255),-- Commercial register file path
    tax_card_file VARCHAR(255)            -- Tax card file path
);

-- Create the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,    -- Primary key
    first_name VARCHAR(255) NOT NULL,     -- First name
    last_name VARCHAR(255) NOT NULL,      -- Last name
    phone_number VARCHAR(255) NOT NULL,   -- Phone number
    email VARCHAR(255) NOT NULL UNIQUE,   -- Email (unique)
    user_document_id BIGINT UNIQUE,       -- Foreign key to user_documents table
    CONSTRAINT fk_user_document           -- Foreign key constraint
        FOREIGN KEY (user_document_id)
        REFERENCES user_documents(id)
        ON DELETE CASCADE                 -- Cascade delete
);