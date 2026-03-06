import React, { useState } from 'react';
import { ServiceAdvisorContext } from '../Serviceadvisor/ServiceAdvisorContextObject';
import {
  DEFAULT_APPOINTMENTS,
  DEFAULT_BRANCH,
  DEFAULT_COMPLAINTS,
  DEFAULT_CUSTOMERS,
  DEFAULT_ESTIMATIONS,
  DEFAULT_INVOICES,
  DEFAULT_JOB_CARDS
} from '../Serviceadvisor/data/mockData';

export const ServiceAdvisorProvider = ({ children }) => {
  const [currentBranch] = useState(DEFAULT_BRANCH);
  const [customers, setCustomers] = useState(DEFAULT_CUSTOMERS);
  const [appointments, setAppointments] = useState(DEFAULT_APPOINTMENTS);
  const [jobCards, setJobCards] = useState(DEFAULT_JOB_CARDS);
  const [estimations, setEstimations] = useState(DEFAULT_ESTIMATIONS);
  const [complaints, setComplaints] = useState(DEFAULT_COMPLAINTS);
  const [invoices] = useState(DEFAULT_INVOICES);

 
  const addCustomer = (customer) => {
    const newCustomer = {
      ...customer,
      id: `CUST/${currentBranch.substring(0, 3).toUpperCase()}/${new Date().getFullYear()}/${String(customers.length + 1).padStart(4, '0')}`,
      branch: currentBranch,
      loyaltyPoints: 0,
      serviceHistory: [],
      type: customer.type || 'Regular'
    };
    setCustomers([...customers, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = (id, updates) => {
    setCustomers(customers.map(cust => cust.id === id ? { ...cust, ...updates } : cust));
  };

  const addVehicleToCustomer = (customerId, vehicle) => {
    setCustomers(customers.map(cust => {
      if (cust.id === customerId) {
        return {
          ...cust,
          vehicles: [...cust.vehicles, { ...vehicle, id: cust.vehicles.length + 1 }]
        };
      }
      return cust;
    }));
  };

  
  const addAppointment = (appointment) => {
    const newAppointment = {
      ...appointment,
      id: `APT/${currentBranch.substring(0, 3).toUpperCase()}/${new Date().getFullYear()}/${String(appointments.length + 1).padStart(4, '0')}`,
      branch: currentBranch,
      status: 'Scheduled'
    };
    setAppointments([...appointments, newAppointment]);
    return newAppointment;
  };

  const updateAppointment = (id, updates) => {
    setAppointments(appointments.map(apt => apt.id === id ? { ...apt, ...updates } : apt));
  };

 
  const addJobCard = (jobCard) => {
    const newJobCard = {
      ...jobCard,
      id: `JC/${currentBranch.substring(0, 3).toUpperCase()}/${new Date().getFullYear()}/${String(jobCards.length + 1).padStart(4, '0')}`,
      branch: currentBranch,
      status: 'Open',
      progress: 0,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setJobCards([...jobCards, newJobCard]);
    return newJobCard;
  };

  const updateJobCard = (id, updates) => {
    setJobCards(jobCards.map(jc => jc.id === id ? { ...jc, ...updates } : jc));
  };

 
  const addEstimation = (estimation) => {
    const newEstimation = {
      ...estimation,
      id: `EST/${currentBranch.substring(0, 3).toUpperCase()}/${new Date().getFullYear()}/${String(estimations.length + 1).padStart(4, '0')}`,
      branch: currentBranch,
      status: 'Pending',
      createdDate: new Date().toISOString().split('T')[0],
      validTill: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setEstimations([...estimations, newEstimation]);
    return newEstimation;
  };

  const updateEstimation = (id, updates) => {
    setEstimations(estimations.map(est => est.id === id ? { ...est, ...updates } : est));
  };

 
  
  const addComplaint = (complaint) => {
    const newComplaint = {
      ...complaint,
      id: `COMP/${currentBranch.substring(0, 3).toUpperCase()}/${new Date().getFullYear()}/${String(complaints.length + 1).padStart(3, '0')}`,
      branch: currentBranch,
      status: 'Pending',
      filedDate: new Date().toISOString().split('T')[0]
    };
    setComplaints([...complaints, newComplaint]);
    return newComplaint;
  };

  const updateComplaint = (id, updates) => {
    setComplaints(complaints.map(comp => comp.id === id ? { ...comp, ...updates } : comp));
  };

  const value = {
    currentBranch,
    customers,
    appointments,
    jobCards,
    estimations,
    complaints,
    invoices,
    addCustomer,
    updateCustomer,
    addVehicleToCustomer,
    addAppointment,
    updateAppointment,
    addJobCard,
    updateJobCard,
    addEstimation,
    updateEstimation,
    addComplaint,
    updateComplaint
  };

  return <ServiceAdvisorContext.Provider value={value}>{children}</ServiceAdvisorContext.Provider>;
};
