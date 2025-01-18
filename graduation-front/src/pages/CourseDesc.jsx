import Navbar from "../components/Navbar";
import { IoBookOutline } from "react-icons/io5";
import { BiCategoryAlt, BiGlobe, BiPlayCircle } from "react-icons/bi";
import { Card, CardHeader, CardContent, CardTitle } from '@mui/material';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import courseImage from "../assets/images/course.jpg"; // Import the image

const CourseDesc = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="bg-red text-white p-8 rounded-t-lg">
          <h1 className="text-3xl font-bold mb-4">
            Pharmacology and Therapeutics
          </h1>
          <p className="text-xl mb-4">Course details</p>
          <div className="flex items-center space-x-4 mt-2 text-sm">
            <span className="flex items-center space-x-1">
              <BiCategoryAlt />
              <span>Category</span>
            </span>
            <span className="flex items-center space-x-1">
              <IoBookOutline />
              <span>Course chapters</span>
            </span>
            <span className="flex items-center space-x-1">
              <BiGlobe />
              <span>English</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>Number of enrolled people</span>
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mt-8">
            <main className="flex-group">
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>What you will learn</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            Objectives
                            <li className="flex items-start">
                                <IoMdCheckmarkCircleOutline className="mr-2 h-5 w-5 text-green-500 flex-shrink-0"/>
                                <span>objective </span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Course Chapters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <li>
                      <BiPlayCircle className="mr-2 h-4 w-4"/>
                      <span>Part 1</span>
                    </li>
                    <li>
                      <BiPlayCircle className="mr-2 h-4 w-4"/>
                      <span>Part 2</span>
                    </li>
                    <li>
                      <BiPlayCircle className="mr-2 h-4 w-4"/>
                      <span>Part 3</span>
                    </li>
                    <li>
                      <BiPlayCircle className="mr-2 h-4 w-4"/>
                      <span>Part 4</span>
                    </li>
                    <li>
                      <BiPlayCircle className="mr-2 h-4 w-4"/>
                      <span>Part 5</span>
                    </li>
                  </CardContent>
                </Card>
            </main>
            <aside className="w-full md:w-[500px]">
              <Card className="stickey top-4">
                <CardContent className="p-6">
                  <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                    <img className="w-[450px] h-[200px]"src={courseImage} alt="" />
                  </div>
                  <button className="text-white text-semibold text-medium w-full bg-blue hover:bg-red">Enroll Now</button>
                </CardContent>
              </Card>
            </aside>
        </div>
      </div>
    </>
  );
};

export default CourseDesc;
