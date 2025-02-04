-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 04, 2025 at 07:41 PM
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
(1, 'Pharm');

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
(19, 'aaaaaa', 13),
(20, 'aaaaaa', 14),
(21, 'ss', 15);

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
(13, 'aaaa', 'sss', 1, '/uploads/coursesimages/a86282a6-596d-478a-a9cf-dae1ebabc3f0_backiee-98927.jpg'),
(14, 'aaaa', 'sss', 1, '/uploads/coursesimages/9f185503-81dc-4cef-86b5-86767a31a20e_backiee-98927.jpg'),
(15, 'ss', 'ss', 1, '/uploads/coursesimages/f3e5944f-820c-48f1-bf7d-835c15875a7e_backiee-96330.jpg'),
(16, 'new', 'new', 1, '/uploads/coursesimages/7dfff71d-4340-40f2-bb60-8bfa089a4b37_WhatsApp Image 2024-09-05 at 15.18.01_94aa6faa.jpg');

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
  `role` varchar(255) NOT NULL,
  `accepted` bit(1) NOT NULL,
  `approved` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `phone_number`, `email`, `user_document_id`, `password`, `role`, `accepted`, `approved`) VALUES
(57, 'mahmoud', 'hossam', '01001762250', 'mahmoud584@gmail.com', 106, '$2a$10$Hv3sFT1hrmBSSvDGeLp0yudQdDairHMqbVxyxH7CqvH7JP3ZhKk/a', 'USER', b'0', b'1');

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
(89, '4e496f27-6657-495e-a25f-f2c72ab20fc6_2025.pdf', 'e0b208af-5e85-48e6-819f-063967cd1352_2025.pdf', '17a27a0a-a350-4e4e-bd96-72513679c610_2025.pdf', 'f2b635b2-8d6b-47f6-bd3a-9304adb8df0a_2025.pdf', '7a43012d-36c2-4919-a3b9-ec4f731165c7_2025.pdf'),
(96, '7a596314-7d61-4ca4-9dcc-0c583bbca8bc_2025.pdf', '7ba057e0-2e71-4076-b030-54454319ced3_2025.pdf', '6d8ddd97-2f7d-4002-95ba-a606db3653a1_2025.pdf', 'f4842940-9744-4221-b646-349a6d49c43b_2025.pdf', 'b18a8a44-5b62-4c40-8cfe-dd835c46e911_2025.pdf'),
(97, '95b8731b-aa01-40c4-b3ea-4d67c71661fa_2025.pdf', '52717d9e-5995-44c0-99e5-02dc89fc0e3c_2025.pdf', '87dcaf84-e7c7-46e8-98b1-af22694c64da_2025.pdf', '8d173730-65cc-4dbf-908b-592be22ad103_2025.pdf', '78d7b598-3ae1-48ab-828a-cff41efb13af_2025.pdf'),
(98, 'a9ee509f-ea6f-4318-8858-bbffca2fcc14_2025.pdf', '9b564202-1e01-4b6b-9fe8-64a51099cf09_2025.pdf', 'd934d63b-44d3-4387-85f3-8dcf69005a40_2025.pdf', '1c73ec4f-4b91-4b77-bfc4-7d5b1cc587e0_2025.pdf', '562ae43f-249c-478c-8e78-f53166c56e65_2025.pdf'),
(102, 'c1434846-711d-41af-8f14-22004e6197eb_2025.pdf', 'be2880a4-fc10-4e96-8468-144c420ee52c_2025.pdf', 'ac96a92e-e74b-45e7-91b8-cd0bc6d102d8_2025.pdf', 'c7c9fef4-d87b-4a00-84e7-f2aa691a0238_2025.pdf', '90924475-a0b2-4932-98c6-a697ec4e3fe0_2025.pdf'),
(103, '8e1ec5c3-014b-43c4-97d2-f9e35890451c_2025.pdf', '521fb9c5-1230-4e31-9b46-92b1b7e41ae8_2025.pdf', '90632a6b-5447-4c77-ab97-900a3bdeb4e5_2025.pdf', '8a2f0b73-3321-425b-85e4-3b0f2a184a63_2025.pdf', '91b7a405-a765-4f29-9b2c-d6cffb0e24a7_2025.pdf'),
(106, '92e0e52a-377d-4ace-a3fe-a57fca51854c_2025.pdf', '4a1c98e8-5237-46ad-9ed1-48fd8fb47dc5_2025.pdf', 'e1f79e7a-e5ec-4c26-8a37-50d952e7bebe_2025.pdf', '7c08f477-bfc2-46f6-a65e-72d13d3717d5_2025.pdf', 'cd2d5001-68ca-4770-b45e-515c81d1b861_2025.pdf');

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `chapter`
--
ALTER TABLE `chapter`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `user_documents`
--
ALTER TABLE `user_documents`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT for table `video`
--
ALTER TABLE `video`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
