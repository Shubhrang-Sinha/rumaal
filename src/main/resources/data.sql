-- =============================================
-- Rumaal (रूमाल) — High-Demand Indian & World Blockbusters Seed Data
-- PostgreSQL 16 Compatible
-- =============================================

-- 1. Cities
INSERT INTO cities (name, state) VALUES 
('Mumbai', 'Maharashtra'),
('Delhi', 'Delhi'),
('Bangalore', 'Karnataka'), 
('Hyderabad', 'Telangana'),
('Chennai', 'Tamil Nadu'),
('Pune', 'Maharashtra'), 
('Kolkata', 'West Bengal'),
('Ahmedabad', 'Gujarat')
ON CONFLICT (name) DO NOTHING;

-- 2. Demo User (password is 'password123' hashed with BCrypt-12)
INSERT INTO users (name, email, password, phone, role, created_at) VALUES 
('Shubhrang Sinha', 'shubhrang@example.com', '$2a$12$ZqC4Xy7.90q/nS3l7W1PaeO8gVwM7hF0g6c6C5i8r.Kz7eK7V1p2a', '9876543210', 'USER', CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- 3. Blockbuster Movies with Verified High-Res TMDB Posters
INSERT INTO movies (title, description, genre, language, duration_minutes, rating, release_date, poster_url) VALUES 
('Pushpa 2: The Rule', 'The clash between Pushpa Raj and Bhanwar Singh Shekhawat escalates into an all-out territorial war.', 'Action', 'Telugu', 165, 9.2, '2024-12-05', 'https://image.tmdb.org/t/p/original/bhxZj3y59cK7JtGdV285dhDRaMe.jpg'),
('Stree 2', 'A headless monstrous demon known as Sarkata terrifies Chanderi, forcing the gang to seek unexpected help.', 'Horror', 'Hindi', 147, 8.5, '2024-08-15', 'https://image.tmdb.org/t/p/original/nfnhwfUEFuSOxxf4jDdBlY6Lccw.jpg'),
('Kalki 2898 AD', 'Set in a post-apocalyptic world in the year 2898 AD, a modern avatar of Vishnu descends to protect the world.', 'Sci-Fi', 'Telugu', 181, 8.1, '2024-06-27', 'https://image.tmdb.org/t/p/original/4P3K5medethmTlsuN7UN5bmnATq.jpg'),
('Jawan', 'A high-voltage emotional action journey of a man who is set to rectify the wrongs in the society.', 'Action', 'Hindi', 169, 7.8, '2023-09-07', 'https://image.tmdb.org/t/p/original/gTV8RAYEKDcRwn4TFbUZfRk5Nsj.jpg'),
('Animal', 'A toxic and intense relationship between a father and son leads to violent consequences and family feuds.', 'Drama', 'Hindi', 201, 7.6, '2023-12-01', 'https://image.tmdb.org/t/p/original/14zedCaF044yj3at1TJ2uHpaNQD.jpg'),
('RRR', 'A fearless warrior and an ambitious officer in British India come together to forge an unforgettable friendship.', 'Action', 'Telugu', 187, 8.7, '2022-03-25', 'https://image.tmdb.org/t/p/original/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg'),
('Baahubali 2: The Conclusion', 'Shiva, the son of Bahubali, learns about his royal heritage and seeks vengeance against Bhallaladeva.', 'Action', 'Telugu', 167, 8.8, '2017-04-28', 'https://image.tmdb.org/t/p/original/21sC2assImQIYCEDA84Qh9d1RsK.jpg'),
('K.G.F: Chapter 2', 'In the blood-soaked Kolar Gold Fields, Rocky''s name strikes fear into his foes, but the government views him as a threat.', 'Action', 'Kannada', 168, 8.4, '2022-04-14', 'https://image.tmdb.org/t/p/original/au6Nq6kVr9NFICzpmYtMSyDA3Gi.jpg'),
('Kantara', 'When greed paves the way for betrayal and wrath, a young tribal champion takes up the mantle of his ancestors.', 'Drama', 'Kannada', 148, 8.2, '2022-09-30', 'https://image.tmdb.org/t/p/original/lqkaDoxdKC9PhLtIfAdAVCtQTvM.jpg'),
('Vikram', 'A special agent investigates a murder committed by a masked group of serial killers leading to a drug syndicate.', 'Thriller', 'Tamil', 175, 8.3, '2022-06-03', 'https://image.tmdb.org/t/p/original/774UV1aCURb4s4JfEFg3IEMu5Zj.jpg'),
('Leo', 'A mild-mannered cafe owner in Himachal Pradesh is mistaken for a ruthless gangster by a drug cartel.', 'Action', 'Tamil', 164, 7.3, '2023-10-19', 'https://image.tmdb.org/t/p/original/t1oAdt8JjUs4sHEBvE8fKtjV7er.jpg'),
('Jailer', 'A retired police officer must return to action when his son disappears during an investigation into an idol smuggling ring.', 'Action', 'Tamil', 168, 7.5, '2023-08-10', 'https://image.tmdb.org/t/p/original/p933oBZpchdX8KA29gPVKBxGlyU.jpg'),
('3 Idiots', 'Two friends embark on a quest for a lost buddy who inspired them to think independently during engineering college.', 'Comedy', 'Hindi', 170, 8.4, '2009-12-25', 'https://image.tmdb.org/t/p/original/66A9MqXOyVFCssoloscw79z8Tew.jpg'),
('Dangal', 'Former wrestler Mahavir Singh Phogat trains his young daughters Geeta and Babita to become world-class gold medalists.', 'Drama', 'Hindi', 161, 8.3, '2016-12-23', 'https://image.tmdb.org/t/p/original/3n8888uKuaxPBBuDUqJhfhrWlgA.jpg'),
('PK', 'An innocent alien stranded on Earth questions the dogmas and blind superstitions created by human religious leaders.', 'Comedy', 'Hindi', 153, 8.1, '2014-12-19', 'https://image.tmdb.org/t/p/original/uqoAHhuKZnWxzXbXSUycgpLPmUW.jpg'),
('Bajrangi Bhaijaan', 'A devoted man with a golden heart takes on the impossible task of escorting a mute Pakistani girl back to her family.', 'Drama', 'Hindi', 159, 8.1, '2015-07-17', 'https://image.tmdb.org/t/p/original/hGIlHgQC2RnS8xTlE3nuTDXanYC.jpg'),
('Drishyam 2', 'Seven years after the case was closed, a series of unexpected events threatens to uncover the truth buried by Georgekutty.', 'Thriller', 'Hindi', 140, 8.2, '2022-11-18', 'https://image.tmdb.org/t/p/original/pcuGo5KfNkGhftnb1uFEXCN4Gpa.jpg'),
('Pathaan', 'An exiled RAW agent returns to take down a private terror outfit threatening India with a deadly synthetic biological weapon.', 'Action', 'Hindi', 146, 7.1, '2023-01-25', 'https://image.tmdb.org/t/p/original/m1b97ofvnYpCH9uGguML986eUfS.jpg'),
('Gadar 2', 'During the Indo-Pakistani War of 1971, Tara Singh braves enemy territory once again to rescue his captured son.', 'Action', 'Hindi', 170, 7.5, '2023-08-11', 'https://image.tmdb.org/t/p/original/unmYQ3t03AnS492iE9rWwV35N7t.jpg'),
('Pushpa: The Rise', 'A laborer rises through the ranks of a red sandalwood smuggling syndicate, making formidable enemies along the way.', 'Action', 'Telugu', 179, 7.6, '2021-12-17', 'https://image.tmdb.org/t/p/original/oaRk2HgOirEeNuDCwwScmq7rKvS.jpg');

-- 4. Theaters
INSERT INTO theaters (name, address, city_id) VALUES 
('PVR Phoenix Palladium', 'Lower Parel, Mumbai', 1),
('PVR Director''s Cut', 'Vasant Kunj, New Delhi', 2),
('INOX Mantri Square', 'Malleshwaram, Bangalore', 3),
('AMB Cinemas', 'Gachibowli, Hyderabad', 4),
('Sathyam Cinemas', 'Royapettah, Chennai', 5);

-- 5. Screens
INSERT INTO screens (name, total_seats, theater_id) VALUES 
('IMAX Laser 1', 25, 1),
('Dolby Atmos Audi 2', 25, 1),
('Gold Class Audi 1', 25, 2),
('Screen 1 Superplex', 25, 4),
('Insignia VIP Screen', 25, 3);

-- 6. Interactive Seat Layout (25 seats per screen: 10 Regular, 10 Premium, 5 VIP)
INSERT INTO seats (seat_number, seat_row, seat_col, seat_type, screen_id)
SELECT 'A' || col, 'A', col, 'REGULAR', s.id
FROM screens s, generate_series(1, 10) as col
UNION ALL
SELECT 'B' || col, 'B', col, 'PREMIUM', s.id
FROM screens s, generate_series(1, 10) as col
UNION ALL
SELECT 'C' || col, 'C', col, 'VIP', s.id
FROM screens s, generate_series(1, 5) as col;

-- 7. Shows for Current and Upcoming Dates
INSERT INTO shows (movie_id, screen_id, show_date, start_time, end_time, ticket_price)
SELECT 
  m.id,
  ((m.id % 5) + 1) AS screen_id,
  CURRENT_DATE + d AS show_date,
  CASE t 
    WHEN 1 THEN '10:00:00'::TIME
    WHEN 2 THEN '14:00:00'::TIME
    WHEN 3 THEN '18:00:00'::TIME
    ELSE '21:30:00'::TIME
  END AS start_time,
  CASE t 
    WHEN 1 THEN '12:30:00'::TIME
    WHEN 2 THEN '16:30:00'::TIME
    WHEN 3 THEN '20:30:00'::TIME
    ELSE '23:59:00'::TIME
  END AS end_time,
  250.00 + (t * 50.00) AS ticket_price
FROM movies m
CROSS JOIN generate_series(0, 3) AS d
CROSS JOIN generate_series(1, 4) AS t
WHERE m.id <= 20;

-- 8. Concurrency Inventory: Populate show_seats for all newly created shows
INSERT INTO show_seats (show_id, seat_id, status)
SELECT sh.id, se.id, 'AVAILABLE'
FROM shows sh
JOIN seats se ON sh.screen_id = se.screen_id
ON CONFLICT (show_id, seat_id) DO NOTHING;
