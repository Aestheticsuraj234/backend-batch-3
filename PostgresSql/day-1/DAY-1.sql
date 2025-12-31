DROP DATABASE test;

-- bASIC TABLE COMMANDS (CRUD)

CREATE TABLE students (
id int,
fname varchar(50),
lname varchar(50),
email varchar(100),
class_name varchar(50),
marks  int
);

-- insert
INSERT INTO STUDENTS
VALUES
  (5, 'Riya',  'Sharma',  '[email protected]',  'BCA-1', 88),
  (6, 'Aman',  'Verma',   '[email protected]',  'BCA-2', 76),
  (7, 'Neha',  'Singh',   '[email protected]', 'BCA-2', 82);

-- select
-- ALL ROWS

SELECT * FROM students;

SELECT fname , class_name , marks FROM students;


SELECT * FROM students WHERE class_name = 'BCA-1';



-- update

UPDATE students
SET marks = 91
WHERE id = 3;

update students set marks = marks + 5 where class_name = 'BCA-2';


--delete

delete from students
where id = 2


delete from students
where class_name = 'BCA-2'



