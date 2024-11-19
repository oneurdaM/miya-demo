import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import Webcam from 'react-webcam'

import Button from '@/components/ui/button'

type IProps = {
  onSave: (image: any) => void
}

const videoConstraints = {
  width: 540,
  facingMode: 'environment',
}

const WebcamComponent = ({ onSave }: IProps) => {
  const { t } = useTranslation()
  const webcamRef = useRef<Webcam | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true)

  const capturePhoto = useCallback(async () => {
    const imageSrc: any = webcamRef.current?.getScreenshot()
    setUrl(imageSrc)
    onSave(imageSrc)

    if (webcamRef.current) {
      const videoStream = webcamRef.current.video?.srcObject as MediaStream
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop())
        setIsCameraOn(false)
      }
    }
  }, [webcamRef, onSave])

  const handleRefresh = () => {
    setUrl(null)
    setIsCameraOn(true)
  }

  return (
    <>
      {isCameraOn && (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="rounded-md"
        />
      )}
      <div className="mt-4">
        <Button onClick={capturePhoto} className="mr-5" disabled={!isCameraOn}>
          {t('form:capture-selfie')}
        </Button>
        <Button onClick={handleRefresh}>{t('form:refresh-capture')}</Button>
      </div>
      {url && (
        <div className="mt-4">
          <Image
            src={url}
            alt="Screenshot-selfie"
            width={200}
            height={200}
            className="rounded-md"
          />
        </div>
      )}
    </>
  )
}

export default WebcamComponent
