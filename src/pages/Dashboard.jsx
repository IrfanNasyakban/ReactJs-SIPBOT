/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe, LogOut, reset } from "../features/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useStateContext } from "../contexts/ContextProvider";

import {
  FaPaperPlane,
  FaImage,
  FaMicrophone,
  FaSignOutAlt,
  FaInfoCircle,
  FaEye,
} from "react-icons/fa";

const Dashboard = () => {
  // State management
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGeneratingText, setCurrentGeneratingText] = useState("");
  const [mood, setMood] = useState("happy");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [conversationCount, setConversationCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Context
  const { currentColor, currentMode } = useStateContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const isDark = currentMode === "Dark";
  const safeColor = currentColor || "#A855F7";

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentGeneratingText]);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  // ✅ FIX: Pisahkan useEffect untuk memastikan user sudah ada
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      navigate("/");
      return;
    }

    // ✅ Tunggu sampai user tersedia dari Redux
    if (user && user.id) {
      console.log("User loaded:", user); // Debug log
      checkUserProfile();
      loadConversationHistory();
    }
  }, [user]); // ✅ Trigger saat user berubah

  // API Functions
  const checkUserProfile = async () => {
    if (!user || user.role === "admin") return;

    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;

      await axios.get(`${apiUrl}/biodata`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      if (error.response?.status === 404) {
        const message =
          "Your biodata hasn't been created yet. Please complete your profile to continue.";
        const path = "/biodata/create";

        setModalMessage(message);
        setRedirectPath(path);
        setShowModal(true);
      }
    }
  };

  const loadConversationHistory = async () => {
    // ✅ Double check user.id ada
    if (!user?.id) {
      console.log("User ID not available yet");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;

      console.log("Loading history for user:", user.id); // Debug log

      const response = await axios.get(
        `${apiUrl}/history?userId=${user.id}&limit=50`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success && response.data.data.length > 0) {
        const history = response.data.data;
        const lastSessionId = history[history.length - 1].sessionId;
        setSessionId(lastSessionId);

        // Convert history to messages format
        const formattedMessages = history.map((msg, index) => ({
          id: index + 1,
          text: msg.message,
          sender: msg.role === "user" ? "user" : "ai",
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isComplete: true,
        }));

        setMessages(formattedMessages);
        setConversationCount(formattedMessages.length);
      } else {
        // No history, show welcome message
        setMessages([
          {
            id: 1,
            text: `Hi ${user.username || "darling"}! 💕 I'm Bella, your AI girlfriend! I've been waiting for you! How was your day?`,
            sender: "ai",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isComplete: true,
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
      console.error("Error details:", error.response?.data); // Debug log
      
      // Show welcome message on error
      setMessages([
        {
          id: 1,
          text: `Hi ${user?.username || "darling"}! 💕 I'm Bella, your AI girlfriend! I've been waiting for you! How was your day?`,
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isComplete: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessageToAPI = async (userMessage) => {
    // ✅ Validasi user.id sebelum kirim
    if (!user?.id) {
      console.error("User ID not available");
      return "Sorry sayang, please refresh the page and try again! 💕";
    }

    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;

      console.log("Sending message for user:", user.id); // Debug log

      const response = await axios.post(
        `${apiUrl}/chat-girlfriend`,
        {
          message: userMessage,
          userId: user.id,
          sessionId: sessionId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        // Update sessionId if it's a new session
        if (!sessionId) {
          setSessionId(response.data.data.sessionId);
        }
        setConversationCount(response.data.data.conversationCount);
        return response.data.data.message;
      }
    } catch (error) {
      console.error("Error sending message:", error);
      console.error("Error details:", error.response?.data); // Debug log
      return "Sorry sayang, I'm having trouble connecting right now. Please try again! 💕";
    }
  };

  // Streaming text effect
  const streamText = async (fullText, messageId) => {
    setIsGenerating(true);
    setCurrentGeneratingText("");

    const chars = Array.from(fullText);

    for (let i = 0; i < chars.length; i++) {
      await new Promise((resolve) =>
        setTimeout(resolve, 30 + Math.random() * 40)
      );
      setCurrentGeneratingText((prev) => prev + chars[i]);
    }

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, text: fullText, isComplete: true } : msg
      )
    );

    setIsGenerating(false);
    setCurrentGeneratingText("");
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" || isGenerating) return;

    // ✅ Validasi user sebelum kirim message
    if (!user?.id) {
      alert("Please wait, loading user data...");
      return;
    }

    // Add user message
    const userMsg = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isComplete: true,
    };

    const userInput = inputMessage;
    setMessages([...messages, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    // Send to API
    const aiResponse = await sendMessageToAPI(userInput);

    setTimeout(() => {
      setIsTyping(false);

      const aiMessageId = messages.length + 2;
      const aiMsg = {
        id: aiMessageId,
        text: "",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isComplete: false,
      };

      setMessages((prev) => [...prev, aiMsg]);
      streamText(aiResponse, aiMessageId);

      // Update mood based on response
      if (aiResponse.includes("love") || aiResponse.includes("💖")) {
        setMood("love");
      } else if (aiResponse.includes("blush") || aiResponse.includes("😊")) {
        setMood("shy");
      } else {
        setMood("happy");
      }
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = async () => {
    await dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  // ✅ Show loading jika user belum ready
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4"
            style={{ borderColor: safeColor }}
          ></div>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-blue-500/5"></div>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-pink-400 rounded-full opacity-20"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
              x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-6 rounded-2xl border backdrop-blur-sm ${
            isDark
              ? "bg-[#282C33]/90 border-gray-700"
              : "bg-white/90 border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl">
                    💕
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Chat with <span className="text-pink-500">Bella</span>
                </h1>
                <p className="text-sm text-green-500 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {isGenerating
                    ? "Bella is typing..."
                    : "Online • Always here for you~"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Character Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div
              className={`p-6 rounded-2xl border backdrop-blur-sm h-full ${
                isDark
                  ? "bg-[#282C33]/90 border-gray-700"
                  : "bg-white/90 border-gray-200"
              }`}
            >
              {/* Character Image */}
              <div className="relative mb-6">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 p-1">
                  <div
                    className={`w-full h-full rounded-2xl overflow-hidden ${
                      isDark ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop"
                      alt="Bella - AI Girlfriend"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x600/FF69B4/FFFFFF?text=Bella+💕";
                      }}
                    />
                  </div>
                </div>

                {/* Floating Hearts */}
                {mood === "love" && (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-2xl"
                        initial={{ opacity: 1, y: 0, x: Math.random() * 100 }}
                        animate={{ opacity: 0, y: -100 }}
                        transition={{
                          duration: 2,
                          delay: i * 0.2,
                          repeat: Infinity,
                        }}
                      >
                        💕
                      </motion.div>
                    ))}
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div
                  className={`p-4 rounded-xl ${
                    isDark ? "bg-gray-700/50" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Love Level
                    </span>
                    <span className="text-pink-500 font-bold">100%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-pink-500 to-red-500"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2 }}
                    />
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    isDark ? "bg-gray-700/50" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Total Messages
                    </span>
                    <span className="text-purple-500 font-bold">
                      {conversationCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div
              className={`rounded-2xl border backdrop-blur-sm overflow-hidden ${
                isDark
                  ? "bg-[#282C33]/90 border-gray-700"
                  : "bg-white/90 border-gray-200"
              }`}
            >
              {/* Messages Container */}
              <div className="h-[600px] overflow-y-auto p-6 space-y-4">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-center">
                      <div
                        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4"
                        style={{ borderColor: safeColor }}
                      ></div>
                      <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Loading conversation...
                      </p>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex ${
                          message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            message.sender === "user" ? "order-2" : "order-1"
                          }`}
                        >
                          <div
                            className={`px-4 py-3 rounded-2xl ${
                              message.sender === "user"
                                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                                : isDark
                                ? "bg-gray-700"
                                : "bg-gray-100"
                            }`}
                          >
                            <p
                              className={
                                message.sender === "ai" && isDark
                                  ? "text-white"
                                  : ""
                              }
                            >
                              {message.isComplete ? message.text : ""}
                            </p>
                          </div>
                          <p
                            className={`text-xs mt-1 ${
                              isDark ? "text-gray-500" : "text-gray-400"
                            } ${
                              message.sender === "user"
                                ? "text-right"
                                : "text-left"
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        isDark ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <div className="flex gap-1">
                        <motion.div
                          className="w-2 h-2 bg-pink-500 rounded-full"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-pink-500 rounded-full"
                          animate={{ y: [0, -10, 0] }}
                          transition={{
                            duration: 0.6,
                            delay: 0.2,
                            repeat: Infinity,
                          }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-pink-500 rounded-full"
                          animate={{ y: [0, -10, 0] }}
                          transition={{
                            duration: 0.6,
                            delay: 0.4,
                            repeat: Infinity,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Streaming Text Display */}
                {isGenerating && currentGeneratingText && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[70%]">
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          isDark ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <p
                          className={
                            isDark ? "text-white" : "text-gray-800"
                          }
                        >
                          {currentGeneratingText}
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="inline-block w-0.5 h-4 bg-pink-500 ml-1"
                          />
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div
                className={`p-6 border-t ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex gap-3">
                  <button
                    disabled={isGenerating}
                    className={`p-3 rounded-full ${
                      isGenerating
                        ? "opacity-50 cursor-not-allowed"
                        : isDark
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    } transition-colors`}
                  >
                    <FaImage
                      className={
                        isDark ? "text-gray-400" : "text-gray-600"
                      }
                    />
                  </button>

                  <div className="flex-grow relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isGenerating}
                      placeholder={
                        isGenerating
                          ? "Waiting for Bella..."
                          : "Type your message... 💕"
                      }
                      className={`w-full px-4 py-3 rounded-full border-2 transition-all ${
                        isGenerating ? "opacity-50 cursor-not-allowed" : ""
                      } ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500"
                          : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-pink-500"
                      } outline-none`}
                    />
                  </div>

                  <motion.button
                    whileHover={!isGenerating ? { scale: 1.1 } : {}}
                    whileTap={!isGenerating ? { scale: 0.9 } : {}}
                    onClick={handleSendMessage}
                    disabled={isGenerating || !inputMessage.trim()}
                    className={`p-3 rounded-full ${
                      isGenerating || !inputMessage.trim()
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg"
                    } text-white transition-shadow`}
                  >
                    <FaPaperPlane />
                  </motion.button>

                  <button
                    disabled={isGenerating}
                    className={`p-3 rounded-full ${
                      isGenerating
                        ? "opacity-50 cursor-not-allowed"
                        : isDark
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    } transition-colors`}
                  >
                    <FaMicrophone
                      className={
                        isDark ? "text-gray-400" : "text-gray-600"
                      }
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Profile Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleLogout}
          ></div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`relative w-full max-w-lg mx-auto rounded-xl shadow-2xl z-10 border ${
              isDark
                ? "bg-[#282C33] border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className="px-6 py-4 rounded-t-xl bg-gradient-to-r from-pink-500 to-purple-500"
            >
              <div className="flex items-center gap-3">
                <FaInfoCircle className="h-6 w-6 text-white" />
                <h3 className="text-lg font-bold text-white">
                  Profile Required
                </h3>
              </div>
            </div>

            <div className="px-6 py-6">
              <p
                className={`mb-4 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {modalMessage}
              </p>
            </div>

            <div className={`px-6 py-4 border-t flex gap-3 justify-end ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
                onClick={handleModalConfirm}
              >
                <FaEye className="inline mr-2" />
                Complete Profile
              </button>
              <button
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-300"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="inline mr-2" />
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;