const form = document.getElementById('registrationForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phoneNumber');
const passwordInput = document.getElementById('password');
const termsInput = document.getElementById('terms');
const submitBtn = document.getElementById('submitBtn');
const successModal = document.getElementById('successModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const summaryName = document.getElementById('summaryName');
const summaryEmail = document.getElementById('summaryEmail');
const summaryPhone = document.getElementById('summaryPhone');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const strengthMeter = document.querySelector('.strength-meter');
const passwordRequirements = document.querySelector('.password-requirements');
const reqLength = document.getElementById('reqLength');
const reqUpper = document.getElementById('reqUpper');
const reqLower = document.getElementById('reqLower');
const reqNumber = document.getElementById('reqNumber');
const reqSpecial = document.getElementById('reqSpecial');
const passwordToggleBtn = document.getElementById('passwordToggleBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const dashboardPage = document.getElementById('dashboardPage');
const dashboardName = document.getElementById('dashboardName');
const dashboardEmail = document.getElementById('dashboardEmail');
const dashboardPhone = document.getElementById('dashboardPhone');
const editProfileBtn = document.getElementById('editProfileBtn');
const logoutBtn = document.getElementById('logoutBtn');
const rootElement = document.documentElement;

const validationRules = {
  fullName: value => value.trim().length >= 3,
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
  phoneNumber: value => {
    const cleaned = value.replace(/[^0-9]/g, '');
    return /^\d{10}$/.test(cleaned);
  },
  password: value => {
    const tests = {
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };
    return tests;
  },
};

const fieldMap = {
  fullName: {
    input: fullNameInput,
    group: document.getElementById('nameGroup'),
    error: document.getElementById('nameError'),
    message: 'Please enter your full name (at least 3 characters)',
  },
  email: {
    input: emailInput,
    group: document.getElementById('emailGroup'),
    error: document.getElementById('emailError'),
    message: 'Please enter a valid email address',
  },
  phoneNumber: {
    input: phoneInput,
    group: document.getElementById('phoneGroup'),
    error: document.getElementById('phoneError'),
    message: 'Please enter a valid 10-digit phone number',
  },
  password: {
    input: passwordInput,
    group: document.getElementById('passwordGroup'),
    error: document.getElementById('passwordError'),
    message: 'Please fulfill all password requirements',
  },
  terms: {
    input: termsInput,
    group: document.getElementById('termsGroup'),
    error: document.getElementById('termsError'),
    message: 'You must agree to the terms to proceed',
  },
};

function setGroupState(group, valid) {
  group.classList.remove('valid', 'invalid');
  if (valid === true) {
    group.classList.add('valid');
  } else if (valid === false) {
    group.classList.add('invalid');
  }
}

function validateTextField(name) {
  const value = fieldMap[name].input.value;
  return validationRules[name](value);
}

function validatePassword() {
  const value = passwordInput.value;
  const checks = validationRules.password(value);
  updatePasswordChecklist(checks);
  const passedCount = Object.values(checks).filter(Boolean).length;
  updateStrengthMeter(passedCount);
  return passedCount === Object.keys(checks).length ? checks : false;
}

function updatePasswordChecklist(checks) {
  toggleRequirement(reqLength, checks.length);
  toggleRequirement(reqUpper, checks.upper);
  toggleRequirement(reqLower, checks.lower);
  toggleRequirement(reqNumber, checks.number);
  toggleRequirement(reqSpecial, checks.special);
}

function toggleRequirement(element, met) {
  element.classList.toggle('met', met);
}

function updateStrengthMeter(score) {
  const meterState = score <= 2 ? 'weak' : score === 3 || score === 4 ? 'medium' : 'strong';
  strengthBar.className = `strength-bar ${meterState}`;
  strengthText.className = `strength-text ${meterState}`;
  strengthText.textContent = meterState === 'weak' ? 'Weak' : meterState === 'medium' ? 'Medium' : 'Strong';
  strengthMeter.classList.add('visible');
}

function hideStrengthMeter() {
  strengthMeter.classList.remove('visible');
}

function formatPhoneValue(value) {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function handleValidation(event) {
  const fieldName = event.target.name;
  if (!fieldMap[fieldName]) return;

  if (fieldName === 'password') {
    const result = validatePassword();
    setGroupState(fieldMap.password.group, Boolean(result));
    return;
  }

  if (fieldName === 'phoneNumber') {
    if (event.inputType !== 'deleteContentBackward') {
      event.target.value = formatPhoneValue(event.target.value);
    }
  }

  const valid = validateTextField(fieldName);
  setGroupState(fieldMap[fieldName].group, valid);
}

function handleBlur(event) {
  const fieldName = event.target.name;
  if (!fieldMap[fieldName]) return;

  if (fieldName === 'password') {
    const passwordValid = validatePassword();
    setGroupState(fieldMap.password.group, Boolean(passwordValid));
    if (!passwordInput.value) {
      hideStrengthMeter();
      passwordRequirements.classList.remove('visible');
    }
    return;
  }

  const isEmpty = !event.target.value.trim();
  const valid = fieldName === 'terms' ? termsInput.checked : validateTextField(fieldName);
  setGroupState(fieldMap[fieldName].group, isEmpty ? false : valid);
}

function handleFocus(event) {
  const fieldName = event.target.name;
  if (!fieldMap[fieldName]) return;

  if (fieldName === 'password') {
    passwordRequirements.classList.add('visible');
    strengthMeter.classList.add('visible');
    validatePassword();
  }
}

function handleTermsChange() {
  setGroupState(fieldMap.terms.group, termsInput.checked);
}

function validateForm() {
  const nameValid = validateTextField('fullName');
  const emailValid = validateTextField('email');
  const phoneValid = validateTextField('phoneNumber');
  const passwordValid = validatePassword();
  const termsValid = termsInput.checked;

  setGroupState(fieldMap.fullName.group, nameValid);
  setGroupState(fieldMap.email.group, emailValid);
  setGroupState(fieldMap.phoneNumber.group, phoneValid);
  setGroupState(fieldMap.password.group, Boolean(passwordValid));
  setGroupState(fieldMap.terms.group, termsValid);

  return nameValid && emailValid && phoneValid && Boolean(passwordValid) && termsValid;
}

function showModal() {
  summaryName.textContent = fullNameInput.value.trim();
  summaryEmail.textContent = emailInput.value.trim();
  summaryPhone.textContent = phoneInput.value.trim();
  successModal.classList.add('active');
}

function hideModal() {
  successModal.classList.remove('active');
}

function showDashboard() {
  const name = summaryName.textContent.trim() || 'New User';
  const email = summaryEmail.textContent.trim() || 'Not set';
  const phone = summaryPhone.textContent.trim() || 'Not set';
  dashboardName.textContent = name;
  dashboardEmail.textContent = email;
  dashboardPhone.textContent = phone;
  dashboardPage.hidden = false;
  document.querySelector('main.app-container').classList.add('hidden');
  hideModal();
  dashboardPage.scrollIntoView({ behavior: 'smooth' });
}

function goBackToSignup() {
  dashboardPage.hidden = true;
  document.querySelector('main.app-container').classList.remove('hidden');
  fullNameInput.focus();
}

function resetForm() {
  form.reset();
  Object.values(fieldMap).forEach(({group}) => group.classList.remove('valid', 'invalid'));
  strengthBar.className = 'strength-bar';
  strengthText.className = 'strength-text';
  strengthText.textContent = 'Password Strength';
  passwordRequirements.classList.remove('visible');
  hideStrengthMeter();
}

function applyShakeEffect() {
  const card = document.querySelector('.form-card');
  card.classList.add('shake');
  setTimeout(() => card.classList.remove('shake'), 500);
}

function togglePasswordVisibility() {
  const show = passwordInput.type === 'password';
  passwordInput.type = show ? 'text' : 'password';
  passwordToggleBtn.classList.toggle('visible', show);
}

function applyTheme(theme) {
  rootElement.setAttribute('data-theme', theme);
  localStorage.setItem('preferredTheme', theme);
}

function initTheme() {
  const storedTheme = localStorage.getItem('preferredTheme');
  if (storedTheme) {
    rootElement.setAttribute('data-theme', storedTheme);
  }
}

function toggleTheme() {
  const currentTheme = rootElement.getAttribute('data-theme');
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme);
}

function scrollToFirstInvalid() {
  const invalidField = document.querySelector('.input-group.invalid input, .input-group.invalid .checkbox-label');
  if (invalidField) {
    invalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    invalidField.focus({ preventScroll: true });
  }
}

function handleEscapeKey(event) {
  if (event.key === 'Escape' && successModal.classList.contains('active')) {
    hideModal();
  }
}

form.addEventListener('input', handleValidation);
form.addEventListener('blur', handleBlur, true);
form.addEventListener('focus', handleFocus, true);
termsInput.addEventListener('change', handleTermsChange);
passwordToggleBtn.addEventListener('click', togglePasswordVisibility);
themeToggleBtn.addEventListener('click', toggleTheme);

form.addEventListener('submit', event => {
  event.preventDefault();
  submitBtn.disabled = true;
  submitBtn.classList.add('loading');

  const valid = validateForm();

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');

    if (!valid) {
      applyShakeEffect();
      scrollToFirstInvalid();
      return;
    }

    showModal();
    resetForm();
  }, 700);
});

modalCloseBtn.addEventListener('click', () => {
  showDashboard();
});

editProfileBtn.addEventListener('click', goBackToSignup);
logoutBtn.addEventListener('click', goBackToSignup);

window.addEventListener('keydown', handleEscapeKey);

successModal.addEventListener('click', event => {
  if (event.target === successModal) {
    hideModal();
  }
});

passwordInput.addEventListener('input', () => {
  if (!passwordInput.value) {
    passwordRequirements.classList.remove('visible');
    hideStrengthMeter();
  }
});

initTheme();
