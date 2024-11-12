import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendList, setFriendList] = useState(initialFriends);
  const [friend, setFriend] = useState(0);

  function handleAddFriend(newFriend) {
    setFriendList((friendList) => [...friendList, newFriend]);
  }
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleSelectedFriend(fr) {
    setFriend((friend) => (friend?.id !== fr.id ? fr : null));
    setShowAddFriend(false);
  }
  function handleUpdate(bal) {
    setFriendList((friends) =>
      friends.map((fr) =>
        fr.id === friend?.id ? { ...fr, balance: fr.balance + bal } : fr
      )
    );
    setFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friendList}
          friend={friend}
          onClick={handleSelectedFriend}
        />
        {showAddFriend && <FormAddFriend onClick={handleAddFriend} />}
        <Button onClick={handleShowAddFriend} isOpen={showAddFriend}>
          {!showAddFriend ? "Add Friend" : "close"}
        </Button>
      </div>
      {friend !== null && (
        <FormSplitBill friend={friend} onClick={handleUpdate} key={friend.id} />
      )}
    </div>
  );
}

function FriendList({ onClick, friends, friend }) {
  return (
    <ul>
      {friends.map((fr) => (
        <Friend fr={fr} friend={friend} onClick={onClick} key={fr.id} />
      ))}
    </ul>
  );
}

function Friend({ fr, onClick, friend }) {
  const isSelected = fr.id === friend?.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={fr.image} alt={fr.name} />
      <h3>{fr.name}</h3>
      {fr.balance < 0 && (
        <p className="red">
          You owe {fr.name} ${Math.abs(fr.balance)}
        </p>
      )}
      {fr.balance === 0 && <p>You and {fr.name} are even</p>}
      {fr.balance > 0 && (
        <p className="green">
          {fr.name} owes you ${fr.balance}
        </p>
      )}
      <Button
        onClick={() => {
          onClick(fr);
        }}
      >
        {isSelected ? "close" : "select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onClick }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleSubmit(e) {
    if (!name || !image) return;
    e.preventDefault();
    const id = crypto.randomUUID;
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onClick(newFriend);
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>😜Friend name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
      />
      <label>🥸Image Url</label>
      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        type="text"
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, onClick }) {
  const [bill, setBill] = useState("");
  const [yourBill, setYourBill] = useState("");
  const [option, setOption] = useState("user");
  if (!friend || friend.length === 0) return;

  const { name } = friend;
  const friendBill = bill ? bill - yourBill : "";
  function handleUpdate(e) {
    if (!bill || !yourBill) return;
    e.preventDefault();
    const balance = option !== "user" ? -yourBill : friendBill;
    onClick(balance);
  }

  return (
    <form className="form-split-bill" onSubmit={handleUpdate}>
      <h2>SPLIT A BILL WITH {name}</h2>
      <label>💰 Bill value</label>
      <input
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
        type="text"
      />
      <label>😊 Your expense</label>
      <input
        value={yourBill}
        onChange={(e) =>
          setYourBill((yourBill) =>
            Number(e.target.value) > bill ? yourBill : Number(e.target.value)
          )
        }
        type="text"
      />
      <label>😁 {name}'s expense</label>
      <input value={friendBill} type="text" disabled />
      <label>🤑 Who is paying the bill ?</label>
      <select value={option} onChange={(e) => setOption(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
