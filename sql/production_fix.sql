-- SQL script for creating missing tables in production environment
-- Note: using utf8mb4_general_ci collation instead of utf8mb4_0900_ai_ci for wider compatibility

-- Create Therapists table if it doesn't exist
CREATE TABLE IF NOT EXISTS therapists (
    therapist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    specialization TEXT,
    license_number VARCHAR(255),
    bio TEXT,
    years_of_experience INT,
    profile_picture_url VARCHAR(255),
    verification_documents_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) COLLATE=utf8mb4_general_ci;

-- Create SupportGroups table if it doesn't exist
CREATE TABLE IF NOT EXISTS supportgroups (
    group_id INT AUTO_INCREMENT PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) COLLATE=utf8mb4_general_ci;

-- Create User_SupportGroup_Membership table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_supportgroup_membership (
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES supportgroups(group_id) ON DELETE CASCADE
) COLLATE=utf8mb4_general_ci;

-- Create Appointments table if it doesn't exist
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    therapist_id INT NOT NULL,
    appointment_time DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    meeting_link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (therapist_id) REFERENCES therapists(therapist_id) ON DELETE CASCADE
) COLLATE=utf8mb4_general_ci;

-- Create Posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    group_id INT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    post_anonymously BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES supportgroups(group_id) ON DELETE SET NULL
) COLLATE=utf8mb4_general_ci;

-- Create Comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_comment_id INT,
    content TEXT NOT NULL,
    comment_anonymously BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE
) COLLATE=utf8mb4_general_ci;

-- Create Likes table if it doesn't exist
CREATE TABLE IF NOT EXISTS likes (
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
) COLLATE=utf8mb4_general_ci;

-- Create AIChatSessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS aichatsessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) COLLATE=utf8mb4_general_ci;

-- Create AIChatMessages table if it doesn't exist
CREATE TABLE IF NOT EXISTS aichatmessages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    sender ENUM('user', 'ai') NOT NULL,
    message_text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES aichatsessions(session_id) ON DELETE CASCADE
) COLLATE=utf8mb4_general_ci;
