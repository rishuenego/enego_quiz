import { Form, message, Select, Input, Table, Tabs, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, getAllUsers } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../components/PageTitle";
import moment from "moment";

const { Option } = Select;
const { TabPane } = Tabs;

function Users() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const [form] = Form.useForm();
  const [usersData, setUsersData] = useState([]);

  const getUsers = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllUsers();
      dispatch(HideLoading());
      if (response.success) {
        setUsersData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const payload = {
        ...values,
        userId: user._id,
      };
      const response = await registerUser(payload);
      dispatch(HideLoading());

      if (response.success) {
        message.success(response.message);
        form.resetFields();
        getUsers();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-bold">{text}</span>
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (isAdmin) => (
        <Tag color={isAdmin ? "volcano" : "geekblue"} className="uppercase">
          {isAdmin ? "Admin" : "Student"}
        </Tag>
      )
    },
    {
      title: "Registered On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("DD MMM YYYY, hh:mm A")
    },
    {
       title: "User ID",
       dataIndex: "_id",
       key: "_id",
       render: (id) => <code style={{ fontSize: '10px' }}>{id}</code>
    }
  ];

  return (
    <div className="enego-page">
      <PageTitle title="User Management" />
      <div className="divider"></div>

      <Tabs defaultActiveKey="1" className="enego-tabs mt-2">
        <TabPane tab={<span><i className="ri-user-search-line mr-1"></i> Registered Users</span>} key="1">
           <div className="mt-2">
              <Table 
                columns={columns} 
                dataSource={usersData} 
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                className="custom-antd-table"
              />
           </div>
        </TabPane>
        
        <TabPane tab={<span><i className="ri-user-add-line mr-1"></i> Register New User</span>} key="2">
          <div className="enego-form-wrapper" style={{ marginTop: 20 }}>
            <div className="enego-form-card" style={{ maxWidth: 600 }}>
              <div className="form-header">
                <h1>
                  Create Account <i className="ri-user-add-line"></i>
                </h1>
                <p>Register a new admin or student to the platform</p>
              </div>

              <Form
                form={form}
                layout="vertical"
                className="enego-form"
                onFinish={onFinish}
              >
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: "Please enter the name" }]}
                >
                  <Input
                    prefix={<i className="ri-user-line" style={{ color: "#64748B", marginRight: 8 }}></i>}
                    placeholder="Enter full name"
                    className="custom-antd-input"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: "Please enter the email" },
                    { type: "email", message: "Enter a valid email" },
                  ]}
                >
                  <Input
                    prefix={<i className="ri-mail-line" style={{ color: "#64748B", marginRight: 8 }}></i>}
                    placeholder="example@domain.com"
                    className="custom-antd-input"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: "Please enter the password" },
                    { min: 6, message: "Minimum 6 characters required" },
                  ]}
                >
                  <Input.Password
                    prefix={<i className="ri-lock-2-line" style={{ color: "#64748B", marginRight: 8 }}></i>}
                    placeholder="••••••••"
                    className="custom-antd-input"
                  />
                </Form.Item>

                <Form.Item
                  name="isAdmin"
                  label="User Role"
                  rules={[{ required: true, message: "Please select user role" }]}
                >
                  <Select
                    placeholder="Select Role"
                    className="custom-antd-select w-100"
                    suffixIcon={<i className="ri-shield-user-line"></i>}
                  >
                    <Option value={false}>Regular User (Student)</Option>
                    <Option value={true}>Admin (Instructor)</Option>
                  </Select>
                </Form.Item>

                <button
                  type="submit"
                  className="register-btn"
                >
                  <i className="ri-user-add-fill"></i>
                  <span>Register User</span>
                </button>
              </Form>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Users;
