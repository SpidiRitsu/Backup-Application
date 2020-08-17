#
# TABLE STRUCTURE FOR: User
#

#Programowanie zespołowe - 15.04.2020

CREATE DATABASE IF NOT EXISTS Dummy1;

USE Dummy1;

#SHOW DATABASES;

DROP TABLE IF EXISTS `User`;

CREATE TABLE `User` (
  `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8;

INSERT INTO `User` (`id`, `name`, `surname`) VALUES (1, 'Bridget', 'McKenzie');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (2, 'Marlen', 'Kiehn');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (3, 'Veronica', 'Hartmann');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (4, 'Matilda', 'Daniel');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (5, 'Savion', 'McClure');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (6, 'Bertha', 'Borer');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (7, 'Judge', 'Emard');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (8, 'Christy', 'Watsica');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (9, 'Ted', 'Zboncak');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (10, 'Rickie', 'Bruen');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (11, 'Jerrell', 'Heidenreich');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (12, 'Sydney', 'Carter');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (13, 'Jazmin', 'Walsh');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (14, 'Clementine', 'Kutch');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (15, 'Jarred', 'Renner');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (16, 'Arne', 'Ruecker');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (17, 'Ricardo', 'Braun');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (18, 'Doug', 'Roob');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (19, 'Lydia', 'Rippin');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (20, 'Eliseo', 'Crona');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (21, 'Teresa', 'Senger');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (22, 'Ford', 'West');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (23, 'Eva', 'Moore');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (24, 'Nikolas', 'Williamson');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (25, 'Thad', 'Kreiger');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (26, 'Abelardo', 'Doyle');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (27, 'Roxanne', 'Quitzon');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (28, 'Eduardo', 'Gutkowski');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (29, 'Lionel', 'Johnson');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (30, 'Sandrine', 'Kuhlman');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (31, 'Tyrel', 'Donnelly');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (32, 'Macie', 'Hegmann');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (33, 'Gunner', 'Aufderhar');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (34, 'Keith', 'Spencer');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (35, 'Jett', 'Kshlerin');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (36, 'Daija', 'Crist');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (37, 'Talia', 'Okuneva');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (38, 'Annabelle', 'Stanton');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (39, 'Mariana', 'Heller');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (40, 'Francesca', 'Bogan');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (41, 'Nathan', 'Hauck');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (42, 'Althea', 'Rippin');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (43, 'Nikita', 'Klocko');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (44, 'Gideon', 'Fadel');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (45, 'Johnny', 'Gibson');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (46, 'Dariana', 'McDermott');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (47, 'Tyrel', 'Waters');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (48, 'Kelley', 'Zieme');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (49, 'Modesta', 'Skiles');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (50, 'Marisa', 'Ziemann');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (51, 'Coy', 'Breitenberg');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (52, 'Monserrate', 'Bergstrom');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (53, 'Ross', 'Leffler');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (54, 'Dejuan', 'Daugherty');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (55, 'Kayla', 'Weissnat');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (56, 'Gerald', 'Hills');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (57, 'Allie', 'Hoppe');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (58, 'Luciano', 'Baumbach');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (59, 'Adolfo', 'Friesen');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (60, 'Gino', 'Collins');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (61, 'Chad', 'Jerde');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (62, 'Gilbert', 'Mayer');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (63, 'Americo', 'Becker');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (64, 'Shane', 'Nikolaus');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (65, 'Stevie', 'Balistreri');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (66, 'Gregg', 'White');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (67, 'Roberta', 'Jerde');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (68, 'Chet', 'Bergnaum');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (69, 'Johanna', 'Lynch');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (70, 'Lavern', 'Nikolaus');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (71, 'Ethyl', 'Conroy');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (72, 'Marlen', 'Abbott');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (73, 'Naomi', 'Wolff');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (74, 'Gayle', 'Schroeder');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (75, 'Leatha', 'Wiegand');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (76, 'Nicholas', 'Lindgren');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (77, 'Quincy', 'VonRueden');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (78, 'Mireille', 'Altenwerth');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (79, 'Gerda', 'Terry');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (80, 'Grace', 'Lakin');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (81, 'Janet', 'Hermiston');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (82, 'Issac', 'Powlowski');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (83, 'Lorine', 'Luettgen');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (84, 'Myra', 'Luettgen');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (85, 'Jaquelin', 'Gutmann');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (86, 'Thora', 'Lindgren');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (87, 'Pearline', 'Boehm');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (88, 'Fletcher', 'Bechtelar');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (89, 'Vivien', 'Raynor');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (90, 'Ethyl', 'Haag');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (91, 'Birdie', 'Koss');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (92, 'Vada', 'Dare');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (93, 'Tod', 'Johnston');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (94, 'Bradly', 'Schinner');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (95, 'Devin', 'Wunsch');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (96, 'Laron', 'Hyatt');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (97, 'Allene', 'Murray');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (98, 'Heaven', 'Leannon');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (99, 'Shana', 'Mann');
INSERT INTO `User` (`id`, `name`, `surname`) VALUES (100, 'Brice', 'Berge');


