import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { FaEnvelope, FaEnvelopeOpen, FaTrash } from "react-icons/fa";

const AdminContactMessages = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/contact/all");
      setContacts(data?.data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/contact/${id}/read`);
      setContacts(
        contacts.map((contact) =>
          contact._id === id ? { ...contact, isRead: true } : contact
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
      alert("Failed to mark as read");
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      await API.delete(`/contact/${id}`);
      setContacts(contacts.filter((contact) => contact._id !== id));
      alert("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete message");
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    if (filter === "unread") return !contact.isRead;
    if (filter === "read") return contact.isRead;
    return true;
  });

  const unreadCount = contacts.filter((c) => !c.isRead).length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Contact Messages</h1>
        <p className="text-gray-600">
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm mr-2">
              {unreadCount} New
            </span>
          )}
          Total: {contacts.length} messages
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          All ({contacts.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded ${
            filter === "unread"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("read")}
          className={`px-4 py-2 rounded ${
            filter === "read"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Read ({contacts.length - unreadCount})
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading messages...</div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No {filter !== "all" ? filter : ""} messages found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact._id}
              className={`border rounded-lg p-4 ${
                contact.isRead ? "bg-white" : "bg-blue-50 border-blue-300"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {contact.isRead ? (
                    <FaEnvelopeOpen className="text-gray-400" />
                  ) : (
                    <FaEnvelope className="text-blue-600" />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {contact.subject}
                    </h3>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {new Date(contact.createdAt).toLocaleString()}
                  </span>
                  {!contact.isRead && (
                    <button
                      onClick={() => markAsRead(contact._id)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteContact(contact._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {contact.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContactMessages;
