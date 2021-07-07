# obtained data on moduleCode, moduleTitle from https://api.nusmods.com/v2/2021-2022/moduleList.json
# add value of foreign key

SET SQL_SAFE_UPDATES = 0;
UPDATE Module
	SET tagID = 'Module';
SET SQL_SAFE_UPDATES = 1;