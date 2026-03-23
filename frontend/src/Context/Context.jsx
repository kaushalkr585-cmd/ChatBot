import { createContext, useState, useRef } from "react";
import runChat from "../Config/ChatBox";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 35 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
    setRecentPrompt("");
    setInput("");
    setUploadedImages([]);
  };

  const handleImageUpload = (files) => {
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );
    
    const newImages = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const onSent = async (promptFromClick) => {
    const finalPrompt = promptFromClick ?? input;
    if (!finalPrompt || finalPrompt.trim() === "") return;

    setPrevPrompts((prev) => [...prev, finalPrompt]);
    setRecentPrompt(finalPrompt);

    setResultData("");
    setLoading(true);
    setShowResult(true);

    try {
      let enhancedPrompt = finalPrompt;
      
      if (uploadedImages.length > 0) {
        enhancedPrompt += ` [User has attached ${uploadedImages.length} image(s)]`;
      }

      const response = await runChat(enhancedPrompt);

      let responseArray = response.split("**");
      let newResponse = "";

      for (let i = 0; i < responseArray.length; i++) {
        if (i % 2 === 0) {
          newResponse += responseArray[i];
        } else {
          newResponse += "<b>" + responseArray[i] + "</b>";
        }
      }

      let newResponse2 = newResponse.split("*").join("<br/>");
      let newResponseArray = newResponse2.split(" ");

      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + " ");
      }
      
      setUploadedImages([]);
    } catch (err) {
      console.error(err);
      setResultData("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    setShowResult,
    loading,
    setLoading,
    resultData,
    setResultData,
    input,
    setInput,
    newChat,
    uploadedImages,
    handleImageUpload,
    removeImage,
    startVoiceRecognition,
    stopVoiceRecognition,
    isListening,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
