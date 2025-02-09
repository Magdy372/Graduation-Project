import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaCommentDots, FaStar } from "react-icons/fa";
import { TrendingUp } from "lucide-react";

const Report = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8084/feedback");
      const data = await response.json();
      setFeedbacks(data);
      calculateAverages(data);
    };
    fetchData();
  }, []);

  const calculateAverages = (data) => {
    const total = data.length;
    if (total === 0) return;

    const sums = { overall: 0, easeOfUse: 0, contentQuality: 0, support: 0 };
    data.forEach((f) => {
      sums.overall += f.overallRating;
      sums.easeOfUse += f.easeOfUseRating;
      sums.contentQuality += f.contentQualityRating;
      sums.support += f.supportSatisfactionRating;
    });

    setAverageRatings({
      overall: (sums.overall / total).toFixed(1),
      easeOfUse: (sums.easeOfUse / total).toFixed(1),
      contentQuality: (sums.contentQuality / total).toFixed(1),
      support: (sums.support / total).toFixed(1),
    });
  };

  const chartData = [
    { name: "التقييم العام", rating: averageRatings.overall },
    { name: "سهولة الاستخدام", rating: averageRatings.easeOfUse },
    { name: "جودة المحتوى", rating: averageRatings.contentQuality },
    { name: "رضا الدعم الفني", rating: averageRatings.support },
  ];
  

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-red">تقرير ملاحظات المستخدمين</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.keys(averageRatings).map((key) => (
          <div key={key} className="card">
            <div className="card-header flex justify-between items-center">
              <p className="card-title capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
              <div className="rounded-lg bg-blue-500/20 p-2 dark:bg-blue-600/20 dark:text-blue-600">
                <FaStar size={26} />
              </div>
            </div>
            <div className="card-body bg-slate-100 dark:bg-slate-950">
              <p className="text-3xl font-bold">{averageRatings[key]}</p>
              <span className="flex items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500">
                <TrendingUp size={18} />
                +5%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header flex justify-between">
          <p className="  text-blue font-semibold text-xl">مخطط التقييمات المتوسطة</p>
        </div>
        <div className="card-body p-0">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name"/>
            <YAxis domain={[0, 5]} orientation="right" />
            <Tooltip />
            <Bar dataKey="rating" fill="#4F46E5" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>

      <div className="card">
        <div className="card-header flex justify-between">
          <p className="text-blue font-semibold text-xl">تعليقات المستخدمين</p>
        </div>
        <div className="card-body h-[300px] overflow-auto p-0">
          {feedbacks.map((feedback, index) => (
            <div key={index} className="flex items-center justify-between gap-x-4 py-2 pl-2">
              <p className="font-medium text-red dark:text-slate-50">{feedback.userName}</p>
              <p className="text-blue dark:text-gray-300">{feedback.comments}</p>
              <FaCommentDots size={20} className="text-blue" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Report;
