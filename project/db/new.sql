DROP TABLE IF EXISTS marks CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS course CASCADE;
DROP TABLE IF EXISTS user_cources CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_role CASCADE;

CREATE TABLE user_role (
    id SERIAL PRIMARY KEY,
    role VARCHAR(100) NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    phone BIGINT,
    email VARCHAR(100) NOT NULL UNIQUE,
    role_id BIGINT REFERENCES user_role(id)
);

CREATE TABLE user_cources (
    id SERIAL PRIMARY KEY,
    total_price BIGINT,
    user_id BIGINT REFERENCES users(id),
    cource_id BIGINT
);

CREATE TABLE course (
    id SERIAL PRIMARY KEY,
    user_cource_id BIGINT REFERENCES user_cources(id),
    price BIGINT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES course(id),
    curriculum_id BIGINT,
    start_time TIME,
    end_time INTEGER,
    teacher_id BIGINT REFERENCES users(id),
    position BIGINT
);

CREATE TABLE marks (
    id SERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES users(id),
    teacher_id BIGINT REFERENCES users(id),
    mark_volume BIGINT,
    lesson_id BIGINT REFERENCES lessons(id)
);

INSERT INTO user_role (role) VALUES
('student'),
('teacher'),
('admin');
select * from user_role;
-- INSERT INTO users (login, password, phone, email, role_id) VALUES
-- ('student1', 'pass1', 1234567890, 'student1@example.com', 1),
-- ('teacher1', 'pass2', 1234567891, 'teacher1@example.com', 2),
-- ('admin1', 'pass3', 1234567892, 'admin1@example.com', 3),
-- ('student2', 'pass4', 1234567893, 'student2@example.com', 1),
-- ('teacher2', 'pass5', 1234567894, 'teacher2@example.com', 2);

INSERT INTO user_cources (id, total_price, user_id, cource_id) VALUES
(1, 5000, 1, 1);

select * from user_cources;

INSERT INTO course (id, user_cource_id, price, name) VALUES
(1, 1, 5000, 'Mathematics');
select * from course;

INSERT INTO lessons (id,course_id, curriculum_id, start_time, end_time, teacher_id, position) VALUES
(1,1, 101, '09:00:00', 60, 2, 1);
select * from lessons;
select * from users;

INSERT INTO marks (student_id, teacher_id, mark_volume, lesson_id) VALUES
(3, 2, 8, 1);


/*
{
        "login": "admin",
        "password": "123",
        "phone": "123456789023",
        "email": "admin@mail.com",
        "role_id": "3"
},

{
        "login": "teacher1",
        "password": "123",
        "phone": "123456789023",
        "email": "teacher@mail.com",
        "role_id": "2"
},

{
        "login": "student1",
        "password": "123",
        "phone": "123456789023",
        "email": "stud@mail.com",
        "role_id": "1"
}
*\

