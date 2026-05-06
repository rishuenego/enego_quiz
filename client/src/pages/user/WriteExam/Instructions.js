import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "../../../i18n/LanguageContext";

function Instructions({ examData, setView, startTimer, requestMedia }) {
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);
  const { t } = useT();

  const onStart = async () => {
    if (starting) return;
    setStarting(true);
    const ok = await requestMedia();
    if (!ok) {
      setStarting(false);
      return;
    }
    startTimer();
    setView("questions");
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <ul className="flex flex-col gap-1">
        <h1 className="text-2xl underline">{t("exam.instructionsTitle")}</h1>
        <li>{t("exam.instr.duration", { seconds: examData.duration })}</li>
        <li>{t("exam.instr.camera")}</li>
        <li>{t("exam.instr.mustAnswer")}</li>
        <li>{t("exam.instr.noBack")}</li>
        <li>{t("exam.instr.noAutoSubmit")}</li>
        <li>{t("exam.instr.noTabSwitch")}</li>
        <li>{t("exam.instr.totalMarks", { n: examData.totalMarks })}</li>
        <li>{t("exam.instr.passingMarks", { n: examData.passingMarks })}</li>
      </ul>

      <div className="flex gap-2">
        <button className="primary-outlined-btn" onClick={() => navigate("/")}>
          {t("exam.close")}
        </button>
        <button
          className="primary-contained-btn"
          onClick={onStart}
          disabled={starting}
        >
          {starting ? t("exam.starting") : t("exam.start")}
        </button>
      </div>
    </div>
  );
}

export default Instructions;
