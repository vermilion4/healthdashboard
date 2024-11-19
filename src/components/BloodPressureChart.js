import React, { useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Select } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
        legend: {
            display: false
        },
        title: {
            display: false
        }
    },
    scales: {
        y: {
            min: 50,
            max: 200,
            grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.05)'
            }
        },
        x: {
            grid: {
                display: false
            }
        }
    }
};

const timeRangeOptions = [
    { value: 6, label: 'Last 6 Months' },
    { value: 3, label: 'Last 3 Months' },
    { value: 1, label: 'Last Month' }
];

const monthAbbreviations = {
    'January': 'Jan',
    'February': 'Feb',
    'March': 'Mar',
    'April': 'Apr',
    'May': 'May',
    'June': 'Jun',
    'July': 'Jul',
    'August': 'Aug',
    'September': 'Sep',
    'October': 'Oct',
    'November': 'Nov',
    'December': 'Dec'
};

const BloodPressureChart = ({ diagnosisHistory }) => {
    const [timeRange, setTimeRange] = useState(6);

    // Get the selected months of data
    const selectedMonths = diagnosisHistory?.slice(0, timeRange) || [];

    // Chart data
    const labels = selectedMonths.map(reading => 
        `${monthAbbreviations[reading.month]} ${reading.year}`
    ).reverse();
    
    const systolicData = selectedMonths.map(reading => ({
        value: reading.blood_pressure.systolic.value,
        status: reading.blood_pressure.systolic.levels
    })).reverse();

    const diastolicData = selectedMonths.map(reading => ({
        value: reading.blood_pressure.diastolic.value,
        status: reading.blood_pressure.diastolic.levels
    })).reverse();

    const data = {
        labels,
        datasets: [
            {
                label: 'Systolic',
                data: systolicData.map(d => d.value),
                borderColor: '#E66FD2',
                backgroundColor: '#E66FD2',
                tension: 0.4,
                pointStyle: 'circle',
            },
            {
                label: 'Diastolic',
                data: diastolicData.map(d => d.value),
                borderColor: '#8C6FE6',
                backgroundColor: '#8C6FE6',
                tension: 0.4,
                pointStyle: 'circle',
            }
        ]
    };

    return (
        <div className="h-[300px] relative bg-[#F4F0FE] rounded-xl p-4">
            <div className="h-full flex flex-col lg:flex-row gap-4 lg:gap-8">
                {/* Left Column */}
                <div className="h-[200px] sm:h-[170px] lg:h-full w-full lg:w-[70%]">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg">Blood Pressure</h3>
                        <Select
                            defaultValue={6}
                            onChange={setTimeRange}
                            options={timeRangeOptions}
                            className="w-40 text-sm"
                            bordered={false}
                            popupClassName="border-none"
                            style={{ 
                                backgroundColor: 'transparent'
                            }}
                        />
                    </div>
                    <div className="h-[calc(100%-28px)]">
                        <Line options={{
                            ...options,
                            maintainAspectRatio: false,
                        }} data={data} />
                    </div>
                </div>
                
                {/* Right Column */}
                <div className="w-full lg:w-[30%] flex flex-row lg:flex-col justify-between lg:justify-center lg:border-l lg:border-gray-200 lg:pl-3 space-x-4 lg:space-x-0 lg:space-y-6">
                    {systolicData.length > 0 && (
                        <>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#E66FD2]" />
                                    <p className="text-sm font-medium">Systolic</p>
                                </div>
                                <p className="text-[22px] font-bold leading-tight">
                                    {systolicData[systolicData.length - 1].value}
                                </p>
                                <div className='hidden sm:flex items-center gap-1'>
                                    {
                                        systolicData[systolicData.length - 1].status.toLowerCase().includes('lower') ? <CaretDownOutlined /> : <CaretUpOutlined />
                                    }
                                    <p className={`text-sm font-normal`}>
                                        {systolicData[systolicData.length - 1].status}
                                    </p>
                                </div>
                            </div>

                            <div className="hidden lg:block">
                                <hr className="border-t border-gray-200 border-opacity-30" />
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#8C6FE6]" />
                                    <span className="text-sm font-medium">Diastolic</span>
                                </div>
                                <p className="text-[22px] font-bold leading-tight">
                                    {diastolicData[diastolicData.length - 1].value}
                                </p>
                                <div className='hidden sm:flex items-center gap-1'>
                                    {
                                        diastolicData[diastolicData.length - 1].status.toLowerCase().includes('lower') ? <CaretDownOutlined /> : <CaretUpOutlined />
                                    }
                                    <p className={`text-sm font-normal`}>
                                        {diastolicData[diastolicData.length - 1].status}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BloodPressureChart;
