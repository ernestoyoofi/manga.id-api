const { RequestApi } = require("./request")
const cheerio = require("cheerio")

const baseURL = {
  recommend: "https://komiku.id/other/rekomendasi/",
  search: "https://data.komiku.id/",
  detail: "https://komiku.id/manga/",
  read: "https://komiku.id/ch/"
}

async function Other_Recommend(length = 1) {
  const isNextNum = isNaN(length)? 1 : Number(length) === 0? 1 : Number(length)
  const url = isNextNum === 1? `${baseURL.recommend}`:`${baseURL.recommend}/page/${isNextNum}/`
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

async function Manga_Search(query, length = 1) {
  const isNextNum = isNaN(length)? 1 : Number(length) === 0? 1 : Number(length)
  const url = isNextNum === 1? `${baseURL.search}`:`${baseURL.search}/page/${isNextNum}/`
  const data = await RequestApi(url+`?${new URLSearchParams({
    post_type: "manga",
    s: query
  }).toString()}`)
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
  let listGenre = []
  $("main #Chapter table tr").each((i, el) => {
    if(!$("a", el).attr("href")) return ;
    list.push({
      ch: $("td", el).eq(0).text().trim(),
      series_date: $("td", el).eq(1).text().trim(),
      slug: $("a", el).attr("href").replace("/ch/", "").split("/")[0]
    })
  })
  $("main #Informasi .genre li").each((i, el) => {
    listGenre.push({
      text: $(el).text().trim(),
      slug: $("a", el).attr("href").replace("/genre/","").replace("/","")
    })
  })
  let listNt = []
  for(let i in [...Array(list.length)]) {
    const ctx = (list.length-1) - Number(i)
    listNt.push({
      key: Number(i),
      ...list[ctx]
    })
  }
  return {
    isFoundReader: true,
    cover: $("main #Informasi img").eq(0).attr("src"),
    title: $("main #Judul h1").text().trim(),
    subtitle: $("main #Judul p.j2").text().trim(),
    category: $("a", $("main #Informasi table tr").eq(1)).attr("href").split("/")[2],
    storyconcept: $("td", $("main #Informasi table tr").eq(2)).eq(1).text(),
    creator: $("td", $("main #Informasi table tr").eq(3)).eq(1).text(),
    status: $("td", $("main #Informasi table tr").eq(4)).eq(1).text(),
    synopsis: $("main #Judul p.desc").text().trim().replace(/\t/g, ""),
    genre: listGenre,
    totalchapter: list.length,
    chapter: listNt,
  }
}

async function Manga_Read(slug, length = 0) {
  const ifg = await Manga_Detail(slug)
  const iLg = isNaN(length)? 0 : Number(length)
  if(!ifg.isFoundReader) {
    return {
      isFoundReader: false,
      message: "Can't find this comic !"
    }
  }
  if(iLg > (ifg.totalchapter-1)) {
    return {
      isFoundReader: true,
      title: ifg.title,
      subtitle: ifg.subtitle,
      chapter: ifg.totalchapter,
      islast: true,
      list_image: []
    }
  }
  const data = await RequestApi(baseURL.read+`${ifg.chapter[iLg].slug}/`)
  const $ = cheerio.load(data.data)
  let list_image = []
  $("#Baca_Komik img").each((i, el) => {
    list_image.push($(el).attr("src"))
  })
  return {
    isFoundReader: true,
    title: ifg.title,
    subtitle: ifg.subtitle,
    chapter: iLg+1,
    islast: false,
    list_image: list_image
  }
}

module.exports = {
  Other_Recommend,
  Manga_Search,
  Manga_Detail,
  Manga_Read
}
