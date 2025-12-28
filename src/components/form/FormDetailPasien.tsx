"use client";

export default function FormDetailPasien({
  open,
  onClose,
  pasien,
}: {
  open: boolean;
  onClose: () => void;
  pasien: any | null;
}) {
  if (!open || !pasien) return null;

  const renderOrangTua = (label: string, data: any) => (
    <div className="mt-3">
      <p className="font-medium">{label}</p>
      <ul className="text-sm text-[#36315B] space-y-1 ml-3">
        <li>• NIK : {data?.identity_number || "-"}</li>
        <li>• Nama : {data?.name || "-"}</li>
        <li>• Tanggal Lahir : {data?.birth_date || "-"}</li>
        <li>• Usia : {data?.age || "-"}</li>
        <li>• Pekerjaan : {data?.occupation || "-"}</li>
        <li>• Telepon : {data?.phone || "-"}</li>
        <li>• Hubungan : {data?.relationship || "-"}</li>
      </ul>
    </div>
  );

  const ayah = {
    identity_number: pasien.father_identity_number,
    name: pasien.father_name,
    phone: pasien.father_phone,
    birth_date: pasien.father_birth_date,
    age: pasien.father_age,
    occupation: pasien.father_occupation,
    relationship: pasien.father_relationship,
  };

  const ibu = {
    identity_number: pasien.mother_identity_number,
    name: pasien.mother_name,
    phone: pasien.mother_phone,
    birth_date: pasien.mother_birth_date,
    age: pasien.mother_age,
    occupation: pasien.mother_occupation,
    relationship: pasien.mother_relationship,
  };

  const wali = {
    identity_number: pasien.guardian_identity_number,
    name: pasien.guardian_name,
    phone: pasien.guardian_phone,
    birth_date: pasien.guardian_birth_date,
    age: pasien.guardian_age,
    occupation: pasien.guardian_occupation,
    relationship: pasien.guardian_relationship,
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[480px] max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-600 hover:text-[#81B7A9]"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-[#36315B] mb-3">
          Detail Pasien
        </h2>
        <hr className="border-t border-[#81B7A9] mb-3" />

        {/* ================= INFORMASI ANAK ================= */}
        <p className="text-sm font-medium text-[#36315B]">
          Informasi Anak
        </p>
        <ul className="text-sm text-[#36315B] space-y-1 mt-2">
          <li>• Nama Lengkap : {pasien.child_name || "-"}</li>
          <li>
            • Tempat, Tanggal Lahir :{" "}
            {pasien.child_birth_info || "-"}
          </li>
          <li>• Usia : {pasien.child_age || "-"}</li>
          <li>• Jenis Kelamin : {pasien.child_gender || "-"}</li>
          <li>• Agama : {pasien.child_religion || "-"}</li>
          <li>• Asal Sekolah : {pasien.child_school || "-"}</li>
          <li>• Alamat : {pasien.child_address || "-"}</li>
          <li>• Tanggal Ditambahkan : {pasien.created_at || "-"}</li>
          <li>• Tanggal Diubah : {pasien.updated_at || "-"}</li>
        </ul>

        {/* ================= ORANG TUA / WALI ================= */}
        <div className="mt-5">
          <p className="text-sm font-medium text-[#36315B]">
            Informasi Orangtua / Wali
          </p>

          {renderOrangTua("Ayah", ayah)}
          {renderOrangTua("Ibu", ibu)}
          {renderOrangTua("Wali (Jika Ada)", wali)}
        </div>

        {/* ================= KELUHAN ================= */}
        {pasien.child_complaint && (
          <div className="mt-4">
            <p className="text-sm font-medium text-[#36315B]">
              Keluhan
            </p>
            <p className="text-sm text-[#36315B] mt-1">
              {pasien.child_complaint}
            </p>
          </div>
        )}

        {/* ================= LAYANAN ================= */}
        {pasien.child_service_choice && (
          <div className="mt-4 mb-3">
            <p className="text-sm font-medium text-[#36315B]">
              Layanan Terpilih
            </p>
            <p className="text-sm text-[#36315B] mt-1">
              • {pasien.child_service_choice}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
