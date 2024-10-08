

// import React, { useState, useEffect } from 'react';
// import { Modal, Form, Input, Select, message, Table, DatePicker } from "antd";
// import Layout from '../components/Layout/Layout';
// import axios from 'axios';
// import Spinner from '../components/Layout/Spinner';
// import moment from 'moment';
// import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import Analytics from '../components/Analytics';
// import "../styles/HomePage.css";

// const { RangePicker } = DatePicker;

// const HomePage = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [allTransaction, setAllTransaction] = useState([]);
//   const [frequency, setFrequency] = useState('7');
//   const [selectedDate, setSelectedDate] = useState([]);
//   const [type, setType] = useState('all');
//   const [viewData, setViewData] = useState('table');
//   const [editable, setEditable] = useState(null);
//   const [form] = Form.useForm();

//   useEffect(() => {
//     const storedFrequency = localStorage.getItem('frequency');
//     const storedSelectedDate = JSON.parse(localStorage.getItem('selectedDate'));
//     const storedType = localStorage.getItem('type');

//     if (storedFrequency) setFrequency(storedFrequency);
//     if (storedSelectedDate) setSelectedDate(storedSelectedDate);
//     if (storedType) setType(storedType);
//   }, []);

//   const columns = [
//     {
//       title: 'Date',
//       dataIndex: 'date',
//       render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>
//     },
//     {
//       title: 'Amount',
//       dataIndex: 'amount'
//     },
//     {
//       title: 'Type',
//       dataIndex: 'type'
//     },
//     {
//       title: 'Category',
//       dataIndex: 'Category'
//     },
//     {
//       title: 'Description',
//       dataIndex: 'description'
//     },
//     {
//       title: 'Actions',
//       render: (text, record) => (
//         <div>
//           <EditOutlined
//             onClick={() => {
//               setEditable(record);
//               setShowModal(true);
//               form.setFieldsValue(record); // Set form values for editing
//             }}
//           />
//           <DeleteOutlined className='mx-2' onClick={() => handleDelete(record)} />
//         </div>
//       )
//     }
//   ];

//   const getAllTransactions = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem('user'));
//       setLoading(true);

//       if (frequency === 'custom' && (!selectedDate || selectedDate.length === 0)) {
//         setLoading(false);
//         setAllTransaction([]);
//         return;
//       }

//       const res = await axios.post('https://expense-management-u19n.onrender.com/api/v1/transections/get-transection', { userid: user._id, frequency, selectedDate, type });
//       res.data.sort((a, b) => new Date(b.date) - new Date(a.date));

//       setLoading(false);
//       setAllTransaction(res.data);
//     } catch (error) {
//       setLoading(false);
//       message.error("Fetch Issue with Transaction");
//     }
//   };

//   useEffect(() => {
//     getAllTransactions();
//   }, [frequency, selectedDate, type]);

//   const handleDelete = async (record) => {
//     try {
//       setLoading(true);
//       await axios.post('https://expense-management-u19n.onrender.com/api/v1/transections/delete-transection', { transactionId: record._id });
//       setLoading(false);
//       message.success('Transaction Deleted Successfully');
//       getAllTransactions();
//     } catch (error) {
//       setLoading(false);
//       message.error('Unable to delete');
//     }
//   };

//   const handleSubmit = async (values) => {
//     try {
//       const user = JSON.parse(localStorage.getItem('user'));
//       setLoading(true);
//       if (editable) {
//         await axios.post('https://expense-management-u19n.onrender.com/api/v1/transections/edit-transection', {
//           payload: {
//             ...values, userid: user._id
//           },
//           transactionId: editable._id
//         });
//         message.success('Transaction Updated Successfully');
//       } else {
//         await axios.post('https://expense-management-u19n.onrender.com/api/v1/transections/add-transection', { ...values, userid: user._id });
//         message.success('Transaction Added Successfully');
//       }
//       setLoading(false);
//       setShowModal(false);
//       setEditable(null);
//       form.resetFields(); // Reset the form fields
//       getAllTransactions();
//     } catch (error) {
//       setLoading(false);
//       message.error('Failed to add transaction');
//     }
//   };

//   const handleFrequencyChange = (value) => {
//     setFrequency(value);
//     localStorage.setItem('frequency', value);
//   };

//   const handleDateChange = (dates) => {
//     setSelectedDate(dates);
//     localStorage.setItem('selectedDate', JSON.stringify(dates));
//   };

//   const handleTypeChange = (value) => {
//     setType(value);
//     localStorage.setItem('type', value);
//   };

//   const handleAddNew = () => {
//     form.resetFields(); // Clear the form fields
//     setEditable(null); // Clear previous editable state
//     setShowModal(true); // Show modal
//   };

//   return (
//     <Layout>
//       {loading && <Spinner />}
//       <div className='filters'>
//         <div>
//           <h6>Select Frequency</h6>
//           <Select value={frequency} onChange={handleFrequencyChange}>
//             <Select.Option value='7'>Last 1 week</Select.Option>
//             <Select.Option value='30'>Last 1 Month</Select.Option>
//             <Select.Option value='365'>Last 1 Year</Select.Option>
//             <Select.Option value='custom'>Custom</Select.Option>
//           </Select>
//           {frequency === 'custom' && <RangePicker value={selectedDate} onChange={handleDateChange} />}
//         </div>
//         <div>
//           <h6>Select Type</h6>
//           <Select value={type} onChange={handleTypeChange}>
//             <Select.Option value='all'>ALL</Select.Option>
//             <Select.Option value='income'>INCOME</Select.Option>
//             <Select.Option value='expense'>EXPENSE</Select.Option>
//           </Select>
//         </div>
//         <div className='switch-icons'>
//           <UnorderedListOutlined className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`}
//             onClick={() => setViewData('table')} />
//           <AreaChartOutlined className={`mx-2 ${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'}`}
//             onClick={() => setViewData('analytics')} />
//         </div>
//         <div>
//           <button className='btn btn-primary' onClick={handleAddNew}>Add new</button>
//         </div>
//       </div>
//       <div className='content'>
//         {viewData === 'table' ? <Table columns={columns} dataSource={allTransaction} /> :
//           <Analytics allTransaction={allTransaction} />}
//       </div>
//       <Modal
//         title={editable ? 'Edit Transaction' : 'Add Transaction'}
//         open={showModal}
//         onCancel={() => {
//           setShowModal(false);
//           form.resetFields(); // Reset the form fields when modal is closed
//         }}
//         footer={false}
//         afterClose={() => form.resetFields()} // Reset the form fields after closing the modal
//       >
//         <Form form={form} layout='vertical' onFinish={handleSubmit} initialValues={editable}>
//           <Form.Item label="Amount" name="amount">
//             <Input type='text' />
//           </Form.Item>
//           <Form.Item label="Type" name="type">
//             <Select>
//               <Select.Option value="income">Income</Select.Option>
//               <Select.Option value="expense">Expense</Select.Option>
//             </Select>
//           </Form.Item>
//           <Form.Item label="Category" name="Category">
//             <Select>
//               <Select.Option value="salary">Salary</Select.Option>
//               <Select.Option value="tip">Tip</Select.Option>
//               <Select.Option value="project">Project</Select.Option>
//               <Select.Option value="food">Food</Select.Option>
//               <Select.Option value="movie">Movie</Select.Option>
//               <Select.Option value="bills">Bills</Select.Option>
//               <Select.Option value="medical">Medical</Select.Option>
//               <Select.Option value="fee">Fee</Select.Option>
//               <Select.Option value="tax">Tax</Select.Option>
//               <Select.Option value="other">Other</Select.Option>
//             </Select>
//           </Form.Item>
//           <Form.Item label="Date" name="date">
//             <Input type='date' />
//           </Form.Item>
//           <Form.Item label="Description" name='description'>
//             <Input type='text' />
//           </Form.Item>
//           <div className='d-flex justify-content-end'>
//             <button className='btn btn-primary' type='submit'>SAVE</button>
//           </div>
//         </Form>
//       </Modal>
//     </Layout>
//   );
// }

// export default HomePage;


import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message, Table, DatePicker } from "antd";
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import Spinner from '../components/Layout/Spinner';
import moment from 'moment';
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Analytics from '../components/Analytics';
import "../styles/HomePage.css";

const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState('7');
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState('all');
  const [viewData, setViewData] = useState('table');
  const [editable, setEditable] = useState(null);
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(10); // State for page size

  // Initialize filter values from localStorage if available
  useEffect(() => {
    const storedFrequency = localStorage.getItem('frequency');
    const storedSelectedDate = JSON.parse(localStorage.getItem('selectedDate'));
    const storedType = localStorage.getItem('type');

    if (storedFrequency) setFrequency(storedFrequency);
    if (storedSelectedDate) setSelectedDate(storedSelectedDate);
    if (storedType) setType(storedType);
  }, []);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => <span style={{ fontWeight: 'bold' }}>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
       render: (text, record) => (
        <span style={{ color: record.type === 'income' ? 'green' : 'red', fontWeight: 'bold' }}>
          {record.type === 'income' ? `+ ₹${text}` : `- ₹${text}`}
        </span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
       render: (text) => (
        <span style={{ color: text === 'income' ? 'green' : 'red', fontWeight: 'bold' }}>
          {text.charAt(0).toUpperCase() + text.slice(1)}
        </span>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'Category'
    },
    {
      title: 'Description',
      dataIndex: 'description'
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              setEditable(record);
              setShowModal(true);
              form.setFieldsValue(record); // Set form values for editing
            }}
          />
          <DeleteOutlined className='mx-2' onClick={() => handleDelete(record)} />
        </div>
      )
    }
  ];

  const getAllTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);

      if (frequency === 'custom' && (!selectedDate || selectedDate.length === 0)) {
        setLoading(false);
        setAllTransaction([]);
        return;
      }

      const res = await axios.post('https://expense-management-u19n.onrender.com/api/v1/transections/get-transection', { userid: user._id, frequency, selectedDate, type });
      res.data.sort((a, b) => new Date(b.date) - new Date(a.date));

      setLoading(false);
      setAllTransaction(res.data);
    } catch (error) {
      setLoading(false);
      message.error("Fetch Issue with Transaction");
    }
  };

  useEffect(() => {
    getAllTransactions();
  }, [frequency, selectedDate, type]);

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post('https://expense-management-u19n.onrender.com/api/v1/transections/delete-transection', { transactionId: record._id });
      setLoading(false);
      message.success('Transaction Deleted Successfully');
      getAllTransactions();
    } catch (error) {
      setLoading(false);
      message.error('Unable to delete');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);
      if (editable) {
        await axios.post('https://expense-management-u19n.onrender.com/api/v1/transections/edit-transection', {
          payload: {
            ...values, userid: user._id
          },
          transactionId: editable._id
        });
        message.success('Transaction Updated Successfully');
      } else {
        await axios.post('https://expense-management-u19n.onrender.com/api/v1/transections/add-transection', { ...values, userid: user._id });
        message.success('Transaction Added Successfully');
      }
      setLoading(false);
      setShowModal(false);
      setEditable(null);
      form.resetFields(); // Reset the form fields
      getAllTransactions();
    } catch (error) {
      setLoading(false);
      message.error('Failed to add transaction');
    }
  };

  const handleFrequencyChange = (value) => {
    setFrequency(value);
    localStorage.setItem('frequency', value);
  };

  const handleDateChange = (dates) => {
    setSelectedDate(dates);
    localStorage.setItem('selectedDate', JSON.stringify(dates));
  };

  const handleTypeChange = (value) => {
    setType(value);
    localStorage.setItem('type', value);
  };

  const handleAddNew = () => {
    form.resetFields(); // Clear the form fields
    setEditable(null); // Clear previous editable state
    setShowModal(true); // Show modal
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
  };

  return (
    <Layout>
      {loading && <Spinner />}
      <div className='filters'>
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={handleFrequencyChange}>
            <Select.Option value='7'>Last 1 week</Select.Option>
            <Select.Option value='30'>Last 1 Month</Select.Option>
            <Select.Option value='365'>Last 1 Year</Select.Option>
            <Select.Option value='custom'>Custom</Select.Option>
          </Select>
          {frequency === 'custom' && <RangePicker value={selectedDate} onChange={handleDateChange} />}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={handleTypeChange}>
            <Select.Option value='all'>ALL</Select.Option>
            <Select.Option value='income'>INCOME</Select.Option>
            <Select.Option value='expense'>EXPENSE</Select.Option>
          </Select>
        </div>
        <div className='switch-icons'>
          <UnorderedListOutlined className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`}
            onClick={() => setViewData('table')} />
          <AreaChartOutlined className={`mx-2 ${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'}`}
            onClick={() => setViewData('analytics')} />
        </div>
        <div>
          <button className='btn-add-new' onClick={handleAddNew}>Add new</button>
        </div>
      </div>
      <div className='content'>
        {viewData === 'table' ? (
          <Table
            columns={columns}
            dataSource={allTransaction}
            pagination={{
              pageSize: pageSize, // Use the state value for page size
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              onShowSizeChange: handlePageSizeChange,
            }}
          />
        ) : (
          <Analytics allTransaction={allTransaction} />
        )}
      </div>
      <Modal
        title={editable ? 'Edit Transaction' : 'Add Transaction'}
        open={showModal}
        onCancel={() => {
          setShowModal(false);
          form.resetFields(); // Reset the form fields when modal is closed
        }}
        footer={false}
        afterClose={() => form.resetFields()} // Reset the form fields after closing the modal
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit} initialValues={editable}>
          <Form.Item label="Amount" name="amount">
            <Input type='text' />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="Category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type='date' />
          </Form.Item>
          <Form.Item label="Description" name='description'>
            <Input type='text' />
          </Form.Item>
          <div className='d-flex justify-content-end'>
            <button type='submit' className='btn btn-primary'>
              {editable ? 'Edit Transaction' : 'Add Transaction'}
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
