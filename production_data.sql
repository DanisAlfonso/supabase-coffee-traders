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

INSERT INTO public.orders VALUES ('73f4f5ac-40b9-46b2-82c1-9de276727b31', 'd4125af2-9538-44a4-adfe-13ca1ddde2b3', 'shipped', 21.99, 5.00, 'cs_test_a10SwUWv0Inqii1Ei1rrn0Kp1hg6FLIo3vZRBNdLKuTcKRhHqhE3l97MKD', 'pi_3QmWWHP3sunYZ0pB1T6HfycW', 'Stolzenroth', '12', 'Pommersfelden', '96178', 'DE', 'danis.alfonso.testing1@gmail.com', 'Danis', '015235863821', '2025-01-29 08:21:13.205716+00', '2025-01-29 08:24:59.121712+00');
INSERT INTO public.orders VALUES ('4eac928b-d1a5-4983-99da-5522235779f4', 'd4125af2-9538-44a4-adfe-13ca1ddde2b3', 'processing', 23.99, 5.00, 'cs_test_a1I1nrUYRrcHJodGzcXtL9a6rdWwnhAO4vaIDsthGzkqiw5xAHPKwVP0Kb', 'pi_3QmXcOP3sunYZ0pB0ncEcbXo', 'Stolzenroth', '12', 'Pommersfelden', '96178', 'DE', 'danis.alfonso.testing1@gmail.com', 'Danis', '015235863821', '2025-01-29 09:31:35.02446+00', '2025-01-29 09:31:35.02446+00');
INSERT INTO public.orders VALUES ('dbfd1fe0-14ad-4ee1-86dd-d24d3b857498', 'd4125af2-9538-44a4-adfe-13ca1ddde2b3', 'shipped', 24.99, 5.00, 'cs_test_a1CifFNV53Tj4BaU10EMltAYJJDDDJk7omY7IkJnPfK4qQTLzcWOnZBYfb', 'pi_3QmXXsP3sunYZ0pB16rhVSNy', 'Stolzenroth', '12', 'Pommersfelden', '96178', 'DE', 'danis.alfonso.testing1@gmail.com', 'Danis', '015235863821', '2025-01-29 09:26:55.281648+00', '2025-01-29 09:32:11.189655+00');
INSERT INTO public.orders VALUES ('9b1667f4-3ca5-4e18-8fbb-171442df5432', 'd4125af2-9538-44a4-adfe-13ca1ddde2b3', 'processing', 24.99, 5.00, 'cs_test_a1mzfa29g3PAUfsJtszCvZSgkiN4HCrgGfNYNnLx2RifO63BGfSlU5Q3jg', 'pi_3QmXjsP3sunYZ0pB0cQJUXcs', 'Stolzenroth', '12', 'Pommersfelden', '96178', 'DE', 'danis.alfonso.testing1@gmail.com', 'Danis', '015235863821', '2025-01-29 09:39:20.375986+00', '2025-01-29 09:39:20.375986+00');
INSERT INTO public.orders VALUES ('4c107646-d3f3-4746-aca3-4c92ec7adc5e', 'd4125af2-9538-44a4-adfe-13ca1ddde2b3', 'processing', 23.99, 5.00, 'cs_test_a1v7j2f4hlwfLiex3t932VRotzM91B2EwSdQhVfeAynldPQGyqG5sqJV22', 'pi_3QmXmIP3sunYZ0pB1auY6Jek', 'Stolzenroth', '12', 'Pommersfelden', '96178', 'DE', 'danis.alfonso.testing1@gmail.com', 'Danis', '015235863821', '2025-01-29 09:41:48.482632+00', '2025-01-29 09:41:48.482632+00');
INSERT INTO public.orders VALUES ('48efc804-ffab-43e3-a365-379341a5a9f2', 'd4125af2-9538-44a4-adfe-13ca1ddde2b3', 'processing', 184.90, 5.00, 'cs_test_a1sKprYb5lldzubh76CUyE9at5VvOptNrSrW4VnT1HPbUKP1yFpDhJcVdU', 'pi_3Qmbs7P3sunYZ0pB1dzuE7gq', 'Stolzenroth', '12', 'Pommersfelden', '96178', 'DE', 'danis.alfonso.testing1@gmail.com', 'Danis', '015235863821', '2025-01-29 14:04:05.825049+00', '2025-01-29 14:04:05.825049+00');
INSERT INTO public.orders VALUES ('5a0b9c00-d5ff-48d7-8689-66fb2ff49a62', 'd4125af2-9538-44a4-adfe-13ca1ddde2b3', 'processing', 21.99, 5.00, 'cs_test_a1d6ltkt6s9Jtz3XG9DQOOjJfOje2V8kLHXJOfh3ItFb6qCQ1SHeBFE6ah', 'pi_3QmbxgP3sunYZ0pB0RBPT0ed', 'Stolzenroth', '12', 'Pommersfelden', '96178', 'DE', 'danis.alfonso.testing1@gmail.com', 'Danis', '015235863821', '2025-01-29 14:09:51.175897+00', '2025-01-29 14:09:51.175897+00');
INSERT INTO public.orders VALUES ('fc2b1bf1-571e-4329-9cc7-5656a6094645', 'd4125af2-9538-44a4-adfe-13ca1ddde2b3', 'processing', 55.97, 5.00, 'cs_test_a1nQcEmqxSbdyfgZDd0BQ1QuJHp0LDTGjkAWbBbUyRttxFGkDwhRSsuHTU', 'pi_3Qme3CP3sunYZ0pB0ZOV45lA', 'Stolzenroth', '12', 'Pommersfelden', '96178', 'DE', 'danis.alfonso.testing1@gmail.com', 'Danis', '015235863821', '2025-01-29 16:23:40.978697+00', '2025-01-29 16:23:40.978697+00');
INSERT INTO public.orders VALUES ('fc42f963-2a72-449f-a7ab-5ebfb39f2c74', 'd4125af2-9538-44a4-adfe-13ca1ddde2b3', 'processing', 23.99, 5.00, 'cs_test_a135Mt0YQS8TtPkPxocGkk073qTg0D4UgCWcqfI8dhhlj7xng1vcY0sDuE', 'pi_3Qme75P3sunYZ0pB0l8zHklx', 'Stolzenroth', '12', 'Pommersfelden', '96178', 'DE', 'danis.alfonso.testing1@gmail.com', 'Danis', '015235863821', '2025-01-29 16:27:41.277479+00', '2025-01-29 16:27:41.277479+00');
INSERT INTO public.orders VALUES ('61a6033c-cc34-49ed-bd2f-95bbd2e7ed44', 'd4125af2-9538-44a4-adfe-13ca1ddde2b3', 'processing', 22.99, 5.00, 'cs_test_a1m80lsZEbl7iueqo7DFaihb7RxMuiyYaCfW7QfEoVazJgAKavjjCAEw1T', 'pi_3QmeExP3sunYZ0pB1v42h6di', 'Stolzenroth', '12', 'Pommersfelden', '96178', 'DE', 'danis.alfonso.testing1@gmail.com', 'Danis', '015235863821', '2025-01-29 16:35:49.623997+00', '2025-01-29 16:35:49.623997+00');
INSERT INTO public.orders VALUES ('8840bcef-441f-44d5-a49f-836cf8bb8a52', 'd4125af2-9538-44a4-adfe-13ca1ddde2b3', 'processing', 444.78, 5.00, 'cs_test_a1jFAGMFUmK1nc1dwiFZTHfUKtHYHa6lrNRdvbkkAdNHL5fPPGjD3v5ENF', 'pi_3QmepQP3sunYZ0pB0GkoHmpV', 'Stolzenroth', '12', 'Pommersfelden', '96178', 'DE', 'danis.alfonso.testing1@gmail.com', 'Danis', '015235863821', '2025-01-29 17:13:31.469409+00', '2025-01-29 17:13:31.469409+00');
INSERT INTO public.orders VALUES ('28c18154-a03f-4483-936b-6a063674b318', 'd4125af2-9538-44a4-adfe-13ca1ddde2b3', 'processing', 42.98, 5.00, 'cs_test_a18rRkstTpOShEKDz9dnVzx91kPCFXTOpVDg0m7pFq139z7pIqJVXeNrKi', 'pi_3QmfTPP3sunYZ0pB1KDM2s2X', 'Stolzenroth', '12', 'Pommersfelden', '96178', 'DE', 'danis.alfonso.testing1@gmail.com', 'Danis', '015235863821', '2025-01-29 17:54:50.423478+00', '2025-01-29 17:54:50.423478+00');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.products VALUES ('affd14c6-f010-4457-b4b9-72a582644735', 'Copán Mountain Reserve', 'Exceptional coffee from the mountains of Copán, featuring bright acidity with hints of honey, apple, and a delicate floral aroma. Direct trade partnership with local cooperatives.', 18.99, '/products/honduras-copan.jpg', 'Honduras', 83, '2025-01-29 00:09:07.25087+00', '2025-01-29 09:41:48.828612+00');
INSERT INTO public.products VALUES ('45f5ff12-024d-4c48-8e70-76c4d3546cb4', 'Honduran Marcala', 'A smooth, medium-bodied coffee with notes of caramel, chocolate, and citrus from the high-altitude Marcala region. Grown by small-scale farmers committed to sustainable practices.', 16.99, '/products/honduras-marcala.jpg', 'Honduras', 96, '2025-01-29 00:09:07.25087+00', '2025-01-29 16:23:41.223396+00');
INSERT INTO public.products VALUES ('0a8b335f-a353-4619-ad3f-e0cb09793a9c', 'El Paraiso Specialty', 'Premium coffee from El Paraiso region, distinguished by its complex flavor profile of dark chocolate, red fruits, and a sweet vanilla finish. Sourced through fair trade partnerships.', 17.99, '/products/honduras-paraiso.jpg', 'Honduras', 79, '2025-01-29 00:09:07.25087+00', '2025-01-29 16:35:49.881492+00');
INSERT INTO public.products VALUES ('ca331942-66a1-4c50-937b-6b08f5126ecf', 'Opalaca Organic', 'Certified organic coffee from the Opalaca mountain range, offering a balanced cup with notes of brown sugar, almond, and subtle berry undertones. Supporting indigenous farming communities.', 19.99, '/products/honduras-opalaca.jpg', 'Honduras', 51, '2025-01-29 00:09:07.25087+00', '2025-01-29 17:13:31.793233+00');
INSERT INTO public.products VALUES ('ad85731b-32fa-49e6-9504-785facc9b23c', 'Montecillos High Grown', 'High-altitude coffee from the Montecillos region, featuring a bright, clean cup with notes of orange blossom, honey, and toasted nuts. Supporting sustainable farming practices.', 18.99, '/products/honduras-montecillos.jpg', 'Honduras', 77, '2025-01-29 00:09:07.25087+00', '2025-01-29 17:54:50.709131+00');
INSERT INTO public.products VALUES ('ee939a86-0cae-44a8-81ed-d04202599173', 'Comayagua Valley Select', 'A rich and full-bodied coffee from the Comayagua Valley, offering flavors of milk chocolate, caramel, and subtle spices. Direct partnership with family-owned farms.', 16.99, '/products/honduras-comayagua.jpg', 'Honduras', 94, '2025-01-29 00:09:07.25087+00', '2025-01-29 08:21:13.637136+00');


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.order_items VALUES ('64e549d3-fcaf-42b7-9efe-90426854bd95', '73f4f5ac-40b9-46b2-82c1-9de276727b31', 'ee939a86-0cae-44a8-81ed-d04202599173', 1, 16.99, 16.99, '2025-01-29 08:21:13.522868+00');
INSERT INTO public.order_items VALUES ('e95cbbe2-dab1-4cdb-8ce9-c2cd60f98e61', 'dbfd1fe0-14ad-4ee1-86dd-d24d3b857498', 'ca331942-66a1-4c50-937b-6b08f5126ecf', 1, 19.99, 19.99, '2025-01-29 09:26:55.665459+00');
INSERT INTO public.order_items VALUES ('3f0096a7-dbe4-471d-8fbf-5bf4dce36402', '4eac928b-d1a5-4983-99da-5522235779f4', 'affd14c6-f010-4457-b4b9-72a582644735', 1, 18.99, 18.99, '2025-01-29 09:31:35.266706+00');
INSERT INTO public.order_items VALUES ('b9e50b85-82fe-4bfb-bbf9-2d0d94c82aa6', '9b1667f4-3ca5-4e18-8fbb-171442df5432', 'ca331942-66a1-4c50-937b-6b08f5126ecf', 1, 19.99, 19.99, '2025-01-29 09:39:20.626741+00');
INSERT INTO public.order_items VALUES ('b71127a0-b905-44c7-bc1c-6c4a3f1d6082', '4c107646-d3f3-4746-aca3-4c92ec7adc5e', 'affd14c6-f010-4457-b4b9-72a582644735', 1, 18.99, 18.99, '2025-01-29 09:41:48.669532+00');
INSERT INTO public.order_items VALUES ('c91f7b17-74f0-4b19-b829-b003326622bb', '48efc804-ffab-43e3-a365-379341a5a9f2', '0a8b335f-a353-4619-ad3f-e0cb09793a9c', 10, 17.99, 179.90, '2025-01-29 14:04:06.014874+00');
INSERT INTO public.order_items VALUES ('2c9c4a88-c532-43ed-bdf0-6b05ec2539c8', '5a0b9c00-d5ff-48d7-8689-66fb2ff49a62', '45f5ff12-024d-4c48-8e70-76c4d3546cb4', 1, 16.99, 16.99, '2025-01-29 14:09:51.377357+00');
INSERT INTO public.order_items VALUES ('113ac191-cadb-4ac7-aceb-321fa162de17', 'fc2b1bf1-571e-4329-9cc7-5656a6094645', '45f5ff12-024d-4c48-8e70-76c4d3546cb4', 3, 16.99, 50.97, '2025-01-29 16:23:41.142566+00');
INSERT INTO public.order_items VALUES ('79f6867c-4bd1-4c02-b17c-3577097e0bc7', 'fc42f963-2a72-449f-a7ab-5ebfb39f2c74', 'ad85731b-32fa-49e6-9504-785facc9b23c', 1, 18.99, 18.99, '2025-01-29 16:27:41.463374+00');
INSERT INTO public.order_items VALUES ('caf283b3-c69d-4925-9b07-1cb04a1bd2ea', '61a6033c-cc34-49ed-bd2f-95bbd2e7ed44', '0a8b335f-a353-4619-ad3f-e0cb09793a9c', 1, 17.99, 17.99, '2025-01-29 16:35:49.795145+00');
INSERT INTO public.order_items VALUES ('f747e62e-77fe-4084-a976-ede4fb311a9d', '8840bcef-441f-44d5-a49f-836cf8bb8a52', 'ca331942-66a1-4c50-937b-6b08f5126ecf', 22, 19.99, 439.78, '2025-01-29 17:13:31.694792+00');
INSERT INTO public.order_items VALUES ('4e593212-aed4-484f-a187-280e5c97da9f', '28c18154-a03f-4483-936b-6a063674b318', 'ad85731b-32fa-49e6-9504-785facc9b23c', 2, 18.99, 37.98, '2025-01-29 17:54:50.603327+00');


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.profiles VALUES ('5e3df686-f81b-4b01-aded-5711dc52e894', 'danis.ramirez.hn@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-01-26 20:55:20.33+00', '2025-01-26 20:55:20.33+00');
INSERT INTO public.profiles VALUES ('60a22e3e-8630-4a32-9cb3-3e0e09a1c4b0', 'danny.ramrez7@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-01-26 23:39:03.619854+00', '2025-01-26 23:39:03.619854+00');


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.settings VALUES (1, '{"name": "Coffee Traders", "currency": "EUR", "timezone": "Europe/Berlin", "description": "Premium European Coffee Trading Platform"}', '{"allowedCountries": ["DE", "FR", "IT", "ES", "NL", "BE", "AT", "PL"], "defaultShippingFee": 5, "freeShippingThreshold": 50}', '{"shippingUpdates": true, "orderConfirmation": true, "promotionalEmails": false}', '{"currency": "EUR", "allowedMethods": ["card", "sepa_debit"]}', '2025-01-27 12:38:32.063712+00', '2025-01-27 12:38:32.063712+00');


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES ('d4125af2-9538-44a4-adfe-13ca1ddde2b3', 'danis.alfonso.testing1@gmail.com', '2025-01-27 12:51:28.634791+00', '{"name": "Danis", "phone": "015235863821", "address": {"city": "Pommersfelden", "line1": "Stolzenroth", "line2": "12", "country": "DE", "postal_code": "96178"}}');
INSERT INTO public.users VALUES ('60a22e3e-8630-4a32-9cb3-3e0e09a1c4b0', 'danny.ramrez7@gmail.com', '2025-01-27 15:57:32.86885+00', '{"name": "DNR", "address": {"line1": "Markplatz 9"}}');


--
-- PostgreSQL database dump complete
--

