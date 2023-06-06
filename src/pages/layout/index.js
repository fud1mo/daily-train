import { FileOutlined, PieChartOutlined, UserOutlined, DesktopOutlined, TeamOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Button } from 'antd';
import { useState } from 'react';

const { Header, Content, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />, [
    getItem('aaa', '3'),
    getItem('bbb', '4'),
    getItem('ccc', '5'),
  ]),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '6'),
    getItem('Bill', '7'),
    getItem('Alex', '8'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />, [
    getItem('aaa', '10'),
    getItem('bbb', '11'),
    getItem('ccc', '12'),
    getItem('ddd', '13'),
  ]),
];
const Index = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} trigger={null}>
        <div className="demo-logo-vertical" />
        <Menu defaultSelectedKeys={['1']} mode="inline" items={items} style={{ overflowY: 'auto', height: '100vh' }} />
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
            内容区...
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Index;