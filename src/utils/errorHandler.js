/**
 * Centralized error-message handler for API and application errors.
 *
 * Ensures:
 * - Never displays "[object Object]" or raw JSON objects.
 * - Converts FastAPI 422 validation errors into concise, user-friendly messages.
 * - Sanitizes database/SQL constraint errors into clear human language.
 * - Extracts useful server details while suppressing raw stack traces or internal errors.
 * - Provides meaningful fallback messages for common HTTP statuses and network failures.
 */

const SPECIAL_FIELD_NAMES = {
  first_name: "First name",
  middle_name: "Middle name",
  last_name: "Last name",
  date_of_birth: "Date of birth",
  dob: "Date of birth",
  consultation_fee: "Consultation fee",
  experience_years: "Experience",
  registration_number: "Registration number",
  phone: "Phone number",
  email: "Email",
  address: "Address",
  specialization: "Specialization",
  department: "Department",
  qualification: "Qualification",
  license_number: "License number",
  license_expiry: "License expiry date",
  temporary_password: "Temporary password",
  current_password: "Current password",
  new_password: "New password",
  confirm_password: "Confirm password",
  old_password: "Current password",
  bed_number: "Bed number",
  room_number: "Room number",
  patient_id: "Patient",
  doctor_id: "Doctor",
  nurse_id: "Nurse",
  staff_id: "Staff",
  service_id: "Service",
  medicine_name: "Medicine name",
  medicine_code: "Medicine code",
  username: "Username",
  password: "Password",
};

/**
 * Humanizes field names (e.g. "date_of_birth" -> "Date of birth")
 */
export function humanizeFieldName(field) {
  if (!field) return "";
  const key = String(field).toLowerCase();
  if (SPECIAL_FIELD_NAMES[key]) {
    return SPECIAL_FIELD_NAMES[key];
  }
  const clean = String(field).replace(/_/g, " ").trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

/**
 * Converts FastAPI / Pydantic validation error arrays into friendly strings.
 */
export function formatValidationErrors(errors) {
  if (!Array.isArray(errors) || errors.length === 0) return "";

  const messages = [];
  let missingCount = 0;

  for (const item of errors) {
    if (!item || typeof item !== "object") continue;

    // Extract the field name from loc (e.g. ["body", "first_name"])
    const loc = Array.isArray(item.loc) ? item.loc : [];
    const fieldPart = loc
      .filter((p) => p !== "body" && p !== "query" && p !== "path" && typeof p !== "number")
      .pop();
    const fieldName = fieldPart ? humanizeFieldName(String(fieldPart)) : "";

    const rawMsg = item.msg || item.message || "";
    const lowerMsg = String(rawMsg).toLowerCase();
    const type = String(item.type || "").toLowerCase();

    if (
      type.includes("missing") ||
      lowerMsg.includes("field required") ||
      lowerMsg.includes("is required")
    ) {
      missingCount++;
      if (fieldName) {
        messages.push(`${fieldName} is required.`);
      }
    } else if (lowerMsg.includes("valid email") || lowerMsg.includes("email address")) {
      messages.push(
        fieldName
          ? `${fieldName} must be a valid email address.`
          : "Please enter a valid email address."
      );
    } else if (
      lowerMsg.includes("valid number") ||
      lowerMsg.includes("valid integer") ||
      lowerMsg.includes("valid float") ||
      lowerMsg.includes("greater than") ||
      lowerMsg.includes("less than")
    ) {
      messages.push(`${fieldName || "Value"} must be a valid number.`);
    } else if (lowerMsg.includes("valid date") || lowerMsg.includes("isoformat")) {
      messages.push(`${fieldName || "Date"} must be a valid date.`);
    } else if (fieldName && rawMsg) {
      const cleanMsg = rawMsg.replace(
        /^(value is |string should |input should |ensure this value )/i,
        ""
      );
      messages.push(
        `${fieldName}: ${cleanMsg.charAt(0).toLowerCase() + cleanMsg.slice(1)}.`
      );
    } else if (rawMsg) {
      messages.push(rawMsg);
    }
  }

  if (missingCount > 2) {
    return "Please fill in all required fields.";
  }

  if (messages.length > 0) {
    return messages.slice(0, 2).join(" ");
  }

  return "Please check the required fields.";
}

/**
 * Sanitizes technical strings, SQL errors, or tracebacks into user-friendly text.
 */
export function sanitizeErrorMessage(msg, fallback = "Operation failed. Please try again.") {
  if (!msg || typeof msg !== "string") return fallback;
  const trimmed = msg.trim();
  if (!trimmed) return fallback;

  // Never return raw object string
  if (trimmed === "[object Object]" || trimmed.includes("[object Object]")) {
    return fallback;
  }

  // HTML response (e.g. 502 Bad Gateway / 500 error page)
  if (
    trimmed.startsWith("<") ||
    trimmed.includes("<!DOCTYPE") ||
    trimmed.includes("<html>") ||
    trimmed.includes("<head>")
  ) {
    return "Server error occurred. Please try again later.";
  }

  // Generic or unhelpful strings
  const lowerTrimmed = trimmed.toLowerCase();
  if (
    lowerTrimmed === "request failed" ||
    lowerTrimmed === "something went wrong" ||
    lowerTrimmed === "failed" ||
    lowerTrimmed === "error" ||
    lowerTrimmed === "internal server error" ||
    lowerTrimmed === "bad request"
  ) {
    return fallback;
  }

  // SQL / Database Constraint Errors
  const isDbConstraint =
    trimmed.includes("sqlite3.") ||
    trimmed.includes("psycopg2") ||
    trimmed.includes("IntegrityError") ||
    trimmed.includes("OperationalError") ||
    trimmed.includes("UNIQUE constraint failed") ||
    trimmed.includes("duplicate key value");

  if (isDbConstraint) {
    const lower = trimmed.toLowerCase();
    if (lower.includes("email")) {
      return "This email address is already registered.";
    }
    if (lower.includes("registration_number") || lower.includes("registration")) {
      return "This registration number already exists.";
    }
    if (lower.includes("username")) {
      return "This username is already taken.";
    }
    if (lower.includes("room_number")) {
      return "This room number already exists.";
    }
    if (lower.includes("bed_number")) {
      return "This bed number already exists in this room.";
    }
    if (lower.includes("license_number")) {
      return "This license number already exists.";
    }
    if (lower.includes("asset_code")) {
      return "This asset code already exists.";
    }
    return "A record with these details already exists.";
  }

  // Python Tracebacks or Internal Server Details
  if (
    trimmed.includes("Traceback (most recent call last)") ||
    trimmed.includes("SyntaxError:") ||
    trimmed.includes("NameError:") ||
    trimmed.includes("TypeError:")
  ) {
    return "An unexpected server error occurred. Please try again later.";
  }

  // Technical Axios / Status strings
  if (
    trimmed.includes("AxiosError:") ||
    trimmed.includes("Request failed with status code")
  ) {
    if (trimmed.includes("422")) {
      return "Please check the required fields and try again.";
    }
    if (trimmed.includes("404")) {
      return "The requested record was not found.";
    }
    if (trimmed.includes("401")) {
      return "Authentication failed. Please check your credentials.";
    }
    if (trimmed.includes("403")) {
      return "You do not have permission to perform this action.";
    }
    if (
      trimmed.includes("500") ||
      trimmed.includes("502") ||
      trimmed.includes("503") ||
      trimmed.includes("504")
    ) {
      return "Server error. Please try again later.";
    }
    return fallback;
  }

  // Network connection failures
  if (
    trimmed.includes("Failed to fetch") ||
    trimmed.includes("NetworkError") ||
    trimmed.includes("ERR_CONNECTION_REFUSED") ||
    trimmed.includes("Unable to connect to the server")
  ) {
    return "Unable to connect to the server. Please check your connection and try again.";
  }

  // Strip technical prefixes
  let clean = trimmed
    .replace(/^(Error:\s*|Exception:\s*|HTTPException:\s*|detail:\s*)/i, "")
    .trim();

  if (!clean || clean === "[object Object]") {
    return fallback;
  }

  // Ensure first character is uppercase
  clean = clean.charAt(0).toUpperCase() + clean.slice(1);

  return clean;
}

/**
 * Returns human-friendly message for HTTP status codes when no detail is provided.
 */
export function getStatusMessage(status, fallback) {
  const code = Number(status);
  switch (code) {
    case 400:
      return "Invalid request. Please check the provided information.";
    case 401:
      return "Session expired or invalid credentials. Please log in again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested record was not found.";
    case 409:
      return "This record already exists or conflicts with existing data.";
    case 422:
      return "Please check the required fields and try again.";
    case 500:
    case 502:
    case 503:
    case 504:
      return "Server error. Please try again later.";
    default:
      return fallback || "Operation failed. Please try again.";
  }
}

/**
 * Master error extraction helper.
 * Accepts an Error, response object, string, or unknown value and extracts
 * a concise, professional message.
 *
 * @param {*} error - The error object, string, or API response
 * @param {string} [fallback="Operation failed. Please try again."] - Contextual fallback message
 * @param {string} [context=""] - Optional context prefix (e.g. "Doctor registration failed")
 * @returns {string} - Clean, human-readable error message
 */
export function getErrorMessage(
  error,
  fallback = "Operation failed. Please try again.",
  context = ""
) {
  if (!error && !fallback) {
    return "An unexpected error occurred. Please try again.";
  }

  let raw = error;

  // Unwrap response / data wrappers
  if (raw?.response?.data !== undefined) {
    raw = raw.response.data;
  } else if (raw?.data !== undefined && typeof raw.data === "object" && raw.data !== null) {
    raw = raw.data;
  }

  // If raw is a string that might be JSON
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        raw = JSON.parse(trimmed);
      } catch {}
    }
  }

  let message = "";

  // 1. If string
  if (typeof raw === "string") {
    message = sanitizeErrorMessage(raw, fallback);
  }
  // 2. If array (FastAPI validation error list)
  else if (Array.isArray(raw)) {
    message = formatValidationErrors(raw) || fallback;
  }
  // 3. If object
  else if (raw && typeof raw === "object") {
    // FastAPI detail field
    if (raw.detail !== undefined) {
      if (typeof raw.detail === "string") {
        message = sanitizeErrorMessage(raw.detail, fallback);
      } else if (Array.isArray(raw.detail)) {
        message = formatValidationErrors(raw.detail) || fallback;
      } else if (typeof raw.detail === "object" && raw.detail !== null) {
        if (typeof raw.detail.msg === "string") {
          message = sanitizeErrorMessage(raw.detail.msg, fallback);
        } else if (typeof raw.detail.message === "string") {
          message = sanitizeErrorMessage(raw.detail.message, fallback);
        }
      }
    }

    // message, error, or msg fields
    if (!message && typeof raw.message === "string") {
      message = sanitizeErrorMessage(raw.message, fallback);
    }
    if (!message && typeof raw.error === "string") {
      message = sanitizeErrorMessage(raw.error, fallback);
    }
    if (!message && typeof raw.msg === "string") {
      message = sanitizeErrorMessage(raw.msg, fallback);
    }

    // Django / other frameworks non_field_errors
    if (!message && Array.isArray(raw.non_field_errors) && raw.non_field_errors.length > 0) {
      message = sanitizeErrorMessage(raw.non_field_errors[0], fallback);
    }

    // errors object: { field_name: ["msg"] }
    if (!message && raw.errors && typeof raw.errors === "object") {
      const firstKey = Object.keys(raw.errors)[0];
      if (firstKey) {
        const val = raw.errors[firstKey];
        const valStr = Array.isArray(val) ? val[0] : typeof val === "string" ? val : "";
        if (valStr) {
          const fieldName = humanizeFieldName(firstKey);
          message = `${fieldName}: ${valStr}`;
        }
      }
    }
  }

  // 4. Fallback to Error.message if available
  if (!message && error instanceof Error && typeof error.message === "string") {
    message = sanitizeErrorMessage(error.message, fallback);
  }

  // 5. Fallback to HTTP status code if message is still empty or generic
  const status = error?.status || error?.response?.status;
  if (!message || message === fallback) {
    if (status && status !== 200) {
      message = getStatusMessage(status, fallback);
    } else {
      message = fallback;
    }
  }

  // Ensure no [object Object] ever escapes
  if (message.includes("[object Object]")) {
    message = fallback;
  }

  // Append context if provided and meaningful
  if (context && !message.toLowerCase().includes(context.toLowerCase())) {
    return `${context}: ${message.charAt(0).toLowerCase() + message.slice(1)}`;
  }

  return message;
}

export default getErrorMessage;
