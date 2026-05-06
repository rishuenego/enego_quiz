import React, { useEffect, useRef, useState } from "react";
import { Col, Row, Empty, Tag, message, Tabs, Table, Button } from "antd";
import PageTitle from "../../../components/PageTitle";
import { getActiveSessions, getRecordedSessions } from "../../../apicalls/monitor";
import RecordingPlayerModal from "./RecordingPlayerModal";
import moment from "moment";
import { PlayCircleOutlined, VideoCameraOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
const POLL_MS = 5000;

function Monitor() {
  const [activeSessions, setActiveSessions] = useState([]);
  const [recordedSessions, setRecordedSessions] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const timerRef = useRef(null);

  const fetchActiveSessions = async () => {
    const r = await getActiveSessions({});
    if (r.success) {
      setActiveSessions(r.data || []);
      setLastUpdated(new Date());
    }
  };

  const fetchRecordedSessions = async () => {
    const r = await getRecordedSessions();
    if (r.success) {
      setRecordedSessions(r.data || []);
    }
  };

  useEffect(() => {
    fetchActiveSessions();
    fetchRecordedSessions();
    timerRef.current = setInterval(fetchActiveSessions, POLL_MS);
    return () => clearInterval(timerRef.current);
  }, []);

  const recordedColumns = [
    {
      title: "Student",
      dataIndex: "user",
      render: (user) => (
        <div>
          <div className="font-bold">{user?.name}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
      )
    },
    {
      title: "Exam",
      dataIndex: "exam",
      render: (exam) => (
        <div>
          <div>{exam?.name}</div>
          {exam?.stage && <Tag color="blue">Stage {exam.stage}</Tag>}
        </div>
      )
    },
    {
      title: "Recorded On",
      dataIndex: "createdAt",
      render: (date) => moment(date).format("DD MMM YYYY, hh:mm A")
    },
    {
      title: "Action",
      render: (record) => (
        <Button 
          type="primary" 
          danger 
          icon={<VideoCameraOutlined />} 
          onClick={() => {
            setSelectedSession(record);
            setShowPlayer(true);
          }}
        >
          Watch Recording
        </Button>
      )
    }
  ];

  return (
    <div className="enego-page">
      <PageTitle title="Platform Monitoring" />
      <div className="divider"></div>

      <Tabs defaultActiveKey="1" className="enego-tabs mt-2" onChange={(key) => {
        if (key === "2") fetchRecordedSessions();
      }}>
        <TabPane tab={<span><i className="ri-broadcast-line mr-1"></i> Live Monitoring</span>} key="1">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "12px 0",
            }}
          >
            <p style={{ margin: 0, color: "#666" }}>
              Active sessions in the last 30 seconds. Auto-refreshes every {POLL_MS / 1000}s.
            </p>
            <span style={{ fontSize: 12, color: "#999" }}>
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : ""}
            </span>
          </div>

          {activeSessions.length === 0 ? (
            <Empty description="No active exam sessions right now" className="mt-5" />
          ) : (
            <Row gutter={[20, 20]}>
              {activeSessions.map((s) => (
                <Col xs={24} sm={12} md={8} lg={6} key={s._id}>
                  <div className="monitor-card" style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    padding: 12,
                    background: "#fff",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  }}>
                    <div style={{
                        width: "100%",
                        aspectRatio: "4/3",
                        background: "#0f172a",
                        borderRadius: 8,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#94a3b8",
                        fontSize: 12,
                      }}>
                      {s.image ? (
                        <img src={s.image} alt="live" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div className="text-center">
                          <i className="ri-camera-off-line" style={{ fontSize: 24 }}></i>
                          <div>Connecting...</div>
                        </div>
                      )}
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <div className="font-bold text-lg">{s.user?.name}</div>
                      <div className="text-xs text-gray-500 mb-2">{s.user?.email}</div>
                      <div className="text-sm font-medium text-indigo-600 mb-3">
                        {s.exam?.name}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Tag color="blue" icon={<i className="ri-question-line mr-1"></i>}>Q {Number(s.questionIndex || 0) + 1}</Tag>
                        {s.tabViolations > 0 && (
                          <Tag color="error" icon={<i className="ri-alert-line mr-1"></i>}>{s.tabViolations}</Tag>
                        )}
                        <div className="text-xs text-gray-400 mt-1 w-full">
                          <i className="ri-time-line mr-1"></i> {new Date(s.lastSeenAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </TabPane>

        <TabPane tab={<span><i className="ri-history-line mr-1"></i> Recorded Sessions</span>} key="2">
           <div className="mt-4">
              <Table 
                columns={recordedColumns} 
                dataSource={recordedSessions} 
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                className="custom-antd-table"
              />
           </div>
        </TabPane>
      </Tabs>

      <RecordingPlayerModal 
        visible={showPlayer} 
        setVisible={setShowPlayer} 
        sessionData={selectedSession} 
      />
    </div>
  );
}

export default Monitor;
