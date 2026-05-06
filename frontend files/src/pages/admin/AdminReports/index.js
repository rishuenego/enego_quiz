import React from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReports, getReportById } from "../../../apicalls/reports";
import { useEffect } from "react";
import moment from "moment";
import UserAnswerReview from "./UserAnswerReview";

function csvEscape(v) {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function AdminReports() {
  const [reportsData, setReportsData] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const dispatch = useDispatch();
  const [filters, setFilters] = React.useState({
    examName: "",
    userName: "",
    startDate: "",
    endDate: "",
  });
  const [showReviewModal, setShowReviewModal] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState(null);

  const buildFiltersForApi = (f) => {
    const out = { examName: f.examName, userName: f.userName };
    if (f.startDate) out.startDate = new Date(f.startDate).toISOString();
    if (f.endDate) {
      const d = new Date(f.endDate);
      d.setHours(23, 59, 59, 999);
      out.endDate = d.toISOString();
    }
    return out;
  };

  const handleExport = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReports({
        ...buildFiltersForApi(filters),
        page: 1,
        limit: 10000,
      });
      dispatch(HideLoading());
      if (!response.success) {
        message.error(response.message || "Export failed");
        return;
      }
      const rows = [
        [
          "Date",
          "User Name",
          "User Email",
          "Exam",
          "Stage",
          "Total Marks",
          "Passing Marks",
          "Obtained Marks",
          "Verdict",
          "Total Time (sec)",
          "Time Taken (formatted)",
          "Tab Violations",
          "Camera Granted",
          "Question Timings (sec)",
        ],
      ];
      (response.data.reports || []).forEach((r) => {
        let timingsStr = "";
        if (r.questionTimings) {
          timingsStr = Object.keys(r.questionTimings)
            .map((idx) => {
              const sec = Math.round(r.questionTimings[idx] / 1000);
              return `Q${parseInt(idx) + 1}:${sec}s`;
            })
            .join("; ");
        }

        const totalSec = r.totalTime || 0;
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;

        rows.push([
          moment(r.createdAt).format("YYYY-MM-DD HH:mm:ss"),
          r.user?.name,
          r.user?.email,
          r.exam?.name,
          r.exam?.stage,
          r.exam?.totalMarks,
          r.exam?.passingMarks,
          r.result?.correctAnswers?.length,
          r.result?.verdict,
          totalSec,
          `${mins}m ${secs}s`,
          r.tabViolations || 0,
          r.cameraGranted ? "Yes" : "No",
          timingsStr,
        ]);
      });

      const csvContent = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reports-${moment().format("YYYYMMDD-HHmmss")}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      dispatch(HideLoading());
      message.error(e.message);
    }
  };
  const columns = [
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (text, record) => <>{record.exam.name}</>,
    },
    {
      title: "User Name",
      dataIndex: "userName",
      render: (text, record) => <>{record.user.name}</>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
      ),
    },
    {
      title: "Total Marks",
      dataIndex: "totalQuestions",
      render: (text, record) => <>{record.exam.totalMarks}</>,
    },
    {
      title: "Passing Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.exam.passingMarks}</>,
    },
    {
      title: "Obtained Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.result.correctAnswers.length}</>,
    },
    {
      title: "Time Taken",
      dataIndex: "totalTime",
      render: (text, record) => {
        const seconds = record.totalTime || 0;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return <>{mins}m {secs}s</>;
      },
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      render: (text, record) => <>{record.result.verdict}</>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <button
          className="action-view-btn"
          onClick={() => handleViewDetails(record)}
        >
          <i className="ri-eye-line"></i>
          <span>View Details</span>
        </button>
      ),
    },
  ];

  const getData = async (tempFilters, currentPage = 1) => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReports({
        ...buildFiltersForApi(tempFilters),
        page: currentPage,
        limit: 10,
      });
      if (response.success && response.data) {
        setReportsData(response.data.reports || []);
        setTotalCount(response.data.totalCount || 0);
      } else {
        message.error(response.message || "Something went wrong");
        setReportsData([]);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
      setReportsData([]);
    }
  };

  const handleViewDetails = async (record) => {
    try {
      dispatch(ShowLoading());
      const response = await getReportById({ reportId: record._id });
      dispatch(HideLoading());
      if (response.success) {
        setSelectedReport(response.data);
        setShowReviewModal(true);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData(filters, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div>
      <PageTitle title="Reports" />
      <div className="divider"></div>
      <form
        className="flex gap-2 items-center"
        style={{ flexWrap: "wrap" }}
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          getData(filters, 1);
        }}
      >
        <input
          type="text"
          placeholder="Exam"
          value={filters.examName}
          onChange={(e) => setFilters({ ...filters, examName: e.target.value })}
          className="pill-shape"
        />
        <input
          type="text"
          placeholder="User"
          value={filters.userName}
          onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
          className="pill-shape"
        />
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          className="pill-shape"
          title="From date"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          className="pill-shape"
          title="To date"
        />
        <button
          type="button"
          className="clear-btn-classy pill-shape"
          onClick={() => {
            const cleared = {
              examName: "",
              userName: "",
              startDate: "",
              endDate: "",
            };
            setFilters(cleared);
            setPage(1);
            getData(cleared, 1);
          }}
        >
          <i className="ri-restart-line"></i>
          <span>Clear All</span>
        </button>
        <button
          type="submit"
          className="primary-contained-btn search-btn-pro pill-shape"
        >
          <i className="ri-search-line"></i>
          <span>Search</span>
        </button>
        <button
          type="button"
          className="primary-outlined-btn pill-shape"
          onClick={handleExport}
        >
          <i className="ri-download-2-line"></i>
          <span>Export CSV</span>
        </button>
      </form>
      <Table
        columns={columns}
        dataSource={reportsData}
        className="mt-2"
        pagination={{
          current: page,
          total: totalCount,
          pageSize: 10,
          onChange: (p) => setPage(p),
        }}
      />

      <UserAnswerReview
        visible={showReviewModal}
        setVisible={setShowReviewModal}
        reportData={selectedReport}
      />
    </div>
  );
}

export default AdminReports;
