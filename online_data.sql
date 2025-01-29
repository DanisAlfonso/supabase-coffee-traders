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
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, user_id, status, total_amount, shipping_fee, stripe_session_id, stripe_payment_intent_id, shipping_address_line1, shipping_address_line2, shipping_city, shipping_postal_code, shipping_country, customer_email, customer_name, customer_phone, created_at, updated_at) FROM stdin;
d4c0653e-63f6-4a9a-9c3a-98a4fe744842	da5c5261-9ef4-49ea-8576-592931997407	shipped	23.99	5.00	cs_test_a1P8rnZDKLOJV67Ma8akSUFDnnpZ4l4B3U5HQtOadalDa0wXwvqJsxl33u	pi_3Qmg0IP3sunYZ0pB054HWwuB	Stolzenroth	12	Pommersfelden	96178	DE	danis.alfonso.testing1@gmail.com	Danis Ramirez	015235863821	2025-01-29 18:28:48.424805+00	2025-01-29 18:33:08.338082+00
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, name, description, price, image_url, origin, stock, created_at, updated_at) FROM stdin;
358e323a-10bb-48ba-ae80-06c8bf1213bb	Brazilian Santos	Medium roast with notes of chocolate and nuts	14.99	/products/brasil-santos.jpeg	Brazil	100	2025-01-29 18:17:16.018994+00	2025-01-29 18:17:16.018994+00
d91192c8-8c7a-4b81-ac37-8fbd1afbf2b9	Colombian Supremo	Full-bodied with caramel sweetness	16.99	/products/colombian-supremo.jpg	Colombia	85	2025-01-29 18:17:16.018994+00	2025-01-29 18:17:16.018994+00
3eeb2a2f-6e87-4342-999b-8e60953a107c	Costa Rican Tarrazu	Bright acidity with hints of citrus	17.99	/products/costa-rica-tarrazu.jpg	Costa Rica	90	2025-01-29 18:17:16.018994+00	2025-01-29 18:17:16.018994+00
33d6f8d8-2f09-4c36-b43b-c5cc422ec7aa	Kenyan AA	Bold and complex with wine-like acidity	19.99	/products/kenya-aa.jpg	Kenya	60	2025-01-29 18:17:16.018994+00	2025-01-29 18:17:16.018994+00
e3b10018-ac1d-448d-8a09-c5c5ed4f9b91	Guatemala Antigua	Medium roast with spicy and smoky notes	15.99	/products/guatemala-antigua.jpg	Guatemala	80	2025-01-29 18:17:16.018994+00	2025-01-29 18:17:16.018994+00
a2f302dc-7534-4f4a-8e40-b09366910ed5	Ethiopian Yirgacheffe	Light roast with floral and citrus notes	18.99	/products/ethiopian.jpg	Ethiopia	74	2025-01-29 18:17:16.018994+00	2025-01-29 18:28:48.718062+00
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, product_id, quantity, unit_price, total_price, created_at) FROM stdin;
01271ec8-5b11-48ec-ade4-1ec27da2cc65	d4c0653e-63f6-4a9a-9c3a-98a4fe744842	a2f302dc-7534-4f4a-8e40-b09366910ed5	1	18.99	18.99	2025-01-29 18:28:48.621978+00
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.profiles (id, email, full_name, phone, default_shipping_address_line1, default_shipping_address_line2, default_shipping_city, default_shipping_postal_code, default_shipping_country, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.settings (id, store, shipping, email, payment, created_at, updated_at) FROM stdin;
1	{"name": "Coffee Traders", "currency": "EUR", "timezone": "Europe/Berlin", "description": "Premium European Coffee Trading Platform"}	{"allowedCountries": ["DE", "FR", "IT", "ES", "NL", "BE", "AT", "PL"], "defaultShippingFee": 5, "freeShippingThreshold": 50}	{"shippingUpdates": true, "orderConfirmation": true, "promotionalEmails": false}	{"currency": "EUR", "allowedMethods": ["card", "sepa_debit"]}	2025-01-29 18:17:16.888021+00	2025-01-29 18:17:16.888021+00
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_roles (user_id, role, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, created_at, metadata) FROM stdin;
da5c5261-9ef4-49ea-8576-592931997407	danis.alfonso.testing1@gmail.com	2025-01-29 18:27:35.24144+00	{"name": null, "phone": null, "address": null}
f4862dcd-617b-44b4-bc30-7d62c472fd5f	danny.ramrez7@gmail.com	2025-01-29 18:32:04.204183+00	{"name": "Danis", "phone": null, "address": null}
\.


--
-- PostgreSQL database dump complete
--

