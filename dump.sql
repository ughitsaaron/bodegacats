--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.reactions DROP CONSTRAINT reactions_cat_id_fkey;
ALTER TABLE ONLY public.photos DROP CONSTRAINT photos_cat_id_fkey;
ALTER TABLE ONLY public.cats DROP CONSTRAINT cats_creator_id_fkey;
ALTER TABLE ONLY public.users DROP CONSTRAINT user_id;
ALTER TABLE ONLY public.reactions DROP CONSTRAINT reaction_id;
ALTER TABLE ONLY public.photos DROP CONSTRAINT photo_id;
ALTER TABLE ONLY public.cats DROP CONSTRAINT cat_id;
DROP TABLE public.users;
DROP TABLE public.reactions;
DROP TABLE public.photos;
DROP TABLE public.cats;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cats (
    id uuid NOT NULL,
    lat numeric NOT NULL,
    lng numeric NOT NULL,
    creator_id uuid NOT NULL
);


ALTER TABLE public.cats OWNER TO postgres;

--
-- Name: photos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.photos (
    id uuid NOT NULL,
    uri text NOT NULL,
    cat_id uuid
);


ALTER TABLE public.photos OWNER TO postgres;

--
-- Name: reactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reactions (
    id uuid NOT NULL,
    cat_id uuid,
    code text NOT NULL
);


ALTER TABLE public.reactions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    display_name text NOT NULL,
    email text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: cats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cats (id, lat, lng, creator_id) FROM stdin;
437eabb9-35cd-464f-8e04-42344372bac1	42.360606	-73.598064	2e7ad2bb-8e5a-4dda-8455-314cc00e2359
70090126-afe7-45ba-8553-943d8f75dce2	42.362606	-73.578064	2e7ad2bb-8e5a-4dda-8455-314cc00e2359
bfec3bd8-6b41-4b4d-81cf-63639e5d5fb3	42.392606	-73.608064	49946fcb-5443-4ffb-845d-d6bb24660074
\.


--
-- Data for Name: photos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.photos (id, uri, cat_id) FROM stdin;
\.


--
-- Data for Name: reactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reactions (id, cat_id, code) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, display_name, email) FROM stdin;
2e7ad2bb-8e5a-4dda-8455-314cc00e2359	blerg barnson	blarg@aol.com
49946fcb-5443-4ffb-845d-d6bb24660074	general kraut	kraut@aol.com
\.


--
-- Name: cats cat_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cats
    ADD CONSTRAINT cat_id PRIMARY KEY (id);


--
-- Name: photos photo_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photo_id PRIMARY KEY (id);


--
-- Name: reactions reaction_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT reaction_id PRIMARY KEY (id);


--
-- Name: users user_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_id PRIMARY KEY (id);


--
-- Name: cats cats_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cats
    ADD CONSTRAINT cats_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id);


--
-- Name: photos photos_cat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photos_cat_id_fkey FOREIGN KEY (cat_id) REFERENCES public.cats(id);


--
-- Name: reactions reactions_cat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT reactions_cat_id_fkey FOREIGN KEY (cat_id) REFERENCES public.cats(id);


--
-- PostgreSQL database dump complete
--

