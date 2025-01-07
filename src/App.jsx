import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import AddRecord from "./components/addRecord";

function RecordApp() {
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [editedRecord, setEditedRecord] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:9999/api/records")
      .then((response) => {
        setRecords(response.data);
      })
      .then(console.log(records))
      .catch((e) => {
        console.log("Error to fecth", e);
      });
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setEditedRecord(record);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id) => {
    try {
      // Format the entry_date to YYYY-MM-DD
      const formattedEntryDate = new Date(editedRecord.entry_date)
        .toISOString()
        .split("T")[0];

      const payload = {
        type: editedRecord.type,
        payment_channel: editedRecord.payment_channel,
        amount: editedRecord.amount,
        remark: editedRecord.remark,
        data_entry_by: editedRecord.data_entry_by,
        entry_date: formattedEntryDate,
      };

      console.log("Payload sent to API:", payload);

      await axios.put(`http://localhost:9999/api/records/${id}`, payload);

      setRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.id === id ? { ...record, ...payload } : record
        )
      );

      setEditingId(null);
      alert("Record updated successfully");
    } catch (error) {
      console.error("Error updating record:", error);
      alert("Failed to update the record");
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this record?"
      );
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:9999/api/records/${id}`);

      setRecords((prevRecords) =>
        prevRecords.filter((record) => record.id !== id)
      );

      alert("Record deleted successfully");
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Failed to delete the record");
    }
  };
  return (
    <>
      <h1>Monthly Records</h1>
      <button onClick={toggleModal}>Add New</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>
              &times;
            </span>
            <AddRecord setRecords={setRecords} />
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Payment Channel</th>
            <th>Amount</th>
            <th>Remark</th>
            <th>Data Entry By</th>
            <th>Entry Date</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>
                {editingId === record.id ? (
                  <input
                    type="text"
                    name="type"
                    value={editedRecord.type || ""}
                    onChange={handleChange}
                  />
                ) : (
                  record.type
                )}
              </td>
              <td>
                {editingId === record.id ? (
                  <input
                    type="text"
                    name="payment_channel"
                    value={editedRecord.payment_channel || ""}
                    onChange={handleChange}
                  />
                ) : (
                  record.payment_channel
                )}
              </td>
              <td>
                {editingId === record.id ? (
                  <input
                    type="number"
                    name="amount"
                    value={editedRecord.amount || ""}
                    onChange={handleChange}
                  />
                ) : (
                  record.amount
                )}
              </td>
              <td>
                {editingId === record.id ? (
                  <input
                    type="text"
                    name="remark"
                    value={editedRecord.remark || ""}
                    onChange={handleChange}
                  />
                ) : (
                  record.remark || "N/A"
                )}
              </td>
              <td>
                {editingId === record.id ? (
                  <input
                    type="text"
                    name="data_entry_by"
                    value={editedRecord.data_entry_by || ""}
                    onChange={handleChange}
                  />
                ) : (
                  record.data_entry_by
                )}
              </td>
              <td>
                {editingId === record.id ? (
                  <input
                    type="date"
                    name="entry_date"
                    value={editedRecord.entry_date || ""}
                    onChange={handleChange}
                  />
                ) : (
                  new Date(record.entry_date).toLocaleDateString()
                )}
              </td>
              <td>
                {editingId === record.id ? (
                  <>
                    <button onClick={() => handleUpdate(record.id)}>
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(record)}>Edit</button>
                )}
              </td>
              <td>
                <button onClick={() => handleDelete(record.id)}>Delete</button>
              </td>{" "}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
export default RecordApp;
