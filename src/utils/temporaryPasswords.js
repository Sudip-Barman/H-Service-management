const STORAGE_KEY = "carecore_workforce_temp_passwords";
const USERNAME_STORAGE_KEY = "carecore_workforce_usernames";

/**
 * Get all stored temporary passwords from localStorage.
 */
function getStorageMap(key = STORAGE_KEY) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Generate a friendly temporary password (e.g. Doctor@789).
 */
export function generateTemporaryPassword(role = "doctor") {
  const r = (role || "").toLowerCase();
  const prefix =
    r === "nurse"
      ? "Nurse"
      : r === "staff"
      ? "Staff"
      : "Doctor";
  const num = Math.floor(100 + Math.random() * 900);
  return `${prefix}@${num}`;
}

/**
 * Save temporary password and username for an employee across all available identifiers.
 */
export function saveTemporaryPassword({
  role,
  id,
  registration_number,
  username,
  email,
  password,
}) {
  try {
    const r = (role || "").toLowerCase();

    // Cache password
    if (password) {
      const map = getStorageMap(STORAGE_KEY);
      if (r && id) map[`${r}_id_${id}`] = password;
      if (id) map[`id_${id}`] = password;
      if (registration_number) map[`reg_${registration_number.toString().trim().toLowerCase()}`] = password;
      if (username) map[`user_${username.toString().trim().toLowerCase()}`] = password;
      if (email) map[`email_${email.toString().trim().toLowerCase()}`] = password;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    }

    // Cache username
    if (username) {
      const userMap = getStorageMap(USERNAME_STORAGE_KEY);
      if (r && id) userMap[`${r}_id_${id}`] = username;
      if (id) userMap[`id_${id}`] = username;
      if (registration_number) userMap[`reg_${registration_number.toString().trim().toLowerCase()}`] = username;
      if (email) userMap[`email_${email.toString().trim().toLowerCase()}`] = username;
      localStorage.setItem(USERNAME_STORAGE_KEY, JSON.stringify(userMap));
    }
  } catch (err) {
    console.warn("Could not cache temporary credentials:", err);
  }
}

/**
 * Retrieve the saved temporary password for an employee.
 */
export function getTemporaryPassword(employee = {}, roleHint = "") {
  if (employee?.temporary_password) {
    return employee.temporary_password;
  }

  try {
    const map = getStorageMap(STORAGE_KEY);
    const role = (employee?.role || roleHint || "").toLowerCase();
    const id = employee?.id ?? employee?.doctor_id ?? employee?.nurse_id ?? employee?.backend_id;
    const reg = employee?.registration_number ?? employee?.registrationNumber;
    const username = employee?.username;
    const email = employee?.email;

    if (role && id && map[`${role}_id_${id}`]) {
      return map[`${role}_id_${id}`];
    }
    if (id && map[`id_${id}`]) {
      return map[`id_${id}`];
    }
    if (reg && map[`reg_${reg.toString().trim().toLowerCase()}`]) {
      return map[`reg_${reg.toString().trim().toLowerCase()}`];
    }
    if (username && map[`user_${username.toString().trim().toLowerCase()}`]) {
      return map[`user_${username.toString().trim().toLowerCase()}`];
    }
    if (email && map[`email_${email.toString().trim().toLowerCase()}`]) {
      return map[`email_${email.toString().trim().toLowerCase()}`];
    }
  } catch (err) {
    console.warn("Could not retrieve temporary password:", err);
  }

  return "";
}

/**
 * Retrieve the saved username for an employee if not in object.
 */
export function getSavedUsername(employee = {}, roleHint = "") {
  if (employee?.username) {
    return employee.username;
  }

  try {
    const map = getStorageMap(USERNAME_STORAGE_KEY);
    const role = (employee?.role || roleHint || "").toLowerCase();
    const id = employee?.id ?? employee?.doctor_id ?? employee?.nurse_id ?? employee?.backend_id;
    const reg = employee?.registration_number ?? employee?.registrationNumber;
    const email = employee?.email;

    if (role && id && map[`${role}_id_${id}`]) return map[`${role}_id_${id}`];
    if (id && map[`id_${id}`]) return map[`id_${id}`];
    if (reg && map[`reg_${reg.toString().trim().toLowerCase()}`]) return map[`reg_${reg.toString().trim().toLowerCase()}`];
    if (email && map[`email_${email.toString().trim().toLowerCase()}`]) return map[`email_${email.toString().trim().toLowerCase()}`];
  } catch (err) {
    console.warn("Could not retrieve cached username:", err);
  }

  return "";
}

/**
 * Remove any cached temporary password for an employee once permanent password is set.
 */
export function clearTemporaryPassword(employee = {}, roleHint = "") {
  try {
    const map = getStorageMap(STORAGE_KEY);
    const role = (employee?.role || roleHint || "").toLowerCase();
    const id = employee?.id ?? employee?.doctor_id ?? employee?.nurse_id ?? employee?.backend_id;
    const reg = employee?.registration_number ?? employee?.registrationNumber;
    const username = employee?.username;
    const email = employee?.email;

    if (role && id) delete map[`${role}_id_${id}`];
    if (id) delete map[`id_${id}`];
    if (reg) delete map[`reg_${reg.toString().trim().toLowerCase()}`];
    if (username) delete map[`user_${username.toString().trim().toLowerCase()}`];
    if (email) delete map[`email_${email.toString().trim().toLowerCase()}`];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.warn("Could not clear temporary password cache:", err);
  }
}
