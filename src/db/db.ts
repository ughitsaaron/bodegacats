import pg from 'pg';

const { Client } = pg;
const client = new Client({
  user: 'postgres',
  password: 'postgres',
  database: 'bodegacats'
});

const initSeed = `
CREATE TABLE IF NOT EXISTS users (
  id            uuid ,
  display_name  numeric NOT NULL,
  email         numeric NOT NULL,
  CONSTRAINT user_id PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS cats (
  id          uuid,
  lat         numeric NOT NULL,
  lng         numeric NOT NULL,
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
`;

try {
  await client.connect();
  await client.query(initSeed);
} catch (e) {
  console.log('Error initializing database', e);
}

export const db = client;
