-- DATABASE CREATION
 CREATE
	DATABASE healthcare;

-- USERS TABLE CREATION 
 CREATE
	TABLE
		USER(
			user_id INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
			mail_id VARCHAR(50) NOT NULL,
			PASSWORD VARCHAR(25) NOT NULL,
			status BOOLEAN,
			created_date DATETIME NOT NULL
		);



-- USER_DETAILS  TABLE CREATION
 DROP
	TABLE
		IF EXISTS USER_DETAILS;

CREATE
	TABLE
		user_details(
			user_details_id INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
			user_id INT(10) NOT NULL,
			first_name VARCHAR(25) NOT NULL,
			last_name VARCHAR(25),
			location VARCHAR(100) NOT NULL,
			phone_number VARCHAR(15) NOT NULL,
			office_number VARCHAR(15),
			created_date DATETIME NOT NULL,
			updated_date DATETIME,
			CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES USER(user_id)
		);

ALTER TABLE user_role_type DROP FOREIGN KEY fk_user_role_type;

SELECT now() FROM DUAL;


-- 
-- ALTER TABLE user_role_type
--   ADD CONSTRAINT fk_user_role_type
--   FOREIGN KEY (role_id)
--   REFERENCES user_role (role_id) ON DELETE CASCADE;

-- truncate  TABLE user;
-- 
DELETE FROM user_role WHERE user_id=1;

DROP TABLE healthcare.password_reset;




-- USER_ROLE TABLE CREATION
 CREATE
	TABLE
		user_role(
				user_role_id INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
				user_id INT(10) NOT NULL,
				role_type_id int(10) NOT NULL 
		/*	CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES healthcare.`user`(user_id) ON DELETE CASCADE,
			CONSTRAINT fk_user_role_type FOREIGN KEY(role_type_id) REFERENCES healthcare.user_role_type(role_id) ON DELETE CASCADE			
		*/
			);

-- USER_ROLE_TYPE TABLE CREATION

CREATE
	TABLE
		user_role_type(
			role_type_id INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
			role_id INT(10) NOT NULL,
			role_type_name varchar(10),
			CONSTRAINT fk_user_role FOREIGN KEY(role_id) REFERENCES USER(role_id) ON DELETE CASCADE
		);

CREATE TABLE `user_session` (
  `user_session_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `session_auth_token` varchar(255) NOT NULL,
  `expiry_time` datetime NOT NULL,
  PRIMARY KEY (`user_session_id`),
  UNIQUE KEY `uq_session_auth_token` (`session_auth_token`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fk_user_session` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ;

CREATE TABLE doctor_history (
history_id INT(25) NOT NULL AUTO_INCREMENT PRIMARY KEY,
doctor_id int(11) ,
patient_id int(11) ,
checked_time DATETIME NOT NULL,
prescription VARCHAR(100) NOT NULL ,
CONSTRAINT fk_doctor_history FOREIGN KEY (doctor_id) REFERENCES healthcare.`user`(user_id),
CONSTRAINT fk_doctor_history_patient FOREIGN KEY (patient_id) REFERENCES healthcare.`user`(user_id)
)

CREATE TABLE doctor_domain(
doctor_domain_id int(10) AUTO_INCREMENT PRIMARY KEY,
doctor_id int (11),
experience int(4) NOT NULL DEFAULT 1,
speciality VARCHAR(20) NOT NULL,
CONSTRAINT fk_doctor_domail FOREIGN KEY (doctor_id) REFERENCES healthcare.`user`(user_id) 
);

DROP TABLE healthcare.doctor_domain;
DROP TABLE healthcare.password_reset;


CREATE TABLE `password_reset` (
  `password_reset_id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `reset_token` varchar(50) NOT NULL,
  `status` TINYINT(2) NOT NULL, 
  `expiry_time` datetime NOT NULL,
  PRIMARY KEY (`password_reset_id`),
  UNIQUE KEY `reset_token` (`reset_token`),
  KEY `fk_password_reset` (`user_id`),
  CONSTRAINT `fk_password_reset` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1


CREATE
	TABLE
		speciality_name(
			speciality_id INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
			speciality VARCHAR(25) NOT NULL UNIQUE DEFAULT 'ENT'
		);

CREATE
	TABLE
		doctor_specality(
			doctor_specality_id INT(10) PRIMARY KEY AUTO_INCREMENT,
			doctor_id INT(11) NOT NULL UNIQUE,
			speciality_id INT(10) NOT NULL
		);

CREATE
	TABLE
		appointment(
			appointment_id INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
			doctor_id int(10)NOT NULL ,
			patient_id int(10) NOT NULL ,
			appointment_time TIME NOT NULL,
			appointment_date VARCHAR(15) NULL,
			status TINYINT(1) NOT NULL DEFAULT 1 ,
			CONSTRAINT fk_user_doctor_id FOREIGN KEY (doctor_id) REFERENCES healthcare.`user`(user_id) ,
			CONSTRAINT fk_user_patient_id FOREIGN KEY (patient_id) REFERENCES healthcare.`user`(user_id)
		)
		
		DROP TABLE appointment;

		
		
INSERT INTO healthcare.appointment (doctor_id,patient_id,appointment_time,appointment_date) VALUES(25,109,TIME_FORMAT('22:10:12','%H%i%S'),STR_TO_DATE('2017/02/12','%Y/%m/%d'));


