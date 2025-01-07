import { useState } from "react";
import axios from "axios";

function AddRecord({ setRecords }) {
  const [formData, setFormData] = useState({
    type: "income",
    payment_channel: "",
    amount: "",
    remark: "",
    data_entry_by: "",
    entry_date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formattedEntryDate = new Date(formData.entry_date)
        .toISOString()
        .split("T")[0];

      const payload = {
        type: "income",
        payment_channel: formData.payment_channel,
        amount: formData.amount,
        remark: formData.remark || "Salary",
        data_entry_by: formData.data_entry_by,
        entry_date: formattedEntryDate,
      };

      const response = await axios.post(
        "http://localhost:9999/api/records",
        payload
      );

      setRecords((prevRecords) => [
        ...prevRecords,
        { ...payload, id: response.data.id },
      ]);

      alert("Salary record added successfully");
      setFormData({
        type: "income",
        payment_channel: "",
        amount: "",
        remark: "",
        data_entry_by: "",
        entry_date: "",
      });
    } catch (error) {
      console.error("Error adding salary record:", error);
      alert("Failed to add salary record");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Salary Record</h2>
      <div>
        <label>Payment Channel:</label>
        <input
          type="text"
          name="payment_channel"
          value={formData.payment_channel}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Amount:</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Remark:</label>
        <input
          type="text"
          name="remark"
          value={formData.remark}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Data Entry By:</label>
        <input
          type="text"
          name="data_entry_by"
          value={formData.data_entry_by}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Entry Date:</label>
        <input
          type="date"
          name="entry_date"
          value={formData.entry_date}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Add</button>
    </form>
  );
}

export default AddRecord;
