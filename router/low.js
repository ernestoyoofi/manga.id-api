const route = require("express").Router()
const komiku = require("../lib/komiku.id")

route.get("/low-size/recommend", async (req, res) => {
  try {
    const d = await komiku.Other_Recommend(req.query.page)

    return res.status(200).json({
      s: true,
      n: d.next_btn,
      p: d.page,
      l: d.list.map(z => ({
        t: z.title,
        sub: z.subtitle,
        ls: z.lasted_up,
        slg: z.slug,
        img: z.image.replace("https://thumbnail.komiku.id/wp-content/uploads", "")
      }))
    })
  } catch(err) {
    return res.status(500).json({
      msg: "Internal Server Error"
    })
  }
})

route.get("/low-size/search", async (req, res) => {
  if(typeof req.query.q != "string") {
    return res.status(200).json({
      s: false,
      msg: `Please provide a word to search for manga`
    })
  }
  try {
    const d = await komiku.Manga_Search(req.query.q, req.query.page)

    return res.status(200).json({
      s: true,
      n: d.next_btn,
      p: d.page,
      l: d.list.map(z => ({
        t: z.title,
        sub: z.subtitle,
        ls: z.lasted_up,
        slg: z.slug,
        img: z.image.replace("https://thumbnail.komiku.id/wp-content/uploads", "")
      }))
    })
  } catch(err) {
    return res.status(500).json({
      msg: "Internal Server Error"
    })
  }
})

module.exports = route