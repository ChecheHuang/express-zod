import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { provide } from '@/lib/implementation'
import { useSocket } from '@/providers/socket-provider'
import { createRef, useEffect, useState } from 'react'

export default function App() {
  const { socket } = useSocket()
  const inputRef = createRef<HTMLInputElement>()

  const [message, setMessage] = useState<string>('這是原本React裡面的字')

  const sendMessage = () => {
    if (!inputRef.current || !socket) return
    socket.emit('chat', inputRef.current.value)
    inputRef.current.value = ''
    inputRef.current.focus()
  }

  const getTodo = async () => {
    const res = await provide('get','/api/todo',{})
    if (res.status === 'error') return
    console.log(res.data)
  }

  useEffect(() => {
    getTodo()
    if (socket) {
      socket.on('onChat', (message: string) => {
        setMessage(message)
      })
    }
  }, [socket])

  return (
    <div className=" w-full h-[100vh]  flex flex-col justify-center items-center ">
      <div className="w-100 flex flex-col gap-2">
        <div className="flex gap-4">
          <Input ref={inputRef} className="w-60 " />
          <Button onClick={sendMessage}>傳送資料給其他人</Button>
        </div>
        <Alert variant="default">
          <AlertTitle>收到的文字</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
