import "./index.css";

function NoConnectionView({ retryAgain }) {
  return (
    <div className="no_connection">
      <img
        alt="no connection"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGOe01nLJVRxgi7chO1vvn-RXj5UuC7INF5Z8lSmmsmeC0SETHxePFlEbz9TTojwmsE7U&usqp=CAU"
      />
      <h2>Oops No Connection!</h2>
      <p>Check your connection, try again</p>
      <button onClick={() => retryAgain()} type="button">
        Retry
      </button>
    </div>
  );
}

export default NoConnectionView;
