import '../styles/queue.css'
import { userStore } from "../stores/user";

function QueuePage() {
  const user = userStore();

  const handleQueue = () => {
    user.queue(String(~~(Math.random() * 55555)));
    if (!user.nickname) return;
  };

  const handleUnqueue = () => {
    user.unqueue();
  };

  return (
    <div className='queue-wrapper'>
      <strong className='nickname-label'>nickname :</strong>
      <h1 className='user-name'> {user.nickname || <b className='no-user-name'>Choose nickname</b>}</h1>
<br />
      <input
        type="text"
        placeholder="mounir"
        className='user-name-input'
        value={user.nickname || ""}
        onChange={(e) => user.setNickName(e.target.value)}
      />
      <button onClick={() => (user.queueing ? handleUnqueue() : handleQueue())} className='queued'>
        {user.queueing ? "Leave Queue" : "Queue"}
      </button>
    </div>
  );
}

export default QueuePage;
