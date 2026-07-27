import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DEMO_DOCTORS, DEMO_PATIENTS } from "./auth";
import {
  getInitialAdminStore,
  INITIAL_AUDIT_LOGS,
  INITIAL_DISEASE_TEMPLATES,
  INITIAL_ROLES,
  saveAdminStore,
  type AdminStoreData
} from "./admin-store";

const LOCAL_STORAGE_ADMIN_KEY = "pulse_admin_store_v2";

describe("getInitialAdminStore (server / no window)", () => {
  it("returns demo data with derived clinical reports", () => {
    const store = getInitialAdminStore();

    expect(store.patients).toEqual(DEMO_PATIENTS);
    expect(store.doctors).toEqual(DEMO_DOCTORS);
    expect(store.templates).toEqual(INITIAL_DISEASE_TEMPLATES);
    expect(store.auditLogs).toEqual(INITIAL_AUDIT_LOGS);
    expect(store.roles).toEqual(INITIAL_ROLES);
    expect(store.reports.length).toBeGreaterThan(0);
    expect(store.reports.every((r) => r.patientId && r.doctorId)).toBe(true);
  });
});

describe("saveAdminStore (server / no window)", () => {
  it("is a no-op and does not throw when window is undefined", () => {
    expect(() => saveAdminStore({} as AdminStoreData)).not.toThrow();
  });
});

describe("admin store with a browser-like environment", () => {
  let memory: Record<string, string>;
  let store: Storage;

  beforeEach(() => {
    memory = {};
    store = {
      getItem: vi.fn((key: string) => (key in memory ? memory[key] : null)),
      setItem: vi.fn((key: string, value: string) => {
        memory[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete memory[key];
      }),
      clear: vi.fn(() => {
        memory = {};
      }),
      key: vi.fn(),
      length: 0
    } as unknown as Storage;

    vi.stubGlobal("window", {} as Window & typeof globalThis);
    vi.stubGlobal("localStorage", store);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("persists the store as JSON under the versioned key", () => {
    const data = getInitialAdminStore();
    saveAdminStore(data);

    expect(store.setItem).toHaveBeenCalledWith(
      LOCAL_STORAGE_ADMIN_KEY,
      JSON.stringify(data)
    );
    expect(JSON.parse(memory[LOCAL_STORAGE_ADMIN_KEY])).toEqual(data);
  });

  it("seeds and persists initial data when nothing is stored", () => {
    const result = getInitialAdminStore();

    expect(result.patients).toEqual(DEMO_PATIENTS);
    // Seeding writes the freshly built store back to localStorage.
    expect(store.setItem).toHaveBeenCalledTimes(1);
    expect(memory[LOCAL_STORAGE_ADMIN_KEY]).toBeDefined();
  });

  it("returns previously persisted data without reseeding", () => {
    const persisted: AdminStoreData = {
      patients: [{ id: "custom" } as never],
      doctors: [{ id: "doc" } as never],
      reports: [{ id: "rep" } as never],
      templates: [{ id: "tmpl" } as never],
      auditLogs: [],
      roles: []
    };
    memory[LOCAL_STORAGE_ADMIN_KEY] = JSON.stringify(persisted);

    const result = getInitialAdminStore();

    expect(result).toEqual(persisted);
    expect(store.setItem).not.toHaveBeenCalled();
  });

  it("falls back to seeding when stored JSON is corrupt", () => {
    memory[LOCAL_STORAGE_ADMIN_KEY] = "{not valid json";

    const result = getInitialAdminStore();

    expect(result.patients).toEqual(DEMO_PATIENTS);
    expect(store.setItem).toHaveBeenCalledTimes(1);
  });
});
