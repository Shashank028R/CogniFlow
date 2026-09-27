import React, { useState, useEffect, useRef } from "react";
import Avatar from "../ui/Avatar";
import toast from "react-hot-toast";
import axios from "axios";
import io from "socket.io-client";
import { Pencil, Trash2, X, Paperclip, FileText, Download, MoreVertical, Check, CheckCheck } from "lucide-react";
import DeleteMessageModal from "./DeleteMessageModal";
import GroupSettingsModal from "./GroupSettingsModal";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const EndPoint = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const ChatContainer = ({ selectedChat, setSelectedChat, onlineUsers = [] }) => {
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
  const [isTypingIndicatorVisible, setIsTypingIndicatorVisible] = useState(false);
  const typingTimeoutRef = useRef(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const [attachedFile, setAttachedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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

    socketRef.current.on("messages delivered", ({ messageIds, userId }) => {
      setMessages((prev) => prev.map((m) => {
        if (messageIds.includes(m._id) && !m.deliveredTo?.includes(userId)) {
          return { ...m, deliveredTo: [...(m.deliveredTo || []), userId] };
        }
        return m;
      }));
    });

    socketRef.current.on("messages read", ({ messageIds, userId }) => {
      setMessages((prev) => prev.map((m) => {
        if (messageIds.includes(m._id) && !m.readBy?.includes(userId)) {
          return { ...m, readBy: [...(m.readBy || []), userId] };
        }
        return m;
      }));
    });

    socketRef.current.on("typing", () => setIsTypingIndicatorVisible(true));
    socketRef.current.on("stop typing", () => setIsTypingIndicatorVisible(false));

    return () => socketRef.current.disconnect();
  }, [selectedChat]);

  useEffect(() => {
    if (!messages.length || !selectedChat) return;

    const undeliveredIds = [];
    const unreadIds = [];

    messages.forEach((m) => {
      const senderId = m.sender?._id || m.sender?.id || m.sender;
      if (String(senderId) !== String(currentUserId)) {
        if (!m.deliveredTo?.includes(currentUserId)) {
          undeliveredIds.push(m._id);
        }
        if (!m.readBy?.includes(currentUserId)) {
          unreadIds.push(m._id);
        }
      }
    });

    if (undeliveredIds.length > 0) {
      socketRef.current?.emit("mark delivered", { messageIds: undeliveredIds, userId: currentUserId, roomId: selectedChat._id });
    }
    
    if (unreadIds.length > 0) {
      socketRef.current?.emit("mark read", { messageIds: unreadIds, userId: currentUserId, roomId: selectedChat._id });
    }
  }, [messages, selectedChat, currentUserId]);

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
        if (error.response?.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        } else {
          toast.error("Failed to load messages");
        }
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedChat, BackendUrl, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTypingIndicatorVisible]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAttachedFile({ 
      file, 
      previewUrl, 
      type: file.type.startsWith('image/') ? 'image' : 'file' 
    });
    
    e.target.value = null; // Reset input so same file can be selected again
  };

  const handleSubmit = async () => {
    if (!newMessage.trim() && !attachedFile) return;

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
      let uploadData = null;
      
      if (attachedFile) {
        setIsUploading(true);
        const toastId = toast.loading("Uploading attachment...");
        try {
          const formData = new FormData();
          formData.append("file", attachedFile.file);

          const response = await axios.post(`${BackendUrl}/api/upload`, formData, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
          });
          uploadData = response.data;
          toast.success("Attachment uploaded!", { id: toastId });
        } catch (error) {
          toast.error("Failed to upload attachment", { id: toastId });
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      const messagePayload = {
        content: newMessage || (uploadData ? uploadData.originalName : ""),
        roomId: selectedChat._id,
      };

      if (uploadData) {
        messagePayload.messageType = uploadData.resourceType === "image" ? "image" : "file";
        messagePayload.fileUrl = uploadData.fileUrl;
        messagePayload.filePublicId = uploadData.publicId;
      }

      const { data } = await axios.post(
        `${BackendUrl}/api/messages`,
        messagePayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setNewMessage("");
      setAttachedFile(null);
      if (attachedFile) {
        URL.revokeObjectURL(attachedFile.previewUrl);
      }

      const textarea = document.getElementById("chat-textarea");
      if (textarea) textarea.style.height = "auto";

      setMessages((prev) => [...prev, data]);
      socketRef.current?.emit("new message", data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message");
      setIsUploading(false);
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
    <div className="flex flex-col w-full h-full max-w-5xl bg-[var(--card)]/70 backdrop-blur-3xl rounded-3xl shadow-[10px_10px_20px_var(--shadow-dark),-10px_-10px_20px_var(--shadow-light)] overflow-hidden animate-[fadeIn_0.3s_ease] border border-white/20 dark:border-white/5">
      <div className="flex items-center justify-between p-4 bg-transparent border-b border-gray-200/30 dark:border-gray-700/30 shadow-[0_4px_10px_rgba(0,0,0,0.02)] z-10">
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

          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-[var(--text)] leading-tight">
              {getChatName()}
            </h2>
            {!selectedChat.isGroupChat && (() => {
              const otherUser = selectedChat.members.find((m) => m._id !== currentUserId);
              const isOnline = otherUser && onlineUsers.includes(otherUser._id);
              if (isOnline) {
                return <span className="text-xs text-green-500 font-medium">Online</span>;
              }
              return null;
            })()}
          </div>
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
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 flex flex-col gap-3" onClick={() => setShowMenu(false)}>
        {loadingMessages ? (
          <p className="text-center text-gray-400 mt-10 animate-pulse text-sm">
            Loading chat history...
          </p>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
            <div className="w-20 h-20 mb-4 rounded-full bg-[var(--card)] shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h3 className="text-[var(--text)] font-semibold text-lg">No messages yet</h3>
            <p className="text-gray-500 text-sm max-w-[250px] mt-1">
              Send a message to start the conversation!
            </p>
          </div>
        ) : (
          messages.map((m, index) => {
            const senderId = m.sender?._id || m.sender?.id;
            const isMyMessage = String(senderId) === String(currentUserId);
            const isDeleted = m.isDeleted;

            // Date Divider Logic
            const messageDate = new Date(m.createdAt);
            const isToday = messageDate.toDateString() === new Date().toDateString();
            const isYesterday = messageDate.toDateString() === new Date(Date.now() - 86400000).toDateString();
            
            let dateLabel = messageDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
            if (isToday) dateLabel = "Today";
            else if (isYesterday) dateLabel = "Yesterday";

            let showDateDivider = false;
            if (index === 0) {
              showDateDivider = true;
            } else {
              const prevDate = new Date(messages[index - 1].createdAt);
              if (prevDate.toDateString() !== messageDate.toDateString()) {
                showDateDivider = true;
              }
            }

            const timeString = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <React.Fragment key={m._id}>
                {showDateDivider && (
                  <div className="flex justify-center my-4">
                    <div className="bg-[var(--card)]/50 backdrop-blur-md px-4 py-1 rounded-full text-xs font-semibold text-[var(--text)] shadow-[2px_2px_4px_var(--shadow-dark),-2px_-2px_4px_var(--shadow-light)] border border-white/10">
                      {dateLabel}
                    </div>
                  </div>
                )}
                <div
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
                      className={`p-3 text-sm shadow-sm flex flex-col ${
                        isDeleted 
                          ? "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400 italic rounded-2xl border border-gray-300 dark:border-slate-600"
                          : isMyMessage
                            ? "bg-blue-500 text-white rounded-2xl rounded-tr-none shadow-[4px_4px_10px_rgba(37,99,235,0.2)]"
                            : "bg-[var(--card)] text-black dark:text-white rounded-2xl rounded-tl-none shadow-[6px_6px_14px_#00000066,-6px_-6px_14px_var(--shadow-light)] dark:shadow-[4px_4px_12px_#3b82f666,-4px_-4px_12px_var(--shadow-light)] transition-all"
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
                          <a href={m.fileUrl.replace('/upload/', '/upload/fl_attachment/')} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isMyMessage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[var(--bg)] hover:bg-gray-200 dark:hover:bg-slate-800 shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)] dark:hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.02)]'}`}>
                            <FileText size={24} className={isMyMessage ? "text-white" : "text-blue-500"} />
                            <span className="truncate max-w-[150px] font-medium">{m.content}</span>
                            <Download size={18} className={`ml-2 flex-shrink-0 ${isMyMessage ? "text-blue-200" : "text-gray-400"}`} />
                          </a>
                        </div>
                      ) : (
                        <div className="markdown-body text-sm [&>p]:mb-2 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:ml-4 [&>ol]:mb-2 [&>h1]:text-lg [&>h1]:font-bold [&>h1]:mb-2 [&>h2]:text-base [&>h2]:font-bold [&>h2]:mb-2 [&>strong]:font-bold [&_a]:text-blue-300 [&_a]:underline break-words">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {m.content}
                          </ReactMarkdown>
                        </div>
                      )}
                      
                      <div className={`flex items-center justify-end gap-1 mt-1 ${isMyMessage ? "text-blue-100" : "text-gray-400"} text-[10px]`}>
                        {m.isEdited && !isDeleted && <span>(edited)</span>}
                        <span>{timeString}</span>
                        {isMyMessage && !isDeleted && (
                          <span className="ml-1 flex items-center">
                            {m.readBy?.length > 0 ? (
                              <CheckCheck size={14} className="text-cyan-300 drop-shadow-[0_0_2px_rgba(0,255,255,0.8)]" />
                            ) : m.deliveredTo?.length > 0 ? (
                              <CheckCheck size={14} className="text-blue-200/80" />
                            ) : (
                              <Check size={14} className="text-blue-200/80" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        {isTypingIndicatorVisible && (
          <div className="flex justify-start w-full mt-2 mb-2 animate-[fadeIn_0.3s_ease]">
            <div className="bg-[var(--card)] px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-200/50 dark:border-gray-800/50 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
            </div>
          </div>
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
      {/* File Preview Container */}
      {attachedFile && (
        <div className="mx-4 mb-2 p-3 bg-[var(--bg)] rounded-xl border border-blue-500/30 flex items-center justify-between shadow-[4px_4px_8px_var(--shadow-dark),-4px_-4px_8px_var(--shadow-light)] relative animate-[fadeIn_0.2s_ease]">
          <div className="flex items-center gap-3 overflow-hidden">
            {attachedFile.type === 'image' ? (
              <img src={attachedFile.previewUrl} alt="Preview" className="w-12 h-12 object-cover rounded-md" />
            ) : (
              <div className="w-12 h-12 bg-[var(--card)] text-blue-500 rounded-md flex items-center justify-center shadow-inner">
                <FileText size={24} />
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-[var(--text)] truncate">{attachedFile.file.name}</span>
              <span className="text-xs text-gray-500">{(attachedFile.file.size / 1024).toFixed(1)} KB</span>
            </div>
          </div>
          <button 
            onClick={() => {
              setAttachedFile(null);
              URL.revokeObjectURL(attachedFile.previewUrl);
            }}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
          
          {isUploading && (
            <div className="absolute inset-0 bg-[var(--bg)]/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
              <span className="text-sm font-bold text-blue-500 animate-pulse">Uploading...</span>
            </div>
          )}
        </div>
      )}

      <div className="p-4 bg-transparent flex items-end gap-3 z-10 border-t border-gray-200/30 dark:border-gray-700/30">
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
        </button>        <div className="relative flex-1 rounded-xl shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] focus-within:shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)] transition-all bg-[var(--card)] overflow-hidden">
          <div 
            className="absolute inset-0 p-3 pointer-events-none whitespace-pre-wrap break-words text-[var(--text)]"
            style={{ 
              fontFamily: "inherit", 
              fontSize: "inherit", 
              lineHeight: "inherit",
              zIndex: 5
            }}
          >
            {!newMessage ? (
              <span className="text-gray-400">Type a message...</span>
            ) : (
              newMessage.split(/(@cogni)/i).map((part, i) => 
                part.toLowerCase() === '@cogni' ? <span key={i} className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">{part}</span> : part
              )
            )}
          </div>
          <textarea
            id="chat-textarea"
            rows={1}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              if (selectedChat) {
                socketRef.current.emit("typing", selectedChat._id);
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(() => {
                  socketRef.current.emit("stop typing", selectedChat._id);
                }, 3000);
              }
            }}
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
            className="w-full h-full p-3 bg-transparent border-none outline-none resize-none overflow-hidden text-transparent caret-[var(--text)] relative z-10"
            spellCheck="false"
          />
        </div>

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
