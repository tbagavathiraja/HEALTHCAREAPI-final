
-- extracting user details

SELECT
	u.user_id,
	u.status,
	ud.first_name,
	ud.last_name,
	ud.location,
	ur.role_id,
	urt.role_type_name
FROM
	healthcare.`user` u
JOIN healthcare.user_details ud
             ON
	u.user_id = ud.user_id
JOIN healthcare.user_role ur ON
	u.user_id = ur.user_id 
          
JOIN healthcare.user_role_type urt ON
	ur.role_id = urt.role_id
WHERE
	u.user_id =24;
	

-- login

SELECT u.user_id,ud.first_name,ud.last_name,ud.location,ur.role_id, 
urt.role_type_name FROM healthcare.`user` u JOIN healthcare.user_details ud
 ON u.user_id=ud.user_id JOIN healthcare.user_role ur ON u.user_id=ur.user_id 
JOIN healthcare.user_role_type urt ON ur.role_id=urt.role_id where u.mail_id = 'tbagavathiraja@gmail.com' AND u.password='ceb6c970658f31504a901b89dcd3e461'
 AND u.status=1 LIMIT 0,1;

 
USE healthcare;

ALTER TABLE healthcare.user_details ADD gender varchar(10) NOT NULL DEFAULT 'male';

INSERT INTO healthcare.`user` (mail_id,password,created_date) VALUES(?,?,?);

INSERT INTO healthcare.user_details()

ALTER TABLE healthcare.`user`ADD CONSTRAINT uc_mail UNIQUE (mail_id);

INSERT INTO healthcare.user_details (user_id,first_name,last_name,location,phone_number,created_date) VALUES(?,?,?,?,?,?);
INSERT INTO healthcare.user_role (role_id,user_id) VALUES (?,?);

SELECT
	u.user_id,
	u.mail_id,CONCAT
	(
		ud.first_name,
		ud.last_name
	) AS name, ud.location,
	ud.phone_number
FROM
	healthcare.`user` u
JOIN healthcare.user_details ud ON
	u.user_id = ud.user_id
JOIN healthcare.user_role ur ON
	u.user_id = ur.user_id
WHERE
	ur.role_id =(
		SELECT
			role_id
		FROM
			healthcare.user_role_type
		WHERE
			role_type_name = 'patient'
	);	



SELECT u.user_id,ud.first_name,ud.last_name,ud.location,ur.role_id, 
      urt.role_type_name FROM healthcare.`user` u JOIN healthcare.user_details ud
       ON u.user_id=ud.user_id JOIN healthcare.user_role ur ON u.user_id=ur.user_id 
      JOIN healthcare.user_role_type urt ON ur.role_id=urt.role_id where u.mail_id = 'tbagavathiraja@gmail.com'
      AND u.password='ceb6c970658f31504a901b89dcd3e461' 
       AND u.status=1 LIMIT 0,1


GRANT ALL PRIVILEGES ON healthcare.* TO 'root'@'%' WITH GRANT OPTION;

GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' IDENTIFIED BY 'root';

GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION

SELECT u.user_id,u.mail_id,CONCAT(ud.first_name," ",ud.last_name) AS name FROM 	healthcare.`user` u JOIN healthcare.user_details ud ON 
u.user_id=ud.user_id WHERE u.status=1 AND u.user_id=24;


SELECT user_id FROM healthcare.password_reset WHERE status=1 AND  reset_token='1b73f7ec71d4a765bd5f5afd63220f89' AND TIMESTAMPDIFF (MINUTE, expiry_time, now())<=30  LIMIT 0,1;


SELECT TIMESTAMPDIFF(MINUTE, expiry_time, now()) FROM healthcare.password_reset

SELECT now();


DROP TABLE healthcare.user_role;

-- SELECT DOCTOR BY SPECIALISATIION

SELECT
	u.user_id,
	u.mail_id,
	CONCAT( ud.first_name, ud.last_name ) name,
	ud.location,
	ud.phone_number,
	urt.role_type_name,
	sn.speciality
FROM
	healthcare.`user` u
JOIN healthcare.user_details ud ON
	u.user_id = ud.user_id
JOIN healthcare.user_role ur ON
	ud.user_id = ur.user_id
LEFT JOIN healthcare.user_role_type urt ON
	ur.role_id = urt.role_type_id
LEFT JOIN healthcare.doctor_speciality s ON
	s.doctor_id = ur.user_id
LEFT JOIN speciality_name sn ON
	s.speciality_id = sn.speciality_id
WHERE
	ur.role_id =(
		SELECT
			role_type_id
		FROM
			user_role_type
		WHERE
			role_type_name = 'doctor'
	) AND sn.speciality='heart';

-- SELECT DOCTOR BY LOCATIION

SELECT
	u.user_id,
	u.mail_id,
	CONCAT( ud.first_name, ud.last_name ) name,
	ud.location,
	ud.phone_number,
	urt.role_type_name,
	sn.speciality
FROM
	healthcare.`user` u
JOIN healthcare.user_details ud ON
	u.user_id = ud.user_id
JOIN healthcare.user_role ur ON
	ud.user_id = ur.user_id
LEFT JOIN healthcare.user_role_type urt ON
	ur.role_id = urt.role_type_id
LEFT JOIN healthcare.doctor_speciality s ON
	s.doctor_id = ur.user_id
LEFT JOIN speciality_name sn ON
	s.speciality_id = sn.speciality_id
WHERE
	ur.role_id =(
		SELECT
			role_type_id
		FROM
			user_role_type
		WHERE
			role_type_name = 'doctor'
	) AND ud.location='coimbatore';
