const PROFILE_KEY = "yummy_profile";

export const DEFAULT_PROFILE = {
  name: "Cliente Yummy", email: "cliente@yummy.com", phone: "", birthDate: "",
  addresses: [], payments: [], favorites: [],
};

export function getProfile() {
  try { return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}") }; }
  catch { return DEFAULT_PROFILE; }
}

export function saveProfile(nextProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(nextProfile));
  return nextProfile;
}

export function updateProfile(changes) { return saveProfile({ ...getProfile(), ...changes }); }
