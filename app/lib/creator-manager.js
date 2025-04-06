import { db } from '../config/firebase.js'; 
import FirebaseAuthService from '../config/auth-service.js';
import { CreatorProfileService } from '../config/creator-profile-scheme.js';
import { 
  generateVerificationCode, 
  validateFullName, validateEmailAddress, validatePhoneNumber, validateSocialMediaAccount,
  attachInputBlurHandler 
} from '../config/utils.js';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

export class CreatorManager {
  constructor() {
    this.currentStep = 1;
    this.verificationCode = '';
    this.formData = {};
    this.userId = null;
    this.pendingRegistrationId = null;

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    document.addEventListener('click', (e) => {
      const modal = document.getElementById('creatorModalContainer');
      if (e.target === modal) {
        this.closeModal();
      }
    });

    document.addEventListener('DOMContentLoaded', () => {
      this.loadCreatorModal();
    });
  }

  async loadCreatorModal() {
    try {
      const response = await fetch('creator.html');
      const html = await response.text();
      document.getElementById('creatorModalContainer').innerHTML = html;
      attachInputBlurHandler();
    } catch (error) {
      console.error('Error loading creator modal:', error);
      this.showError("Error loading form. Please refresh.");
    }
  }

  openModal() {
    const modal = document.getElementById('creatorModal');
    if (!modal) return;
    modal.style.display = 'block';
    modal.offsetHeight; // Force reflow
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    const modal = document.getElementById('creatorModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
      this.resetForm();
    }, 300);
  }

  resetForm() {
    this.currentStep = 1;
    this.verificationCode = '';
    this.formData = {};

    const elements = {
      steps: document.querySelectorAll('.creator-step'),
      inputs: document.querySelectorAll('input'),
      textareas: document.querySelectorAll('textarea'),
      errorContainer: document.getElementById('creatorError')
    };

    elements.steps.forEach(step => step.classList.remove('active'));
    document.getElementById('creatorStep1').classList.add('active');
    elements.inputs.forEach(input => (input.value = ''));
    elements.textareas.forEach(textarea => (textarea.value = ''));
    if (elements.errorContainer) {
      elements.errorContainer.innerText = '';
    }
  }

  showError(message) {
    let errorContainer = document.getElementById('creatorError');
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.id = 'creatorError';
      errorContainer.style.color = 'red';
      errorContainer.style.marginBottom = '10px';
      const modal = document.getElementById('creatorModal');
      modal.prepend(errorContainer);
    }
    errorContainer.innerText = message;
  }

  clearError() {
    const errorContainer = document.getElementById('creatorError');
    if (errorContainer) {
      errorContainer.innerText = '';
    }
  }

  getFormData() {
    return {
      name: document.getElementById('creatorname')?.value,
      email: document.getElementById('creatoremail')?.value,
      phone: document.getElementById('creatorphone')?.value,
      password: document.getElementById('creatorpassword')?.value,
      confirmPassword: document.getElementById('creatorconfirmPassword')?.value,
      portfolioUrl: document.getElementById('creatorportfolioUrl')?.value,
      socialLinks: {
        instagram: document.getElementById('creatorinstagram')?.value,
        facebook: document.getElementById('creatorfacebook')?.value,
        youtube: document.getElementById('creatoryoutube')?.value,
        others: document.getElementById('creatorotherLinks')?.value
      }
    };
  }

  // STEP VALIDATIONS
  validateStep1() {
    const { name, email, phone } = this.getFormData();
  
    // Validate name using your full-name utility (assuming you have one similar to the one we discussed before)
    const nameValidation = validateFullName(name);
    if (!nameValidation.valid) {
      this.showError(nameValidation.message);
      return false;
    }
    // Store first and last names for later use
    this.formData.firstName = nameValidation.firstName;
    this.formData.lastName = nameValidation.lastName;
  
    // Validate email
    const emailValidation = validateEmailAddress(email);
    if (!emailValidation.valid) {
      this.showError(emailValidation.message);
      return false;
    }
    this.formData.email = emailValidation.email;
  
    // Validate phone
    const phoneValidation = validatePhoneNumber(phone);
    if (!phoneValidation.valid) {
      this.showError(phoneValidation.message);
      return false;
    }
    this.formData.phone = phoneValidation.phone;
  
    return true;
  }

  validateStep2() {
    // Minimal check here, because handleVerificationCode() does the heavy lifting
    const inputCode = document.getElementById('verificationCode')?.value;
    if (inputCode !== this.verificationCode) {
      this.showError("The verification code entered is incorrect.");
      return false;
    }
    return true;
  }

  validateStep3() {
    const { password, confirmPassword } = this.getFormData();
    if (!password || password.length < 8) {
      this.showError("Password must be at least 8 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      this.showError("Passwords do not match.");
      return false;
    }
    return true;
  }

  validateStep4() {
    const { portfolioUrl, socialLinks } = this.getFormData();
    
    // Validate the portfolio URL if provided
    if (portfolioUrl && portfolioUrl.trim() !== '') {
      try {
        new URL(portfolioUrl.trim());
      } catch (error) {
        this.showError("Please provide a valid portfolio URL.");
        return false;
      }
    }
    
    // Validate each social media link if provided
    for (const platform in socialLinks) {
      const account = socialLinks[platform];
      if (account && account.trim() !== '') {
        // Capitalize platform name for the error message (e.g., "Instagram")
        const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
        const validationResult = validateSocialMediaAccount(account, platformName);
        if (!validationResult.valid) {
          this.showError(validationResult.message);
          return false;
        }
        // Optionally update the social link with its sanitized value
        socialLinks[platform] = validationResult.account;
      }
    }
    
    // Check if neither portfolio URL nor any social link was provided
    const hasSocialLink = Object.values(socialLinks).some(link => link && link.trim() !== '');
    if (!portfolioUrl && !hasSocialLink) {
      this.showError("Please provide a portfolio URL or at least one social link.");
      return false;
    }
    
    return true;
  }

  validateCurrentStep() {
    switch (this.currentStep) {
      case 1: return this.validateStep1();
      case 2: return this.validateStep2();
      case 3: return this.validateStep3();
      case 4: return this.validateStep4();
      default: return true;
    }
  }

  // STEP NAVIGATION
  async nextStep() {
    if (!this.validateCurrentStep()) {
      return;
    }
    this.clearError();

    if (this.currentStep === 1) {
      await this.handleBasicRegistration();  // create pending doc
    }
    else if (this.currentStep === 2) {
      await this.handleVerificationCode();    // finalize user creation
    }
    else if (this.currentStep === 3) {
      // If you need to do anything with password, do it here
      // For example: you might want to actually set a real password in Firebase
      // But your code currently uses a random password from registerOrSignIn()
      // so you can just move on:
      this.goToNextStep();
    }
    else if (this.currentStep === 4) {
      await this.submitForm(); // final profile updates
    }
  }

  prevStep() {
    this.clearError();
    document.getElementById(`creatorStep${this.currentStep}`).classList.remove('active');
    this.currentStep = Math.max(1, this.currentStep - 1);
    document.getElementById(`creatorStep${this.currentStep}`).classList.add('active');
  }

  goToNextStep() {
    document.getElementById(`creatorStep${this.currentStep}`).classList.remove('active');
    this.currentStep++;
    document.getElementById(`creatorStep${this.currentStep}`).classList.add('active');
  }

  // STEP 1: Basic Registration Handler
  async handleBasicRegistration() {
    const { email, name, phone } = this.getFormData();
    this.formData = { email, name, phone };

    try {
      const pendingQuery = query(
        collection(db, 'pendingRegistrations'),
        where('email', '==', email)
      );
      const pendingDocs = await getDocs(pendingQuery);

      let newCode = generateVerificationCode();
      if (!pendingDocs.empty) {
        // update existing
        const pendingReg = pendingDocs.docs[0];
        this.pendingRegistrationId = pendingReg.id;

        await updateDoc(doc(db, 'pendingRegistrations', this.pendingRegistrationId), {
          name,
          email,
          phone,
          registrationTime: new Date(),
          verificationCode: newCode
        });
      } else {
        // create new
        const pendingRef = await addDoc(collection(db, 'pendingRegistrations'), {
          name,
          email,
          phone,
          verificationCode: newCode,
          registrationTime: new Date(),
          isVerified: false
        });
        this.pendingRegistrationId = pendingRef.id;
      }

      this.verificationCode = newCode;
      console.log("Verification code:", this.verificationCode);

      // Optionally send via email:
      await FirebaseAuthService.sendCreatorVerificationCode(email, this.verificationCode);

      this.goToNextStep();
    } catch (error) {
      console.error('Error in basic registration:', error);
      this.showError(error.message || "Error during registration. Please try again.");
      throw error;
    }
  }

  // STEP 2: Verify the code & finalize user creation
  async handleVerificationCode() {
    const inputCode = document.getElementById('verificationCode')?.value;
    if (inputCode !== this.verificationCode) {
      this.showError("The verification code is incorrect. Please try again.");
      return;
    }

    try {
      const pendingRegRef = doc(db, 'pendingRegistrations', this.pendingRegistrationId);
      const pendingRegSnap = await getDoc(pendingRegRef);

      if (!pendingRegSnap.exists()) {
        this.showError("No pending registration found. Please start over.");
        return;
      }
      if (pendingRegSnap.data().verificationCode !== inputCode) {
        this.showError("Verification code does not match. Please try again.");
        return;
      }

      // Now create or sign in the user in Firebase Auth
      const { email, name } = this.formData;
      const result = await FirebaseAuthService.registerOrSignIn(email, name);
      this.userId = result.user.uid;

      // Mark the pending registration as verified or just delete it
      await deleteDoc(pendingRegRef);

      this.goToNextStep();
    } catch (error) {
      console.error('Error verifying code:', error);
      this.showError("Error verifying your account. Please try again.");
    }
  }

  // STEP 4: Final form submission
  async submitForm() {
    if (!this.validateStep4()) return;

    const data = this.getFormData();
    // Merge new fields into existing formData
    this.formData = { ...this.formData, ...data };

    try {
      await CreatorProfileService.updateCreatorProfile(this.userId, {
        fullName: this.formData.name,
        email: this.formData.email,
        phone: this.formData.phone,
        portfolioUrl: this.formData.portfolioUrl,
        socialLinks: this.formData.socialLinks
      });

      // Optionally send admin notification
      await this.sendAdminNotification(this.formData);

      this.goToNextStep();
    } catch (error) {
      console.error('Submission error:', error);
      this.showError("There was an error submitting your registration. Please try again.");
    }
  }

  async sendAdminNotification(formData) {
    try {
      await fetch('https://formspree.io/f/xgegjwqk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'New Creator Registration',
          message: `
            New creator registration from:
            Name: ${formData.name}
            Email: ${formData.email}
            Phone: ${formData.phone}
            Portfolio: ${formData.portfolioUrl}
            Social Links:
              - Instagram: ${formData.socialLinks.instagram}
              - Facebook: ${formData.socialLinks.facebook}
              - YouTube: ${formData.socialLinks.youtube}
              - Others: ${formData.socialLinks.others}
          `
        })
      });
    } catch (error) {
      console.error('Error sending admin notification:', error);
    }
  }
}

// Initialize globally
const creatorManager = new CreatorManager();
window.creatorManager = creatorManager;