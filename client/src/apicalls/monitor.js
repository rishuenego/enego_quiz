import axiosInstance from "./index";

export const sendSnapshot = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/monitor/snapshot",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false };
  }
};

export const getActiveSessions = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/monitor/active-sessions",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false };
  }
};

export const endMonitorSession = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/monitor/end-session",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false };
  }
};

export const saveRecordingChunk = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/monitor/save-recording-chunk",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false };
  }
};

export const getRecordings = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/monitor/get-recordings",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false };
  }
};

export const getRecordedSessions = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/monitor/recorded-sessions"
    );
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false };
  }
};
