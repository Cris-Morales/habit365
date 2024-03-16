
CREATE TABLE habits (
  id integer [primary key],
  title varchar(28) NOT NULL,
  color varchar(16) NOT NULL,
  current_streak integer DEFAULT 0 NOT NULL,
  start_date date NOT NULL,
  routine_id integer,
  longest_streak integer DEFAULT 0 NOT NULL,
  created_at timestamp NOT NULL,
  intention varchar(255),
);
