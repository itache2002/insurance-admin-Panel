--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-08-20 23:12:56

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

--
-- TOC entry 2 (class 3079 OID 41737)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5216 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 950 (class 1247 OID 41982)
-- Name: customer_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.customer_status AS ENUM (
    'Pending',
    'Closed',
    'Denied'
);


ALTER TYPE public.customer_status OWNER TO postgres;

--
-- TOC entry 908 (class 1247 OID 41776)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'employee',
    'agent',
    'super_admin'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- TOC entry 279 (class 1255 OID 42116)
-- Name: first_day_of_month(date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.first_day_of_month(d date) RETURNS date
    LANGUAGE sql IMMUTABLE
    AS $$ SELECT date_trunc('month', d)::date $$;


ALTER FUNCTION public.first_day_of_month(d date) OWNER TO postgres;

--
-- TOC entry 278 (class 1255 OID 41774)
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;


ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 41806)
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    actor_user_id uuid,
    action character varying(60) NOT NULL,
    entity_type character varying(60),
    entity_id uuid,
    details jsonb,
    ip inet,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.activity_logs OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 41838)
-- Name: agent_bank_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agent_bank_details (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    bank_name character varying(120),
    bank_ifsc character varying(11),
    bank_account_no character varying(32),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.agent_bank_details OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 42063)
-- Name: agent_compensation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agent_compensation (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    agent_user_id uuid NOT NULL,
    base_salary numeric(12,2) DEFAULT 0 NOT NULL,
    commission_rate numeric(5,4) DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.agent_compensation OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 41887)
-- Name: agent_compensation_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agent_compensation_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    agent_user_id uuid NOT NULL,
    base_salary numeric(12,2),
    commission_rate numeric(5,4),
    effective_from timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.agent_compensation_history OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 41854)
-- Name: agent_education_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agent_education_details (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    edu_10 character varying(120),
    edu_12 character varying(120),
    edu_degree character varying(120),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.agent_education_details OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 41870)
-- Name: agent_initial_creds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agent_initial_creds (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    agent_user_id uuid NOT NULL,
    temp_password text NOT NULL,
    is_changed boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.agent_initial_creds OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 42097)
-- Name: agent_monthly_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agent_monthly_stats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    agent_user_id uuid NOT NULL,
    month date NOT NULL,
    sales_count integer DEFAULT 0 NOT NULL,
    total_premium numeric(14,2) DEFAULT 0 NOT NULL,
    total_commission numeric(14,2) DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.agent_monthly_stats OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 41901)
-- Name: agent_monthly_targets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agent_monthly_targets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    agent_user_id uuid NOT NULL,
    month date NOT NULL,
    target_value numeric(14,2) NOT NULL,
    achieved_value numeric(14,2) DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.agent_monthly_targets OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 41822)
-- Name: agent_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agent_profile (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name character varying(120),
    phone_no character varying(15),
    email character varying(180),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    pan_no character varying(10),
    aadhaar_no character varying(12),
    CONSTRAINT agent_profile_aadhaar_ck CHECK (((aadhaar_no IS NULL) OR ((aadhaar_no)::text ~ '^[0-9]{12}$'::text))),
    CONSTRAINT agent_profile_pan_ck CHECK (((pan_no IS NULL) OR ((pan_no)::text ~ '^[A-Z]{5}[0-9]{4}[A-Z]$'::text)))
);


ALTER TABLE public.agent_profile OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 42081)
-- Name: agent_supervision; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agent_supervision (
    agent_user_id uuid NOT NULL,
    employee_user_id uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.agent_supervision OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 41918)
-- Name: agent_target_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agent_target_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    agent_user_id uuid NOT NULL,
    month date NOT NULL,
    delta numeric(14,2) NOT NULL,
    note text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.agent_target_progress OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 42008)
-- Name: agents_with_customer_counts; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.agents_with_customer_counts AS
SELECT
    NULL::uuid AS agent_id,
    NULL::character varying(120) AS agent_name,
    NULL::character varying(180) AS email,
    NULL::character varying(15) AS phone_no,
    NULL::integer AS customer_count;


ALTER VIEW public.agents_with_customer_counts OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 41989)
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    agent_id uuid,
    name character varying(120) NOT NULL,
    email character varying(180),
    phone_no character varying(15),
    status public.customer_status DEFAULT 'Pending'::public.customer_status NOT NULL,
    meta jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    pan_no character varying(10),
    aadhaar_no character varying(12),
    age integer,
    spouse_name character varying(120),
    number_of_children integer,
    parents jsonb,
    premium_number character varying(64),
    CONSTRAINT customers_aadhaar_ck CHECK (((aadhaar_no IS NULL) OR ((aadhaar_no)::text ~ '^[0-9]{12}$'::text))),
    CONSTRAINT customers_age_ck CHECK (((age IS NULL) OR ((age >= 0) AND (age <= 120)))),
    CONSTRAINT customers_children_ck CHECK (((number_of_children IS NULL) OR (number_of_children >= 0))),
    CONSTRAINT customers_pan_ck CHECK (((pan_no IS NULL) OR ((pan_no)::text ~ '^[A-Z]{5}[0-9]{4}[A-Z]$'::text))),
    CONSTRAINT customers_parents_ck CHECK (((parents IS NULL) OR (jsonb_typeof(parents) = 'array'::text)))
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 41949)
-- Name: employee_bank_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_bank_details (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    bank_name character varying(120),
    bank_ifsc character varying(11),
    bank_account_no character varying(32),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.employee_bank_details OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 41965)
-- Name: employee_education_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_education_details (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    edu_10 character varying(120),
    edu_12 character varying(120),
    edu_degree character varying(120),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.employee_education_details OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 42044)
-- Name: employee_initial_creds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_initial_creds (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_user_id uuid NOT NULL,
    temp_password text NOT NULL,
    is_changed boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.employee_initial_creds OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 42181)
-- Name: employee_monthly_targets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_monthly_targets (
    employee_user_id uuid NOT NULL,
    month date NOT NULL,
    target_sales integer DEFAULT 0 NOT NULL,
    target_premium numeric(14,2) DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    achieved_sales integer DEFAULT 0 NOT NULL,
    achieved_premium numeric(14,2) DEFAULT 0 NOT NULL
);


ALTER TABLE public.employee_monthly_targets OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 41933)
-- Name: employee_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_profile (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name character varying(120),
    phone_no character varying(15),
    email character varying(180),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    pan_no character varying(10),
    aadhaar_no character varying(12),
    CONSTRAINT employee_profile_aadhaar_ck CHECK (((aadhaar_no IS NULL) OR ((aadhaar_no)::text ~ '^[0-9]{12}$'::text))),
    CONSTRAINT employee_profile_pan_ck CHECK (((pan_no IS NULL) OR ((pan_no)::text ~ '^[A-Z]{5}[0-9]{4}[A-Z]$'::text)))
);


ALTER TABLE public.employee_profile OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 42013)
-- Name: employee_salary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_salary (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_user_id uuid NOT NULL,
    base_salary numeric(12,2) NOT NULL,
    effective_from timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.employee_salary OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 42030)
-- Name: employee_salary_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_salary_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_user_id uuid NOT NULL,
    base_salary numeric(12,2) NOT NULL,
    effective_from timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.employee_salary_history OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 42165)
-- Name: employee_target_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_target_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_user_id uuid NOT NULL,
    month date NOT NULL,
    delta_sales integer DEFAULT 0 NOT NULL,
    delta_premium numeric(14,2) DEFAULT 0 NOT NULL,
    note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.employee_target_progress OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 42118)
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    token_hash text NOT NULL,
    user_agent text,
    created_ip inet,
    created_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone NOT NULL,
    revoked_at timestamp with time zone
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 41798)
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 41783)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    role public.user_role NOT NULL,
    name character varying(120) NOT NULL,
    email character varying(180) NOT NULL,
    phone_no character varying(15),
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 5190 (class 0 OID 41806)
-- Dependencies: 220
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_logs (id, actor_user_id, action, entity_type, entity_id, details, ip, created_at) FROM stdin;
de5ddf24-8867-47ca-8e35-13195f313dae	f3447b50-bc84-4f61-917c-7db077a96fae	CREATE_USER	user	4e33321f-0816-4aa3-821d-63cd72e390fb	{"created_role": "agent"}	::1	2025-08-16 01:41:45.492765+05:30
da04501e-87b1-4d7d-851d-020a39ad10e4	f3447b50-bc84-4f61-917c-7db077a96fae	CREATE_USER	user	8bb07bb1-98a9-4427-8b82-029ef4cbb28e	{"created_role": "employee"}	::1	2025-08-17 22:00:47.872664+05:30
afe779b8-ebef-4758-9523-6c090547a88c	f3447b50-bc84-4f61-917c-7db077a96fae	UPDATE_CUSTOMER_STATUS	customer	c55621bf-dc1e-4cc7-89b9-88efc6bede9c	{"status": "Closed"}	::1	2025-08-17 23:32:28.417816+05:30
58869d7d-fb92-477e-ad67-98e6063cacce	f3447b50-bc84-4f61-917c-7db077a96fae	UPDATE_CUSTOMER_STATUS	customer	f2da1158-86b1-4ab6-8d57-31228c314ea0	{"status": "Denied"}	::1	2025-08-17 23:33:30.398535+05:30
b00b1b70-6b46-41c5-86ae-34dbac44c56f	f3447b50-bc84-4f61-917c-7db077a96fae	SET_CUSTOMER_PREMIUM_NUMBER	customer	c55621bf-dc1e-4cc7-89b9-88efc6bede9c	{}	::1	2025-08-17 23:33:55.42302+05:30
1c17e9fc-f923-43d4-a932-4f6f92126b34	f3447b50-bc84-4f61-917c-7db077a96fae	SET_AGENT_COMP	user	4e33321f-0816-4aa3-821d-63cd72e390fb	{"base_salary": 20000, "commission_rate": 0.05}	::1	2025-08-17 23:34:57.047236+05:30
08bc09ef-d521-43ed-90fe-4e45905909bb	f3447b50-bc84-4f61-917c-7db077a96fae	SET_AGENT_SUPERVISOR	user	4e33321f-0816-4aa3-821d-63cd72e390fb	{"employee_user_id": "8bb07bb1-98a9-4427-8b82-029ef4cbb28e"}	::1	2025-08-17 23:37:24.496339+05:30
7ba56408-6879-4e0d-b7b7-3b6190ac3c2b	f3447b50-bc84-4f61-917c-7db077a96fae	CREATE_USER	user	45367b10-ddf7-4db7-9770-b25abaaad100	{"created_role": "employee"}	::1	2025-08-17 23:43:36.299389+05:30
56f30342-1a40-4d16-9dd1-9ee9e0984947	f3447b50-bc84-4f61-917c-7db077a96fae	UPSERT_EMPLOYEE_PROFILE	user	45367b10-ddf7-4db7-9770-b25abaaad100	{"email": "ahul.mehta@company.com"}	::1	2025-08-17 23:43:36.314865+05:30
a32d9fd2-9878-4ca5-a4ba-39b7b0997700	f3447b50-bc84-4f61-917c-7db077a96fae	UPSERT_EMPLOYEE_BANK	user	45367b10-ddf7-4db7-9770-b25abaaad100	{"bank_ifsc": "HDFC0001289"}	::1	2025-08-17 23:43:36.322748+05:30
278a514a-8a1c-4018-88f8-03a757f4f5b8	f3447b50-bc84-4f61-917c-7db077a96fae	UPSERT_EMPLOYEE_EDU	user	45367b10-ddf7-4db7-9770-b25abaaad100	{"edu_degree": "B.Com"}	::1	2025-08-17 23:43:36.332621+05:30
0b1235fe-261f-4149-a174-43285c981b81	f3447b50-bc84-4f61-917c-7db077a96fae	SET_AGENT_COMP	user	4e33321f-0816-4aa3-821d-63cd72e390fb	{"base_salary": 20000, "commission_rate": 0.05}	::1	2025-08-18 00:21:46.728947+05:30
f238c96c-a1b5-4373-92a2-102f52222a44	f3447b50-bc84-4f61-917c-7db077a96fae	SET_AGENT_TARGET	user	4e33321f-0816-4aa3-821d-63cd72e390fb	{"month": "2025-08-01", "target_value": 10000}	::1	2025-08-18 00:23:38.146106+05:30
b2ba9605-fc2a-4b6a-b681-d5140fc4b76b	3f3c7586-b7f9-4b3b-b452-73d61c08812e	CREATE_USER	user	e3315d54-65ea-4b9f-8764-8e05f13411d1	{"created_role": "employee"}	::1	2025-08-18 11:15:03.321247+05:30
0607face-a360-45d3-bbf3-eac131220fc9	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPSERT_EMPLOYEE_PROFILE	user	e3315d54-65ea-4b9f-8764-8e05f13411d1	{"email": "abc@gmail.com"}	::1	2025-08-18 11:15:03.353198+05:30
724487c0-62a7-4888-8ab3-176746f7fcc7	3f3c7586-b7f9-4b3b-b452-73d61c08812e	CREATE_USER	user	337fc892-6a2e-402e-bbc5-e4fbdee94978	{"created_role": "employee"}	::1	2025-08-18 13:06:33.642701+05:30
184759fa-7ef8-4faf-b8bf-8cd6272d5003	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPSERT_EMPLOYEE_PROFILE	user	337fc892-6a2e-402e-bbc5-e4fbdee94978	{"email": "ujwalm5308@gmail.com"}	::1	2025-08-18 13:06:33.666993+05:30
8a29d54f-953e-460f-94a3-7e86e7685362	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPSERT_EMPLOYEE_BANK	user	337fc892-6a2e-402e-bbc5-e4fbdee94978	{"bank_ifsc": "hdfc12001"}	::1	2025-08-18 13:06:33.675842+05:30
32ee6a3f-1b0c-4918-85cd-d0eb544eade4	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPSERT_EMPLOYEE_EDU	user	337fc892-6a2e-402e-bbc5-e4fbdee94978	{"edu_degree": "10"}	::1	2025-08-18 13:06:33.686015+05:30
26afbfd3-6659-4ff4-a96c-c3105ff7b25b	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPDATE_CUSTOMER_STATUS	customer	4332249c-ff6c-45c9-95b7-5d39c520d48a	{"status": "Closed"}	::1	2025-08-18 13:11:48.101916+05:30
a1ca9739-9445-48f4-8808-10b42fabdc84	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPDATE_CUSTOMER_STATUS	customer	c29bf805-f8b2-4ff7-a6e2-230cb3ed6ae2	{"status": "Denied"}	::1	2025-08-18 13:12:00.094427+05:30
1c2146e5-402c-412b-943a-afe698784f9b	3f3c7586-b7f9-4b3b-b452-73d61c08812e	DELETE_USER	user	daf4a604-3c0f-42ed-aca6-833d38ef812f	{}	\N	2025-08-18 14:09:49.771174+05:30
d8192f16-5eec-4e96-a4b0-5c22d10cc06b	3f3c7586-b7f9-4b3b-b452-73d61c08812e	DELETE_USER	user	22db1fba-048c-49c7-aa50-35f11e044977	{}	\N	2025-08-18 14:09:55.636328+05:30
76e87bfa-9cee-410a-a864-d35dce2f7bfb	3f3c7586-b7f9-4b3b-b452-73d61c08812e	DELETE_USER	user	337fc892-6a2e-402e-bbc5-e4fbdee94978	{}	\N	2025-08-18 14:10:05.164363+05:30
813044c9-4813-4259-aba3-4f4898854571	3f3c7586-b7f9-4b3b-b452-73d61c08812e	DELETE_USER	user	e3315d54-65ea-4b9f-8764-8e05f13411d1	{}	\N	2025-08-18 14:10:09.235884+05:30
ee0005cd-ad8e-4271-b14e-43d8e3632674	3f3c7586-b7f9-4b3b-b452-73d61c08812e	DELETE_USER	user	45367b10-ddf7-4db7-9770-b25abaaad100	{}	\N	2025-08-18 14:10:12.561971+05:30
81026971-0b2c-475a-a4a5-91a6b0c153ef	3f3c7586-b7f9-4b3b-b452-73d61c08812e	DELETE_USER	user	97d34b98-85be-4ef2-9deb-d1e89558165f	{}	\N	2025-08-18 14:11:11.38998+05:30
5fff6164-2ddc-478f-8459-dda74948f6d8	3f3c7586-b7f9-4b3b-b452-73d61c08812e	DELETE_USER	user	36c2486f-f89e-4f0b-8d42-451cda1d8c67	{}	\N	2025-08-18 14:11:24.834322+05:30
bc0784c5-74f1-4ac0-9fad-b1cbe1d1ac58	3f3c7586-b7f9-4b3b-b452-73d61c08812e	DELETE_USER	user	248de275-7b08-4363-a3a7-0822c7dbeb69	{}	\N	2025-08-18 14:11:42.499697+05:30
a4245bd2-169c-4291-96e9-46f3cce9be03	3f3c7586-b7f9-4b3b-b452-73d61c08812e	SET_EMPLOYEE_SALARY	user	8bb07bb1-98a9-4427-8b82-029ef4cbb28e	{"base_salary": 44566}	::1	2025-08-18 15:15:16.726419+05:30
2b5d5ec3-54b2-4c55-99b8-360234d1ba73	3f3c7586-b7f9-4b3b-b452-73d61c08812e	SET_AGENT_COMP	user	ae744a58-ae6e-4474-8de7-523f4c40146b	{"base_salary": 2000, "commission_rate": 0.5}	::1	2025-08-18 15:47:23.077479+05:30
51b1b42f-a4d4-49f6-88b5-68443866507e	3f3c7586-b7f9-4b3b-b452-73d61c08812e	SET_AGENT_COMP	user	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	{"base_salary": 1000, "commission_rate": 0.2}	::1	2025-08-18 15:48:31.948278+05:30
5562e233-394f-4a1f-9611-d15a90278d4c	3f3c7586-b7f9-4b3b-b452-73d61c08812e	SET_AGENT_COMP	user	760e3b94-7528-4e92-8e4f-bafe691185ae	{"base_salary": 3000, "commission_rate": 0.02}	::1	2025-08-18 15:48:42.588642+05:30
4adcff33-b53d-440a-9311-f94ed28d6cac	3f3c7586-b7f9-4b3b-b452-73d61c08812e	SET_AGENT_COMP	user	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	{"base_salary": 40000, "commission_rate": 0.11}	::1	2025-08-18 15:48:53.769091+05:30
4af0acce-9ac5-44df-a95d-273d60010f17	3f3c7586-b7f9-4b3b-b452-73d61c08812e	SET_AGENT_COMP	user	4e33321f-0816-4aa3-821d-63cd72e390fb	{"base_salary": 5000, "commission_rate": 0.03}	::1	2025-08-18 15:49:09.360672+05:30
3d17e6f9-c8f2-4f57-93e8-60f87e0ef48d	3f3c7586-b7f9-4b3b-b452-73d61c08812e	SET_AGENT_COMP	user	ae744a58-ae6e-4474-8de7-523f4c40146b	{"base_salary": 3000, "commission_rate": 0.2}	::1	2025-08-18 15:49:40.949824+05:30
648fd778-4803-4bbd-b943-f9b2eb8f7d77	3f3c7586-b7f9-4b3b-b452-73d61c08812e	CREATE_USER	user	59bf0dc4-b256-4a36-a509-ef00c04e84bc	{"created_role": "employee"}	::1	2025-08-18 15:54:13.098486+05:30
fbc43020-46f6-48a8-92e2-06fd70b40d45	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPSERT_EMPLOYEE_PROFILE	user	59bf0dc4-b256-4a36-a509-ef00c04e84bc	{"email": "ujwalm308@gmail.com"}	::1	2025-08-18 15:54:13.117376+05:30
0f189365-e7c4-4f2e-9828-7880610c2760	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPSERT_EMPLOYEE_BANK	user	59bf0dc4-b256-4a36-a509-ef00c04e84bc	{"bank_ifsc": "hdfc001"}	::1	2025-08-18 15:54:13.128259+05:30
e9aefa44-fa80-4553-bbd2-2410b8ec5d5b	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPSERT_EMPLOYEE_EDU	user	59bf0dc4-b256-4a36-a509-ef00c04e84bc	{"edu_degree": "90"}	::1	2025-08-18 15:54:13.139271+05:30
a835636a-4c3b-4236-af9d-2e8603456fd3	3f3c7586-b7f9-4b3b-b452-73d61c08812e	SET_AGENT_COMP	user	ae744a58-ae6e-4474-8de7-523f4c40146b	{"base_salary": 0, "commission_rate": 0}	::1	2025-08-18 16:00:18.945859+05:30
291f16ae-0854-48ef-a3d6-97d3d8ecdc85	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPDATE_CUSTOMER_STATUS	customer	c94ea456-e6f0-48a8-88d0-bf5a75bb28ca	{"status": "Closed"}	::1	2025-08-18 16:02:06.466665+05:30
59e4cba0-dc88-4c5e-a9b6-59d62d557768	3f3c7586-b7f9-4b3b-b452-73d61c08812e	SET_AGENT_COMP	user	ae744a58-ae6e-4474-8de7-523f4c40146b	{"base_salary": 2000, "commission_rate": 0.5}	::1	2025-08-18 16:04:07.570332+05:30
e8bbd1cb-85b6-4f2a-a5d2-cbf348fa90e1	3f3c7586-b7f9-4b3b-b452-73d61c08812e	CREATE_USER	user	98eaf317-ed6e-48ad-b7eb-1777e17cf47c	{"created_role": "employee"}	::1	2025-08-18 18:43:07.980814+05:30
db4db4df-b311-4ad6-857b-83592c632a10	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPSERT_EMPLOYEE_PROFILE	user	98eaf317-ed6e-48ad-b7eb-1777e17cf47c	{"email": "ujwalm3082@gmail.com"}	::1	2025-08-18 18:43:08.010064+05:30
6557ecdb-2500-41d5-acce-194833cb3641	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPSERT_EMPLOYEE_BANK	user	98eaf317-ed6e-48ad-b7eb-1777e17cf47c	{"bank_ifsc": "hdfc123"}	::1	2025-08-18 18:43:08.022083+05:30
ed1a05ca-7fb4-4055-88ce-e7975ebbba52	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPSERT_EMPLOYEE_EDU	user	98eaf317-ed6e-48ad-b7eb-1777e17cf47c	{"edu_degree": "67"}	::1	2025-08-18 18:43:08.032811+05:30
03faad80-3968-4611-b362-d548632af4be	3f3c7586-b7f9-4b3b-b452-73d61c08812e	CREATE_USER	user	1f977cdc-0459-4f80-b6fb-e33f37e9a8ef	{"created_role": "employee"}	::1	2025-08-18 19:02:25.441192+05:30
237aa0ba-f192-408a-91ad-50b91758a901	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPSERT_EMPLOYEE_PROFILE	user	1f977cdc-0459-4f80-b6fb-e33f37e9a8ef	{"email": "ujwalm3084@gmail.com"}	::1	2025-08-18 19:02:25.46466+05:30
60483453-70e0-43d4-8fff-5c3d08351f80	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPSERT_EMPLOYEE_BANK	user	1f977cdc-0459-4f80-b6fb-e33f37e9a8ef	{"bank_ifsc": "hdfc123"}	::1	2025-08-18 19:02:25.473398+05:30
16888dc2-cb14-4b52-9b35-dd6625592f21	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPSERT_EMPLOYEE_EDU	user	1f977cdc-0459-4f80-b6fb-e33f37e9a8ef	{"edu_degree": "44"}	::1	2025-08-18 19:02:25.482609+05:30
12eb5c6c-8835-4f5e-903b-5a12e87c0b68	3f3c7586-b7f9-4b3b-b452-73d61c08812e	CREATE_USER	user	dc58c893-25ba-44dd-9847-3ac3cc4f7668	{"created_role": "employee"}	::1	2025-08-18 20:04:40.070786+05:30
77fef780-c707-4064-873a-285ea06b2e92	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPSERT_EMPLOYEE_PROFILE	user	dc58c893-25ba-44dd-9847-3ac3cc4f7668	{"email": "raju@gmail.com"}	::1	2025-08-18 20:04:40.205668+05:30
617b2982-3f9f-4f96-8435-11074829c066	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPDATE_CUSTOMER_STATUS	customer	3e593faa-8ee5-4dfc-aa1a-f74cf03c1cb8	{"status": "Closed"}	::1	2025-08-18 20:11:56.549825+05:30
4acf83de-62ba-4bb9-ac00-f16516895c3c	3f3c7586-b7f9-4b3b-b452-73d61c08812e	SET_CUSTOMER_PREMIUM_NUMBER	customer	3e593faa-8ee5-4dfc-aa1a-f74cf03c1cb8	{}	::1	2025-08-18 20:12:53.138449+05:30
87921eba-8fd0-426f-83a7-e45575e42aa2	3f3c7586-b7f9-4b3b-b452-73d61c08812e	SET_AGENT_TARGET	user	7664e6b2-b730-477f-a719-6d9472cfc766	{"month": "2025-08-01", "target_value": 30000}	::1	2025-08-18 20:15:06.050801+05:30
e44aa556-72d9-4f85-981d-c50a50b7cdec	3f3c7586-b7f9-4b3b-b452-73d61c08812e	ADD_TARGET_PROGRESS	user	7664e6b2-b730-477f-a719-6d9472cfc766	{"delta": 10000, "month": "2025-08-01"}	::1	2025-08-18 20:15:23.187226+05:30
544913a3-749a-4e26-bf12-8455420e30d3	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPSERT_AGENT_MONTHLY_STATS	user	7664e6b2-b730-477f-a719-6d9472cfc766	{"month": "2025-08-01"}	::1	2025-08-18 20:17:12.900056+05:30
351a780c-997c-45ee-bcfe-158064ff65f9	3f3c7586-b7f9-4b3b-b452-73d61c08812e	SET_AGENT_TARGET	user	ae744a58-ae6e-4474-8de7-523f4c40146b	{"month": "2025-08-01", "target_value": 30000}	::1	2025-08-18 20:30:47.248453+05:30
8011ea3c-55e7-4007-9476-7b5556a7d6ab	3f3c7586-b7f9-4b3b-b452-73d61c08812e	ADD_TARGET_PROGRESS	user	ae744a58-ae6e-4474-8de7-523f4c40146b	{"delta": 10000, "month": "2025-08-01"}	::1	2025-08-18 20:30:57.286491+05:30
15a67030-45ac-4304-9b90-845859174482	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPSERT_AGENT_MONTHLY_STATS	user	ae744a58-ae6e-4474-8de7-523f4c40146b	{"month": "2025-08-01"}	::1	2025-08-18 20:31:21.026818+05:30
7c8a9565-b939-4a5c-bef3-e74e4087c89b	3f3c7586-b7f9-4b3b-b452-73d61c08812e	SET_EMPLOYEE_TARGET	user	dc58c893-25ba-44dd-9847-3ac3cc4f7668	{"month": "2025-08-01", "target_value": 10}	::1	2025-08-18 23:21:03.503307+05:30
96117ce0-5c59-4e62-8fda-457e95f4095c	3f3c7586-b7f9-4b3b-b452-73d61c08812e	SET_EMPLOYEE_TARGET	user	dc58c893-25ba-44dd-9847-3ac3cc4f7668	{"month": "2025-08-01", "target_value": 100}	::1	2025-08-18 23:29:07.04529+05:30
15a3f640-4bae-4a02-9eaf-d407b26d6a1f	3f3c7586-b7f9-4b3b-b452-73d61c08812e	SET_EMPLOYEE_TARGET	user	dc58c893-25ba-44dd-9847-3ac3cc4f7668	{"month": "2025-08-01", "target_value": 100}	::1	2025-08-18 23:29:08.707397+05:30
c1dbd008-cb5f-4b6e-ad82-f125ac3c93c7	3f3c7586-b7f9-4b3b-b452-73d61c08812e	SET_EMPLOYEE_TARGET	user	dc58c893-25ba-44dd-9847-3ac3cc4f7668	{"month": "2025-08-01", "target_value": 1000}	::1	2025-08-18 23:32:19.877696+05:30
6b653b4a-60d2-44de-82c9-e2ac73cb83d0	3f3c7586-b7f9-4b3b-b452-73d61c08812e	SET_EMPLOYEE_SALARY	user	dc58c893-25ba-44dd-9847-3ac3cc4f7668	{"base_salary": 20000}	::1	2025-08-20 13:25:29.351349+05:30
44d2fc72-72dc-476d-bb28-4f35e1e34f4f	3f3c7586-b7f9-4b3b-b452-73d61c08812e	UPSERT_AGENT_MONTHLY_STATS	user	7664e6b2-b730-477f-a719-6d9472cfc766	{"month": "2025-08-01"}	::1	2025-08-20 14:19:03.694978+05:30
3db16f73-7397-42d4-9b07-00738b663d9c	3f3c7586-b7f9-4b3b-b452-73d61c08812e	SET_AGENT_COMP	user	7664e6b2-b730-477f-a719-6d9472cfc766	{"base_salary": 5000, "commission_rate": 0.5}	::1	2025-08-20 14:19:54.235854+05:30
979ee65e-8c12-4674-a901-b51de59a036f	3f3c7586-b7f9-4b3b-b452-73d61c08812e	DELETE_USER	user	2c2ef3ca-632b-4a70-bb09-9ef51fde98f9	{}	\N	2025-08-20 14:26:41.433112+05:30
6f468f52-e637-42d6-8e95-ad5c1ddf908f	3f3c7586-b7f9-4b3b-b452-73d61c08812e	DELETE_USER	user	e998f31b-9462-43e0-9c38-0291fef162c8	{}	\N	2025-08-20 14:26:50.863686+05:30
c40a9ff6-c413-4b04-8d75-addda8ef4ff0	3f3c7586-b7f9-4b3b-b452-73d61c08812e	DELETE_USER	user	1758de02-c8e9-41bd-9c15-add20a43bce5	{}	\N	2025-08-20 14:26:56.351564+05:30
3f3a3ad2-1b71-42b4-b8ce-edc3b6f55e45	3f3c7586-b7f9-4b3b-b452-73d61c08812e	DELETE_USER	user	c9a43370-0ca1-4a96-a972-b8eab09c4966	{}	\N	2025-08-20 14:26:59.350676+05:30
169551ef-4dad-404a-986e-aaf8a6871b6f	3f3c7586-b7f9-4b3b-b452-73d61c08812e	DELETE_USER	user	c7890012-61d9-4660-81e9-7bd87a84e71f	{}	\N	2025-08-20 14:27:02.61646+05:30
6b159b0b-758f-4afd-8df3-9d20ab8c50f3	3f3c7586-b7f9-4b3b-b452-73d61c08812e	DELETE_USER	user	b3f4dc9e-28c3-46be-b1b0-43d6d8a2964f	{}	\N	2025-08-20 14:27:06.145729+05:30
4df059dc-e0dc-401a-baeb-149fcb28373d	3f3c7586-b7f9-4b3b-b452-73d61c08812e	DELETE_USER	user	1f977cdc-0459-4f80-b6fb-e33f37e9a8ef	{}	\N	2025-08-20 14:27:16.842687+05:30
72cafe07-aab1-4594-a1a6-61f970034f98	3f3c7586-b7f9-4b3b-b452-73d61c08812e	DELETE_USER	user	98eaf317-ed6e-48ad-b7eb-1777e17cf47c	{}	\N	2025-08-20 14:27:20.301109+05:30
cafbb2ad-70ea-4e8a-a9a5-112b21ebd6b9	3f3c7586-b7f9-4b3b-b452-73d61c08812e	DELETE_USER	user	59bf0dc4-b256-4a36-a509-ef00c04e84bc	{}	\N	2025-08-20 14:27:23.283774+05:30
\.


--
-- TOC entry 5192 (class 0 OID 41838)
-- Dependencies: 222
-- Data for Name: agent_bank_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agent_bank_details (id, user_id, bank_name, bank_ifsc, bank_account_no, created_at, updated_at) FROM stdin;
571d02e8-97ee-4bd6-81d1-aa57500fc25b	ae744a58-ae6e-4474-8de7-523f4c40146b	HDFC	SBIN0009876	99887766554433	2025-08-18 01:11:20.054146+05:30	2025-08-18 01:11:20.054146+05:30
d6ee3eb5-ee4f-479c-b544-7212d10c3db7	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	SBI	SBIN0009876	99887766554433	2025-08-18 01:11:20.058155+05:30	2025-08-18 01:11:20.058155+05:30
5300798d-83bb-4dab-be66-449a60dd9dc4	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	HDFC	SBIN0009876	99887766554433	2025-08-18 01:11:20.059514+05:30	2025-08-18 01:11:20.059514+05:30
e40e8393-97eb-4d05-b4db-6328157249b8	760e3b94-7528-4e92-8e4f-bafe691185ae	SBI	SBIN0009876	99887766554433	2025-08-18 01:11:20.061149+05:30	2025-08-18 01:11:20.061149+05:30
4bc2821a-6855-4e5b-9bac-0bd8b20a4184	98b502f1-bbb2-4e81-a79a-a3b97e9cc26a	sd	ad	sad	2025-08-20 22:38:14.409864+05:30	2025-08-20 22:38:14.409864+05:30
\.


--
-- TOC entry 5205 (class 0 OID 42063)
-- Dependencies: 236
-- Data for Name: agent_compensation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agent_compensation (id, agent_user_id, base_salary, commission_rate, created_at, updated_at) FROM stdin;
08d2bbd5-ac4c-4559-a723-459f60eefa94	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	1000.00	0.2000	2025-08-18 15:48:31.944271+05:30	2025-08-18 15:48:31.944271+05:30
3bdabf18-69b7-4ff1-a5c4-b945aa3f65cc	760e3b94-7528-4e92-8e4f-bafe691185ae	3000.00	0.0200	2025-08-18 15:48:42.587226+05:30	2025-08-18 15:48:42.587226+05:30
f95e924a-81a6-458c-aeb5-faf93e358b4c	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	40000.00	0.1100	2025-08-18 15:48:53.767827+05:30	2025-08-18 15:48:53.767827+05:30
7ad90039-c38b-4938-baf0-17b0a1e9f219	4e33321f-0816-4aa3-821d-63cd72e390fb	5000.00	0.0300	2025-08-17 23:34:57.042783+05:30	2025-08-18 15:49:09.357031+05:30
de63f40a-e1e0-46c6-a762-05bd438b132c	ae744a58-ae6e-4474-8de7-523f4c40146b	2000.00	0.5000	2025-08-18 15:47:23.07375+05:30	2025-08-18 16:04:07.565214+05:30
cb6137b5-82dc-4688-956a-b2e3f32a5bd9	7664e6b2-b730-477f-a719-6d9472cfc766	5000.00	0.5000	2025-08-20 14:19:54.228416+05:30	2025-08-20 14:19:54.228416+05:30
\.


--
-- TOC entry 5195 (class 0 OID 41887)
-- Dependencies: 225
-- Data for Name: agent_compensation_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agent_compensation_history (id, agent_user_id, base_salary, commission_rate, effective_from, created_at) FROM stdin;
9a22d7e1-ea36-4b2b-aede-959c3b5c8a27	4e33321f-0816-4aa3-821d-63cd72e390fb	20000.00	0.0500	2025-08-17 23:34:57.044762+05:30	2025-08-17 23:34:57.044762+05:30
fd56883c-4938-40d9-8e19-2b1fa1917ab0	4e33321f-0816-4aa3-821d-63cd72e390fb	20000.00	0.0500	2025-08-18 00:21:46.727619+05:30	2025-08-18 00:21:46.727619+05:30
7e2734af-2d59-4eaf-ba6e-038019cc73f7	ae744a58-ae6e-4474-8de7-523f4c40146b	24209.00	0.0700	2025-08-18 01:11:20.072566+05:30	2025-08-18 01:11:20.072566+05:30
4c6745ea-2f12-456c-ba75-2143ad4101ba	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	27617.00	0.0700	2025-08-18 01:11:20.073488+05:30	2025-08-18 01:11:20.073488+05:30
cf96c13c-4c39-4d62-b550-1632ce1af578	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	27995.00	0.0700	2025-08-18 01:11:20.073889+05:30	2025-08-18 01:11:20.073889+05:30
09b4fcff-c3a1-4c99-80f1-96ca86859629	760e3b94-7528-4e92-8e4f-bafe691185ae	22133.00	0.0500	2025-08-18 01:11:20.074271+05:30	2025-08-18 01:11:20.074271+05:30
296dc6ef-9dcc-4517-a960-7da2d8bd8df7	ae744a58-ae6e-4474-8de7-523f4c40146b	2000.00	0.5000	2025-08-18 15:47:23.076389+05:30	2025-08-18 15:47:23.076389+05:30
031b08bb-0fda-41ba-83bd-4642de06e9a4	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	1000.00	0.2000	2025-08-18 15:48:31.947383+05:30	2025-08-18 15:48:31.947383+05:30
b1c826ad-a6e3-4a2d-8a2b-acb8c5c60494	760e3b94-7528-4e92-8e4f-bafe691185ae	3000.00	0.0200	2025-08-18 15:48:42.588118+05:30	2025-08-18 15:48:42.588118+05:30
dc9a40d2-75fe-4857-8f6a-a408e31d1fc9	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	40000.00	0.1100	2025-08-18 15:48:53.768627+05:30	2025-08-18 15:48:53.768627+05:30
f488669c-1491-4c54-b1d4-da2ca84d49e7	4e33321f-0816-4aa3-821d-63cd72e390fb	5000.00	0.0300	2025-08-18 15:49:09.360185+05:30	2025-08-18 15:49:09.360185+05:30
c14527f4-1dc2-4cbb-b2aa-4a71afa00bfc	ae744a58-ae6e-4474-8de7-523f4c40146b	3000.00	0.2000	2025-08-18 15:49:40.947564+05:30	2025-08-18 15:49:40.947564+05:30
1cc6d7ce-023f-436a-96be-5641c28dd05a	ae744a58-ae6e-4474-8de7-523f4c40146b	0.00	0.0000	2025-08-18 16:00:18.943019+05:30	2025-08-18 16:00:18.943019+05:30
755fbcd2-5225-4841-a86b-0202ef22d4f9	ae744a58-ae6e-4474-8de7-523f4c40146b	2000.00	0.5000	2025-08-18 16:04:07.568075+05:30	2025-08-18 16:04:07.568075+05:30
75e74c13-b845-4ab5-8c0a-3a142214fed5	7664e6b2-b730-477f-a719-6d9472cfc766	5000.00	0.5000	2025-08-20 14:19:54.232384+05:30	2025-08-20 14:19:54.232384+05:30
\.


--
-- TOC entry 5193 (class 0 OID 41854)
-- Dependencies: 223
-- Data for Name: agent_education_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agent_education_details (id, user_id, edu_10, edu_12, edu_degree, created_at, updated_at) FROM stdin;
84c9c33d-3aae-4404-b5c6-921ab9907bdf	ae744a58-ae6e-4474-8de7-523f4c40146b	State Board	State Board	B.A.	2025-08-18 01:11:20.055902+05:30	2025-08-18 01:11:20.055902+05:30
19dfe163-0beb-4a5c-9d93-0e0c7a400284	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	State Board	State Board	B.A.	2025-08-18 01:11:20.058583+05:30	2025-08-18 01:11:20.058583+05:30
b6bb2334-7216-451d-9bc6-44f642f0269c	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	State Board	State Board	B.Sc	2025-08-18 01:11:20.060003+05:30	2025-08-18 01:11:20.060003+05:30
55089231-793f-401b-84af-da4a166ad573	760e3b94-7528-4e92-8e4f-bafe691185ae	State Board	State Board	B.A.	2025-08-18 01:11:20.061542+05:30	2025-08-18 01:11:20.061542+05:30
4d12946f-1b45-4d21-af8b-d89269b55e16	98b502f1-bbb2-4e81-a79a-a3b97e9cc26a	12	23	43	2025-08-20 22:38:14.410793+05:30	2025-08-20 22:38:14.410793+05:30
\.


--
-- TOC entry 5194 (class 0 OID 41870)
-- Dependencies: 224
-- Data for Name: agent_initial_creds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agent_initial_creds (id, agent_user_id, temp_password, is_changed, created_at) FROM stdin;
c1f22695-b136-4b60-b29e-f476154e725f	4e33321f-0816-4aa3-821d-63cd72e390fb	vB$77MiZhYu6	t	2025-08-16 01:41:45.488988+05:30
5c7b67df-91d5-47b2-8173-378e1b5a0c57	ae744a58-ae6e-4474-8de7-523f4c40146b	Agent@123	f	2025-08-18 01:11:20.037565+05:30
0365f4d6-e6b4-4d5f-9a24-d95a7f5cb54b	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	Agent@123	f	2025-08-18 01:11:20.041655+05:30
d40ef30f-03a3-4906-b68f-f420f046e453	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	Agent@123	f	2025-08-18 01:11:20.042268+05:30
6626c4f8-0fe6-4e2f-b7f1-cd87c9594cdc	760e3b94-7528-4e92-8e4f-bafe691185ae	Agent@123	f	2025-08-18 01:11:20.04274+05:30
ac52d7ae-511e-4d9a-9651-1cfcee76b4f5	7664e6b2-b730-477f-a719-6d9472cfc766	THbjEexuc9r9	f	2025-08-18 20:07:14.883251+05:30
907163e3-bad0-4ac2-b590-edf43af8b544	98b502f1-bbb2-4e81-a79a-a3b97e9cc26a	iv9d4onbcXvT	f	2025-08-20 22:38:14.403357+05:30
\.


--
-- TOC entry 5207 (class 0 OID 42097)
-- Dependencies: 238
-- Data for Name: agent_monthly_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agent_monthly_stats (id, agent_user_id, month, sales_count, total_premium, total_commission, created_at, updated_at) FROM stdin;
8927c200-390f-4c52-abf5-3f6a8349dd2e	ae744a58-ae6e-4474-8de7-523f4c40146b	2025-03-01	12	68790.00	4815.00	2025-08-18 01:11:20.078459+05:30	2025-08-18 01:11:20.078459+05:30
a1ba253d-4a5c-43a7-b3cb-6de1e0d3f675	ae744a58-ae6e-4474-8de7-523f4c40146b	2025-04-01	12	242958.00	17007.00	2025-08-18 01:11:20.080215+05:30	2025-08-18 01:11:20.080215+05:30
76fd939e-2e29-4661-8e51-fa16d67a88b9	ae744a58-ae6e-4474-8de7-523f4c40146b	2025-05-01	8	225355.00	15775.00	2025-08-18 01:11:20.081228+05:30	2025-08-18 01:11:20.081228+05:30
0199932b-5de4-49d3-828d-7ccbb64e5bb0	ae744a58-ae6e-4474-8de7-523f4c40146b	2025-06-01	4	174338.00	12204.00	2025-08-18 01:11:20.082129+05:30	2025-08-18 01:11:20.082129+05:30
4c1a6844-21c6-4ec2-9a53-477858bedbf9	ae744a58-ae6e-4474-8de7-523f4c40146b	2025-07-01	9	148689.00	10408.00	2025-08-18 01:11:20.082857+05:30	2025-08-18 01:11:20.082857+05:30
a50229c2-1ee8-4457-9874-2c44cf75223a	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	2025-03-01	7	220834.00	15458.00	2025-08-18 01:11:20.084259+05:30	2025-08-18 01:11:20.084259+05:30
5e9591a7-0f35-49f9-9f5c-24a8713ca7c3	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	2025-04-01	5	136358.00	9545.00	2025-08-18 01:11:20.084911+05:30	2025-08-18 01:11:20.084911+05:30
36c4fc53-10f2-4dde-8a2e-981cbbfaf053	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	2025-05-01	8	121065.00	8475.00	2025-08-18 01:11:20.085728+05:30	2025-08-18 01:11:20.085728+05:30
3f39f4f8-8fdf-4eb5-8eea-d282575b50f3	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	2025-06-01	5	236563.00	16559.00	2025-08-18 01:11:20.086366+05:30	2025-08-18 01:11:20.086366+05:30
ca2f9482-ffa1-4649-9807-f0aab29aa7e5	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	2025-07-01	10	131273.00	9189.00	2025-08-18 01:11:20.087014+05:30	2025-08-18 01:11:20.087014+05:30
42d42018-2979-4496-8827-44b546fca3d2	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	2025-08-01	5	241151.00	16881.00	2025-08-18 01:11:20.087643+05:30	2025-08-18 01:11:20.087643+05:30
6dd7932c-9c4d-4f60-90c3-55b2f3531182	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	2025-03-01	9	154646.00	10825.00	2025-08-18 01:11:20.088364+05:30	2025-08-18 01:11:20.088364+05:30
5265367d-5893-492f-bba8-a2709c73454d	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	2025-04-01	11	203072.00	14215.00	2025-08-18 01:11:20.089067+05:30	2025-08-18 01:11:20.089067+05:30
a52d324b-d840-4e1a-aca6-d1113ba3433d	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	2025-05-01	8	164162.00	11491.00	2025-08-18 01:11:20.089735+05:30	2025-08-18 01:11:20.089735+05:30
8447fd29-135d-4066-b123-b5788b115bf8	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	2025-06-01	2	203031.00	14212.00	2025-08-18 01:11:20.090399+05:30	2025-08-18 01:11:20.090399+05:30
589481e6-ce8a-4f3e-833e-59b08a942603	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	2025-07-01	10	231788.00	16225.00	2025-08-18 01:11:20.091494+05:30	2025-08-18 01:11:20.091494+05:30
bfa8d36b-39d0-41fe-95c3-93883b0420f4	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	2025-08-01	6	233510.00	16346.00	2025-08-18 01:11:20.092299+05:30	2025-08-18 01:11:20.092299+05:30
744c6cfb-03f3-4a22-a2f8-2bdd353519ff	760e3b94-7528-4e92-8e4f-bafe691185ae	2025-03-01	5	194064.00	9703.00	2025-08-18 01:11:20.09297+05:30	2025-08-18 01:11:20.09297+05:30
8b4b7b3a-a4d4-43d7-8a95-4f249dd40e75	760e3b94-7528-4e92-8e4f-bafe691185ae	2025-04-01	7	191244.00	9562.00	2025-08-18 01:11:20.093624+05:30	2025-08-18 01:11:20.093624+05:30
e358439f-7c9f-4569-b3b2-16617271707e	760e3b94-7528-4e92-8e4f-bafe691185ae	2025-05-01	9	130415.00	6521.00	2025-08-18 01:11:20.094275+05:30	2025-08-18 01:11:20.094275+05:30
0e9b4962-8197-4d62-880d-37210294999a	760e3b94-7528-4e92-8e4f-bafe691185ae	2025-06-01	11	113775.00	5689.00	2025-08-18 01:11:20.095014+05:30	2025-08-18 01:11:20.095014+05:30
ae52472a-085d-4d65-913a-cf0fe7d3ea9b	760e3b94-7528-4e92-8e4f-bafe691185ae	2025-07-01	6	249952.00	12498.00	2025-08-18 01:11:20.095775+05:30	2025-08-18 01:11:20.095775+05:30
e4da2ba9-f9b0-49c2-b41e-b9e089c11c30	760e3b94-7528-4e92-8e4f-bafe691185ae	2025-08-01	3	145090.00	7255.00	2025-08-18 01:11:20.096427+05:30	2025-08-18 01:11:20.096427+05:30
54e30faa-dd16-44dd-8a23-6c056ca0bdd9	ae744a58-ae6e-4474-8de7-523f4c40146b	2025-08-01	1	10000.00	1500.00	2025-08-18 01:11:20.083574+05:30	2025-08-18 20:31:21.016026+05:30
57f9d5c7-e3f5-4c66-812a-92e13d984b6d	7664e6b2-b730-477f-a719-6d9472cfc766	2025-08-01	5	50000.00	2500.00	2025-08-18 20:17:12.894482+05:30	2025-08-20 14:19:03.690924+05:30
\.


--
-- TOC entry 5196 (class 0 OID 41901)
-- Dependencies: 226
-- Data for Name: agent_monthly_targets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agent_monthly_targets (id, agent_user_id, month, target_value, achieved_value, created_at, updated_at) FROM stdin;
5f06794e-a8dd-4a66-8b56-16f159c9cd1d	4e33321f-0816-4aa3-821d-63cd72e390fb	2025-08-01	10000.00	0.00	2025-08-18 00:23:38.141606+05:30	2025-08-18 00:23:38.141606+05:30
5c4179ad-fd61-4eeb-b7e0-25cc72e20f30	ae744a58-ae6e-4474-8de7-523f4c40146b	2025-03-01	324921.00	240706.00	2025-08-18 01:11:20.076148+05:30	2025-08-18 01:11:20.076148+05:30
afbf222d-11ab-4963-8f21-168e3cf7287b	ae744a58-ae6e-4474-8de7-523f4c40146b	2025-04-01	266899.00	282535.00	2025-08-18 01:11:20.079829+05:30	2025-08-18 01:11:20.079829+05:30
056fae52-9035-4020-aa08-7c1cc1cbc032	ae744a58-ae6e-4474-8de7-523f4c40146b	2025-05-01	172619.00	141240.00	2025-08-18 01:11:20.080761+05:30	2025-08-18 01:11:20.080761+05:30
bd37e5a7-aaf0-4ed8-89d6-4b7a5fa9ee2c	ae744a58-ae6e-4474-8de7-523f4c40146b	2025-06-01	259325.00	193739.00	2025-08-18 01:11:20.081728+05:30	2025-08-18 01:11:20.081728+05:30
c68f8fe4-4b79-4753-94bb-a6abd682d584	ae744a58-ae6e-4474-8de7-523f4c40146b	2025-07-01	194243.00	144163.00	2025-08-18 01:11:20.082508+05:30	2025-08-18 01:11:20.082508+05:30
002beb93-75bc-4f29-a8b0-e16832edb6c4	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	2025-03-01	212090.00	194907.00	2025-08-18 01:11:20.083938+05:30	2025-08-18 01:11:20.083938+05:30
ca78f76b-a540-473d-b7a6-806ce4ee73d4	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	2025-04-01	202275.00	189511.00	2025-08-18 01:11:20.084588+05:30	2025-08-18 01:11:20.084588+05:30
1faf099b-c359-4d13-907f-02575728c91f	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	2025-05-01	225297.00	144372.00	2025-08-18 01:11:20.085414+05:30	2025-08-18 01:11:20.085414+05:30
bc84986e-8a4c-4920-8ff2-ed139cefc3f7	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	2025-06-01	280599.00	188845.00	2025-08-18 01:11:20.086056+05:30	2025-08-18 01:11:20.086056+05:30
58a75bbf-1ea1-4e30-9e5b-1a30ee8b8215	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	2025-07-01	338426.00	340226.00	2025-08-18 01:11:20.0867+05:30	2025-08-18 01:11:20.0867+05:30
3766efd8-f3ff-4520-8f18-32275fa4794b	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	2025-08-01	214989.00	169117.00	2025-08-18 01:11:20.087335+05:30	2025-08-18 01:11:20.087335+05:30
72e3dd3f-72ad-4aa9-b9c0-1da6ab969d55	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	2025-03-01	308775.00	334764.00	2025-08-18 01:11:20.087964+05:30	2025-08-18 01:11:20.087964+05:30
5b0c6c1c-dc5e-49b0-a88b-386e82b9d717	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	2025-04-01	313968.00	247489.00	2025-08-18 01:11:20.088728+05:30	2025-08-18 01:11:20.088728+05:30
d7e13447-1069-4796-a973-c1975cecedba	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	2025-05-01	240216.00	202714.00	2025-08-18 01:11:20.089423+05:30	2025-08-18 01:11:20.089423+05:30
58971845-d056-4267-8aed-0ee1a6eae9e8	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	2025-06-01	342978.00	277950.00	2025-08-18 01:11:20.09006+05:30	2025-08-18 01:11:20.09006+05:30
61526e55-9d41-4708-b48b-952615095ee1	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	2025-07-01	332859.00	281166.00	2025-08-18 01:11:20.091062+05:30	2025-08-18 01:11:20.091062+05:30
0e77da3f-071a-4598-b927-99fdc073b339	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	2025-08-01	318095.00	322631.00	2025-08-18 01:11:20.091908+05:30	2025-08-18 01:11:20.091908+05:30
993cb8c8-bdb8-4e86-bf3f-d8f5382f6348	760e3b94-7528-4e92-8e4f-bafe691185ae	2025-03-01	153559.00	103855.00	2025-08-18 01:11:20.092646+05:30	2025-08-18 01:11:20.092646+05:30
a1b0834b-8bf8-452f-af09-6a8b602796b9	760e3b94-7528-4e92-8e4f-bafe691185ae	2025-04-01	270178.00	237626.00	2025-08-18 01:11:20.093299+05:30	2025-08-18 01:11:20.093299+05:30
83747f4b-068a-42f1-b6a2-58198b1a1f72	760e3b94-7528-4e92-8e4f-bafe691185ae	2025-05-01	226711.00	171099.00	2025-08-18 01:11:20.093941+05:30	2025-08-18 01:11:20.093941+05:30
f6b1b4f1-7cb3-40de-bc15-a6b9d2f42fab	760e3b94-7528-4e92-8e4f-bafe691185ae	2025-06-01	323007.00	288135.00	2025-08-18 01:11:20.094615+05:30	2025-08-18 01:11:20.094615+05:30
c32eab5f-5ca2-4258-9571-315d05b2d638	760e3b94-7528-4e92-8e4f-bafe691185ae	2025-07-01	336375.00	212582.00	2025-08-18 01:11:20.095432+05:30	2025-08-18 01:11:20.095432+05:30
c25db2c4-ebc4-4ec4-9b20-cdeced061c12	760e3b94-7528-4e92-8e4f-bafe691185ae	2025-08-01	280010.00	282032.00	2025-08-18 01:11:20.096105+05:30	2025-08-18 01:11:20.096105+05:30
f00ab1b7-db7a-49f0-8795-e3a745a5a9de	7664e6b2-b730-477f-a719-6d9472cfc766	2025-08-01	30000.00	10000.00	2025-08-18 20:15:06.044669+05:30	2025-08-18 20:15:23.181604+05:30
9fb55847-df70-484b-831d-b0846e34e2d6	ae744a58-ae6e-4474-8de7-523f4c40146b	2025-08-01	30000.00	268229.00	2025-08-18 01:11:20.083221+05:30	2025-08-18 20:30:57.283654+05:30
\.


--
-- TOC entry 5191 (class 0 OID 41822)
-- Dependencies: 221
-- Data for Name: agent_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agent_profile (id, user_id, name, phone_no, email, created_at, updated_at, pan_no, aadhaar_no) FROM stdin;
a43a3861-c42c-40ae-9f95-9d5bc994d81c	ae744a58-ae6e-4474-8de7-523f4c40146b	Agent A	9001112222	agent.a@company.com	2025-08-18 01:11:20.050859+05:30	2025-08-18 01:11:20.050859+05:30	EJPVY2377M	885768482053
f5474a30-d5bd-4631-af35-c02569c08865	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	Agent B	9001113333	agent.b@company.com	2025-08-18 01:11:20.057678+05:30	2025-08-18 01:11:20.057678+05:30	YEYRH9472L	461151464095
545ece42-c221-4aa1-9ece-cb73b83c894e	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	Agent C	9001114444	agent.c@company.com	2025-08-18 01:11:20.059031+05:30	2025-08-18 01:11:20.059031+05:30	WERND0893V	960294203617
9159838e-706c-4667-8d31-788a73e26295	760e3b94-7528-4e92-8e4f-bafe691185ae	Agent D	9001115555	agent.d@company.com	2025-08-18 01:11:20.060545+05:30	2025-08-18 01:11:20.060545+05:30	YYQJH7717F	526840488659
2bf4736a-2bcd-440e-9d47-dae11ad80e7e	98b502f1-bbb2-4e81-a79a-a3b97e9cc26a	Ujwal M	08123047308	ujwalm308@gmail.com	2025-08-20 22:38:14.407585+05:30	2025-08-20 22:38:14.407585+05:30	ABCDE1234F	123456789012
\.


--
-- TOC entry 5206 (class 0 OID 42081)
-- Dependencies: 237
-- Data for Name: agent_supervision; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agent_supervision (agent_user_id, employee_user_id, created_at) FROM stdin;
4e33321f-0816-4aa3-821d-63cd72e390fb	8bb07bb1-98a9-4427-8b82-029ef4cbb28e	2025-08-17 23:37:24.492759+05:30
ae744a58-ae6e-4474-8de7-523f4c40146b	8bb07bb1-98a9-4427-8b82-029ef4cbb28e	2025-08-18 01:11:20.070402+05:30
8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	8bb07bb1-98a9-4427-8b82-029ef4cbb28e	2025-08-18 01:11:20.071316+05:30
5f7313da-ba5e-4cd2-ae6a-4339498a62c1	aa2c1996-81af-4dc5-bbc0-acc358f18f80	2025-08-18 01:11:20.071696+05:30
760e3b94-7528-4e92-8e4f-bafe691185ae	aa2c1996-81af-4dc5-bbc0-acc358f18f80	2025-08-18 01:11:20.072052+05:30
7664e6b2-b730-477f-a719-6d9472cfc766	dc58c893-25ba-44dd-9847-3ac3cc4f7668	2025-08-18 20:07:14.885677+05:30
98b502f1-bbb2-4e81-a79a-a3b97e9cc26a	8bb07bb1-98a9-4427-8b82-029ef4cbb28e	2025-08-20 22:38:14.40675+05:30
\.


--
-- TOC entry 5197 (class 0 OID 41918)
-- Dependencies: 227
-- Data for Name: agent_target_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agent_target_progress (id, agent_user_id, month, delta, note, created_at) FROM stdin;
a59ebe36-9fa0-47d8-9287-0a4b4647b737	7664e6b2-b730-477f-a719-6d9472cfc766	2025-08-01	10000.00	\N	2025-08-18 20:15:23.163797+05:30
c158cbd5-0695-4cc5-bed1-634321744291	ae744a58-ae6e-4474-8de7-523f4c40146b	2025-08-01	10000.00	\N	2025-08-18 20:30:57.26826+05:30
\.


--
-- TOC entry 5201 (class 0 OID 41989)
-- Dependencies: 231
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, agent_id, name, email, phone_no, status, meta, created_at, updated_at, pan_no, aadhaar_no, age, spouse_name, number_of_children, parents, premium_number) FROM stdin;
f2da1158-86b1-4ab6-8d57-31228c314ea0	4e33321f-0816-4aa3-821d-63cd72e390fb	Ujwal M	ujwalm308@gmail.com	08123047308	Denied	\N	2025-08-17 22:59:10.24916+05:30	2025-08-17 23:33:30.397706+05:30	ABCBE1234F	123456789011	22	na	0	["shaku", "madnu"]	\N
c55621bf-dc1e-4cc7-89b9-88efc6bede9c	4e33321f-0816-4aa3-821d-63cd72e390fb	Ujwal M	ujwalm308@gmail.com	08123047308	Closed	\N	2025-08-17 23:04:24.112437+05:30	2025-08-17 23:33:55.421911+05:30	ABCDE1234F	123456789012	11	na	0	["shaku", "madnu"]	123456789
7bb6b0e9-fd8c-4535-80af-847dacb0f39f	ae744a58-ae6e-4474-8de7-523f4c40146b	Ananya Iyer	ananya.iyer.1@example.com	9186926043	Closed	\N	2025-08-18 01:11:20.096958+05:30	2025-08-18 01:11:20.096958+05:30	VJIEP3861J	549041014049	47	\N	2	["Ananya Iyer", "Aisha Iyer"]	PRM-2025-1001
062d6b14-decc-42d9-ac91-6440dab197df	ae744a58-ae6e-4474-8de7-523f4c40146b	Vivaan Das	vivaan.das.2@example.com	9581626710	Denied	\N	2025-08-18 01:11:20.098363+05:30	2025-08-18 01:11:20.098363+05:30	EYZDW7114T	604527016179	34	\N	2	["Aisha Das", "Arjun Das"]	PRM-2025-1002
c666ab83-8721-41dc-bad7-fc618dd50e80	ae744a58-ae6e-4474-8de7-523f4c40146b	Aisha Patel	aisha.patel.3@example.com	9610072820	Closed	\N	2025-08-18 01:11:20.098814+05:30	2025-08-18 01:11:20.098814+05:30	QMLGO6985T	777012572357	52	\N	2	["Aditya Patel", "Aisha Patel"]	\N
9d026da3-8768-40ae-a780-32eb865f4d39	ae744a58-ae6e-4474-8de7-523f4c40146b	Aisha Reddy	aisha.reddy.4@example.com	9667689421	Denied	\N	2025-08-18 01:11:20.09922+05:30	2025-08-18 01:11:20.09922+05:30	AFEGI7366A	166936572167	29	\N	2	["Ishaan Reddy", "Krishna Reddy"]	PRM-2025-1004
762f8bc3-de13-41a7-94f4-55a7268ee679	ae744a58-ae6e-4474-8de7-523f4c40146b	Mira Reddy	mira.reddy.5@example.com	9483959017	Closed	\N	2025-08-18 01:11:20.099626+05:30	2025-08-18 01:11:20.099626+05:30	AIIUU7443F	256744189254	26	\N	2	["Aisha Reddy", "Vivaan Reddy"]	\N
5a98b80e-0a1d-4351-96bc-f1cf277634ef	ae744a58-ae6e-4474-8de7-523f4c40146b	Kunal Patel	kunal.patel.6@example.com	9585805480	Pending	\N	2025-08-18 01:11:20.100019+05:30	2025-08-18 01:11:20.100019+05:30	CTPYW8776K	220673605212	40	Arjun Patel	2	["Ira Patel", "Krishna Patel"]	\N
f3b8d041-9605-4459-b137-18a1ca2e051a	ae744a58-ae6e-4474-8de7-523f4c40146b	Sai Reddy	sai.reddy.7@example.com	9284249897	Denied	\N	2025-08-18 01:11:20.100419+05:30	2025-08-18 01:11:20.100419+05:30	TGTOB9795H	256225236720	41	Aisha Reddy	3	["Ananya Reddy", "Aditya Reddy"]	\N
e9fb43b6-4eb5-49fe-810c-78c5abc70f5f	ae744a58-ae6e-4474-8de7-523f4c40146b	Kunal Patel	kunal.patel.8@example.com	9895281961	Pending	\N	2025-08-18 01:11:20.100786+05:30	2025-08-18 01:11:20.100786+05:30	QNKMB7932Y	395791180841	54	\N	1	["Vihaan Patel", "Diya Patel"]	\N
dd6a50cb-1061-4337-9087-67b9dc880dbf	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	Mira Khanna	mira.khanna.9@example.com	9639928475	Closed	\N	2025-08-18 01:11:20.101174+05:30	2025-08-18 01:11:20.101174+05:30	WSOYZ8377D	867886534070	36	\N	2	["Aisha Khanna", "Ira Khanna"]	PRM-2025-1009
b42c0b1e-2509-4a13-b603-edd1870c5429	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	Krishna Patel	krishna.patel.10@example.com	9540711433	Closed	\N	2025-08-18 01:11:20.101607+05:30	2025-08-18 01:11:20.101607+05:30	BFNOI7195C	086893557549	29	\N	0	["Diya Patel", "Aditya Patel"]	PRM-2025-1010
c1402fa6-0fc0-44c0-9764-950f8157d464	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	Mira Kapoor	mira.kapoor.11@example.com	9917729909	Pending	\N	2025-08-18 01:11:20.102088+05:30	2025-08-18 01:11:20.102088+05:30	UPCAO5125G	350510575667	34	Rohit Kapoor	0	["Aarav Kapoor", "Arjun Kapoor"]	\N
7ad65e07-2a7b-4e21-b3d0-d4e4e7d11bdb	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	Riya Das	riya.das.12@example.com	9698337088	Pending	\N	2025-08-18 01:11:20.102465+05:30	2025-08-18 01:11:20.102465+05:30	IBUKU3592B	141865870359	42	\N	0	["Kunal Das", "Sai Das"]	\N
000c9918-fc03-42a5-b366-b2db4133f0a6	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	Ananya Mehta	ananya.mehta.13@example.com	9366559336	Denied	\N	2025-08-18 01:11:20.102999+05:30	2025-08-18 01:11:20.102999+05:30	OKHBM6088Z	787074542430	25	Mira Mehta	1	["Vihaan Mehta", "Diya Mehta"]	PRM-2025-1013
13d7b096-066b-400d-9631-851a4be67fc8	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	Kunal Ghosh	kunal.ghosh.14@example.com	9442932683	Closed	\N	2025-08-18 01:11:20.103369+05:30	2025-08-18 01:11:20.103369+05:30	MGEIH4089P	193452269944	53	Sai Ghosh	1	["Ira Ghosh", "Diya Ghosh"]	PRM-2025-1014
59be2197-af57-4efa-b43f-861fe53c90b8	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	Aisha Nair	aisha.nair.15@example.com	9851187794	Pending	\N	2025-08-18 01:11:20.103769+05:30	2025-08-18 01:11:20.103769+05:30	UUSPU7051C	038085891954	24	Arjun Nair	0	["Aarav Nair", "Rohit Nair"]	PRM-2025-1015
0344d9ef-248d-4dca-b560-5b21d3a0375d	8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	Kunal Kapoor	kunal.kapoor.16@example.com	9507581813	Denied	\N	2025-08-18 01:11:20.104168+05:30	2025-08-18 01:11:20.104168+05:30	QPRZD9050Z	321896142745	46	Krishna Kapoor	2	["Vihaan Kapoor", "Diya Kapoor"]	PRM-2025-1016
cde91a6c-e023-4cbf-8948-4c250d045aef	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	Kunal Patel	kunal.patel.17@example.com	9347795400	Pending	\N	2025-08-18 01:11:20.10457+05:30	2025-08-18 01:11:20.10457+05:30	WTSPH2387C	641934730129	22	Mira Patel	3	["Aditya Patel", "Vihaan Patel"]	PRM-2025-1017
a3f07ecb-9861-498c-8017-1bda7b993be0	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	Ishaan Mehta	ishaan.mehta.18@example.com	9594337178	Pending	\N	2025-08-18 01:11:20.10495+05:30	2025-08-18 01:11:20.10495+05:30	WLSYY1498K	953723156563	56	Rohit Mehta	3	["Krishna Mehta", "Rohit Mehta"]	\N
12150a70-2b49-4427-9d67-1f33bd8da7e1	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	Ira Sharma	ira.sharma.19@example.com	9854091285	Pending	\N	2025-08-18 01:11:20.10534+05:30	2025-08-18 01:11:20.10534+05:30	CPVLJ3450R	273459342049	40	Rohit Sharma	0	["Rohit Sharma", "Vihaan Sharma"]	\N
b83e0ef9-a2b5-4e24-9c19-9c783905591a	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	Aarav Verma	aarav.verma.20@example.com	9941422355	Closed	\N	2025-08-18 01:11:20.105718+05:30	2025-08-18 01:11:20.105718+05:30	XSOBW0605B	120255601098	50	Arjun Verma	1	["Ishaan Verma", "Aditya Verma"]	\N
545a1651-3790-4965-a2ad-1530825b6711	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	Krishna Agarwal	krishna.agarwal.21@example.com	9589499563	Denied	\N	2025-08-18 01:11:20.106431+05:30	2025-08-18 01:11:20.106431+05:30	CLTZL0974O	047411365024	24	\N	1	["Rohit Agarwal", "Vivaan Agarwal"]	PRM-2025-1021
66f8d945-7c40-4bc4-8d02-970a7970bca4	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	Mira Nair	mira.nair.22@example.com	9202222997	Closed	\N	2025-08-18 01:11:20.106954+05:30	2025-08-18 01:11:20.106954+05:30	PDLWY3123V	273401446034	40	\N	3	["Mira Nair", "Ananya Nair"]	\N
f354364b-f2c8-43a3-8246-ddeb39a72de1	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	Vivaan Nair	vivaan.nair.23@example.com	9957156450	Denied	\N	2025-08-18 01:11:20.107367+05:30	2025-08-18 01:11:20.107367+05:30	EGWVN2024V	987683590548	40	Rohit Nair	0	["Krishna Nair", "Ira Nair"]	PRM-2025-1023
b7448292-d160-40a9-bb97-09d802d1bb11	5f7313da-ba5e-4cd2-ae6a-4339498a62c1	Sai Kapoor	sai.kapoor.24@example.com	9415679705	Closed	\N	2025-08-18 01:11:20.10778+05:30	2025-08-18 01:11:20.10778+05:30	REEBZ7044M	141780412092	50	Krishna Kapoor	1	["Rohit Kapoor", "Ananya Kapoor"]	PRM-2025-1024
447f6bbc-4c7b-4b1a-9f10-e7c157f18151	760e3b94-7528-4e92-8e4f-bafe691185ae	Ananya Nair	ananya.nair.25@example.com	9550650869	Closed	\N	2025-08-18 01:11:20.108159+05:30	2025-08-18 01:11:20.108159+05:30	JNVFV0899C	942670150777	50	\N	1	["Ira Nair", "Vihaan Nair"]	\N
fec19f11-a0e0-4750-b2bc-d3da178b0034	760e3b94-7528-4e92-8e4f-bafe691185ae	Mira Mehta	mira.mehta.26@example.com	9361940909	Pending	\N	2025-08-18 01:11:20.108557+05:30	2025-08-18 01:11:20.108557+05:30	QGXPL2955U	956135108463	49	Kunal Mehta	3	["Kunal Mehta", "Aarav Mehta"]	PRM-2025-1026
07728da5-0ea2-4c38-87ce-3f9e356d1c47	760e3b94-7528-4e92-8e4f-bafe691185ae	Vivaan Ghosh	vivaan.ghosh.27@example.com	9322409047	Denied	\N	2025-08-18 01:11:20.108922+05:30	2025-08-18 01:11:20.108922+05:30	MNIFQ6357F	916982789465	42	Krishna Ghosh	1	["Ira Ghosh", "Aditya Ghosh"]	\N
47a300b2-1e56-4f6c-995f-e57064976f4d	760e3b94-7528-4e92-8e4f-bafe691185ae	Ira Agarwal	ira.agarwal.28@example.com	9199126238	Denied	\N	2025-08-18 01:11:20.109294+05:30	2025-08-18 01:11:20.109294+05:30	AUISN1896K	191657402322	56	Vivaan Agarwal	0	["Ishaan Agarwal", "Ishaan Agarwal"]	PRM-2025-1028
40ff14b2-d8ff-4e4c-8dc2-8b28fc572311	760e3b94-7528-4e92-8e4f-bafe691185ae	Kunal Reddy	kunal.reddy.29@example.com	9219844670	Closed	\N	2025-08-18 01:11:20.109725+05:30	2025-08-18 01:11:20.109725+05:30	QSIIF1845J	052020452530	36	Diya Reddy	1	["Diya Reddy", "Rohit Reddy"]	PRM-2025-1029
16782a33-8bf0-4902-9196-da307dadce64	760e3b94-7528-4e92-8e4f-bafe691185ae	Aditya Ghosh	aditya.ghosh.30@example.com	9430812587	Pending	\N	2025-08-18 01:11:20.110094+05:30	2025-08-18 01:11:20.110094+05:30	YKBDC2880E	470383195687	48	\N	0	["Aisha Ghosh", "Ishaan Ghosh"]	\N
83cb41e2-679b-4376-8ceb-f57588319a98	760e3b94-7528-4e92-8e4f-bafe691185ae	Mira Verma	mira.verma.31@example.com	9747179633	Denied	\N	2025-08-18 01:11:20.110446+05:30	2025-08-18 01:11:20.110446+05:30	TGVQU5617V	387565359127	52	\N	2	["Vihaan Verma", "Krishna Verma"]	PRM-2025-1031
112dabfd-5f56-4e24-8750-32322051678f	760e3b94-7528-4e92-8e4f-bafe691185ae	Krishna Kapoor	krishna.kapoor.32@example.com	9506513901	Pending	\N	2025-08-18 01:11:20.110808+05:30	2025-08-18 01:11:20.110808+05:30	ZFIXF1497E	879467364584	42	Mira Kapoor	2	["Vihaan Kapoor", "Vivaan Kapoor"]	\N
4332249c-ff6c-45c9-95b7-5d39c520d48a	ae744a58-ae6e-4474-8de7-523f4c40146b	Ujwal M	ujwalm308@gmail.com	08123047308	Closed	\N	2025-08-18 12:12:32.824344+05:30	2025-08-18 13:11:48.100371+05:30	ABCDE1122F	123456789023	11	ana	0	["ggg"]	\N
c29bf805-f8b2-4ff7-a6e2-230cb3ed6ae2	ae744a58-ae6e-4474-8de7-523f4c40146b	Ujwal M	ujwalm308@gmail.com	08123047308	Denied	\N	2025-08-18 12:30:55.047596+05:30	2025-08-18 13:12:00.093532+05:30	ACCDE1234F	113456789012	11	na	0	["nana", "nam"]	\N
c94ea456-e6f0-48a8-88d0-bf5a75bb28ca	\N	Ujwal M	ujwalm308@gmail.com	08123047308	Closed	\N	2025-08-18 13:18:39.891622+05:30	2025-08-18 16:02:06.462648+05:30	ABCDE1234R	123456789013	22	na	0	["nsaw"]	\N
3e593faa-8ee5-4dfc-aa1a-f74cf03c1cb8	7664e6b2-b730-477f-a719-6d9472cfc766	raju	raju@gmail.com	1234567890	Closed	\N	2025-08-18 20:10:57.928056+05:30	2025-08-18 20:12:53.120247+05:30	ASDFG9089G	123456789212	40	35	2	["ramesh"]	KPRL012
facab94a-f588-4cfe-90df-87a663ec1f7d	\N	Ujwal M	ujwalm308@gmail.com	08123047308	Pending	\N	2025-08-18 19:12:10.416059+05:30	2025-08-20 14:26:41.433112+05:30	ABCDE1235R	000000000012	22	sa	0	["gggg"]	\N
\.


--
-- TOC entry 5199 (class 0 OID 41949)
-- Dependencies: 229
-- Data for Name: employee_bank_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_bank_details (id, user_id, bank_name, bank_ifsc, bank_account_no, created_at, updated_at) FROM stdin;
cf5738c1-cddb-4aa6-9d02-c3f05cb03f69	8bb07bb1-98a9-4427-8b82-029ef4cbb28e	Axis	HDFC0001234	00112233445566	2025-08-18 01:11:20.046586+05:30	2025-08-18 01:11:20.046586+05:30
fda62c64-b81d-4d7b-8c70-74043d9d261f	aa2c1996-81af-4dc5-bbc0-acc358f18f80	SBI	HDFC0001234	00112233445566	2025-08-18 01:11:20.048611+05:30	2025-08-18 01:11:20.048611+05:30
466943a1-9d73-472d-9fc1-eb8cea0263ec	14abc802-b2cd-447d-8db2-a9bfb6aa48f6	HDFC	HDFC0001234	00112233445566	2025-08-18 01:11:20.050037+05:30	2025-08-18 01:11:20.050037+05:30
\.


--
-- TOC entry 5200 (class 0 OID 41965)
-- Dependencies: 230
-- Data for Name: employee_education_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_education_details (id, user_id, edu_10, edu_12, edu_degree, created_at, updated_at) FROM stdin;
f5ddb1d8-5e9f-49fa-b689-dd2c72b77602	8bb07bb1-98a9-4427-8b82-029ef4cbb28e	CBSE	CBSE	BBA	2025-08-18 01:11:20.047354+05:30	2025-08-18 01:11:20.047354+05:30
21e5e78f-b48b-4926-868b-c93bcd6f367d	aa2c1996-81af-4dc5-bbc0-acc358f18f80	CBSE	CBSE	BBA	2025-08-18 01:11:20.049025+05:30	2025-08-18 01:11:20.049025+05:30
84ff8238-85b8-4a01-8ec6-3769dc0b956d	14abc802-b2cd-447d-8db2-a9bfb6aa48f6	CBSE	CBSE	B.A.	2025-08-18 01:11:20.050464+05:30	2025-08-18 01:11:20.050464+05:30
\.


--
-- TOC entry 5204 (class 0 OID 42044)
-- Dependencies: 235
-- Data for Name: employee_initial_creds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_initial_creds (id, employee_user_id, temp_password, is_changed, created_at) FROM stdin;
931b31a2-b944-4c00-bbab-615370261592	8bb07bb1-98a9-4427-8b82-029ef4cbb28e	GTGGhULRGMmW	f	2025-08-17 22:00:47.868636+05:30
5b77e8b7-5059-45d0-acd8-8eca1aaa016e	aa2c1996-81af-4dc5-bbc0-acc358f18f80	Employee@123	f	2025-08-18 01:11:20.043465+05:30
9c3da7bb-b14b-4f76-ade0-0f7761ddb77e	dc58c893-25ba-44dd-9847-3ac3cc4f7668	et!iAQbnVZBD	t	2025-08-18 20:04:40.065596+05:30
d43bb650-19a5-4a44-b986-0da808d269eb	14abc802-b2cd-447d-8db2-a9bfb6aa48f6	Employee@123	t	2025-08-18 01:11:20.044375+05:30
\.


--
-- TOC entry 5210 (class 0 OID 42181)
-- Dependencies: 241
-- Data for Name: employee_monthly_targets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_monthly_targets (employee_user_id, month, target_sales, target_premium, updated_at, achieved_sales, achieved_premium) FROM stdin;
dc58c893-25ba-44dd-9847-3ac3cc4f7668	2025-08-01	10	200000.00	2025-08-20 13:55:01.159115+05:30	0	0.00
8bb07bb1-98a9-4427-8b82-029ef4cbb28e	2025-08-01	100	300000.00	2025-08-20 22:44:23.518994+05:30	0	0.00
\.


--
-- TOC entry 5198 (class 0 OID 41933)
-- Dependencies: 228
-- Data for Name: employee_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_profile (id, user_id, name, phone_no, email, created_at, updated_at, pan_no, aadhaar_no) FROM stdin;
182cabfb-4845-44c3-9aba-df439b4b7e95	8bb07bb1-98a9-4427-8b82-029ef4cbb28e	Rahul Mehta	9876500011	rahul.mehta@company.com	2025-08-18 01:11:20.04533+05:30	2025-08-18 01:11:20.04533+05:30	XBEAK5777G	516805072507
0d7f7f6e-238d-455f-869c-724e935f7882	aa2c1996-81af-4dc5-bbc0-acc358f18f80	Priya Sharma	9876500012	priya.sharma@company.com	2025-08-18 01:11:20.04816+05:30	2025-08-18 01:11:20.04816+05:30	XQHIK1340H	388599337717
12b898d5-ed5c-4548-8079-49d48f3abdcd	14abc802-b2cd-447d-8db2-a9bfb6aa48f6	Arjun Verma	9876500013	arjun.verma@company.com	2025-08-18 01:11:20.049437+05:30	2025-08-18 01:11:20.049437+05:30	ATYBB2572I	218125612999
a5e713d9-5d1c-4840-9d67-41fbe4109f10	dc58c893-25ba-44dd-9847-3ac3cc4f7668	Raju 	1234567890	raju@gmail.com	2025-08-18 20:04:40.196201+05:30	2025-08-18 20:04:40.196201+05:30	ASDFG6789H	123456789071
\.


--
-- TOC entry 5202 (class 0 OID 42013)
-- Dependencies: 233
-- Data for Name: employee_salary; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_salary (id, employee_user_id, base_salary, effective_from, created_at, updated_at) FROM stdin;
2baa023f-c568-40e6-bd52-53d8ac302bcd	aa2c1996-81af-4dc5-bbc0-acc358f18f80	48978.00	2025-08-18 01:11:20.068649+05:30	2025-08-18 01:11:20.068649+05:30	2025-08-18 01:11:20.068649+05:30
3f2cf86a-46f6-43a9-91f1-0eb827eb96c3	14abc802-b2cd-447d-8db2-a9bfb6aa48f6	52147.00	2025-08-18 01:11:20.069518+05:30	2025-08-18 01:11:20.069518+05:30	2025-08-18 01:11:20.069518+05:30
4a84e3e6-669c-4051-9830-427eaa43602c	8bb07bb1-98a9-4427-8b82-029ef4cbb28e	44566.00	2025-08-18 01:11:20.062112+05:30	2025-08-18 01:11:20.062112+05:30	2025-08-18 15:15:16.70436+05:30
07f86a9b-424f-40b3-b162-2c60357c2fec	dc58c893-25ba-44dd-9847-3ac3cc4f7668	20000.00	2025-08-20 13:25:29.323619+05:30	2025-08-20 13:25:29.323619+05:30	2025-08-20 13:25:29.323619+05:30
\.


--
-- TOC entry 5203 (class 0 OID 42030)
-- Dependencies: 234
-- Data for Name: employee_salary_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_salary_history (id, employee_user_id, base_salary, effective_from, created_at) FROM stdin;
a3833ab3-cfda-429a-b30d-b7d8788bf39f	8bb07bb1-98a9-4427-8b82-029ef4cbb28e	44566.00	2025-08-18 01:11:20.065686+05:30	2025-08-18 01:11:20.065686+05:30
da1c12bf-16e0-4dea-9dac-400dd62b883b	aa2c1996-81af-4dc5-bbc0-acc358f18f80	48978.00	2025-08-18 01:11:20.069171+05:30	2025-08-18 01:11:20.069171+05:30
af096b5b-dd2e-4c4f-95ef-a4a07752c492	14abc802-b2cd-447d-8db2-a9bfb6aa48f6	52147.00	2025-08-18 01:11:20.069913+05:30	2025-08-18 01:11:20.069913+05:30
8232ecc4-b535-46c4-ad4e-de56b4a5e940	8bb07bb1-98a9-4427-8b82-029ef4cbb28e	44566.00	2025-08-18 15:15:16.722059+05:30	2025-08-18 15:15:16.722059+05:30
5145ce19-e5ea-4026-9bf7-018a04384200	dc58c893-25ba-44dd-9847-3ac3cc4f7668	20000.00	2025-08-20 13:25:29.347492+05:30	2025-08-20 13:25:29.347492+05:30
\.


--
-- TOC entry 5209 (class 0 OID 42165)
-- Dependencies: 240
-- Data for Name: employee_target_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_target_progress (id, employee_user_id, month, delta_sales, delta_premium, note, created_at) FROM stdin;
\.


--
-- TOC entry 5208 (class 0 OID 42118)
-- Dependencies: 239
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, user_id, token_hash, user_agent, created_ip, created_at, expires_at, revoked_at) FROM stdin;
7e3e820c-6747-4bfc-b3a5-98b895e8e9d1	f3447b50-bc84-4f61-917c-7db077a96fae	73a8962baccb24bf94efa07e55adbfae171ddbf01d7362b67c9bf3b5b7e8006f	PostmanRuntime/7.45.0	::1	2025-08-16 01:41:11.191196+05:30	2025-08-23 01:41:11+05:30	\N
97ff5c3f-bd4f-4c18-81e4-671ec3e14585	4e33321f-0816-4aa3-821d-63cd72e390fb	6ac5cabd1701e638c654578b26dc5831ce91b0248057c23216de192587ddb88f	PostmanRuntime/7.45.0	::1	2025-08-16 01:42:58.275164+05:30	2025-08-23 01:42:58+05:30	\N
576f966b-256b-447f-b75b-7cf88f3fd3d2	f3447b50-bc84-4f61-917c-7db077a96fae	390c5c293da997d069808d63cd4a777e45c7b5c7119af73c13098aebfa2e22cd	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	::1	2025-08-16 01:46:09.704653+05:30	2025-08-23 01:46:09+05:30	2025-08-16 01:46:33.868154+05:30
668e3631-5690-4474-b9b7-f338e6f2803b	f3447b50-bc84-4f61-917c-7db077a96fae	ed32ee6379b91cd22bfbf8ec3427f4beb4d15a7096c156460a23d59a4192fdf3	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36	::1	2025-08-16 01:46:38.617304+05:30	2025-08-23 01:46:38+05:30	2025-08-16 15:39:49.653468+05:30
61688422-f610-4c9b-86bd-5806e6442e80	f3447b50-bc84-4f61-917c-7db077a96fae	19dddfa438d8518ca5fa4dd29ee624199b26db9ebd6cb6dd552ea4cb0453f0fe	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	::1	2025-08-16 15:40:18.299471+05:30	2025-08-23 15:40:18+05:30	2025-08-16 15:40:40.893496+05:30
bd799efc-aea2-4b2e-a650-a85bba03ed6a	f3447b50-bc84-4f61-917c-7db077a96fae	901007fbd7b6d3d4ae6c2334a864c63ad08268e513b408eb09b867eee5712ea2	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	::1	2025-08-16 15:40:42.499552+05:30	2025-08-23 15:40:42+05:30	2025-08-17 16:38:34.842988+05:30
4179700d-8883-4940-85b3-c034a8e03bce	f3447b50-bc84-4f61-917c-7db077a96fae	962b7197c35717ec58940d2ef99f6953b166ec234da282f9614a64be8bf97c23	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	::1	2025-08-17 16:39:52.911772+05:30	2025-08-24 16:39:52+05:30	\N
d0f44281-d679-4006-9930-853fb1779044	4e33321f-0816-4aa3-821d-63cd72e390fb	d3695b3929a0af74bfd77a4120200b8623bc647dffb7ab99b8a1b5ceddd6ed8c	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	::1	2025-08-17 16:43:02.330459+05:30	2025-08-24 16:43:02+05:30	2025-08-17 16:54:16.814699+05:30
4ca47c58-1149-4f78-a090-3b2d7efd9c86	f3447b50-bc84-4f61-917c-7db077a96fae	e846a1804487df64e7478955afdb04db4d0556e1f774ffb9724647d27232e3a2	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	::1	2025-08-17 21:33:16.008557+05:30	2025-08-24 21:33:16+05:30	2025-08-17 21:56:23.222497+05:30
e137b32c-1a7c-4e08-9cac-55c683508c2d	f3447b50-bc84-4f61-917c-7db077a96fae	dab2c3ea6740faeddb93d86ef8a2acd281ba2e2ecb5ea71887b900d650082d7f	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	::1	2025-08-17 21:59:42.618121+05:30	2025-08-24 21:59:42+05:30	2025-08-17 22:51:23.084293+05:30
4f11bc2d-0a5b-469a-9db0-6a5d4128c790	f3447b50-bc84-4f61-917c-7db077a96fae	729292405e3e05eae7ec30daf565ac4435dd8229108c9f487a84ccf12c4f4e73	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	::1	2025-08-17 22:51:57.735664+05:30	2025-08-24 22:51:57+05:30	\N
78fa8341-7531-4e65-8886-3ea89515f523	4e33321f-0816-4aa3-821d-63cd72e390fb	32505b35e4961e1b5f52143f235009b94e3d435c0f3d6d5bb938c7552fbbd9ad	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	::1	2025-08-17 22:54:01.429902+05:30	2025-08-24 22:54:01+05:30	\N
85f21e79-8be7-4a20-979d-c91a2987a837	4e33321f-0816-4aa3-821d-63cd72e390fb	7313da4d44025adc6b1125bf24ed7ee5459c58cfb434da538d7ae575b1a82de8	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	::1	2025-08-17 22:57:19.341774+05:30	2025-08-24 22:57:19+05:30	2025-08-17 22:59:32.974014+05:30
\.


--
-- TOC entry 5189 (class 0 OID 41798)
-- Dependencies: 219
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (sid, sess, expire) FROM stdin;
\.


--
-- TOC entry 5188 (class 0 OID 41783)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, role, name, email, phone_no, password_hash, created_at, updated_at) FROM stdin;
f3447b50-bc84-4f61-917c-7db077a96fae	super_admin	Super Admin	superadmin@example.com	9999999999	$2a$12$BxwniXG0pcCc94Q6N.XVV.zg79uk/dWw5qgTVEF3gefe4pny9yW0a	2025-08-16 01:14:31.958922+05:30	2025-08-16 01:40:55.834752+05:30
4e33321f-0816-4aa3-821d-63cd72e390fb	agent	Agent A	agent@example.com	8888888888	$2a$12$dTf/E.5YPU0iskAXssS/0.n08fvFJPKumDXMiXPJer6vM6xRaUF2a	2025-08-16 01:41:45.486598+05:30	2025-08-18 00:17:25.254195+05:30
3f3c7586-b7f9-4b3b-b452-73d61c08812e	admin	Super Admin	admin@company.com	9990001111	$2a$10$tMQTuNMbAcJg2IiVLyjkM.i0MYlV47.cWb2GmutKvZILLqkMuR4pq	2025-08-18 01:11:19.645878+05:30	2025-08-18 01:11:19.645878+05:30
aa2c1996-81af-4dc5-bbc0-acc358f18f80	employee	Priya Sharma	priya.sharma@company.com	9876500012	$2a$10$4cf13klNxdt4Zgx5iFubhuIjAGTO6Aza.4IDA/NV8X7/qtuZQo1lO	2025-08-18 01:11:19.752569+05:30	2025-08-18 01:11:19.752569+05:30
ae744a58-ae6e-4474-8de7-523f4c40146b	agent	Agent A	agent.a@company.com	9001112222	$2a$10$1ih/gkRqQTId.LgWw55JEOgrpf.Ez3SFYvcD7le4tL30E5Ym4VxfW	2025-08-18 01:11:19.846787+05:30	2025-08-18 01:11:19.846787+05:30
8b54f88a-472c-4dd6-b8b4-ca5196f0e0f3	agent	Agent B	agent.b@company.com	9001113333	$2a$10$N8Ei7TBX/BeQZ8pktLo23.eh4Y9MoIKNbKGU5lKclsphGsfHRCYTm	2025-08-18 01:11:19.894346+05:30	2025-08-18 01:11:19.894346+05:30
5f7313da-ba5e-4cd2-ae6a-4339498a62c1	agent	Agent C	agent.c@company.com	9001114444	$2a$10$yVvtVVGyA3u9qEuQN2le/.QpoRgQFIFK3xUHaH.R6y3vBrC.u41Jy	2025-08-18 01:11:19.942251+05:30	2025-08-18 01:11:19.942251+05:30
760e3b94-7528-4e92-8e4f-bafe691185ae	agent	Agent D	agent.d@company.com	9001115555	$2a$10$jq2nZv8AcxdYsvSlVkTs5OGeQYqoybV1gaklb/Z2BIllM6HmudJe6	2025-08-18 01:11:19.989542+05:30	2025-08-18 01:11:19.989542+05:30
8bb07bb1-98a9-4427-8b82-029ef4cbb28e	employee	Rahul Mehta	rahul.mehta@company.com	9876500011	$2a$12$2/J5Cx/Y87/5tMrmZU3XpOpdF4anVOaFOE666ekt7scLJRNuYdOAy	2025-08-17 22:00:47.864743+05:30	2025-08-18 01:19:52.531577+05:30
7664e6b2-b730-477f-a719-6d9472cfc766	agent	raju a	rajua6@gmail.com	1234567890	$2a$12$Fd.q8NlyD3Kq5KEM.OWvcOJ0UK9OW7LrgKkLDVc/lKN7WaqlJyRBO	2025-08-18 20:07:14.880866+05:30	2025-08-18 20:07:14.880866+05:30
dc58c893-25ba-44dd-9847-3ac3cc4f7668	employee	Raju 	raju@gmail.com	1234567890	$2a$12$SymxFmD8hNsh9/Zyq.Z7suXd/MQYOKIwqUSwyqtGiOnzDbKRH52dG	2025-08-18 20:04:40.058879+05:30	2025-08-19 00:08:05.836509+05:30
98b502f1-bbb2-4e81-a79a-a3b97e9cc26a	agent	Ujwal M	ujwalm308@gmail.com	08123047308	$2a$12$uCxY5r7.7yLym4u40AX1VeOuwG082wzagMorxdcdbkzqk4HHBIOX.	2025-08-20 22:38:14.398961+05:30	2025-08-20 22:38:14.398961+05:30
14abc802-b2cd-447d-8db2-a9bfb6aa48f6	employee	Arjun Verma	arjun.verma@company.com	9876500013	$2a$12$ljLj11FogiQgh2FmhI0KuuMcwwkHfuc//80HHXARoT1aEWqnuQ3w6	2025-08-18 01:11:19.799687+05:30	2025-08-20 22:48:55.328497+05:30
\.


--
-- TOC entry 4924 (class 2606 OID 41814)
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4932 (class 2606 OID 41845)
-- Name: agent_bank_details agent_bank_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_bank_details
    ADD CONSTRAINT agent_bank_details_pkey PRIMARY KEY (id);


--
-- TOC entry 4934 (class 2606 OID 41847)
-- Name: agent_bank_details agent_bank_details_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_bank_details
    ADD CONSTRAINT agent_bank_details_user_id_key UNIQUE (user_id);


--
-- TOC entry 4987 (class 2606 OID 42074)
-- Name: agent_compensation agent_compensation_agent_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_compensation
    ADD CONSTRAINT agent_compensation_agent_user_id_key UNIQUE (agent_user_id);


--
-- TOC entry 4945 (class 2606 OID 41894)
-- Name: agent_compensation_history agent_compensation_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_compensation_history
    ADD CONSTRAINT agent_compensation_history_pkey PRIMARY KEY (id);


--
-- TOC entry 4989 (class 2606 OID 42072)
-- Name: agent_compensation agent_compensation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_compensation
    ADD CONSTRAINT agent_compensation_pkey PRIMARY KEY (id);


--
-- TOC entry 4936 (class 2606 OID 41861)
-- Name: agent_education_details agent_education_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_education_details
    ADD CONSTRAINT agent_education_details_pkey PRIMARY KEY (id);


--
-- TOC entry 4938 (class 2606 OID 41863)
-- Name: agent_education_details agent_education_details_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_education_details
    ADD CONSTRAINT agent_education_details_user_id_key UNIQUE (user_id);


--
-- TOC entry 4940 (class 2606 OID 41881)
-- Name: agent_initial_creds agent_initial_creds_agent_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_initial_creds
    ADD CONSTRAINT agent_initial_creds_agent_user_id_key UNIQUE (agent_user_id);


--
-- TOC entry 4942 (class 2606 OID 41879)
-- Name: agent_initial_creds agent_initial_creds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_initial_creds
    ADD CONSTRAINT agent_initial_creds_pkey PRIMARY KEY (id);


--
-- TOC entry 4995 (class 2606 OID 42107)
-- Name: agent_monthly_stats agent_monthly_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_monthly_stats
    ADD CONSTRAINT agent_monthly_stats_pkey PRIMARY KEY (id);


--
-- TOC entry 4997 (class 2606 OID 42109)
-- Name: agent_monthly_stats agent_monthly_stats_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_monthly_stats
    ADD CONSTRAINT agent_monthly_stats_unique UNIQUE (agent_user_id, month);


--
-- TOC entry 4947 (class 2606 OID 41909)
-- Name: agent_monthly_targets agent_monthly_targets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_monthly_targets
    ADD CONSTRAINT agent_monthly_targets_pkey PRIMARY KEY (id);


--
-- TOC entry 4949 (class 2606 OID 41911)
-- Name: agent_monthly_targets agent_monthly_targets_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_monthly_targets
    ADD CONSTRAINT agent_monthly_targets_uniq UNIQUE (agent_user_id, month);


--
-- TOC entry 4928 (class 2606 OID 41829)
-- Name: agent_profile agent_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_profile
    ADD CONSTRAINT agent_profile_pkey PRIMARY KEY (id);


--
-- TOC entry 4930 (class 2606 OID 41831)
-- Name: agent_profile agent_profile_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_profile
    ADD CONSTRAINT agent_profile_user_id_key UNIQUE (user_id);


--
-- TOC entry 4991 (class 2606 OID 42086)
-- Name: agent_supervision agent_supervision_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_supervision
    ADD CONSTRAINT agent_supervision_pkey PRIMARY KEY (agent_user_id);


--
-- TOC entry 4952 (class 2606 OID 41926)
-- Name: agent_target_progress agent_target_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_target_progress
    ADD CONSTRAINT agent_target_progress_pkey PRIMARY KEY (id);


--
-- TOC entry 4971 (class 2606 OID 41999)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- TOC entry 4960 (class 2606 OID 41956)
-- Name: employee_bank_details employee_bank_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_bank_details
    ADD CONSTRAINT employee_bank_details_pkey PRIMARY KEY (id);


--
-- TOC entry 4962 (class 2606 OID 41958)
-- Name: employee_bank_details employee_bank_details_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_bank_details
    ADD CONSTRAINT employee_bank_details_user_id_key UNIQUE (user_id);


--
-- TOC entry 4964 (class 2606 OID 41972)
-- Name: employee_education_details employee_education_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_education_details
    ADD CONSTRAINT employee_education_details_pkey PRIMARY KEY (id);


--
-- TOC entry 4966 (class 2606 OID 41974)
-- Name: employee_education_details employee_education_details_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_education_details
    ADD CONSTRAINT employee_education_details_user_id_key UNIQUE (user_id);


--
-- TOC entry 4983 (class 2606 OID 42055)
-- Name: employee_initial_creds employee_initial_creds_employee_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_initial_creds
    ADD CONSTRAINT employee_initial_creds_employee_user_id_key UNIQUE (employee_user_id);


--
-- TOC entry 4985 (class 2606 OID 42053)
-- Name: employee_initial_creds employee_initial_creds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_initial_creds
    ADD CONSTRAINT employee_initial_creds_pkey PRIMARY KEY (id);


--
-- TOC entry 5006 (class 2606 OID 42188)
-- Name: employee_monthly_targets employee_monthly_targets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_monthly_targets
    ADD CONSTRAINT employee_monthly_targets_pkey PRIMARY KEY (employee_user_id, month);


--
-- TOC entry 4956 (class 2606 OID 41940)
-- Name: employee_profile employee_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_profile
    ADD CONSTRAINT employee_profile_pkey PRIMARY KEY (id);


--
-- TOC entry 4958 (class 2606 OID 41942)
-- Name: employee_profile employee_profile_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_profile
    ADD CONSTRAINT employee_profile_user_id_key UNIQUE (user_id);


--
-- TOC entry 4976 (class 2606 OID 42023)
-- Name: employee_salary employee_salary_employee_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_salary
    ADD CONSTRAINT employee_salary_employee_user_id_key UNIQUE (employee_user_id);


--
-- TOC entry 4981 (class 2606 OID 42037)
-- Name: employee_salary_history employee_salary_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_salary_history
    ADD CONSTRAINT employee_salary_history_pkey PRIMARY KEY (id);


--
-- TOC entry 4978 (class 2606 OID 42021)
-- Name: employee_salary employee_salary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_salary
    ADD CONSTRAINT employee_salary_pkey PRIMARY KEY (id);


--
-- TOC entry 5004 (class 2606 OID 42175)
-- Name: employee_target_progress employee_target_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_target_progress
    ADD CONSTRAINT employee_target_progress_pkey PRIMARY KEY (id);


--
-- TOC entry 5000 (class 2606 OID 42126)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4920 (class 2606 OID 41804)
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- TOC entry 4914 (class 2606 OID 41794)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4916 (class 2606 OID 41792)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4918 (class 1259 OID 41805)
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- TOC entry 4921 (class 1259 OID 41821)
-- Name: activity_logs_action_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX activity_logs_action_idx ON public.activity_logs USING btree (action);


--
-- TOC entry 4922 (class 1259 OID 41820)
-- Name: activity_logs_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX activity_logs_created_at_idx ON public.activity_logs USING btree (created_at DESC);


--
-- TOC entry 4943 (class 1259 OID 41900)
-- Name: agent_comp_hist_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX agent_comp_hist_user_idx ON public.agent_compensation_history USING btree (agent_user_id, effective_from DESC);


--
-- TOC entry 4925 (class 1259 OID 42141)
-- Name: agent_profile_aadhaar_uniq; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX agent_profile_aadhaar_uniq ON public.agent_profile USING btree (aadhaar_no) WHERE (aadhaar_no IS NOT NULL);


--
-- TOC entry 4926 (class 1259 OID 42140)
-- Name: agent_profile_pan_uniq; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX agent_profile_pan_uniq ON public.agent_profile USING btree (pan_no) WHERE (pan_no IS NOT NULL);


--
-- TOC entry 4950 (class 1259 OID 41932)
-- Name: agent_target_progress_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX agent_target_progress_idx ON public.agent_target_progress USING btree (agent_user_id, month);


--
-- TOC entry 4967 (class 1259 OID 42145)
-- Name: customers_aadhaar_uniq; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX customers_aadhaar_uniq ON public.customers USING btree (aadhaar_no) WHERE (aadhaar_no IS NOT NULL);


--
-- TOC entry 4968 (class 1259 OID 42006)
-- Name: customers_agent_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX customers_agent_idx ON public.customers USING btree (agent_id);


--
-- TOC entry 4969 (class 1259 OID 42144)
-- Name: customers_pan_uniq; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX customers_pan_uniq ON public.customers USING btree (pan_no) WHERE (pan_no IS NOT NULL);


--
-- TOC entry 4972 (class 1259 OID 42149)
-- Name: customers_premium_number_uniq; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX customers_premium_number_uniq ON public.customers USING btree (premium_number) WHERE (premium_number IS NOT NULL);


--
-- TOC entry 4973 (class 1259 OID 42007)
-- Name: customers_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX customers_status_idx ON public.customers USING btree (status);


--
-- TOC entry 4953 (class 1259 OID 42143)
-- Name: employee_profile_aadhaar_uniq; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX employee_profile_aadhaar_uniq ON public.employee_profile USING btree (aadhaar_no) WHERE (aadhaar_no IS NOT NULL);


--
-- TOC entry 4954 (class 1259 OID 42142)
-- Name: employee_profile_pan_uniq; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX employee_profile_pan_uniq ON public.employee_profile USING btree (pan_no) WHERE (pan_no IS NOT NULL);


--
-- TOC entry 4979 (class 1259 OID 42043)
-- Name: employee_salary_hist_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX employee_salary_hist_user_idx ON public.employee_salary_history USING btree (employee_user_id, effective_from DESC);


--
-- TOC entry 4998 (class 1259 OID 42199)
-- Name: ix_ams_agent_month; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_ams_agent_month ON public.agent_monthly_stats USING btree (agent_user_id, month);


--
-- TOC entry 4974 (class 1259 OID 42200)
-- Name: ix_customers_agent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_customers_agent ON public.customers USING btree (agent_id);


--
-- TOC entry 4992 (class 1259 OID 42198)
-- Name: ix_supervision_agent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_supervision_agent ON public.agent_supervision USING btree (agent_user_id);


--
-- TOC entry 4993 (class 1259 OID 42197)
-- Name: ix_supervision_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_supervision_employee ON public.agent_supervision USING btree (employee_user_id);


--
-- TOC entry 5001 (class 1259 OID 42133)
-- Name: refresh_tokens_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX refresh_tokens_token_idx ON public.refresh_tokens USING btree (token_hash);


--
-- TOC entry 5002 (class 1259 OID 42132)
-- Name: refresh_tokens_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX refresh_tokens_user_idx ON public.refresh_tokens USING btree (user_id);


--
-- TOC entry 4912 (class 1259 OID 41797)
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- TOC entry 4917 (class 1259 OID 41796)
-- Name: users_role_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_role_idx ON public.users USING btree (role);


--
-- TOC entry 5187 (class 2618 OID 42011)
-- Name: agents_with_customer_counts _RETURN; Type: RULE; Schema: public; Owner: postgres
--

CREATE OR REPLACE VIEW public.agents_with_customer_counts AS
 SELECT u.id AS agent_id,
    u.name AS agent_name,
    u.email,
    u.phone_no,
    (COALESCE(count(c.id), (0)::bigint))::integer AS customer_count
   FROM (public.users u
     LEFT JOIN public.customers c ON ((c.agent_id = u.id)))
  WHERE (u.role = 'agent'::public.user_role)
  GROUP BY u.id;


--
-- TOC entry 5031 (class 2620 OID 41853)
-- Name: agent_bank_details trg_agent_bank_details_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_agent_bank_details_updated BEFORE UPDATE ON public.agent_bank_details FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 5039 (class 2620 OID 42080)
-- Name: agent_compensation trg_agent_compensation_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_agent_compensation_updated BEFORE UPDATE ON public.agent_compensation FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 5032 (class 2620 OID 41869)
-- Name: agent_education_details trg_agent_education_details_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_agent_education_details_updated BEFORE UPDATE ON public.agent_education_details FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 5040 (class 2620 OID 42150)
-- Name: agent_monthly_stats trg_agent_monthly_stats_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_agent_monthly_stats_updated BEFORE UPDATE ON public.agent_monthly_stats FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 5033 (class 2620 OID 41917)
-- Name: agent_monthly_targets trg_agent_monthly_targets_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_agent_monthly_targets_updated BEFORE UPDATE ON public.agent_monthly_targets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 5030 (class 2620 OID 41837)
-- Name: agent_profile trg_agent_profile_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_agent_profile_updated BEFORE UPDATE ON public.agent_profile FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 5037 (class 2620 OID 42005)
-- Name: customers trg_customers_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 5041 (class 2620 OID 42196)
-- Name: employee_monthly_targets trg_emp_monthly_targets_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_emp_monthly_targets_updated BEFORE UPDATE ON public.employee_monthly_targets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 5035 (class 2620 OID 41964)
-- Name: employee_bank_details trg_employee_bank_details_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_employee_bank_details_updated BEFORE UPDATE ON public.employee_bank_details FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 5036 (class 2620 OID 41980)
-- Name: employee_education_details trg_employee_education_details_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_employee_education_details_updated BEFORE UPDATE ON public.employee_education_details FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 5034 (class 2620 OID 41948)
-- Name: employee_profile trg_employee_profile_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_employee_profile_updated BEFORE UPDATE ON public.employee_profile FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 5038 (class 2620 OID 42029)
-- Name: employee_salary trg_employee_salary_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_employee_salary_updated BEFORE UPDATE ON public.employee_salary FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 5029 (class 2620 OID 41795)
-- Name: users trg_users_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 5007 (class 2606 OID 41815)
-- Name: activity_logs activity_logs_actor_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5009 (class 2606 OID 41848)
-- Name: agent_bank_details agent_bank_details_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_bank_details
    ADD CONSTRAINT agent_bank_details_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5022 (class 2606 OID 42075)
-- Name: agent_compensation agent_compensation_agent_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_compensation
    ADD CONSTRAINT agent_compensation_agent_user_id_fkey FOREIGN KEY (agent_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5012 (class 2606 OID 41895)
-- Name: agent_compensation_history agent_compensation_history_agent_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_compensation_history
    ADD CONSTRAINT agent_compensation_history_agent_user_id_fkey FOREIGN KEY (agent_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5010 (class 2606 OID 41864)
-- Name: agent_education_details agent_education_details_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_education_details
    ADD CONSTRAINT agent_education_details_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5011 (class 2606 OID 41882)
-- Name: agent_initial_creds agent_initial_creds_agent_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_initial_creds
    ADD CONSTRAINT agent_initial_creds_agent_user_id_fkey FOREIGN KEY (agent_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5025 (class 2606 OID 42110)
-- Name: agent_monthly_stats agent_monthly_stats_agent_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_monthly_stats
    ADD CONSTRAINT agent_monthly_stats_agent_user_id_fkey FOREIGN KEY (agent_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5013 (class 2606 OID 41912)
-- Name: agent_monthly_targets agent_monthly_targets_agent_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_monthly_targets
    ADD CONSTRAINT agent_monthly_targets_agent_user_id_fkey FOREIGN KEY (agent_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5008 (class 2606 OID 41832)
-- Name: agent_profile agent_profile_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_profile
    ADD CONSTRAINT agent_profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5023 (class 2606 OID 42087)
-- Name: agent_supervision agent_supervision_agent_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_supervision
    ADD CONSTRAINT agent_supervision_agent_user_id_fkey FOREIGN KEY (agent_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5024 (class 2606 OID 42092)
-- Name: agent_supervision agent_supervision_employee_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_supervision
    ADD CONSTRAINT agent_supervision_employee_user_id_fkey FOREIGN KEY (employee_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5014 (class 2606 OID 41927)
-- Name: agent_target_progress agent_target_progress_agent_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_target_progress
    ADD CONSTRAINT agent_target_progress_agent_user_id_fkey FOREIGN KEY (agent_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5018 (class 2606 OID 42000)
-- Name: customers customers_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5016 (class 2606 OID 41959)
-- Name: employee_bank_details employee_bank_details_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_bank_details
    ADD CONSTRAINT employee_bank_details_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5017 (class 2606 OID 41975)
-- Name: employee_education_details employee_education_details_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_education_details
    ADD CONSTRAINT employee_education_details_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5021 (class 2606 OID 42056)
-- Name: employee_initial_creds employee_initial_creds_employee_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_initial_creds
    ADD CONSTRAINT employee_initial_creds_employee_user_id_fkey FOREIGN KEY (employee_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5028 (class 2606 OID 42189)
-- Name: employee_monthly_targets employee_monthly_targets_employee_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_monthly_targets
    ADD CONSTRAINT employee_monthly_targets_employee_user_id_fkey FOREIGN KEY (employee_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5015 (class 2606 OID 41943)
-- Name: employee_profile employee_profile_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_profile
    ADD CONSTRAINT employee_profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5019 (class 2606 OID 42024)
-- Name: employee_salary employee_salary_employee_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_salary
    ADD CONSTRAINT employee_salary_employee_user_id_fkey FOREIGN KEY (employee_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5020 (class 2606 OID 42038)
-- Name: employee_salary_history employee_salary_history_employee_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_salary_history
    ADD CONSTRAINT employee_salary_history_employee_user_id_fkey FOREIGN KEY (employee_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5027 (class 2606 OID 42176)
-- Name: employee_target_progress employee_target_progress_employee_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_target_progress
    ADD CONSTRAINT employee_target_progress_employee_user_id_fkey FOREIGN KEY (employee_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5026 (class 2606 OID 42127)
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-08-20 23:12:57

--
-- PostgreSQL database dump complete
--

