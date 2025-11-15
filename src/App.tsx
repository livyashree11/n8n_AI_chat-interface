
import { useState, type ChangeEvent,  } from "react";
import axios from "axios";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const App = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hello! Ask me anything 😊" }
  ]);

  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5678/webhook-test/say", {
        question: input,
      });

      const botReply = res.data.response || "No response received";

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botReply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠ Error: Unable to reach server." },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-5 flex flex-col">
        
        <h2 className="text-xl font-bold text-center mb-3"> Chatbot</h2>

        
        <div className="flex-1 overflow-y-auto mb-4 p-3 bg-gray-50 rounded-lg h-96">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`my-2 flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs text-white ${
                  msg.sender === "user"
                    ? "bg-blue-600"
                    : "bg-gray-700"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <p className="text-gray-500 text-sm">Bot is typing...</p>
          )}
        </div>

     
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border rounded-lg"
          />

          <button
            onClick={handleSend}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
