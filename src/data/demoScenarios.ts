import type { Volunteer, Need } from '../types';

// ─── FLOOD RELIEF SCENARIO ──────────────────────────────────────────────────

export const floodVolunteers: Volunteer[] = [
  { id: 'fv1', name: 'Dr. Priya Sharma', skills: ['First Aid', 'Counseling'], skillLevels: { 'first aid': 3, counseling: 3 }, location: 'Riverbank District', lat: 34.05, lng: -118.25, availability: 'Flexible', rating: 4.9, avatar: 'PS', activeTaskCount: 0 },
  { id: 'fv2', name: 'Ravi Kumar', skills: ['Logistics', 'Driving'], skillLevels: { logistics: 2, driving: 3 }, location: 'Highway Zone', lat: 34.08, lng: -118.23, availability: 'Weekdays', availStart: '08:00', availEnd: '18:00', rating: 4.3, avatar: 'RK', activeTaskCount: 0 },
  { id: 'fv3', name: 'Anita Patel', skills: ['Cooking', 'First Aid'], skillLevels: { cooking: 2, 'first aid': 2 }, location: 'Central Camp', lat: 34.02, lng: -118.28, availability: 'Flexible', rating: 4.7, avatar: 'AP', activeTaskCount: 0 },
  { id: 'fv4', name: 'Suresh Reddy', skills: ['Driving', 'Logistics'], skillLevels: { driving: 2, logistics: 1 }, location: 'Riverbank District', lat: 34.05, lng: -118.25, availability: 'Weekends', availStart: '07:00', availEnd: '15:00', rating: 4.1, avatar: 'SR', activeTaskCount: 0 },
  { id: 'fv5', name: 'Meena Devi', skills: ['Teaching', 'Counseling'], skillLevels: { teaching: 3, counseling: 2 }, location: 'Central Camp', lat: 34.02, lng: -118.28, availability: 'Evenings', availStart: '16:00', availEnd: '21:00', rating: 4.5, avatar: 'MD', activeTaskCount: 0 },
  { id: 'fv6', name: 'Arjun Singh', skills: ['IT Support'], skillLevels: { 'it support': 2 }, location: 'Highway Zone', lat: 34.08, lng: -118.23, availability: 'Mornings', availStart: '06:00', availEnd: '12:00', rating: 3.8, avatar: 'AS', activeTaskCount: 0 },
  { id: 'fv7', name: 'Lakshmi Rao', skills: ['First Aid'], skillLevels: { 'first aid': 3 }, location: 'Central Camp', lat: 34.02, lng: -118.28, availability: 'Flexible', rating: 4.6, avatar: 'LR', activeTaskCount: 0 },
  { id: 'fv8', name: 'Vikram Joshi', skills: ['Logistics', 'Cooking'], skillLevels: { logistics: 2, cooking: 1 }, location: 'Riverbank District', lat: 34.05, lng: -118.25, availability: 'Weekdays', availStart: '09:00', availEnd: '17:00', rating: 4.0, avatar: 'VJ', activeTaskCount: 0 },
];

export const floodNeeds: Need[] = [
  { id: 'fn1', title: 'Emergency Medical Camp Setup', requiredSkills: ['First Aid', 'Logistics'], location: 'Riverbank District', lat: 34.05, lng: -118.25, urgency: 'High', timeframe: 'Flexible', teamSizeNeeded: 2, dateAdded: '30 min ago', isAssigned: false },
  { id: 'fn2', title: 'Evacuee Food Distribution', requiredSkills: ['Cooking', 'Logistics'], location: 'Central Camp', lat: 34.02, lng: -118.28, urgency: 'High', timeframe: 'Weekdays', timeframeStart: '08:00', timeframeEnd: '16:00', dateAdded: '1 hour ago', isAssigned: false },
  { id: 'fn3', title: 'Supply Transport from Warehouse', requiredSkills: ['Driving', 'Logistics'], location: 'Highway Zone', lat: 34.08, lng: -118.23, urgency: 'High', timeframe: 'Weekdays', timeframeStart: '09:00', timeframeEnd: '17:00', dateAdded: '45 min ago', isAssigned: false },
  { id: 'fn4', title: 'Trauma Counseling for Families', requiredSkills: ['Counseling'], location: 'Central Camp', lat: 34.02, lng: -118.28, urgency: 'Medium', timeframe: 'Evenings', timeframeStart: '17:00', timeframeEnd: '21:00', dateAdded: '2 hours ago', isAssigned: false },
  { id: 'fn5', title: 'Communication Systems Restore', requiredSkills: ['IT Support'], location: 'Highway Zone', lat: 34.08, lng: -118.23, urgency: 'Medium', timeframe: 'Mornings', timeframeStart: '07:00', timeframeEnd: '12:00', dateAdded: '3 hours ago', isAssigned: false },
  { id: 'fn6', title: 'Children Activity Coordination', requiredSkills: ['Teaching'], location: 'Central Camp', lat: 34.02, lng: -118.28, urgency: 'Low', timeframe: 'Evenings', timeframeStart: '16:00', timeframeEnd: '20:00', dateAdded: '5 hours ago', isAssigned: false },
];

// ─── EDUCATION SCENARIO ─────────────────────────────────────────────────────

export const educationVolunteers: Volunteer[] = [
  { id: 'ev1', name: 'Prof. Sarah Williams', skills: ['Teaching', 'Counseling'], skillLevels: { teaching: 3, counseling: 2 }, location: 'University District', lat: 40.71, lng: -74.00, availability: 'Weekdays', availStart: '09:00', availEnd: '17:00', rating: 4.8, avatar: 'SW', activeTaskCount: 0 },
  { id: 'ev2', name: 'James Chen', skills: ['IT Support', 'Teaching'], skillLevels: { 'it support': 3, teaching: 2 }, location: 'Downtown Campus', lat: 40.73, lng: -73.99, availability: 'Flexible', rating: 4.5, avatar: 'JC', activeTaskCount: 0 },
  { id: 'ev3', name: 'Maria Garcia', skills: ['Counseling'], skillLevels: { counseling: 3 }, location: 'Suburban Area', lat: 40.85, lng: -73.95, availability: 'Evenings', availStart: '17:00', availEnd: '21:00', rating: 4.7, avatar: 'MG', activeTaskCount: 0 },
  { id: 'ev4', name: 'David Park', skills: ['IT Support'], skillLevels: { 'it support': 2 }, location: 'University District', lat: 40.71, lng: -74.00, availability: 'Weekends', availStart: '10:00', availEnd: '16:00', rating: 4.2, avatar: 'DP', activeTaskCount: 0 },
  { id: 'ev5', name: 'Lisa Thompson', skills: ['Teaching', 'First Aid'], skillLevels: { teaching: 2, 'first aid': 3 }, location: 'Downtown Campus', lat: 40.73, lng: -73.99, availability: 'Mornings', availStart: '07:00', availEnd: '12:00', rating: 4.4, avatar: 'LT', activeTaskCount: 0 },
  { id: 'ev6', name: 'Ahmed Hassan', skills: ['Logistics', 'Driving'], skillLevels: { logistics: 2, driving: 2 }, location: 'Suburban Area', lat: 40.85, lng: -73.95, availability: 'Weekdays', availStart: '08:00', availEnd: '16:00', rating: 3.9, avatar: 'AH', activeTaskCount: 0 },
];

export const educationNeeds: Need[] = [
  { id: 'en1', title: 'After-School STEM Tutoring', requiredSkills: ['Teaching'], location: 'University District', lat: 40.71, lng: -74.00, urgency: 'High', timeframe: 'Weekdays', timeframeStart: '14:00', timeframeEnd: '17:00', teamSizeNeeded: 2, dateAdded: '1 day ago', isAssigned: false },
  { id: 'en2', title: 'Computer Lab Setup for Students', requiredSkills: ['IT Support'], location: 'Downtown Campus', lat: 40.73, lng: -73.99, urgency: 'Medium', dateAdded: '2 days ago', isAssigned: false },
  { id: 'en3', title: 'Career Guidance Workshop', requiredSkills: ['Counseling', 'Teaching'], location: 'Suburban Area', lat: 40.85, lng: -73.95, urgency: 'Medium', timeframe: 'Evenings', timeframeStart: '18:00', timeframeEnd: '20:00', dateAdded: '3 days ago', isAssigned: false },
  { id: 'en4', title: 'School Library Equipment Transport', requiredSkills: ['Logistics', 'Driving'], location: 'Suburban Area', lat: 40.85, lng: -73.95, urgency: 'Low', timeframe: 'Weekdays', timeframeStart: '09:00', timeframeEnd: '15:00', dateAdded: '4 days ago', isAssigned: false },
  { id: 'en5', title: 'First Aid Training for Staff', requiredSkills: ['First Aid', 'Teaching'], location: 'Downtown Campus', lat: 40.73, lng: -73.99, urgency: 'Medium', timeframe: 'Mornings', timeframeStart: '08:00', timeframeEnd: '11:00', dateAdded: '2 days ago', isAssigned: false },
];

// ─── MEDICAL EMERGENCY SCENARIO ─────────────────────────────────────────────

export const medicalVolunteers: Volunteer[] = [
  { id: 'mv1', name: 'Dr. Elena Rodriguez', skills: ['First Aid', 'Counseling'], skillLevels: { 'first aid': 3, counseling: 3 }, location: 'City Hospital', lat: 51.52, lng: -0.12, availability: 'Flexible', rating: 5.0, avatar: 'ER', activeTaskCount: 0 },
  { id: 'mv2', name: 'Nurse Tom Baker', skills: ['First Aid'], skillLevels: { 'first aid': 3 }, location: 'North Clinic', lat: 51.55, lng: -0.10, availability: 'Weekdays', availStart: '07:00', availEnd: '15:00', rating: 4.8, avatar: 'TB', activeTaskCount: 0 },
  { id: 'mv3', name: 'Paramedic Kim Lee', skills: ['First Aid', 'Driving'], skillLevels: { 'first aid': 3, driving: 3 }, location: 'City Hospital', lat: 51.52, lng: -0.12, availability: 'Flexible', rating: 4.9, avatar: 'KL', activeTaskCount: 0 },
  { id: 'mv4', name: 'Ryan O\'Connor', skills: ['Logistics', 'Driving'], skillLevels: { logistics: 2, driving: 2 }, location: 'North Clinic', lat: 51.55, lng: -0.10, availability: 'Weekends', availStart: '08:00', availEnd: '16:00', rating: 4.3, avatar: 'RO', activeTaskCount: 0 },
  { id: 'mv5', name: 'Dr. Aisha Khan', skills: ['First Aid', 'Teaching'], skillLevels: { 'first aid': 3, teaching: 2 }, location: 'South Medical Center', lat: 51.48, lng: -0.15, availability: 'Mornings', availStart: '06:00', availEnd: '12:00', rating: 4.7, avatar: 'AK', activeTaskCount: 0 },
  { id: 'mv6', name: 'Carlos Mendez', skills: ['Cooking', 'Logistics'], skillLevels: { cooking: 2, logistics: 1 }, location: 'City Hospital', lat: 51.52, lng: -0.12, availability: 'Evenings', availStart: '16:00', availEnd: '22:00', rating: 4.0, avatar: 'CM', activeTaskCount: 0 },
  { id: 'mv7', name: 'Fatima Al-Rashid', skills: ['Counseling', 'Teaching'], skillLevels: { counseling: 3, teaching: 2 }, location: 'South Medical Center', lat: 51.48, lng: -0.15, availability: 'Flexible', rating: 4.6, avatar: 'FA', activeTaskCount: 0 },
];

export const medicalNeeds: Need[] = [
  { id: 'mn1', title: 'Mass Vaccination Drive', requiredSkills: ['First Aid'], location: 'City Hospital', lat: 51.52, lng: -0.12, urgency: 'High', timeframe: 'Flexible', teamSizeNeeded: 3, dateAdded: '1 hour ago', isAssigned: false },
  { id: 'mn2', title: 'Emergency Blood Supply Transport', requiredSkills: ['Driving', 'Logistics'], location: 'North Clinic', lat: 51.55, lng: -0.10, urgency: 'High', timeframe: 'Weekdays', timeframeStart: '08:00', timeframeEnd: '14:00', deadline: '2026-04-20', dateAdded: '30 min ago', isAssigned: false },
  { id: 'mn3', title: 'Patient Family Counseling', requiredSkills: ['Counseling'], location: 'South Medical Center', lat: 51.48, lng: -0.15, urgency: 'Medium', timeframe: 'Evenings', timeframeStart: '17:00', timeframeEnd: '21:00', dateAdded: '3 hours ago', isAssigned: false },
  { id: 'mn4', title: 'Staff First Aid Certification', requiredSkills: ['First Aid', 'Teaching'], location: 'South Medical Center', lat: 51.48, lng: -0.15, urgency: 'Medium', timeframe: 'Mornings', timeframeStart: '07:00', timeframeEnd: '11:00', dateAdded: '1 day ago', isAssigned: false },
  { id: 'mn5', title: 'Hospital Kitchen Support', requiredSkills: ['Cooking'], location: 'City Hospital', lat: 51.52, lng: -0.12, urgency: 'Low', timeframe: 'Evenings', timeframeStart: '17:00', timeframeEnd: '21:00', dateAdded: '2 days ago', isAssigned: false },
];
