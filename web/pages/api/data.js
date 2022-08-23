// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import apiData from "../../data/coursesApi.json"

export default function handler(req, res) {
  res.status(200).json(apiData)
}