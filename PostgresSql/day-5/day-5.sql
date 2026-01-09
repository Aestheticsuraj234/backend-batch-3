CREATE TABLE tech_youtubers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    channel VARCHAR(100),
    tech VARCHAR(50),
    subscribers_millions NUMERIC(4,2),
    active BOOLEAN DEFAULT true
);

INSERT INTO tech_youtubers (name, channel, tech, subscribers_millions)
VALUES
('Hitesh Choudhary', 'Chai aur Code', 'JavaScript', 1.60),
('Anuj Bhaiya', 'Coding Shuttle', 'DSA', 0.85),
('Akshay Saini', 'Namaste JavaScript', 'JavaScript', 1.20),
('CodeWithHarry', 'CodeWithHarry', 'Full Stack', 5.80),
('Kunal Kushwaha', 'Kunal Kushwaha', 'DSA', 1.00);

select * from tech_youtubers;

CREATE FUNCTION total_youtubers()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
        ---logic
       RETURN (SELECT COUNT(*) FROM tech_youtubers);

END;
$$;       

SELECT total_youtubers

CREATE FUNCTION get_youtubers_by_tech(p_tech VARCHAR)
RETURN TABLE(name VARCHAR , channel VARCHAR)
LANGUAGE plpgsql

AS $$
BEGIN
    RETURN QUERY
    SELECT name, channel
    FROM tech_youtubers
    WHERE tech = p_tech;
END;
$$;



















