DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS cats;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS reactions;

CREATE TABLE IF NOT EXISTS users (
  id            uuid ,
  display_name  text NOT NULL,
  email         text NOT NULL,
  CONSTRAINT user_id PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS cats (
  id          uuid,
  lat         float NOT NULL,
  lng         float NOT NULL,
  creator_id  uuid NOT NULL references users(id),
  CONSTRAINT cat_id PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS photos (
  id          uuid,
  uri         text NOT NULL,
  cat_id      uuid references cats(id),
  CONSTRAINT photo_id PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS reactions (
  id        uuid,
  cat_id    uuid references cats(id),
  code      text NOT NULL,
  CONSTRAINT reaction_id PRIMARY KEY(id)
);
