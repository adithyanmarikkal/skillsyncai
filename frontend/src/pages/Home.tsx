import ResumeUpload from "../components/ResumeUpload";
import JobMatcher from "../components/JobMatcher"
import GapAnalysis from "../components/GapAnalysis";
import Roadmap from "../components/Roadmap";

const Home = () => {
  return (
    <div>
      <h1>SkillSync AI</h1>
      <ResumeUpload />
      <JobMatcher />
      <GapAnalysis />
      <Roadmap />
    </div>
  );
};

export default Home;