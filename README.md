# AI PRO HMS

AI PRO Hospital Management System — a staff-friendly hospital platform designed for OPD, IPD, pharmacy, laboratory, billing and patient communication.

## Product direction

AI PRO is designed around a simple workflow:

**Patient → Consultation → Orders → Pharmacy/Lab → Billing → Follow-up → WhatsApp**

The pharmacy module includes the planned **AI Invoice → Stock** workflow:

**Supplier bill photo/PDF → OCR/AI extraction → medicine matching → staff verification → batch/expiry stock update**

Stock is never posted silently by OCR; a staff confirmation step is required.

## Planned modules

- Reception & patient registration
- OPD appointments, tokens and consultation
- Doctor EMR and prescriptions
- IPD admissions, beds, nursing and discharge
- Pharmacy, purchases, batch stock and expiry tracking
- Laboratory orders, samples and reports
- Billing, GST and payments
- WhatsApp patient communication
- AI PRO patient assistant
- Management dashboard and reports
- Role-based access and audit trail
- Telugu + English UI

## Architecture

The project starts with a lightweight modern web UI so it can run comfortably on ordinary Windows hospital computers. The integration layer is designed to connect with open-source hospital systems such as Bahmni/OpenMRS rather than replacing mature clinical infrastructure unnecessarily.

## Development status

Phase 1 foundation is being built in this repository. Clinical workflows must be validated by qualified hospital staff before production use.

## Local development

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.
