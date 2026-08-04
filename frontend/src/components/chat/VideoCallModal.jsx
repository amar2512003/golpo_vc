import { useEffect, useRef } from "react";
import { Button } from "@heroui/react";
import { PhoneOffIcon, PhoneIcon } from "lucide-react";
import { useCallStore } from "../../store/useCallStore";

export function VideoCallModal() {
  const callStatus = useCallStore((state) => state.callStatus);
  const localStream = useCallStore((state) => state.localStream);
  const remoteStream = useCallStore((state) => state.remoteStream);
  const callPartner = useCallStore((state) => state.callPartner);
  const acceptCall = useCallStore((state) => state.acceptCall);
  const rejectCall = useCallStore((state) => state.rejectCall);
  const endCall = useCallStore((state) => state.endCall);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (callStatus === "idle") return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90">
      <p className="mb-4 text-lg text-white">
        {callStatus === "calling" && `Calling ${callPartner?.fullName}...`}
        {callStatus === "incoming" && `${callPartner?.fullName} is calling...`}
        {callStatus === "connected" && callPartner?.fullName}
      </p>

      <div className="relative w-full max-w-2xl">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full rounded-xl bg-black"
        />
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute bottom-4 right-4 w-32 rounded-lg border-2 border-white"
        />
      </div>

      <div className="mt-6 flex gap-4">
        {callStatus === "incoming" ? (
          <>
            <Button
              isIconOnly
              className="bg-green-500 text-white"
              onPress={acceptCall}
            >
              <PhoneIcon className="size-5" />
            </Button>
            <Button
              isIconOnly
              className="bg-red-500 text-white"
              onPress={rejectCall}
            >
              <PhoneOffIcon className="size-5" />
            </Button>
          </>
        ) : (
          <Button isIconOnly className="bg-red-500 text-white" onPress={endCall}>
            <PhoneOffIcon className="size-5" />
          </Button>
        )}
      </div>
    </div>
  );
}