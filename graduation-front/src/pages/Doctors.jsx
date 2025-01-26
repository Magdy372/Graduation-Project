import React, { useState } from "react";
import { Trash } from "lucide-react";

const initialDoctorsList = [
  { id: 1, name: "د. أحمد علي", specialty: "أخصائي أمراض القلب", contact: "ahmed.ali@email.com" },
  { id: 2, name: "د. سارة حسين", specialty: "أخصائية الأمراض الجلدية", contact: "sara.hussein@email.com" },
  { id: 3, name: "د. عمر خالد", specialty: "طبيب أطفال", contact: "omar.khaled@email.com" },
  { id: 4, name: "د. منى صالح", specialty: "أخصائية الأعصاب", contact: "mona.saleh@email.com" },
  { id: 5, name: "د. كريم زكي", specialty: "أخصائي جراحة العظام", contact: "kareem.zaki@email.com" },
];

const Doctors = () => {
  const [doctors, setDoctors] = useState(initialDoctorsList);

  const handleDelete = (id) => {
    const updatedDoctors = doctors.filter((doctor) => doctor.id !== id);
    setDoctors(updatedDoctors);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-right" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">قائمة الأطباء</h1>
      <ul className="space-y-4">
        {doctors.map((doctor) => (
          <li
            key={doctor.id}
            className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
          >
            <div>
              <h2 className="text-lg font-semibold">{doctor.name}</h2>
              <p className="text-gray-700">التخصص: {doctor.specialty}</p>
              <p className="text-gray-700">البريد الإلكتروني: {doctor.contact}</p>
            </div>
            <button
              onClick={() => handleDelete(doctor.id)}
              className="text-red-500 hover:text-red-700"
              aria-label={`حذف ${doctor.name}`}
            >
              <Trash className="w-6 h-6" />
            </button>
          </li>
        ))}
      </ul>
      {doctors.length === 0 && (
        <p className="text-center text-gray-600 mt-4">لا توجد بيانات للأطباء حاليًا.</p>
      )}
    </div>
  );
};

export default Doctors;
