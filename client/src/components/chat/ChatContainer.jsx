import React, { useState, useEffect, useRef } from "react";
import Avatar from "../ui/Avatar";
import toast from "react-hot-toast";
import axios from "axios";
import io from "socket.io-client";
import { Pencil, Trash2, X, Paperclip, FileText, Download, Check, CheckCheck, Send, MoreVertical } from "lucide-react";
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
  }, [selectedChat, currentUserId]);

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
    
    e.target.value = null;
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
      } catch {
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
        } catch {
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
    } catch {
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
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setDeleteModalOpen(false);
      setMessageToDelete(null);
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm("Are you sure you want to clear your chat history for this conversation?")) return;
    try {
      await axios.delete(`${BackendUrl}/api/messages/room/${selectedChat._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages([]);
      socketRef.current?.emit("chat cleared", { roomId: selectedChat._id, userId: currentUserId });
      setShowMenu(false);
      toast.success("Chat history cleared!");
    } catch {
      toast.error("Failed to clear chat");
    }
  };

  const getChatName = () => {
    if (selectedChat.isGroupChat) return selectedChat.name;
    const otherUser = selectedChat.members.find((m) => m._id !== currentUserId);
    return otherUser ? otherUser.username : "Unknown User";
  };

  return (
    <div className="flex flex-col w-full h-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-[fadeIn_0.2s_ease]">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer mr-1"
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
            size="w-9 h-9"
          />

          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
              {getChatName()}
            </h2>
            {!selectedChat.isGroupChat && (() => {
              const otherUser = selectedChat.members.find((m) => m._id !== currentUserId);
              const isOnline = otherUser && onlineUsers.includes(otherUser._id);
              if (isOnline) {
                return <span className="text-[11px] text-emerald-500 font-medium">Online</span>;
              }
              return <span className="text-[11px] text-slate-400">Offline</span>;
            })()}
            {selectedChat.isGroupChat && (
              <span className="text-[11px] text-slate-400">{selectedChat.members?.length} members</span>
            )}
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <MoreVertical size={16} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-lg z-50 overflow-hidden border border-slate-200 dark:border-slate-800 py-1">
              {selectedChat.isGroupChat && (
                <button
                  onClick={() => {
                    setIsGroupSettingsOpen(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Group Settings
                </button>
              )}
              <button
                onClick={handleClearChat}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
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

      {/* MESSAGES VIEWPORT */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 flex flex-col gap-2.5" onClick={() => setShowMenu(false)}>
        {loadingMessages ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Loading conversation...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
              <Paperclip size={20} />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No messages yet</h3>
            <p className="text-xs text-slate-400 max-w-[220px] mt-0.5">
              Send a message or mention @cogni to start.
            </p>
          </div>
        ) : (
          messages.map((m, index) => {
            const senderId = m.sender?._id || m.sender?.id;
            const isMyMessage = String(senderId) === String(currentUserId);
            const isDeleted = m.isDeleted;

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
                  <div className="flex justify-center my-3">
                    <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 px-3 py-0.5 rounded-full text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      {dateLabel}
                    </div>
                  </div>
                )}
                <div className={`flex w-full group ${isMyMessage ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[75%] flex flex-col relative">
                    {!isMyMessage && selectedChat.isGroupChat && (
                      <span className="text-[11px] font-medium text-slate-500 ml-1 mb-0.5">
                        {m.sender.username}
                      </span>
                    )}

                    {isMyMessage && !isDeleted && (
                      <div className="absolute -left-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button 
                          onClick={() => initiateEdit(m)}
                          className="p-1 text-slate-400 hover:text-blue-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm transition-colors cursor-pointer"
                          title="Edit Message"
                        >
                          <Pencil size={13} />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(m._id, senderId)}
                          className="p-1 text-slate-400 hover:text-rose-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm transition-colors cursor-pointer"
                          title="Delete Message"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}

                    {!isMyMessage && !isDeleted && (
                      <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button 
                          onClick={() => openDeleteModal(m._id, senderId)}
                          className="p-1 text-slate-400 hover:text-rose-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm transition-colors cursor-pointer"
                          title="Delete Message"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}

                    <div
                      className={`p-3 text-sm flex flex-col ${
                        isDeleted 
                          ? "bg-slate-50 dark:bg-slate-800/40 text-slate-400 italic rounded-2xl border border-slate-200 dark:border-slate-800"
                          : isMyMessage
                            ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm shadow-sm"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl rounded-tl-sm shadow-sm"
                      }`}
                    >
                      {isDeleted ? (
                        <span className="text-xs">This message was deleted</span>
                      ) : m.messageType === "image" && m.fileUrl ? (
                        <div className="flex flex-col gap-2">
                          <img
                            src={m.fileUrl}
                            alt="attachment"
                            className="max-w-[240px] max-h-[240px] rounded-lg object-cover cursor-pointer hover:opacity-95 transition-opacity"
                            onClick={() => window.open(m.fileUrl, '_blank')}
                          />
                          {m.content && m.content !== "Attachment" && <span>{m.content}</span>}
                        </div>
                      ) : m.messageType === "file" && m.fileUrl ? (
                        <div className="flex flex-col gap-2">
                          <a
                            href={m.fileUrl.replace('/upload/', '/upload/fl_attachment/')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-colors ${
                              isMyMessage
                                ? 'bg-blue-700 text-white hover:bg-blue-800'
                                : 'bg-white dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                          >
                            <FileText size={20} className={isMyMessage ? "text-white" : "text-blue-500"} />
                            <span className="truncate max-w-[140px] font-medium text-xs">{m.content}</span>
                            <Download size={15} className={`ml-1 flex-shrink-0 ${isMyMessage ? "text-blue-200" : "text-slate-400"}`} />
                          </a>
                        </div>
                      ) : (
                        <div className="markdown-body text-sm [&>p]:mb-1.5 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:mb-1.5 [&>ol]:list-decimal [&>ol]:ml-4 [&>ol]:mb-1.5 [&>h1]:text-base [&>h1]:font-bold [&>h1]:mb-1.5 [&>h2]:text-sm [&>h2]:font-bold [&>h2]:mb-1.5 [&>strong]:font-semibold [&_a]:underline break-words">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {m.content}
                          </ReactMarkdown>
                        </div>
                      )}
                      
                      <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMyMessage ? "text-blue-200" : "text-slate-400"}`}>
                        {m.isEdited && !isDeleted && <span>(edited)</span>}
                        <span>{timeString}</span>
                        {isMyMessage && !isDeleted && (
                          <span className="ml-0.5 flex items-center">
                            {m.readBy?.length > 0 ? (
                              <CheckCheck size={13} className="text-white font-bold" title="Read" />
                            ) : m.deliveredTo?.length > 0 ? (
                              <CheckCheck size={13} className="text-blue-200/80" title="Delivered" />
                            ) : (
                              <Check size={13} className="text-blue-200/80" title="Sent" />
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
          <div className="flex justify-start w-full mt-1 mb-1 animate-[fadeIn_0.2s_ease]">
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 px-3 py-2 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      {editingMessageId && (
        <div className="bg-blue-50 dark:bg-blue-950/40 px-4 py-2 border-t border-blue-200 dark:border-blue-900/40 flex justify-between items-center z-10">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Editing Message</span>
            <span className="text-[11px] text-slate-500">Press Escape to cancel</span>
          </div>
          <button 
            onClick={cancelEdit}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1 rounded-full"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* File Preview */}
      {attachedFile && (
        <div className="mx-4 mb-2 p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between relative animate-[fadeIn_0.15s_ease]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {attachedFile.type === 'image' ? (
              <img src={attachedFile.previewUrl} alt="Preview" className="w-10 h-10 object-cover rounded-md" />
            ) : (
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 text-blue-600 rounded-md flex items-center justify-center">
                <FileText size={20} />
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{attachedFile.file.name}</span>
              <span className="text-[10px] text-slate-400">{(attachedFile.file.size / 1024).toFixed(1)} KB</span>
            </div>
          </div>
          <button 
            onClick={() => {
              setAttachedFile(null);
              URL.revokeObjectURL(attachedFile.previewUrl);
            }}
            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
          
          {isUploading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center rounded-xl z-10">
              <span className="text-xs font-semibold text-blue-600 animate-pulse">Uploading...</span>
            </div>
          )}
        </div>
      )}

      <div className="p-3 bg-white dark:bg-slate-900 flex items-end gap-2 z-10 border-t border-slate-200 dark:border-slate-800">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*,application/pdf,.doc,.docx,.txt"
        />
        <button 
          onClick={() => document.getElementById("file-upload").click()}
          className="w-9 h-9 mb-0.5 flex-shrink-0 flex items-center justify-center rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          title="Attach File"
        >
          <Paperclip size={16} />
        </button>

        <div className="relative flex-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all overflow-hidden">
          <div 
            className="absolute inset-0 p-2.5 pointer-events-none whitespace-pre-wrap break-words text-slate-900 dark:text-slate-100 text-sm"
            style={{ 
              fontFamily: "inherit", 
              fontSize: "inherit", 
              lineHeight: "inherit",
              zIndex: 5
            }}
          >
            {!newMessage ? (
              <span className="text-slate-400">Type a message... (tag @cogni for AI)</span>
            ) : (
              newMessage.split(/(@cogni)/i).map((part, i) => 
                part.toLowerCase() === '@cogni' ? (
                  <span key={i} className="text-blue-600 dark:text-blue-400 font-semibold bg-blue-100/60 dark:bg-blue-900/30 px-1 py-0.5 rounded">
                    {part}
                  </span>
                ) : part
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
            className="w-full h-full p-2.5 bg-transparent border-none outline-none resize-none overflow-hidden text-transparent caret-slate-900 dark:caret-slate-100 relative z-10 text-sm"
            spellCheck="false"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-9 h-9 mb-0.5 flex-shrink-0 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm transition-colors cursor-pointer"
          title="Send"
        >
          <Send size={15} />
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
