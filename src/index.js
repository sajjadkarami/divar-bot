require('dotenv').config()

const API_URL = "https://api.divar.ir/v8/postlist/w/search"
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiI3ODBhOGU0Ni0yMDBkLTQ4MDUtOGQ5Yy05YzUwN2EzMDMxYWUiLCJ1aWQiOiJhN2ZiNjRkZi1kMTY4LTRjYzAtYTZjYi1kYWMzNmU1Nzk3ZDYiLCJ1c2VyIjoiMDkxMTc5NzAwODIiLCJ2ZXJpZmllZF90aW1lIjoxNzQ2MzQ5NDY3LCJpc3MiOiJhdXRoIiwidXNlci10eXBlIjoicGVyc29uYWwiLCJ1c2VyLXR5cGUtZmEiOiLZvtmG2YQg2LTYrti124wiLCJleHAiOjE3NDg5NDE0NjcsImlhdCI6MTc0NjM0OTQ2N30.KdP_zBpbDDW8D0JINPfLRhpUnlv-aODAfbcQzs-oDps"
async function fetchData(cityId) {
    const request = await fetch(API_URL, {
        method: "POST",
        headers:
            { "Authorization": `Basic ${API_KEY}` },
        body: JSON.stringify({
            city_ids: [cityId]
        })

    })
    if (!request.ok) {
        throw new Error(`Http error! status ${request.status}`)
    }
    const response = await request.json()
    console.log(response)
}

fetchData("1")