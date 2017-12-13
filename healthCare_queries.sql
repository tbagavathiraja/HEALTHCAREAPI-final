
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


