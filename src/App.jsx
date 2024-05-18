import React ,{useState,useEffect} from 'react';


function App() {
  const[errMessage,setErrMessage] = useState('');
  const [message,setMessage] = useState('');
  const [inputValue,setInputValue] = useState('');

  const [previousChats,setPreviousChats] = useState([]);
  const [currentChat,setCurrentChat] = useState([]);
  const [chatNumber,setChatNumber] = useState(null);
  const [showCurrentChat,setShowCurrentChat] = useState(false);
  const [isPreviousChat,setIsPreviousChat] = useState(false);
  const [loading,setLoading] = useState(false);

  function inputHandler(event_object){
    setInputValue(event_object.target.value);
  }

  async function submitHandler(event_object){
    event_object.preventDefault();
    if(inputValue.trim() === ''){
      setErrMessage('Input Field is empty');
      return ;
    }

    const options = {
      method:"POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message: `${inputValue}`,
      })
    };

    try {
      setLoading(true);
      const response = await fetch('https://chatbot-backend-v9sx.onrender.com/completitions',options);
      const finalData = await response.json();

      if(finalData.statusCode === 200){
        setErrMessage('');
        setMessage(finalData.message);
      } else{
        throw finalData;
      }
      setShowCurrentChat(false);
    } catch (error) {
      setErrMessage(error.errMessage);
    }

  }

  function previousChatHandler(){
    setShowCurrentChat(!showCurrentChat);
    setInputValue('');
    setMessage('');
  }
  console.log(previousChats,'previous');
  console.log(currentChat,'current');

  function newChatHandler(){
    if(currentChat.length){
      setInputValue('');
      setMessage('');
      setShowCurrentChat(false);
      if(!isPreviousChat){
        setPreviousChats(previous => {
          return [
            ...previous,
            currentChat,
          ]
        });
      } else{
        setIsPreviousChat(false);
      }
      setCurrentChat([]);
    }
  }

  function bringPreviousChat(chatId){
    setChatNumber(chatId);
    setInputValue('');
    setMessage('');
    setShowCurrentChat(true);
    setIsPreviousChat(true);
    setCurrentChat(previousChats[chatId]);
  }

  useEffect(() => {
    setLoading(false);
    const tempArr = {
      inputValue,
      message
    };

    if(message.trim() !== ''){
      setCurrentChat(currentConversation => {
        return [...currentConversation,tempArr];
      });

      if(isPreviousChat){
        previousChats[chatNumber].push(tempArr);
        setPreviousChats(previous => [...previous]);
      } else{
        setChatNumber(null);
      }
    }

    setInputValue('');
  },[message]);

  return (
    <div className='app'>

        <section className='side-bar'>
          <button onClick={newChatHandler} className='newchat-btn'>+ New Chat</button>
          {
            <div className='previous-chat'>
              {
                previousChats.length !== 0 && previousChats.map((element,index) => <li className='previous-chatlist' onClick={() => bringPreviousChat(index)} key={index}>{`Chat ${index + 1}`}</li>)
              }
            </div>
          }
          <button onClick={previousChatHandler} className='btn'>{showCurrentChat ? 'Hide All Current Chat' : 'Show All Current Chat'}</button>
        </section>

        <section className='main'>
          <h1>Wellness Chatbot</h1>
          {
            <div className='current-chat'>
            {
              showCurrentChat && currentChat.map((element,index) => {
              return (
                  <ul  key={index}>
                    <li className='current-list-user'><span className='user'>{`User :- `}</span>{`${element.inputValue}`}</li>
                    <li className='current-list-chatbot'><span className='chatbot'>{`Chatbot :- `}</span>{`${element.message}`}</li>
                  </ul>
                )
              })
            }
            </div>
          }

          <div className='bottom-section'>
              <form className='input-container'>
                  <input value={inputValue} type='text' placeholder='Enter the Fitness Message' onChange={inputHandler} className='input-field'/>
                  <button type='submit' onClick={submitHandler} className='submit-btn'>Submit</button>
                  {
                    loading && <div class="spinner"></div>
                  }
              </form>

              <p className='response'>{message}</p>

              {
                errMessage.length !== 0 && <p className='error-message'>{errMessage}</p>
              }
          </div>
        </section>
    </div>
  )
}

export default App;
