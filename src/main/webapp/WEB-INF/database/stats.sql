drop database if exists stats;
create database if not exists stats;

use stats;

drop table if exists deltas;
drop table if exists projects;
drop table if exists services;

create table if not exists users (
id int primary key not null auto_increment,
username varchar(25) unique not null,
hash varchar(1024) not null,
name varchar(255),
email varchar(255)
);

create table if not exists projects (
	id int primary key not null auto_increment,
	userId int not null
	, projectname varchar(256) unique not null
    , uri varchar(1024) not null
    , testType varchar(256) not null
    , scheduleInterval BIGINT
    , distribution varchar(256)
    , warmUpTime int
    , method varchar(20)
    , testDuration int
    , stepDuration BIGINT
    , stepCount int
    , requestCount int
    , avgResponseTime int
    , userCount int
    , failedRequests int
    , dateCreated timestamp not null default current_timestamp,
    INDEX(userId),
    FOREIGN KEY (userId) REFERENCES users(id)
);

create table if not exists deltas ( 
	id int primary key not null auto_increment, projectid int
    , uri varchar(1024)
	, roundTripTime int
	, statusCode int
	, relativeTimeBucket int
	, requests int
    , relativeTime int
    , dateCreated timestamp not null default current_timestamp
 , INDEX(projectid)
    , INDEX(dateCreated)
, FOREIGN KEY (projectid) REFERENCES projects(id) 
);

/* Stores the services obtained from a WSDL or WADL uri.
  Used for service URI building in the load tester GUI. */
create table if not exists services (
      id int primary key not null auto_increment
    , name varchar(255)
    , descriptionUri varchar(1024)
    , baseUri varchar(1024)
    , testUri varchar(1024)
    , method varchar(256)
    , parameters varchar(256)
    , INDEX(name)
);

create table if not exists webprojects (
id int primary key not null auto_increment
, data longtext
);

create table if not exists webstats (
id int primary key not null auto_increment
,projectid int not null
,uri varchar(255)
,responsetime int
, testdate timestamp not null default current_timestamp
,INDEX(projectid)
, FOREIGN KEY (projectid) REFERENCES webprojects(id)
);

insert into stats.users values (0, 'Demo', '$2a$10$4Mss6qmmc8FLwLe8sIXrP.1Y1B41Hgagi4nKDmeqk3kT1POnbzmI6', 'Demo', 'Demo@loadtester.com');
insert into stats.users values (1, 'adekola', '$2a$10$4Mss6qmmc8FLwLe8sIXrP.1Y1B41Hgagi4nKDmeqk3kT1POnbzmI6', 'Adekola', 'adekola@loadtester.com');
insert into stats.users values (2, 'jguo', '$2a$10$4Mss6qmmc8FLwLe8sIXrP.1Y1B41Hgagi4nKDmeqk3kT1POnbzmI6', 'Jiang Guo', 'jguo@loadtester.com');

INSERT INTO `services` VALUES (1,'Global Weather','http://www.webservicex.net/globalweather.asmx?WSDL','http://www.webservicex.net/globalweather.asmx/','http://www.webservicex.net/globalweather.asmx/GetWeather?CountryName=Spain&CityName=Madrid','GetWeather','CountryName,CityName'),
(2,'Global Weather','http://www.webservicex.net/globalweather.asmx?WSDL','http://www.webservicex.net/globalweather.asmx/','http://www.webservicex.net/globalweather.asmx/GetCitiesByCountry?CountryName=China','GetCitiesByCountry','CountryName'),
(3,'Medicare Supplier','http://www.webservicex.net/medicareSupplier.asmx?WSDL','http://www.webservicex.net/medicareSupplier.asmx/','http://www.webservicex.net/medicareSupplier.asmx/GetSupplierByZipCode?zip=90210','GetSupplierByZipCode','zip'),
(4,'Medicare Supplier','http://www.webservicex.net/medicareSupplier.asmx?WSDL','http://www.webservicex.net/medicareSupplier.asmx/',NULL,'GetSupplierBySupplyType','description'),
(5,'Medicare Supplier','http://www.webservicex.net/medicareSupplier.asmx?WSDL','http://www.webservicex.net/medicareSupplier.asmx/','http://www.webservicex.net/medicareSupplier.asmx/GetSupplierByCity?City=New York','GetSupplierByCity','City'),
(6,'Bible','http://www.webservicex.net/BibleWebservice.asmx?WSDL','http://www.webservicex.net/BibleWebservice.asmx/',NULL,'GetBibleWordsbyKeyWord','BibleWords'),
(7,'Bible','http://www.webservicex.net/BibleWebservice.asmx?WSDL','http://www.webservicex.net/BibleWebservice.asmx/',NULL,'GetBookTitles',''),
(8,'Bible','http://www.webservicex.net/BibleWebservice.asmx?WSDL','http://www.webservicex.net/BibleWebservice.asmx/',NULL,'GetBibleWordsByChapterAndVerse','chapter,BookTitle,Verse'),
(9,'Bible','http://www.webservicex.net/BibleWebservice.asmx?WSDL','http://www.webservicex.net/BibleWebservice.asmx/',NULL,'GetBibleWordsByBookTitleAndChapter','chapter,BookTitle'),
(10,NULL,NULL,NULL,'http://localhost:8080/loadtester/v1/math/gcd?x=20&y=100',NULL,NULL),
(11,NULL,NULL,NULL,'http://localhost:8080/loadtester/v1/math/lcm?x=54&y=109',NULL,NULL),
(12,NULL,NULL,NULL,'http://localhost:8080/loadtester/v1/math/nfibonacci?n=15',NULL,NULL),
(13,NULL,NULL,NULL,'http://localhost:8080/loadtester/v1/math/fibnumbers?n=5',NULL,NULL),
(14,NULL,NULL,NULL,'http://localhost:8080/loadtester/v1/math/validcc?CreditCardStr=1234567812345678',NULL,NULL),
(15,NULL,NULL,NULL,'http://nasa-direct-stem.azurewebsites.net/webservice/v1/math/gcd?x=20&y=100',NULL,NULL),
(16,NULL,NULL,NULL,'http://nasa-direct-stem.azurewebsites.net/webservice/v1/math/lcm?x=54&y=109',NULL,NULL),
(17,NULL,NULL,NULL,'http://nasa-direct-stem.azurewebsites.net/webservice/v1/math/nfibonacci?n=15',NULL,NULL),
(18,NULL,NULL,NULL,'http://nasa-direct-stem.azurewebsites.net/webservice/v1/math/fibnumbers?n=5',NULL,NULL),
(19,NULL,NULL,NULL,'http://nasa-direct-stem.azurewebsites.net/webservice/v1/math/validcc?CreditCardStr=1234567812345678',NULL,NULL);

