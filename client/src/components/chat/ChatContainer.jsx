import React, { useState, useEffect, useRef } from "react";
import Avatar from "../ui/Avatar";
import toast from "react-hot-toast";
import axios from "axios";
import io from "socket.io-client";
import { Pencil, Trash2, X, Paperclip, FileText, Download, MoreVertical } from "lucide-react";
import DeleteMessageModal from "./DeleteMessageModal";
import GroupSettingsModal from "./GroupSettingsModal";

const EndPoint = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const ChatContainer = ({ selectedChat, setSelectedChat }) => {
  const BackendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const currentUserId = localStorage.getItem("userid");
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isGroupSettingsOpen, setIsGroupSettingsOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(EndPoint);

    socketRef.current.on("connect", () => {
      console.log("Socket connected");
      socketRef.current.emit("setup", currentUserId);
      if (selectedChat) {
        socketRef.current.emit("join chat", selectedChat._id);
      }
    });

    socketRef.current.on("message received", (msg) => {
      const roomId = msg.room?._id || msg.room;

      if (selectedChat && selectedChat._id === roomId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    });

    socketRef.current.on("message edited", (editedMsg) => {
      setMessages((prev) => prev.map((m) => (m._id === editedMsg._id ? editedMsg : m)));
    });

    socketRef.current.on("message deleted", (deletedMsg) => {
      setMessages((prev) => prev.map((m) => (m._id === deletedMsg._id ? deletedMsg : m)));
    });

    socketRef.current.on("chat cleared", (roomId) => {
      if (selectedChat && selectedChat._id === roomId) {
        setMessages([]);
      }
    });

    return () => socketRef.current.disconnect();
  }, [selectedChat]);

  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);

        const { data } = await axios.get(
          `${BackendUrl}/api/messages/${selectedChat._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setMessages(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load messages");
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedChat, BackendUrl, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading("Uploading file...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data: uploadData } = await axios.post(`${BackendUrl}/api/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      // Now send the message with the file URL
      const { data: messageData } = await axios.post(
        `${BackendUrl}/api/messages`,
        {
          content: uploadData.originalName || "Attachment",
          roomId: selectedChat._id,
          messageType: uploadData.resourceType === "image" ? "image" : "file",
          fileUrl: uploadData.fileUrl,
          filePublicId: uploadData.publicId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prev) => [...prev, messageData]);
      socketRef.current?.emit("new message", messageData);
      
      toast.success("File sent!", { id: toastId });
    } catch (error) {
      console.log("File upload error:", error);
      toast.error("Failed to upload file", { id: toastId });
    }
  };

  const handleSubmit = async () => {
    if (!newMessage.trim()) return;

    if (editingMessageId) {
      try {
        const { data } = await axios.put(
          `${BackendUrl}/api/messages/${editingMessageId}`,
          { content: newMessage },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMessages((prev) => prev.map((m) => (m._id === data._id ? data : m)));
        socketRef.current?.emit("message edited", data);
        setEditingMessageId(null);
        setNewMessage("");
        const textarea = document.getElementById("chat-textarea");
        if (textarea) textarea.style.height = "auto";
      } catch (error) {
        toast.error("Failed to edit message");
      }
      return;
    }

    try {
      const { data } = await axios.post(
        `${BackendUrl}/api/messages`,
        {
          content: newMessage,
          roomId: selectedChat._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setNewMessage("");

      const textarea = document.getElementById("chat-textarea");
      if (textarea) textarea.style.height = "auto";

      setMessages((prev) => [...prev, data]);
      socketRef.current?.emit("new message", data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message");
    }
  };

  const initiateEdit = (msg) => {
    setEditingMessageId(msg._id);
    setNewMessage(msg.content);
    const textarea = document.getElementById("chat-textarea");
    if (textarea) {
      textarea.focus();
      textarea.style.height = "auto";
    }
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setNewMessage("");
  };

  const openDeleteModal = (msgId, msgSenderId) => {
    setMessageToDelete({ id: msgId, senderId: msgSenderId });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async (type) => {
    if (!messageToDelete) return;
    
    const { id: msgId } = messageToDelete;
    
    try {
      const { data } = await axios.delete(
        `${BackendUrl}/api/messages/${msgId}?type=${type}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (type === "everyone") {
        setMessages((prev) => prev.map((m) => (m._id === data._id ? data : m)));
        socketRef.current?.emit("message deleted", data);
      } else {
        setMessages((prev) => prev.filter((m) => m._id !== msgId));
      }
    } catch (error) {
      toast.error("Failed to delete message");
    } finally {
      setDeleteModalOpen(false);
      setMessageToDelete(null);
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm("Are you sure you want to clear this chat for yourself?")) return;
    try {
      await axios.delete(`${BackendUrl}/api/messages/room/${selectedChat._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages([]);
      socketRef.current?.emit("chat cleared", { roomId: selectedChat._id, userId: currentUserId });
      setShowMenu(false);
    } catch (error) {
      toast.error("Failed to clear chat");
    }
  };

  const getChatName = () => {
    if (selectedChat.isGroupChat) return selectedChat.name;
    const otherUser = selectedChat.members.find((m) => m._id !== currentUserId);
    return otherUser ? otherUser.username : "Unknown User";
  };

  return (
    <div className="flex flex-col w-full h-full max-w-5xl bg-[var(--card)] rounded-3xl shadow-[10px_10px_20px_var(--shadow-dark),-10px_-10px_20px_var(--shadow-light)] overflow-hidden animate-[fadeIn_0.3s_ease]">
      <div className="flex items-center justify-between p-4 bg-[var(--card)] shadow-[0_4px_10px_rgba(0,0,0,0.05)] z-10">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-blue-600 font-bold hover:scale-110 transition-transform cursor-pointer"
            onClick={() => setSelectedChat(null)}
          >
            ←
          </button>

          <Avatar
            src={selectedChat.isGroupChat ? (selectedChat.profilePic || "/RoomChat.png") : (!selectedChat.isGroupChat ? selectedChat.members.find(m => m._id !== currentUserId)?.profilePic : null)}
            text={
              !selectedChat.isGroupChat
                ? getChatName().charAt(0).toUpperCase()
                : ""
            }
          />

          <h2 className="text-lg font-semibold text-[var(--text)]">
            {getChatName()}
          </h2>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-500 hover:text-blue-600 font-bold px-3 py-1 rounded-xl shadow-[4px_4px_8px_var(--shadow-dark),-4px_-4px_8px_var(--shadow-light)] transition-all cursor-pointer"
          >
            ⋮
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[var(--card)] rounded-xl shadow-[8px_8px_16px_var(--shadow-dark),-8px_-8px_16px_var(--shadow-light)] z-50 overflow-hidden border border-gray-200">
              {selectedChat.isGroupChat && (
                <button
                  onClick={() => {
                    setIsGroupSettingsOpen(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200"
                >
                  Group Settings
                </button>
              )}
              <button
                onClick={handleClearChat}
                className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-gray-100 transition-colors"
              >
                Clear Chat
              </button>
            </div>
          )}
        </div>
      </div>

      <GroupSettingsModal
        isOpen={isGroupSettingsOpen}
        onClose={() => setIsGroupSettingsOpen(false)}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" onClick={() => setShowMenu(false)}>
        {loadingMessages ? (
          <p className="text-center text-gray-400 mt-10 animate-pulse text-sm">
            Loading chat history...
          </p>
        ) : (
          messages.map((m) => {
            const senderId = m.sender?._id || m.sender?.id;
            const isMyMessage = String(senderId) === String(currentUserId);
            const isDeleted = m.isDeleted;

            return (
              <div
                key={m._id}
                className={`flex w-full group ${isMyMessage ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[75%] flex flex-col relative">
                  {!isMyMessage && selectedChat.isGroupChat && (
                    <span className="text-xs text-gray-500 ml-2 mb-1">
                      {m.sender.username}
                    </span>
                  )}

                  {isMyMessage && !isDeleted && (
                    <div className="absolute -left-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button 
                        onClick={() => initiateEdit(m)}
                        className="p-1.5 text-gray-400 hover:text-blue-500 bg-white rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
                        title="Edit Message"
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(m._id, senderId)}
                        className="p-1.5 text-gray-400 hover:text-red-500 bg-white rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
                        title="Delete Message"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}

                  {!isMyMessage && !isDeleted && (
                    <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button 
                        onClick={() => openDeleteModal(m._id, senderId)}
                        className="p-1.5 text-gray-400 hover:text-red-500 bg-white rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
                        title="Delete Message"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}

                  <div
                    className={`p-3 text-sm shadow-sm ${
                      isDeleted 
                        ? "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400 italic rounded-2xl border border-gray-300 dark:border-slate-600"
                        : isMyMessage
                          ? "bg-blue-500 text-white rounded-2xl rounded-tr-none shadow-[4px_4px_10px_rgba(37,99,235,0.2)]"
                          : "bg-[var(--card)] text-indigo-600 dark:text-indigo-300 rounded-2xl rounded-tl-none shadow-[4px_4px_8px_var(--shadow-dark),-4px_-4px_8px_var(--shadow-light)]"
                    }`}
                  >
                    {isDeleted ? (
                      "This message was deleted"
                    ) : m.messageType === "image" && m.fileUrl ? (
                      <div className="flex flex-col gap-2">
                        <img src={m.fileUrl} alt="attachment" className="max-w-[250px] max-h-[250px] rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(m.fileUrl, '_blank')} />
                        {m.content !== "Attachment" && <span>{m.content}</span>}
                      </div>
                    ) : m.messageType === "file" && m.fileUrl ? (
                      <div className="flex flex-col gap-2">
                        <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isMyMessage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[var(--bg)] hover:bg-gray-200 shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]'}`}>
                          <FileText size={24} className={isMyMessage ? "text-white" : "text-blue-500"} />
                          <span className="truncate max-w-[150px] font-medium">{m.content}</span>
                          <Download size={18} className={`ml-2 ${isMyMessage ? "text-blue-200" : "text-gray-400"}`} />
                        </a>
                      </div>
                    ) : (
                      m.content
                    )}
                    
                    {m.isEdited && !isDeleted && (
                      <span className={`ml-2 text-[10px] ${isMyMessage ? "text-blue-200" : "text-gray-400"}`}>
                        (edited)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      {editingMessageId && (
        <div className="bg-blue-50 px-4 py-2 border-t border-blue-100 flex justify-between items-center z-10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-blue-600">Editing Message</span>
            <span className="text-xs text-gray-500 truncate max-w-sm">Esc to cancel</span>
          </div>
          <button 
            onClick={cancelEdit}
            className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-blue-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      <div className="p-4 bg-[var(--card)] flex items-end gap-3 z-10 border-t border-gray-200/50">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*,application/pdf,.doc,.docx,.txt"
        />
        <button 
          onClick={() => document.getElementById("file-upload").click()}
          className="w-10 h-10 mb-1 flex-shrink-0 flex items-center justify-center rounded-full text-gray-500 hover:text-blue-600 bg-[var(--bg)] font-bold shadow-[4px_4px_8px_var(--shadow-dark),-4px_-4px_8px_var(--shadow-light)] hover:shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)] transition-all cursor-pointer"
          title="Attach File"
        >
          <Paperclip size={18} />
        </button>

        <textarea
          id="chat-textarea"
          rows={1}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            } else if (e.key === "Escape" && editingMessageId) {
              e.preventDefault();
              cancelEdit();
            }
          }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
          }}
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-xl border-none outline-none bg-[var(--card)] text-[var(--text)] shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] focus:shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)] transition-all resize-none overflow-hidden"
          style={{ minHeight: "48px" }}
        />

        <button
          onClick={handleSubmit}
          className="w-10 h-10 mb-1 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold shadow-[4px_4px_8px_var(--shadow-dark),-4px_-4px_8px_var(--shadow-light)] hover:bg-blue-600 hover:scale-105 transition-all cursor-pointer"
        >
          ➤
        </button>
      </div>

      <DeleteMessageModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        canDeleteForEveryone={
          messageToDelete && (
            String(messageToDelete.senderId) === String(currentUserId) ||
            (selectedChat && selectedChat.isGroupChat && (
              String(selectedChat.admin) === String(currentUserId) ||
              String(selectedChat.admin?._id) === String(currentUserId)
            ))
          )
        }
      />
    </div>
  );
};

export default ChatContainer;
