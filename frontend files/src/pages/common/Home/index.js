import { Col, message, Row, Pagination } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams, getExamStatusForUser } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { useT } from "../../../i18n/LanguageContext";

function Home() {
  const [exams, setExams] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [examStatus, setExamStatus] = React.useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const { t } = useT();

  const loadExamStatus = async (uid) => {
    try {
      const response = await getExamStatusForUser({ userId: uid });
      if (response.success) setExamStatus(response.data || {});
    } catch (e) {
      // non-fatal
    }
  };

  const getExams = async (currentPage = 1) => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams({
        page: currentPage,
        limit: 8, // Using 8 for grid layout (4x2 or 2x4)
      });
      if (response.success && response.data) {
        setExams(response.data.exams || []);
        setTotalCount(response.data.totalCount || 0);
      } else {
        message.error(response.message || "Something went wrong");
        setExams([]);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
      setExams([]);
    }
  };

  useEffect(() => {
    getExams(page);
  }, [page]);

  useEffect(() => {
    if (user && user._id) loadExamStatus(user._id);
  }, [user]);

  return (
    user && (
      <div className="dashboard-root">
        <PageTitle title={`Hi ${user.name}, Welcome to ENEGO Schemes Quiz`} />
        <div className="divider" />

        <Row gutter={[30, 30]}>
          {(exams && exams.length > 0 ? [...exams].sort((a, b) => {
            const stageA = a.stage || 1;
            const stageB = b.stage || 1;
            if (stageA !== stageB) return stageA - stageB;
            
            const getLevel = (name) => {
              const match = name.match(/Level\s*(\d+)/i);
              return match ? parseInt(match[1]) : name;
            };
            
            const levelA = getLevel(a.name);
            const levelB = getLevel(b.name);
            
            if (typeof levelA === 'number' && typeof levelB === 'number') {
              return levelA - levelB;
            }
            return a.name.localeCompare(b.name);
          }) : []).map((exam) => {
            const status = examStatus[exam._id];
            const isLocked = status ? !!status.locked : true;
            const isPassed = status ? !!status.passed : false;
            return (
              <Col xs={24} sm={12} md={12} lg={8} key={exam._id}>
                <div className={`exam-card ${isLocked ? "locked" : ""}`}
                     style={isLocked ? { opacity: 0.6 } : {}}>
                  <div className="exam-category-badge">
                    {exam.category}
                    {exam.stage ? ` · Stage ${exam.stage}` : ""}
                  </div>
                  <h2 className="exam-title">
                    {isLocked && <i className="ri-lock-2-line" style={{ marginRight: 6 }}></i>}
                    {isPassed && <i className="ri-check-double-line" style={{ marginRight: 6, color: "#16a34a" }}></i>}
                    {exam.name}
                  </h2>

                  <div className="exam-info-grid">
                    <div className="info-item">
                      <span>{t("home.totalMarks")}</span>
                      <strong>{exam.totalMarks}</strong>
                    </div>
                    <div className="info-item">
                      <span>{t("home.passing")}</span>
                      <strong>{exam.passingMarks}</strong>
                    </div>
                    <div className="info-item">
                      <span>{t("home.duration")}</span>
                      <strong>{exam.duration} Min</strong>
                    </div>
                    <div className="info-item">
                      <span>{t("home.questions")}</span>
                      <strong>{exam.questions?.length || 0}</strong>
                    </div>
                  </div>

                  <button
                    className="exam-btn"
                    disabled={isLocked || (isPassed && !user.isAdmin)}
                    onClick={() => {
                      if (isLocked) {
                        message.warning(t("home.lockedMsg"));
                        return;
                      }
                      if (isPassed) return;
                      navigate(`/user/write-exam/${exam._id}`);
                    }}
                  >
                    <i className={isLocked ? "ri-lock-2-line" : isPassed ? "ri-check-double-line" : "ri-play-circle-line"}></i>
                    {isLocked ? t("home.locked") : isPassed ? t("home.completed") : t("home.start")}
                  </button>
                </div>
              </Col>
            );
          })}
        </Row>

        <div className="flex justify-center mt-3">
          <Pagination
            current={page}
            total={totalCount}
            pageSize={8}
            onChange={(p) => setPage(p)}
          />
        </div>
      </div>
    )
  );
}

export default Home;
