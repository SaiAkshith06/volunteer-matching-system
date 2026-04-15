import type { Volunteer, Need } from '../types';

// ─── FLOOD RELIEF SCENARIO ──────────────────────────────────────────────────

export const floodVolunteers: Volunteer[] = [
  { id: 'fv1', name: 'Dr. Priya Sharma', skills: ['First Aid', 'Counseling'], location: 'Riverbank District', availability: 'Flexible', rating: 4.9, avatar: 'PS' },
  { id: 'fv2', name: 'Ravi Kumar', skills: ['Logistics', 'Driving'], location: 'Highway Zone', availability: 'Weekdays', rating: 4.3, avatar: 'RK' },
  { id: 'fv3', name: 'Anita Patel', skills: ['Cooking', 'First Aid'], location: 'Central Camp', availability: 'Flexible', rating: 4.7, avatar: 'AP' },
  { id: 'fv4', name: 'Suresh Reddy', skills: ['Driving', 'Logistics'], location: 'Riverbank District', availability: 'Weekends', rating: 4.1, avatar: 'SR' },
  { id: 'fv5', name: 'Meena Devi', skills: ['Teaching', 'Counseling'], location: 'Central Camp', availability: 'Evenings', rating: 4.5, avatar: 'MD' },
  { id: 'fv6', name: 'Arjun Singh', skills: ['IT Support'], location: 'Highway Zone', availability: 'Mornings', rating: 3.8, avatar: 'AS' },
  { id: 'fv7', name: 'Lakshmi Rao', skills: ['First Aid'], location: 'Central Camp', availability: 'Flexible', rating: 4.6, avatar: 'LR' },
  { id: 'fv8', name: 'Vikram Joshi', skills: ['Logistics', 'Cooking'], location: 'Riverbank District', availability: 'Weekdays', rating: 4.0, avatar: 'VJ' },
];

export const floodNeeds: Need[] = [
  { id: 'fn1', title: 'Emergency Medical Camp Setup', requiredSkills: ['First Aid', 'Logistics'], location: 'Riverbank District', urgency: 'High', dateAdded: '30 min ago', isAssigned: false },
  { id: 'fn2', title: 'Evacuee Food Distribution', requiredSkills: ['Cooking', 'Logistics'], location: 'Central Camp', urgency: 'High', dateAdded: '1 hour ago', isAssigned: false },
  { id: 'fn3', title: 'Supply Transport from Warehouse', requiredSkills: ['Driving', 'Logistics'], location: 'Highway Zone', urgency: 'High', dateAdded: '45 min ago', isAssigned: false },
  { id: 'fn4', title: 'Trauma Counseling for Families', requiredSkills: ['Counseling'], location: 'Central Camp', urgency: 'Medium', dateAdded: '2 hours ago', isAssigned: false },
  { id: 'fn5', title: 'Communication Systems Restore', requiredSkills: ['IT Support'], location: 'Highway Zone', urgency: 'Medium', dateAdded: '3 hours ago', isAssigned: false },
  { id: 'fn6', title: 'Children Activity Coordination', requiredSkills: ['Teaching'], location: 'Central Camp', urgency: 'Low', dateAdded: '5 hours ago', isAssigned: false },
];

// ─── EDUCATION SCENARIO ─────────────────────────────────────────────────────

export const educationVolunteers: Volunteer[] = [
  { id: 'ev1', name: 'Prof. Sarah Williams', skills: ['Teaching', 'Counseling'], location: 'University District', availability: 'Weekdays', rating: 4.8, avatar: 'SW' },
  { id: 'ev2', name: 'James Chen', skills: ['IT Support', 'Teaching'], location: 'Downtown Campus', availability: 'Flexible', rating: 4.5, avatar: 'JC' },
  { id: 'ev3', name: 'Maria Garcia', skills: ['Counseling'], location: 'Suburban Area', availability: 'Evenings', rating: 4.7, avatar: 'MG' },
  { id: 'ev4', name: 'David Park', skills: ['IT Support'], location: 'University District', availability: 'Weekends', rating: 4.2, avatar: 'DP' },
  { id: 'ev5', name: 'Lisa Thompson', skills: ['Teaching', 'First Aid'], location: 'Downtown Campus', availability: 'Mornings', rating: 4.4, avatar: 'LT' },
  { id: 'ev6', name: 'Ahmed Hassan', skills: ['Logistics', 'Driving'], location: 'Suburban Area', availability: 'Weekdays', rating: 3.9, avatar: 'AH' },
];

export const educationNeeds: Need[] = [
  { id: 'en1', title: 'After-School STEM Tutoring', requiredSkills: ['Teaching'], location: 'University District', urgency: 'High', dateAdded: '1 day ago', isAssigned: false },
  { id: 'en2', title: 'Computer Lab Setup for Students', requiredSkills: ['IT Support'], location: 'Downtown Campus', urgency: 'Medium', dateAdded: '2 days ago', isAssigned: false },
  { id: 'en3', title: 'Career Guidance Workshop', requiredSkills: ['Counseling', 'Teaching'], location: 'Suburban Area', urgency: 'Medium', dateAdded: '3 days ago', isAssigned: false },
  { id: 'en4', title: 'School Library Equipment Transport', requiredSkills: ['Logistics', 'Driving'], location: 'Suburban Area', urgency: 'Low', dateAdded: '4 days ago', isAssigned: false },
  { id: 'en5', title: 'First Aid Training for Staff', requiredSkills: ['First Aid', 'Teaching'], location: 'Downtown Campus', urgency: 'Medium', dateAdded: '2 days ago', isAssigned: false },
];

// ─── MEDICAL EMERGENCY SCENARIO ─────────────────────────────────────────────

export const medicalVolunteers: Volunteer[] = [
  { id: 'mv1', name: 'Dr. Elena Rodriguez', skills: ['First Aid', 'Counseling'], location: 'City Hospital', availability: 'Flexible', rating: 5.0, avatar: 'ER' },
  { id: 'mv2', name: 'Nurse Tom Baker', skills: ['First Aid'], location: 'North Clinic', availability: 'Weekdays', rating: 4.8, avatar: 'TB' },
  { id: 'mv3', name: 'Paramedic Kim Lee', skills: ['First Aid', 'Driving'], location: 'City Hospital', availability: 'Flexible', rating: 4.9, avatar: 'KL' },
  { id: 'mv4', name: 'Ryan O\'Connor', skills: ['Logistics', 'Driving'], location: 'North Clinic', availability: 'Weekends', rating: 4.3, avatar: 'RO' },
  { id: 'mv5', name: 'Dr. Aisha Khan', skills: ['First Aid', 'Teaching'], location: 'South Medical Center', availability: 'Mornings', rating: 4.7, avatar: 'AK' },
  { id: 'mv6', name: 'Carlos Mendez', skills: ['Cooking', 'Logistics'], location: 'City Hospital', availability: 'Evenings', rating: 4.0, avatar: 'CM' },
  { id: 'mv7', name: 'Fatima Al-Rashid', skills: ['Counseling', 'Teaching'], location: 'South Medical Center', availability: 'Flexible', rating: 4.6, avatar: 'FA' },
];

export const medicalNeeds: Need[] = [
  { id: 'mn1', title: 'Mass Vaccination Drive', requiredSkills: ['First Aid'], location: 'City Hospital', urgency: 'High', dateAdded: '1 hour ago', isAssigned: false },
  { id: 'mn2', title: 'Emergency Blood Supply Transport', requiredSkills: ['Driving', 'Logistics'], location: 'North Clinic', urgency: 'High', dateAdded: '30 min ago', isAssigned: false },
  { id: 'mn3', title: 'Patient Family Counseling', requiredSkills: ['Counseling'], location: 'South Medical Center', urgency: 'Medium', dateAdded: '3 hours ago', isAssigned: false },
  { id: 'mn4', title: 'Staff First Aid Certification', requiredSkills: ['First Aid', 'Teaching'], location: 'South Medical Center', urgency: 'Medium', dateAdded: '1 day ago', isAssigned: false },
  { id: 'mn5', title: 'Hospital Kitchen Support', requiredSkills: ['Cooking'], location: 'City Hospital', urgency: 'Low', dateAdded: '2 days ago', isAssigned: false },
];
