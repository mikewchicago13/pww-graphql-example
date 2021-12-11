// assuming you've run the below to enable web requests
// in both browser and test environment
// npm install --save cross-fetch
import fetch from "cross-fetch";

export async function wovenForEncamp() {
  const res = await fetch(
    "https://httpbin.org/post?foo=bar",
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