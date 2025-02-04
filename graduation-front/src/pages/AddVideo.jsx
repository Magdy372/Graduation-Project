import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AddVideo = () => {
  const location = useLocation();
  const { course } = location.state || {};
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newVideoTitle, setNewVideoTitle] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8087/api/courses/${course.id}/chapters`)
      .then((response) => response.json())
      .then((data) => setChapters(data))
      .catch((error) => console.error("Error fetching chapters:", error));
  }, [course.id]);

  // Add a new chapter
  const handleAddChapter = () => {
    if (!newChapterTitle) return alert("Chapter title is required");
    fetch(`http://localhost:8087/api/chapters/courses/${course.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newChapterTitle }),
    })
      .then((response) => response.json())
      .then((data) => {
        setChapters([...chapters, data]);
        setNewChapterTitle("");
      })
      .catch((error) => console.error("Error adding chapter:", error));
  };

  // Delete a chapter
  const handleDeleteChapter = (chapterId) => {
    if (!window.confirm("Are you sure you want to delete this chapter?")) return;
    fetch(`http://localhost:8087/api/chapters/${chapterId}`, { method: "DELETE" })
      .then(() => {
        setChapters(chapters.filter((ch) => ch.id !== chapterId));
      })
      .catch((error) => console.error("Error deleting chapter:", error));
  };

  // Upload a video
  // Upload a video and refresh chapters to show newly added video
const handleVideoUpload = () => {
    if (!videoFile || !selectedChapter || !newVideoTitle) {
      return alert("Please select a chapter, video file, and enter a title");
    }
  
    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("title", newVideoTitle);
  
    fetch(`http://localhost:8087/api/videos/upload/${selectedChapter}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json()) // Ensure we get the updated video data
      .then(() => {
        setVideoFile(null);
        setNewVideoTitle("");
  
        // Fetch updated chapters after a successful video upload
        fetch(`http://localhost:8087/api/courses/${course.id}/chapters`)
          .then((res) => res.json())
          .then((data) => setChapters(data));
  
        alert("Video uploaded successfully!");
      })
      .catch((error) => console.error("Error uploading video:", error));
  };
  const handleDeleteVideo = (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
  
    fetch(`http://localhost:8087/api/videos/${videoId}`, { method: "DELETE" })
      .then(() => {
        // Update state after deletion
        setChapters((prevChapters) =>
          prevChapters.map((chapter) => ({
            ...chapter,
            videos: chapter.videos.filter((video) => video.id !== videoId),
          }))
        );
      })
      .catch((error) => console.error("Error deleting video:", error));
  };
  

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-center mb-8">Manage Videos for {course.name}</h1>

        {/* Add Chapter */}
        <div className="mb-6 flex gap-3">
          <input
            type="text"
            className="p-3 border rounded-md w-full shadow-sm"
            placeholder="Enter new chapter title"
            value={newChapterTitle}
            onChange={(e) => setNewChapterTitle(e.target.value)}
          />
          <button className="p-3 bg-green-500 text-white rounded-md flex items-center gap-2"
            onClick={handleAddChapter}>
            <FaPlus /> Add Chapter
          </button>
        </div>

        {/* Select Chapter */}
        <div className="mb-6">
          <label className="block text-lg font-semibold">Select Chapter:</label>
          <select
            className="p-3 border rounded-md w-full shadow-sm"
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
          >
            <option value="">Select a Chapter</option>
            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>{chapter.title}</option>
            ))}
          </select>
        </div>

        {/* Video Upload Section */}
        <div className="mb-6 p-4 border rounded-md shadow-md bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Upload Video</h2>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              className="p-3 border rounded-md w-full shadow-sm"
              placeholder="Enter video title"
              value={newVideoTitle}
              onChange={(e) => setNewVideoTitle(e.target.value)}
            />
            <input type="file" className="p-2 border rounded-md" onChange={(e) => setVideoFile(e.target.files[0])} />
            <button
              
              onClick={handleVideoUpload}
            >
              <FaPlus /> Submit Video
            </button>
          </div>
        </div>

        {/* Existing Chapters & Videos */}
        <h2 className="text-2xl font-semibold mb-4">Existing Chapters & Videos</h2>
        {chapters.map((chapter) => (
          <div key={chapter.id} className="mb-6 p-4 border rounded-md shadow-md bg-white">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{chapter.title}</h3>
              <button
                className="text-red-500 flex items-center gap-2"
                onClick={() => handleDeleteChapter(chapter.id)}
              >
                <FaTrash /> Delete Chapter
              </button>
            </div>
            <div className="mt-2">
              {chapter.videos && chapter.videos.length > 0 ? (
                chapter.videos.map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-2 border rounded-md mt-2 bg-gray-100">
                    <span>{video.title}</span>
                    <button
                      className="text-red-500 flex items-center gap-2"
                      onClick={() => handleDeleteVideo(video.id)}
                    >
                      <FaTrash /> Delete Video
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No videos available</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default AddVideo;
