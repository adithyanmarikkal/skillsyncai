import ResumeUpload from "../components/ResumeUpload";
import JobMatcher from "../components/JobMatcher"
import GapAnalysis from "../components/GapAnalysis";

const Home = () => {
  return (
    <div>
      <h1>SkillSync AI</h1>
      <ResumeUpload />
      <JobMatcher />
    </div>
  );
};

export default Home;