import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AddVideo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { course } = location.state || {};
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false); // Loading state
  const [errors, setErrors] = useState({
    chapterTitle: "",
    videoTitle: "",
    videoFile: "",
    chapterSelection: "",
  });

  // Fetch chapters when the page loads
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login"); // Redirect to login if no token
      return;
    }

    fetchChapters();
  }, [course.id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file ? file.name : null);
  };
  const fetchChapters = async () => {
    try {
      const response = await fetch(`http://localhost:8084/api/courses/${course.id}/chapters`);
      if (!response.ok) throw new Error("Failed to fetch chapters");
      const data = await response.json();
      setChapters(data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  // Add a new chapter
  const handleAddChapter = async () => {
    if (!newChapterTitle) {
      setErrors((prev) => ({
        ...prev,
        chapterTitle: "عنوان الفصل مطلوب",
      }));
      return;
    }

    try {
      const response = await fetch(`http://localhost:8084/api/chapters/courses/${course.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newChapterTitle }),
      });

      if (!response.ok) throw new Error("Failed to add chapter");
      const data = await response.json();

      setChapters([...chapters, data]);
      setNewChapterTitle("");
      setErrors((prev) => ({
        ...prev,
        chapterTitle: "",
      }));
    } catch (error) {
      console.error("Error adding chapter:", error);
    }
  };

  // Delete a chapter
  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm("Are you sure you want to delete this chapter?")) return;

    try {
      await fetch(`http://localhost:8084/api/chapters/${chapterId}`, { method: "DELETE" });
      setChapters(chapters.filter((ch) => ch.id !== chapterId));
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
  };

  // Upload a video
  const handleVideoUpload = async () => {
    let isValid = true;

    if (!newVideoTitle) {
      setErrors((prev) => ({
        ...prev,
        videoTitle: "عنوان الفيديو مطلوب",
      }));
      isValid = false;
    }

    if (!selectedChapter) {
      setErrors((prev) => ({
        ...prev,
        chapterSelection: "يجب اختيار الفصل",
      }));
      isValid = false;
    }

    if (!videoFile) {
      setErrors((prev) => ({
        ...prev,
        videoFile: "ملف الفيديو مطلوب",
      }));
      isValid = false;
    }

    if (!isValid) return;

    setIsUploading(true); // Show loading indicator

    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("title", newVideoTitle);
    formData.append("chapterId", selectedChapter);

    try {
      const response = await fetch(`http://localhost:8084/api/videos/upload/${selectedChapter}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload video");

      const data = await response.json();
      console.log("Video upload response:", data);

      // Reset fields
      setVideoFile(null);
      setNewVideoTitle("");
      setErrors((prev) => ({
        ...prev,
        videoTitle: "",
        videoFile: "",
        chapterSelection: "",
      }));

      // Fetch updated chapters after a successful video upload
      await fetchChapters();

      alert("تم رفع الفيديو بنجاح!");
      navigate("/layout/ViewCourses");
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("فشل رفع الفيديو. حاول مرة أخرى.");
    } finally {
      setIsUploading(false); // Hide loading indicator
    }
  };

  // Delete a video
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await fetch(`http://localhost:8084/api/videos/${videoId}`, { method: "DELETE" });

      // Update state after deletion
      setChapters((prevChapters) =>
        prevChapters.map((chapter) => ({
          ...chapter,
          videos: chapter.videos.filter((video) => video.id !== videoId),
        }))
      );
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-right flex-1 mb-5 text-red">رفع فيديو للدورة</h1>
      <p className="text-right text-xl font-semibold mb-5">{course.name} : اسم الدورة </p>
        {/* Add Chapter */}
        <div className="mb-6 flex gap-3 text-right">
        <button
            className="p-3 bg-blue hover:bg-red py-2 px-20 text-white rounded-md  "
            onClick={handleAddChapter}
          >
           اضف
          </button>
          <input
            type="text"
            className="p-3 border rounded-md w-full shadow-sm text-right"
            placeholder="ادخل عنوان الفصل الجديد"
            value={newChapterTitle}
            onChange={(e) => setNewChapterTitle(e.target.value)}
          />
          {errors.chapterTitle && (
            <p className="text-red text-sm mt-1">{errors.chapterTitle}</p>
          )}

        </div>

        {/* Select Chapter */}
        <div className="mb-6 text-right">
          <select
            className="p-3 border rounded-md w-full shadow-sm text-right"
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
          >
            <option value="">اختر الفصل</option>
            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.title}
              </option>
            ))}
          </select>
          {errors.chapterSelection && (
            <p className="text-red text-sm mt-1">{errors.chapterSelection}</p>
          )}
        </div>

        {/* Video Upload Section */}
        <div className="mb-6 p-4 border rounded-md shadow-md bg-gray text-right">
          <div className="flex flex-col gap-3 text-right">
            <input
              type="text"
              className="p-3 border rounded-md w-full shadow-sm text-right"
              placeholder="ادخل عنوان الفيديو"
              value={newVideoTitle}
              onChange={(e) => setNewVideoTitle(e.target.value)}
            />
            {errors.videoTitle && (
              <p className="text-red text-sm mt-1">{errors.videoTitle}</p>
            )}
 <div className="flex items-center justify-end space-x-4">
      {/* Display Chosen File Name */}
      {videoFile && <span className="text-gray-700">{videoFile}</span>}

      {/* Custom File Input Button */}
      <label className="cursor-pointer bg-blue text-white px-4 py-2 rounded-md shadow-md hover:bg-red-500 transition text-center w-[200px] hover:bg-red">
        اختر الفيديو
        <input type="file" hidden onChange={handleFileChange} />
      </label>
    </div>


            {errors.videoFile && (
              <p className="text-red-500 text-sm mt-1">{errors.videoFile}</p>
            )}
            <button
                className={`p-3 rounded-md flex items-center justify-center gap-2 ${
                  isUploading ? "bg-gray cursor-not-allowed" : "bg-red hover:bg-blue text-white"
                }`}
                onClick={handleVideoUpload}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : <>إضافة الفيديو</>}
              </button>

          </div>
        </div>

        {/* Existing Chapters & Videos */}
        <h2 className="text-xl font-semibold mb-4 text-right text-blue">الفصول و الفيدوهات الحالية</h2>
        {chapters.map((chapter) => (
          <div key={chapter.id} className="mb-6 p-4 border rounded-md shadow-md bg-white">
            <div className="flex justify-between items-center">
              <button className="text-red flex items-center gap-2" onClick={() => handleDeleteChapter(chapter.id)}>
                <FaTrash /> ازالة الفصل
              </button>
              <h3 className="text-lg font-semibold">{chapter.title}</h3>
            </div>
            <div className="mt-2">
              {chapter.videos && chapter.videos.length > 0 ? (
                chapter.videos.map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-2 border rounded-md mt-2 bg-gray-100">
                    <button className="text-red flex items-center gap-2" onClick={() => handleDeleteVideo(video.id)}>
                      <FaTrash /> ازالو الفيديو
                    </button>
                    <span>{video.title}</span>
                  </div>
                ))
              ) : (
                <p className="text-red text-right text-sm">لا يوجد فيديوهات</p>
              )}
            </div>
          </div>
        ))}

      </div>
    </>
  );
};

export default AddVideo;
