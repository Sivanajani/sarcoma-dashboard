--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-1.pgdg24.04+1)
-- Dumped by pg_dump version 16.8 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.ar_internal_metadata OWNER TO dbadmin;

--
-- Name: croms_diagnoses; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.croms_diagnoses (
    id bigint NOT NULL,
    tumor_anatomic_region character varying,
    tumor_anatomic_lesion_side character varying,
    tumor_syndromes character varying[] DEFAULT '{}'::character varying[],
    tumor_diagnosis text,
    additional_tumor_anatomic_region character varying,
    additional_tumor_anatomic_lesion_side character varying,
    additional_tumor_diagnosis text,
    other_diagnosis text,
    patient_history text,
    diagnosis_ecog integer,
    last_contact_date date,
    last_status character varying,
    death_reason character varying,
    patient_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.croms_diagnoses OWNER TO dbadmin;

--
-- Name: croms_diagnoses_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.croms_diagnoses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.croms_diagnoses_id_seq OWNER TO dbadmin;

--
-- Name: croms_diagnoses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.croms_diagnoses_id_seq OWNED BY public.croms_diagnoses.id;


--
-- Name: croms_hyperthermia_therapies; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.croms_hyperthermia_therapies (
    id bigint NOT NULL,
    indication character varying,
    start_date date,
    end_date date,
    hyperthermia_type character varying,
    therapy_sessions_count integer,
    schedule character varying,
    board_accepted_indication boolean,
    comment text,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    therapy_type character varying,
    therapy_id bigint
);


ALTER TABLE public.croms_hyperthermia_therapies OWNER TO dbadmin;

--
-- Name: croms_hyperthermia_therapies_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.croms_hyperthermia_therapies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.croms_hyperthermia_therapies_id_seq OWNER TO dbadmin;

--
-- Name: croms_hyperthermia_therapies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.croms_hyperthermia_therapies_id_seq OWNED BY public.croms_hyperthermia_therapies.id;


--
-- Name: croms_pathologies; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.croms_pathologies (
    id bigint NOT NULL,
    data_entry_type character varying NOT NULL,
    biopsy_resection_date date,
    registrate_date date,
    first_report_date date,
    final_report_date date,
    prior_pathology character varying,
    who_diagnosis character varying,
    diagnostic_grading character varying,
    judgment_of_surgical_margin character varying,
    proliferation_index character varying,
    mitoses_per_10hpf character varying,
    extent_of_necrosis character varying,
    closest_distance_to_margin_mm integer,
    biological_barrier_to_closest_margin character varying,
    ihc_performed_status character varying,
    fish_performed_status character varying,
    rna_performed_status character varying,
    dna_performed_status character varying,
    ihc_result character varying,
    fish_result character varying,
    rna_result character varying,
    dna_result character varying,
    patient_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.croms_pathologies OWNER TO dbadmin;

--
-- Name: croms_pathologies_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.croms_pathologies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.croms_pathologies_id_seq OWNER TO dbadmin;

--
-- Name: croms_pathologies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.croms_pathologies_id_seq OWNED BY public.croms_pathologies.id;


--
-- Name: croms_patients; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.croms_patients (
    id bigint NOT NULL,
    external_code character varying NOT NULL,
    consent boolean NOT NULL,
    ahv character varying NOT NULL,
    institution_name character varying,
    last_name character varying NOT NULL,
    first_name character varying NOT NULL,
    birth_date date,
    gender character varying NOT NULL,
    street_name character varying,
    street_number character varying,
    zip_code character varying,
    city character varying,
    country character varying,
    phone_number character varying,
    email character varying,
    insurance_name character varying,
    insurance_class character varying,
    insurance_number character varying,
    general_practitioner_name character varying,
    general_practitioner_email character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.croms_patients OWNER TO dbadmin;

--
-- Name: croms_patients_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.croms_patients_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.croms_patients_id_seq OWNER TO dbadmin;

--
-- Name: croms_patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.croms_patients_id_seq OWNED BY public.croms_patients.id;


--
-- Name: croms_radiology_exams; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.croms_radiology_exams (
    id bigint NOT NULL,
    patient_id bigint NOT NULL,
    exam_date date NOT NULL,
    exam_type character varying,
    imaging_timing character varying,
    imaging_type character varying NOT NULL,
    largest_lesion_size_in_mm integer,
    medium_lesion_size_in_mm integer,
    smallest_lesion_size_in_mm integer,
    location_of_lesion character varying,
    recist_response character varying,
    choi_response character varying,
    irecist_response character varying,
    pet_response character varying,
    metastasis_presence boolean,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.croms_radiology_exams OWNER TO dbadmin;

--
-- Name: croms_radiology_exams_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.croms_radiology_exams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.croms_radiology_exams_id_seq OWNER TO dbadmin;

--
-- Name: croms_radiology_exams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.croms_radiology_exams_id_seq OWNED BY public.croms_radiology_exams.id;


--
-- Name: croms_radiology_therapies; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.croms_radiology_therapies (
    id bigint NOT NULL,
    patient_id bigint NOT NULL,
    indication character varying,
    therapy_type character varying NOT NULL,
    referral_date date,
    first_contact_date date,
    therapy_start_date date NOT NULL,
    therapy_end_date date,
    institution_name character varying,
    total_dose_in_gy double precision,
    given_fractions integer,
    ptv_volume_in_cm3 double precision,
    gtv_volume_in_cm3 double precision,
    was_tumor_located_in_radiated_area boolean,
    was_tumor_located_with_pre_existing_lymph_edema boolean,
    comments text,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    hyperthermia_status character varying
);


ALTER TABLE public.croms_radiology_therapies OWNER TO dbadmin;

--
-- Name: croms_radiology_therapies_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.croms_radiology_therapies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.croms_radiology_therapies_id_seq OWNER TO dbadmin;

--
-- Name: croms_radiology_therapies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.croms_radiology_therapies_id_seq OWNED BY public.croms_radiology_therapies.id;


--
-- Name: croms_sarcoma_boards; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.croms_sarcoma_boards (
    id bigint NOT NULL,
    patient_id bigint NOT NULL,
    presentation_date date NOT NULL,
    reason_for_presentation character varying,
    status_before_follow_up character varying,
    unplanned_excision_date date,
    whoops_surgery_institution_name character varying,
    status_after_follow_up character varying,
    treatment_before_follow_up character varying,
    follow_up_reason character varying,
    question text,
    last_execution character varying,
    proposed_procedure text,
    current_ecog integer,
    decision_surgery character varying,
    decision_surgery_comment text,
    decision_radio_therapy character varying,
    decision_radio_therapy_comment text,
    decision_systemic_surgery character varying,
    decision_systemic_surgery_comment text,
    decision_follow_up character varying,
    decision_follow_up_comment text,
    decision_diagnostics character varying,
    decision_diagnostics_comment text,
    decision_palliative_care character varying,
    decision_palliative_care_comment text,
    summary text,
    further_details text,
    fast_track boolean DEFAULT false,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.croms_sarcoma_boards OWNER TO dbadmin;

--
-- Name: croms_sarcoma_boards_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.croms_sarcoma_boards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.croms_sarcoma_boards_id_seq OWNER TO dbadmin;

--
-- Name: croms_sarcoma_boards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.croms_sarcoma_boards_id_seq OWNED BY public.croms_sarcoma_boards.id;


--
-- Name: croms_surgeries; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.croms_surgeries (
    id bigint NOT NULL,
    patient_id bigint NOT NULL,
    surgery_date date NOT NULL,
    institution_name character varying,
    indication character varying,
    surgery_side character varying,
    greatest_surgical_tumor_dimension_in_mm integer,
    had_tumor_spillage boolean,
    first_revision_details character varying,
    second_revision_details character varying,
    anatomic_region character varying,
    resection character varying,
    reconstruction character varying,
    amputation character varying,
    resected_tumor_margin character varying,
    participated_disciplines character varying[] DEFAULT '{}'::character varying[],
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    hemipelvectomy character varying[] DEFAULT '{}'::character varying[]
);


ALTER TABLE public.croms_surgeries OWNER TO dbadmin;

--
-- Name: croms_surgeries_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.croms_surgeries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.croms_surgeries_id_seq OWNER TO dbadmin;

--
-- Name: croms_surgeries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.croms_surgeries_id_seq OWNED BY public.croms_surgeries.id;


--
-- Name: croms_systemic_therapies; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.croms_systemic_therapies (
    id bigint NOT NULL,
    patient_id bigint NOT NULL,
    reason character varying,
    treatment_line integer,
    cycles_planned character varying,
    bone_protocol character varying,
    softtissue_protocol character varying,
    institution_name character varying NOT NULL,
    cycle_start_date date,
    cycle_end_date date,
    discontinuation_reason character varying,
    was_rct_concomittant boolean DEFAULT false NOT NULL,
    comments text,
    clinical_trial_inclusion character varying,
    hyperthermia_status character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.croms_systemic_therapies OWNER TO dbadmin;

--
-- Name: croms_systemic_therapies_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.croms_systemic_therapies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.croms_systemic_therapies_id_seq OWNER TO dbadmin;

--
-- Name: croms_systemic_therapies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.croms_systemic_therapies_id_seq OWNED BY public.croms_systemic_therapies.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


ALTER TABLE public.schema_migrations OWNER TO dbadmin;

--
-- Name: solid_cable_messages; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.solid_cable_messages (
    id bigint NOT NULL,
    channel bytea NOT NULL,
    payload bytea NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    channel_hash bigint NOT NULL
);


ALTER TABLE public.solid_cable_messages OWNER TO dbadmin;

--
-- Name: solid_cable_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.solid_cable_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solid_cable_messages_id_seq OWNER TO dbadmin;

--
-- Name: solid_cable_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.solid_cable_messages_id_seq OWNED BY public.solid_cable_messages.id;


--
-- Name: solid_cache_entries; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.solid_cache_entries (
    id bigint NOT NULL,
    key bytea NOT NULL,
    value bytea NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    key_hash bigint NOT NULL,
    byte_size integer NOT NULL
);


ALTER TABLE public.solid_cache_entries OWNER TO dbadmin;

--
-- Name: solid_cache_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.solid_cache_entries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solid_cache_entries_id_seq OWNER TO dbadmin;

--
-- Name: solid_cache_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.solid_cache_entries_id_seq OWNED BY public.solid_cache_entries.id;


--
-- Name: solid_queue_blocked_executions; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.solid_queue_blocked_executions (
    id bigint NOT NULL,
    job_id bigint NOT NULL,
    queue_name character varying NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    concurrency_key character varying NOT NULL,
    expires_at timestamp(6) without time zone NOT NULL,
    created_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.solid_queue_blocked_executions OWNER TO dbadmin;

--
-- Name: solid_queue_blocked_executions_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.solid_queue_blocked_executions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solid_queue_blocked_executions_id_seq OWNER TO dbadmin;

--
-- Name: solid_queue_blocked_executions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.solid_queue_blocked_executions_id_seq OWNED BY public.solid_queue_blocked_executions.id;


--
-- Name: solid_queue_claimed_executions; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.solid_queue_claimed_executions (
    id bigint NOT NULL,
    job_id bigint NOT NULL,
    process_id bigint,
    created_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.solid_queue_claimed_executions OWNER TO dbadmin;

--
-- Name: solid_queue_claimed_executions_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.solid_queue_claimed_executions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solid_queue_claimed_executions_id_seq OWNER TO dbadmin;

--
-- Name: solid_queue_claimed_executions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.solid_queue_claimed_executions_id_seq OWNED BY public.solid_queue_claimed_executions.id;


--
-- Name: solid_queue_failed_executions; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.solid_queue_failed_executions (
    id bigint NOT NULL,
    job_id bigint NOT NULL,
    error text,
    created_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.solid_queue_failed_executions OWNER TO dbadmin;

--
-- Name: solid_queue_failed_executions_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.solid_queue_failed_executions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solid_queue_failed_executions_id_seq OWNER TO dbadmin;

--
-- Name: solid_queue_failed_executions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.solid_queue_failed_executions_id_seq OWNED BY public.solid_queue_failed_executions.id;


--
-- Name: solid_queue_jobs; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.solid_queue_jobs (
    id bigint NOT NULL,
    queue_name character varying NOT NULL,
    class_name character varying NOT NULL,
    arguments text,
    priority integer DEFAULT 0 NOT NULL,
    active_job_id character varying,
    scheduled_at timestamp(6) without time zone,
    finished_at timestamp(6) without time zone,
    concurrency_key character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.solid_queue_jobs OWNER TO dbadmin;

--
-- Name: solid_queue_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.solid_queue_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solid_queue_jobs_id_seq OWNER TO dbadmin;

--
-- Name: solid_queue_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.solid_queue_jobs_id_seq OWNED BY public.solid_queue_jobs.id;


--
-- Name: solid_queue_pauses; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.solid_queue_pauses (
    id bigint NOT NULL,
    queue_name character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.solid_queue_pauses OWNER TO dbadmin;

--
-- Name: solid_queue_pauses_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.solid_queue_pauses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solid_queue_pauses_id_seq OWNER TO dbadmin;

--
-- Name: solid_queue_pauses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.solid_queue_pauses_id_seq OWNED BY public.solid_queue_pauses.id;


--
-- Name: solid_queue_processes; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.solid_queue_processes (
    id bigint NOT NULL,
    kind character varying NOT NULL,
    last_heartbeat_at timestamp(6) without time zone NOT NULL,
    supervisor_id bigint,
    pid integer NOT NULL,
    hostname character varying,
    metadata text,
    created_at timestamp(6) without time zone NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.solid_queue_processes OWNER TO dbadmin;

--
-- Name: solid_queue_processes_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.solid_queue_processes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solid_queue_processes_id_seq OWNER TO dbadmin;

--
-- Name: solid_queue_processes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.solid_queue_processes_id_seq OWNED BY public.solid_queue_processes.id;


--
-- Name: solid_queue_ready_executions; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.solid_queue_ready_executions (
    id bigint NOT NULL,
    job_id bigint NOT NULL,
    queue_name character varying NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    created_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.solid_queue_ready_executions OWNER TO dbadmin;

--
-- Name: solid_queue_ready_executions_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.solid_queue_ready_executions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solid_queue_ready_executions_id_seq OWNER TO dbadmin;

--
-- Name: solid_queue_ready_executions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.solid_queue_ready_executions_id_seq OWNED BY public.solid_queue_ready_executions.id;


--
-- Name: solid_queue_recurring_executions; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.solid_queue_recurring_executions (
    id bigint NOT NULL,
    job_id bigint NOT NULL,
    task_key character varying NOT NULL,
    run_at timestamp(6) without time zone NOT NULL,
    created_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.solid_queue_recurring_executions OWNER TO dbadmin;

--
-- Name: solid_queue_recurring_executions_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.solid_queue_recurring_executions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solid_queue_recurring_executions_id_seq OWNER TO dbadmin;

--
-- Name: solid_queue_recurring_executions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.solid_queue_recurring_executions_id_seq OWNED BY public.solid_queue_recurring_executions.id;


--
-- Name: solid_queue_recurring_tasks; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.solid_queue_recurring_tasks (
    id bigint NOT NULL,
    key character varying NOT NULL,
    schedule character varying NOT NULL,
    command character varying(2048),
    class_name character varying,
    arguments text,
    queue_name character varying,
    priority integer DEFAULT 0,
    static boolean DEFAULT true NOT NULL,
    description text,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.solid_queue_recurring_tasks OWNER TO dbadmin;

--
-- Name: solid_queue_recurring_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.solid_queue_recurring_tasks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solid_queue_recurring_tasks_id_seq OWNER TO dbadmin;

--
-- Name: solid_queue_recurring_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.solid_queue_recurring_tasks_id_seq OWNED BY public.solid_queue_recurring_tasks.id;


--
-- Name: solid_queue_scheduled_executions; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.solid_queue_scheduled_executions (
    id bigint NOT NULL,
    job_id bigint NOT NULL,
    queue_name character varying NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    scheduled_at timestamp(6) without time zone NOT NULL,
    created_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.solid_queue_scheduled_executions OWNER TO dbadmin;

--
-- Name: solid_queue_scheduled_executions_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.solid_queue_scheduled_executions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solid_queue_scheduled_executions_id_seq OWNER TO dbadmin;

--
-- Name: solid_queue_scheduled_executions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.solid_queue_scheduled_executions_id_seq OWNED BY public.solid_queue_scheduled_executions.id;


--
-- Name: solid_queue_semaphores; Type: TABLE; Schema: public; Owner: dbadmin
--

CREATE TABLE public.solid_queue_semaphores (
    id bigint NOT NULL,
    key character varying NOT NULL,
    value integer DEFAULT 1 NOT NULL,
    expires_at timestamp(6) without time zone NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.solid_queue_semaphores OWNER TO dbadmin;

--
-- Name: solid_queue_semaphores_id_seq; Type: SEQUENCE; Schema: public; Owner: dbadmin
--

CREATE SEQUENCE public.solid_queue_semaphores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solid_queue_semaphores_id_seq OWNER TO dbadmin;

--
-- Name: solid_queue_semaphores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbadmin
--

ALTER SEQUENCE public.solid_queue_semaphores_id_seq OWNED BY public.solid_queue_semaphores.id;


--
-- Name: croms_diagnoses id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_diagnoses ALTER COLUMN id SET DEFAULT nextval('public.croms_diagnoses_id_seq'::regclass);


--
-- Name: croms_hyperthermia_therapies id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_hyperthermia_therapies ALTER COLUMN id SET DEFAULT nextval('public.croms_hyperthermia_therapies_id_seq'::regclass);


--
-- Name: croms_pathologies id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_pathologies ALTER COLUMN id SET DEFAULT nextval('public.croms_pathologies_id_seq'::regclass);


--
-- Name: croms_patients id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_patients ALTER COLUMN id SET DEFAULT nextval('public.croms_patients_id_seq'::regclass);


--
-- Name: croms_radiology_exams id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_radiology_exams ALTER COLUMN id SET DEFAULT nextval('public.croms_radiology_exams_id_seq'::regclass);


--
-- Name: croms_radiology_therapies id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_radiology_therapies ALTER COLUMN id SET DEFAULT nextval('public.croms_radiology_therapies_id_seq'::regclass);


--
-- Name: croms_sarcoma_boards id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_sarcoma_boards ALTER COLUMN id SET DEFAULT nextval('public.croms_sarcoma_boards_id_seq'::regclass);


--
-- Name: croms_surgeries id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_surgeries ALTER COLUMN id SET DEFAULT nextval('public.croms_surgeries_id_seq'::regclass);


--
-- Name: croms_systemic_therapies id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_systemic_therapies ALTER COLUMN id SET DEFAULT nextval('public.croms_systemic_therapies_id_seq'::regclass);


--
-- Name: solid_cable_messages id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_cable_messages ALTER COLUMN id SET DEFAULT nextval('public.solid_cable_messages_id_seq'::regclass);


--
-- Name: solid_cache_entries id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_cache_entries ALTER COLUMN id SET DEFAULT nextval('public.solid_cache_entries_id_seq'::regclass);


--
-- Name: solid_queue_blocked_executions id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_blocked_executions ALTER COLUMN id SET DEFAULT nextval('public.solid_queue_blocked_executions_id_seq'::regclass);


--
-- Name: solid_queue_claimed_executions id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_claimed_executions ALTER COLUMN id SET DEFAULT nextval('public.solid_queue_claimed_executions_id_seq'::regclass);


--
-- Name: solid_queue_failed_executions id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_failed_executions ALTER COLUMN id SET DEFAULT nextval('public.solid_queue_failed_executions_id_seq'::regclass);


--
-- Name: solid_queue_jobs id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_jobs ALTER COLUMN id SET DEFAULT nextval('public.solid_queue_jobs_id_seq'::regclass);


--
-- Name: solid_queue_pauses id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_pauses ALTER COLUMN id SET DEFAULT nextval('public.solid_queue_pauses_id_seq'::regclass);


--
-- Name: solid_queue_processes id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_processes ALTER COLUMN id SET DEFAULT nextval('public.solid_queue_processes_id_seq'::regclass);


--
-- Name: solid_queue_ready_executions id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_ready_executions ALTER COLUMN id SET DEFAULT nextval('public.solid_queue_ready_executions_id_seq'::regclass);


--
-- Name: solid_queue_recurring_executions id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_recurring_executions ALTER COLUMN id SET DEFAULT nextval('public.solid_queue_recurring_executions_id_seq'::regclass);


--
-- Name: solid_queue_recurring_tasks id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_recurring_tasks ALTER COLUMN id SET DEFAULT nextval('public.solid_queue_recurring_tasks_id_seq'::regclass);


--
-- Name: solid_queue_scheduled_executions id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_scheduled_executions ALTER COLUMN id SET DEFAULT nextval('public.solid_queue_scheduled_executions_id_seq'::regclass);


--
-- Name: solid_queue_semaphores id; Type: DEFAULT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_semaphores ALTER COLUMN id SET DEFAULT nextval('public.solid_queue_semaphores_id_seq'::regclass);


--
-- Data for Name: ar_internal_metadata; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.ar_internal_metadata (key, value, created_at, updated_at) FROM stdin;
environment	production	2025-05-01 08:33:38.992281	2025-05-05 09:56:14.03769
schema_sha1	94e0cc489b47b1a59e58959945306bc40ffa7f7d	2025-05-01 08:33:39.021257	2025-05-16 15:37:02.243992
\.


--
-- Data for Name: croms_diagnoses; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.croms_diagnoses (id, tumor_anatomic_region, tumor_anatomic_lesion_side, tumor_syndromes, tumor_diagnosis, additional_tumor_anatomic_region, additional_tumor_anatomic_lesion_side, additional_tumor_diagnosis, other_diagnosis, patient_history, diagnosis_ecog, last_contact_date, last_status, death_reason, patient_id, created_at, updated_at) FROM stdin;
3	b2_clavicle	right	{neurofibromatosis_type_1}	Ipsa quibusdam velit. Soluta provident modi. Hic sed debitis.	b2_clavicle	right	Repudiandae soluta unde est.	Doloribus consequatur sint itaque.	Est vel sit. Qui iste inventore. Facere culpa vero.	1	2024-10-22	no_evidence_of_disease	of_other_cancer	3	2025-05-16 15:37:35.316838	2025-05-16 15:37:35.316838
4	b2_clavicle	right	{neurofibromatosis_type_1}	Exercitationem distinctio voluptate. Suscipit in eos. Eligendi dolores incidunt.	b2_clavicle	right	Autem et aut delectus.	Ratione dolorum ducimus suscipit.	Nobis quod aut. Repellat et voluptatem. Vel eum laborum.	1	2024-08-11	no_evidence_of_disease	of_other_cancer	4	2025-05-16 15:37:35.329706	2025-05-16 15:37:35.329706
5	b2_clavicle	right	{neurofibromatosis_type_1}	Odio eaque rerum. Molestias tempora non. Maxime adipisci quibusdam.	b2_clavicle	right	Est odio quas incidunt.	Vero ab aut sed.	Omnis unde sed. Consequatur provident aut. Consectetur quaerat velit.	1	2024-07-14	no_evidence_of_disease	of_other_cancer	5	2025-05-16 15:37:35.342472	2025-05-16 15:37:35.342472
6	b2_clavicle	right	{neurofibromatosis_type_1}	Enim non mollitia. Ullam provident enim. Explicabo impedit sapiente.	b2_clavicle	right	Quibusdam repellat et perspiciatis.	Delectus excepturi tenetur placeat.	Numquam veritatis ipsa. Eum excepturi consequatur. Adipisci quia fuga.	1	2024-08-03	no_evidence_of_disease	of_other_cancer	6	2025-05-16 15:37:35.357578	2025-05-16 15:37:35.357578
7	b2_clavicle	right	{neurofibromatosis_type_1}	Qui et qui. Iure rerum inventore. Corporis est quia.	b2_clavicle	right	Et beatae fugiat eos.	Explicabo quasi sed at.	Aut enim doloribus. Porro ut magni. Error fugiat omnis.	1	2024-12-12	no_evidence_of_disease	of_other_cancer	7	2025-05-16 15:37:35.369682	2025-05-16 15:37:35.369682
8	b2_clavicle	right	{neurofibromatosis_type_1}	Corporis id tempora. Recusandae repellendus odio. Voluptatem nobis quam.	b2_clavicle	right	Omnis consequatur laborum qui.	Ut ut accusantium omnis.	Qui aspernatur voluptatem. Sint et sint. Temporibus eos id.	1	2025-03-09	no_evidence_of_disease	of_other_cancer	8	2025-05-16 15:37:35.382343	2025-05-16 15:37:35.382343
9	b2_clavicle	right	{neurofibromatosis_type_1}	Ipsa quam in. Id assumenda rerum. In natus quasi.	b2_clavicle	right	Fuga ut ut fugit.	Et et dolor debitis.	Dolor recusandae consectetur. In dolor aliquid. Quo vitae provident.	1	2024-07-31	no_evidence_of_disease	of_other_cancer	9	2025-05-16 15:37:35.394681	2025-05-16 15:37:35.394681
10	b2_clavicle	right	{neurofibromatosis_type_1}	Quia tempore temporibus. Eveniet voluptatem porro. Dolores similique et.	b2_clavicle	right	Est omnis harum consequatur.	Et qui atque eos.	Reiciendis praesentium alias. Ut sed ullam. Corrupti commodi nobis.	1	2024-06-29	no_evidence_of_disease	of_other_cancer	10	2025-05-16 15:37:35.410186	2025-05-16 15:37:35.410186
11	b2_clavicle	right	{neurofibromatosis_type_1}	Molestiae consequuntur ipsa. Praesentium hic soluta. Quisquam voluptatem quo.	b2_clavicle	right	Odit quaerat expedita voluptas.	Sed aut et ex.	Animi sed esse. Et fugiat perspiciatis. Eum nobis vel.	1	2024-09-06	no_evidence_of_disease	of_other_cancer	11	2025-05-16 15:37:35.422479	2025-05-16 15:37:35.422479
12	b2_clavicle	right	{neurofibromatosis_type_1}	Sit amet dolorem. Facere debitis sunt. Quo illum aut.	b2_clavicle	right	Modi omnis omnis provident.	Sunt at debitis asperiores.	Quibusdam magni commodi. Repudiandae id consectetur. Animi minus voluptatem.	1	2024-06-14	no_evidence_of_disease	of_other_cancer	12	2025-05-16 15:37:35.434935	2025-05-16 15:37:35.434935
13	b2_clavicle	right	{neurofibromatosis_type_1}	Illum ducimus non. Ut dicta quaerat. Consequatur sit placeat.	b2_clavicle	right	Magni provident quibusdam consequatur.	Ut aliquam qui et.	Veniam inventore aut. Et odio voluptatem. Aspernatur quia consequatur.	1	2024-06-27	no_evidence_of_disease	of_other_cancer	13	2025-05-16 15:37:35.447908	2025-05-16 15:37:35.447908
14	b2_clavicle	right	{neurofibromatosis_type_1}	Magni corporis vero. Quae rerum aliquam. Qui magni et.	b2_clavicle	right	Fugit incidunt beatae pariatur.	Corrupti qui id error.	Atque at sapiente. Quos nostrum est. Dolorum rerum officia.	1	2024-10-25	no_evidence_of_disease	of_other_cancer	14	2025-05-16 15:37:35.474155	2025-05-16 15:37:35.474155
15	b2_clavicle	right	{neurofibromatosis_type_1}	Aut nulla eligendi. Quidem non quo. Autem delectus et.	b2_clavicle	right	Facilis nesciunt aut ut.	Atque in voluptatem accusamus.	Id quidem provident. Quo ad accusantium. Aut consequatur voluptas.	1	2024-10-22	no_evidence_of_disease	of_other_cancer	15	2025-05-16 15:37:35.523921	2025-05-16 15:37:35.523921
16	b2_clavicle	right	{neurofibromatosis_type_1}	Similique quisquam porro. Temporibus enim rerum. Minus laudantium a.	b2_clavicle	right	Voluptas delectus aliquid sed.	Ratione omnis dolores aliquid.	Suscipit unde quas. Dolores sequi voluptatem. Incidunt eligendi ut.	1	2024-11-14	no_evidence_of_disease	of_other_cancer	16	2025-05-16 15:37:35.56221	2025-05-16 15:37:35.56221
17	b2_clavicle	right	{neurofibromatosis_type_1}	Neque eveniet qui. Sit quod ipsa. Nam odio enim.	b2_clavicle	right	Consequatur modi repellat incidunt.	Adipisci quod ut et.	Aut aut ipsa. Corporis non atque. Ut voluptas dolores.	1	2024-06-03	no_evidence_of_disease	of_other_cancer	17	2025-05-16 15:37:35.62031	2025-05-16 15:37:35.62031
18	b2_clavicle	right	{neurofibromatosis_type_1}	Enim vero id. Vel laudantium qui. Aliquid et provident.	b2_clavicle	right	Praesentium quaerat iusto dolor.	Harum quasi corrupti atque.	Excepturi quia autem. Quis est eaque. Consequatur ratione voluptatibus.	1	2024-11-30	no_evidence_of_disease	of_other_cancer	18	2025-05-16 15:37:35.641108	2025-05-16 15:37:35.641108
19	b2_clavicle	right	{neurofibromatosis_type_1}	Esse quod dolores. Nemo officia ullam. Rerum et quis.	b2_clavicle	right	Est voluptas et iusto.	Harum porro dolores autem.	Recusandae est eaque. Et ab reiciendis. Praesentium nesciunt dolores.	1	2024-11-20	no_evidence_of_disease	of_other_cancer	19	2025-05-16 15:37:35.655234	2025-05-16 15:37:35.655234
20	b2_clavicle	right	{neurofibromatosis_type_1}	Vero nobis non. Culpa dolore harum. Fugiat dolorum facere.	b2_clavicle	right	Et quia accusamus quis.	Et quasi facere atque.	Est tempore quae. Non non earum. Non facere dolores.	1	2025-01-08	no_evidence_of_disease	of_other_cancer	20	2025-05-16 15:37:35.671179	2025-05-16 15:37:35.671179
21	b2_clavicle	right	{neurofibromatosis_type_1}	Nesciunt aut assumenda. Ut commodi adipisci. Sed id hic.	b2_clavicle	right	Nihil dolorem facere praesentium.	Ut eligendi distinctio quae.	Aliquid et blanditiis. Animi cupiditate corrupti. Rerum doloremque recusandae.	1	2024-12-30	no_evidence_of_disease	of_other_cancer	21	2025-05-16 15:37:35.709897	2025-05-16 15:37:35.709897
1	s_ue_cl_lat	right	{neurofibromatosis_type_1}	Sed eius necessitatibus. Reprehenderit blanditiis debitis. Accusamus provident iure.	not_determined	right	Et accusantium vero rerum.	Et tempore quaerat rerum.	Aut est quis. Et sunt velit. Eaque voluptas sunt.	1	2025-03-09	no_evidence_of_disease	of_other_cancer	1	2025-05-16 15:37:35.031985	2025-06-06 07:14:23.226606
22	b2_clavicle	right	{neurofibromatosis_type_1}	Animi et ut. Aut quaerat suscipit. Consequatur eaque ea.	b2_clavicle	right	Rerum et repellat culpa.	Omnis sunt ut inventore.	Natus est ratione. Quis et autem. Sed aut minus.	1	2025-04-14	no_evidence_of_disease	of_other_cancer	22	2025-05-16 15:37:35.721779	2025-05-16 15:37:35.721779
23	b2_clavicle	right	{neurofibromatosis_type_1}	Ut saepe cumque. Occaecati ipsam reiciendis. Occaecati est placeat.	b2_clavicle	right	Repudiandae soluta cupiditate aut.	Nulla quisquam mollitia sunt.	Quae dignissimos earum. Rem voluptas aperiam. Illo aut velit.	1	2024-11-26	no_evidence_of_disease	of_other_cancer	23	2025-05-16 15:37:35.734311	2025-05-16 15:37:35.734311
24	b2_clavicle	right	{neurofibromatosis_type_1}	Aut repellendus et. Ut rerum necessitatibus. Consequatur officiis repellendus.	b2_clavicle	right	Aliquam eum rerum nobis.	Quas itaque autem quo.	Nihil aut voluptatum. Molestias sed aperiam. Qui sint id.	1	2025-03-06	no_evidence_of_disease	of_other_cancer	24	2025-05-16 15:37:35.747513	2025-05-16 15:37:35.747513
25	b2_clavicle	right	{neurofibromatosis_type_1}	Culpa temporibus accusantium. Recusandae voluptas optio. Ex et ipsa.	b2_clavicle	right	Fugit ad sunt officiis.	Nihil nulla velit explicabo.	Aut magni soluta. Dolores ab dolor. Est eum ut.	1	2025-03-03	no_evidence_of_disease	of_other_cancer	25	2025-05-16 15:37:35.762653	2025-05-16 15:37:35.762653
26	b2_clavicle	right	{neurofibromatosis_type_1}	Facilis eius qui. Enim libero aut. Quos magnam molestiae.	b2_clavicle	right	Ipsum alias ducimus ea.	Et laborum fugiat ipsum.	Dolorum vero consequatur. Doloremque est tempore. Aliquam quasi sed.	1	2025-02-23	no_evidence_of_disease	of_other_cancer	26	2025-05-16 15:37:35.775168	2025-05-16 15:37:35.775168
27	b2_clavicle	right	{neurofibromatosis_type_1}	Qui rerum est. Consequatur corrupti perspiciatis. Quia ducimus ut.	b2_clavicle	right	Qui non officiis sit.	Qui illum ea eum.	Est odio ea. Aperiam ratione nam. Quia labore dolore.	1	2024-07-29	no_evidence_of_disease	of_other_cancer	27	2025-05-16 15:37:35.786706	2025-05-16 15:37:35.786706
28	b2_clavicle	right	{neurofibromatosis_type_1}	Dolorem delectus qui. Quia doloremque sequi. Veritatis velit debitis.	b2_clavicle	right	Voluptate ut aut laborum.	Velit excepturi soluta molestiae.	Iusto ut sunt. Iusto architecto est. Molestiae atque expedita.	1	2024-09-24	no_evidence_of_disease	of_other_cancer	28	2025-05-16 15:37:35.797807	2025-05-16 15:37:35.797807
29	b2_clavicle	right	{neurofibromatosis_type_1}	Earum quia ducimus. Numquam quas eum. Eveniet voluptatem nam.	b2_clavicle	right	Aperiam dolorem ut eum.	Cumque asperiores quae sint.	Dolores cum ut. Nesciunt vel quas. Quam minima itaque.	1	2024-12-07	no_evidence_of_disease	of_other_cancer	29	2025-05-16 15:37:35.812299	2025-05-16 15:37:35.812299
30	b2_clavicle	right	{neurofibromatosis_type_1}	Ut consequatur cupiditate. Beatae velit dolorum. Maiores voluptatem consequuntur.	b2_clavicle	right	Eaque in qui voluptatem.	Autem error ea nihil.	Et suscipit magni. Rerum laudantium temporibus. Sed earum reprehenderit.	1	2024-05-22	no_evidence_of_disease	of_other_cancer	30	2025-05-16 15:37:35.823351	2025-05-16 15:37:35.823351
31	b2_clavicle	right	{neurofibromatosis_type_1}	Asperiores ducimus sapiente. Alias odit numquam. Nostrum necessitatibus temporibus.	b2_clavicle	right	Quis quia fugiat quasi.	Architecto quam nostrum ab.	Quam sequi possimus. Et placeat id. Qui porro est.	1	2025-04-26	no_evidence_of_disease	of_other_cancer	31	2025-05-16 15:37:35.835182	2025-05-16 15:37:35.835182
32	b2_clavicle	right	{neurofibromatosis_type_1}	Velit id rerum. Aut recusandae est. Sunt sunt a.	b2_clavicle	right	Cum qui molestias placeat.	Velit nesciunt necessitatibus tempore.	Est qui voluptas. Dolores nostrum tempore. Eos quam totam.	1	2024-12-24	no_evidence_of_disease	of_other_cancer	32	2025-05-16 15:37:35.846179	2025-05-16 15:37:35.846179
33	b2_clavicle	right	{neurofibromatosis_type_1}	Delectus sequi quae. Hic at et. Amet atque dicta.	b2_clavicle	right	Et ipsa provident nemo.	Alias est magni amet.	Ad error sint. Dignissimos cupiditate tenetur. Aspernatur molestiae molestiae.	1	2024-08-04	no_evidence_of_disease	of_other_cancer	33	2025-05-16 15:37:35.857826	2025-05-16 15:37:35.857826
34	b2_clavicle	right	{neurofibromatosis_type_1}	Inventore quas et. Hic unde in. Et sint rerum.	b2_clavicle	right	Repellendus nulla expedita in.	Incidunt aliquam illo est.	Ut consequatur id. Quia perferendis dignissimos. Numquam iure accusamus.	1	2025-03-22	no_evidence_of_disease	of_other_cancer	34	2025-05-16 15:37:35.869242	2025-05-16 15:37:35.869242
35	b2_clavicle	right	{neurofibromatosis_type_1}	Libero deleniti consequatur. Delectus molestiae explicabo. Et nam ipsum.	b2_clavicle	right	Est vero dolorum quod.	Quos quaerat impedit et.	Molestiae hic ut. Nostrum accusantium fugit. Saepe rerum maxime.	1	2024-09-15	no_evidence_of_disease	of_other_cancer	35	2025-05-16 15:37:35.880416	2025-05-16 15:37:35.880416
36	b2_clavicle	right	{neurofibromatosis_type_1}	Consequatur est voluptas. Sapiente excepturi sint. Odit possimus soluta.	b2_clavicle	right	Officiis nostrum dolor aliquid.	Ducimus enim veniam et.	Eos ut nulla. Ut et et. Et ducimus est.	1	2024-07-14	no_evidence_of_disease	of_other_cancer	36	2025-05-16 15:37:35.891135	2025-05-16 15:37:35.891135
37	b2_clavicle	right	{neurofibromatosis_type_1}	Et eaque reiciendis. Quos in iure. Quaerat est fuga.	b2_clavicle	right	Vitae vel aperiam neque.	Ut eveniet consequatur aut.	Sapiente eaque voluptas. Cumque assumenda fuga. Ipsa libero in.	1	2025-02-27	no_evidence_of_disease	of_other_cancer	37	2025-05-16 15:37:35.902022	2025-05-16 15:37:35.902022
38	b2_clavicle	right	{neurofibromatosis_type_1}	Et perferendis ullam. Quasi fuga consectetur. Ut ea qui.	b2_clavicle	right	Hic modi similique quia.	Sint nemo amet nihil.	Ab commodi delectus. Nobis voluptate et. Libero maxime hic.	1	2025-03-17	no_evidence_of_disease	of_other_cancer	38	2025-05-16 15:37:35.91358	2025-05-16 15:37:35.91358
39	b2_clavicle	right	{neurofibromatosis_type_1}	Deserunt eius quibusdam. Rerum ut necessitatibus. Repellendus esse doloribus.	b2_clavicle	right	Est aut et totam.	Totam atque eaque recusandae.	Veniam consequatur fugit. Repellendus quod molestiae. Provident placeat repellendus.	1	2025-05-07	no_evidence_of_disease	of_other_cancer	39	2025-05-16 15:37:35.924125	2025-05-16 15:37:35.924125
40	b2_clavicle	right	{neurofibromatosis_type_1}	Aperiam consequatur sint. Ullam laboriosam velit. A eos odio.	b2_clavicle	right	Expedita veritatis praesentium voluptate.	Et est maxime suscipit.	Consequatur modi et. Dolorem dolorum occaecati. Ullam mollitia facere.	1	2025-04-04	no_evidence_of_disease	of_other_cancer	40	2025-05-16 15:37:35.935204	2025-05-16 15:37:35.935204
2	not_determined	right	{previous_cancer,neurofibromatosis_type_1,neurofibromatosis_type_2,li_fraumeni_syndrome}	Necessitatibus expedita et. Quam accusantium labore. Ut adipisci molestias.	not_determined	right	Quos officia veritatis voluptates.	Voluptate maxime dolores aspernatur.	Sed voluptatem magnam. Minima incidunt quo. Blanditiis veritatis in.	1	2024-07-06	no_evidence_of_disease	of_other_cancer	2	2025-05-16 15:37:35.261287	2025-05-28 13:19:34.092811
\.


--
-- Data for Name: croms_hyperthermia_therapies; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.croms_hyperthermia_therapies (id, indication, start_date, end_date, hyperthermia_type, therapy_sessions_count, schedule, board_accepted_indication, comment, created_at, updated_at, therapy_type, therapy_id) FROM stdin;
1	\N	\N	\N	\N	\N		t		2025-06-05 16:18:56.238374	2025-06-05 16:18:56.238374	Croms::SystemicTherapy	1
\.


--
-- Data for Name: croms_pathologies; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.croms_pathologies (id, data_entry_type, biopsy_resection_date, registrate_date, first_report_date, final_report_date, prior_pathology, who_diagnosis, diagnostic_grading, judgment_of_surgical_margin, proliferation_index, mitoses_per_10hpf, extent_of_necrosis, closest_distance_to_margin_mm, biological_barrier_to_closest_margin, ihc_performed_status, fish_performed_status, rna_performed_status, dna_performed_status, ihc_result, fish_result, rna_result, dna_result, patient_id, created_at, updated_at) FROM stdin;
1	biopsy_of_the_primary_tumor	\N	2025-05-21	\N	\N	\N	not_yet_established	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	2025-05-27 07:30:12.510335	2025-05-27 07:30:12.510335
\.


--
-- Data for Name: croms_patients; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.croms_patients (id, external_code, consent, ahv, institution_name, last_name, first_name, birth_date, gender, street_name, street_number, zip_code, city, country, phone_number, email, insurance_name, insurance_class, insurance_number, general_practitioner_name, general_practitioner_email, created_at, updated_at) FROM stdin;
1	P1	t	{"p":"1q4gSIGJ2iyMZNH922vekA==","h":{"iv":"gL/I1Vsth7bKt5tI","at":"zYrtZMTlXlwzVsFzbsoMEQ=="}}	kantonsspital_winterthur	{"p":"da+nLg==","h":{"iv":"OflXs5riAb+vfbnx","at":"QbdQ+ArSpUAdQNBTQ/SnBg=="}}	{"p":"FRdm","h":{"iv":"jlpAxhJqNsybSm43","at":"Rm3qwpb9cSXdvUqxzPz8jQ=="}}	1948-11-07	{"p":"1unJlnFu","h":{"iv":"CjnWqAyD2N9PwrnD","at":"8F1ywITNLO3QeD50kX1psw=="}}	{"p":"19AXzLPYfahogg==","h":{"iv":"7Rs6AyvBA7ZD8rTv","at":"VuXFFdoiiq3iXoFG9E+D4w=="}}	{"p":"0DdyQjs=","h":{"iv":"iyn55FJU1w/C3IWr","at":"I+iSvPWqNh+3WYnvfQjWcg=="}}	{"p":"XpNaE3I4aZPh5Q==","h":{"iv":"sdfogac4idFjs7h6","at":"ug+8+iW7XbDI+eJeR0TgZw=="}}	{"p":"/oLZcec/GcTw","h":{"iv":"2bbNxc+ZfZ8LQkx2","at":"ATF0kaD4vUM7mCK4r0qJ1g=="}}	{"p":"K5f7YJWKQVSq9GJyvoU=","h":{"iv":"CstKx8kfzzF+YOvb","at":"RQ3EH3l7esPSQJvTJ1u33A=="}}	{"p":"TrdlBw9TrPj+v9Zb","h":{"iv":"6HftLqBMINT+u9hA","at":"bWeiOEX9P+kLrzzPCcokmQ=="}}	{"p":"TJJor9tSvm8x9PiUBymhmD7K8pTa","h":{"iv":"x3cCvOe2wfMtI96t","at":"s9igptF1mJXZnMKx4y4ekQ=="}}	unknown	private	810771148	Wade Upton	krystina@ullrich-stiedemann.example	2025-05-16 15:37:33.916289	2025-05-16 15:37:33.916289
2	P2	t	{"p":"g1eaAMYCy3xKBTt1oL3oQA==","h":{"iv":"MUKSnwNkiNO31v18","at":"ZteeYDnfNUfLM7sdKCApAQ=="}}	kantonsspital_winterthur	{"p":"Vhaq6qAHlA==","h":{"iv":"zuunAESmFAGCFiqL","at":"OoshRQMCJdGF4Y3qE8HOig=="}}	{"p":"hhT6jNc=","h":{"iv":"ONGHYFdiEljaY/GG","at":"FeIDcCcp6bhv2qlr41RjiA=="}}	1973-10-05	{"p":"VWGi3Q==","h":{"iv":"5VYuFGHU4kCyIf9R","at":"frm6/YqErhyT5AVu9amlvQ=="}}	{"p":"Z2SpEB0Yr9NQq7GpRF0=","h":{"iv":"ISx3fEjwkmBWhdar","at":"x/DXu/bOlPnMQsAan6Q/Ig=="}}	{"p":"LcI7","h":{"iv":"P1O2GJOTc8aq+SGW","at":"eetA4YMOdJmdAffZMNOhdg=="}}	{"p":"CXgtsOY=","h":{"iv":"kVDd7SSyERl3y79p","at":"5gyAHtVSq9dEVoIPubytHQ=="}}	{"p":"IciBKTR4xjEgDWqo","h":{"iv":"hlHtOQlwC33r9nJq","at":"HlWiR2249DI2NTZt/0bTsg=="}}	{"p":"h2SZ4lwnCkW3FSg1","h":{"iv":"+kIFTPSWCFFD11C/","at":"mUjxLmhW3JLCAOf5lAkahQ=="}}	{"p":"fdCaBnqtxx+e3clP","h":{"iv":"50Nia3FjRI4BRIP7","at":"mUP/85LZEvM6Ty14C4UkBw=="}}	{"p":"3gSdmgWVWmvCX7IGffxRbWoWvpTJfSbiNPUlzt/MznNbMlpcNnYVOHtm","h":{"iv":"mIf+3eUsfpERQ6P5","at":"QDLiys1mmDya75iKMQl5Qw=="}}	unknown	private	978563866	Mark Deckow CPA	lesia@hodkiewicz-prosacco.test	2025-05-16 15:37:34.017398	2025-05-16 15:37:34.017398
3	P3	t	{"p":"zD3LAvymbIEqSM1pkO9aRg==","h":{"iv":"Sz30CNv9p0O8Myo+","at":"lE+aUk+g2+nsdur6iiT3jg=="}}	kantonsspital_winterthur	{"p":"i6sEeVGmGA==","h":{"iv":"bQI96uNQoZkH2gLN","at":"uPKAPII3IfENTNcQr2lOPA=="}}	{"p":"jgYc","h":{"iv":"7lE5OVmKlHdYVe2L","at":"50u6yvAGOdIWImubwtA9Gw=="}}	1957-04-12	{"p":"pvVlCsKK","h":{"iv":"j3n+ONwb+Lxp5Ok1","at":"JIVZ7nBs0CDDbjW1XPkZdg=="}}	{"p":"23Y8RN5ECboN","h":{"iv":"pzhIuA7zP/n1fa8l","at":"FGDjf3tLMKcvB1FvuEx+MA=="}}	{"p":"E2nX","h":{"iv":"X9sUlV6HV/PyZKW1","at":"9U8OAR5LYu3B0VJCzxfYJQ=="}}	{"p":"7vU1pzk=","h":{"iv":"KJSr5Q3NcttVo/u4","at":"+ez+ENvR/fPZRACq7YuRKQ=="}}	{"p":"JIr5Gdwz+KfC","h":{"iv":"0y3UhnrADpIAOU2z","at":"yhFoGeGBJTD/CxkcVVbgnQ=="}}	{"p":"pt+NzRYoCA==","h":{"iv":"pe+qaSlanJklqvPb","at":"LjNuOGpkvRGtOA6jZeoSSA=="}}	{"p":"U43Ny2ggnkf+upft","h":{"iv":"sWDso7TxgfdD7eDE","at":"vkyMWFNa+O/M7Fw6Cqgv4g=="}}	{"p":"Jns90K4Fhs9+ybKSMCplGF1k0wNN","h":{"iv":"SUW2kFxJRX1g+J0v","at":"PI+P4kfi2gP6dAQJFf4lhw=="}}	unknown	private	710700396	Darnell Bins	walton_mitchell@emard.example	2025-05-16 15:37:34.060704	2025-05-16 15:37:34.060704
4	P4	t	{"p":"9pUOuTQPXEGbVD1/Zqm2tw==","h":{"iv":"wc+m0ECGuiYHQWBf","at":"iXNM6/4rckW7y9FgGxBiMQ=="}}	kantonsspital_winterthur	{"p":"GEj2A5o6+A==","h":{"iv":"4dxamVkl+C3TjyQj","at":"tbcUIV87AUTb4LftrN/ESA=="}}	{"p":"ch4T/TVVzQ==","h":{"iv":"HWvtOoTIuBbJul/O","at":"7DYMT3QDtfDmGJngQp6k1Q=="}}	1969-02-07	{"p":"taCcZA==","h":{"iv":"s9fPTKCEuAFhTyhv","at":"U64QNhU+0Z9WwU6xNfXupw=="}}	{"p":"4K4LAhJFMQZA","h":{"iv":"gjFpsdtoqZmKo4tp","at":"6821dvhNXNM4RYptZpUdWw=="}}	{"p":"gb7C","h":{"iv":"/VW+c33A1BhCKS/9","at":"aejVuTZRCwOpwV3qBG5Lww=="}}	{"p":"kWIdzQQ=","h":{"iv":"DnqbPpR3zNVuBcGX","at":"ov7cDXgkJ8xPFLt1zhnKTQ=="}}	{"p":"VsKKktoEn8fFISCh","h":{"iv":"9auodBk05Rcjd5T/","at":"VQe/IoMVa4KnN7cKf2GScg=="}}	{"p":"bentAQ/Uf/s=","h":{"iv":"XswwaSE4Mq7TGfIN","at":"HHgg6NaUCqBn876kXLTvcA=="}}	{"p":"I+FqwXY2jLcESV7Y","h":{"iv":"bvLdrw9rSC9bZ6o3","at":"/KveARyaObdxOEGRQpVJ3g=="}}	{"p":"ZuBuvVpIPJnbSg8Eo9iS3pL7fIF4zHaa3Q==","h":{"iv":"MKw7OV8WxtTMKo/B","at":"LXvxgKYYRg2VPhbWGwV9WA=="}}	unknown	private	885384148	Leif Shanahan	athena@kohler.test	2025-05-16 15:37:34.142167	2025-05-16 15:37:34.142167
5	P5	t	{"p":"bmem4sdyoq0CsnyTA09ctQ==","h":{"iv":"Ngs15gIwjubz0utC","at":"/LBGB6IpB/zqo3TLiM/WDA=="}}	kantonsspital_winterthur	{"p":"EkiGcNIN","h":{"iv":"lVKLjrP6MNavvACe","at":"UnvxhcsnH+FxrCrSlFeTGw=="}}	{"p":"uxg4gILS","h":{"iv":"wXr0Ck4SbDtvoq+4","at":"GZqdDm6KXiGiVseX7GLcWQ=="}}	1990-04-26	{"p":"IAzNMqAK","h":{"iv":"4Y1Gh16axZfDSmA+","at":"yQGEUg4vrRjbeLuS1ao6nw=="}}	{"p":"b/+Kkes3LP7DV5W7nA==","h":{"iv":"Cs3BN4P/fKCm27BR","at":"PBtx8cHLdWAuA9IgnN59sg=="}}	{"p":"Q18N3mc=","h":{"iv":"+96TVIlxD9q59a+W","at":"B1CN3ouB4zscTJlhIUDMrA=="}}	{"p":"FfrIxss=","h":{"iv":"Z/YqgRJN9InTpcAf","at":"/AXIpIRtHGGlv5Icm3xnyw=="}}	{"p":"kyQAKeusK5jFyg==","h":{"iv":"4JWXZf7S9sTf75qH","at":"Z3uuwuy3kX8ruVYmJUkhBw=="}}	{"p":"eUhUdkUmCg==","h":{"iv":"kQxE0ILJJd86wBuk","at":"UhaYy14FIznWVVWyiO8deQ=="}}	{"p":"uLdp9sTDx0NHRZnY","h":{"iv":"l5w+iog7pkD5wc7K","at":"SErEy297Czz6NNrME9tsrw=="}}	{"p":"dF9lShiBDZt8H6DNtaUTvw==","h":{"iv":"dsF0kYHQJ9BKM2vF","at":"YQCSzvPskNkq7bC7ZkXQew=="}}	unknown	private	589535680	Lyda Schiller	harriett.tillman@grady-legros.example	2025-05-16 15:37:34.155685	2025-05-16 15:37:34.155685
6	P6	t	{"p":"eSjfycY2wS1xfsSXudoYBQ==","h":{"iv":"zb21nQofkFcWcdSo","at":"rDkJTCfngUW4ynyOmP7b0Q=="}}	kantonsspital_winterthur	{"p":"UDvsGk9iqA==","h":{"iv":"AfOFbNf6z5KkTom0","at":"So1G0kWuZ3kXH+G+r9Qscg=="}}	{"p":"70QKIb+Y","h":{"iv":"mgEusB0szNRtDUNW","at":"xULbRhoPy1ZJ0QOwHJr2Dw=="}}	1989-09-21	{"p":"bp0xwn5v","h":{"iv":"d8ICmOVbxGzdWMh8","at":"OFWIfEIEp6w1dlvYyowpXQ=="}}	{"p":"SZG95NpJ2GWPKZGafg==","h":{"iv":"M8BPP8vGxzyRwMLe","at":"TGG7RSM1pWI5/kUARWIBgA=="}}	{"p":"JH7vJHc=","h":{"iv":"nWdi4kFQPQgqhPu6","at":"o54ImJizX61GQeFSZO/4AA=="}}	{"p":"TrF/fMRDG0InSw==","h":{"iv":"OxDgvZ0CR8XrLJ3s","at":"b+q2gkgv9VCnrhoG3s18Qg=="}}	{"p":"Ny+wt9iYd8wIZamsDXk=","h":{"iv":"Txr4l6DprFH/Xqzy","at":"I9GhUdXX4M0cCq9BdHSnZQ=="}}	{"p":"pjNoK8K4gTyU","h":{"iv":"MhR5VbvNJpkP/xfM","at":"Rjcu8lNYX6ts7dCyLA4G1g=="}}	{"p":"YWqTYoS4sKUim3A4","h":{"iv":"HrvFvmNegLiTLcd3","at":"wUe6tliAkRneeRdynyqaOw=="}}	{"p":"goANP9uRqZ10I8rexaB2vFMd","h":{"iv":"eAkf2ewdinXgHBj8","at":"j2Jxo5ae+gOlC6YUewss6w=="}}	unknown	private	168300173	Stephen Walter	sebastian.tillman@sauer.example	2025-05-16 15:37:34.207839	2025-05-16 15:37:34.207839
7	P7	t	{"p":"cSWxULZoo2h22oMqfo/PDg==","h":{"iv":"yYHbVP94u9z3GgY/","at":"g1oCuEwDzRjovG9NSC10Hw=="}}	kantonsspital_winterthur	{"p":"qJ3E/Es=","h":{"iv":"Zb/jU6R/xzlyd3cS","at":"mLunRzhMAxln4S7xutY9Tw=="}}	{"p":"jPrfqI8=","h":{"iv":"elxGMJi+zqkRpw/1","at":"n/LKjecRKIXOvelXxt0tPg=="}}	2006-10-09	{"p":"yCSvd4vN","h":{"iv":"4KsY5R9VD7q0U70U","at":"2vaRPGqV5hH+nauBfJ2Hmw=="}}	{"p":"DoPU0vzV+u7RqXJ5F5lJ","h":{"iv":"VPn6+MTCrobzs7jY","at":"FacK5vWmcvkN49p7SYcvpw=="}}	{"p":"aK8qRQ==","h":{"iv":"Tw415tAxCffjGHk+","at":"eAB4TJ5Si6vgMGY+ZRLjZg=="}}	{"p":"4xTNWiJ6i/BZ7A==","h":{"iv":"DvaITQ4s3fPQmp7i","at":"ByNw5JA8sRvUNM66B16yQg=="}}	{"p":"v2Jiror1nsdu","h":{"iv":"bscrYwKE+ENYJeiM","at":"xJBPCCDBnj10as0avFVqNQ=="}}	{"p":"cZQX3E+6","h":{"iv":"r+YHgtoNq1VebobC","at":"Mg7k/si/AbxiJVCR+/F0yA=="}}	{"p":"uOZVn7q4grG62sQ1","h":{"iv":"YJv8mjI2RX41FHtn","at":"y8nxqlfn+/r38w1BouEu+A=="}}	{"p":"9U8ptqEaVOX2yQcVpiEXEwcmK2KqQyk52KSQLNPzPus=","h":{"iv":"qLcWDna7qNJo+Z2J","at":"YJjcef+lbW5USFXrjVjCxw=="}}	unknown	private	653349198	Cassidy Kilback	rebbeca_hayes@sawayn-ernser.example	2025-05-16 15:37:34.221908	2025-05-16 15:37:34.221908
8	P8	t	{"p":"9yqaUFNBk9deCcTtHbjwYg==","h":{"iv":"hB5Vv5T16g/ADbGi","at":"a7x9NYuEpoa3KemHjwfD1g=="}}	kantonsspital_winterthur	{"p":"lPfOgUeovc7ZpME=","h":{"iv":"oDgnpllXR6jDDB/e","at":"T+a44fCnE5ByindNkRH7ow=="}}	{"p":"E3mKL2Tzvw==","h":{"iv":"jx7bmRvocGiXwKUj","at":"fvZi7q3lGVtdTOnClfULhQ=="}}	1974-03-10	{"p":"c1034C+V","h":{"iv":"C6kF1da++ViPkI3v","at":"esaV2TM8CUFxUn7FSfYUeQ=="}}	{"p":"BNtvMTcVWbQy1XvY","h":{"iv":"gOPzUoglReFSrR7T","at":"twRYu4DQ4J4gOlyfp3DTrw=="}}	{"p":"wEkXGg==","h":{"iv":"h+MIyJoi3UkNSKHn","at":"GtUxmoEuvFw3HizeHKhdvQ=="}}	{"p":"RrQK9VUutYqfVA==","h":{"iv":"zaOvT2yXma3LPCZV","at":"tukt7c24XI5EZOoOwBGR5A=="}}	{"p":"UiHCVjFLc/t4SMc=","h":{"iv":"141sMcF+mVIfPNQB","at":"qQP/FmLtYPrpNnU+Up2QFQ=="}}	{"p":"7MaPi/j7","h":{"iv":"0Dp2giLbmX0U4bSw","at":"IJL3Q9ntXJB9WE3EAFFTXw=="}}	{"p":"F9wlNyu/2kPkklJi","h":{"iv":"ERHMGz8CWuuZdru/","at":"2OpBj3O0NwuLOLm5NA8/kQ=="}}	{"p":"BO9DlGDEmSXB4YJcmWmGtyDUSb4GZ4ggn4PGlA6qj9By+w==","h":{"iv":"/HL0UIqr08N7JFw/","at":"K49HBAFD0RLfwJ7vorRGHw=="}}	unknown	private	898761887	Else Harris	douglass.beahan@powlowski-jenkins.example	2025-05-16 15:37:34.232488	2025-05-16 15:37:34.232488
9	P9	t	{"p":"OXp5799EKXRCXtgZW3SR5w==","h":{"iv":"a1d2185MiJMekb/L","at":"gOjsbZCaBebCc9/LmeNKIA=="}}	kantonsspital_winterthur	{"p":"7pvnOXhM","h":{"iv":"ayCIvVYpXGvu9Iyn","at":"dnupMUj32s+y+pqIMMvxbw=="}}	{"p":"B9hQzw==","h":{"iv":"jllo+Abvn0ZGacO2","at":"gXyC/1XfvptdN3Lh+d5izw=="}}	1996-07-17	{"p":"2/rHPQ==","h":{"iv":"C5R3mLZCe+q2FXfZ","at":"5GS1ORFJQ3mob8e7nwSn/g=="}}	{"p":"gX1Y8lZS0g+DrgmSAbzyJPw=","h":{"iv":"s2bchss6koDdRLKq","at":"ZtVB0fYNT1312XrkvCsRww=="}}	{"p":"+Ehr","h":{"iv":"n/w+5HLl9ylkoD62","at":"NXfC+VifQLLpfMQ820dC+Q=="}}	{"p":"W96Cm3GgY+ciNA==","h":{"iv":"I1XtOlK11cgo1azF","at":"FmvG/SzlokC0x6FajysjVg=="}}	{"p":"EdXf+HxT/fkzGQ==","h":{"iv":"Gnl1pVUTFmNlku8O","at":"gcMmmcdbRfldoAzm2Ip41w=="}}	{"p":"vnmSQgWz","h":{"iv":"fQ/2BcaJ9RtVqFyw","at":"IChXQ7JUuAJISIXAmvtZKA=="}}	{"p":"fdBqqrLXOAaFQYhR","h":{"iv":"L8FB8smtI3gvXTnY","at":"xEtBsuztHFtLyGvgqqcJ7A=="}}	{"p":"os3iTM46xYY7OUPV1FSfbH7VbRE=","h":{"iv":"9QvGyrIwsUz0D1jd","at":"JWIZvacYX7LV/bZNzFdlBQ=="}}	unknown	private	690673001	Norberto Bernhard	bradley_blick@towne.test	2025-05-16 15:37:34.251596	2025-05-16 15:37:34.251596
10	P10	t	{"p":"CZpZltnGCheU4e+P3CzjJg==","h":{"iv":"vKvQnCiTu+OzHMQB","at":"s434PakPH8f845gRqezjeg=="}}	kantonsspital_winterthur	{"p":"Lp2hEGW8Wg==","h":{"iv":"0fBL5qYQT98VMluL","at":"BwBBxPdFGZACej3n9NphtQ=="}}	{"p":"FDfm38Q=","h":{"iv":"MTE8t79fmeb0PmDf","at":"DttPUtwR3kV9n4Gk7euCIg=="}}	2006-09-19	{"p":"mlePCgcj","h":{"iv":"iThuVUZNZTwTBJSs","at":"x9auVl6W+scVEU6f0ORW0w=="}}	{"p":"h6NHyjCVKssArOI=","h":{"iv":"snQvFlYUj0ZiTIC2","at":"DOV1jthGZmvgCiWZPv5zFA=="}}	{"p":"9+tNLQ==","h":{"iv":"aAMd87hgsfaNWCyC","at":"9kjmlz5yWZGN48Rj/89tGA=="}}	{"p":"bcW4QR0=","h":{"iv":"1jZbvEHqLdPhce40","at":"4P7k8ZyvWD24Dloq4W08eA=="}}	{"p":"GUhhiZm1v5jhqEc=","h":{"iv":"TyFxHmd/UdoRg6kB","at":"aHg2NO52IqtpLPgNLt+rBQ=="}}	{"p":"rRo/7pYIIvuRB0o=","h":{"iv":"s50al020eMzXV55B","at":"ghxoZtwPLdK64+2vxaLPBQ=="}}	{"p":"l+CreIPbBocnEVs5","h":{"iv":"P5wQQDfvbmWBrN4I","at":"jUF5a/k/M1qb+eKo5xO0iQ=="}}	{"p":"Q02gfQneR+sYWDbdxrM5k06gz+Ng6TWB8z809jtw2iQ=","h":{"iv":"csxsaQZk8BDzXMtX","at":"h0IuGqdkr/3S8kv1JPJoQg=="}}	unknown	private	235657621	Len O'Kon	halley@schoen.example	2025-05-16 15:37:34.262991	2025-05-16 15:37:34.262991
11	P11	t	{"p":"sJ9gI5Uuxy4P5T/ENI2/dg==","h":{"iv":"qKbN1iDnoY2RmT7c","at":"ASAynNINmgDtLaKZ2o+FHw=="}}	kantonsspital_winterthur	{"p":"g/peJCC0Ey/jUA==","h":{"iv":"eNgxiFZQtvkRFsSR","at":"NmhXMb0RAjl+FNs7Svchdg=="}}	{"p":"sm6k9DEhg5U=","h":{"iv":"xqZeSngOOmS/S5nG","at":"yoyj7MpN9Zoi2gf/0OiJRg=="}}	1999-06-24	{"p":"ViHDLw==","h":{"iv":"yVX4ugawAUuyd0Xk","at":"vf3Xg+K23r6yaCtzrmx2ag=="}}	{"p":"FEu7XimUIyf4b6ABi/eUiQ==","h":{"iv":"u8nIHdumZdW2/ubU","at":"OEVlVyKdQNXXalIECCoD9Q=="}}	{"p":"YtXpyA==","h":{"iv":"+tQXShFjpE+vFo6N","at":"JhFPgnm3AdZ4Z4J3YZNfhQ=="}}	{"p":"L7RG7198RXJjoA==","h":{"iv":"pWkeVIBNe3RecIy9","at":"o77fh1WQw67HNb4vDt2HWQ=="}}	{"p":"h5qnDijMfrV8Kc4=","h":{"iv":"aaPl+V2VNCpgDL7d","at":"+w/ZzPzrY0kJ0wQ3mows1A=="}}	{"p":"slGGhDkN+DLHvvuGHiA+WK3qZrX2W0J1/HV7ocV6/kUd2Dkq/lzPhLZonCU=","h":{"iv":"ol4xOfE7ROsaJmg2","at":"1z0YGkqmVTDegBahDdZHeA=="}}	{"p":"YSOQa+L9CTO3GzcC","h":{"iv":"1eiBlIrFiIUMO7Nm","at":"yp7Rv5ll6UPyLndQAIPF6Q=="}}	{"p":"+95331jhy2DRgaBzMmHlqK/YS5nBiJW6","h":{"iv":"Oy7o73mRCtxKuBGv","at":"HaPl9q70yvYUZjO1BygJGg=="}}	unknown	private	549617629	Sen. Adrian Wisoky	branden@smitham.example	2025-05-16 15:37:34.27503	2025-05-16 15:37:34.27503
12	P12	t	{"p":"84+EWsI3m7WPw0ch9/GfYg==","h":{"iv":"rwrwBqTVauS/N7tg","at":"Hg+hTPNApd9Vq81IU5taag=="}}	kantonsspital_winterthur	{"p":"z6nLvjcHptvk","h":{"iv":"ONwO46DLK9iolef8","at":"L2otSqee2XJRgNO7Frfk3w=="}}	{"p":"B9i8UOf7sw==","h":{"iv":"GGuPMcdBGMToF/su","at":"POwS1Pbbr1i1+Uc9qqaoSw=="}}	1978-08-01	{"p":"SmsJ9TxB","h":{"iv":"enUW4cEYRuLK6pKP","at":"rqnpKXyK99zjw2VsyxMMSQ=="}}	{"p":"H1jWeTxWAnicYlGVOpQ=","h":{"iv":"YEAIOFCZvJhOs0qz","at":"+awDaQGeLDsZS2D0oW3xqw=="}}	{"p":"htac2g==","h":{"iv":"y03sKvXDWghpEBUD","at":"aks6jAGa2g0jr4ay9eyDwg=="}}	{"p":"N011OGA=","h":{"iv":"YHVrWKOPOKKR5r8y","at":"1HxVepMldbhioVH7KDTwkg=="}}	{"p":"dymP3G0v/Z3Z57YUTNU2LghwWC4=","h":{"iv":"C05ZtxNw3G1iCmuB","at":"lq+cD0z0LglmWU8DC3wc6A=="}}	{"p":"orivEPU=","h":{"iv":"hlsRKrwF41frOKs/","at":"Uj7iUNHrVyGJSUQoP7Rnmw=="}}	{"p":"HhjHbdkXqvnKnuJS","h":{"iv":"FgZnNQMWgB1D7cEd","at":"Jg26ycyUK5RESO37D1j1zQ=="}}	{"p":"qu1uCiDEVEFF+QAaGgdLYIHQ2g==","h":{"iv":"rvstl55mHBoc8Nu8","at":"pZaPMe+IW8JFiBwAFIKb4g=="}}	unknown	private	329619631	Jamal Buckridge	benedict.stamm@okeefe-schroeder.example	2025-05-16 15:37:34.3074	2025-05-16 15:37:34.3074
13	P13	t	{"p":"eSSabW7/OrQQU8jf75hrLg==","h":{"iv":"7uvYmVtMII+LpwUw","at":"VkHm5pbVAtoUPRjlFzvCOw=="}}	kantonsspital_winterthur	{"p":"IFXGEg==","h":{"iv":"xHS/6tRMu8FTin2/","at":"JXrHmcncyhl6THP6cZy1hA=="}}	{"p":"tB++leNhFg==","h":{"iv":"DeyoddzvewAZtH3K","at":"cEBLxQ2nqvjq0R44zMgGXQ=="}}	1967-06-01	{"p":"zlm3Ng==","h":{"iv":"taEg4/L8OY/MhAJo","at":"j0IiwqUryJW713plY6hw9g=="}}	{"p":"Hbr7nRxUxhHCrhw=","h":{"iv":"29r8Sd3BA5JMoBDl","at":"2eju4BiIohvvJocRaIj7Eg=="}}	{"p":"+AKVCQ==","h":{"iv":"MlEDd6+DbnSOMDv7","at":"rcHAU4r5WMtpe26MHJMNWA=="}}	{"p":"++HTlOKB802bfg==","h":{"iv":"q9/AWtfdXx0Syk6u","at":"wwEERg2WmU2dB15XdHTRFg=="}}	{"p":"dtsmHbcG2VMpVYiW7gAGvEw=","h":{"iv":"MFlAwiMEUqZOyhhq","at":"kaytggxvlrB0o95bZeD8Pw=="}}	{"p":"yT1e7zyG0WqOpRLW21HdjxxPo4NvQOE=","h":{"iv":"GVTmPc6EGSkpwbsD","at":"ekw2Txj65gj6O5JQYjWmjA=="}}	{"p":"sES0geY0iw8ZR5en","h":{"iv":"8akrGPjdFZ62sjIZ","at":"iDrK6K4mZItkjgfqeXH77A=="}}	{"p":"Mr4DE+0WCby+1TRzq23cwBa+DLVHdli9v2Jj","h":{"iv":"DGoDFJojTCmXRxAz","at":"qIw2Mmlp+//dK4a8Q6lKKw=="}}	unknown	private	370550613	Hayden Schoen	shalon@shanahan-renner.test	2025-05-16 15:37:34.322171	2025-05-16 15:37:34.322171
14	P14	t	{"p":"2USYUlHHmHyjfmLanASQiw==","h":{"iv":"hDQa6hkJWLRX2dqW","at":"jq+9DzV56ZjxkqkCDtS4dg=="}}	kantonsspital_winterthur	{"p":"dl8CDvivU0wnQDL+","h":{"iv":"xEqhW+e5Axz4hFjK","at":"+fcsK0ObglxiI5ZCMdLftg=="}}	{"p":"8nq6Wih9","h":{"iv":"C9fhWsjtRHwQHkI3","at":"DkXc31ign+wLR6MRbg4+Dg=="}}	1995-11-30	{"p":"vh7DSA==","h":{"iv":"PN7E4PG2kUsuz9Vo","at":"fg3IkoR4dWjkJ4v3QXxQ7g=="}}	{"p":"pRa49EQK17oV7CPfng==","h":{"iv":"byZEBpObB08gmZK4","at":"0NCYBf0sN/zMQMirPPxKKg=="}}	{"p":"OqC6n7M=","h":{"iv":"oH/SwlJ4F7UZXu5p","at":"sgX2Hjmir4+vAIRwpKm5eQ=="}}	{"p":"Zh2Dbg8=","h":{"iv":"N37elznVg7HIK5Id","at":"ocXuJWots6vwbHr6U8J3fA=="}}	{"p":"JW0+teErLTIoxRiY","h":{"iv":"Kggcb/nJRetwipxN","at":"DTs7U1KsNizAWr425zN1ZQ=="}}	{"p":"+1sYn0ZylnE=","h":{"iv":"+m2/eMJhz0Pwyghv","at":"FQE3DJWbgHbXEj8vkB8pHg=="}}	{"p":"eZIsPSmpDRSVP3gZ","h":{"iv":"2tcMz2tjU6wWoL8F","at":"6a5Vh634qsnOUHUby+rnuQ=="}}	{"p":"ctO7dKYPCnyDtsWVGtO9lbiYjuBSw1l8IrafpQ==","h":{"iv":"boCiupwhSPwqupj9","at":"fMVLefZqlHWFP8fKLYyXuQ=="}}	unknown	private	381628421	Adrian Sipes	marinda_schaden@strosin-reichert.example	2025-05-16 15:37:34.331734	2025-05-16 15:37:34.331734
15	P15	t	{"p":"lz9ixC+lSgCbGbedEOTA9Q==","h":{"iv":"uBLYq98H4O3hRnV8","at":"PQTJqljquaP748JmYwnb3w=="}}	kantonsspital_winterthur	{"p":"E9lIXzKy","h":{"iv":"Jfm3oQ1ycPHnq2ue","at":"Dnq9fVx2/bISAI98o97fEw=="}}	{"p":"0QQfS0o=","h":{"iv":"ALnQnGSla6C9bTdQ","at":"R6zYg7OBBvaMb4f1UeWSgQ=="}}	1981-05-15	{"p":"PZZysw==","h":{"iv":"/GhjEl6hMe8L5XME","at":"WAAw1WZ7bc2EttvMyBd5Hg=="}}	{"p":"S2mgPOwmp+cBgT4=","h":{"iv":"vL1Ld9qGO+rGs4w5","at":"7ZQGd3qNbs1jq4xXXjA4xg=="}}	{"p":"XYLK","h":{"iv":"zTi7o+ep2hEroQvS","at":"EJyvPDrFq3ZLc0+oITiybw=="}}	{"p":"myiC6Rw=","h":{"iv":"DZcdJtRfSj5C6LS5","at":"mRI9oMZdenV7glTPuYq1sw=="}}	{"p":"jP1yVBZNPE9aIUQ=","h":{"iv":"Mnkc9QADEXiXmSRW","at":"Tp+HcWAGbmy16S1BurZFeg=="}}	{"p":"BDu55UQ=","h":{"iv":"fvR++kNCHVruMe4v","at":"7rpbXjl/pvORHX98xf0AYA=="}}	{"p":"9R4AEeinBGsc1dL6","h":{"iv":"MdBGZmxb9PB2p5vV","at":"3cuTmTJYOaEC9gGa44T34A=="}}	{"p":"6Ln0gDTgQDLgsrqcBxFckAt/0ISD5Dyqb2F3/Q==","h":{"iv":"SpcGeQvppbaLZ8KZ","at":"wDAN1GCgXhQ03fKrr4gXBg=="}}	unknown	private	886214691	Lorna Harris	suanne@dickens.test	2025-05-16 15:37:34.357915	2025-05-16 15:37:34.357915
16	P16	t	{"p":"Mg4IkiN7ko8iRQXZEw/pPw==","h":{"iv":"kGp07Dp6icqn5pEm","at":"zbc4CQKT4r1KboydKhUxOA=="}}	kantonsspital_winterthur	{"p":"HAbCF+I=","h":{"iv":"g2eeINC16Cod9KDh","at":"xXoEoWLkIzl9+/OAQu3wMw=="}}	{"p":"kis7S96PsA==","h":{"iv":"lJZoiGxssJAcQELN","at":"/x1V0wgkVqwQpO3QZ6NHqQ=="}}	1936-11-29	{"p":"xWjodg==","h":{"iv":"x023Kt35GqTeTI/g","at":"5GPEiMokLGzhdzRF4ojGlA=="}}	{"p":"dAwnmUIZ5j5584A//AgU+Q==","h":{"iv":"kYQEd1ao3MJcHqDV","at":"lw84LgfmZJt4GE8FLrz4sQ=="}}	{"p":"CUup","h":{"iv":"hs5NQvQwGbLggYe1","at":"qQQu48UVrL0J20OFZWRJCw=="}}	{"p":"Ayx2iWlWNyghPQ==","h":{"iv":"mJPkXb5Q4KODaTXQ","at":"xzgApEFsOJTUrkJ/nCZa+Q=="}}	{"p":"ikmxB7tPOOKOWeu5","h":{"iv":"sPesiKD4Mbvg2tKh","at":"ItBFozJbgKhv9NiGzE5Ofw=="}}	{"p":"QAkIMbbc09jAo8045f5G0WfXBvML0uU5/CiQ","h":{"iv":"DhqnnAlxgiXaWYFQ","at":"+3acXQJ6351NfDmrnRY2AQ=="}}	{"p":"FGyIv2DMAjkII4tt","h":{"iv":"cmI0HteGTdZFtCjf","at":"z/RMjlnWoMIUczGzUpwaAQ=="}}	{"p":"Olhx1sn/at7NzuiTaz8dW+/olPS7","h":{"iv":"obnPfLfL19qGBfPg","at":"/kELNXjcptAujgsfsLyXaQ=="}}	unknown	private	616429614	Darrin Bernier	jonell@stark.test	2025-05-16 15:37:34.410737	2025-05-16 15:37:34.410737
17	P17	t	{"p":"UatDV1fxqG7lUQHLHU+T9g==","h":{"iv":"4bqD4oMQpZVo1YIp","at":"+Fcy3uMR4lM36A/gbHYFyQ=="}}	kantonsspital_winterthur	{"p":"vjnI7y4p/hn1","h":{"iv":"J4Ssul9elzzYztf2","at":"FHhN4Dz5EquvFBz2UGGn3Q=="}}	{"p":"557ltho=","h":{"iv":"3QRbiAGY7z2jSdtt","at":"pT+gkqXyBxQ6BBwUETDdMA=="}}	1979-09-26	{"p":"6K2PKw==","h":{"iv":"9Qc67OQCm9JfQFF6","at":"5gLws++9FrfE51GmCUgqtg=="}}	{"p":"yOefa3G82qaVgA==","h":{"iv":"vbqlOjX96A7riym2","at":"FANjgawywo3m78CCzBVp+A=="}}	{"p":"8yESqXQ=","h":{"iv":"DjyJ9e1oQ1cCwX27","at":"l3H8ygC4fDLqqREu+PV5OQ=="}}	{"p":"KVL5CiPn4tj+qw==","h":{"iv":"bZv2wAZhxgUTJBxe","at":"6DzWFLp9ofnIHHR5F3aXIg=="}}	{"p":"9Pd78l43qz+1wrhL1ezty7I=","h":{"iv":"F0B+EtpuAqXOTqV5","at":"xvslTD9l4ti3DBGAgpm/8w=="}}	{"p":"HAZIhSFoBJA6QICJ","h":{"iv":"TKTCizanxFUFY0fu","at":"OVTw7gL0QU3B6YeZN8+xxw=="}}	{"p":"ueerq5KV+j7p5CiO","h":{"iv":"9UcEfCOqMPFZd6bv","at":"wLoS6OahUPsmlZRywLsBUQ=="}}	{"p":"hXQTBN7HYs1ie0L1tXJhpRUEPegVdIo=","h":{"iv":"le3ZhYXxuFWBY3Xb","at":"X1Qxk5BLZyRRdAyK2T6c4Q=="}}	unknown	private	824079609	Reuben Mitchell	lavern.johns@ohara.example	2025-05-16 15:37:34.420104	2025-05-16 15:37:34.420104
18	P18	t	{"p":"miMZPl/XkRJKtHd4iZ/B5w==","h":{"iv":"g0/vPXitlGux1Q0z","at":"wNCNgrvIaG/bCATolrf40Q=="}}	kantonsspital_winterthur	{"p":"ZEMt+Sk=","h":{"iv":"NXNMnbB8i2EHQR8+","at":"A1Yb4GhHa5WVxtWI6Zg92g=="}}	{"p":"QqVQjDWe","h":{"iv":"gZIiR3Y5IhZSQef+","at":"9+S9Wqu46NcHT/WavWfbJA=="}}	1948-02-01	{"p":"uAQTAQ==","h":{"iv":"72HdiyIECAAIda5E","at":"Yyxpgouyn311UV/vfL+1QQ=="}}	{"p":"tNCTpMo7Fl2Gccu6xg==","h":{"iv":"xL+6eByPoDJACOP5","at":"QHGpENY/VoBlH464PRXNQQ=="}}	{"p":"6QfX0Gk=","h":{"iv":"QTxwu4ezua84/eOA","at":"e+3nA0dKhJTxoz7VbOIVuQ=="}}	{"p":"AJD80IQFLiuxxg==","h":{"iv":"NO271uXfmYMwXHUN","at":"hrvwR+3yDSIiWvpme0awFg=="}}	{"p":"4DbcKWS9HBPTEb0=","h":{"iv":"0yJXm2lyZFiYAOTY","at":"zNS+wAbTUz8l1W8/98SKjA=="}}	{"p":"iov5KM/peAmqOg==","h":{"iv":"ZgkDOGXK+ieHwIrv","at":"iW7FLu2Ir628uNk2+6eQvA=="}}	{"p":"N+xDFa9lFnnn0N3q","h":{"iv":"yD8eNkc0UVgCKWe3","at":"IuInJe7AiBiDAL6FM2fAyw=="}}	{"p":"nZSXcHZadf1bkG91Bs8SHPUVtrE8aU0RtYPHeL8=","h":{"iv":"d+K5ERXappr+6wU5","at":"jKunQgp5FVkOaizX6FGYCQ=="}}	unknown	private	118315291	Thanh Bradtke	kristen@upton.test	2025-05-16 15:37:34.428368	2025-05-16 15:37:34.428368
19	P19	t	{"p":"soC1uDBCZ7oB0ci8J5Idpg==","h":{"iv":"DasK7zToGF0qBzWt","at":"vEeUDwT8NVvRRsicvW91HQ=="}}	kantonsspital_winterthur	{"p":"y4uuPrs=","h":{"iv":"39ay4y1KcEP8eCha","at":"w+iAavGLzij/AUGfzK5wMQ=="}}	{"p":"wM/dxMo=","h":{"iv":"xFVzmVLeY/3M1lXJ","at":"JK/EvsWokNT5uWN+aaXRLQ=="}}	2001-04-18	{"p":"mJlhqX29","h":{"iv":"H2PeBWwjdpeTc5PO","at":"SKlEDs8YOBftp4iFAd0e8A=="}}	{"p":"O/xy4qNQkePDHhtNzfEW","h":{"iv":"o56MfxJiS9acLU2B","at":"VmF4TVrIE9Cq5VXJIWWLIw=="}}	{"p":"FiHhKg==","h":{"iv":"3hIxw6E1VDq/IdT/","at":"CCIWTVBhiGLMo8yOh+GAKw=="}}	{"p":"4w3Ichfymv0IpQ==","h":{"iv":"0VG1cfACKfef1r59","at":"t36b4sE4121jvKHbjsa+HQ=="}}	{"p":"KZ/6k284vjW8","h":{"iv":"y7K7s7qmAliRVBFL","at":"5rpV3lUhe4BIf8hzNWkatA=="}}	{"p":"qaxnkFW12vqL6d4oBlc=","h":{"iv":"pRtc2v9YZyXFia05","at":"YYgW6UTUkk4Qh4D6fbk/DA=="}}	{"p":"bFLEKYZsFOOKdaWX","h":{"iv":"pGHjNuwpPe5UyAr6","at":"HvG4kFaIk3ebQgf02BTu/w=="}}	{"p":"0njaLEnbhbMRjB4EvTft7cw=","h":{"iv":"V8iw41tyhIZ6e6pi","at":"zQHBCraIblbvG59lpmds+A=="}}	unknown	private	443387396	Barry Tromp MD	latrisha@goodwin.test	2025-05-16 15:37:34.435606	2025-05-16 15:37:34.435606
20	P20	t	{"p":"lXuEt+R/9qw+BXkxud0JkQ==","h":{"iv":"qTisfyY0cV8rJGTV","at":"VBhPZLRLr3hS9uYS+CUTjw=="}}	kantonsspital_winterthur	{"p":"AsgysQ==","h":{"iv":"LjrsDlzOpgE1QaZn","at":"/UaN2woW15oIwcGZjs2+lg=="}}	{"p":"A9/gLLO8iA==","h":{"iv":"Yby2vi7UJvra0HDG","at":"uXEEZhhjk9JlpvYxVtwfHA=="}}	1998-04-24	{"p":"ugrHrQ==","h":{"iv":"v96OmJSLaXnxyjfB","at":"kxlQokytYsvOSYsace7q5A=="}}	{"p":"GQcHYK0bWCOMuV8L/dg+fA==","h":{"iv":"pzub5BmxLfNOnai/","at":"uQYfQTVHeukGwMydwzUTmw=="}}	{"p":"zhJT/w==","h":{"iv":"ozAjaDA9U2O7GFXl","at":"4nr28DjSSqQ6hPXooJty1w=="}}	{"p":"m6xyWn4w6TfDew==","h":{"iv":"QaYyL2r97ExrKNkg","at":"7KjXt6GXb5uSJkAE/02/Qw=="}}	{"p":"MrVcjFDR6uqe","h":{"iv":"dJa2dWodHpXCx7wW","at":"QMw5ocrb+0x6/5adbtqBUg=="}}	{"p":"dUvTDUlGar1/BVEjaQSu9nmKmCtjhOWk9mhj","h":{"iv":"bCi89971oB7StcJy","at":"phfQVLTqlAFjF/KRwMHSqQ=="}}	{"p":"N4GIutySLslOXvZi","h":{"iv":"ZFHYwR8jHlcOuM62","at":"0+VoHXmYhm++UdmlFjFtkw=="}}	{"p":"BL9oPCYFnwSYHiO1nH6HAHI5GSE=","h":{"iv":"tCRDzSrQxb3XOOyS","at":"l9mD+ySORamQDl6kThfZkg=="}}	unknown	private	614240925	Kit Jerde	quentin_kuhlman@heller.example	2025-05-16 15:37:34.443148	2025-05-16 15:37:34.443148
21	P21	t	{"p":"Kz4Dzf3YawwwNdtElWcijQ==","h":{"iv":"OPnoHAcBbLHmmfPa","at":"EJDDEVUIsEUSjgXUdqx1+w=="}}	kantonsspital_winterthur	{"p":"j0SDlHk=","h":{"iv":"QguASE6n9mws+yQP","at":"JQRYU0Ap52BE2f7+0AsUFg=="}}	{"p":"gJmF85Q=","h":{"iv":"Gy0ZqM1jCZGivmPc","at":"Z7zFpt01RwEV0BrAUFSUTw=="}}	1940-09-01	{"p":"l0RxxxHd","h":{"iv":"tOVT311mTxDoNsc6","at":"i5fz9U1u9wTbv3cMjDD2IQ=="}}	{"p":"WpBMJiYn+hH5x/P6YHrXIYA=","h":{"iv":"vLl7PPUA0/dRgrkr","at":"2kOBPAtOw9Yp8LjNF6VBCA=="}}	{"p":"/6LriA==","h":{"iv":"7c5fnK0Pkt0b4yIk","at":"r3GEhBwOWr9n1L+pwC1Lcw=="}}	{"p":"gpm5qWFz6t0t1A==","h":{"iv":"jbAmYmo6BiKgeI7W","at":"4OFViCZ3greLxaKKa6n7vA=="}}	{"p":"pPxBHQqRHqnut8zPtw4=","h":{"iv":"RhzYOag1VyUwgJ1M","at":"nAaAr+rk3aTOZRDW+4TeEQ=="}}	{"p":"2q6avg==","h":{"iv":"hjB8J7B8jtt6f1Fj","at":"qllHsHmbOha/1iQJSnS/IA=="}}	{"p":"6u/HW4RzJsxZPc3p","h":{"iv":"w4w7vZbh91EF3nJV","at":"R909/pb/2WicL/bFxwJcaw=="}}	{"p":"fDLz02DyQ1DAtVeKUWH6ZEwEnU7i0wU=","h":{"iv":"3tnOeVWdu2vaa3PE","at":"s5QQXOjHKICb8syhceplog=="}}	unknown	private	895551553	Porsha Sawayn	marshall@mclaughlin.example	2025-05-16 15:37:34.450661	2025-05-16 15:37:34.450661
22	P22	t	{"p":"HWGPNZkN9QH4SC64nkBXtQ==","h":{"iv":"z7+l7GDTBC9CEH5v","at":"cZ7+3oNmsyW53bVjDpoyBQ=="}}	kantonsspital_winterthur	{"p":"OB28EnCWT9I=","h":{"iv":"iWHEBChj0Ukm/KhJ","at":"MDH40MIufov5EocOXqRCvw=="}}	{"p":"mVbn","h":{"iv":"xN5NEa3JcflWTvdV","at":"xUs3bTSCyGaLaaRI6TDH5g=="}}	2006-04-18	{"p":"6/LYqw==","h":{"iv":"UUp6pL3rDuq1mTtP","at":"3IZWHqG3KKriHu+alZlTwQ=="}}	{"p":"k1BDdS6i9ZOb","h":{"iv":"hHjSDaXahjPKKfl7","at":"yDwPRGij3qdNnwg9HcL8fg=="}}	{"p":"xLhy","h":{"iv":"6YHfsm7Y1BvXh7gl","at":"i4bScn1WytdVqgntYAbqEA=="}}	{"p":"dcNklFZ/SJpaPA==","h":{"iv":"q7mirTyWRoi+doj2","at":"/QQvx0O4SiCASYslnEfH6w=="}}	{"p":"BDfUw89y7gg=","h":{"iv":"NY+rAWIAtfEKNQnI","at":"Qv6w+7dqSn1cZibB2iZdlQ=="}}	{"p":"Jt7+KVufE5HWdnhcjQ==","h":{"iv":"/bIrYvgEFwF4kfzi","at":"htMVavFInoRkY5ObELdOHA=="}}	{"p":"diYmidxE6dC0E4lT","h":{"iv":"GJRxwHRf39SJ2z2e","at":"9ExqFdSMaTVRYDpx+uRKqA=="}}	{"p":"qV/PIpGYXIMzwCiyrO6bWcdFLZED0OZDj7dx","h":{"iv":"fiwZce/A7aL4qLKa","at":"5ZhwWO+UYyjKBAYPNBzRjA=="}}	unknown	private	812517147	Thurman Goyette	britteny@bartoletti-macejkovic.test	2025-05-16 15:37:34.458236	2025-05-16 15:37:34.458236
23	P23	t	{"p":"MCbZZxOV7SkIAaxQAY59ZQ==","h":{"iv":"Mc961/936Do7bJRy","at":"j4Kd+sgY7k1JNnlEL+KCLw=="}}	kantonsspital_winterthur	{"p":"JNi2jziWNaI=","h":{"iv":"dUOrwFV2Vu1XlIWP","at":"A0s5yTG23Xo4ti6egIjcgw=="}}	{"p":"o7x4Inw=","h":{"iv":"kL9lBWNPFexao/rY","at":"qmP8OpAbA81lQTFkKXl2qQ=="}}	1958-04-12	{"p":"+j9TdA==","h":{"iv":"YFfdErtsOUlJH/k7","at":"Vmo5ftpAw8GN7LSw0vF5Ig=="}}	{"p":"cmZOt6arKGa8HrVYW0Y=","h":{"iv":"RHG31xw0lyxiv+4l","at":"caIXwTywpriFXJeVS3aPAg=="}}	{"p":"fwW6wA==","h":{"iv":"/ny/IJ2qcWuajqCb","at":"7lYSzdMHNUnQeE+Vq9Fu4w=="}}	{"p":"qWemoda0c69jsw==","h":{"iv":"dSJMw8YGlE06tFXU","at":"IQ0h6EeBHSYvR7traXPYFQ=="}}	{"p":"Ds/HxJVN1hgYARslnM0=","h":{"iv":"XH8FO7sv3Pq3+CC7","at":"wjwD/IykMtw6+xb6Mu4imw=="}}	{"p":"dQD6MMTrHGtgl6n/","h":{"iv":"QfX88jJm7Id8wgkG","at":"TWn8rnRa07mfTbJE0QXMZg=="}}	{"p":"oUh5aPS8j4c47VgC","h":{"iv":"4V8sbq9LpwpmYXb9","at":"DZPR8OnsfPHl6nDby4knsg=="}}	{"p":"CJlw7HoPZSwA0G4LVF1FVMRgaM81yaI5bww=","h":{"iv":"XzSKQ+F+ccVE/lqm","at":"uUz5PJ9shwIIEPtIOGubXQ=="}}	unknown	private	638467982	Carson Bashirian	xavier@berge.test	2025-05-16 15:37:34.466058	2025-05-16 15:37:34.466058
24	P24	t	{"p":"87+MbGzKjM/jqaH3j0kAPA==","h":{"iv":"jX+XwbP2X/1juS/i","at":"zSDfUn7EGebKX0LKhwydbw=="}}	kantonsspital_winterthur	{"p":"1/QYTn4KyA==","h":{"iv":"b4KgGL0KXZVnQQDX","at":"gxiW8lRoI5ZiFhGKsf2vnA=="}}	{"p":"5jyc/KEi","h":{"iv":"8VSFQnyvMqJCrulm","at":"ABGIffngzcxx6kjuLYeCbA=="}}	1938-08-18	{"p":"eS0EX77+","h":{"iv":"eLXt7nr4ku/JUC/u","at":"nigf5aIuURyAIO2OuNt3Dg=="}}	{"p":"DvYfaJeMP2DdfOb87zjiWgWe","h":{"iv":"s3lay/69OUcMezdp","at":"dgAq74N7penTdwwFGJ0qDw=="}}	{"p":"3OOoKgM=","h":{"iv":"m/AISwsizxSEWnv6","at":"8nP8oN+rRgxjaENf6oYhsQ=="}}	{"p":"ypMyDP5lSQnRIQ==","h":{"iv":"6IKPXMNlt/wRYSCl","at":"vL4ISoi9epQnEYqlArsD8A=="}}	{"p":"HQWrXqtGtnSle9o=","h":{"iv":"AOOvod5unfLLtL5E","at":"niiRiZL+JSfaXP8jqq7kfQ=="}}	{"p":"1ksDVeX09O2m9A==","h":{"iv":"ZAA7vKYXsL+S9GY+","at":"kkjZeKyk/r5METBDZUupPw=="}}	{"p":"TMUozZdKVemTTSuw","h":{"iv":"N8XQUNZ9V+fodmZt","at":"f+EzvZHJm/7CDDTLZh1k0w=="}}	{"p":"bqCH5W+72ElwMjB3vuzL9Tbobu7CK3hqZCMsGi4=","h":{"iv":"Kdysn6lZ0JMOtvAq","at":"6h2dSeyh0G1nmFoLSks+vQ=="}}	unknown	private	327614482	Zelda Howell	dante@friesen.test	2025-05-16 15:37:34.473212	2025-05-16 15:37:34.473212
25	P25	t	{"p":"1WwX51OYz0skoouIljWv/Q==","h":{"iv":"5pYFnWvaiCKmcJHB","at":"penl4EM9Ni9zhijG8jDtoQ=="}}	kantonsspital_winterthur	{"p":"oCmgZMtK","h":{"iv":"8rbkHfW+IXVrwD3H","at":"3yariPJVt7sZft/7GumL4A=="}}	{"p":"LFLRpfF9JB0F","h":{"iv":"7hDMbgnBuTOxFsEi","at":"ZRXRJhhrxheUQy+Pk9/GKw=="}}	1950-08-01	{"p":"hN3ViNE/","h":{"iv":"Grq/e5n7dqECWtCL","at":"cXdiCx0DcPnuQAcTlgtqHw=="}}	{"p":"Yobi025x3IpyKidgFZNLsA==","h":{"iv":"cjHvsnvaSC7Q/tDf","at":"gVDvXKJGd0CcT39pucWSbA=="}}	{"p":"wcjEI2s=","h":{"iv":"UztAGYP9Vu3R1hqG","at":"WaZQGTp0Fu+3dw6P0mZx8w=="}}	{"p":"wScQOXc=","h":{"iv":"vEehB7vwoWTRh0oN","at":"bJmOiGcADCJk4E9DZx5aNA=="}}	{"p":"cSySFIJqLh6rnA==","h":{"iv":"B3ATdvevU1fRjK06","at":"jVuI+u16OKl6Oo16cl8Iog=="}}	{"p":"OvvhjrRipPdgIQv8RblgPGpxSZMogctZ+QbNipULUwd+FB3+QA==","h":{"iv":"5jAdgzDbALl3wT8h","at":"59Njw7DWs07gHWeR4UEs5A=="}}	{"p":"rbNJ9JkszZ/P+fzf","h":{"iv":"L1sTdPMEyeKCxv6G","at":"puQtDE+YcvGW0Z5A9uMQJQ=="}}	{"p":"oxbq8J6ZLLg8HCfXwa2a2sWv2X3xt/C3NxPBg+9g","h":{"iv":"LhZyyxvLJDmUbieS","at":"NhpUEYtSBnyxzDZqSaiycg=="}}	unknown	private	822906462	Stanley Jaskolski	ernie_harber@volkman.example	2025-05-16 15:37:34.481217	2025-05-16 15:37:34.481217
26	P26	t	{"p":"xp23B1B8Fti6Ys6sWoqBAg==","h":{"iv":"vI/9Qr1i7Qjb/Lv+","at":"ncNbdE4LeAnmFW54smofrg=="}}	kantonsspital_winterthur	{"p":"cJ4Lq+60","h":{"iv":"1htqYGg78ECdnCFF","at":"RQn7eILbizUE+RRxGykhJA=="}}	{"p":"1XZ6pqY=","h":{"iv":"kNVnULOJ73N6EMM/","at":"2wo/WYhgi7bUQyV4HvQ9bA=="}}	1986-11-16	{"p":"QzICAQ==","h":{"iv":"mOHwvTdUnW4bOESh","at":"jhgNgf4fCjqxWHEf+El13A=="}}	{"p":"QdBIH6Mwmkefn18=","h":{"iv":"Iah1+3SMGNHD5Szf","at":"HlXo4I4HjBpF62K+deJrag=="}}	{"p":"ofnPhAQ=","h":{"iv":"gMGCF6H8yYVZhZRh","at":"C4rD2AYoSHefiL2jsXEZYg=="}}	{"p":"SEa2sTk=","h":{"iv":"616xlLPZvGffpTYZ","at":"aCUvJtipH63uCuAxDOle0Q=="}}	{"p":"vn6qvWf8DXBcuGp3Esc2+4c=","h":{"iv":"q19T2oQyTvVW//fW","at":"pNWJdztxtr+QTS5lX+QQGQ=="}}	{"p":"2R7xUyON++jeKHBJD8nv/Z0Gc5JgEzU4p2qcI8RSXpVI","h":{"iv":"SgIGd3cf9+hawRoL","at":"oM/+UjU31p5qrSUdYUDRlA=="}}	{"p":"yBlboRah9i7lhcQj","h":{"iv":"F6ztUwFtd94Fm3Nd","at":"TJhfxMhXCpkzvklU5g/IQQ=="}}	{"p":"9GV9wJGaGSuGsH0JmDfrdLc9sWpln+cv3pk5jkpDqwQ=","h":{"iv":"iCKtYRKb02pG+ym5","at":"QaCGyTAXEJ5vIwb4ojp62g=="}}	unknown	private	151408891	Cammie McCullough	carmelo@wintheiser-leannon.example	2025-05-16 15:37:34.48959	2025-05-16 15:37:34.48959
27	P27	t	{"p":"+gbCKIUtpcuyLTcybBc8FA==","h":{"iv":"YCLFaGE+MBKTPek1","at":"CYSmhOIkhxHidwk6fh1vog=="}}	kantonsspital_winterthur	{"p":"KZxc+dsbNA==","h":{"iv":"XmrvEP8qQ/7Gd9Eq","at":"SeoCcmmSYFIUuAExV1tLQw=="}}	{"p":"xlOzGsWMV/md","h":{"iv":"9Y/SEJUgpHIwTJM8","at":"tgkZ7yXWMU4KXERB9t46vw=="}}	2001-10-04	{"p":"VxLbnA==","h":{"iv":"3vIxRLZtad9uKW5r","at":"MmePUcTQNqdOaSMXUFJdCQ=="}}	{"p":"fS17JM2Onr2Q9ms6tg==","h":{"iv":"N4NRNO7EskD11ieh","at":"XkMmMJTQn/QOEwd1iGERhQ=="}}	{"p":"opkHfQ==","h":{"iv":"QqAFSs+aGMlMgorV","at":"KAM32N+Gcz8xrOX1DEEEgQ=="}}	{"p":"QSpDJWE=","h":{"iv":"PciWNB8gcKWQaHpP","at":"e/LnTnejE3O/PJUC8ZUxhA=="}}	{"p":"giO+bRBiHw+nG5Q7LMTq","h":{"iv":"ExJ2GB9UgtuEzEcm","at":"C21dxb6GbCL/FbOvNN//mg=="}}	{"p":"DMGFv2w4ZGRGRj4WNaRWPnQ=","h":{"iv":"KC0YcDI41X6MghvP","at":"Cq5WmAJbkCIBCyUxtNv7Mw=="}}	{"p":"HDqhobE83FAST6Vm","h":{"iv":"lKPqKtvAm93+E4Fz","at":"ft+7TNGaqjRJeR1sFoC5QA=="}}	{"p":"zdavl5jEaeGJsAMWafH/jHSsEbcqFRvEM5kqg8NNvGec0+o=","h":{"iv":"a487lUFZTcUudvn8","at":"/8jAyJRvVZkaMxY+whiUAA=="}}	unknown	private	770156263	Maxwell Herzog	stephane_turcotte@hane.test	2025-05-16 15:37:34.497767	2025-05-16 15:37:34.497767
28	P28	t	{"p":"/JUDkntgbb8ENsWe9DYsAg==","h":{"iv":"4bfaQ3JEJTAWGM/r","at":"3z7/FBYR8ykThaOnRvTedQ=="}}	kantonsspital_winterthur	{"p":"9Yhy7912","h":{"iv":"DvWaTa1q3zGRDSwX","at":"izboZFX8G7Btm2Q2DkkOCA=="}}	{"p":"WmpTEaY=","h":{"iv":"F2pWHSPapExJgFoI","at":"lvx/VgxGFPJL840IqU9aUw=="}}	1971-12-27	{"p":"Q7hTjw==","h":{"iv":"/Y+PKy99ZF4dT/nr","at":"bMd2a1czdV/LvDoNwnGTBA=="}}	{"p":"1y0mwFlZ69eqCpvIfd4l","h":{"iv":"7tWa7rgN9UEroxBq","at":"6nJ9wJj/TkrbdLRPxmkMjA=="}}	{"p":"oHa7sA==","h":{"iv":"+01+2T9QREFt4hJi","at":"pC/oCq2a+jkRPRMOnd2vjw=="}}	{"p":"iooN4oc=","h":{"iv":"RSPzD+rH1snqwVcY","at":"sVem+puX94v0kHV13RRTjQ=="}}	{"p":"ZW+UPw25uFaVJacvqJI=","h":{"iv":"0Gkg3pvvAMMueZ0M","at":"wGQuf8VQ2QW97m/EsiAyrA=="}}	{"p":"DaoFMJTYookG","h":{"iv":"jv+CW17HPXBHxrrz","at":"lGW33QEU2hbXf7OYr52anQ=="}}	{"p":"DnnxPSEycUdUqm5h","h":{"iv":"MJkEmHLd/3f89b1W","at":"lq18QDYSdODFYVKWF/dLYQ=="}}	{"p":"Q2L2R4tTpE2zlc7CJc2lx/HC72EMsvUC","h":{"iv":"oOfbPEt3+9Ycq4Bn","at":"zRilIu/z5OzTPkLl/D3obA=="}}	unknown	private	478412438	Prof. Halina Walter	deanna.funk@greenholt.test	2025-05-16 15:37:34.510185	2025-05-16 15:37:34.510185
29	P29	t	{"p":"B9QMu7lXiFxggWnfmoeIIA==","h":{"iv":"IdM0rqrLBXuOsGTf","at":"ls9IhQnXnRFGT9mqjOCPaQ=="}}	kantonsspital_winterthur	{"p":"ypkeJTmq4g==","h":{"iv":"Gk0arKinhn6E09qs","at":"NML4H6dacR5j/oOBEXo5Uw=="}}	{"p":"ETQ6","h":{"iv":"d+D6Iouj3A97RX0W","at":"VeE/wV5Y6x5my2nL1slXWQ=="}}	1954-07-08	{"p":"wUuYWotC","h":{"iv":"/sC9ptfGC3a0fnVx","at":"jyUZMksgjPr9y5rsFSbqSw=="}}	{"p":"Q5J4ckcvQbNh","h":{"iv":"yFs6NcKqURJLQ9Dd","at":"8jZhGIQYB38hMXr93/ozhg=="}}	{"p":"kcvuP+E=","h":{"iv":"oJdgcQpcYl+54GF4","at":"q7l3/NVEs7sAjSXzYFMiFg=="}}	{"p":"n72pyxKnS1J4Cg==","h":{"iv":"kd8U10VgVDf/SlWA","at":"F/i/4/EHzkEIC2EW6fa3WA=="}}	{"p":"DRbZ8mkDBzPIgLFLhw==","h":{"iv":"2D3D1XvHq6vhyRCf","at":"1aZdaMCWZc7SQHhCvyGi5A=="}}	{"p":"sbMUne4S9li5XGBSN69t4rqNi7U=","h":{"iv":"NpGaEPxfiTklBMn9","at":"0RmLGwx2V1LLy8d4AeJEJg=="}}	{"p":"ADNGVUm7dmXnZUmO","h":{"iv":"BcXrLl/M5tuf6cde","at":"Wo6d0DFW843zDrdqcWdsAA=="}}	{"p":"yWCwX2vEJSyJWoHAivz+/UPRO5KR12LPG6fuTA==","h":{"iv":"xmIOK/LOaGHxaRDk","at":"nr9drJQWYls7eBUs4WjYBA=="}}	unknown	private	484677241	Carey Labadie	keith_reichert@rau.example	2025-05-16 15:37:34.518855	2025-05-16 15:37:34.518855
30	P30	t	{"p":"Smdef8q5Jk6z4yPoAUv4uA==","h":{"iv":"fCcrWo5aGMDFI8At","at":"xUfEVO+c9Drtcqv4IOjHGA=="}}	kantonsspital_winterthur	{"p":"FXK8xBxBW5I=","h":{"iv":"AtAOxrbws/0TJlqr","at":"JecTbyGTnwn4GNkH+yn04Q=="}}	{"p":"KciAUZw=","h":{"iv":"OGtI5347dufSfRmS","at":"NUIE/WhN7bCtBhSUX0WuwQ=="}}	1954-07-12	{"p":"oc/tuA==","h":{"iv":"s1CnbwBZNw1TAl41","at":"jYenMUa4YFopx8lqQGOz5g=="}}	{"p":"Lu38J2+0QOWg4jCoRKcQo3B6","h":{"iv":"J16HtOLDuciX6463","at":"fp0EKhVN4q7fooje8qtCiQ=="}}	{"p":"srXp2w==","h":{"iv":"nSi1ni2mJSPgTzzj","at":"lAZK1K3SR6bvse4Ih7j0Iw=="}}	{"p":"QxN4LC/wk/V5Mg==","h":{"iv":"W2tDISstI6VAeEUE","at":"Da+r6irifwLKisxtHH/AQw=="}}	{"p":"GBTDUgsZPZCy","h":{"iv":"yRJEH+pPLvcVhne4","at":"xE3AqhJpMQQlxdXMPSNRKQ=="}}	{"p":"uZfNOFsE","h":{"iv":"wr7FS/5rsQ70gej0","at":"KLV1ojJP/Z3gzEbixpg/hg=="}}	{"p":"YsBtN6m3CE3GeaF0","h":{"iv":"4Bl0k2V08fvtN5ZL","at":"ZdVT0PT4FVYeGIGrEz1Img=="}}	{"p":"xNVFdCXrQHMqlniAEGs4Btaxz4B37JkP2RMv4YX0","h":{"iv":"kcpcG3Z6SdYCujDj","at":"JVXxlvF1KjDX69TQTiYk6w=="}}	unknown	private	676282171	Saul Windler	davina@smith-muller.example	2025-05-16 15:37:34.620593	2025-05-16 15:37:34.620593
31	P31	t	{"p":"d4N2rzDZGEXS5TzZpMKy9g==","h":{"iv":"Gzc2RVis2PHJv52S","at":"ohvCMsm+V5D6Q0GYVcd7XA=="}}	kantonsspital_winterthur	{"p":"C/93UGDv0Q==","h":{"iv":"LRFDeEvTCp8vS71H","at":"luvLXziSK5sMwloTgZjM0A=="}}	{"p":"ZDDpT7ZAYis=","h":{"iv":"zglw+eY1yfd2cVDE","at":"lJQzgZl1B2mmuKb81ILcGQ=="}}	1974-05-25	{"p":"3XZIl02+","h":{"iv":"+hVa3QyInuQszdzb","at":"Blh1QPgEcM5OzqYAnQK9jg=="}}	{"p":"iMKECv0DEnwwf4weYHc=","h":{"iv":"nMfnIPna+uwHXufU","at":"oMp/h1WFlvdPDFW/LDCN3g=="}}	{"p":"ww4T+A==","h":{"iv":"dA0Tc/5iBBM46v35","at":"+QoaLTs+LmBgAMOS0AHd/Q=="}}	{"p":"6VH9TOM4/6Mhxw==","h":{"iv":"W+W8TQMQZ4nTD06R","at":"MdhcS7NqpXDfz64soxLFfw=="}}	{"p":"Jj43j0QnLumG6A==","h":{"iv":"YadmkC1cFmVqMg6j","at":"uoQ0YaAFYzdMLtjOvMo4QA=="}}	{"p":"RG/6i2Bzl51p7mgtaUjCkeUMsi8=","h":{"iv":"EAs9N8+F/mWNIMeS","at":"ZUyFU2YfwWU8apD3WlBz0w=="}}	{"p":"x7d1hzIwB7WqT9wZ","h":{"iv":"KuKDirBb4XjOn1TT","at":"Vqlg3GsyHlxTeHvRwa78tw=="}}	{"p":"3et0YCGzkMCf20kfEMeMkeDMPkOLsELiAg==","h":{"iv":"LawpvuedXoRYI2w2","at":"PpJH+X5+CaMixiYh3f7N5A=="}}	unknown	private	312833171	Salvador Herzog	burma.waters@oconnell-mitchell.test	2025-05-16 15:37:34.64823	2025-05-16 15:37:34.64823
32	P32	t	{"p":"UbeKgF9YJasX85gzsoXrBg==","h":{"iv":"si5962uD8n/rNvtB","at":"wUkYuTSMCXaJliffOSwYPQ=="}}	kantonsspital_winterthur	{"p":"8jV5Vp7oqw==","h":{"iv":"F5uq9Y4vZTu5NW3J","at":"3a0piz9DZJlw9YH8SVkXAg=="}}	{"p":"RhaPIA==","h":{"iv":"03vqkCUV43jRT6LQ","at":"e1I7mr/xbiLVVKwF/3dFDg=="}}	1937-11-26	{"p":"0BgDRg==","h":{"iv":"tyx1xLnzECHm7zrQ","at":"PaHwz2ChlD7i3mAOov/54g=="}}	{"p":"cqpIYaqPxE2MGm1VgCeQzQ==","h":{"iv":"/KUHQnNE5hTWTuxL","at":"jBVBZ8M+pIvXmfwzNQkc8Q=="}}	{"p":"MyDNNtM=","h":{"iv":"4GX7FlVExDT0qi66","at":"vsG8/TZbc0Xuh/+hb9Q8AQ=="}}	{"p":"9Ay0lQpA3JWReA==","h":{"iv":"/JfH7B0o7ljwMhGZ","at":"TbC5+zh9sBm/bniMEqeKoA=="}}	{"p":"8YVozT1erV0lcA==","h":{"iv":"qJ1o56rKOx2rdQZy","at":"JPWBd61kt3L2wpWwZys8dg=="}}	{"p":"bgIpQCErJA==","h":{"iv":"uNdS3q2DGUDwz1Yr","at":"sQpBukKilugD/KYE2/RlTg=="}}	{"p":"Hx+Y83trUKzQHMM4","h":{"iv":"5YUbtS/WepdqRbiS","at":"hMlK5In+CFBFzKcAeT50Gg=="}}	{"p":"BV5DnQfCe3ApJy5JFs/QLK3rax0bwzNkUkPO2nHX8bU9","h":{"iv":"IYRk7b3oeGAQE3f2","at":"Nt1UYyKLQkU8mupp5q9niQ=="}}	unknown	private	441270027	Elmira Ortiz	kerry.trantow@lowe-mayer.example	2025-05-16 15:37:34.656324	2025-05-16 15:37:34.656324
33	P33	t	{"p":"txkAwjLhVRlqXrABKNTrMQ==","h":{"iv":"LHokMtwmmFvks0dh","at":"yWwf7palNGHI5uz3NjWs1Q=="}}	kantonsspital_winterthur	{"p":"Ql1WCuhu","h":{"iv":"nx0Mk6HKtCJVNESt","at":"H4j6rltTnvKAvYT2OqFWHQ=="}}	{"p":"YLjYkdOY","h":{"iv":"UOddtejYLtPlKIPK","at":"mnqP+MiHOMHN5t4Ki66boA=="}}	1955-11-08	{"p":"pcCEmw==","h":{"iv":"JHyZOszNp+9G7o6U","at":"fB5rhT584D2OWhxKwmGn7g=="}}	{"p":"AiST4SAHVdZIUnV97mkC","h":{"iv":"oyd0N5WjUqK6APcW","at":"hwc1lx4GP1XQXf+dtku6qQ=="}}	{"p":"NGdK3M8=","h":{"iv":"bqPA5swfsELnUlA7","at":"GqFGZElgvbQTvPNKBukV8Q=="}}	{"p":"xz2uG78=","h":{"iv":"FcnF/sCc1CV2JdUM","at":"7hOcT3BoGoRJK+osI4EUNA=="}}	{"p":"TPNEfv4mhixriGM=","h":{"iv":"koS24Cv0wupOy1CK","at":"p5aVyF1Fcp5rYdzZEKzMxw=="}}	{"p":"g0DXhgeE","h":{"iv":"99rdRC0Nu+5Yh57Z","at":"ip9shfDa4yufhUWwvRIRsA=="}}	{"p":"QI+L3a41/GcRi+T+","h":{"iv":"KVE++FjE/klWMzXf","at":"qUEmAwDxBwCCuP9GPZG3sQ=="}}	{"p":"dIzorWfs2QcNNrS3K55G9tnTMRgaig3KemS96lz0","h":{"iv":"BxVbWQSJJ/KJzllW","at":"i7R4aQW9HrigT4chXc7JLQ=="}}	unknown	private	657053630	Prof. Della McLaughlin	brittany@murray-bashirian.test	2025-05-16 15:37:34.663834	2025-05-16 15:37:34.663834
34	P34	t	{"p":"W+19m70AdEYaEorZeJa1Yg==","h":{"iv":"9pyJw0HvqOkxOKwo","at":"G4Pg7PQrrLrAT1Ohi/VGqA=="}}	kantonsspital_winterthur	{"p":"JuksfEbly+c=","h":{"iv":"Tw8LanvR/je3+iGo","at":"/goIOy5VdN5zUEVoqJTX2Q=="}}	{"p":"dNAGrZXV","h":{"iv":"Cpvq9uTl2p+PROO8","at":"q0mjkx1xsjI66cy6WAGs3w=="}}	1972-06-09	{"p":"n7Uik8wK","h":{"iv":"/UCnguddiU5rhuFy","at":"3fLLs+aXnxc6b00AMZTenA=="}}	{"p":"1Q9HYsFPChHZ8/qY","h":{"iv":"u5QyLLmRH4r6hLsE","at":"Pa8wNiNSldqiGqh2UgLC8w=="}}	{"p":"tAVUmA==","h":{"iv":"y0Uf9sfZ6Q2nF8Qt","at":"fqeei7lpOmZYqr2SinlgyA=="}}	{"p":"JriL6co=","h":{"iv":"OjkWmV8LBIgA2R0x","at":"B/wZqav9B4+5hkZvFWZiYA=="}}	{"p":"1R1doyuBIskS+tM=","h":{"iv":"f7Jvi95SK3BYP8XI","at":"O9E1rWClFKkX7PEoLGHrHA=="}}	{"p":"HNEnz/yw09+oWEA=","h":{"iv":"t1kVp+YrWk+re7Sa","at":"XwdQOPhfKrb4jYzJsz/OEg=="}}	{"p":"0GV8dhoaN7ymmGHy","h":{"iv":"ONTodc6hKe4y0SZd","at":"P4Io3z5J9qPlvfxjgJKntQ=="}}	{"p":"qVBOyBtYXqavS0pYwxmi+miw8xFS","h":{"iv":"gMueQ5TeRqnyopNx","at":"DUbOAacG81u4RJpL/92R8g=="}}	unknown	private	799721216	Florentina Bailey	renaldo_braun@ankunding-baumbach.test	2025-05-16 15:37:34.671509	2025-05-16 15:37:34.671509
35	P35	t	{"p":"9hdYL2feETHyZ2P5c3sDlw==","h":{"iv":"2sai3lbZDvsFvxLE","at":"IJCXb+JdE3+9reDJrm7Qyw=="}}	kantonsspital_winterthur	{"p":"fkPmTL8=","h":{"iv":"IguZzHUH/VDD2YvX","at":"n0GOovRoVKX+7xPTamzYRg=="}}	{"p":"T+JHvRcETw==","h":{"iv":"bsAgIzCgGf+FKq8Y","at":"ZZJXgyQwFQ2PfUYTZIx9IQ=="}}	1940-09-15	{"p":"mexXEw==","h":{"iv":"3kv7okson27ncxri","at":"y8OF10Vlln9B9J3JAJxP0Q=="}}	{"p":"FnLXy7MEMFhQ2UH5ew==","h":{"iv":"/JMJ7amp0VbOLvD9","at":"ZEUWbNee0IWzVMDFz+6vtw=="}}	{"p":"RRBZFQ==","h":{"iv":"3FepohnQ80Bv5unr","at":"gSWqBMubR5z5gq6zjJApgw=="}}	{"p":"SIwpYKI=","h":{"iv":"MDet4EiIH49HBP2A","at":"ZfPMssZ0qMt+rL/TZuWd5w=="}}	{"p":"FPD6l+FBhjJzYSg=","h":{"iv":"4XaFpccs1bkQIzOg","at":"+/wrtXMAYjBkLFkuwlNO2Q=="}}	{"p":"opjOPY9Gkw==","h":{"iv":"a0OwHDqoHkjEW4o0","at":"43DZksMfGjJ/Rrl2NtYCzA=="}}	{"p":"a1r5TF7wdYpnTA8H","h":{"iv":"D/mc+E3SuPCDajND","at":"Cbnr2mo8ca9fNUk3EI9Grw=="}}	{"p":"og1NMpcmXVrSsV8zASZUG0xo+iAhFiciyeZifRA=","h":{"iv":"MyLfjL4OEwtA0AKX","at":"9Xua/nX5r7HJDVX2Lyvtjg=="}}	unknown	private	140279566	Krystle Hyatt	lawrence_aufderhar@zulauf-stehr.example	2025-05-16 15:37:34.678426	2025-05-16 15:37:34.678426
36	P36	t	{"p":"vFsF3Ei+D6Cu61Wmw8CJ0Q==","h":{"iv":"Kx/IqL51AEA9VqS9","at":"sba3DADCw2GDmGT66c6Jzw=="}}	kantonsspital_winterthur	{"p":"A+9cnx01vA==","h":{"iv":"B4CMqJyCi9Rw4d03","at":"H2ymPkyQuXk2PB9Po7vjiw=="}}	{"p":"1u8TbXc=","h":{"iv":"XYtMegjm9G43QwGe","at":"sYaMcLnIKX8e3Z0ocbOBKw=="}}	2004-05-26	{"p":"2r1bmSSs","h":{"iv":"D1aBkW9rMvAU5192","at":"ERJGdLbLnyhj8w/NrWNwRw=="}}	{"p":"Axy+mgWQVPU6oS4=","h":{"iv":"54t8T2fsCoGqUo+A","at":"XudGix6IWLYILX0gm563uQ=="}}	{"p":"ZHP3","h":{"iv":"NKSQDz2r61iPHAjT","at":"2GgcwCx4E3qhO0pNhc0B2A=="}}	{"p":"hHCOTDo=","h":{"iv":"HK8goUUCL83B51t6","at":"04eWIg/i5msofCD8TkhUxw=="}}	{"p":"EcvbjT+281IaKO0=","h":{"iv":"vBsraPVwxPv0Tq8F","at":"it8PQdHJ0PaAp0Ja3G7R/A=="}}	{"p":"XoO2sMjiT+4eJpYqRP2F4Q==","h":{"iv":"PkIuyKnbAcJvI2db","at":"aExB1yeOdx9Xp760qGexhA=="}}	{"p":"LwOEFgLcYkkntzws","h":{"iv":"YDSM9tte5Gr3zb6l","at":"/PCGj1tJyWuXPsGkczxm6g=="}}	{"p":"psBL2ESDjKijlGSAI9p82SAD7EU1BCxFVMv4fbR8Vz8=","h":{"iv":"tUlineSXY1HVwPTU","at":"tiihhdEJrSmNvJ0j2z11Xw=="}}	unknown	private	908521135	Eloy Kovacek	alfredo@kunde-waters.example	2025-05-16 15:37:34.708991	2025-05-16 15:37:34.708991
37	P37	t	{"p":"IQtHAXNy2JVijvPij7T7cg==","h":{"iv":"21PAq9X9LARs3Lac","at":"LfvuE5KhR1vg+iE0ASthQw=="}}	kantonsspital_winterthur	{"p":"Jko04s2Q6RJM","h":{"iv":"apCWKCg5S1sDZ70C","at":"Xu1z1K/78bhaQkPytRWGTQ=="}}	{"p":"uByh0ErKqA==","h":{"iv":"c3fiu0sCdlSX2vBc","at":"xZUalv0kbmynv+Qs7RdEdQ=="}}	1976-05-02	{"p":"GXSR+w==","h":{"iv":"MgpivN4vC2CgiE82","at":"wOIxHLPe9pftUG1U78G2Fg=="}}	{"p":"galpm/WhID2YhGL/mCG/","h":{"iv":"VCVw3Ew6c1URQWcL","at":"xYtCZhG0nOwO9EkflLDVHw=="}}	{"p":"cFgs","h":{"iv":"T6GsoROBnguaGVXU","at":"dHAoE8lJF5sRbT96LigwCQ=="}}	{"p":"R40eMDgSCiWj/w==","h":{"iv":"9Zyomrp/OL2l2Zwp","at":"wOQorv35YcVn56rqXRK8vA=="}}	{"p":"wcxY5t74w9NeRaEV","h":{"iv":"ZRZZO8ttzRRa5LKy","at":"L4FvMrSlFOZZmfF5jKH2hA=="}}	{"p":"HGScmh2CUcGCsUg=","h":{"iv":"WT+y882m3bmwa86h","at":"iNSuMjiru/IQMyQKfh6usQ=="}}	{"p":"E3A6lT8I+kd6/D6L","h":{"iv":"QyZLXhzHvFe7uejw","at":"OMCGQ7CFeExHWryfravJqg=="}}	{"p":"mXQcQPNPMD8jeVNxIUy6mN8=","h":{"iv":"hy/P9YomNso6nwMh","at":"N0i7AjRz/5opOrl/oVmvTg=="}}	unknown	private	335680483	Arnette Kohler	alfonzo@littel-upton.example	2025-05-16 15:37:34.717238	2025-05-16 15:37:34.717238
38	P38	t	{"p":"pVJp9lNO7EWEX+LXB+zuOw==","h":{"iv":"HmmFJ49ty8zmuDLd","at":"P56B+PiuKdGVU07l2YGDaw=="}}	kantonsspital_winterthur	{"p":"4pf3dpiu1g0=","h":{"iv":"bO4Hdzlqh1SrPf05","at":"HdihV4zgbBe931GKBTe+jg=="}}	{"p":"7uRYg5c=","h":{"iv":"SkFFBJobutvb7K5W","at":"wa6wWsgZgh7oNKroZIIgpw=="}}	1956-03-03	{"p":"GLyOIfko","h":{"iv":"XGcklCsZEE9G/J5h","at":"qDZx2J61lEkOMLcx2Ajb2A=="}}	{"p":"jtGkNDTZz52r5obG1GE+","h":{"iv":"OKb67GR9DbnRw6aa","at":"3UpbR6QllnqQLae5lgGtIA=="}}	{"p":"fhDC7YY=","h":{"iv":"zgvXOMlR/XzfH0a5","at":"Z/obh8p7aRtCXBVHpgUFMQ=="}}	{"p":"+f49NoJ1/SsJsA==","h":{"iv":"lsAyvUpRYv/rXP0w","at":"bRFgugR+O44h5vlSvACUwA=="}}	{"p":"jAQDj3hHZvjZwA==","h":{"iv":"EpEEiTERL4dXD/Hn","at":"Ta8ETU9b+Ln12JO1jr1/qg=="}}	{"p":"prRJtbCr","h":{"iv":"Lcyf0c+jwL043TAg","at":"bRfZtk0raYtSCEwU/ZSQxw=="}}	{"p":"ePeciXt26zIioeBx","h":{"iv":"hw6vv61VXYSM2N2l","at":"idIgwFZFQubrhKXNSQz17g=="}}	{"p":"VBkehAjPKJ2YK6iq5gfQig==","h":{"iv":"ciujdk5mlA9qvPzq","at":"GaH01t/0IR0xKt4luYrEbQ=="}}	unknown	private	188039556	Carter Bartoletti	emilio.gorczany@frami.test	2025-05-16 15:37:34.724508	2025-05-16 15:37:34.724508
39	P39	t	{"p":"oowkgQjwS7XpK+fnksrwGA==","h":{"iv":"Nc0foaglmRcURrOI","at":"/Ee4/v6KMYaOoSBzmvfJhA=="}}	kantonsspital_winterthur	{"p":"7Htyc0Sd","h":{"iv":"6K4Evi9KLw3KzNBR","at":"v0Kam0geC4EtCk337dVeWA=="}}	{"p":"AdQUhD8gJw==","h":{"iv":"jPUjMCdYO3U/wyx0","at":"efYX4l3+R+u8uG5UjdmU0Q=="}}	1981-09-22	{"p":"JKXXHg==","h":{"iv":"Z0QgcLIGPGC+Dd17","at":"3bzoIHyt8jeVi0MPSZCzNQ=="}}	{"p":"ZqTO89yMx8VW+DU=","h":{"iv":"ClH+c7GNL3Rfefaj","at":"6V3WCHU6et+547kV58Wo1Q=="}}	{"p":"ucqOJ/A=","h":{"iv":"1VW8M1+hjUkMEXox","at":"V0dxLzGZ3B+zppjxKWi+tg=="}}	{"p":"LjeMkAA/h2gITw==","h":{"iv":"GtB4j0DRwCXFPbLo","at":"93VdVWepq4pcr30jAkapVQ=="}}	{"p":"XC8f4ra3PJa7ldw=","h":{"iv":"ZUTUWzC9kaCqAZV2","at":"Mz7phgnJVoLxiorQzmO7kg=="}}	{"p":"nShdK1+rMpE=","h":{"iv":"RFI8ucERmdC3gK8j","at":"Vln98Q6AlyHn1x6+Bv6V/w=="}}	{"p":"n/0g6C6wVj+20mom","h":{"iv":"KaUA3wiEHO5VkvS0","at":"ange9CN3YvDeRk+DvE5KYw=="}}	{"p":"I4Bp8M6HdZKu9qrhdXhn8sltibzyGABb","h":{"iv":"YMTvQUZbMZ3or4hh","at":"91M//AYaL1Gq+7Lqwtbj3Q=="}}	unknown	private	649073080	Branden Zulauf Sr.	claude.windler@parker-price.test	2025-05-16 15:37:34.731486	2025-05-16 15:37:34.731486
40	P40	t	{"p":"ZTuqyS7kkqacguLrdVm8Tw==","h":{"iv":"s2NgihGg3qtp4Wgj","at":"0Qbg/dlbs1GTEEqB9eaoBg=="}}	kantonsspital_winterthur	{"p":"AHeoxvRzkGI=","h":{"iv":"dfCiCD+qZc+uN427","at":"xgYY/FSIxhoZrWXYFevYtQ=="}}	{"p":"DGV4DYY=","h":{"iv":"ReREAyEgksga389G","at":"aA2PJj3GVA0KhxlINMD7Qw=="}}	1962-04-03	{"p":"477I0Q==","h":{"iv":"b/+3N7Jr5IB/l7+x","at":"Nt2c1r/2LFlc5CAZFDqX4A=="}}	{"p":"evQWBckZ82E=","h":{"iv":"YeQ44Lvhdfe1O/ca","at":"T/XeRIlwPIBWvZaulGrnuA=="}}	{"p":"xeyReg==","h":{"iv":"wEfJLUtf3nLFglkO","at":"KB4BrkO+hmmUkpb3iIAgbw=="}}	{"p":"cUUsOkM=","h":{"iv":"OuOD+D+j9DgtAIKn","at":"JqPMfcCmNtteHAIHZH1E0Q=="}}	{"p":"fKhdkDqbDSNg","h":{"iv":"puLYpiTvW5lT+nFv","at":"BDDz3qzBPRU6gqUxujVsDg=="}}	{"p":"a2TxNCqZvVy2atNwSxO2FRvqIumSkBT98Dw0","h":{"iv":"iSZGSBkkucFrik83","at":"cMsdtveFAZaKSNMUNMhQ0A=="}}	{"p":"lIrw0BvYfOU6Ff9w","h":{"iv":"xA8c0B/RbvHzuSFE","at":"gvt+Lx38kk5id5WndUwX1w=="}}	{"p":"qvg+9xaqpxW37bSYJoEmoVeKKPIRHDY5e37dIA==","h":{"iv":"tPgoMieHmA1pQ5uF","at":"AfTN4jJHaHJ4EgM2Qp2rog=="}}	unknown	private	112605166	Kortney Tromp	sherril@kerluke.example	2025-05-16 15:37:34.738823	2025-05-16 15:37:34.738823
\.


--
-- Data for Name: croms_radiology_exams; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.croms_radiology_exams (id, patient_id, exam_date, exam_type, imaging_timing, imaging_type, largest_lesion_size_in_mm, medium_lesion_size_in_mm, smallest_lesion_size_in_mm, location_of_lesion, recist_response, choi_response, irecist_response, pet_response, metastasis_presence, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: croms_radiology_therapies; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.croms_radiology_therapies (id, patient_id, indication, therapy_type, referral_date, first_contact_date, therapy_start_date, therapy_end_date, institution_name, total_dose_in_gy, given_fractions, ptv_volume_in_cm3, gtv_volume_in_cm3, was_tumor_located_in_radiated_area, was_tumor_located_with_pre_existing_lymph_edema, comments, created_at, updated_at, hyperthermia_status) FROM stdin;
\.


--
-- Data for Name: croms_sarcoma_boards; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.croms_sarcoma_boards (id, patient_id, presentation_date, reason_for_presentation, status_before_follow_up, unplanned_excision_date, whoops_surgery_institution_name, status_after_follow_up, treatment_before_follow_up, follow_up_reason, question, last_execution, proposed_procedure, current_ecog, decision_surgery, decision_surgery_comment, decision_radio_therapy, decision_radio_therapy_comment, decision_systemic_surgery, decision_systemic_surgery_comment, decision_follow_up, decision_follow_up_comment, decision_diagnostics, decision_diagnostics_comment, decision_palliative_care, decision_palliative_care_comment, summary, further_details, fast_track, created_at, updated_at) FROM stdin;
2	2	2025-04-29	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Itaque et qui. Et quia dolorum. Dolorum dolores omnis.	no_prior_sarcoma_board	Voluptates enim et. Sint voluptatem vel. Deserunt exercitationem quia.	5	yes_interventional_radiology	Qui voluptatem architecto eum.	undecided	Doloremque aut velit ut.	undecided	Sunt voluptas quae officiis.	undecided	Unde tenetur eveniet dolorem.	undecided	Rerum sunt repellat itaque.	undecided	Eos suscipit ipsum eligendi.	Dolor in molestiae. Quia voluptate assumenda. Maxime dolores ab.	Veniam quis impedit. Quas quia nihil. Dolor molestiae consequatur.	f	2025-05-16 15:37:35.310299	2025-05-16 15:37:35.310299
3	3	2025-05-06	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Nam delectus corrupti. Repudiandae suscipit nisi. Sint sapiente impedit.	no_prior_sarcoma_board	Tempore perferendis sapiente. Vitae et tempore. Dolor et minus.	1	yes_interventional_radiology	Aut quisquam velit sequi.	undecided	Libero amet esse itaque.	undecided	Nihil magnam placeat repellat.	undecided	Praesentium cupiditate totam voluptates.	undecided	Libero esse voluptate eum.	undecided	Dolores officiis accusantium ipsa.	Quas nostrum necessitatibus. Voluptatibus ut sunt. Aliquid nam dolorem.	Mollitia sit distinctio. Natus tempora ut. Praesentium et labore.	f	2025-05-16 15:37:35.323792	2025-05-16 15:37:35.323792
4	4	2025-05-13	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Est odit omnis. Quas voluptatem nesciunt. Nostrum suscipit voluptatem.	no_prior_sarcoma_board	Sint aut dolore. Provident sed amet. Recusandae est vitae.	2	yes_interventional_radiology	Dicta natus sapiente at.	undecided	Et voluptates ipsum placeat.	undecided	Aut architecto minus dolorum.	undecided	Libero tempore est labore.	undecided	Velit non deleniti consequatur.	undecided	Pariatur eius perspiciatis distinctio.	Fugiat recusandae odio. Ipsum provident neque. Id blanditiis perferendis.	Laudantium rem qui. Corrupti repellendus dolore. Consequatur voluptates qui.	f	2025-05-16 15:37:35.33671	2025-05-16 15:37:35.33671
5	5	2025-05-13	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Sed rem sint. Sunt ipsam omnis. Maxime deleniti voluptas.	no_prior_sarcoma_board	Nesciunt soluta nemo. Hic cumque fuga. Vel blanditiis voluptatem.	2	yes_interventional_radiology	Maiores et aut necessitatibus.	undecided	Aut velit consectetur labore.	undecided	Minus doloremque sit id.	undecided	Illum ratione doloribus voluptatum.	undecided	Voluptatem maxime voluptatem repudiandae.	undecided	Sunt aut quod corporis.	Commodi voluptas et. Sit esse reprehenderit. Iusto odio excepturi.	Odio ipsa eos. Pariatur numquam eum. Aut molestias numquam.	f	2025-05-16 15:37:35.351616	2025-05-16 15:37:35.351616
6	6	2025-04-29	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Ut eum nesciunt. Eligendi repellendus id. Et qui et.	no_prior_sarcoma_board	Quo debitis at. Minima et voluptatem. Exercitationem consequatur provident.	3	yes_interventional_radiology	Sint ea fugit inventore.	undecided	Autem unde itaque eum.	undecided	Non libero et cumque.	undecided	Perferendis quo sit velit.	undecided	Aut dolorum qui rerum.	undecided	Error reprehenderit iure ducimus.	Consequatur neque ab. Ipsa omnis temporibus. Minima temporibus hic.	Ea quis sit. Culpa enim rerum. Ipsum nihil corporis.	f	2025-05-16 15:37:35.364105	2025-05-16 15:37:35.364105
7	7	2025-04-22	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Omnis magni aut. Odit excepturi sunt. Et ad veniam.	no_prior_sarcoma_board	Sint qui enim. Quia eius voluptatem. Voluptas voluptatem tempore.	3	yes_interventional_radiology	Quisquam aliquam nemo molestias.	undecided	Nulla sed unde blanditiis.	undecided	Vero culpa totam cumque.	undecided	Et non ea deleniti.	undecided	Incidunt ut rerum autem.	undecided	Non quaerat itaque eum.	Consequatur corporis quia. Sed et ea. Qui molestiae maiores.	Veniam tenetur sed. Maiores qui placeat. Nemo quo qui.	f	2025-05-16 15:37:35.376621	2025-05-16 15:37:35.376621
8	8	2025-04-29	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Enim nihil nam. Iusto aut nostrum. Atque debitis sequi.	no_prior_sarcoma_board	Quis debitis ratione. Autem dolores optio. Debitis enim eveniet.	2	yes_interventional_radiology	Placeat voluptatem sit hic.	undecided	Hic sit vel est.	undecided	Sit reprehenderit suscipit facilis.	undecided	Praesentium voluptatem quos distinctio.	undecided	Qui culpa ad velit.	undecided	Explicabo occaecati recusandae sit.	Reiciendis neque mollitia. Sint odio laudantium. Ipsa quia nulla.	Pariatur voluptates earum. At veniam sint. Vitae necessitatibus maxime.	f	2025-05-16 15:37:35.38896	2025-05-16 15:37:35.38896
9	9	2025-05-13	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Iure dolores libero. Dolor consequuntur quia. Laboriosam molestias sunt.	no_prior_sarcoma_board	Ut mollitia alias. Laborum est distinctio. Minus eos provident.	3	yes_interventional_radiology	Sed sapiente harum quo.	undecided	Autem et a ut.	undecided	Nisi maiores veniam aut.	undecided	Nemo possimus debitis illum.	undecided	Quaerat ipsa similique ut.	undecided	Consequuntur consequatur quasi optio.	Culpa aut enim. Animi at maxime. Enim autem excepturi.	Voluptatem rem blanditiis. Rerum aspernatur vel. Adipisci eum qui.	f	2025-05-16 15:37:35.403311	2025-05-16 15:37:35.403311
10	10	2025-04-29	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Est sit rerum. Delectus placeat tempore. Incidunt aspernatur eveniet.	no_prior_sarcoma_board	Quo accusantium omnis. Alias odio vero. Nostrum officia impedit.	5	yes_interventional_radiology	Voluptatibus laudantium in incidunt.	undecided	Ad voluptatem blanditiis nobis.	undecided	Et repudiandae earum inventore.	undecided	Et nam doloremque sed.	undecided	Nihil quis ab amet.	undecided	Possimus minus eum aut.	Fuga eos aliquid. Eos et ut. Eos et vitae.	Tempore optio sunt. Architecto sit molestias. Eos eum libero.	f	2025-05-16 15:37:35.416849	2025-05-16 15:37:35.416849
11	11	2025-04-29	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Vel temporibus aut. Suscipit nostrum maiores. Enim atque voluptates.	no_prior_sarcoma_board	Et eveniet architecto. Voluptatibus ipsam omnis. Incidunt eum quis.	2	yes_interventional_radiology	Dolores aut rerum est.	undecided	Eveniet eum deserunt vel.	undecided	Modi necessitatibus fugit laudantium.	undecided	Nulla facilis qui quis.	undecided	Consequatur sit ut non.	undecided	Accusantium iste cum excepturi.	Non sed necessitatibus. Magni odio accusamus. Amet recusandae non.	Amet est quam. Aut mollitia aut. Eveniet nam vitae.	f	2025-05-16 15:37:35.429309	2025-05-16 15:37:35.429309
12	12	2025-05-06	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Amet et est. Voluptates aut maxime. Quia iure voluptatum.	no_prior_sarcoma_board	Id modi consectetur. Eligendi esse ut. Ad ea vero.	5	yes_interventional_radiology	Voluptatem sed est suscipit.	undecided	Rerum perspiciatis asperiores dolorum.	undecided	Quidem dolor ab consequatur.	undecided	Quis quo commodi fugiat.	undecided	Dolor a exercitationem impedit.	undecided	Cum eos voluptatem placeat.	Sed in molestiae. Omnis odio assumenda. Corporis consectetur et.	Maxime voluptas perferendis. Doloremque sint veritatis. Laboriosam adipisci delectus.	f	2025-05-16 15:37:35.44189	2025-05-16 15:37:35.44189
13	13	2025-05-06	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Autem est eum. Qui ipsam quis. Optio vero a.	no_prior_sarcoma_board	Recusandae quia illo. Atque rerum possimus. Accusantium recusandae sint.	5	yes_interventional_radiology	Non veniam iusto et.	undecided	Molestiae odio ipsum nostrum.	undecided	Unde dignissimos et natus.	undecided	Sunt optio possimus doloribus.	undecided	Quisquam omnis facilis fuga.	undecided	Sint voluptatem non et.	Eius error expedita. Non fugit eligendi. Accusantium rerum unde.	Voluptas expedita omnis. Architecto et non. Id perferendis ut.	f	2025-05-16 15:37:35.458808	2025-05-16 15:37:35.458808
14	14	2025-05-20	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Excepturi harum velit. Dignissimos minima impedit. Accusamus voluptas aut.	no_prior_sarcoma_board	Temporibus ut quo. Molestiae earum vitae. Et laborum iure.	4	yes_interventional_radiology	Iure rerum eum alias.	undecided	Amet quas porro numquam.	undecided	Eos et eius ea.	undecided	Adipisci suscipit sapiente consequuntur.	undecided	Et voluptatem quo numquam.	undecided	Animi accusamus ut earum.	Et quae quisquam. Dolorem labore a. Molestiae exercitationem itaque.	Ipsa ipsum veritatis. Voluptatem quia rerum. Eos doloremque ipsa.	f	2025-05-16 15:37:35.512904	2025-05-16 15:37:35.512904
15	15	2025-05-13	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Dolor esse voluptatem. Sapiente repudiandae qui. Soluta corrupti voluptatem.	no_prior_sarcoma_board	Amet aperiam enim. Ut voluptatem dignissimos. Qui atque maiores.	0	yes_interventional_radiology	Numquam cum temporibus quo.	undecided	Aspernatur enim quos cumque.	undecided	Dolorum suscipit repudiandae sed.	undecided	Voluptatum beatae nulla placeat.	undecided	Quasi sunt velit rem.	undecided	Voluptatum sed dolorem itaque.	Consequatur provident error. Animi aliquam similique. Dolores at excepturi.	Voluptas quia qui. Dolores occaecati cumque. Quas reiciendis est.	f	2025-05-16 15:37:35.543721	2025-05-16 15:37:35.543721
16	16	2025-05-13	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Reiciendis minima voluptas. Eos veritatis quis. Saepe sunt omnis.	no_prior_sarcoma_board	Necessitatibus qui autem. A consequatur maiores. Repellat iure omnis.	3	yes_interventional_radiology	Et incidunt esse voluptas.	undecided	Sunt maiores sit mollitia.	undecided	Est nihil provident ut.	undecided	Corrupti unde sed sunt.	undecided	Eum repellendus neque consequatur.	undecided	Debitis vitae quisquam fugit.	Aut ut eligendi. Vitae dolorem quia. Voluptatem quia harum.	Voluptatem dolores inventore. In ipsum sit. Magni iusto qui.	f	2025-05-16 15:37:35.609659	2025-05-16 15:37:35.609659
17	17	2025-04-22	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Modi molestiae dolorem. Enim quisquam cumque. Soluta a aut.	no_prior_sarcoma_board	Expedita magnam commodi. Autem id quas. Mollitia qui excepturi.	1	yes_interventional_radiology	Autem perspiciatis perferendis consequatur.	undecided	Facere hic rem ut.	undecided	Minima aut corporis facere.	undecided	Tenetur deserunt molestias dolore.	undecided	Blanditiis accusamus incidunt commodi.	undecided	Ipsum provident praesentium recusandae.	Beatae ut facilis. Ea vel quisquam. Expedita est maiores.	Perspiciatis voluptas quasi. Aut et porro. Eveniet et qui.	f	2025-05-16 15:37:35.630292	2025-05-16 15:37:35.630292
18	18	2025-04-29	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Temporibus dignissimos porro. Fugiat necessitatibus quis. Excepturi at eaque.	no_prior_sarcoma_board	Officia expedita ut. Fuga autem similique. Et et rem.	0	yes_interventional_radiology	Repellendus necessitatibus animi magni.	undecided	Assumenda consequatur fugit eum.	undecided	Aut magnam pariatur consequatur.	undecided	Omnis velit molestiae quod.	undecided	Labore atque tenetur enim.	undecided	Et dolor dolorem consequatur.	Neque maiores velit. Aliquid rerum porro. Neque provident iste.	Et numquam pariatur. Eaque soluta nesciunt. Perferendis est voluptatibus.	f	2025-05-16 15:37:35.648544	2025-05-16 15:37:35.648544
19	19	2025-05-06	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Sit quis velit. Tempore impedit est. Molestiae enim libero.	no_prior_sarcoma_board	Necessitatibus et incidunt. Hic eum reiciendis. Consequatur illo iusto.	3	yes_interventional_radiology	Possimus sunt eum fugiat.	undecided	Qui quasi velit fugiat.	undecided	Architecto eum rerum occaecati.	undecided	Culpa deserunt magnam incidunt.	undecided	Sunt harum quis qui.	undecided	Consequatur illo cumque qui.	Quis hic est. Eum molestiae earum. Est sunt at.	Repellendus eaque ducimus. Ratione nihil reprehenderit. Necessitatibus dolorem at.	f	2025-05-16 15:37:35.663372	2025-05-16 15:37:35.663372
20	20	2025-04-29	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Magnam voluptatibus quia. Amet nostrum odit. Error non ea.	no_prior_sarcoma_board	Omnis fuga blanditiis. Porro alias recusandae. Quo culpa rerum.	4	yes_interventional_radiology	Corporis quaerat molestiae sed.	undecided	Eveniet sunt sunt sed.	undecided	Ratione quia veritatis laboriosam.	undecided	Perspiciatis dolores est iste.	undecided	Cumque qui et nihil.	undecided	Molestiae temporibus beatae error.	Dolores praesentium eos. Et omnis dolorem. Dolorem magni aliquid.	Id mollitia doloremque. Eligendi illo provident. Mollitia nam numquam.	f	2025-05-16 15:37:35.703892	2025-05-16 15:37:35.703892
21	21	2025-04-29	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Natus in eos. Cupiditate deleniti ea. Quidem inventore est.	no_prior_sarcoma_board	Deleniti aut iure. Deleniti quia doloremque. Dolores in earum.	1	yes_interventional_radiology	Non optio nihil veritatis.	undecided	Esse exercitationem ullam voluptatum.	undecided	Fuga laboriosam sunt omnis.	undecided	Laudantium similique quasi consequatur.	undecided	Enim labore magni iste.	undecided	Quia vel nam et.	Rerum reiciendis rem. Odit perspiciatis fugiat. Neque possimus saepe.	Dolor doloremque ab. Dolores laborum fugiat. Ratione molestias voluptatem.	f	2025-05-16 15:37:35.716018	2025-05-16 15:37:35.716018
22	22	2025-05-13	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Est cupiditate quis. Officiis est autem. Qui voluptatem non.	no_prior_sarcoma_board	Nam at consequatur. Molestiae ducimus repellendus. Iste voluptatem sit.	0	yes_interventional_radiology	Provident sunt qui rerum.	undecided	Et officiis ea aut.	undecided	Laborum nisi cum illum.	undecided	Vero perferendis eum debitis.	undecided	Vel praesentium dolores earum.	undecided	Cupiditate nihil at exercitationem.	Adipisci qui alias. Rerum aut nesciunt. Porro omnis aut.	Quia odit optio. Consequatur exercitationem non. Amet quo dolor.	f	2025-05-16 15:37:35.728733	2025-05-16 15:37:35.728733
23	23	2025-05-06	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Fugit omnis eligendi. Nemo quos consequuntur. Error sed id.	no_prior_sarcoma_board	Aliquam repudiandae nulla. Repellat molestiae nobis. Aut blanditiis accusantium.	0	yes_interventional_radiology	Dicta id dolorem libero.	undecided	In accusantium voluptas rerum.	undecided	Nisi alias eum cupiditate.	undecided	Et est totam reiciendis.	undecided	Cum dolorem provident minus.	undecided	Vitae repellendus qui dolor.	Fugit quod neque. Labore ad sit. Occaecati voluptates libero.	Quo saepe sed. Vel exercitationem autem. Provident perferendis commodi.	f	2025-05-16 15:37:35.74138	2025-05-16 15:37:35.74138
24	24	2025-04-22	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Voluptatem numquam voluptate. Inventore deleniti neque. Atque sapiente dolores.	no_prior_sarcoma_board	Quo et et. Cum minus ea. Harum dolorem sed.	1	yes_interventional_radiology	Et quia molestias qui.	undecided	Culpa aliquid a labore.	undecided	Voluptas cum error veniam.	undecided	Quaerat exercitationem tenetur et.	undecided	Nulla nobis est facere.	undecided	Qui in saepe perspiciatis.	Cum sunt magnam. Voluptates autem reiciendis. Quidem odio ipsa.	Harum qui nobis. Aut et veniam. Rerum qui est.	f	2025-05-16 15:37:35.75716	2025-05-16 15:37:35.75716
25	25	2025-05-06	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Voluptatem harum accusamus. Excepturi et et. Ipsam est est.	no_prior_sarcoma_board	Rem consectetur aut. Sed libero impedit. Saepe id quae.	1	yes_interventional_radiology	Debitis ut et possimus.	undecided	Deserunt reiciendis voluptatem consequatur.	undecided	Aut et qui molestias.	undecided	Ea labore iste incidunt.	undecided	Ea eius praesentium quae.	undecided	Deserunt dicta explicabo odit.	Nam magni velit. Eius expedita pariatur. Tempora dolorem vitae.	Sit in libero. Dignissimos soluta sed. Magni exercitationem animi.	f	2025-05-16 15:37:35.769359	2025-05-16 15:37:35.769359
26	26	2025-04-22	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Vitae eum recusandae. Sunt molestiae alias. Non et omnis.	no_prior_sarcoma_board	Laborum dolores quas. Dolorem aut voluptatibus. Ea illum dolor.	3	yes_interventional_radiology	Illum quis aut vel.	undecided	Perferendis aliquam expedita voluptatem.	undecided	Rerum quod maxime aliquam.	undecided	Esse beatae iusto sunt.	undecided	Quaerat quo nesciunt consequatur.	undecided	Modi provident non animi.	Quas optio magni. Impedit ad enim. Enim debitis laborum.	Eos et excepturi. Iste et hic. Doloribus iusto rerum.	f	2025-05-16 15:37:35.781545	2025-05-16 15:37:35.781545
27	27	2025-05-13	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Blanditiis reiciendis voluptatem. Illo qui consectetur. Quam et eum.	no_prior_sarcoma_board	Doloribus facilis qui. Iusto officiis odio. Modi earum eveniet.	0	yes_interventional_radiology	In dolor aut earum.	undecided	Molestias laudantium libero est.	undecided	Porro nesciunt laborum ut.	undecided	Eum autem ullam eaque.	undecided	Eum minus provident accusamus.	undecided	Voluptas consectetur eligendi quis.	Autem nesciunt ipsa. Illum excepturi recusandae. Rerum alias nam.	Voluptatem eveniet qui. Praesentium fuga omnis. Autem incidunt labore.	f	2025-05-16 15:37:35.792505	2025-05-16 15:37:35.792505
28	28	2025-04-29	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Id illum debitis. Reprehenderit accusantium et. Modi expedita laborum.	no_prior_sarcoma_board	Nostrum nihil pariatur. Vero maiores aut. Vel odio sed.	0	yes_interventional_radiology	Delectus aut est et.	undecided	Officia eligendi rerum eveniet.	undecided	Asperiores odio ipsa non.	undecided	Amet in inventore aut.	undecided	Officiis cupiditate sint nam.	undecided	Velit praesentium et excepturi.	Vitae et quia. Quaerat placeat blanditiis. Earum nemo ratione.	Natus sit sint. Architecto dolorem dolor. Eos nulla voluptas.	f	2025-05-16 15:37:35.807279	2025-05-16 15:37:35.807279
29	29	2025-04-22	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Possimus minus quia. Est facere et. Quis qui distinctio.	no_prior_sarcoma_board	Debitis totam dolores. Illum ea inventore. Perferendis vitae eos.	1	yes_interventional_radiology	Vel fugiat atque nihil.	undecided	Voluptatem sit et non.	undecided	Unde cum molestiae et.	undecided	Qui tempore ab aperiam.	undecided	Autem fuga et aliquid.	undecided	Harum et at voluptas.	Accusamus ut eos. Dolorem sed non. Ipsam aut rem.	Aut odit rerum. Sed qui consequatur. Velit et recusandae.	f	2025-05-16 15:37:35.818418	2025-05-16 15:37:35.818418
30	30	2025-05-13	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Repellendus qui impedit. Ipsa perspiciatis excepturi. Explicabo ipsam blanditiis.	no_prior_sarcoma_board	Aut praesentium sit. Dolorum qui voluptatibus. Omnis culpa consequuntur.	5	yes_interventional_radiology	Quod est est ab.	undecided	Quasi voluptate in qui.	undecided	Modi voluptates ipsum omnis.	undecided	Placeat consectetur tempora ut.	undecided	Sint alias fuga nostrum.	undecided	Id voluptate possimus modi.	Quisquam non assumenda. Quia rem veritatis. Consequatur deserunt possimus.	Ea et similique. Ipsum quisquam ullam. Debitis et vel.	f	2025-05-16 15:37:35.829416	2025-05-16 15:37:35.829416
31	31	2025-04-29	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Ad vel eos. Illo rerum laudantium. Et explicabo minus.	no_prior_sarcoma_board	Et nobis nesciunt. Exercitationem nihil corrupti. Quibusdam rerum itaque.	2	yes_interventional_radiology	Quisquam occaecati veritatis voluptatibus.	undecided	Impedit quaerat iusto officia.	undecided	Voluptas qui eos similique.	undecided	Dolorem accusantium est est.	undecided	Neque est magni eveniet.	undecided	Blanditiis ut aliquam excepturi.	Corrupti ratione tenetur. Rerum est et. Aut sint eos.	Quas optio quod. Iure molestiae dolores. Dolorem accusamus reprehenderit.	f	2025-05-16 15:37:35.841235	2025-05-16 15:37:35.841235
32	32	2025-04-29	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Ut iste nam. Consequatur dolorum illum. Error quae quia.	no_prior_sarcoma_board	Quam repellat occaecati. Cumque placeat eligendi. Omnis culpa ad.	0	yes_interventional_radiology	Eveniet quis laudantium illo.	undecided	Laudantium esse et delectus.	undecided	Vitae sapiente ipsum sit.	undecided	Et quis ducimus ut.	undecided	Necessitatibus dolorem facere veniam.	undecided	A ea porro vitae.	At eos autem. Culpa aut cumque. Assumenda dolor ab.	Excepturi ratione consequatur. Optio quam qui. Temporibus dolorem eaque.	f	2025-05-16 15:37:35.851419	2025-05-16 15:37:35.851419
33	33	2025-05-06	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Odio omnis neque. Dolores tempora consectetur. Officia inventore tempore.	no_prior_sarcoma_board	Deleniti eos doloremque. Ducimus cumque sed. Dolorem aut quaerat.	3	yes_interventional_radiology	Id veritatis rem unde.	undecided	Dolore maxime corrupti quia.	undecided	Dolor earum dicta est.	undecided	Officia sit qui dolores.	undecided	Sint reprehenderit accusamus aut.	undecided	Blanditiis odit dolorem id.	Aut enim enim. Architecto rem nisi. Officia repellendus aut.	Doloribus repellendus culpa. Esse et porro. Ipsa adipisci voluptates.	f	2025-05-16 15:37:35.864527	2025-05-16 15:37:35.864527
34	34	2025-05-06	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Eaque quidem reprehenderit. Ut ad impedit. Magnam et perspiciatis.	no_prior_sarcoma_board	Aliquam atque reiciendis. Et exercitationem nisi. Vel optio sint.	0	yes_interventional_radiology	Ut rerum eos vitae.	undecided	Fuga dolorem quam animi.	undecided	Ea culpa quis sed.	undecided	Aperiam non expedita iusto.	undecided	Recusandae harum qui delectus.	undecided	Corporis et et qui.	Eos et repellendus. Nulla quaerat a. Ipsum aut excepturi.	Officia autem quos. Quis et non. Laboriosam voluptatem quam.	f	2025-05-16 15:37:35.87472	2025-05-16 15:37:35.87472
35	35	2025-05-13	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Provident blanditiis iure. Repellat eum ad. Id cumque dolor.	no_prior_sarcoma_board	Aut dolorem quia. Aut occaecati culpa. Qui reprehenderit ut.	0	yes_interventional_radiology	Voluptatem saepe quis modi.	undecided	Optio occaecati in et.	undecided	Quia laudantium eos hic.	undecided	Reprehenderit est soluta veniam.	undecided	Aut id distinctio necessitatibus.	undecided	Mollitia nisi at ea.	Exercitationem quibusdam officiis. Ut cum ipsum. Rerum voluptatibus et.	Ea ea debitis. Quisquam esse fuga. Et consequatur nobis.	f	2025-05-16 15:37:35.886218	2025-05-16 15:37:35.886218
36	36	2025-05-20	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Ducimus maiores et. Velit inventore repellendus. Nemo qui aperiam.	no_prior_sarcoma_board	Est delectus dicta. Qui aperiam et. Sint rem eaque.	2	yes_interventional_radiology	Reiciendis est officia atque.	undecided	Voluptas reiciendis enim minus.	undecided	Et minima sint optio.	undecided	Voluptas natus vel molestiae.	undecided	Voluptates et modi hic.	undecided	Vero atque et maiores.	Eius tempora molestiae. Et totam dignissimos. In assumenda reprehenderit.	Et enim laborum. Nesciunt non non. Quis eligendi quaerat.	f	2025-05-16 15:37:35.896737	2025-05-16 15:37:35.896737
37	37	2025-05-06	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Vel tempora odit. Quo est reprehenderit. Laudantium libero est.	no_prior_sarcoma_board	Et consectetur temporibus. Ea omnis enim. Quia excepturi delectus.	1	yes_interventional_radiology	In illo quae corporis.	undecided	Possimus aut iure omnis.	undecided	Corrupti delectus dolorem rerum.	undecided	Qui atque voluptas nulla.	undecided	Rerum dolor est voluptatum.	undecided	Nesciunt ipsum voluptas expedita.	A quia dolorum. Eius repudiandae voluptatem. Tempora atque incidunt.	Minus sed et. Accusamus placeat sed. Aspernatur sequi nostrum.	f	2025-05-16 15:37:35.907506	2025-05-16 15:37:35.907506
38	38	2025-05-20	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Minus doloribus dolores. Cumque sint voluptas. Magnam omnis aspernatur.	no_prior_sarcoma_board	Magnam fugiat dolorem. Provident ut eveniet. Quia voluptatem sed.	1	yes_interventional_radiology	Minus modi voluptas quasi.	undecided	Voluptates ea sint voluptatem.	undecided	Doloremque suscipit quae aliquid.	undecided	Quia incidunt atque numquam.	undecided	Quaerat beatae sit voluptatum.	undecided	Itaque et odit vitae.	Sapiente rerum minima. Ducimus eaque ad. Similique debitis quas.	Aut ea ducimus. Perspiciatis harum cupiditate. Vel commodi cumque.	f	2025-05-16 15:37:35.91919	2025-05-16 15:37:35.91919
39	39	2025-05-06	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Quis quo voluptates. Est atque recusandae. Esse quis nihil.	no_prior_sarcoma_board	Exercitationem earum et. Officia blanditiis id. Ratione a vitae.	5	yes_interventional_radiology	Magni consectetur atque exercitationem.	undecided	At non repellat impedit.	undecided	Quia occaecati neque illum.	undecided	Mollitia corporis cupiditate similique.	undecided	Eaque et maxime nihil.	undecided	Quod possimus quas maxime.	Temporibus nihil inventore. Alias deserunt delectus. Incidunt cumque deserunt.	Rerum possimus tempora. Id eos illum. Perspiciatis voluptates enim.	f	2025-05-16 15:37:35.929946	2025-05-16 15:37:35.929946
40	40	2025-05-20	follow_up	\N	\N	\N	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Similique iusto tenetur. Sint est voluptas. Magnam omnis quo.	no_prior_sarcoma_board	Nostrum voluptates fugit. Ducimus cum placeat. Est quibusdam dolorem.	4	yes_interventional_radiology	Repudiandae laudantium aut officia.	undecided	Ea amet commodi ut.	undecided	Aut doloribus iusto quia.	undecided	Delectus dolorum iste vero.	undecided	Vel qui consequatur numquam.	undecided	Doloremque illum quia beatae.	Quod enim est. Qui sequi repudiandae. Cupiditate quo et.	Tenetur numquam rem. Aliquam eveniet aut. Et asperiores repellat.	f	2025-05-16 15:37:35.94457	2025-05-16 15:37:35.94457
41	1	2010-06-01	unplanned_excision	\N	2025-05-16	eoc	\N	\N	\N		\N		0	\N		\N		\N		\N		\N		\N				f	2025-05-16 15:39:20.791147	2025-05-16 15:39:20.791147
1	1	2025-04-22	unplanned_excision	\N	2025-03-19	eoc	completed_therapy_for_primary_tumor	systemic_therapy	first_systemic_recurrence	Voluptate beatae et. In ipsa tempore. Qui quia aut.	no_prior_sarcoma_board	Rerum eius tempora. Temporibus eum amet. Dolorem vel facere.	0	yes_interventional_radiology	Molestiae non nihil perferendis.	undecided	Quos amet nihil doloribus.	undecided	Repellat eum cupiditate incidunt.	undecided	Sequi consectetur placeat reprehenderit.	undecided	Sapiente autem quo dolore.	undecided	Autem placeat accusantium non.	Dolorum reprehenderit quaerat. Animi possimus vero. Soluta quia omnis.	Earum omnis cum. Reprehenderit similique adipisci. Repudiandae eligendi suscipit.	f	2025-05-16 15:37:35.247161	2025-05-19 15:42:29.466271
\.


--
-- Data for Name: croms_surgeries; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.croms_surgeries (id, patient_id, surgery_date, institution_name, indication, surgery_side, greatest_surgical_tumor_dimension_in_mm, had_tumor_spillage, first_revision_details, second_revision_details, anatomic_region, resection, reconstruction, amputation, resected_tumor_margin, participated_disciplines, created_at, updated_at, hemipelvectomy) FROM stdin;
1	2	2025-05-21	kantonsspital_aarau	\N	\N	\N	f			bone_b1_1_face	not_applicable	not_applicable	not_applicable	\N	{}	2025-05-28 13:18:32.409373	2025-05-28 13:19:10.61058	{}
\.


--
-- Data for Name: croms_systemic_therapies; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.croms_systemic_therapies (id, patient_id, reason, treatment_line, cycles_planned, bone_protocol, softtissue_protocol, institution_name, cycle_start_date, cycle_end_date, discontinuation_reason, was_rct_concomittant, comments, clinical_trial_inclusion, hyperthermia_status, created_at, updated_at) FROM stdin;
1	1	curative_intent_neoadjuvant	2	three	euramos	cws	kantonsspital_aarau	2025-06-02	2025-06-18	\N	f		\N	no	2025-06-05 16:18:56.221147	2025-06-05 16:20:02.820644
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.schema_migrations (version) FROM stdin;
20250409072836
20250409072821
20250409072811
20250428095218
20250502121650
20250506142454
20250512163409
20250513081150
20250519100837
20250520134650
20250520134651
20250526084832
20250527085749
20250527163434
20250602151737
20250528141936
20250603085734
\.


--
-- Data for Name: solid_cable_messages; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.solid_cable_messages (id, channel, payload, created_at, channel_hash) FROM stdin;
\.


--
-- Data for Name: solid_cache_entries; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.solid_cache_entries (id, key, value, created_at, key_hash, byte_size) FROM stdin;
\.


--
-- Data for Name: solid_queue_blocked_executions; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.solid_queue_blocked_executions (id, job_id, queue_name, priority, concurrency_key, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: solid_queue_claimed_executions; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.solid_queue_claimed_executions (id, job_id, process_id, created_at) FROM stdin;
\.


--
-- Data for Name: solid_queue_failed_executions; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.solid_queue_failed_executions (id, job_id, error, created_at) FROM stdin;
\.


--
-- Data for Name: solid_queue_jobs; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.solid_queue_jobs (id, queue_name, class_name, arguments, priority, active_job_id, scheduled_at, finished_at, concurrency_key, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: solid_queue_pauses; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.solid_queue_pauses (id, queue_name, created_at) FROM stdin;
\.


--
-- Data for Name: solid_queue_processes; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.solid_queue_processes (id, kind, last_heartbeat_at, supervisor_id, pid, hostname, metadata, created_at, name) FROM stdin;
\.


--
-- Data for Name: solid_queue_ready_executions; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.solid_queue_ready_executions (id, job_id, queue_name, priority, created_at) FROM stdin;
\.


--
-- Data for Name: solid_queue_recurring_executions; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.solid_queue_recurring_executions (id, job_id, task_key, run_at, created_at) FROM stdin;
\.


--
-- Data for Name: solid_queue_recurring_tasks; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.solid_queue_recurring_tasks (id, key, schedule, command, class_name, arguments, queue_name, priority, static, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: solid_queue_scheduled_executions; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.solid_queue_scheduled_executions (id, job_id, queue_name, priority, scheduled_at, created_at) FROM stdin;
\.


--
-- Data for Name: solid_queue_semaphores; Type: TABLE DATA; Schema: public; Owner: dbadmin
--

COPY public.solid_queue_semaphores (id, key, value, expires_at, created_at, updated_at) FROM stdin;
\.


--
-- Name: croms_diagnoses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.croms_diagnoses_id_seq', 40, true);


--
-- Name: croms_hyperthermia_therapies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.croms_hyperthermia_therapies_id_seq', 1, true);


--
-- Name: croms_pathologies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.croms_pathologies_id_seq', 1, true);


--
-- Name: croms_patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.croms_patients_id_seq', 40, true);


--
-- Name: croms_radiology_exams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.croms_radiology_exams_id_seq', 1, false);


--
-- Name: croms_radiology_therapies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.croms_radiology_therapies_id_seq', 1, false);


--
-- Name: croms_sarcoma_boards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.croms_sarcoma_boards_id_seq', 41, true);


--
-- Name: croms_surgeries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.croms_surgeries_id_seq', 1, true);


--
-- Name: croms_systemic_therapies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.croms_systemic_therapies_id_seq', 1, true);


--
-- Name: solid_cable_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.solid_cable_messages_id_seq', 1, false);


--
-- Name: solid_cache_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.solid_cache_entries_id_seq', 1, false);


--
-- Name: solid_queue_blocked_executions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.solid_queue_blocked_executions_id_seq', 1, false);


--
-- Name: solid_queue_claimed_executions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.solid_queue_claimed_executions_id_seq', 1, false);


--
-- Name: solid_queue_failed_executions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.solid_queue_failed_executions_id_seq', 1, false);


--
-- Name: solid_queue_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.solid_queue_jobs_id_seq', 1, false);


--
-- Name: solid_queue_pauses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.solid_queue_pauses_id_seq', 1, false);


--
-- Name: solid_queue_processes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.solid_queue_processes_id_seq', 1, false);


--
-- Name: solid_queue_ready_executions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.solid_queue_ready_executions_id_seq', 1, false);


--
-- Name: solid_queue_recurring_executions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.solid_queue_recurring_executions_id_seq', 1, false);


--
-- Name: solid_queue_recurring_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.solid_queue_recurring_tasks_id_seq', 1, false);


--
-- Name: solid_queue_scheduled_executions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.solid_queue_scheduled_executions_id_seq', 1, false);


--
-- Name: solid_queue_semaphores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbadmin
--

SELECT pg_catalog.setval('public.solid_queue_semaphores_id_seq', 1, false);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: croms_diagnoses croms_diagnoses_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_diagnoses
    ADD CONSTRAINT croms_diagnoses_pkey PRIMARY KEY (id);


--
-- Name: croms_hyperthermia_therapies croms_hyperthermia_therapies_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_hyperthermia_therapies
    ADD CONSTRAINT croms_hyperthermia_therapies_pkey PRIMARY KEY (id);


--
-- Name: croms_pathologies croms_pathologies_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_pathologies
    ADD CONSTRAINT croms_pathologies_pkey PRIMARY KEY (id);


--
-- Name: croms_patients croms_patients_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_patients
    ADD CONSTRAINT croms_patients_pkey PRIMARY KEY (id);


--
-- Name: croms_radiology_exams croms_radiology_exams_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_radiology_exams
    ADD CONSTRAINT croms_radiology_exams_pkey PRIMARY KEY (id);


--
-- Name: croms_radiology_therapies croms_radiology_therapies_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_radiology_therapies
    ADD CONSTRAINT croms_radiology_therapies_pkey PRIMARY KEY (id);


--
-- Name: croms_sarcoma_boards croms_sarcoma_boards_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_sarcoma_boards
    ADD CONSTRAINT croms_sarcoma_boards_pkey PRIMARY KEY (id);


--
-- Name: croms_surgeries croms_surgeries_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_surgeries
    ADD CONSTRAINT croms_surgeries_pkey PRIMARY KEY (id);


--
-- Name: croms_systemic_therapies croms_systemic_therapies_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_systemic_therapies
    ADD CONSTRAINT croms_systemic_therapies_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: solid_cable_messages solid_cable_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_cable_messages
    ADD CONSTRAINT solid_cable_messages_pkey PRIMARY KEY (id);


--
-- Name: solid_cache_entries solid_cache_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_cache_entries
    ADD CONSTRAINT solid_cache_entries_pkey PRIMARY KEY (id);


--
-- Name: solid_queue_blocked_executions solid_queue_blocked_executions_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_blocked_executions
    ADD CONSTRAINT solid_queue_blocked_executions_pkey PRIMARY KEY (id);


--
-- Name: solid_queue_claimed_executions solid_queue_claimed_executions_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_claimed_executions
    ADD CONSTRAINT solid_queue_claimed_executions_pkey PRIMARY KEY (id);


--
-- Name: solid_queue_failed_executions solid_queue_failed_executions_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_failed_executions
    ADD CONSTRAINT solid_queue_failed_executions_pkey PRIMARY KEY (id);


--
-- Name: solid_queue_jobs solid_queue_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_jobs
    ADD CONSTRAINT solid_queue_jobs_pkey PRIMARY KEY (id);


--
-- Name: solid_queue_pauses solid_queue_pauses_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_pauses
    ADD CONSTRAINT solid_queue_pauses_pkey PRIMARY KEY (id);


--
-- Name: solid_queue_processes solid_queue_processes_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_processes
    ADD CONSTRAINT solid_queue_processes_pkey PRIMARY KEY (id);


--
-- Name: solid_queue_ready_executions solid_queue_ready_executions_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_ready_executions
    ADD CONSTRAINT solid_queue_ready_executions_pkey PRIMARY KEY (id);


--
-- Name: solid_queue_recurring_executions solid_queue_recurring_executions_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_recurring_executions
    ADD CONSTRAINT solid_queue_recurring_executions_pkey PRIMARY KEY (id);


--
-- Name: solid_queue_recurring_tasks solid_queue_recurring_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_recurring_tasks
    ADD CONSTRAINT solid_queue_recurring_tasks_pkey PRIMARY KEY (id);


--
-- Name: solid_queue_scheduled_executions solid_queue_scheduled_executions_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_scheduled_executions
    ADD CONSTRAINT solid_queue_scheduled_executions_pkey PRIMARY KEY (id);


--
-- Name: solid_queue_semaphores solid_queue_semaphores_pkey; Type: CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_semaphores
    ADD CONSTRAINT solid_queue_semaphores_pkey PRIMARY KEY (id);


--
-- Name: index_croms_diagnoses_on_patient_id; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_croms_diagnoses_on_patient_id ON public.croms_diagnoses USING btree (patient_id);


--
-- Name: index_croms_hyperthermia_therapies_on_therapy; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_croms_hyperthermia_therapies_on_therapy ON public.croms_hyperthermia_therapies USING btree (therapy_type, therapy_id);


--
-- Name: index_croms_pathologies_on_patient_id; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_croms_pathologies_on_patient_id ON public.croms_pathologies USING btree (patient_id);


--
-- Name: index_croms_patients_on_ahv; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE UNIQUE INDEX index_croms_patients_on_ahv ON public.croms_patients USING btree (ahv);


--
-- Name: index_croms_patients_on_external_code; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE UNIQUE INDEX index_croms_patients_on_external_code ON public.croms_patients USING btree (external_code);


--
-- Name: index_croms_radiology_exams_on_patient_id; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_croms_radiology_exams_on_patient_id ON public.croms_radiology_exams USING btree (patient_id);


--
-- Name: index_croms_radiology_therapies_on_patient_id; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_croms_radiology_therapies_on_patient_id ON public.croms_radiology_therapies USING btree (patient_id);


--
-- Name: index_croms_sarcoma_boards_on_patient_id; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_croms_sarcoma_boards_on_patient_id ON public.croms_sarcoma_boards USING btree (patient_id);


--
-- Name: index_croms_surgeries_on_patient_id; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_croms_surgeries_on_patient_id ON public.croms_surgeries USING btree (patient_id);


--
-- Name: index_croms_systemic_therapies_on_patient_id; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_croms_systemic_therapies_on_patient_id ON public.croms_systemic_therapies USING btree (patient_id);


--
-- Name: index_solid_cable_messages_on_channel; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_cable_messages_on_channel ON public.solid_cable_messages USING btree (channel);


--
-- Name: index_solid_cable_messages_on_channel_hash; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_cable_messages_on_channel_hash ON public.solid_cable_messages USING btree (channel_hash);


--
-- Name: index_solid_cable_messages_on_created_at; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_cable_messages_on_created_at ON public.solid_cable_messages USING btree (created_at);


--
-- Name: index_solid_cache_entries_on_byte_size; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_cache_entries_on_byte_size ON public.solid_cache_entries USING btree (byte_size);


--
-- Name: index_solid_cache_entries_on_key_hash; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE UNIQUE INDEX index_solid_cache_entries_on_key_hash ON public.solid_cache_entries USING btree (key_hash);


--
-- Name: index_solid_cache_entries_on_key_hash_and_byte_size; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_cache_entries_on_key_hash_and_byte_size ON public.solid_cache_entries USING btree (key_hash, byte_size);


--
-- Name: index_solid_queue_blocked_executions_for_maintenance; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_queue_blocked_executions_for_maintenance ON public.solid_queue_blocked_executions USING btree (expires_at, concurrency_key);


--
-- Name: index_solid_queue_blocked_executions_for_release; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_queue_blocked_executions_for_release ON public.solid_queue_blocked_executions USING btree (concurrency_key, priority, job_id);


--
-- Name: index_solid_queue_blocked_executions_on_job_id; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE UNIQUE INDEX index_solid_queue_blocked_executions_on_job_id ON public.solid_queue_blocked_executions USING btree (job_id);


--
-- Name: index_solid_queue_claimed_executions_on_job_id; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE UNIQUE INDEX index_solid_queue_claimed_executions_on_job_id ON public.solid_queue_claimed_executions USING btree (job_id);


--
-- Name: index_solid_queue_claimed_executions_on_process_id_and_job_id; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_queue_claimed_executions_on_process_id_and_job_id ON public.solid_queue_claimed_executions USING btree (process_id, job_id);


--
-- Name: index_solid_queue_dispatch_all; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_queue_dispatch_all ON public.solid_queue_scheduled_executions USING btree (scheduled_at, priority, job_id);


--
-- Name: index_solid_queue_failed_executions_on_job_id; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE UNIQUE INDEX index_solid_queue_failed_executions_on_job_id ON public.solid_queue_failed_executions USING btree (job_id);


--
-- Name: index_solid_queue_jobs_for_alerting; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_queue_jobs_for_alerting ON public.solid_queue_jobs USING btree (scheduled_at, finished_at);


--
-- Name: index_solid_queue_jobs_for_filtering; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_queue_jobs_for_filtering ON public.solid_queue_jobs USING btree (queue_name, finished_at);


--
-- Name: index_solid_queue_jobs_on_active_job_id; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_queue_jobs_on_active_job_id ON public.solid_queue_jobs USING btree (active_job_id);


--
-- Name: index_solid_queue_jobs_on_class_name; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_queue_jobs_on_class_name ON public.solid_queue_jobs USING btree (class_name);


--
-- Name: index_solid_queue_jobs_on_finished_at; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_queue_jobs_on_finished_at ON public.solid_queue_jobs USING btree (finished_at);


--
-- Name: index_solid_queue_pauses_on_queue_name; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE UNIQUE INDEX index_solid_queue_pauses_on_queue_name ON public.solid_queue_pauses USING btree (queue_name);


--
-- Name: index_solid_queue_poll_all; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_queue_poll_all ON public.solid_queue_ready_executions USING btree (priority, job_id);


--
-- Name: index_solid_queue_poll_by_queue; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_queue_poll_by_queue ON public.solid_queue_ready_executions USING btree (queue_name, priority, job_id);


--
-- Name: index_solid_queue_processes_on_last_heartbeat_at; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_queue_processes_on_last_heartbeat_at ON public.solid_queue_processes USING btree (last_heartbeat_at);


--
-- Name: index_solid_queue_processes_on_name_and_supervisor_id; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE UNIQUE INDEX index_solid_queue_processes_on_name_and_supervisor_id ON public.solid_queue_processes USING btree (name, supervisor_id);


--
-- Name: index_solid_queue_processes_on_supervisor_id; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_queue_processes_on_supervisor_id ON public.solid_queue_processes USING btree (supervisor_id);


--
-- Name: index_solid_queue_ready_executions_on_job_id; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE UNIQUE INDEX index_solid_queue_ready_executions_on_job_id ON public.solid_queue_ready_executions USING btree (job_id);


--
-- Name: index_solid_queue_recurring_executions_on_job_id; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE UNIQUE INDEX index_solid_queue_recurring_executions_on_job_id ON public.solid_queue_recurring_executions USING btree (job_id);


--
-- Name: index_solid_queue_recurring_executions_on_task_key_and_run_at; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE UNIQUE INDEX index_solid_queue_recurring_executions_on_task_key_and_run_at ON public.solid_queue_recurring_executions USING btree (task_key, run_at);


--
-- Name: index_solid_queue_recurring_tasks_on_key; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE UNIQUE INDEX index_solid_queue_recurring_tasks_on_key ON public.solid_queue_recurring_tasks USING btree (key);


--
-- Name: index_solid_queue_recurring_tasks_on_static; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_queue_recurring_tasks_on_static ON public.solid_queue_recurring_tasks USING btree (static);


--
-- Name: index_solid_queue_scheduled_executions_on_job_id; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE UNIQUE INDEX index_solid_queue_scheduled_executions_on_job_id ON public.solid_queue_scheduled_executions USING btree (job_id);


--
-- Name: index_solid_queue_semaphores_on_expires_at; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_queue_semaphores_on_expires_at ON public.solid_queue_semaphores USING btree (expires_at);


--
-- Name: index_solid_queue_semaphores_on_key; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE UNIQUE INDEX index_solid_queue_semaphores_on_key ON public.solid_queue_semaphores USING btree (key);


--
-- Name: index_solid_queue_semaphores_on_key_and_value; Type: INDEX; Schema: public; Owner: dbadmin
--

CREATE INDEX index_solid_queue_semaphores_on_key_and_value ON public.solid_queue_semaphores USING btree (key, value);


--
-- Name: croms_sarcoma_boards fk_rails_117187593f; Type: FK CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_sarcoma_boards
    ADD CONSTRAINT fk_rails_117187593f FOREIGN KEY (patient_id) REFERENCES public.croms_patients(id);


--
-- Name: croms_systemic_therapies fk_rails_2120927d8c; Type: FK CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_systemic_therapies
    ADD CONSTRAINT fk_rails_2120927d8c FOREIGN KEY (patient_id) REFERENCES public.croms_patients(id);


--
-- Name: solid_queue_recurring_executions fk_rails_318a5533ed; Type: FK CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_recurring_executions
    ADD CONSTRAINT fk_rails_318a5533ed FOREIGN KEY (job_id) REFERENCES public.solid_queue_jobs(id) ON DELETE CASCADE;


--
-- Name: croms_radiology_therapies fk_rails_340a1aa135; Type: FK CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_radiology_therapies
    ADD CONSTRAINT fk_rails_340a1aa135 FOREIGN KEY (patient_id) REFERENCES public.croms_patients(id);


--
-- Name: solid_queue_failed_executions fk_rails_39bbc7a631; Type: FK CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_failed_executions
    ADD CONSTRAINT fk_rails_39bbc7a631 FOREIGN KEY (job_id) REFERENCES public.solid_queue_jobs(id) ON DELETE CASCADE;


--
-- Name: croms_diagnoses fk_rails_3b04cdf008; Type: FK CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_diagnoses
    ADD CONSTRAINT fk_rails_3b04cdf008 FOREIGN KEY (patient_id) REFERENCES public.croms_patients(id);


--
-- Name: solid_queue_blocked_executions fk_rails_4cd34e2228; Type: FK CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_blocked_executions
    ADD CONSTRAINT fk_rails_4cd34e2228 FOREIGN KEY (job_id) REFERENCES public.solid_queue_jobs(id) ON DELETE CASCADE;


--
-- Name: solid_queue_ready_executions fk_rails_81fcbd66af; Type: FK CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_ready_executions
    ADD CONSTRAINT fk_rails_81fcbd66af FOREIGN KEY (job_id) REFERENCES public.solid_queue_jobs(id) ON DELETE CASCADE;


--
-- Name: croms_radiology_exams fk_rails_9434b8d6b0; Type: FK CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_radiology_exams
    ADD CONSTRAINT fk_rails_9434b8d6b0 FOREIGN KEY (patient_id) REFERENCES public.croms_patients(id);


--
-- Name: solid_queue_claimed_executions fk_rails_9cfe4d4944; Type: FK CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_claimed_executions
    ADD CONSTRAINT fk_rails_9cfe4d4944 FOREIGN KEY (job_id) REFERENCES public.solid_queue_jobs(id) ON DELETE CASCADE;


--
-- Name: solid_queue_scheduled_executions fk_rails_c4316f352d; Type: FK CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.solid_queue_scheduled_executions
    ADD CONSTRAINT fk_rails_c4316f352d FOREIGN KEY (job_id) REFERENCES public.solid_queue_jobs(id) ON DELETE CASCADE;


--
-- Name: croms_surgeries fk_rails_cfe4a2de9a; Type: FK CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_surgeries
    ADD CONSTRAINT fk_rails_cfe4a2de9a FOREIGN KEY (patient_id) REFERENCES public.croms_patients(id);


--
-- Name: croms_pathologies fk_rails_f2a15c31e0; Type: FK CONSTRAINT; Schema: public; Owner: dbadmin
--

ALTER TABLE ONLY public.croms_pathologies
    ADD CONSTRAINT fk_rails_f2a15c31e0 FOREIGN KEY (patient_id) REFERENCES public.croms_patients(id);


--
-- PostgreSQL database dump complete
--

