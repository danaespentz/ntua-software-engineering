CREATE DATABASE IF NOT EXISTS ntuaflix;
USE ntuaflix;
CREATE TABLE IF NOT EXISTS ntuaflix.actors (
	personal_id VARCHAR(50) PRIMARY KEY,
	primaryName varchar (50),
	birthYear int,
	deathYear int,
    primaryProfession varchar (100),
    knownForTitles varchar (100),
    img_url_asset varchar (100)
);

CREATE TABLE IF NOT EXISTS ntuaflix.movies_akas (
	akas_id serial PRIMARY KEY,
	title_id VARCHAR(50),
    ordering int,
	title VARCHAR(200),
	region VARCHAR(100),
	language VARCHAR(100),
	types varchar (100),
    attributes varchar (100),
    isOriginalTitle int
);

CREATE TABLE IF NOT EXISTS ntuaflix.movies_basics (
	title_id VARCHAR(50) PRIMARY KEY,
	titleType varchar (50),
	primaryTitle varchar (100),
    originalTitle varchar (100),
	isAdult int,
	startYear int,
	endYear int,
    runtimeMinutes int,
    genres varchar (50),
    img_url_asset varchar (100)
);

CREATE TABLE IF NOT EXISTS ntuaflix.crew (
	title_id VARCHAR(50) PRIMARY KEY,
	director_ids varchar (100),
	writer_ids varchar (100)
);

CREATE TABLE IF NOT EXISTS ntuaflix.series (
	episode_id VARCHAR(50) PRIMARY KEY,
	title_id varchar (50),
	seasonNumber varchar (50),
	episodeNumber varchar (50)
);

CREATE TABLE IF NOT EXISTS ntuaflix.principals (
	principal_id serial PRIMARY KEY,
	title_id VARCHAR(50),
    ordering int,
	personal_id varchar (50),
	category varchar (50),
	job varchar(100),
	characters varchar(100),
	img_url_asset varchar(100)
);

CREATE TABLE IF NOT EXISTS ntuaflix.ratings (
	rating_id serial PRIMARY KEY,
	title_id VARCHAR(50),
	averageRating float,
    numVotes int
);

CREATE TABLE IF NOT EXISTS ntuaflix.users (
	user_id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(10),
	password VARCHAR(10),
	name VARCHAR(50),
	last_name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS ntuaflix.preferences(
    preference_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title_id VARCHAR(50),
    preference ENUM('like', 'dislike')
);
