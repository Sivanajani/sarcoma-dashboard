import type { Patient } from '../types/PatientData';

export const mockPatients: Patient[] = [
  {
    patient_id: 'P001',
    sex: 'female',
    birth_date: '1980-04-22',
    insurance_name: 'CSS',
    diagnosis: {
      main_referral_diagnosis: 'Osteosarkom',
      cancer_syndrome: 'Li-Fraumeni',
      diagnosis_date: '2023-06-01'
    },
    tumor: {
      anatomic_region: 'Oberschenkel',
      anatomic_region_side: 'left',
      clinical_history: 'Schmerzen seit 6 Monaten.'
    },
    sarcomaBoards: [
      {
        presentation_date: '2023-06-10',
        reason_for_presentation: 'Erstvorstellung',
        final_instruction: 'Bildgebung & Biopsie',
        decision_surgery: true,
        decision_radiotherapy: false,
        decision_systemic_therapy: true,
        fast_track: false
      },
      {
        presentation_date: '2023-08-15',
        reason_for_presentation: 'Nach Operation',
        final_instruction: 'Chemo beginnen',
        decision_surgery: false,
        decision_radiotherapy: false,
        decision_systemic_therapy: true,
        fast_track: false
      }
    ],
    radiologyExams: [
      {
        exam_date: '2023-06-05',
        imaging_type: 'MRI',
        number_lesions_total: 1,
        local_response: 'stable'
      },
      {
        exam_date: '2024-01-12',
        imaging_type: 'CT',
        number_lesions_total: 0,
        local_response: 'complete remission'
      }
    ],
    surgeries: [
      {
        surgery_date: '2023-07-01',
        surgical_type: 'Weichteilresektion',
        anatomical_resect: true,
        enbloc_resection: true
      }
    ],
    systemicTherapies: [
      {
        reason: 'adjuvant',
        chemo_protocol: 'EURAMOS',
        start_date: '2023-08-20',
        cycles_planned: 6,
        cycles_done: 6,
        toxicity_grade: 2
      }
    ]
  },

  {
    patient_id: 'P002',
    sex: 'male',
    birth_date: '1975-12-14',
    insurance_name: 'Helsana',
    diagnosis: {
      main_referral_diagnosis: 'Chondrosarkom',
      cancer_syndrome: 'keine',
      diagnosis_date: '2022-11-05'
    },
    tumor: {
      anatomic_region: 'Becken',
      anatomic_region_side: 'right',
      clinical_history: 'Inzidenteller MRT-Befund bei Rückenschmerzen.'
    },
    sarcomaBoards: [
      {
        presentation_date: '2022-11-12',
        reason_for_presentation: 'Erstvorstellung',
        final_instruction: 'Operation empfohlen',
        decision_surgery: true,
        decision_radiotherapy: false,
        decision_systemic_therapy: false,
        fast_track: false
      }
    ],
    radiologyExams: [
      {
        exam_date: '2022-11-01',
        imaging_type: 'MRI',
        number_lesions_total: 1,
        local_response: 'unchanged'
      }
    ],
    surgeries: [
      {
        surgery_date: '2022-12-01',
        surgical_type: 'Beckenresektion',
        anatomical_resect: true,
        enbloc_resection: false
      },
      {
        surgery_date: '2023-06-10',
        surgical_type: 'Revision',
        anatomical_resect: false,
        enbloc_resection: false
      }
    ]
  },

  {
    patient_id: 'P003',
    sex: 'female',
    birth_date: '1990-09-01',
    insurance_name: 'SWICA',
    diagnosis: {
      main_referral_diagnosis: 'Synovialsarkom',
      cancer_syndrome: 'keine',
      diagnosis_date: '2021-04-15'
    },
    tumor: {
      anatomic_region: 'Unterschenkel',
      anatomic_region_side: 'left',
      clinical_history: 'Trauma mit Schwellung seit 3 Wochen.'
    },
    sarcomaBoards: [
      {
        presentation_date: '2021-04-20',
        reason_for_presentation: 'Biopsie geplant',
        final_instruction: 'Radiologisches Staging',
        decision_surgery: false,
        decision_radiotherapy: false,
        decision_systemic_therapy: false,
        fast_track: true
      },
      {
        presentation_date: '2021-06-05',
        reason_for_presentation: 'Post-Therapie',
        final_instruction: 'Follow-up alle 3 Monate',
        decision_surgery: false,
        decision_radiotherapy: false,
        decision_systemic_therapy: false,
        fast_track: false
      }
    ],
    radiologyExams: [
      {
        exam_date: '2021-04-10',
        imaging_type: 'MRI',
        number_lesions_total: 2,
        local_response: 'progressive disease'
      },
      {
        exam_date: '2021-08-01',
        imaging_type: 'CT',
        number_lesions_total: 0,
        local_response: 'partial response'
      }
    ],
    systemicTherapies: [
      {
        reason: 'neoadjuvant',
        chemo_protocol: 'IVA',
        start_date: '2021-05-01',
        cycles_planned: 4,
        cycles_done: 4,
        toxicity_grade: 1
      }
    ]
  }
];