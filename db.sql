-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: May 05, 2025 at 01:11 AM
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
  `role` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `candidate` varchar(255) NOT NULL,
  `governorate` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `first_name`, `last_name`, `email`, `password`, `role`, `position`, `candidate`, `governorate`) VALUES
(1, 'John', 'Doe', 'admin@gmail.com', '$2a$12$SETYmSWaOvB8bhtTMQrGGe4swf2NVHT2sLz9559h3YuFrW.p2MHP.', 'Admin', 'مدير', 'الصيدلة', 'القاهرة'),
(67, 'omar', 'abdelmonem', 'os313030@gmail.com', '$2a$12$SETYmSWaOvB8bhtTMQrGGe4swf2NVHT2sLz9559h3YuFrW.p2MHP.', 'Admin', 'موظف', 'الصيدلة', 'الإسكندرية');

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
(20, 'Pharmacy');

-- --------------------------------------------------------

--
-- Table structure for table `certificate`
--

CREATE TABLE `certificate` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `issue_date` datetime NOT NULL,
  `certificate_number` varchar(255) NOT NULL,
  `final_score` double NOT NULL,
  `passed` bit(1) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certificate`
--

INSERT INTO `certificate` (`id`, `user_id`, `course_id`, `issue_date`, `certificate_number`, `final_score`, `passed`, `status`) VALUES
(2, 125, 31, '2025-05-05 02:08:48', 'CERT-5BE62386', 100, b'1', 'PENDING');

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
(43, 'ch1', 31),
(44, 'ch2', 31);

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` bigint(20) NOT NULL,
  `mess` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`id`, `mess`, `user_id`) VALUES
(1, '\nالسلام عليكم اريد التواصل', 114);

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
(31, 'Pathfinder', 'Pathfinder', 20, '/uploads/coursesimages/099d933d-e752-44a2-bf77-802ec66ede2e_WhatsApp Image 2025-04-27 at 03.22.20_401ab7fc.jpg');

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
(32, 31, '2025-05-04 19:03:03.000000', 125);

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` bigint(20) NOT NULL,
  `comments` varchar(1000) DEFAULT NULL,
  `content_quality_rating` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `ease_of_use_rating` int(11) NOT NULL,
  `overall_rating` int(11) NOT NULL,
  `support_satisfaction_rating` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `comments`, `content_quality_rating`, `created_at`, `ease_of_use_rating`, `overall_rating`, `support_satisfaction_rating`, `user_id`) VALUES
(1, 'Perfect', 5, '2025-02-10 22:47:16.000000', 5, 5, 5, 114),
(5, 'good\n', 3, '2025-04-05 04:44:12.000000', 3, 3, 3, 114),
(6, 'good', 5, '2025-04-05 12:55:33.000000', 5, 5, 5, 114),
(7, 'dkdd', 4, '2025-04-30 18:57:20.000000', 4, 4, 4, 114),
(8, 's;d', 4, '2025-04-30 18:57:33.000000', 4, 3, 4, 114);

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

CREATE TABLE `question` (
  `question_type` varchar(31) NOT NULL,
  `id` bigint(20) NOT NULL,
  `grade` double NOT NULL,
  `order_num` int(11) NOT NULL,
  `text` varchar(255) NOT NULL,
  `correct_answer` varchar(255) DEFAULT NULL,
  `options` varchar(255) DEFAULT NULL,
  `quiz_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`question_type`, `id`, `grade`, `order_num`, `text`, `correct_answer`, `options`, `quiz_id`) VALUES
('MCQ', 39, 5, 1, 'MCQ', '1', 'X,C,G,H', 24),
('TRUE_FALSE', 40, 1, 1, 'w', '1', NULL, 25);

-- --------------------------------------------------------

--
-- Table structure for table `quiz`
--

CREATE TABLE `quiz` (
  `id` bigint(20) NOT NULL,
  `time_limit` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `total_grade` double DEFAULT NULL,
  `chapter_id` bigint(20) NOT NULL,
  `max_attempts` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz`
--

INSERT INTO `quiz` (`id`, `time_limit`, `title`, `total_grade`, `chapter_id`, `max_attempts`) VALUES
(24, 30, 'quiz 1', 5, 43, 8),
(25, 30, 'www', 1, 44, 2);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_attempts`
--

CREATE TABLE `quiz_attempts` (
  `id` bigint(20) NOT NULL,
  `attempt_date` datetime(6) DEFAULT NULL,
  `attempt_number` int(11) DEFAULT NULL,
  `passed` bit(1) DEFAULT NULL,
  `score` double DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `quiz_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_attempts`
--

INSERT INTO `quiz_attempts` (`id`, `attempt_date`, `attempt_number`, `passed`, `score`, `user_id`, `quiz_id`) VALUES
(174, '2025-05-04 18:10:40.000000', 1, b'1', 100, 125, 24),
(175, '2025-05-04 18:16:49.000000', 2, b'0', 0, 125, 24),
(176, '2025-05-04 18:21:56.000000', 3, b'0', 0, 125, 24),
(177, '2025-05-04 18:26:23.000000', 4, b'1', 100, 125, 24),
(178, '2025-05-04 18:35:21.000000', 5, b'1', 100, 125, 24),
(179, '2025-05-04 18:44:35.000000', 6, b'1', 100, 125, 24),
(180, '2025-05-04 19:32:22.000000', 7, b'1', 100, 125, 24),
(181, '2025-05-05 01:20:24.000000', 8, b'1', 100, 125, 24),
(182, '2025-05-05 02:08:33.000000', 1, b'1', 100, 125, 25);

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
  `approved` bit(1) DEFAULT NULL,
  `governorate` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `phone_number`, `email`, `user_document_id`, `password`, `role`, `approved`, `governorate`, `title`) VALUES
(113, 'ahmed ', 'khaled', '01001762250', 'mahmoud2107860@miuegypt.edu.eg', 163, '$2a$10$bHbWPaMPPPJrZQ1YWjKR7.bCxj8r.3ps5KdbhU5DUoGT608Dr4Bya', 'USER', b'1', 'سوهاج', 'دكتور'),
(114, 'mahmoud', 'hossam', '01001762250', 'mahmoudhousam584@gmail.com', 164, '$2a$10$QTKa9V6Xx5/lqz0oxCAFLuIdw6D54A0hfD/Z.u8SfknyW1Kn35sei', 'USER', b'1', 'الأقصر', 'دكتور'),
(115, 'ziad ', 'ahmed', '01001762250', 'mahmoudhousam5844@gmail.com', 165, '$2a$10$nSCMkcS4tCBxsmfV/hErvOpR7GZIzq2yTr3F4LC.XVWYGud.EZ7Cq', 'USER', b'1', 'القليوبية', 'دكتور'),
(117, 'ali', 'mostafa', '01001762250', 'mahmoudhouqsam584@gmail.com', 167, '$2a$10$YHAf098KQEchmuYS.lHBHeZJLeJlc/jw6giGOZ8yUU2wi1jnsNNcm', 'USER', b'1', 'القاهرة', 'دكتور'),
(120, 'rana', 'abulkassem', '01001762250', 'T-622e5@ischoolteams.com', 170, '$2a$10$FPkR8Qe2EMgkDXQvmDW0.egXrpKn/xCwN0NXBKZN/V8yFB4AjlvEa', 'USER', b'1', 'شمال سيناء', 'دكتور'),
(123, 'mohamed', 'magdy', '01022907282', 'm.m123@gmail.com', 173, '$2a$10$KN.g7pQJf/8zq3FAhC1Jben3aUZMwenJjXpEPkfQ2woW7h.t5ocTG', 'USER', b'0', 'جنوب سيناء', 'دكتور'),
(124, 'mahmoud', 'hossam', '01001762250', 'Mahmoudhousam58@gmail.com', 174, '$2a$10$K.AoImP9xZPfXpoklFcAOezDVX56QTLYnK4aFvdNvr97uavEURA.W', 'USER', b'1', 'القاهرة', 'صيدلي'),
(125, 'Omar', 'Omar', '01000313821', 'os606030@gmail.com', 175, '$2a$10$YI4VM3ZbBrb1YnajRhQfXOLSyC5cKAnFQFn2FjDcEbQidRE.nI1a2', 'USER', b'1', 'الإسكندرية', 'صيدلي');

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
(106, '92e0e52a-377d-4ace-a3fe-a57fca51854c_2025.pdf', '4a1c98e8-5237-46ad-9ed1-48fd8fb47dc5_2025.pdf', 'e1f79e7a-e5ec-4c26-8a37-50d952e7bebe_2025.pdf', '7c08f477-bfc2-46f6-a65e-72d13d3717d5_2025.pdf', 'cd2d5001-68ca-4770-b45e-515c81d1b861_2025.pdf'),
(107, 'bd244db0-cfbd-41de-8b23-68bb193fd859_Lecture 1_ Mobile Programming_F24.pdf', '1ba2f78e-4a91-4f10-b65a-e0420e63311a_Lecture 1_ Mobile Programming_F24.pdf', '21a20226-883a-4b40-a337-ff36a0a29589_Lecture 1_ Mobile Programming_F24.pdf', '6e5b911d-a383-4b74-b523-4ed86b23a91d_Lecture 1_ Mobile Programming_F24.pdf', '5f14b50d-f056-454c-b5d7-3f4d96d082fa_Lecture 1_ Mobile Programming_F24.pdf'),
(108, '80c6d2f8-7f8b-4bf0-9e11-68c5fa25032f_2025.pdf', '1c9f9533-07d2-4f5d-b4e5-c161cc9080b2_2025.pdf', '79c7f684-2831-4b9b-a864-d97db98f5fa1_2025.pdf', '0db60093-5ad5-4c9c-a505-824e4f87d4a1_2025.pdf', 'b87c88be-5518-4b2a-b346-3ffa77acb305_2025.pdf'),
(109, '43a8ec92-7147-4cf7-b875-2e767b6808cb_q.png', '9f9ae685-b6f7-491c-8835-d373af08d8e0_q.png', '2e97630d-025d-4110-839c-adabe101b1bd_q.png', '580b38b3-09ba-4301-aa48-9effe92a3951_q.png', '47c0ea8e-5142-4197-b80f-d02cb90f4e06_q.png'),
(110, '2eb3e9cb-0841-41e2-8698-20a4e9029d79_2025.pdf', '994e2182-92e0-479d-9f18-60b3849728a5_2025.pdf', 'eff6a95e-558e-41ed-94ba-bce44916154e_2025.pdf', '8439a706-a1b9-43dc-b419-91fe86c8bb39_2025.pdf', '2e701324-0c36-49bf-a653-b09b30111fae_2025.pdf'),
(111, '4a04c757-7d74-41d5-b3ef-638183291da6_2025.pdf', '5c415d4c-054c-429e-8e11-2772a6e578cc_2025.pdf', '372a55ef-fda4-438a-bbaa-77921956d0e8_2025.pdf', '320bd3fd-5558-490b-a1be-8c0813d36c57_2025.pdf', 'bb4ca3eb-d00d-4ec6-b58e-fd6606452c2c_2025.pdf'),
(123, 'a3fe26bb-c29e-4711-b6d5-bf45fc017988_2025.pdf', 'ec02c75d-4c93-4ffe-afcb-7e705d59001a_2025.pdf', 'f8a3b69c-8346-408a-a27e-e841ea490e96_2025.pdf', '62677669-19e2-44e0-893b-6dfadf5048ef_2025.pdf', 'b1daff53-d2ac-4b8a-841e-ee46dbd2b4af_2025.pdf'),
(159, '2ca864fb-d1a1-477b-902b-cb5df3a121e3_2025.pdf', 'f39e41a2-940c-47f9-8396-ad80ced13ada_2025.pdf', 'b1438f91-e5e1-4458-a12b-04735abc68b1_2025.pdf', '04f9d48a-82ef-4fd5-91bc-7d575cc37fef_2025.pdf', '2ff3a0b3-8ee2-476b-8526-1fd436dda3e9_2025.pdf'),
(161, 'fe562886-8ada-4f0f-bdfa-784e46852945_2025.pdf', 'f8dc86a6-2387-4c8a-a658-d93d20410c9b_2025.pdf', 'aa226c5e-10ba-46aa-96be-2190192380d0_2025.pdf', '9bdaaf3a-509d-4e56-87bb-153333116471_2025.pdf', '6868b71c-677f-464d-aa43-35db79ca6d8b_2025.pdf'),
(162, '8fc80636-eb56-42f2-abb7-68891e995014_2025.pdf', '36e9db9e-4a31-4f39-a4fa-96bc60918547_2025.pdf', '2314a897-76b3-485e-8117-6832e92cd837_2025.pdf', 'd57d0443-0610-45fc-a698-eea6343cf3d9_2025.pdf', 'fb136ae6-4e35-447b-a5fd-96925cad51ef_2025.pdf'),
(163, '43a6fbed-9039-4c5e-8111-f2fe4cb400ae_2025.pdf', '3cc4239e-2afb-4846-a7b1-0922be0332b1_2025.pdf', '28499ce8-1e84-47a8-afe5-c5599cbe4627_2025.pdf', '083feeb3-6792-49d7-bd4f-69db05982ff2_2025.pdf', 'ec311da7-8c92-4580-8a2e-a05f21b97566_2025.pdf'),
(164, 'cd87f1f0-419a-4da6-b52c-69a65ef00769_2025.pdf', '5169a749-cfb6-4f48-957f-92b02aaf84d0_2025.pdf', '905bfcdb-aa62-4d9e-a75a-2d968393bf26_2025.pdf', '56981de2-57d3-475e-a909-6f8d4c38f84d_2025.pdf', '9d3c018d-0632-4005-b80a-2ea5bdaff607_2025.pdf'),
(165, 'bf3fa4e5-3553-4ec7-8be4-2a92664ca685_technical discussion requirments.txt', '04854a2a-a788-42a7-9a68-70acce9f96a7_technical discussion requirments.txt', '8aa560ae-93c7-4620-a889-1c44e396a678_technical discussion requirments.txt', 'cb48564f-8193-47e4-91eb-52c8197e9cba_technical discussion requirments.txt', '4cdbeb3e-e7bc-447f-9238-ed57c05a4ebf_technical discussion requirments.txt'),
(166, 'e5a0a4e9-0602-49b6-9aeb-8560434c61e5_technical discussion requirments.txt', 'c25fdae0-62fb-4ed8-acd9-0c6964975be1_technical discussion requirments.txt', '437142b0-e6c7-4a95-b8e2-80fcbea7bec2_technical discussion requirments.txt', '1fbdbf08-0ae9-46e4-93b2-fb3421ccafd4_technical discussion requirments.txt', 'bb013135-aa6b-4be6-80b3-2400e978ac8b_technical discussion requirments.txt'),
(167, '12f320cd-1cb8-4500-a67f-3dd87f62e0b1_2025.pdf', 'b8f691b5-6b2c-480e-a326-f8cf5e970b45_2025.pdf', 'e8963931-b7e7-44a6-b35c-cefbedcc4125_2025.pdf', '48706e97-1a4c-48e4-9a38-a84a7d8f3192_2025.pdf', '1821c442-c273-4ce7-8a58-2854ffa6e8fe_2025.pdf'),
(168, '8094c49c-24d2-4376-a27d-3a90993dc855_2025.pdf', '791c0872-e42c-4dfa-a316-773a99379b29_2025.pdf', 'e240a066-7bf7-49c1-8dad-284fcf95498b_2025.pdf', '46ed3f68-18ce-443b-96ab-c769da002f3e_2025.pdf', 'f2cc5140-e85b-43af-bed1-89c22b936169_2025.pdf'),
(169, '360a26b7-716c-4314-b1e1-6ec10f53e6e9_mahmoud hossam.jpg', 'bb0c44f8-8d14-4355-80a1-e5702c102568_mahmoud hossam.jpg', 'eb78b89e-5443-439b-9b17-aa84c6e508ed_mahmoud hossam.jpg', '26ba3337-25b0-44c5-a1ee-b80a32d88b48_mahmoud hossam.jpg', 'ccd296a0-e7ba-497b-b764-b54869ceccd4_mahmoud hossam.jpg'),
(170, 'd6d23e79-bdd3-4cbb-a4c8-3f100fb41b97_mahmoud hossam.jpg', '2e578a22-6b2b-4433-9a8b-b69371adc1a2_mahmoud hossam.jpg', '4f99cb03-4068-443e-8498-39f22fb638c9_mahmoud hossam.jpg', '28048f21-7a25-41c3-83ce-ab109d40b06e_mahmoud hossam.jpg', '35190f28-f532-4387-8e77-9ff945133ba7_mahmoud hossam.jpg'),
(171, 'path/to/license.pdf', 'path/to/profession_license.pdf', 'path/to/syndicate_card.pdf', 'path/to/commercial_register.pdf', 'path/to/tax_card.pdf'),
(172, 'path/to/license.pdf', 'path/to/profession_license.pdf', 'path/to/syndicate_card.pdf', 'path/to/commercial_register.pdf', 'path/to/tax_card.pdf'),
(173, '62a2d9f0-3a50-4ecc-b9db-d6f5d080a402_2025.pdf', '363b04d1-99e7-4330-80f1-51fe910799b8_2025.pdf', 'c8277383-3cb8-4126-8fdb-929639a43ba7_2025.pdf', 'f02e5edb-0022-4de3-a7df-1c74445a88f7_2025.pdf', 'b75fb48c-289e-4aea-926a-42e09ea7fcf0_2025.pdf'),
(174, 'bccdbe0b-ec54-4705-8d01-51ddb0706186_2025.pdf', '09b5c08f-6b37-4335-8a0c-7a8f4a3ea5c7_2025.pdf', 'fab2dcc5-66f4-4efb-93e2-b40baba5768c_2025.pdf', 'abe0cc92-1ec1-4777-a6c9-d5ffad288b99_2025.pdf', 'c0421a09-845b-4696-8ca9-ebffc6e6fda6_2025.pdf'),
(175, '1dc06117-250f-4200-a662-89ecbdc3893b_Sheet 3 - Transport Layer.pdf', '194ac34d-ce5e-4d07-9848-983ec81adda5_Sheet 3 - Transport Layer.pdf', 'c24ba9eb-bef8-4b0c-9d2f-fb071aba6c75_Sheet 3 - Transport Layer.pdf', '27643be1-0ac5-4f78-a3e9-65712ba48e6d_Sheet 3 - Transport Layer.pdf', 'f96afc68-77cc-4d8f-989d-8e082ff50eec_Sheet 3 - Transport Layer.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `video`
--

CREATE TABLE `video` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `video_path` varchar(255) NOT NULL,
  `chapter_id` bigint(20) NOT NULL,
  `video_summary` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `violations`
--

CREATE TABLE `violations` (
  `id` bigint(20) NOT NULL,
  `quiz_id` bigint(255) DEFAULT NULL,
  `user_id` bigint(255) DEFAULT NULL,
  `violation` varchar(255) DEFAULT NULL,
  `start_time` varchar(255) DEFAULT NULL,
  `end_time` varchar(255) DEFAULT NULL,
  `duration` bigint(20) DEFAULT NULL,
  `course_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `violations`
--

INSERT INTO `violations` (`id`, `quiz_id`, `user_id`, `violation`, `start_time`, `end_time`, `duration`, `course_id`) VALUES
(195, 24, 125, 'tab_switching', '2025-05-04T19:29:47.875078', '2025-05-04T19:31:42.879942', 115, 31),
(196, 24, 125, 'tab_switching', '2025-05-04T19:31:52.846621', '2025-05-04T19:32:19.542123', 26, 31),
(197, 24, 125, 'multiple_people', '2025-05-04T19:29:38.441740', '2025-05-04T19:32:21.860082', 163, 31),
(198, 24, 125, 'multiple_people', '2025-05-05T01:20:23.375254', '2025-05-05T01:20:23.873128', 0, 31),
(199, 25, 125, 'multiple_people', '2025-05-05T02:08:27.113112', '2025-05-05T02:08:32.401789', 5, 31);

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
-- Indexes for table `certificate`
--
ALTER TABLE `certificate`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_certificate_number` (`certificate_number`),
  ADD KEY `idx_user_course` (`user_id`,`course_id`),
  ADD KEY `fk_certificate_course` (`course_id`);

--
-- Indexes for table `chapter`
--
ALTER TABLE `chapter`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_course_id` (`course_id`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbxl6anxo14q097g8cd2e51v55` (`user_id`);

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK312drfl5lquu37mu4trk8jkwx` (`user_id`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKb0yh0c1qaxfwlcnwo9dms2txf` (`quiz_id`);

--
-- Indexes for table `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKawdglurlxuavvtgtwg7h5y6v8` (`chapter_id`);

--
-- Indexes for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKny3k8jif6t9pj9dmhreegmeg7` (`quiz_id`);

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
-- Indexes for table `violations`
--
ALTER TABLE `violations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `quiz_id` (`quiz_id`),
  ADD KEY `violations_ibfk_3` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `certificate`
--
ALTER TABLE `certificate`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `chapter`
--
ALTER TABLE `chapter`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `question`
--
ALTER TABLE `question`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=183;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;

--
-- AUTO_INCREMENT for table `user_documents`
--
ALTER TABLE `user_documents`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=176;

--
-- AUTO_INCREMENT for table `video`
--
ALTER TABLE `video`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `violations`
--
ALTER TABLE `violations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=200;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `certificate`
--
ALTER TABLE `certificate`
  ADD CONSTRAINT `fk_certificate_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_certificate_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `chapter`
--
ALTER TABLE `chapter`
  ADD CONSTRAINT `fk_course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contact`
--
ALTER TABLE `contact`
  ADD CONSTRAINT `FKbxl6anxo14q097g8cd2e51v55` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `fk_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD CONSTRAINT `enrollment_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `enrollment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `FK312drfl5lquu37mu4trk8jkwx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `FKb0yh0c1qaxfwlcnwo9dms2txf` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quiz`
--
ALTER TABLE `quiz`
  ADD CONSTRAINT `FKawdglurlxuavvtgtwg7h5y6v8` FOREIGN KEY (`chapter_id`) REFERENCES `chapter` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  ADD CONSTRAINT `FKny3k8jif6t9pj9dmhreegmeg7` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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

--
-- Constraints for table `violations`
--
ALTER TABLE `violations`
  ADD CONSTRAINT `violations_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
