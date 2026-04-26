/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe, LogOut, reset } from "../features/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useStateContext } from "../contexts/ContextProvider";
import MessageRenderer from "../components/MessageRender";

import {
  FaPaperPlane,
  FaSignOutAlt,
  FaInfoCircle,
  FaEye,
} from "react-icons/fa";

import mascotImg from "../assets/mascot.png";

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGeneratingText, setCurrentGeneratingText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const { currentColor, currentMode } = useStateContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const isDark = currentMode === "Dark";
  const safeColor = currentColor || "#A855F7";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages, currentGeneratingText]);
  useEffect(() => { dispatch(getMe()); }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { navigate("/"); return; }
    if (user && user.id) loadConversationHistory();
  }, [user]);

  const loadConversationHistory = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(
        `${apiUrl}/history?userId=${user.id}&limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success && response.data.data.length > 0) {
        const history = response.data.data;
        setSessionId(history[history.length - 1].sessionId);
        setMessages(history.map((msg, index) => ({
          id: index + 1,
          text: msg.message,
          sender: msg.role === "user" ? "user" : "ai",
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isComplete: true,
        })));
      } else {
        setMessages([{
          id: 1,
          text: `Hi ${user.username || "admin"}! Saya SIPBOT, Asisten anda dalam mengumpulkan informasi data pegawai, Siap untuk memberikan data yang anda butuhkan!`,
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isComplete: true,
        }]);
      }
    } catch (error) {
      setMessages([{
        id: 1,
        text: `Hi ${user?.username || "admin"}! Saya SIPBOT, Asisten anda dalam mengumpulkan informasi data pegawai, Siap untuk memberikan data yang anda butuhkan!`,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isComplete: true,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessageToAPI = async (userMessage) => {
    if (!user?.id) return "Sorry, please refresh the page and try again!";
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const conversationHistory = messages
        .filter(m => m.isComplete)
        .map(m => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text }))
        .slice(-10);
      const response = await axios.post(
        `${apiUrl}/api/chatbot/chat`,
        { message: userMessage, userId: user.id, sessionId, conversationHistory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        if (!sessionId && response.data.data.conversationId) setSessionId(response.data.data.conversationId);
        return response.data.data.message;
      }
      return response.data.message || "Error: Unable to get response";
    } catch (error) {
      if (error.response?.status === 401) return "Session expired. Please login again!";
      if (error.response?.status === 429) return "Too many requests. Please wait a moment!";
      return "Sorry, I'm having trouble connecting right now. Please try again!";
    }
  };

  const streamText = async (fullText, messageId) => {
    setIsGenerating(true);
    setCurrentGeneratingText("");
    const chars = Array.from(fullText);
    for (let i = 0; i < chars.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 25));
      setCurrentGeneratingText(prev => prev + chars[i]);
    }
    setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, text: fullText, isComplete: true } : msg));
    setIsGenerating(false);
    setCurrentGeneratingText("");
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" || isGenerating) return;
    if (!user?.id) { alert("Please wait, loading user data..."); return; }

    const userMsg = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isComplete: true,
    };
    const userInput = inputMessage;
    setMessages([...messages, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    const aiResponse = await sendMessageToAPI(userInput);
    setTimeout(() => {
      setIsTyping(false);
      const aiMessageId = messages.length + 2;
      setMessages(prev => [...prev, {
        id: aiMessageId, text: "", sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isComplete: false,
      }]);
      streamText(aiResponse, aiMessageId);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const handleLogout = async () => {
    await dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4" style={{ borderColor: safeColor }} />
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ background: isDark ? "#040c24" : "#f8fafc" }}>
      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className={`mb-8 p-8 rounded-3xl border backdrop-blur-xl ${
            isDark ? "bg-gradient-to-br from-[#1a2332]/80 to-[#0f1419]/80 border-blue-500/20" : "bg-white/80 border-gray-200"
          }`}
          style={{ boxShadow: isDark ? "0 8px 32px rgba(56,139,255,.12)" : "0 4px 16px rgba(0,0,0,.05)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 flex items-center justify-center">
                <img src={mascotImg} alt="SIPBOT" className="w-16 h-16 object-contain drop-shadow-lg" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                  SIPBOT <span style={{ color: "#FDB927" }}>Assistant</span>
                </h1>
                <p className={`text-sm mt-2 flex items-center gap-2 ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {isGenerating ? "Processing your request..." : "Online and ready to help"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Chat Area ── */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div
            className={`rounded-3xl border backdrop-blur-xl overflow-hidden ${
              isDark ? "bg-gradient-to-br from-[#1a2332]/80 to-[#0f1419]/80 border-blue-500/20" : "bg-white/80 border-gray-200"
            }`}
            style={{ boxShadow: isDark ? "0 8px 32px rgba(56,139,255,.12)" : "0 4px 16px rgba(0,0,0,.05)" }}
          >
            {/* Top accent */}
            <div className="h-px" style={{ background: isDark ? "linear-gradient(90deg,transparent,rgba(56,139,255,.4),transparent)" : "linear-gradient(90deg,transparent,rgba(59,130,246,.2),transparent)" }} />

            {/* ── Messages ── */}
            <div className="h-[600px] overflow-y-auto p-6 md:p-8 space-y-5">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-14 w-14 border-2 mx-auto mb-4"
                      style={{ borderColor: "transparent", borderTopColor: "#FDB927", borderRightColor: "#388BFF" }} />
                    <p className={isDark ? "text-gray-400" : "text-gray-600"}>Loading conversation...</p>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  {messages.filter(m => m.isComplete).map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {/* AI Avatar */}
                      {message.sender === "ai" && (
                        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                          <img src={mascotImg} alt="SIPBOT" className="w-10 h-10 object-contain drop-shadow-lg" />
                        </div>
                      )}

                      {/* ✅ Message bubble — wider for AI to accommodate tables */}
                      <div className={message.sender === "user" ? "max-w-[65%]" : "max-w-[85%] w-full"}>
                        <div
                          className={`px-5 py-3 rounded-2xl ${
                            message.sender === "user"
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                              : isDark
                                ? "bg-gradient-to-br from-gray-800/70 to-gray-900/70 text-gray-100 rounded-bl-none"
                                : "bg-gray-50 text-gray-800 rounded-bl-none border border-gray-100"
                          }`}
                          style={{
                            backdropFilter: isDark ? "blur(8px)" : "none",
                            boxShadow: message.sender === "user" ? "0 4px 12px rgba(59,130,246,.2)" : isDark ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.06)",
                          }}
                        >
                          {message.sender === "user" ? (
                            // User messages: plain text
                            <p className="leading-relaxed text-sm md:text-base">{message.text}</p>
                          ) : (
                            // ✅ AI messages: rendered with MessageRenderer
                            <MessageRenderer text={message.text} isDark={isDark} />
                          )}
                        </div>
                        <p className={`text-xs mt-2 ${isDark ? "text-gray-500" : "text-gray-400"} ${message.sender === "user" ? "text-right" : "text-left"}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-end gap-2">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src={mascotImg} alt="SIPBOT" className="w-10 h-10 object-contain drop-shadow-lg" />
                  </div>
                  <div className={`px-5 py-3 rounded-2xl rounded-bl-none ${isDark ? "bg-gradient-to-br from-gray-700/60 to-gray-800/60" : "bg-gray-100"}`}>
                    <div className="flex gap-1.5">
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <motion.div key={i} className="w-2 h-2 bg-blue-400 rounded-full"
                          animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, delay, repeat: Infinity }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Streaming text */}
              {isGenerating && currentGeneratingText && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-end gap-2">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src={mascotImg} alt="SIPBOT" className="w-10 h-10 object-contain drop-shadow-lg" />
                  </div>
                  <div className="max-w-[85%] w-full">
                    <div className={`px-5 py-3 rounded-2xl rounded-bl-none ${isDark ? "bg-gradient-to-br from-gray-800/70 to-gray-900/70 text-gray-100" : "bg-gray-50 text-gray-800 border border-gray-100"}`}>
                      {/* ✅ Streaming juga pakai MessageRenderer untuk preview live */}
                      <MessageRenderer text={currentGeneratingText} isDark={isDark} />
                      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-0.5 h-4 bg-blue-400 ml-1 align-middle" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom accent */}
            <div className="h-px" style={{ background: isDark ? "linear-gradient(90deg,transparent,rgba(56,139,255,.4),transparent)" : "linear-gradient(90deg,transparent,rgba(59,130,246,.2),transparent)" }} />

            {/* ── Input Area ── */}
            <div className={`p-6 ${isDark ? "border-t border-blue-500/20" : "border-t border-gray-200"}`}>
              <div className="flex gap-4 items-end">
                <div className="flex-grow relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isGenerating}
                    placeholder={isGenerating ? "Waiting for SIPBOT..." : "Ask me anything about pegawai data..."}
                    className={`w-full px-5 py-3 rounded-2xl border-2 transition-all text-sm md:text-base ${isGenerating ? "opacity-50 cursor-not-allowed" : ""} ${
                      isDark
                        ? "bg-gray-800/50 border-blue-500/30 text-white placeholder-gray-500 focus:border-blue-400 focus:bg-gray-800/80"
                        : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-blue-50"
                    } outline-none`}
                    style={{ backdropFilter: isDark ? "blur(8px)" : "none" }}
                  />
                </div>
                <motion.button
                  whileHover={!isGenerating ? { scale: 1.05 } : {}}
                  whileTap={!isGenerating ? { scale: 0.95 } : {}}
                  onClick={handleSendMessage}
                  disabled={isGenerating || !inputMessage.trim()}
                  className={`p-3 rounded-full transition-all flex-shrink-0 ${
                    isGenerating || !inputMessage.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg hover:shadow-blue-500/40"
                  } text-white`}
                >
                  <FaPaperPlane className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Profile Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={handleLogout} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`relative w-full max-w-lg mx-auto rounded-xl shadow-2xl z-10 border ${isDark ? "bg-[#282C33] border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="px-6 py-4 rounded-t-xl bg-gradient-to-r from-pink-500 to-purple-500">
              <div className="flex items-center gap-3">
                <FaInfoCircle className="h-6 w-6 text-white" />
                <h3 className="text-lg font-bold text-white">Profile Required</h3>
              </div>
            </div>
            <div className="px-6 py-6">
              <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>{modalMessage}</p>
            </div>
            <div className={`px-6 py-4 border-t flex gap-3 justify-end ${isDark ? "border-gray-700" : "border-gray-200"}`}>
              <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
                onClick={() => { setShowModal(false); if (redirectPath) navigate(redirectPath); }}>
                <FaEye className="inline mr-2" />Complete Profile
              </button>
              <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-300" onClick={handleLogout}>
                <FaSignOutAlt className="inline mr-2" />Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;