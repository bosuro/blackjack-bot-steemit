-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 08 Mar 2018 la 10:00
-- Versiune server: 10.1.25-MariaDB
-- PHP Version: 7.1.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jackpotsteem`
--

-- --------------------------------------------------------

--
-- Structura de tabel pentru tabelul `games`
--

CREATE TABLE `games` (
  `id` int(255) NOT NULL,
  `player` varchar(256) NOT NULL,
  `playerTotal` int(11) NOT NULL,
  `houseTotal` int(11) NOT NULL,
  `player1` int(11) NOT NULL,
  `player2` int(11) NOT NULL,
  `player3` int(11) NOT NULL,
  `player4` int(11) NOT NULL,
  `player5` int(11) NOT NULL,
  `house1` int(11) NOT NULL,
  `house2` int(11) NOT NULL,
  `house3` int(11) NOT NULL,
  `house4` int(11) NOT NULL,
  `house5` int(11) NOT NULL,
  `bet` float NOT NULL,
  `reward` float NOT NULL,
  `stats` int(11) NOT NULL,
  `timestamp` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structura de tabel pentru tabelul `info`
--

CREATE TABLE `info` (
  `name` varchar(256) NOT NULL,
  `value` int(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Salvarea datelor din tabel `info`
--

INSERT INTO `info` (`name`, `value`) VALUES
('lastTrans', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `games`
--
ALTER TABLE `games`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
