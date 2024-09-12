import { userStore } from "../stores/user";

function QueuePage() {
  const user = userStore();

  const handleQueue = () => {
    user.queue("nameeee");
    const q = 10;
    console.log(q);

    if (!user.nickname) return;
  };


  const handleUnqueue = () => {
    user.unqueue();
  };

  return (
    <div>
      <strong>username :</strong>
      {user.nickname || <b style={{ color: "red" }}>Choose nickname</b>}
      <br />
      <input
        type="text"
        placeholder="eEEEeeeee"
        value={user.nickname || ""}
        onChange={(e) => user.setNickName(e.target.value)}
      />
      <br />
      <br />
      <button onClick={() => (user.queueing ? handleUnqueue() : handleQueue())}>
        {user.queueing ? "Leave Queue" : "Queue"}
      </button>
    </div>
  );
}

export default QueuePage;
