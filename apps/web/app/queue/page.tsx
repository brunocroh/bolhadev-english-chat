"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUserMedia } from "@/hooks/useUserMedia";
import { Header } from "@/components/header";
import { Mic } from "lucide-react";

export default function Page(): JSX.Element {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    audioDevices,
    videoDevices,
    selectedAudioDevice,
    setSelectedAudioDevice,
    selectedVideoDevice,
    setSelectedVideoDevice,
    accessGranted,
    stream,
  } = useUserMedia(videoRef.current!);

  const [me, setMe] = useState(null);
  const [usersOnline, setUsersOnline] = useState(null);
  const [inQueue, setInQueue] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream]);
  const { sendJsonMessage } = useWebSocket(
    process.env.NEXT_PUBLIC_SOCKET_URL!,
    {
      onOpen: () => {
        console.log("connected");
        sendJsonMessage({
          type: "me",
        });
      },
      onMessage: (event) => {
        const data = JSON.parse(event.data);
        console.log({ data });

        switch (data.type) {
          case "me":
            setMe(data.id);
            break;
          case "usersOnline":
            setUsersOnline(data.size);
            break;
          case "roomFound":
            console.log({ data });
            router.push(`/room/${data.roomId}`);
            break;
          default:
            break;
        }
      },
    },
  );

  const onConnect = useCallback(() => {
    setInQueue(!inQueue); // TODO: Replace to update the state when receive it from backend
    sendJsonMessage({ type: inQueue ? "queueExit" : "queueJoin", userId: me });
  }, [inQueue, me, sendJsonMessage]);

  return (
    <main className="flex flex-col h-full">
      <Header />
      <section className="flex h-full place-content-center justify-center content-center align-center">
        <div>
          <h1>Estamos procurando alguém para praticar inglês contigo</h1>
          <h1>QueueSize: {usersOnline}</h1>
          <h1>acessGranted: {accessGranted}</h1>
          <h1>userId: {me}</h1>
          <video
            className="[transform:rotateY(180deg)] w-96 h-96"
            ref={videoRef}
            playsInline
            autoPlay={true}
            muted={true}
          ></video>
          <h2>Confira sue microfone e webcam, enquanto aguarda</h2>
          <div className="flex flex-row gap-6 w-full">
            <Select
              onValueChange={setSelectedAudioDevice}
              value={selectedAudioDevice}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Audio" />
              </SelectTrigger>
              <SelectContent>
                {audioDevices.map((audio) => {
                  return (
                    <SelectItem
                      key={audio.deviceId}
                      value={audio.deviceId || audio.label}
                    >
                      <div className="flex flex-row gap-2 items-center">
                        <Mic size={12} /> {audio.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Select
              onValueChange={setSelectedVideoDevice}
              value={selectedVideoDevice}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Video" />
              </SelectTrigger>
              <SelectContent>
                {videoDevices.map((video) => {
                  return (
                    <SelectItem
                      key={video.deviceId}
                      value={video.deviceId || video.label}
                    >
                      {video.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <h2>
            {inQueue
              ? "Procurando outro usuário"
              : "Quando você estiver pronto entre em uma sala"}
          </h2>
          <Button onClick={onConnect}>
            {inQueue ? "Cancelar" : "Entrar em uma sala"}
          </Button>
        </div>
      </section>
    </main>
  );
}
