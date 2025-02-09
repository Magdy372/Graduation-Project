import React from "react";
import { Form, Rate, Input, Button, message } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FeedbackForm = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      
      await axios.post("http://localhost:8084/feedback", {
        ...values,
        userId: userId,
      });

      message.success("Feedback submitted successfully!");
      navigate("/");
    } catch (error) {
      message.error("Submission failed!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="w-full max-w-lg bg-white rounded-xl shadow-md p-8"
        >
          <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">
            Submit Feedback
          </h2>
          <Form onFinish={onFinish} layout="vertical" className="space-y-4">
            <Form.Item
              name="overallRating"
              label="Overall Rating"
              rules={[{ required: true }]}
            >
              <Rate className="text-yellow-500" />
            </Form.Item>

            <Form.Item
              name="easeOfUseRating"
              label="Ease of Use"
              rules={[{ required: true }]}
            >
              <Rate className="text-yellow-500" />
            </Form.Item>

            <Form.Item
              name="contentQualityRating"
              label="Content Quality"
              rules={[{ required: true }]}
            >
              <Rate className="text-yellow-500" />
            </Form.Item>

            <Form.Item
              name="supportSatisfactionRating"
              label="Support Satisfaction"
              rules={[{ required: true }]}
            >
              <Rate className="text-yellow-500" />
            </Form.Item>

            <Form.Item name="comments" label="Comments">
              <Input.TextArea rows={4} className="border rounded-md p-2" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300"
            >
              Submit Feedback
            </Button>
          </Form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default FeedbackForm;