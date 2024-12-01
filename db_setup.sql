CREATE DATABASE my_health;

USE my_health;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(15)
);

CREATE TABLE hospitals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    address VARCHAR(255)
);