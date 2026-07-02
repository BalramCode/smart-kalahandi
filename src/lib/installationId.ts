const INSTALLATION_ID_KEY = "smart_attendance_installation_id";

const createInstallationId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      Number(c) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
    ).toString(16)
  );
};

export const getInstallationId = () => {
  const existingId = localStorage.getItem(INSTALLATION_ID_KEY);
  if (existingId) {
    return existingId;
  }

  const installationId = createInstallationId();
  localStorage.setItem(INSTALLATION_ID_KEY, installationId);
  return installationId;
};
