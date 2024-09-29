import express from "express";
import axios from "axios";
import bodyParser from "body-parser";




const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// for weather images
app.use(express.static("public/styles/images"));
app.use(express.json());



// MeteoSource API
const weather_API_URL = "https://www.meteosource.com/api/v1/free/";
const place_endpoint = "point?place_id=Baku";
const forecast_frequency_query = "&sections=daily";
const current_query = "&sections=current";
const time_language_unit_query = "&timezone=UTC&language=en&units=metric";
const ws_api_key = "&key=ul5u9hz6jys34slcnanmzttxdyugjyatu2r3espp";



// News API
const news_api_token = "82c250ae6d9643d985a3a94eec42800e";
const news_api_URL = "https://newsapi.org/v2/";
const new_api_topheadline = "top-headlines";
const country_us = "?country=us";
const category = "/sources?category=";
const country = "/sources?country=";
const language = "/sources?language=";
const news_config = {
    "headers": {
        "Authorization": ` Bearer  ${news_api_token}`,
    }
}




app.get("/", async (req, res) => {
    try {
        let today = new Date();
        let t_hour = today.getHours();
        let t_minute = today.getMinutes();
        let t_day = today.getDate();
        let t_month = today.getMonth() + 1;
        let t_year = today.getFullYear();


        if (t_day < 10) {
            t_day = `0${t_day}`;
        } else {
            t_day;
        }

        if (t_month < 10) {
            t_month = `0${t_month}`;
        } else {
            t_month;
        }

        let new_Day = `${t_day} /  ${t_month} / ${t_year} `;
        let new_time = `${t_hour} : ${t_minute}`;

        res.render("index.ejs", {
            content: new_Day,
        });
    } catch (error) {
        // res.render("index.ejs", { content: JSON.stringify(error.response.data) });
        console.log(error);

    }


});

app.post("/weather", async (req, res) => {

    try {

        const response = await axios.get(weather_API_URL + place_endpoint + forecast_frequency_query + time_language_unit_query + ws_api_key);
        const result = response.data.daily.data;
        const weather_summary = response.data.daily.data[0]['summary'];

        res.render("weather.ejs", {
            content: result,
            weather_detail: weather_summary,
        });

        // console.log(typeof (result));



    } catch (error) {
        console.log(error);
    }



});

app.post("/search-location", async (req, res) => {
    const req_city = req.body.search_city;

    try {
        const response = await axios.get(weather_API_URL + "point?place_id=" + req_city + current_query + time_language_unit_query + ws_api_key);
        const result = JSON.stringify(response.data.current);
        const icon_number = response.data.current["icon_num"];
        const temperature = response.data.current["temperature"];
        const weather_summary = response.data.current["summary"];
        const wind_speed = response.data.current["wind"]["speed"];
        const wind_direction = response.data.current["wind"]["dir"];
        res.render("search_location.ejs", {
            content: result,
            current_icon: icon_number,
            current_temperature: temperature,
            current_weather: weather_summary,
            current_wind_speed: wind_speed,
            current_wind_direction: wind_direction,
        });

        // console.log(JSON.stringify(response.data.current));

    } catch (error) {
        // res.render("index.ejs", { content: JSON.stringify(error.response.data) });
        console.log(error);
    }
});


// Get News
app.post("/news", async (req, res) => {

    try {
        const response = await axios.get(news_api_URL + new_api_topheadline + country_us, news_config);
        const result = response.data.articles;
        const result_count = response.data.totalResults;
        // const news_url = JSON.stringify(response.data["articles"][0]["url"]).substring(1);
        // const news_time = JSON.stringify(response.data["articles"][0]["publishedAt"]);

        res.render("news.ejs", {
            content: result,
            allNews: result_count,
        });

    } catch (error) {
        console.log(error);
    }


});


app.post("/news-by-category", async (req, res) => {
    const searchCategory = req.body.news_category;

    try {
        const response = await axios.get(news_api_URL + new_api_topheadline + category + searchCategory, news_config);
        const result = response.data.sources;
        // const result_sources = JSON.stringify(response.data);

        res.render("news_by_category.ejs", {
            content: result,
        });


        // console.log(result);
        // console.log(Array.isArray(result));
    } catch (error) {
        console.log(error);
    }


});

app.post("/news-by-country", async (req, res) => {
    const req_country = req.body.news_country;
    try {

        const response = await axios.get(news_api_URL + new_api_topheadline + country + req_country, news_config);
        const result = response.data.sources;
        res.render("news_by_category.ejs", {
            content: result,
        });


    } catch (error) {
        console.log(error);
    }



});

app.post("/news-by-language", async (req, res) => {
    const req_language = req.body.news_language;

    try {

        const response = await axios.get(news_api_URL + new_api_topheadline + language + req_language, news_config);
        const result = response.data.sources;
        res.render("news_by_category.ejs", {
            content: result,
        });

    } catch (error) {
        console.log(error);
    }

});

app.post("/news-by-query", async (req, res) => {
    let query = req.body.query;
    let today = new Date();
    let t_day = today.getDate();
    let t_month = today.getMonth() + 1;
    let t_year = today.getFullYear();
    try {
        const response = await axios.get("https://newsapi.org/v2/everything?q=" + query +
            `&from=${t_year}-${t_month}-${t_day - 7}&to=${t_year}-${t_month}-${t_day}&sortBy=popularity`, news_config);
        const result = response.data.articles;

        res.render("news_by_query.ejs", {

            content: result,
        });



    } catch (error) {
        console.log(error);
    }
});


app.get("/about", (req, res) => {
    try {
        res.render("about.ejs", {

        });

    } catch (error) {
        console.log(error);

    }


});

app.get("/contact", (req, res) => {
    try {
        res.render("contact.ejs", {

        });
    } catch (error) {
        console.log(error);
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
})