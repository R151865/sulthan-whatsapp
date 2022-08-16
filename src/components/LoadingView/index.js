import "./index.css";

import { ThreeDots } from "react-loader-spinner";

function LoadingView() {
  return (
    <div className="loading_view">
      <ThreeDots color="#00BFFF" height={50} width={50} />
    </div>
  );
}

export default LoadingView;
