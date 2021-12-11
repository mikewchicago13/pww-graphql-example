// assuming you've run the below to enable web requests
// in both browser and test environment
// npm install cross-fetch
import fetch from "cross-fetch";

export async function wovenForEncamp(
  path = "https://httpbin.org/post"
) {
  const res = await fetch(
    path + "?queryParam1=queryVal1",
    {
      method: "post",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        key1: "val1",
        key2: "val2",
      })
    })
  return res.json()
}