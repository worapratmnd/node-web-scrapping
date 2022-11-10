import { default as FormData } from "form-data";
import axios from "axios";

export async function notify(token: string, message: string) {
  const form = new FormData();
  form.append("message", message);
  axios({
    url: "https://notify-api.line.me/api/notify",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
    data: form,
  })
    .then((response) => {})
    .catch((err) => console.error(err));
}
