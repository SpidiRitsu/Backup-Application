#
# TABLE STRUCTURE FOR: User
#

CREATE DATABASE IF NOT EXISTS Dummy2;

USE Dummy2;

DROP TABLE IF EXISTS `User`;

CREATE TABLE `User` (
  `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8;

INSERT INTO `User` (`id`, `name`, `surname`) VALUES (1, 'Kellen', 'Hauck');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (2, 'Vernie', 'Nicolas');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (3, 'Edgardo', 'Kuhic');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (4, 'German', 'Stoltenberg');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (5, 'Linnie', 'Welch');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (6, 'Muhammad', 'Huels');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (7, 'Onie', 'Bashirian');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (8, 'Kristofer', 'Emmerich');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (9, 'Javonte', 'Dicki');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (10, 'Tyree', 'Skiles');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (11, 'Alfred', 'Mosciski');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (12, 'Margarett', 'Jones');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (13, 'Vickie', 'Fahey');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (14, 'Maya', 'Senger');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (15, 'Shakira', 'Feest');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (16, 'Zora', 'Greenfelder');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (17, 'Guiseppe', 'Hodkiewicz');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (18, 'Abdul', 'Barrows');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (19, 'Jamaal', 'Hane');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (20, 'Dorthy', 'Langworth');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (21, 'Cornell', 'Kris');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (22, 'Timmothy', 'Ankunding');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (23, 'Claud', 'Price');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (24, 'Agnes', 'Ernser');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (25, 'Lesly', 'Bechtelar');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (26, 'Amanda', 'Schmitt');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (27, 'Elmore', 'Blick');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (28, 'Earl', 'Feest');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (29, 'Nannie', 'Gibson');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (30, 'Forest', 'O\'Reilly');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (31, 'Kailyn', 'Flatley');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (32, 'Vickie', 'Thiel');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (33, 'Lambert', 'Quigley');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (34, 'Felicity', 'Mayert');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (35, 'Bryce', 'Armstrong');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (36, 'Roma', 'Lesch');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (37, 'Dandre', 'Hudson');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (38, 'Sage', 'Heathcote');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (39, 'Freeman', 'Predovic');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (40, 'Anibal', 'Greenholt');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (41, 'Dion', 'Paucek');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (42, 'Roy', 'Luettgen');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (43, 'Keanu', 'Torp');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (44, 'Liza', 'Jakubowski');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (45, 'Eudora', 'Kirlin');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (46, 'Abel', 'Konopelski');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (47, 'Cleveland', 'Fisher');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (48, 'Lucious', 'Graham');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (49, 'Veda', 'Lynch');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (50, 'Chauncey', 'Pacocha');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (51, 'Cedrick', 'Muller');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (52, 'Angeline', 'Swift');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (53, 'Mozelle', 'Barton');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (54, 'Delmer', 'Dach');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (55, 'Stuart', 'Harris');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (56, 'Augustus', 'Renner');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (57, 'Cora', 'Dickens');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (58, 'Oleta', 'Ferry');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (59, 'Tierra', 'Hagenes');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (60, 'Antonette', 'Brekke');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (61, 'Alf', 'White');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (62, 'Connor', 'Maggio');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (63, 'Hollie', 'Miller');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (64, 'Vanessa', 'Hauck');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (65, 'Dewayne', 'Dach');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (66, 'Daren', 'Reynolds');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (67, 'Casimer', 'Bradtke');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (68, 'Enoch', 'Schneider');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (69, 'Wilhelm', 'O\'Conner');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (70, 'Virgie', 'Fritsch');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (71, 'Joel', 'Hauck');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (72, 'Jensen', 'Macejkovic');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (73, 'Cleve', 'Hegmann');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (74, 'Trisha', 'Kiehn');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (75, 'Darrion', 'Bahringer');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (76, 'Milton', 'Weimann');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (77, 'Natalia', 'Greenfelder');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (78, 'Petra', 'Tillman');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (79, 'Karli', 'Carroll');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (80, 'Alessandro', 'Wintheiser');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (81, 'Dimitri', 'Johnston');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (82, 'Mohammad', 'Haley');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (83, 'Adelia', 'Dare');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (84, 'Samantha', 'Stiedemann');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (85, 'Zelma', 'Von');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (86, 'Keira', 'Ankunding');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (87, 'Darien', 'Mueller');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (88, 'Lionel', 'Littel');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (89, 'Jordane', 'Hahn');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (90, 'Anita', 'Erdman');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (91, 'Darryl', 'Olson');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (92, 'Glenda', 'Sporer');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (93, 'Audra', 'Hartmann');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (94, 'Lenna', 'Purdy');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (95, 'Kaya', 'Blanda');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (96, 'Deion', 'Sanford');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (97, 'Tabitha', 'Schiller');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (98, 'Ron', 'Block');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (99, 'Viva', 'Stroman');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (100, 'Cathryn', 'Greenfelder');


