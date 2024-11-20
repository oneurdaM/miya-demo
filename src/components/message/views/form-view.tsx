import {useEffect,useState} from 'react'
import {useRouter} from 'next/router'
import {useForm} from 'react-hook-form'

import Button from '@/components/ui/button'
import {SendMessageIcon} from '@/components/icons/send-message'
import TextArea from '@/components/ui/text-area'
import {useMeQuery} from '@/data/user'
import {useSocketContext} from '@/contexts/socket.context'

type FormValues = {
  message: string
  prueba: string
}

interface Props {
  className?: string;
  user?: any;
  onNewMessage: (message: any) => void; // Nueva prop para manejar mensajes
}

const CreateMessageForm = ({className,user,onNewMessage,...rest}: Props) => {
  const {register,handleSubmit,setFocus,reset} = useForm<FormValues>();
  const [base64,setBase64] = useState('');
  const [urlImage,setImageUrl] = useState('');
  const {sendMessage} = useSocketContext();
  const {data} = useMeQuery();
  const router = useRouter();
  const {query} = router;

  const onSubmit = async (values: FormValues) => {
    const message = {
      conversationId: query.id,
      userId: data?.id,
      message: base64 || urlImage || values.message,
      type: base64 ? 'IMAGE' : urlImage ? 'FILE' : 'TEXT',
      seen: false,
    };

    sendMessage(message);

    const newMsg = {
      content: message.message,
      createdAt: new Date(),
      id: Math.random().toString(),
      type: message.type,
      userId: data?.id,
      user: {
        id: data?.id,
        name: data?.name,
        avatar: data?.avatar
      }
    }
    onNewMessage(newMsg);

    reset();
    setBase64('');
    setImageUrl('');

    const chatBody = document.getElementById('chatBody');
    chatBody?.scrollTo({
      top: chatBody?.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    setFocus('message');
  },[setFocus]);

  return (
    <div className="mt-10">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* Manejo de archivos y vista de mensaje */}
        <div className="flex justify-around items-center">
          <TextArea
            className="overflow-y-auto overflow-x-hidden ml-11 mr-11 shadow-chatBox w-full"
            placeholder="Type your message here.."
            {...register('message')}
            variant="solid"
            inputClassName="!border-0 bg-white pr-12 block !h-full"
            rows={1}
            required
          />
          <Button className="!h-full px-4 text-lg focus:!shadow-none focus:!ring-0" variant="custom">
            <SendMessageIcon />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateMessageForm;
