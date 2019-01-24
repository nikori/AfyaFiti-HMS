
CREATE OR REPLACE VIEW cds.v_billing AS
 SELECT b.b_billing_id,
    b.c_patient_id,
    b.c_facility_id,
    ( SELECT (c_patient.firstname::text || ' '::text) || c_patient.lastname::text
           FROM c_patient
          WHERE c_patient.c_patient_id = b.c_patient_id) AS lastname,

    ( SELECT (c_patient.code::text || ' '::text) FROM c_patient
          WHERE c_patient.c_patient_id = b.c_patient_id) AS patient_code,

    v.visitno,
    ( SELECT sum(b_billingline.amount) AS sum
           FROM b_billingline
          WHERE b_billingline.b_billing_id = b.b_billing_id) AS amount,
    b.ispayed,
    b.documentno,
    b.created,
    v.p_visit_id,
    v.visitdate,
    v.c_node_id,
   FROM b_billing b
     LEFT JOIN p_visit v ON v.p_visit_id = b.p_visit_id
     LEFT JOIN c_patient p ON p.c_patient_id = b.c_patient_id
  WHERE v.visitdate::date > ('now'::text::date - '7 days'::interval day) AND v.visitdate::date < ('now'::text::date + 1) AND v.c_node_id <> 0::numeric;

ALTER TABLE cds.v_billing
    OWNER TO cds;


    48400-00100
    2162356687
    our NETELLER secure ID:  
257046



















-- View: cds.v_prescription

-- DROP VIEW cds.v_prescription;

CREATE OR REPLACE VIEW cds.v_prescription AS
 SELECT s.name AS pharmacy_name,
    s.m_store_id,
    v.visitno,
    v.p_visit_id,
    concat(p.firstname, ' ', p.middlename, ' ', p.lastname) AS patientname,
    pr.name AS productname,
    d.name AS dosage,
    pre.quantity AS dispenseqty,
    pre.isdispensed AS dispensed,
    ( SELECT m_storage.onhandqty
           FROM cds.m_storage
          WHERE m_storage.m_store_id = pre.m_store_id::numeric AND m_storage.batchno::text = pre.batchno::text AND m_storage.m_product_id = pre.m_product_id) AS onhandqty,
    u.name AS lastupdatedby,
    pre.updated AS updatedon,
    pre.p_prescription_id AS prescriptionid,
    pre.p_visit_id AS visitid,
    pre.c_patient_id AS patientid,
    pre.p_medicalnote_id,
    pre.c_dosage_id,
    pre.m_product_id,
    pre.created,
    pl.selling_price AS unitprice,
    pre.ispaid,
    v.c_node_id,
    pre.dosage AS drug_dosage,
   FROM cds.p_prescription pre
     LEFT JOIN cds.p_medicalnote mn ON mn.p_medicalnote_id = pre.p_medicalnote_id
     LEFT JOIN cds.p_visit v ON v.p_visit_id = COALESCE(pre.p_visit_id, mn.p_visit_id)
     LEFT JOIN cds.m_store s ON s.m_store_id = pre.m_store_id
     LEFT JOIN cds.c_patient p ON p.c_patient_id = v.c_patient_id
     LEFT JOIN cds.m_product pr ON pr.m_product_id = pre.m_product_id
     LEFT JOIN cds.c_dosage d ON d.c_dosage_id = pre.c_dosage_id
     LEFT JOIN cds.c_user u ON u.c_user_id = pre.prescriber_id
     LEFT JOIN cds.b_price_list pl ON pl.m_product_id = pre.m_product_id
  ORDER BY pre.created;











after payment change nodeid to 16





CREATE TABLE cds.p_lab_referrals
(
    id bigserial NOT NULL,
    p_visit_id integer NOT NULL,
    c_patient_id integer NOT NULL,
    m_productgroup integer NOT NULL,
  m_product_id integer NOT NULL,
  createdby bigint NOT NULL,
  updatedby bigint NOT NULL,
  c_facility_id bigint NOT NULL,
    test_notes character varying(200) COLLATE pg_catalog."default" NOT NULL,
    ispaid boolean,
    group_name character varying(200) COLLATE pg_catalog."default",
    CONSTRAINT p_lab_referrals_pkey PRIMARY KEY (id)
)




-- DROP VIEW cds.v_labpayment;
-- View: cds.v_labpayment

-- DROP VIEW cds.v_labpayment;

CREATE OR REPLACE VIEW cds.v_labpayment AS
 SELECT c.c_patient_id AS patient_id,
    c.firstname,
    c.lastname,
    m.m_productgroup_id AS productgroup_id,
    m.name AS product_name,
    m.code AS product_code,
    m.m_product_id AS product_id,
    b.selling_price AS amount,
    v.c_node_id,
    v.p_visit_id,
    t.id,
    t.ispaid,
  v.visitno,
  v.visitdate,
  c.code AS patientcode
   FROM cds.p_lab_referrals t
     LEFT JOIN cds.c_patient c ON c.c_patient_id = t.c_patient_id
     LEFT JOIN cds.p_visit v ON v.p_visit_id = t.p_visit_id
     LEFT JOIN cds.m_product m ON m.m_productgroup_id = t.m_productgroup
     JOIN cds.b_price_list b ON b.m_product_id = m.m_product_id
  WHERE v.c_node_id = 4::numeric AND v.visitdate > ('now'::text::date - '7 days'::interval day) AND v.visitdate < ('now'::text::date + 1) AND v.c_node_id <> 0::numeric;

ALTER TABLE cds.v_labpayment
    OWNER TO postgres;







CREATE OR REPLACE VIEW cds.v_radiologypayment AS
 SELECT c.c_patient_id AS patient_id,
    c.firstname,
    c.lastname,
    m.m_product_id AS productgroup_id,
    m.name AS product_name,
    m.code AS product_code,
    m.m_product_id AS product_id,
    b.selling_price AS amount,
    v.c_node_id,
    v.p_visit_id,
    t.id,
    t.ispaid
   FROM cds.p_radiology_referrals t
     LEFT JOIN cds.c_patient c ON c.c_patient_id = t.c_patient_id
     LEFT JOIN cds.p_visit v ON v.p_visit_id = t.p_visit_id
     LEFT JOIN cds.m_product m ON m.m_product_id = t.m_product_id
     JOIN cds.b_price_list b ON b.m_product_id = m.m_product_id
  WHERE v.c_node_id = 17::numeric AND v.visitdate > ('now'::text::date - '7 days'::interval day) AND v.visitdate < ('now'::text::date + 1) AND v.c_node_id <> 0::numeric;

ALTER TABLE cds.v_radiologypayment
    OWNER TO postgres;




-- View: cds.v_billing

-- DROP VIEW cds.v_billing;

CREATE OR REPLACE VIEW cds.v_billing AS
 SELECT b.b_billing_id,
    b.c_patient_id,
    b.c_facility_id,
    ( SELECT (c_patient.firstname::text || ' '::text) || c_patient.lastname::text
           FROM cds.c_patient
          WHERE c_patient.c_patient_id = b.c_patient_id) AS lastname,
    v.visitno,
    ( SELECT sum(b_billingline.amount) AS sum
           FROM cds.b_billingline
          WHERE b_billingline.b_billing_id = b.b_billing_id) AS amount,
    b.ispayed,
    b.documentno,
    b.created,
    v.p_visit_id,
    to_char(v.visitdate::timestamp with time zone, 'YYYY-MM-DD'::text) AS visitdate,
    v.c_node_id,
  p.code,
  p.account_id
  
   FROM cds.b_billing b
     LEFT JOIN cds.p_visit v ON v.p_visit_id = b.p_visit_id
     LEFT JOIN cds.c_patient p ON p.c_patient_id = b.c_patient_id
  WHERE v.visitdate > ('now'::text::date - '7 days'::interval day) AND v.visitdate < ('now'::text::date + 1) AND v.c_node_id <> 0::numeric;

ALTER TABLE cds.v_billing
    OWNER TO postgres;






CREATE OR REPLACE VIEW cds.v_historical_payments AS
 SELECT bf.b_financepayments_id,
    bf.c_patient_id,
    bf.m_product_id,
    bf.b_paymode_id,
    bf.p_visit_id,
    bf.c_node_id,
    bf.date_paid,
    bf.served_by,
    bf.amount_to_be_paid,
    bf.amount_paid,
    bf.balance,
    mp.name as productname,
    pv.visitno,
    concat(cp.firstname, ' ', cp.middlename, ' ', cp.lastname) AS patientname,
    cp.code as patientcode,
    bp.name AS paymode,
    cn.name AS nodename,
    cn.description AS nodedescription   
    
   FROM cds.b_financepayments bf
     LEFT JOIN cds.c_patient cp ON cp.c_patient_id = bf.c_patient_id
     LEFT JOIN cds.p_visit pv ON pv.p_visit_id = bf.p_visit_id
     LEFT JOIN cds.b_paymode bp ON bp.b_paymode_id = bf.b_paymode_id
     LEFT JOIN cds.m_product mp ON mp.m_product_id = bf.m_product_id
     LEFT JOIN cds.c_node cn ON cn.c_node_id = bf.c_node_id;


