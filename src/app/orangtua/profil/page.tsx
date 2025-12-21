"use client";

import React, { useEffect, useState } from "react";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import { getParentProfile, updateParentProfile } from "@/lib/api/profile";
import { useProfile } from "@/context/ProfileContext";
import { User } from "lucide-react";

export default function ProfileOrangtuaPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [guardianId, setGuardianId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { refreshProfile } = useProfile();

  interface FormData {
    guardian_name: string;
    guardian_type: string;
    relationship_with_child: string;
    guardian_birth_date: string;
    guardian_phone: string;
    email: string;
    guardian_occupation: string;
    role: string;
    profile_picture: string | null;
  }

  const [formData, setFormData] = useState<FormData>({
    guardian_name: "",
    guardian_type: "",
    relationship_with_child: "",
    guardian_birth_date: "",
    guardian_phone: "",
    email: "",
    guardian_occupation: "",
    role: "",
    profile_picture: null,
  });

  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await getParentProfile(token);
      if (res?.success && res.data) {
        const d = res.data;
        setGuardianId(d.guardian_id);

        setFormData({
          guardian_name: d.guardian_name || "",
          guardian_type: d.guardian_type || "",
          relationship_with_child: d.relationship_with_child || "",
          guardian_birth_date: d.guardian_birth_date || "",
          guardian_phone: d.guardian_phone || "",
          email: d.email || "",
          guardian_occupation: d.guardian_occupation || "",
          role: d.role || "",
          profile_picture: d.profile_picture || null,
        });
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const fd = new FormData();
    if (selectedFile) fd.append("file", selectedFile);

    fd.append("guardian_name", formData.guardian_name);
    fd.append("guardian_type", formData.guardian_type);
    fd.append("relationship_with_child", formData.relationship_with_child);
    fd.append("guardian_birth_date", formData.guardian_birth_date);
    fd.append("guardian_phone", formData.guardian_phone);
    fd.append("email", formData.email);
    fd.append("guardian_occupation", formData.guardian_occupation);

    const res = await updateParentProfile(guardianId, fd);

    if (res?.success) {
      alert("Profil berhasil diperbarui!");
      setIsEditing(false);

      if (res.data?.profile_picture) {
        setFormData((prev) => ({
          ...prev,
          profile_picture: res.data.profile_picture,
        }));
      }

      refreshProfile();
    }
  };

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-4xl">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {!isEditing ? (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Foto profil */}
            <div className="flex flex-col items-center text-center p-6 shadow rounded-xl bg-white">
              {formData.profile_picture ? (
                <img
                  src={formData.profile_picture}
                  className="w-40 h-40 rounded-full object-cover"
                  alt="Foto Profil"
                />
              ) : (
                <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-500" />
                </div>
              )}
              <h2 className="text-xl font-semibold text-[#4A8B73] mt-4">
                {formData.guardian_name}
              </h2>
              <p className="text-gray-500 text-sm">{formData.role}</p>
            </div>

            {/* Info profil */}
            <div className="flex-1 shadow rounded-xl p-6 bg-white relative">
              <button
                onClick={() => setIsEditing(true)}
                className="absolute right-4 top-4 text-white bg-[#8EC3AA] px-4 py-1 rounded-full text-sm"
              >
                Edit
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm mt-6">
                <p className="font-semibold">Nama</p>
                <p>{formData.guardian_name}</p>

                <p className="font-semibold">Hubungan</p>
                <p>{formData.relationship_with_child}</p>

                <p className="font-semibold">Tanggal Lahir</p>
                <p>{formData.guardian_birth_date}</p>

                <p className="font-semibold">Telepon</p>
                <p>{formData.guardian_phone}</p>

                <p className="font-semibold">Email</p>
                <p>{formData.email}</p>

                <p className="font-semibold">User Role</p>
                <p>{formData.role}</p>

                <p className="font-semibold">Pekerjaan</p>
                <p>{formData.guardian_occupation}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="shadow-lg rounded-xl p-6 bg-white">
            <h2 className="text-xl font-semibold text-[#4A8B73] mb-4">
              Informasi Pribadi
            </h2>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Foto dan upload */}
              <div className="flex flex-col items-center shadow p-5 rounded-xl">
                {selectedFile ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    className="w-40 h-40 rounded-full object-cover"
                    alt="Foto Profil"
                  />
                ) : formData.profile_picture ? (
                  <img
                    src={formData.profile_picture}
                    className="w-40 h-40 rounded-full object-cover"
                    alt="Foto Profil"
                  />
                ) : (
                  <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-500" />
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="mt-3 text-sm"
                  onChange={(e) =>
                    setSelectedFile(e.target.files?.[0] || null)
                  }
                />
              </div>

              {/* Form input */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Nama</label>
                  <input
                    name="guardian_name"
                    value={formData.guardian_name}
                    onChange={handleChange}
                    className="border rounded px-3 py-1 w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Telepon</label>
                  <input
                    name="guardian_phone"
                    value={formData.guardian_phone}
                    onChange={handleChange}
                    className="border rounded px-3 py-1 w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Hubungan</label>
                  <input
                    name="relationship_with_child"
                    value={formData.relationship_with_child}
                    onChange={handleChange}
                    className="border rounded px-3 py-1 w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Pekerjaan</label>
                  <input
                    name="guardian_occupation"
                    value={formData.guardian_occupation}
                    onChange={handleChange}
                    className="border rounded px-3 py-1 w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border rounded px-3 py-1 w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="guardian_birth_date"
                    value={formData.guardian_birth_date}
                    onChange={handleChange}
                    className="border rounded px-3 py-1 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Button aksi */}
            <div className="flex flex-col sm:flex-row justify-end mt-6 gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded bg-gray-300 w-full sm:w-auto"
              >
                Batal
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded bg-[#8EC3AA] text-white w-full sm:w-auto"
              >
                Perbarui
              </button>
            </div>
          </div>
        )}
      </div>
    </ResponsiveOrangtuaLayout>
  );
}
