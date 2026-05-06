import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { getRecordings } from "../../../apicalls/monitor";

function RecordingPlayerModal({ visible, setVisible, sessionData }) {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  if (!sessionData) return null;

  const { user, exam, _id: sessionId } = sessionData;

  const fetchRecordings = async () => {
    try {
      setLoading(true);
      const response = await getRecordings({ sessionId });
      if (response.success) {
        if (response.data.length === 0) {
          message.info("No video recordings found for this session.");
        } else {
          setRecordings(response.data);
          setShowVideo(true);
        }
      } else {
        message.error(response.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const getFullVideoUrl = () => {
    if (recordings.length === 0) return null;
    try {
      const byteArrays = recordings.map(r => {
        const base64 = r.videoData.split(',')[1];
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        return new Uint8Array(byteNumbers);
      });
      const blob = new Blob(byteArrays, { type: 'video/webm' });
      return URL.createObjectURL(blob);
    } catch (e) {
      console.error("Error creating video blob", e);
      return null;
    }
  };

  return (
    <Modal
      title={
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Session Recording</h2>
          <p className="text-sm text-gray-500 font-normal">
            {user?.name} • {exam?.name}
          </p>
        </div>
      }
      visible={visible}
      onCancel={() => {
        setVisible(false);
        setShowVideo(false);
        setRecordings([]);
      }}
      footer={null}
      width={800}
      centered
      className="creative-modal"
    >
      <div className="flex flex-col items-center">
        {!showVideo ? (
           <div className="py-12 text-center">
             <div className="mb-4 text-gray-400">
               <PlayCircleOutlined style={{ fontSize: 64 }} />
             </div>
             <Button 
               type="primary" 
               size="large" 
               onClick={fetchRecordings} 
               loading={loading}
             >
               Load and Play Recording
             </Button>
           </div>
        ) : (
          <div className="w-full">
            <div className="bg-black rounded-lg overflow-hidden shadow-2xl mb-4">
              <video 
                src={getFullVideoUrl()} 
                controls 
                className="w-full h-auto" 
                autoPlay
                style={{ maxHeight: '500px' }}
              />
            </div>
            <div className="p-3 bg-gray-50 rounded border text-sm">
               <strong>Session ID:</strong> <code>{sessionId}</code>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default RecordingPlayerModal;
