import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

function App() {
  const [socket, setSocket] = useState<any>(null)

  useEffect(() => {
    setSocket(io(`ws://localhost:8081`))
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('onChat', (message: string) => {
        alert(message)
      })
    }
  }, [socket])

  return (
    <>
      <div>
        <button
          onClick={() => {
            socket.emit('chat', 'hello')
          }}
        >
          say hello
        </button>
      </div>
    </>
  )
}

export default App
