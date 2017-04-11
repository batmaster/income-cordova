-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 12, 2017 at 03:10 AM
-- Server version: 5.5.50-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `income_cordova`
--
CREATE DATABASE IF NOT EXISTS `income_cordova` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `income_cordova`;

-- --------------------------------------------------------

--
-- Table structure for table `group`
--

CREATE TABLE IF NOT EXISTS `group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `code` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=102 ;

--
-- Dumping data for table `group`
--

INSERT INTO `group` (`id`, `title`, `code`) VALUES
(1, 'กลุ่มแบตเทส', 'g1'),
(100, 'family', 'gl2'),
(101, 'max', 'gl101');

-- --------------------------------------------------------

--
-- Table structure for table `list`
--

CREATE TABLE IF NOT EXISTS `list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `type` int(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=18 ;

--
-- Dumping data for table `list`
--

INSERT INTO `list` (`id`, `title`, `type`) VALUES
(1, 'โอนเงินเข้า', 0),
(10, 'เงินเดือน', 0),
(11, 'เงินปันผล', 0),
(12, 'ค่ารถ', 1),
(13, 'ค่าอาหาร', 1),
(14, 'ค่าน้ำ', 1),
(15, 'ค่าไฟ', 1),
(16, 'ค่าโทรศัพท์', 1),
(17, 'ค่าของ', 1);

-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

CREATE TABLE IF NOT EXISTS `schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` int(1) NOT NULL,
  `title` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `frequency` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `state` int(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=45 ;

--
-- Dumping data for table `schedule`
--

INSERT INTO `schedule` (`id`, `user_id`, `type`, `title`, `frequency`, `state`) VALUES
(1, 16, 1, 'จ่ายค่าไฟ', '0 1010101 03:21', 1),
(30, 16, 1, 'กินข้าว', '0 1111111 03:50', 1),
(35, 16, 1, 'ซื้อกับข้าว', '0 1111111 14:05', 1),
(39, 28, 1, 'ค่าไฟ 1500', '0 1000000 16:51', 1),
(40, 37, 0, '', '0 1111111 21:44', 1),
(41, 33, 1, 'จ่ายค่าอาหาร', '0 1111111 08:35', 1),
(42, 28, 1, 'ค่าไฟ', '0 1111111 13:01', 1),
(43, 39, 1, 'ค่าโทรสัพ', '0 0000010 14:44', 1),
(44, 40, 0, 'เงินเดือน', '0 0000001 14:46', 1);

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE IF NOT EXISTS `transaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` int(1) NOT NULL DEFAULT '0',
  `title` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `date` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=84 ;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`id`, `user_id`, `type`, `title`, `amount`, `date`, `group_id`) VALUES
(2, 16, 0, 'แม่โอน', 8000, '2017-02-01 23:21:00', 1),
(3, 16, 1, 'ซื้อมาม่า', 6, '2017-02-01 23:30:00', 1),
(4, 16, 1, 'ซื้อหนังสือพิมพ์', 40, '2017-02-03 02:16:00', 1),
(5, 16, 1, 'ซ่อมรถ', 1250, '2017-02-03 02:17:00', 1),
(6, 16, 1, 'ซื้อกับข้าว', 368, '2017-02-03 02:17:00', 1),
(7, 16, 0, 'เพื่อนจ่ายค่าติด', 4000, '2017-02-03 02:32:00', 1),
(8, 16, 1, 'จ่ายค่าไฟ', 1422.25, '2017-02-03 02:32:00', 1),
(9, 16, 0, 'พ่อโอน', 1200, '2017-02-01 03:29:00', 1),
(10, 16, 0, 'แม่โอน', 5000, '2017-02-09 14:19:00', 1),
(11, 16, 0, 'เก็บค่ารายงานจากเพื่อน', 165, '2017-02-09 14:19:00', 1),
(12, 16, 0, 'เก็บค่ารายงานจากเพื่อน', 150, '2017-02-09 14:19:00', 1),
(13, 16, 1, 'ซื้อเครื่องเขียน', 46, '2017-02-09 14:19:00', 1),
(14, 16, 0, 'เงินปันผลงวด 9 กพ', 200, '2017-02-09 14:26:00', 1),
(15, 16, 1, 'ซื้อล็อตเตอรี่', 160, '2017-02-09 14:28:00', 1),
(16, 16, 1, 'ซื้อข้าวสาร', 245, '2017-02-09 14:29:00', 1),
(17, 17, 1, 'ซื้อตั๋ว', 4650, '2017-02-09 14:31:00', 1),
(18, 17, 0, 'เพื่อนโอนค่าซื้อตั๋ว', 2325, '2017-02-09 14:34:00', 1),
(19, 17, 0, 'เพื่อนโอนค่าซื้อตั๋ว', 1200, '2017-02-09 13:29:00', 1),
(20, 16, 1, 'ค่าโทรศัพท์', 600, '2017-02-14 15:16:00', 1),
(21, 16, 1, 'กินข้าว', 50, '2017-02-14 15:16:00', 1),
(22, 17, 1, 'ซื้อโทรศัพท์', 16500, '2017-02-14 15:20:00', 1),
(23, 17, 0, 'แม่โอน', 20000, '2017-02-14 15:20:00', 1),
(24, 17, 1, 'กินข้าว', 50, '2017-02-14 23:16:00', 1),
(25, 16, 0, 'แม่โอน', 10000, '2017-02-15 18:54:00', 1),
(26, 16, 1, 'ค่ารถ', 120, '2017-02-15 18:54:00', 1),
(27, 16, 1, 'จ่ายค่าโทรศัพท์', 1225, '2017-02-15 18:54:00', 1),
(28, 16, 1, 'จ่ายค่ารถ', 80, '2017-02-15 18:54:00', 1),
(29, 16, 1, 'ซื้อขนม', 165, '2017-02-15 18:54:00', 1),
(30, 16, 1, 'ค่าอบรม', 3500, '2017-02-16 21:37:00', 1),
(31, 16, 1, 'ค่าบัตรโดยสาร', 300, '2017-02-16 22:42:00', 1),
(32, 16, 1, 'ซื้อหนังสือ', 450, '2017-02-16 22:42:00', 1),
(33, 16, 1, 'ค่าที่จอดรถ', 70, '2017-02-16 23:05:00', 1),
(34, 16, 1, 'กินข้าว', 165, '2017-02-17 05:30:00', 1),
(35, 16, 1, 'ซื้อของ', 140, '2017-02-17 15:29:00', 1),
(36, 16, 1, 'ค่ารถรับจ้าง', 45, '2017-02-17 15:45:00', 1),
(37, 16, 0, 'เบิกบัญชีหุ้น', 4000, '2017-02-20 14:56:00', 1),
(38, 26, 0, 'ค่าหวย', 4200, '2017-02-20 16:50:00', 0),
(39, 28, 1, 'ค่าน้ำยา', 200, '2017-02-20 17:13:00', 90),
(40, 28, 0, 'ได้เงิน', 1500, '2017-02-20 17:17:00', 90),
(41, 33, 0, 'เบี้ย', 5000, '2017-02-20 17:27:00', 100),
(42, 33, 1, 'ค่าน้ำยา', 250, '2017-02-20 17:29:00', 100),
(43, 33, 1, 'ค่าไฟ', 258, '2017-02-20 17:30:00', 100),
(44, 33, 1, 'ค่าน้ำ', 1500, '2017-02-20 17:42:00', 100),
(45, 33, 0, 'แม่ให้', 2000, '2017-02-01 17:51:00', 100),
(46, 28, 0, 'แม่ให้', 2000, '2017-02-01 17:57:00', 90),
(47, 28, 1, 'ค่าน้ำยา', 400, '2017-02-02 17:58:00', 90),
(48, 35, 0, 'vat', 5000, '2017-02-20 18:13:00', 100),
(49, 35, 1, 'ค่าผ่อนบ้าน', 5000, '2017-02-20 18:13:00', 100),
(50, 33, 0, 'เบี้ย', 5000, '2017-01-02 19:40:00', 100),
(51, 33, 1, 'ค่าไฟ', 5000, '2017-02-20 19:40:00', 100),
(52, 33, 0, 'ค่าไฟ', 258, '2017-01-02 19:44:00', 100),
(53, 33, 0, 'ค่ารถ', 200, '2017-02-22 15:06:00', 100),
(54, 28, 1, 'ค่าน้ำยา', 250, '2017-02-23 12:45:00', 90),
(55, 16, 0, 'แม่โอน', 4000, '2017-03-08 13:45:00', 1),
(56, 16, 1, 'ค่ารถ', 13, '2017-03-08 13:47:00', 1),
(57, 16, 1, 'กินข้าว', 45, '2017-03-08 13:47:00', 1),
(58, 16, 1, 'กาแฟ', 45, '2017-03-08 13:48:00', 1),
(59, 16, 1, 'ค่ารถ', 30, '2017-03-08 14:08:00', 1),
(60, 16, 0, 'จ่ายค่ารถ', 25, '2017-03-09 21:56:00', 1),
(62, 16, 1, 'กินข้าว', 45, '2017-03-12 16:03:00', 1),
(63, 33, 0, 'พ่อให้', 2000, '2017-03-12 17:17:00', 100),
(64, 37, 0, 'เงินได้', 3000, '2017-03-12 20:08:00', 0),
(65, 37, 1, 'น้ำมัน', 1400, '2017-03-20 21:43:00', 0),
(66, 37, 0, 'สติกเกอร์รถ', 320, '2017-03-21 12:27:00', 0),
(67, 35, 0, 'แม่ให้', 3450, '2017-04-02 14:59:00', 100),
(68, 35, 1, 'ค่าผ่อนบ้าน', 2500, '2017-04-02 14:59:00', 100),
(69, 33, 0, 'ค่าไฟ', 12000, '2017-04-06 21:25:00', 100),
(70, 33, 0, 'ค่าน้ำ', 1200, '2017-04-06 21:25:00', 100),
(71, 35, 0, 'แม่ให้', 1200, '2017-04-07 13:54:00', 100),
(72, 40, 0, 'แม่ให้', 1200, '2017-04-07 14:22:00', 101),
(73, 40, 1, 'เติมน้ำมัน', 100, '2017-04-07 14:22:00', 101),
(74, 41, 0, 'เงินออก', 5000, '2017-04-07 14:27:00', 101),
(75, 41, 1, 'ค่าไฟ', 600, '2017-04-07 14:28:00', 101),
(76, 16, 0, 'โอนเงินเข้า บช เก่า', 4000, '2017-04-10 02:21:00', 1),
(77, 16, 0, 'เพื่อนคืน', 200, '2017-04-10 02:21:00', 1),
(78, 16, 1, 'ค่ารถ', 15, '2017-04-10 02:21:00', 1),
(79, 16, 1, 'ค่าติด', 150, '2017-04-10 02:21:00', 1),
(80, 16, 1, 'ค่าน้ำ', 450, '2017-04-10 02:21:00', 1),
(81, 39, 0, 'เงินเดือน', 5000, '2017-04-10 13:07:00', 101),
(82, 39, 0, 'แม่ให้', 6000, '2017-04-10 13:07:00', 101),
(83, 16, 1, 'ค่าของ', 456, '2017-04-12 03:05:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `lastname` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `level` int(1) NOT NULL DEFAULT '0',
  `phone` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `birthday` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `register_date` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=44 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `name`, `lastname`, `email`, `level`, `phone`, `birthday`, `register_date`, `group_id`) VALUES
(16, 'b', '92eb5ffee6ae2fec3ad71c777531578f', 'ปรเมศวร์', 'หอมประกอบ', 'b', 1, '0817371393', '1993-09-19', '2017-01-31 02:36:58', 1),
(17, 'b2', '92eb5ffee6ae2fec3ad71c777531578f', '2 ปรเมศวร์', 'หอมประกอบ', 'b2', 0, '0817371393', '1993-09-19', '2017-02-09 02:36:58', 1),
(27, 'a', '0cc175b9c0f1b6a831c399e269772661', 'a', 'a', 'a', 1, '1', '1', '2017-02-20 17:06:12', 63),
(28, 'jassada', '61a12a0bdbc5ea0ce465fa062e99bb1c', 'เจด', 'กัง', 'as@h.com', 1, '084', '2013-02-20', '2017-02-20 17:12:58', 90),
(33, 'user', '81dc9bdb52d04dc20036dbd8313ed055', 'user', 'admin', 'as@h.com', 0, '086', '2013-02-20', '2017-02-20 17:25:42', 100),
(34, 'bm', '084243855820f9ca47f466f645784636', 'แบตมือถือ', '-', 'b@b.b', 0, '1', '2017-02-20', '2017-02-20 17:57:59', -1),
(35, 'admin', '81dc9bdb52d04dc20036dbd8313ed055', 'หัวหน้า', 'บันชี', 'as@h.com', 1, '0848506813', '2011-02-20', '2017-02-20 18:09:42', 100),
(36, 'test', '098f6bcd4621d373cade4e832627b4f6', 'ทดสอบ', 'ทดสอบ', 'as@h.com', 0, '08642878', '2012-02-23', '2017-02-23 13:07:32', 100),
(37, 'Paiboon', '25d55ad283aa400af464c76d713c07ad', 'ไพบูลย์', 'ชนิดปลอด', 'boyman740@gmail.com', 0, '0926426778', '1992-07-09', '2017-03-12 20:07:05', 0),
(38, 'kiadtisak', '3ccfa53f95c442a24d8271101c82a227', 'เกียรติศักดิ์', 'โต๊ะเตบ', 'loki_0258@hotmail.com', 0, '0856919641', '2536-02-19', '2017-03-12 20:11:25', 0),
(39, 'test1', '81dc9bdb52d04dc20036dbd8313ed055', 'เจ', 'กัง', 'adf@h.com', 1, '086', '2014-04-03', '2017-04-07 14:10:03', 101),
(40, 'ghost', '81dc9bdb52d04dc20036dbd8313ed055', 'gh', 'กัj', 'bdf@h.com', 0, '086', '2014-04-03', '2017-04-07 14:14:37', 101),
(41, 'ghost2', '81dc9bdb52d04dc20036dbd8313ed055', 'you', 'name', 'fsg@j.com', 0, '096', '2013-04-04', '2017-04-07 14:27:43', 101),
(43, 'admin', '0cc175b9c0f1b6a831c399e269772661', 'Admin', 'Editor', 'admin@income-cordova.com', -1, '', '', '', 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
