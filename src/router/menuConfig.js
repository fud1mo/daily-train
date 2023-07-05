import { PieChartOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';

const menuList = [
  {
    label: '首页',
    icon: <PieChartOutlined />,
    path: '/home',
    key: '/home',
  },
  {
    label: 'A页',
    icon: <UserOutlined />,
    path: '/test·',
    key: '/test·',
    children: [
      {
        label: 'A-1页',
        icon: <TeamOutlined />,
        path: '/test',
        key: '/test',
      },
    ]
  }
];

export default menuList;
