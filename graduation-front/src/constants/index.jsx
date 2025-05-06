import {  LogOut, MessageCircle, NotepadText, Package, PackagePlus, User } from "lucide-react";
import ProfileImage from "../assets/images/profile-image.jpg"
import ProductImage from "../assets/images/course.jpg"
import { FaUserDoctor } from "react-icons/fa6";
import { MdLocalPharmacy } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
const token = localStorage.getItem("access_token");


let decoded = {};
if (token && typeof token === "string") {
    try {
        decoded = jwtDecode(token);
    } catch (e) {
        console.error("Failed to decode token:", e);
    }
}

const candidate = decoded?.candidate;
const position = decoded?.position || decoded?.title || decoded?.rol
export const navbarLinks = [
    {
        links: [
            {
                label: "ملف شخصى",
                icon: User,
                path: "/layout/AdminProfile",
            },
        ],
    },
    {
        links: [
            {
                label: "التقارير",
                icon: NotepadText,
                path: "/layout/Report",
            },
        ],
    },
    {
        links: [
            {
                label: "الاعتمادات",
                icon: FaUserDoctor,
                path: "/layout/Doctors",
            },
            ...(candidate === "الطب" || position === "مدير"
                ? [{
                    label: "الأطباء المعتمدين",
                    icon: FaUserDoctor,
                    path: "/layout/ApprovedDoctors",
                }]
                : []),
            ...(candidate === "الصيدلة" || position === "مدير"
                ? [{
                    label: "الصيادلة المعتمدين",
                    icon: MdLocalPharmacy,
                    path: "/layout/ApprovedPharmacists",
                }]
                : []),
        ],
    },
    {
        links: [
            {
                label: "الدورات التدريبية",
                icon: Package,
                path: "/layout/ViewCourses",
            },
            {
                label: "اضافة دورة تدريبية",
                icon: PackagePlus,
                path: "/layout/UploadCourse",
            },
            ...(position === "مدير"
                ? [{
                    label: "اضافة موظف جديد",
                    icon: FaUserDoctor,
                    path: "/layout/AdminRegister",
                }]
                : []),
            {
                label: "الشهادات",
                icon: PackagePlus,
                path: "/layout/Certifactes",
            },
        ],
    },
    {
        links: [
            {
                label: "الرسائل",
                icon: MessageCircle,
                path: "/layout/Messages"
            },
            {
                label: "تسجيل الخروج",
                icon: LogOut,
                path: "/logout",
            },
        ],
    },
];
export const overviewData = [
    {
        name: "Jan",
        total: 1500,
    },
    {
        name: "Feb",
        total: 2000,
    },
    {
        name: "Mar",
        total: 1000,
    },
    {
        name: "Apr",
        total: 5000,
    },
    {
        name: "May",
        total: 2000,
    },
    {
        name: "Jun",
        total: 5900,
    },
    {
        name: "Jul",
        total: 2000,
    },
    {
        name: "Aug",
        total: 5500,
    },
    {
        name: "Sep",
        total: 2000,
    },
    {
        name: "Oct",
        total: 4000,
    },
    {
        name: "Nov",
        total: 1500,
    },
    {
        name: "Dec",
        total: 2500,
    },
];
export const recentSalesData = [
    {
        id: 1,
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        image: ProfileImage,
        total: 1500,
    },
    {
        id: 2,
        name: "James Smith",
        email: "james.smith@email.com",
        image: ProfileImage,
        total: 2000,
    },
    {
        id: 3,
        name: "Sophia Brown",
        email: "sophia.brown@email.com",
        image: ProfileImage,
        total: 4000,
    },
    {
        id: 4,
        name: "Noah Wilson",
        email: "noah.wilson@email.com",
        image: ProfileImage,
        total: 3000,
    },
    {
        id: 5,
        name: "Emma Jones",
        email: "emma.jones@email.com",
        image: ProfileImage,
        total: 2500,
    },
    {
        id: 6,
        name: "William Taylor",
        email: "william.taylor@email.com",
        image: ProfileImage,
        total: 4500,
    },
    {
        id: 7,
        name: "Isabella Johnson",
        email: "isabella.johnson@email.com",
        image: ProfileImage,
        total: 5300,
    },
];

export const topProducts = [
    {
        number: 1,
        name: "Wireless Headphones",
        image: ProductImage,
        description: "High-quality noise-canceling wireless headphones.",
        price: 99.99,
        status: "In Stock",
        rating: 4.5,
    },
    {
        number: 2,
        name: "Smartphone",
        image: ProductImage,
        description: "Latest 5G smartphone with excellent camera features.",
        price: 799.99,
        status: "In Stock",
        rating: 4.7,
    },
    {
        number: 3,
        name: "Gaming Laptop",
        image: ProductImage,
        description: "Powerful gaming laptop with high-end graphics.",
        price: 1299.99,
        status: "In Stock",
        rating: 4.8,
    },
    {
        number: 4,
        name: "Smartwatch",
        image: ProductImage,
        description: "Stylish smartwatch with fitness tracking features.",
        price: 199.99,
        status: "Out of Stock",
        rating: 4.4,
    },
    {
        number: 5,
        name: "Bluetooth Speaker",
        image: ProductImage,
        description: "Portable Bluetooth speaker with deep bass sound.",
        price: 59.99,
        status: "In Stock",
        rating: 4.3,
    },
    {
        number: 6,
        name: "4K Monitor",
        image: ProductImage,
        description: "Ultra HD 4K monitor with stunning color accuracy.",
        price: 399.99,
        status: "In Stock",
        rating: 4.6,
    },
    {
        number: 7,
        name: "Mechanical Keyboard",
        image: ProductImage,
        description: "Mechanical keyboard with customizable RGB lighting.",
        price: 89.99,
        status: "In Stock",
        rating: 4.7,
    },
    {
        number: 8,
        name: "Wireless Mouse",
        image: ProductImage,
        description: "Ergonomic wireless mouse with precision tracking.",
        price: 49.99,
        status: "In Stock",
        rating: 4.5,
    },
    {
        number: 9,
        name: "Action Camera",
        image: ProductImage,
        description: "Waterproof action camera with 4K video recording.",
        price: 249.99,
        status: "In Stock",
        rating: 4.8,
    },
    {
        number: 10,
        name: "External Hard Drive",
        image: ProductImage,
        description: "Portable 2TB external hard drive for data storage.",
        price: 79.99,
        status: "Out of Stock",
        rating: 4.5,
    },
];
