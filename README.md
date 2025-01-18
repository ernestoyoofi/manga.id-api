# Manga API

> [!CAUTION]
> 
> This Repo Has Archive 📦

Rest API Manga Bahasa Indonesia from [komiku.id](//komiku.id)

this system is just scrapping data from the site and turning it into raw json data with axios, reqbin (fix skip cloudflare challenge), cheerio and express for server.

## Usage With Local

1 Clone this repository

  ```url
  git clone https://github.com/ernestoyoofi/manga-api
  ```

2 Install all dependecies
3 Running app
4 Open in your browser [http://localhost:12500/](http://localhost:12500/)

## API / Endpoint

Default:

- [https://mangaapikomiku.vercel.app/](https://mangaapikomiku.vercel.app/)

Map Path:

- Recommend
- Search Manga
- Details Manga & Synopsis (only text)
  - Get all
  - View / Reader

### Recommend

```url
/recommend?page=[?:page]
```

### Search Manga

```url
/search?q=[:query]&page=[?:page]
```

### Details Manga & Synopsis (only text)

```url
/manga/[:slug]
```

### Get All Info Chapter & View Manga

```url
/manga/[:slug]/read?chapter=[?:number]
```

## Test Application

> Nothing in here! <br/>
> Maybe you can add beta test like app or site using this Rest API

<center>

  Hosting Powered By [Vercel Server Function](https://vercel.com/?utm_source=github.com/ernestoyoofi/manga-api)

</center>
