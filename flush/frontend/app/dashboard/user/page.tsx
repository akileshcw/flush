import React from "react";

const page = async () => {
  const data = await fetch("http://localhost:8000/auth/get-users");
  const userData = await data.json();
  console.log("the received user data is", userData);
  return (
    <div>
      <h1>total users: {userData.token.length}</h1>
      <div className="flex flex-col p-10 gap-2">
        {userData.token.map((user: any) => (
          <div key={user.id} className="flex gap-4">
            <h2>{user.username}</h2>
            <p>{user.roles.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
