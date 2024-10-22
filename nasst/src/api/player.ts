import { Category, EditPlayerInput, Player, PlayerInput, Result } from "../models/model";
import request from "../utils/request";

export async function addPlayer(input: PlayerInput) {
  const response = await request.post<Result<Player>>("player/AddPlayer", input);
  return response.data;
}
export async function getPlayers() {
  const response = await request.get<Result<Player[]>>("player/GetPlayers");
  return response.data;
}
export async function getPlayer(id: number) {
  const response = await request.get<Result<Player>>(`player/GetPlayer/${id}`);
  return response.data;
}
export async function editPlayer(input: EditPlayerInput) {
  const response = await request.post<Result<boolean>>("player/UpdatePlayer", input);
  return response.data;
}
export async function DeletePlayer(id: number) {
  const response = await request.post<Result<boolean>>("player/DeletePlayer", id, {
    headers: {
        'Content-Type': 'application/json' 
    }
});
return response.data;
}