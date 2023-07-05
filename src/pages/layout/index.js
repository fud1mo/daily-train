import { FileOutlined, PieChartOutlined, UserOutlined, DesktopOutlined, TeamOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Button } from 'antd';
import { useState } from 'react';
import menuList from '@/router/menuConfig';
import InnerContent from './InnerContent'
import { useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;

const Index = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const handleChangeMenu = ({ key }) => {
    navigate(key)
  }
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} trigger={null}>
        <div className="demo-logo-vertical" />
        <Menu onClick={handleChangeMenu} defaultSelectedKeys={['/home']} mode="inline" items={menuList} style={{ overflowY: 'auto', height: '100vh' }} />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}
        >
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
          >{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</Button>
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content
          style={{
            margin: '16px',
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <InnerContent />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Index;