create database app_gest_materiel;

use app_gest_materiel;

create table user(
	userId int primary key auto_increment,
    name varchar(255),
    email varchar(255),
    password varchar(255),
    depId int,
    constraint fk_dep foreign key (depId) references departement(depId) on update cascade on delete restrict
);

create table admin(
	adminId int primary key auto_increment,
    name varchar(255),
    email varchar(255),
    password varchar(255)
);

create table  departement(
	depId int primary key auto_increment,
    depName varchar(255),
    depPhoneNum varchar(255)
);



create table ticket(
	ticketId int primary key auto_increment,
    title varchar(255),
    severity varchar(255),
	userId int,
    dateSubmitted datetime,
    deviceType varchar(255),
    inventoryNum varchar(255),
    serialNum varchar(255),
    description text,
	constraint fk_user foreign key (userId) references user(userId) on update cascade on delete restrict

);
 create table fixing(
	fixingId int primary key auto_increment,
    ticketId int,
    adminId int,
    status int, -- 0 for pending, 1 for fixed, 2 for reformed, 3 for maintenance
    dateAssigned datetime,
    dateFixed datetime,
    remarks text,
	constraint fk_admin foreign key (adminId) references admin(adminId) on update cascade on delete restrict,
	constraint fk_ticket foreign key (ticketId) references ticket(ticketId) on update cascade on delete restrict
 );
 
INSERT INTO admin(name, email, password) VALUES ('john smith','john@example.com','123456789');

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
flush privileges;


-- ----------------------------------------------- 	--
-- 	Testing inserting and selecting statements		--													
-- ----------------------------------------------- 	--
INSERT INTO `app_gest_materiel`.`user`
(`name`,
`email`,
`password`,
`depId`)
VALUES
('user1','user1@example.com','123456789',null);

select * from admin;


INSERT INTO departement (depName,depPhoneNum) VALUES ("informatique","+212622222233");


(select email from user where email="user1@example.com") union all (select email from admin where email="user1@example.com");

select * from user;
(select email from user where email='ilove@burgers.com') union all (select email from admin where email='ilove@burgers.com');

INSERT INTO ticket(title,severity,userId,dateSubmitted,deviceType,inventoryNum,serialNum,description)VALUES (?,?,?,?,?,?,?,?);

select * from ticket;
select * from fixing;
INSERT INTO fixing(ticketId,adminId,status,dateAssigned,dateFixed,remarks)VALUES(?,?,?,?,?,?);


