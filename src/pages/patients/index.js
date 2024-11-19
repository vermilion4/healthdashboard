import MainLayout from '@/components/MainLayout'
import React, { useEffect, useState } from 'react'
import { CalendarOutlined, CaretDownOutlined, MoreOutlined, SearchOutlined, UserOutlined, DownloadOutlined } from '@ant-design/icons';
import { Avatar, Button, Space, message } from 'antd';
import Image from 'next/image';
import { getPatients } from '@/utils/api';
import BloodPressureChart from '@/components/BloodPressureChart';

const Patients = () => {
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPatients();
                setPatientData(data);
            } catch (error) {
                message.error('Failed to fetch patient data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getLatestDiagnosis = () => {
        if (!patientData?.diagnosis_history?.length) return null;
        return patientData.diagnosis_history[0];
    };

    const latestDiagnosis = getLatestDiagnosis();

    const diagnosisReadings = latestDiagnosis ? [
        {
            id: 1,
            name: 'Respiratory Rate',
            value: `${latestDiagnosis.respiratory_rate.value} bpm`,
            feedback: latestDiagnosis.respiratory_rate.levels,
            icon: '/respiratory-rate.svg',
            lower: latestDiagnosis.respiratory_rate.levels.toLowerCase().includes('lower'),
            color: '#E0F3FA'
        },
        {
            id: 2,
            name: 'Temperature',
            value: `${latestDiagnosis.temperature.value}°F`,
            feedback: latestDiagnosis.temperature.levels,
            icon: '/temperature.svg',
            lower: latestDiagnosis.temperature.levels.toLowerCase().includes('lower'),
            color: '#FFE6E9'
        },
        {
            id: 3,
            name: 'Heart Rate',
            value: `${latestDiagnosis.heart_rate.value}bpm`,
            feedback: latestDiagnosis.heart_rate.levels,
            icon: '/heart-rate.svg',
            lower: latestDiagnosis.heart_rate.levels.toLowerCase().includes('lower'),
            color: '#FFE6F1'
        }
    ] : [];

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className='h-screen'>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-8 h-full'>
                    <div className='col-span-1 md:col-span-5 xl:col-span-3 bg-white py-5 rounded-2xl h-full'>
                        <div className='px-5 flex justify-between items-center mb-10'>
                            <h3 className='text-2xl'>Patients</h3>
                            <SearchOutlined size={18} />
                        </div>
                        <div className='flex justify-between items-center py-[19px] bg-teal-100 px-5'>
                            <Space size={12} align="center">
                                <Avatar size={44} src={patientData?.profile_picture} icon={<UserOutlined />} />
                                <div className='flex flex-col'>
                                    <span className="text-primary font-medium leading-[20px]">{patientData?.name}</span>
                                    <span className="text-[#707070] leading-[20px]">{`${patientData?.gender}, ${patientData?.age}`}</span>
                                </div>
                            </Space>
                            <MoreOutlined className='rotate-90' />
                        </div>
                    </div>
                    <div className='col-span-1 md:col-span-7 xl:col-span-6 flex flex-col gap-8 h-full'>
                        <div className='bg-white pb-5 rounded-2xl 2xl:h-[55%]'>
                            <h3 className='px-5 rounded-t-2xl bg-white text-2xl mb-7 py-4'>Diagnosis History</h3>
                            <div className='flex flex-col px-5'>
                                  {/* chart */}
                                  <BloodPressureChart diagnosisHistory={patientData?.diagnosis_history} />
                                <div className='flex flex-wrap gap-5 mt-5'>
                                    {diagnosisReadings.map((reading) => (
                                        <div 
                                            className='flex-1 min-w-[200px] space-y-4 p-4 rounded-xl'
                                            key={reading.id}
                                            style={{ backgroundColor: reading.color }}
                                        >
                                            <Image width={96} height={96} src={reading.icon} alt={reading.name} />
                                            <div>
                                                <p className='text-primary font-medium text-base'>{reading.name}</p>
                                                <p className='text-primary font-bold text-3xl'>{reading.value}</p>
                                            </div>
                                            <div className='flex items-center gap-1'>
                                                {reading.lower && <CaretDownOutlined />}
                                                <p className='text-sm'>{reading.feedback}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='bg-white p-5 rounded-2xl 2xl:h-[45%]'>
                            <h3 className='sticky px-5 rounded top-0 bg-white text-2xl mb-6 py-4 w-full'>Diagnostic List</h3>
                            <div className='flex flex-col h-[calc(100%-100px)]'>
                                {/* header */}
                                <div className='gap-4 font-bold grid grid-cols-3 bg-gray-50 rounded-3xl px-4 py-[15px] mb-2'>
                                    <h4 className='text-sm'>Problem/Diagnosis</h4>
                                    <h4 className='text-sm'>Description</h4>
                                    <h4 className='text-sm'>Status</h4>
                                </div>
                                {/* body */}
                                <div className='space-y-2 overflow-y-auto flex-1'>
                                    {patientData?.diagnostic_list?.map((diagnosis, index) => (
                                        <>
                                        <div key={index} className='grid grid-cols-3 px-4 py-5 gap-4'>
                                            <h4 className='text-sm text-primary font-normal'>{diagnosis.name}</h4>
                                            <h4 className='text-sm font-normal'>{diagnosis.description}</h4>
                                            <h4 className='text-sm font-normal'>
                                                {diagnosis.status}
                                            </h4>
                                        </div>
                                        <hr className='border-t-none border-b border-gray-100 border-opacity-10'/>
                                        </>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-1 md:col-span-12 xl:col-span-3 flex flex-col gap-8 h-full'>
                        <div className='bg-white px-5 py-8 rounded-2xl 2xl:h-[60%]'>
                            <div className='flex flex-col items-center mb-7'>
                                <Avatar size={180} src={patientData?.profile_picture} icon={<UserOutlined />} />
                                <h3 className='text-2xl mt-5'>{patientData?.name}</h3>
                            </div>
                            <div className='space-y-8 mb-10'>
                                <div className='flex gap-4 items-center'>
                                    <Image width={42} height={42} src="/birthicon.svg" alt="Date of birth icon" />
                                    <div>
                                        <p className='font-medium text-sm'>Date Of Birth</p>
                                        <p className='font-bold text-sm'>{patientData?.date_of_birth}</p>
                                    </div>
                                </div>
                                <div className='flex gap-4 items-center'>
                                    <Image width={42} height={42} src="/gender.svg" alt="Gender icon" />
                                    <div>
                                        <p className='font-medium text-sm'>Gender</p>
                                        <p className='font-bold text-sm'>{patientData?.gender}</p>
                                    </div>
                                </div>
                                <div className='flex gap-4 items-center'>
                                    <Image width={42} height={42} src="/contact.svg" alt="Contact Info icon" />
                                    <div>
                                        <p className='font-medium text-sm'>Contact Info</p>
                                        <p className='font-bold text-sm'>{patientData?.phone_number}</p>
                                    </div>
                                </div>
                                <div className='flex gap-4 items-center'>
                                    <Image width={42} height={42} src="/contact.svg" alt="Emergency Contacts icon" />
                                    <div>
                                        <p className='font-medium text-sm'>Emergency Contacts</p>
                                        <p className='font-bold text-sm'>{patientData?.emergency_contact}</p>
                                    </div>
                                </div>
                                <div className='flex gap-4 items-center'>
                                    <Image width={42} height={42} src="/insurance.svg" alt="Insurance provider icon" />
                                    <div>
                                        <p className='font-medium text-sm'>Insurance Provider</p>
                                        <p className='font-bold text-sm'>{patientData?.insurance_type}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Button type="primary" className='w-full bg-teal-300 text-primary h-[41px] rounded-[41px] text-sm font-bold'>
                                    Show All Information
                                </Button>
                            </div>
                        </div>
                        <div className='bg-white pb-5 rounded-2xl 2xl:h-[40%]'>
                            <h3 className='sticky px-5 rounded top-0 bg-white text-2xl rounded-t-2xl mb-6 py-4 w-full'>Lab Results</h3>
                            <div className='space-y-4 px-5'>
                                {patientData?.lab_results?.map((result, index) => (
                                    <div key={index} className='flex items-center justify-between py-2 px-4 hover:bg-gray-50 hover:cursor-pointer rounded-xl'>
                                        <span className='text-sm font-medium text-primary'>{result}</span>
                                        <Button 
                                            type="text" 
                                            icon={<DownloadOutlined />} 
                                            className='text-primary hover:text-teal-500 hover:bg-transparent'
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Patients;
