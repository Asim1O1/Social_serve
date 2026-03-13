import { io } from "socket.io-client";

// const URL = "http://localhost:6190/api";

export const socket = io("http://localhost:6190", {
  withCredentials: true,
});
