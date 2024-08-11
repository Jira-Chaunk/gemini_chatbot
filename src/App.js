import { useState } from "react";

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const surpriseOptions = [
    'Who is Anya ?',
    'who is the founder of google ?',
    'Is chatgpt better than gemini ?',
    'Why do we have february 29 ?',
    'Roll a dice',
    'Tell a joke'
  ]

  const clear = () => {
    setValue("")
    setError("")
    setChatHistory([])
  }

  const surprise = () => {
    const random = Math.floor(Math.random() * surpriseOptions.length)
    setValue(surpriseOptions[random])
  }
  const getResponse = async () => {
    if (!value) {
      setError("Error please ask a question")
      return
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch('http://localhost:3000/gemini', options)
      const data = await response.text()
      setChatHistory(oldChatHistory => [oldChatHistory, {
        role: "user",
        parts: "value"
      },
        {
          role: "model",
          parts: data
        }
      ])
      setValue("")

    } catch (error) {
      console.error(error)
      setError("Something went wrong Please try again later")
    }

  }

  return (

    <div className="app">
      <p>What do you want to know ?

        <button className="surprise" onClick={surprise} disabled={!chatHistory}>Surprise me</button>
      </p>
      <div className="input-container">
        <input
          value={value}
          placeholder="When is Diwali ?"
          onChange={(e) => setValue(e.target.value)} />
        {!error && <button onClick={getResponse}>
          Ask Me
        </button>}
        {error && <button onClick={clear}>
          clear
        </button>}

      </div>
      {error && <p>{error}</p>}
      <div className="search-result">
        {chatHistory.map((chatItem, _index) => <div key={""}>
          <p className="answer">{chatItem.role} : {chatItem.parts}</p>
        </div>)}
      </div>


    </div>
  );
}

export default App;
