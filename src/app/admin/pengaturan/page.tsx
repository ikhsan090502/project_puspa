"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Settings, Bell, Shield, Database, Users, Mail, Save } from "lucide-react";

interface SettingsData {
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    assessmentReminders: boolean;
    scheduleReminders: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
  };
  system: {
    maintenanceMode: boolean;
    backupFrequency: string;
    logRetention: number;
  };
  general: {
    clinicName: string;
    clinicAddress: string;
    clinicPhone: string;
    clinicEmail: string;
    workingHours: string;
  };
}

export default function PengaturanPage() {
  const [settings, setSettings] = useState<SettingsData>({
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      assessmentReminders: true,
      scheduleReminders: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
    },
    system: {
      maintenanceMode: false,
      backupFrequency: "daily",
      logRetention: 90,
    },
    general: {
      clinicName: "PuspaCare Therapy Center",
      clinicAddress: "Jl. Sudirman No. 123, Jakarta Pusat",
      clinicPhone: "+62 21 1234 5678",
      clinicEmail: "info@puspacare.com",
      workingHours: "Senin - Jumat: 08:00 - 17:00, Sabtu: 08:00 - 12:00",
    },
  });

  const [activeTab, setActiveTab] = useState<"general" | "notifications" | "security" | "system">("general");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("✅ Pengaturan berhasil disimpan!");
    } catch (error) {
      alert("❌ Gagal menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (category: keyof SettingsData, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: "general", label: "Umum", icon: Settings },
    { id: "notifications", label: "Notifikasi", icon: Bell },
    { id: "security", label: "Keamanan", icon: Shield },
    { id: "system", label: "Sistem", icon: Database },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#36315B]">Pengaturan Sistem</h1>
              <p className="text-gray-600 mt-1">Kelola konfigurasi dan preferensi sistem PuspaCare</p>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-[#81B7A9] text-[#81B7A9]"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* General Settings */}
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-[#36315B] flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Informasi Klinik
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Klinik
                        </label>
                        <input
                          type="text"
                          value={settings.general.clinicName}
                          onChange={(e) => updateSetting("general", "clinicName", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#81B7A9] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Klinik
                        </label>
                        <input
                          type="email"
                          value={settings.general.clinicEmail}
                          onChange={(e) => updateSetting("general", "clinicEmail", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#81B7A9] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telepon Klinik
                        </label>
                        <input
                          type="tel"
                          value={settings.general.clinicPhone}
                          onChange={(e) => updateSetting("general", "clinicPhone", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#81B7A9] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jam Operasional
                        </label>
                        <input
                          type="text"
                          value={settings.general.workingHours}
                          onChange={(e) => updateSetting("general", "workingHours", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#81B7A9] focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alamat Klinik
                        </label>
                        <textarea
                          value={settings.general.clinicAddress}
                          onChange={(e) => updateSetting("general", "clinicAddress", e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#81B7A9] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-[#36315B] flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Pengaturan Notifikasi
                    </h2>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-[#36315B]">Notifikasi Email</h3>
                          <p className="text-sm text-gray-600">Kirim notifikasi melalui email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.emailNotifications}
                            onChange={(e) => updateSetting("notifications", "emailNotifications", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#81B7A9]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#81B7A9]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-[#36315B]">Notifikasi Push</h3>
                          <p className="text-sm text-gray-600">Kirim notifikasi push di browser</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.pushNotifications}
                            onChange={(e) => updateSetting("notifications", "pushNotifications", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#81B7A9]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#81B7A9]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-[#36315B]">Pengingat Assessment</h3>
                          <p className="text-sm text-gray-600">Kirim pengingat untuk assessment yang belum selesai</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.assessmentReminders}
                            onChange={(e) => updateSetting("notifications", "assessmentReminders", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#81B7A9]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#81B7A9]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-[#36315B]">Pengingat Jadwal</h3>
                          <p className="text-sm text-gray-600">Kirim pengingat untuk jadwal terapi</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.scheduleReminders}
                            onChange={(e) => updateSetting("notifications", "scheduleReminders", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#81B7A9]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#81B7A9]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-[#36315B] flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Pengaturan Keamanan
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-[#36315B]">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-600">Aktifkan autentikasi dua faktor</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.security.twoFactorAuth}
                            onChange={(e) => updateSetting("security", "twoFactorAuth", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#81B7A9]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#81B7A9]"></div>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timeout Sesi (menit)
                        </label>
                        <select
                          value={settings.security.sessionTimeout}
                          onChange={(e) => updateSetting("security", "sessionTimeout", parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#81B7A9] focus:border-transparent"
                        >
                          <option value={15}>15 menit</option>
                          <option value={30}>30 menit</option>
                          <option value={60}>1 jam</option>
                          <option value={120}>2 jam</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kadaluarsa Password (hari)
                        </label>
                        <select
                          value={settings.security.passwordExpiry}
                          onChange={(e) => updateSetting("security", "passwordExpiry", parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#81B7A9] focus:border-transparent"
                        >
                          <option value={30}>30 hari</option>
                          <option value={60}>60 hari</option>
                          <option value={90}>90 hari</option>
                          <option value={180}>180 hari</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* System Settings */}
                {activeTab === "system" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-[#36315B] flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Pengaturan Sistem
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-[#36315B]">Mode Maintenance</h3>
                          <p className="text-sm text-gray-600">Aktifkan mode maintenance sistem</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.system.maintenanceMode}
                            onChange={(e) => updateSetting("system", "maintenanceMode", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Frekuensi Backup
                        </label>
                        <select
                          value={settings.system.backupFrequency}
                          onChange={(e) => updateSetting("system", "backupFrequency", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#81B7A9] focus:border-transparent"
                        >
                          <option value="hourly">Per Jam</option>
                          <option value="daily">Harian</option>
                          <option value="weekly">Mingguan</option>
                          <option value="monthly">Bulanan</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Retensi Log (hari)
                        </label>
                        <select
                          value={settings.system.logRetention}
                          onChange={(e) => updateSetting("system", "logRetention", parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#81B7A9] focus:border-transparent"
                        >
                          <option value={30}>30 hari</option>
                          <option value={60}>60 hari</option>
                          <option value={90}>90 hari</option>
                          <option value={180}>180 hari</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h3 className="font-medium text-yellow-800 mb-2">⚠️ Peringatan</h3>
                      <p className="text-sm text-yellow-700">
                        Perubahan pada pengaturan sistem dapat mempengaruhi kinerja aplikasi.
                        Pastikan untuk melakukan backup sebelum melakukan perubahan signifikan.
                      </p>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-[#81B7A9] text-white rounded-lg hover:bg-[#6d9d8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Menyimpan..." : "Simpan Pengaturan"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
