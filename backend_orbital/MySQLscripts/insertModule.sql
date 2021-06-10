# obtained data on moduleCode, moduleTitle from https://api.nusmods.com/v2/2020-2021/moduleList.json
# add value of foreign key

SET SQL_SAFE_UPDATES = 0;
UPDATE Module
	SET tagID = 'Module';
SET SQL_SAFE_UPDATES = 1;