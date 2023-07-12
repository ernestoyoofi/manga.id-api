const komikuid = require("./lib/komiku.id")

komikuid.Manga_Detail("the-cuckoos-fiancee")
.then(z => {
  console.log(z)
})