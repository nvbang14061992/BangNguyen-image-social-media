
-- database
CREATE DATABASE IF NOT EXISTS image_social_media; 
USE image_social_media;

-- Drop tables if they exist (to avoid duplication errors during testing)
DROP TABLE IF EXISTS Saved_images;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Images;
DROP TABLE IF EXISTS Users;

-- Users table
CREATE TABLE Users (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255),
    `fullName` VARCHAR(255),
    `age` INT,
    `avatar_path` VARCHAR(255),
    `description` VARCHAR(500),

    -- default
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Images table
CREATE TABLE Images (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255),
    `pathToImage` VARCHAR(255) NOT NULL,
    `description` VARCHAR(500),
    `userId` INT,
    FOREIGN KEY (`userId`) REFERENCES Users(`id`),

    -- default
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE Comments (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `userId` INT,
    `imageId` INT,
    `content` VARCHAR(1000) NOT NULL,
    FOREIGN KEY (`userId`) REFERENCES Users(`id`),
    FOREIGN KEY (`imageId`) REFERENCES Images(`id`),

    -- default
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Saved_images table
CREATE TABLE Saved_images (
    `userId` INT,
    `imageId` INT,
    PRIMARY KEY (userId, imageId),
    FOREIGN KEY (`userId`) REFERENCES Users(`id`),
    FOREIGN KEY (`imageId`) REFERENCES Images(`id`),

    -- default
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
