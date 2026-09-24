/**
 * Centralized Form Validation Utility
 *
 * Provides standardized validation for:
 * 1. Phone Numbers (exactly 10 digits, numbers only)
 * 2. Date of Birth (DOB) and Age limits configured via Hospital Settings
 */

/**
 * Strips all non-digit characters and limits the input to 10 characters.
 * Useful for real-time sanitization on input change.
 *
 * @param {string} value - Raw input value
 * @returns {string} - Clean string of up to 10 digits
 */
export function sanitizePhoneNumber(value) {
  if (!value && value !== 0) return "";
  return String(value).replace(/\D/g, "").slice(0, 10);
}

/**
 * Validates a phone number.
 * Must contain exactly 10 digits (0-9 only).
 *
 * @param {string} value - Phone number to validate
 * @param {string} [fieldName="Phone number"] - Field name for error message
 * @param {boolean} [required=true] - Whether the field is mandatory
 * @returns {string} - Error message if invalid, or empty string if valid
 */
export function validatePhoneNumber(value, fieldName = "Phone number", required = true) {
  const cleaned = String(value || "").trim();

  if (!cleaned) {
    return required ? `${fieldName} is required.` : "";
  }

  if (!/^\d{10}$/.test(cleaned)) {
    return "Phone number must contain exactly 10 digits.";
  }

  return "";
}

/**
 * Accurately calculates age in full years from a date string (YYYY-MM-DD).
 *
 * @param {string} dobString - Birthdate in YYYY-MM-DD or standard date format
 * @returns {number | string} - Age in full years, or empty string if invalid
 */
export function calculateAge(dobString) {
  if (!dobString) return "";
  const birth = new Date(dobString);
  if (isNaN(birth.getTime())) return "";

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age < 0 ? 0 : age;
}

/**
 * Returns today's date formatted as YYYY-MM-DD.
 *
 * @returns {string} - ISO date string for today
 */
export function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Validates Date of Birth against today's date and Settings-configured age bounds.
 *
 * @param {string} dobString - Date of birth (YYYY-MM-DD)
 * @param {object} [settings={}] - Current hospital settings object
 * @param {boolean} [isStaff=false] - Whether validating workforce (Doctor, Nurse, Staff)
 * @param {boolean} [required=false] - Whether DOB is mandatory
 * @returns {string} - Error message if invalid, or empty string if valid
 */
export function validateDateOfBirth(dobString, settings = {}, isStaff = false, required = false) {
  if (!dobString) {
    return required ? "Date of Birth is required." : "";
  }

  const birth = new Date(dobString);
  if (isNaN(birth.getTime())) {
    return "Please enter a valid Date of Birth.";
  }

  const todayStr = getTodayDateString();
  if (dobString > todayStr) {
    return "Date of Birth cannot be greater than today's date.";
  }

  const age = calculateAge(dobString);
  if (age === "" || isNaN(age)) {
    return "Please enter a valid Date of Birth.";
  }

  if (isStaff) {
    const minAge = Number(settings?.minStaffAge ?? 18);
    const maxAge = Number(settings?.maxStaffAge ?? 75);

    if (age < minAge || age > maxAge) {
      return `Staff age must be between ${minAge} and ${maxAge} years.`;
    }
  } else {
    const minAge = Number(settings?.minPatientAge ?? settings?.minAge ?? 0);
    const maxAge = Number(settings?.maxPatientAge ?? settings?.maxAge ?? 125);

    if (age < minAge || age > maxAge) {
      return `Patient age must be between ${minAge} and ${maxAge} years.`;
    }
  }

  return "";
}

/**
 * Returns min and max bounds for HTML `<input type="date">`.
 *
 * @param {object} [settings={}] - Current hospital settings
 * @param {boolean} [isStaff=false] - Whether for workforce
 * @returns {{ min: string, max: string }}
 */
export function getDobInputBounds(settings = {}, isStaff = false) {
  const max = getTodayDateString();
  const maxAge = isStaff
    ? Number(settings?.maxStaffAge ?? 75)
    : Number(settings?.maxPatientAge ?? settings?.maxAge ?? 125);

  const today = new Date();
  const minYear = today.getFullYear() - maxAge;
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const min = `${minYear}-${month}-${day}`;

  return { min, max };
}
