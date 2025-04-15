import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [step, setStep] = useState(1);
  const [createData, setCreateData] = useState({
    amount: '',
    currency: '',
    email: '',
    name: ''
  });

  const [confirmData, setConfirmData] = useState({
    customerId: '',
    productId: '',
    city: '',
    countryIsoCode: '',
    state: '',
    street: '',
    zipCode: '',
    paymentLink: true,
    returnUrl: ''
  });

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateData({
      ...createData,
      [name]: name === 'amount' ? Number(value) : value
    });
  };

  const handleConfirmChange = (e) => {
    const { name, value } = e.target;
    setConfirmData({
      ...confirmData,
      [name]: name === 'zipCode' ? Number(value) : value
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/create', createData);
      const data = res.data.message;
  
      setConfirmData((prev) => ({
        ...prev,
        productId: data.productId,
        customerId: data.customerId
      }));
      setStep(2);
    } catch (err) {
      console.error(err);
      alert('Create Payment Failed');
    }
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/confirm', confirmData);
      const data = res.data.message;

      if (data.paymentLink) {
        window.location.href = data.paymentLink; // navigate to payment page
      } else {
        alert('Payment link not received');
      }
    } catch (err) {
      console.error(err);
      alert('Confirm Payment Failed');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      {step === 1 ? (
        <form onSubmit={handleCreateSubmit}>
          <h2>Create Payment</h2>
          <input type="number" name="amount" placeholder="Amount" value={createData.amount} onChange={handleCreateChange} required /><br /><br />
          <input type="text" name="currency" placeholder="Currency (e.g., USD)" value={createData.currency} onChange={handleCreateChange} required /><br /><br />
          <input type="email" name="email" placeholder="Email" value={createData.email} onChange={handleCreateChange} required /><br /><br />
          <input type="text" name="name" placeholder="Name" value={createData.name} onChange={handleCreateChange} required /><br /><br />
          <button type="submit">Create</button>
        </form>
      ) : (
        <form onSubmit={handleConfirmSubmit}>
          <h2>Confirm Payment</h2>
          <p><strong>Product ID:</strong> {confirmData.productId}</p>
          <p><strong>Customer ID:</strong> {confirmData.customerId}</p>
          <input type="text" name="city" placeholder="City" value={confirmData.city} onChange={handleConfirmChange} required /><br /><br />
          <input type="text" name="countryIsoCode" placeholder="Country ISO Code (e.g., US)" value={confirmData.countryIsoCode} onChange={handleConfirmChange} required /><br /><br />
          <input type="text" name="state" placeholder="State" value={confirmData.state} onChange={handleConfirmChange} required /><br /><br />
          <input type="text" name="street" placeholder="Street" value={confirmData.street} onChange={handleConfirmChange} required /><br /><br />
          <input type="number" name="zipCode" placeholder="Zip Code" value={confirmData.zipCode} onChange={handleConfirmChange} required /><br /><br />
          <input type="text" name="returnUrl" placeholder="return url" value={confirmData.returnUrl} onChange={handleConfirmChange} />
          <button type="submit">Confirm</button>
        </form>
      )}
    </div>
  );
}

export default App;
