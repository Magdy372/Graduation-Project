-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Feb 04, 2025 at 07:27 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `grad`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` bigint(20) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `first_name`, `last_name`, `email`, `password`, `role`) VALUES
(1, 'John', 'Doe', 'admin@g', '$2a$12$SETYmSWaOvB8bhtTMQrGGe4swf2NVHT2sLz9559h3YuFrW.p2MHP.', 'Admin');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(13, 'aaaaaaaa'),
(31, 'aaa');

-- --------------------------------------------------------

--
-- Table structure for table `chapter`
--

CREATE TABLE `chapter` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `course_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chapter`
--

INSERT INTO `chapter` (`id`, `title`, `course_id`) VALUES
(36, 'a7', 16),
(38, 'aaa', 18);

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`id`, `name`, `description`, `category_id`, `image_url`) VALUES
(16, 'course 1', 'coura 1 ds', 13, '/uploads/coursesimages/947cfa7b-2729-4337-a7f8-90ec292d4203_WIN_20230218_16_42_23_Pro.jpg'),
(18, 'course 2', 'aa', 13, '/uploads/coursesimages/4f397732-2b07-4fa5-a8de-75ba011d829d_1955103.webp');

-- --------------------------------------------------------

--
-- Table structure for table `enrollment`
--

CREATE TABLE `enrollment` (
  `id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `enrollment_date` datetime(6) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollment`
--

INSERT INTO `enrollment` (`id`, `course_id`, `enrollment_date`, `user_id`) VALUES
(1, 1, '2025-01-29 01:38:57.000000', 25),
(2, 2, '2025-01-29 01:46:40.000000', 25),
(3, 4, '2025-01-29 01:50:59.000000', 25);

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `enrollment_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` double NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `price`, `quantity`) VALUES
(5, 'Laptop', 'High-performance laptop', 1200, 10);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `email` varchar(255) NOT NULL,
  `user_document_id` bigint(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `phone_number`, `email`, `user_document_id`, `password`, `role`) VALUES
(35, 'John', 'Doe', '1234567890', 'o@gmail.com', 84, '$2a$12$SETYmSWaOvB8bhtTMQrGGe4swf2NVHT2sLz9559h3YuFrW.p2MHP.', 'USER'),
(38, 'oma', 'aa', '0102393939', 'aa@gmail.com', 87, '$2a$10$pdou6.V/JXa4CyKwZ1DHHuyyjAKMeUPRSenom4xgVCp00MnyxyQbe', 'USER'),
(39, 'Omar', 'Salah', '010003138219', 'mm@gmail.com', 88, '$2a$10$Frhk6A7UQFPq96nPgIaWFOqM8NiUeCPq/wjZadqei7PI0Gp3jsC2K', 'USER'),
(42, 'Omar', 'Salah', '01003138219', 'admin@gmail.com', 91, '$2a$10$nSsV8nnVMGELVQFb.dIcRu3kkr8n4OrXUYEyOoJCmYv6f6PzFiReG', 'USER'),
(43, 'Omar', 'Salah', '01003138219', 'admin22@gmail.com', 92, '$2a$10$RdlLyxgKDjts.w6xlQUG4ufmQJD.m3q3bz/cWBoQ6Rlh8WKDhU21a', 'USER'),
(50, 'Omar', 'Salah', '010003138219', 'admin@g', 99, '$2a$10$2ap6js1LzYAPBlwWBxm4N.s.G8ec56Xw4fVtYL67Ezv7sg2p0zTKa', 'USER'),
(69, 'Omar', 'Salah', '010003138219', 'admin22222@gmail.com', 118, '$2a$10$5BK2UrIBK.fmUgRF5rAhFOvnPIxciomUoPpHMHXgxDkRCy0gc841a', 'USER'),
(70, 'Omar', 'Salah', '010003138219', 'admin123@gmail.com', 119, '$2a$10$aKZjsnJutsmwghbO6a8xtuLSm7O6rGSyek6IOG10/iQMVJyiowYom', 'USER');

-- --------------------------------------------------------

--
-- Table structure for table `user_documents`
--

CREATE TABLE `user_documents` (
  `id` bigint(20) NOT NULL,
  `license_file` varchar(255) DEFAULT NULL,
  `profession_license_file` varchar(255) DEFAULT NULL,
  `syndicate_card_file` varchar(255) DEFAULT NULL,
  `commercial_register_file` varchar(255) DEFAULT NULL,
  `tax_card_file` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_documents`
--

INSERT INTO `user_documents` (`id`, `license_file`, `profession_license_file`, `syndicate_card_file`, `commercial_register_file`, `tax_card_file`) VALUES
(84, 'file1.pdf', 'file2.pdf', 'file3.pdf', 'file4.pdf', 'file5.pdf'),
(85, 'a4a23ec3-bb8c-4c5f-98ee-fa7007360408_Lecture 1_ Mobile Programming_F24.pdf', '9c960bcc-6a6f-4fd0-8d18-9d86fdb3290c_Lecture 1_ Mobile Programming_F24.pdf', 'd8891be5-2f94-4c65-998a-d509cd458b1d_Lecture 1_ Mobile Programming_F24.pdf', '5d1cff85-180f-4c54-8e88-a67d94b188a6_Lecture 1_ Mobile Programming_F24.pdf', '92dec8b0-805b-42d7-a72f-54b7f0abe840_Lecture 1_ Mobile Programming_F24.pdf'),
(87, '00e5d05b-db4b-4990-8870-6d75e06878c9_Lecture 1_ Mobile Programming_F24.pdf', '4c4e44a8-f06b-43d7-9d95-58d0ce461ac0_Lecture 1_ Mobile Programming_F24.pdf', '04c0de54-aebc-4689-8e4d-67cb42e3cef6_Lecture 1_ Mobile Programming_F24.pdf', 'bdb23df6-8721-49b1-a963-628ca3e6b340_Lecture 1_ Mobile Programming_F24.pdf', 'cdd22a84-a393-4250-b47c-5961a4032a33_Lecture 1_ Mobile Programming_F24.pdf'),
(88, '96f228d2-787d-437d-91bd-ed6742547126_Lecture 1_ Mobile Programming_F24.pdf', 'a0b2cc52-ff15-4563-96da-e7c97a4cc79c_Lecture 1_ Mobile Programming_F24.pdf', '4ea66ac9-8064-4465-a09f-c82a43bfba5a_Lecture 1_ Mobile Programming_F24.pdf', '0abada68-dcdf-414a-a533-eef8714bb0e2_Lecture 1_ Mobile Programming_F24.pdf', '3c7810e6-c44e-4266-9cb9-18f29c693648_Lecture 1_ Mobile Programming_F24.pdf'),
(91, '959ab672-7fd1-4145-af29-698814f87404_Lecture 1_ Mobile Programming_F24.pdf', '1274990a-9aa0-449b-b75e-edec488b7010_Lecture 1_ Mobile Programming_F24.pdf', 'cd954e3e-d7db-4387-aab0-c518d78bbf49_Lecture 1_ Mobile Programming_F24.pdf', '62a77bf9-1fd6-4c09-93f3-fc045bc02627_Lecture 1_ Mobile Programming_F24.pdf', '89027b57-c462-494d-969c-a5abe72825c6_Lecture 1_ Mobile Programming_F24.pdf'),
(92, '5daf9de3-3432-4b66-bb20-3a02443113f5_Lecture 1_ Mobile Programming_F24.pdf', '65112171-ccd9-4297-8460-ec8c783bc21b_Lecture 1_ Mobile Programming_F24.pdf', '5211e802-78ab-432f-8eed-d6191a7e6ab0_Lecture 1_ Mobile Programming_F24.pdf', 'bdb27ec2-9c92-49f6-97c5-03468386f4dc_Lecture 1_ Mobile Programming_F24.pdf', '3369821a-b67d-4257-85ba-fbdcd0cec515_Lecture 1_ Mobile Programming_F24.pdf'),
(99, 'beb3b956-af25-44da-8c77-2e8bb096690c_Lecture 1_ Mobile Programming_F24.pdf', 'd9c5a9c4-0cc5-461a-86ab-5380d80f3c97_Lecture 1_ Mobile Programming_F24.pdf', 'f07f7f92-e082-4844-a4cf-f8df9a83b873_Lecture 1_ Mobile Programming_F24.pdf', 'feb5d284-9792-49b2-95eb-925087aa5553_Lecture 1_ Mobile Programming_F24.pdf', '74c6bb2d-fdb1-41a6-80d5-23a3dc1bc1eb_Lecture 1_ Mobile Programming_F24.pdf'),
(118, '368482ab-03a3-4099-aeb9-c1d7c2258a99_Lecture 1_ Mobile Programming_F24.pdf', '23b46b1d-9156-4c7b-afb9-881129b16ed3_Lecture 1_ Mobile Programming_F24.pdf', 'b7192be3-45c7-404e-9b80-d1919f2c9d38_Lecture 1_ Mobile Programming_F24.pdf', '66495f25-6411-48d5-95c0-cc4e6d498a1c_Lecture 1_ Mobile Programming_F24.pdf', 'b9305090-a23c-4329-a18b-1a5992d743d3_Lecture 1_ Mobile Programming_F24.pdf'),
(119, '784759bb-ad12-46c1-aa45-ef8b42a69b31_Lecture 1_ Mobile Programming_F24.pdf', 'aaa97af0-405e-4215-bc02-d124d97aed30_Lecture 1_ Mobile Programming_F24.pdf', '9e275b9e-a32b-44a8-8065-8314847ad52b_Lecture 1_ Mobile Programming_F24.pdf', '7e1681d4-4b17-43f3-8a9d-df63c96fa390_Lecture 1_ Mobile Programming_F24.pdf', 'd2115311-bd39-48ad-a3a9-109f8b84e988_Lecture 1_ Mobile Programming_F24.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `video`
--

CREATE TABLE `video` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `video_path` varchar(255) NOT NULL,
  `chapter_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `video`
--

INSERT INTO `video` (`id`, `title`, `video_path`, `chapter_id`) VALUES
(31, 'car', '/uploads/videos/4784691a-066b-4183-a94a-a83b1c8afcf3_1955103.webp', 38);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chapter`
--
ALTER TABLE `chapter`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_course_id` (`course_id`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_category_id` (`category_id`);

--
-- Indexes for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_course` (`user_id`,`course_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `user_document_id` (`user_document_id`);

--
-- Indexes for table `user_documents`
--
ALTER TABLE `user_documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `video`
--
ALTER TABLE `video`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_chapter_id` (`chapter_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `chapter`
--
ALTER TABLE `chapter`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `user_documents`
--
ALTER TABLE `user_documents`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;

--
-- AUTO_INCREMENT for table `video`
--
ALTER TABLE `video`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chapter`
--
ALTER TABLE `chapter`
  ADD CONSTRAINT `fk_course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `fk_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_document` FOREIGN KEY (`user_document_id`) REFERENCES `user_documents` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `video`
--
ALTER TABLE `video`
  ADD CONSTRAINT `fk_chapter_id` FOREIGN KEY (`chapter_id`) REFERENCES `chapter` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
