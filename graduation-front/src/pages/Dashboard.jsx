import { useTheme } from "../hooks/use-theme";
import { CreditCard, DollarSign, Package, PencilLine, Star, Trash, TrendingUp, Users } from "lucide-react";
import {Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { overviewData, recentSalesData, topProducts  } from "../constants";
import { ThemeProvider } from "../contexts/theme-context";
import { ThemeContext } from "@emotion/react";
import { FaUserMd, FaBook, FaPills, FaCalendarAlt} from "react-icons/fa";



import Footer from "../components/Footer";
const DashboardPage = () => {
    return (
      <div className="flex flex-col gap-y-4">
        <h1 className="title text-right">لوحة البيانات</h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="card">
    <div className="card-header flex justify-end items-center">
        <p className="card-title ml-3">جميع الدورات التدريبية</p>
        <div className="rounded-lg w-fit bg-blue-500/20 p-2 text-red transition-colors dark:bg-blue-600/20 dark:text-blue-600">
            <FaBook size={26} />
        </div>
    </div>

    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950 text-right">
        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">25,154</p>
        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
            <TrendingUp size={18} />
            25%
        </span>
    </div>
</div>

<div className="card">
    <div className="card-header flex justify-end items-center">
        <p className="card-title ml-3" >جميع الأطباء </p>
        <div className="rounded-lg bg-blue-500/20 p-2 text-red transition-colors dark:bg-blue-600/20 dark:text-blue-600">
            <FaUserMd size={26} />
        </div>
    </div>
    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950 text-right">
        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">$16,000</p>
        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
            <TrendingUp size={18} />
            12%
        </span>
    </div>
</div>

<div className="card">
    <div className="card-header flex justify-end items-center">
        <p className="card-title ml-3">جميع الصيادلة</p>
        <div className="rounded-lg bg-blue-500/20 p-2 text-red transition-colors dark:bg-blue-600/20 dark:text-blue-600">
            <FaPills size={26} />
        </div>
    </div>
    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950 text-right">
        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">15,400k</p>
        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
            <TrendingUp size={18} />
            15%
        </span>
    </div>
</div>

<div className="card">
    <div className="card-header flex justify-end items-center">
        <p className="card-title ml-3">المؤتمرات</p>
        <div className="rounded-lg bg-blue-500/20 p-2 text-red transition-colors dark:bg-blue-600/20 dark:text-blue-600">
            <FaCalendarAlt size={26} />
        </div>
    </div>
    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950 text-right">
        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">12,340</p>
        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
            <TrendingUp size={18} />
            19%
        </span>
    </div>
</div>

                
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
      <div className="card col-span-1 md:col-span-2 lg:col-span-4">
      <div className="card-header flex">
    <p className="card-title ml-auto">مخطط نظرة عامة</p>




                    </div>
                    <div className="card-body p-0">
        <ResponsiveContainer
        width="100%"
        height={300}
        >
          <AreaChart data={overviewData} margin={{
                                    top: 0,
                                    right: 0,
                                    left: 0,
                                    bottom: 0,
                                }} >
           <defs>
                                    <linearGradient
                                        id="colorTotal"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#2563eb"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#2563eb"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    cursor={false}
                                    formatter={(value) => `$${value}`}
                                    
                                />
                                <XAxis
                                dataKey="name"
                                strokewidth={0}
                                stroke={ThemeContext === "light" ? "#475569" : "#94a3b8"}
                                />
                                 <YAxis
                                    dataKey="total"
                                    strokeWidth={0}
                                    stroke={ThemeContext === "light" ? "#475569" : "#94a3b8"}
                                    tickFormatter={(value) => `$${value}`}
                                    tickMargin={6}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#2563eb"
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                                </AreaChart>
        </ResponsiveContainer>
      </div>
                  
      </div>
     
      <div className="card col-span-1 md:col-span-2 lg:col-span-3">
      <div className="card-header flex justify-end">
    <p className="card-title">اكفأ الأطباء</p>
</div>
<div className="card-body h-[300px] overflow-auto p-0">
    {recentSalesData.map((sale) => (
        <div
            key={sale.id}
            className="flex items-center justify-between gap-x-4 py-2 pl-2" // Adjusted padding for RTL
        >
            <p className="font-medium text-slate-900 dark:text-slate-50">${sale.total}</p>
            <div className="flex items-center"> {/* Removed gap between name and image */}
                <p className="font-medium text-slate-900 dark:text-slate-50 mr-2">{sale.name}</p> {/* Added margin-right for spacing */}
                <img
                    src={sale.image}
                    alt={sale.name}
                    className="size-10 flex-shrink-0 rounded-full object-cover"
                />
            </div>
        </div>
    ))}
</div>


</div>
      </div>
      <div className="card">
      <div className="card-header flex">
    <p className="card-title ml-auto">الدورات التدريبية</p>
</div>

                <div className="card-body p-0">
                <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin] flex justify-start" style={{ direction: 'rtl' }}>
    


  


                        <table className="table">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head">#</th>
                                    <th className="table-head">الدورات التدريبية</th>
                                    <th className="table-head px-2">التقييم</th>
                                    <th className="table-head px-2">الإجراءات</th>

                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {topProducts.map((product) => (
                                    <tr
                                        key={product.number}
                                        className="table-row"
                                    >
                                        <td className="table-cell">{product.number}</td>
                                        <td className="table-cell">
                                            <div className="flex w-max gap-x-4">
                                            <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="size-14 rounded-lg object-cover"
                                                />
                                                <div className="flex flex-col">
                                                    <p>{product.name}</p>
                                                    <p className="font-normal text-slate-600 dark:text-slate-400">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-2">
                                                <Star
                                                    size={18}
                                                    className="fill-yellow-600 stroke-yellow-600"
                                                />
                                                {product.rating}
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button className="text-blue-500 dark:text-blue-600">
                                                    <PencilLine size={20} />
                                                </button>
                                                <button className="text-red-500">
                                                    <Trash size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>
                <Footer />
      </div>
    )
  }
  
  export default DashboardPage