import React, { useState } from "react";
import { Trash } from "lucide-react";

const initialPharmacistsList = [
  { id: 1, name: "د. علي مصطفى", specialty: "صيدلي سريري", contact: "ali.mostafa@email.com" },
  { id: 2, name: "د. ريم حسن", specialty: "تحضير الأدوية", contact: "reem.hassan@email.com" },
  { id: 3, name: "د. هاني يوسف", specialty: "صيدلي أبحاث", contact: "hani.youssef@email.com" },
  { id: 4, name: "د. ندى سامي", specialty: "استشاري أدوية", contact: "nada.sami@email.com" },
  { id: 5, name: "د. مازن إبراهيم", specialty: "صيدلي تصنيع", contact: "mazen.ibrahim@email.com" },
];

const Pharmacists = () => {
  const [pharmacists, setPharmacists] = useState(initialPharmacistsList);

  const handleDelete = (id) => {
    const updatedPharmacists = pharmacists.filter((pharmacist) => pharmacist.id !== id);
    setPharmacists(updatedPharmacists);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-right" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">قائمة الصيادلة</h1>
      <ul className="space-y-4">
        {pharmacists.map((pharmacist) => (
          <li
            key={pharmacist.id}
            className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
          >
            <div>
              <h2 className="text-lg font-semibold">{pharmacist.name}</h2>
              <p className="text-gray-700">التخصص: {pharmacist.specialty}</p>
              <p className="text-gray-700">البريد الإلكتروني: {pharmacist.contact}</p>
            </div>
            <button
              onClick={() => handleDelete(pharmacist.id)}
              className="text-red-500 hover:text-red-700"
              aria-label={`حذف ${pharmacist.name}`}
            >
              <Trash className="w-6 h-6" />
            </button>
          </li>
        ))}
      </ul>
      {pharmacists.length === 0 && (
        <p className="text-center text-gray-600 mt-4">لا توجد بيانات للصيادلة حاليًا.</p>
      )}
    </div>
  );
};

export default Pharmacists;
