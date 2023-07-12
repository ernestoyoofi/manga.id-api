const { RequestApi } = require("./request")
const cheerio = require("cheerio")

const baseURL = {
  recommend: "https://komiku.id/other/rekomendasi/",
  search: "https://data.komiku.id/",
  detail: "https://komiku.id/manga/",
  read: "https://komiku.id/ch/"
}

async function Other_Recommend(length = 0) {
  const isNextNum = isNaN(length)? 0 : Number(length)
  const url = isNextNum > 0? `${baseURL.recommend}`:`${baseURL.recommend}/page/${isNextNum}/`
  const data = await RequestApi(url)
  const $ = cheerio.load(data.data)

  let list = []
  $("main div.daftar div.bge").each((i, el) => {
    list.push({
      title: $(".kan a h3", el).text()?.trim(),
      subtitle: $(".kan .judul2", el).text().trim(),
      lasted_up: $(".kan p").eq(0).text()?.trim().split("lalu. ")[0]?.split("Update ")[1]?.trim()?.toLowerCase() + " yang lalu",
      desc: $(".kan p").eq(0).text()?.trim()?.split("lalu. ")[1],
      slug: $(".bgei a", el).attr("href")?.replace("/manga/", "")?.replace(new RegExp("/", "g"), ""),
      img_q: {
        low: "?resize=165,57.5&quality=30",
        medium: "?resize=330,115&quality=60",
      },
      image: $(".bgei a img", el).attr("data-src").split("?")[0],
    })
  })

  return {
    page: isNextNum,
    next_btn: !!$("main .loop-nav-inner a.next").attr("href"),
    list,
  }
}

async function Manga_Search(query, length = 0) {
  const isNextNum = isNaN(length)? 0 : Number(length)
  const url = isNextNum > 0? `${baseURL.search}`:`${baseURL.search}/page/${isNextNum}/`
  const data = await RequestApi(url+`?post_type=manga&s=${query}`)
  const $ = cheerio.load(data.data)

  let list = []
  $("main div.daftar div.bge").each((i, el) => {
    list.push({
      title: $(".kan a h3", el).text()?.trim(),
      subtitle: $(".kan .judul2", el).text().trim(),
      lasted_up: $(".kan p").eq(0).text()?.trim().split("lalu. ")[0]?.split("Update ")[1]?.trim()?.toLowerCase() + " yang lalu",
      desc: $(".kan p").eq(0).text()?.trim()?.split("lalu. ")[1],
      slug: $(".bgei a", el).attr("href")?.replace("https://komiku.id","")?.replace("/manga/", "")?.replace(new RegExp("/", "g"), ""),
      img_q: {
        low: "?resize=165,57.5&quality=30",
        medium: "?resize=330,115&quality=60",
      },
      image: $(".bgei a img", el).attr("data-src").split("?")[0],
    })
  })

  return {
    page: isNextNum,
    next_btn: !!$("main .loop-nav-inner a.next").attr("href"),
    list,
  }
}

async function Manga_Detail(slug) {
  const data = await RequestApi(baseURL.detail+slug)
  if(data.status != 200) {
    return {
      isFoundReader: false
    }
  }
  const $ = cheerio.load(data.data)
  let list = []
  $("main #Chapter table tr").each((i, el) => {
    if(!$("a", el).attr("href")) return ;
    list.push($("td", el).eq(0).text().trim())
  })
  let listNt = []
  for(let i in [...Array(list.length)]) {
    const ctx = (list.length-1) - Number(i)
    listNt.push(list[ctx])
  }
  return {
    sinopsis: $("main #Sinopsis").text().trim().replace(/\t/g, ""),
    totalchapter: list.length,
    chapter: listNt,
  }
}

async function Manga_Read(slug, length) {

}

module.exports = {
  Other_Recommend,
  Manga_Search,
  Manga_Detail,
  Manga_Read
}