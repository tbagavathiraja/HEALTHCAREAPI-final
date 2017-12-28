
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

SELECT NOW();

UPDATE healthcare.user_details ud SET ud.first_name=? , ud.last_name=? ,ud.phone_number=? , ud.location=?  WHERE ud.user_id = ?;


SELECT u.user_id,u.mail_id, CONCAT( ud.first_name, ud.last_name ) AS name, ud.location, ud.phone_number, sn.speciality FROM  healthcare.`user` u JOIN healthcare.user_details ud ON u.user_id = ud.user_id JOIN healthcare.user_role ur ON ud.user_id = ur.user_id LEFT JOIN healthcare.user_role_type urt ON ur.role_id = urt.role_type_id LEFT JOIN healthcare.doctor_speciality s ON s.doctor_id = ur.user_id LEFT JOIN speciality_name sn ON s.speciality_id = sn.speciality_id WHERE ur.role_id =( SELECT role_id FROM user_role_type WHERE role_type_name ='doctor' );

SELECT u.mail_id,CONCAT( ud.first_name, ud.last_name ) AS name,ud.location, ud.phone_number FROM healthcare.`user` u JOIN healthcare.user_details ud ON u.user_id = ud.user_id;
SELECT CONCAT('sfsd','sfdsdf','aaaa');


SELECT
	u.mail_id,
	CONCAT( ud.first_name, ' ', ud.last_name ) AS name,
	ud.location,
	ud.phone_number,
	app.appointment_date,
	app.appointment_time
FROM
	user_details ud
JOIN healthcare.`user` u ON
	u.user_id = ud.user_id
JOIN healthcare.appointment app ON
	ud.user_id = app.patient_id
WHERE
	app.status = 1
	AND app.doctor_id = 53;


-- GETTING APPOINTMENT STATUS ON LOGIN ONLY FOR DOCTORS ROLE
SELECT
	app.doctor_id,
	app.patient_id,
	app.status,
	mail_id,
	CONCAT( ud.first_name, ' ', ud.last_name ) AS name,
	ud.location,
	ud.phone_number,
	app.appointment_date,
	app.appointment_time
FROM
	user_details ud
JOIN healthcare.`user` u ON
	u.user_id = ud.user_id
JOIN healthcare.appointment app ON
	ud.user_id = app.patient_id
WHERE
	app.status = 1
	AND app.doctor_id = 53 AND ((app.appointment_date>=CURDATE() AND app.appointment_time>=CURTIME()) OR (app.appointment_date>=CURDATE()));


-- FORMATING STRING TO TIMESTAMP
	INSERT INTO appointment VALUES(2,53,24,STR_TO_DATE('2018-11-12 02:47:25','%Y-%m-%d %H:%i:%s'),1);

-- UPDATE APPOINTMENTSTATUS 
UPDATE healthcare.appointment SET status=0 WHERE doctor_id=? AND patient_id=? AND appointment_date=? AND appointment_time=?;

-- INSERTING INTO DOCTOR HISTORY
INSERT INTO healthcare.doctor_history VALUES(?,?,?,?);

-- GET DOCTOR  HISTORY
 SELECT CONCAT(dn.first_name,' ',dn.last_name) AS doctor_name,  CONCAT(ud.first_name,' ',ud.last_name) AS patient_name,u.mail_id,dh.doctor_id,dh.patient_id,dh.checked_date_time,dh.req_appointment_time,dh.status FROM healthcare.doctor_history dh JOIN healthcare.user_details ud ON dh.patient_id=ud.user_id JOIN healthcare.`user` u ON ud.user_id=u.user_id JOIN healthcare.user_details dn ON dh.doctor_id=dn .user_id WHERE  dh.doctor_id=53;

-- GET PATIENT HISTORY
SELECT CONCAT(dn.first_name,' ',dn.last_name) AS patient_name,  CONCAT(ud.first_name,' ',ud.last_name) AS doctor_name,u.mail_id,dh.doctor_id,dh.patient_id,dh.checked_date_time,dh.req_appointment_time,dh.status FROM healthcare.doctor_history dh JOIN healthcare.user_details ud ON dh.doctor_id=ud.user_id JOIN healthcare.`user` u ON ud.user_id=u.user_id JOIN healthcare.user_details dn ON dh.patient_id=dn .user_id WHERE dh.patient_id=24;


-- GET USERROLE FROM USER_ID	
SELECT role_type_name FROM healthcare.user_role_type WHERE role_id=(SELECT role_id FROM healthcare.user_role WHERE user_id=26);

select speciality_id from healthcare.`speciality_name` where speciality='ENT';

