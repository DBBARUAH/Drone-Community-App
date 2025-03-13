import { db } from '../config/firebase.js'; // Ensure correct path
import FirebaseAuthService from '../config/auth-service.js';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    updateDoc,
    doc
  } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

  
  import { attachInputBlurHandler } from '../config/utils.js';
  // BookingManager.js
export class BookingManager {
    constructor() {
        this.currentStep = 1;
        this.selectedService = '';
        this.selectedTime = '';
        this.formData = {};
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('bookingModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });
    
        // Since DOMContentLoaded has already fired (main.js instantiation),
        // call loadBookingModal() immediately:
        this.loadBookingModal();
    }

    async loadBookingModal() {
        try {
            const response = await fetch('booking.html');
            const html = await response.text();
            document.getElementById('bookingModalContainer').innerHTML = html;
                // Attach input blur handlers to reset viewport on mobile
            attachInputBlurHandler();
        } catch (error) {
            console.error('Error loading booking modal:', error);
        }
    }

    openModal() {
        const modal = document.getElementById('bookingModal');
        if (!modal) {
          console.error('Booking modal not found. Possibly not loaded yet.');
          return;
        }
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      }

    closeModal() {
        document.getElementById('bookingModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.resetForm();
    }

    resetForm() {
        this.currentStep = 1;
        this.selectedService = '';
        this.selectedTime = '';
        this.formData = {};

        const elements = {
            steps: document.querySelectorAll('.booking-step'),
            serviceCards: document.querySelectorAll('.service-card'),
            timeSlots: document.querySelectorAll('.time-slot'),
            inputs: document.querySelectorAll('input'),
            textareas: document.querySelectorAll('textarea')
        };

        elements.steps.forEach(step => step.classList.remove('active'));
        document.getElementById('step1').classList.add('active');
        elements.serviceCards.forEach(card => card.classList.remove('selected'));
        elements.timeSlots.forEach(slot => slot.classList.remove('selected'));
        elements.inputs.forEach(input => input.value = '');
        elements.textareas.forEach(textarea => textarea.value = '');
    }

    selectService(service) {  // Remove element parameter
        this.selectedService = service;
        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.remove('selected');
        });
        // Find the clicked card and add selected class
        const selectedCard = document.querySelector(`[data-service="${service}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        this.nextStep();
    }

    selectTime(element) {
        this.selectedTime = element.innerText;
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        element.classList.add('selected');
    }

    validateCurrentStep() {
        const validators = {
            1: () => this.selectedService !== '',
            2: () => {
                const { name, email, phone } = this.getFormData();
                return name && email && phone;
            },
            3: () => true // Add specific validation for step 3 if needed
        };

        return validators[this.currentStep]?.() ?? true;
    }

    getFormData() {
        return {
            name: document.getElementById('name')?.value,
            email: document.getElementById('email')?.value,
            phone: document.getElementById('phone')?.value,
            date: document.getElementById('date')?.value,
            location: document.getElementById('location')?.value,
            requirements: document.getElementById('requirements')?.value
        };
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            document.getElementById(`step${this.currentStep}`).classList.remove('active');
            this.currentStep++;
            document.getElementById(`step${this.currentStep}`).classList.add('active');
        }
    }

    prevStep() {
        document.getElementById(`step${this.currentStep}`).classList.remove('active');
        this.currentStep--;
        document.getElementById(`step${this.currentStep}`).classList.add('active');
    }

    async submitForm() {
        if (!this.validateCurrentStep()) return;

        const formData = {
            ...this.getFormData(),
            service: this.selectedService,
            time: this.selectedTime
        };

        try {
            const formSubmission = await this.submitToFormspree(formData);
            if (formSubmission.ok) {
                await this.updateFirestore(formData);
                this.nextStep();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('There was an error submitting your booking. Please try again.');
        }
    }

    async submitToFormspree(formData) {
        return await fetch('https://formspree.io/f/xgegjwqk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                subject: 'New Drone Service Booking Request'
            })
        });
    }

    async updateFirestore(formData) {
        try {
            const usersRef = collection(db, "chatbot_users");
            
            // Normalize email for consistent querying
            const normalizedEmail = formData.email.trim().toLowerCase();
            
            // Query for existing user
            const q = query(usersRef, where("email", "==", normalizedEmail));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                // No existing user - create new document
                await addDoc(usersRef, {
                    fullName: formData.name,
                    email: normalizedEmail,
                    phone: formData.phone,
                    bookings: [{
                        service: formData.service,
                        date: formData.date,
                        time: formData.time,
                        location: formData.location,
                        requirements: formData.requirements,
                        createdAt: new Date()
                    }],
                    source: "booking_request",
                    lastUpdated: new Date(),
                    timestamp: new Date()
                });
            } else {
                // Existing user - update document
                const userDoc = querySnapshot.docs[0];
                const existingData = userDoc.data();
                
                // Prepare updated data
                const updatedData = {
                    // Keep existing data
                    ...existingData,
                    
                    // Update basic info if not present
                    fullName: existingData.fullName || formData.name,
                    phone: existingData.phone || formData.phone,
                    
                    // Add new booking to bookings array
                    bookings: [...(existingData.bookings || []), {
                        service: formData.service,
                        date: formData.date,
                        time: formData.time,
                        location: formData.location,
                        requirements: formData.requirements,
                        createdAt: new Date()
                    }],
                    
                    // Add booking as additional source if not present
                    sources: Array.from(new Set([
                        ...(existingData.sources || [existingData.source]),
                        "booking_request"
                    ])),
                    
                    // Update metadata
                    lastUpdated: new Date(),
                    
                    // Preserve original registration timestamp
                    timestamp: existingData.timestamp || new Date()
                };
    
                // Update the document
                await updateDoc(doc(usersRef, userDoc.id), updatedData);
                
                // Log success
                console.log(`Updated user document for email: ${normalizedEmail}`);
                console.log('Updated data:', updatedData);
            }
        } catch (error) {
            console.error("Error updating Firestore:", error);
            throw error;
        }
    }
}