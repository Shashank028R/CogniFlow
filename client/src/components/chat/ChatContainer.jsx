import React, { useState, useEffect, useRef } from "react";
import Avatar from "../ui/Avatar";
import toast from "react-hot-toast";
import axios from "axios";
import io from "socket.io-client";
import { Pencil, Trash2, X, Paperclip, FileText, Download, MoreVertical, Check, CheckCheck, BookOpen, Sparkles } from "lucide-react";
import DeleteMessageModal from "./DeleteMessageModal";
import GroupSettingsModal from "./GroupSettingsModal";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useKnowledge } from "../../hooks/useKnowledge";
import KnowledgePanel from "../rag/KnowledgePanel";
import CitationChips from "../rag/CitationChips";
import AnswerBadge from "../rag/AnswerBadge";
import FallbackActions from "../rag/FallbackActions";
import LearnModal from "../rag/LearnModal";
import QuizCard from "../rag/QuizCard";

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

  // RAG State
  const [isKnowledgePanelOpen, setIsKnowledgePanelOpen] = useState(false);
  const [learnModalMessage, setLearnModalMessage] = useState(null);
  const [perMessageRagMode, setPerMessageRagMode] = useState(null);

  const socketRef = useRef(null);
  const [socketInstance, setSocketInstance] = useState(null);
  const messagesEndRef = useRef(null);

  const {
    sources,
    ragMode,
    isUploading: isKnowledgeUploading,
    uploadProgress,
    readySourcesCount,
    uploadSource,
    uploadText,
    toggleSource,
    deleteSource,
    updateMode,
    answerGeneral,
    learnFromAnswer,
    generateQuiz,
  } = useKnowledge(selectedChat?._id, socketInstance);

  useEffect(() => {
    const s = io(EndPoint);
    socketRef.current = s;
    setSocketInstance(s);

    s.on("connect", () => {
      console.log("Socket connected");
      s.emit("setup", currentUserId);
      if (selectedChat) {
        s.emit("join chat", selectedChat._id);
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
        content: newMessage.trim(),
        roomId: selectedChat._id,
      };

      if (perMessageRagMode) {
        messagePayload.ragMode = perMessageRagMode;
      }

      if (attachedFile) {
        messagePayload.messageType = uploadData.resourceType === "image" ? "image" : "file";
        messagePayload.fileUrl = uploadData.fileUrl;
        messagePayload.filePublicId = uploadData.publicId;
        messagePayload.fileName = attachedFile.file.name;

        if (!messagePayload.content) {
          messagePayload.content = attachedFile.file.name;
        }

        // Auto-ingest document into Room Knowledge Base if PDF or text
        const fileName = attachedFile.file.name.toLowerCase();
        if (fileName.endsWith(".pdf") || fileName.endsWith(".txt") || attachedFile.file.type === "application/pdf") {
          try {
            await uploadSource(attachedFile.file);
          } catch (e) {
            console.warn("Knowledge source auto-upload warning:", e);
          }
        }
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
    <div className="flex flex-col w-full h-full max-w-5xl bg-[var(--card)]/80 backdrop-blur-2xl rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)] overflow-hidden animate-[fadeIn_0.2s_ease] border border-slate-200/80 dark:border-slate-800/80">
      <div className="flex items-center justify-between p-3 px-4 bg-[var(--card)]/60 border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs z-10">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-blue-600 font-bold hover:opacity-80 transition-opacity cursor-pointer text-sm"
            onClick={() => setSelectedChat(null)}
          >
            ←
          </button>

          <Avatar
            size="w-9 h-9"
            src={selectedChat.isGroupChat ? (selectedChat.profilePic || "/RoomChat.png") : (!selectedChat.isGroupChat ? selectedChat.members.find(m => m._id !== currentUserId)?.profilePic : null)}
            text={
              !selectedChat.isGroupChat
                ? getChatName().charAt(0).toUpperCase()
                : ""
            }
          />

          <div className="flex flex-col">
            <h2 className="text-base font-semibold text-[var(--text)] leading-tight">
              {getChatName()}
            </h2>
            {!selectedChat.isGroupChat && (() => {
              const otherUser = selectedChat.members.find((m) => m._id !== currentUserId);
              const isOnline = otherUser && onlineUsers.includes(otherUser._id);
              if (isOnline) {
                return <span className="text-[11px] text-emerald-500 font-medium leading-none mt-0.5">Online</span>;
              }
              return null;
            })()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quiz Me Button */}
          {readySourcesCount > 0 && (
            <button
              onClick={() => generateQuiz()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-violet-200/90 dark:border-violet-800/80 bg-violet-50/80 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/40 text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
              title="Take an interactive quiz on uploaded documents"
            >
              <Sparkles size={14} className="text-violet-500 animate-pulse" />
              <span className="hidden sm:inline">Quiz Me</span>
            </button>
          )}

          {/* Knowledge Base Toggle Button */}
          <button
            onClick={() => setIsKnowledgePanelOpen(true)}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer shadow-xs active:scale-95 ${
              readySourcesCount > 0
                ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                : "bg-slate-100/70 dark:bg-slate-800/70 border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Room Knowledge Base"
          >
            <BookOpen size={15} />
            <span className="hidden sm:inline">Knowledge</span>
            {readySourcesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                {readySourcesCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 shadow-xs active:scale-95 transition-colors cursor-pointer text-sm"
            >
              ⋮
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-[var(--card)] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-50 overflow-hidden border border-slate-200 dark:border-slate-800">
                {selectedChat.isGroupChat && (
                  <button
                    onClick={() => {
                      setIsGroupSettingsOpen(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b border-slate-200 dark:border-slate-800"
                  >
                    Group Settings
                  </button>
                )}
                <button
                  onClick={handleClearChat}
                  className="w-full text-left px-3.5 py-2.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  Clear Chat
                </button>
              </div>
            )}
          </div>
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
          (() => {
            const otherUser = !selectedChat.isGroupChat ? selectedChat.members?.find((m) => String(m._id) !== String(currentUserId)) : null;
            const isCogniBot = otherUser && (otherUser.username === "CogniBot" || otherUser.email === "cognibot@system.local");

            if (isCogniBot) {
              return (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto animate-[fadeIn_0.3s_ease]">
                  <div className="relative w-20 h-20 mb-4 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-xl shadow-blue-500/20">
                    <div className="w-full h-full bg-[var(--card)] rounded-[22px] flex items-center justify-center p-3">
                      <img src="/ai-button-logo.png" alt="CogniAi" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[var(--text)] tracking-tight">
                    CogniAi Study & Knowledge Hub
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-5">
                    Upload any PDF, slides, or documents. Ask questions with verified citations or test your comprehension with interactive quizzes!
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full mb-4">
                    <button
                      onClick={() => setIsKnowledgePanelOpen(true)}
                      className="p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 text-left flex items-start gap-2.5 transition-all shadow-xs active:scale-[0.99] cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[var(--text)]">Knowledge Base</div>
                        <div className="text-[11px] text-slate-400">
                          {readySourcesCount > 0 ? `${readySourcesCount} documents loaded` : "Upload PDFs or notes"}
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        if (readySourcesCount > 0) {
                          generateQuiz();
                        } else {
                          setIsKnowledgePanelOpen(true);
                        }
                      }}
                      className="p-3 rounded-2xl border border-violet-200/80 dark:border-violet-900/60 bg-violet-50/60 dark:bg-violet-950/30 hover:bg-violet-100/70 text-left flex items-start gap-2.5 transition-all shadow-xs active:scale-[0.99] cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-violet-100/80 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-violet-900 dark:text-violet-200">Take a Quiz</div>
                        <div className="text-[11px] text-violet-600/70 dark:text-violet-400/70">
                          {readySourcesCount > 0 ? "Generate 5 MCQs" : "Upload doc to quiz"}
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    <span className="text-[11px] text-slate-400 mr-1">Suggestions:</span>
                    {[
                      "Quiz me on key facts",
                      "Summarize main takeaways",
                      "Explain core concepts",
                    ].map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setNewMessage(`@cogni ${sug}`);
                          document.getElementById("chat-textarea")?.focus();
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/60 dark:border-slate-700/60 transition-colors cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            return (
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
            );
          })()
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
                      className={`p-3 text-sm flex flex-col ${
                        isDeleted 
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 italic rounded-2xl border border-slate-200 dark:border-slate-700"
                          : isMyMessage
                            ? "bg-blue-600 text-white rounded-2xl rounded-tr-xs shadow-[0_2px_8px_rgba(37,99,235,0.2)]"
                            : "bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-2xl rounded-tl-xs border border-slate-200/70 dark:border-slate-700/60 shadow-xs"
                      }`}
                    >
                      {isDeleted ? (
                        "This message was deleted"
                      ) : m.messageType === "image" && m.fileUrl ? (
                        <div className="flex flex-col gap-2">
                          <img src={m.fileUrl} alt="attachment" className="max-w-[250px] max-h-[250px] rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(m.fileUrl, '_blank')} />
                          {m.content && m.content !== "Attachment" && !m.content.startsWith("http") && (
                            <div className={`markdown-body text-sm break-words pt-1 px-0.5 ${isMyMessage ? 'text-white' : 'text-[var(--text)]'}`}>
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                            </div>
                          )}
                        </div>
                      ) : m.messageType === "file" && m.fileUrl ? (
                        (() => {
                          const docName = m.fileName || (m.fileUrl ? decodeURIComponent(m.fileUrl.split("/").pop().split("?")[0]) : "Document.pdf");
                          const hasPromptText = Boolean(
                            m.content && 
                            m.content !== docName && 
                            m.content !== "Attachment" &&
                            !m.content.toLowerCase().endsWith(".pdf") &&
                            !m.content.toLowerCase().endsWith(".txt")
                          );

                          return (
                            <div className="flex flex-col gap-2">
                              {/* Document Card */}
                              <a
                                href={m.fileUrl.replace('/upload/', '/upload/fl_attachment/')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-3 p-2.5 px-3 rounded-xl transition-all border ${
                                  isMyMessage
                                    ? 'bg-blue-700/60 border-blue-400/30 hover:bg-blue-700/90 text-white'
                                    : 'bg-[var(--card)]/90 border-slate-200/80 dark:border-slate-700 hover:bg-slate-200/60 dark:hover:bg-slate-700/50 text-[var(--text)]'
                                } shadow-xs group/file`}
                              >
                                <div className={`p-2 rounded-lg flex-shrink-0 ${
                                  isMyMessage 
                                    ? 'bg-blue-500/40 text-white' 
                                    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                                }`}>
                                  <FileText size={20} />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col pr-1">
                                  <span className="font-semibold text-xs truncate" title={docName}>
                                    {docName}
                                  </span>
                                  <span className={`text-[10px] ${isMyMessage ? 'text-blue-200' : 'text-slate-400'}`}>
                                    Document • Click to download
                                  </span>
                                </div>
                                <Download size={16} className={`flex-shrink-0 ${isMyMessage ? "text-blue-200 group-hover/file:text-white" : "text-gray-400 group-hover/file:text-blue-500"}`} />
                              </a>

                              {/* Prompt / Message written below the document card */}
                              {hasPromptText && (
                                <div className={`markdown-body text-sm break-words pt-1 px-0.5 ${isMyMessage ? 'text-white' : 'text-[var(--text)]'}`}>
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {m.content}
                                  </ReactMarkdown>
                                </div>
                              )}
                            </div>
                          );
                        })()
                      ) : m.messageType === "quiz" && m.quizData ? (
                        <div className="flex flex-col gap-2">
                          <QuizCard quiz={m.quizData} messageId={m._id} />
                        </div>
                      ) : (
                        <>
                          {m.isAiResponse && <AnswerBadge answerMode={m.answerMode} />}
                          <div className="markdown-body text-sm [&>p]:mb-2 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:ml-4 [&>ol]:mb-2 [&>h1]:text-lg [&>h1]:font-bold [&>h1]:mb-2 [&>h2]:text-base [&>h2]:font-bold [&>h2]:mb-2 [&>strong]:font-bold [&_a]:text-blue-300 [&_a]:underline break-words">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {m.content}
                            </ReactMarkdown>
                          </div>
                          {m.isAiResponse && m.ragSources && m.ragSources.length > 0 && (
                            <CitationChips sources={m.ragSources} />
                          )}
                          {m.isAiResponse && (
                            <FallbackActions
                              message={m}
                              onAnswerGeneral={answerGeneral}
                              onOpenLearnModal={(targetMsg) => setLearnModalMessage(targetMsg)}
                            />
                          )}
                        </>
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

      <div className="p-3 bg-[var(--card)]/60 flex items-end gap-2 z-10 border-t border-slate-200/80 dark:border-slate-800/80">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*,application/pdf,.doc,.docx,.txt"
        />
        <button 
          onClick={() => document.getElementById("file-upload").click()}
          className="w-9 h-9 mb-0.5 flex-shrink-0 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:bg-slate-200/70 dark:hover:bg-slate-700/70 active:scale-95 transition-all cursor-pointer"
          title="Attach File"
        >
          <Paperclip size={16} />
        </button>

        <button
          type="button"
          onClick={() => {
            setNewMessage((prev) => (prev.includes("@cogni") ? prev : (prev ? `@cogni ${prev}` : "@cogni ")));
            document.getElementById("chat-textarea")?.focus();
          }}
          className="w-9 h-9 mb-0.5 flex-shrink-0 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 p-1.5 shadow-xs hover:border-blue-400/80 active:scale-95 transition-all cursor-pointer group"
          title="Ask CogniBot (@cogni)"
        >
          <img src="/ai-button-logo.png" alt="CogniAI" className="w-full h-full object-contain" />
        </button>

        <div className="relative flex-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/60 focus-within:border-blue-500/70 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all overflow-hidden shadow-xs">
          <div 
            className="absolute inset-0 p-2.5 px-3 pointer-events-none whitespace-pre-wrap break-words text-[var(--text)] text-sm"
            style={{ 
              fontFamily: "inherit", 
              fontSize: "inherit", 
              lineHeight: "inherit",
              zIndex: 5
            }}
          >
            {!newMessage ? (
              <span className="text-slate-400">Type a message...</span>
            ) : (
              newMessage.split(/(@cogni)/i).map((part, i) => 
                part.toLowerCase() === '@cogni' ? <span key={i} className="text-blue-500 font-medium">{part}</span> : part
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
            className="w-full h-full p-2.5 px-3 bg-transparent border-none outline-none resize-none overflow-hidden text-transparent caret-[var(--text)] text-sm relative z-10"
            spellCheck="false"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-9 h-9 mb-0.5 flex-shrink-0 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-[0_2px_8px_rgba(37,99,235,0.25)] active:scale-95 transition-all cursor-pointer text-sm"
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

      {/* Knowledge Panel Slide-over */}
      <KnowledgePanel
        isOpen={isKnowledgePanelOpen}
        onClose={() => setIsKnowledgePanelOpen(false)}
        sources={sources}
        ragMode={ragMode}
        isUploading={isKnowledgeUploading}
        uploadProgress={uploadProgress}
        onUploadFile={uploadSource}
        onUploadText={uploadText}
        onToggleSource={toggleSource}
        onDeleteSource={deleteSource}
        onUpdateMode={updateMode}
        onGenerateQuiz={generateQuiz}
      />

      {/* Learn from Answer Modal */}
      {learnModalMessage && (
        <LearnModal
          isOpen={Boolean(learnModalMessage)}
          onClose={() => setLearnModalMessage(null)}
          message={learnModalMessage}
          onSave={learnFromAnswer}
        />
      )}
    </div>
  );
};

export default ChatContainer;
