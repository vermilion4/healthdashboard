import React, { useState } from 'react';
import { Layout, Menu, Avatar, Space, Divider, Drawer } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { 
  SettingOutlined, 
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  MessageOutlined,
  HomeOutlined,
  CreditCardOutlined,
  MoreOutlined,
  MenuOutlined
} from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/router';

const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: 'Overview'
  },
  {
    key: '/patients',
    icon: <TeamOutlined />,
    label: 'Patients'
  },
  {
    key: '/schedule',
    icon: <CalendarOutlined />,
    label: 'Schedule'
  },
  {
    key: '/messages',
    icon: <MessageOutlined />,
    label: 'Message'
  },
  {
    key: '/transactions',
    icon: <CreditCardOutlined />,
    label: 'Transactions'
  }
];

const MainLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const handleMenuClick = (e) => {
    router.push(e.key);
    setDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F6F7F8]">
      <Layout className="bg-transparent min-h-screen">
        <Header className="bg-white flex items-center justify-between px-8 py-4 rounded-[70px] h-[72px] mx-4 mt-4">
          {/* Logo Section */}      
            <Image alt="Tech Care Logo" src="/logo.svg" width={210} height={48} />
         
          {/* Navigation Menu - Desktop */}
          <Menu
            className="desktop-menu flex-1 min-w-0 mx-[60px] bg-transparent text-sm font-bold"
            theme="light"
            mode="horizontal"
            selectedKeys={[router.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
          />

          {/* Profile and Settings Section */}
          <div className="hidden md:flex">
            <Space size={16} align="center">
              <Space size={12} align="center">
                <Avatar size={44} icon={<UserOutlined />} />
                <div className='flex flex-col'>
                  <span className="text-primary font-medium leading-[20px]">Dr Jose Simmons</span>
                  <span className="text-[#707070] leading-[20px]">General Practitioner</span>
                </div>
              </Space>
              <Divider type="vertical" className="h-8 m-0 hidden md:block" />
              <div className="flex items-center">
                <SettingOutlined className="text-xl text-primary mr-1.5" />
                <MoreOutlined className="text-xl text-primary" />
              </div>
            </Space>
          </div>

          {/* Mobile Menu Button */}
          <MenuOutlined 
            className="text-xl text-primary md:hidden cursor-pointer"
            onClick={() => setDrawerOpen(true)}
          />
        </Header>

        {/* Mobile Navigation Drawer */}
        <Drawer
          title={
            <div className="flex items-center space-x-3">
              <Avatar size={44} className="mb-2.5" icon={<UserOutlined />} />
              <div className="flex flex-col mb-2.5">
                <span className="text-primary font-medium">Dr Jose Simmons</span>
                <span className="text-[#707070]">General Practitioner</span>
              </div>
            </div>
          }
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={300}
        >
          <Menu
            theme="light"
            mode="vertical"
            className="mobile-menu text-base font-semibold border-none m-3"
            selectedKeys={[router.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Drawer>

        {/* Main Content */}
        <Content className="p-8 flex-1">
          {children}
        </Content>
      </Layout>
    </div>
  );
};

export default MainLayout;
