--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.6 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	da5c5261-9ef4-49ea-8576-592931997407	authenticated	authenticated	danis.alfonso.testing1@gmail.com	$2a$10$C5WBst9.TmIvGfrxSyvkQOAyGFN9.PG3UQn7aLA9UT5Iqr0zFqA/K	2025-01-29 18:27:45.279969+00	\N		2025-01-29 18:27:35.277987+00		\N			\N	2025-01-29 18:27:57.115036+00	{"provider": "email", "providers": ["email"]}	{"sub": "da5c5261-9ef4-49ea-8576-592931997407", "email": "danis.alfonso.testing1@gmail.com", "email_verified": true, "phone_verified": false}	\N	2025-01-29 18:27:35.241779+00	2025-01-29 18:27:57.140099+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	f4862dcd-617b-44b4-bc30-7d62c472fd5f	authenticated	authenticated	danny.ramrez7@gmail.com	$2a$10$uL2zjj4yBMfAMcV27Eaz4OWIg6FRVQePlx0whb2ojEXoaF8gmlYXq	2025-01-29 18:32:42.508006+00	\N		2025-01-29 18:32:04.218104+00		\N			\N	2025-01-29 18:32:57.558546+00	{"provider": "email", "providers": ["email"]}	{"sub": "f4862dcd-617b-44b4-bc30-7d62c472fd5f", "email": "danny.ramrez7@gmail.com", "email_verified": true, "phone_verified": false}	\N	2025-01-29 18:32:04.20454+00	2025-01-29 18:32:57.560727+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- PostgreSQL database dump complete
--

