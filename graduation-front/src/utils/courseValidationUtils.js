export const validateCourseForm = (courseData, chapters) => {
  const errors = {};

  // Course name validation
  if (!courseData.name?.trim()) {
    errors.name = "عنوان الدورة مطلوب";
  }

  // Course description validation
  if (!courseData.description?.trim()) {
    errors.description = "وصف الدورة مطلوب";
  }

  // Category validation
  if (!courseData.categoryName) {
    errors.categoryName = "يجب اختيار فئة";
  }

  // Image validation
  if (!courseData.imageFile) {
    errors.imageFile = "يرجى تحميل صورة للدورة";
  }

  // Chapters validation
  if (!chapters || chapters.length === 0) {
    errors.chapters = "يجب إضافة فصل واحد على الأقل";
  }

  return errors;
};

export const validateVideoForm = (videoData) => {
  const errors = {};

  // Video title validation
  if (!videoData.title?.trim()) {
    errors.videoTitle = "عنوان الفيديو مطلوب";
  }

  // Chapter selection validation
  if (!videoData.chapterId) {
    errors.chapterSelection = "يجب اختيار الفصل";
  }

  // Video file validation
  if (!videoData.file) {
    errors.videoFile = "ملف الفيديو مطلوب";
  } else {
    // Check file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(videoData.file.type)) {
      errors.videoFile = "نوع الملف غير مدعوم. يرجى تحميل ملف فيديو صالح";
    }

    // Check file size (max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB in bytes
    if (videoData.file.size > maxSize) {
      errors.videoFile = "حجم الملف كبير جداً. الحد الأقصى هو 500 ميجابايت";
    }
  }

  return errors;
};

export const validateChapterForm = (chapterTitle) => {
  const errors = {};

  if (!chapterTitle?.trim()) {
    errors.chapterTitle = "عنوان الفصل مطلوب";
  }

  return errors;
};

export const validateCategoryForm = (categoryName) => {
  const errors = {};

  if (!categoryName?.trim()) {
    errors.categoryName = "يجب ادخال اسم الفئة";
  }

  return errors;
};

export const validateEditCourseForm = (courseData) => {
  const errors = {};

  // Course name validation
  if (!courseData.name?.trim()) {
    errors.name = "عنوان الدورة مطلوب";
  }

  // Course description validation
  if (!courseData.description?.trim()) {
    errors.description = "وصف الدورة مطلوب";
  }

  // Category validation
  if (!courseData.categoryName) {
    errors.categoryName = "يجب اختيار فئة";
  }

  return errors;
}; 