import React, { useState, useEffect } from "react";
import Gifspinner from "./Gifspinner";
import Newsitems from "./Newsitem";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const Newsm = (props) => {
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const [articles, setarticles] = useState([]);
  const [loading, setloading] = useState("false");
  const [page, setpage] = useState(1);
  const [totalResults, settotalResults] = useState(0);

  const updateNews = async () => {
    props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page}&pageSize=${props.pageSize}`;
    setloading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parseDate = await data.json();
    props.setProgress(70);
    console.log(parseDate.articles);
    setarticles(parseDate.articles);
    settotalResults(parseDate.totalResults);
    setloading(false);
    props.setProgress(100);
  };

  useEffect(() => {
    document.title = `NewsApp -  ${capitalizeFirstLetter(props.category)}`;
    updateNews();
    // eslint-disable-next-line
  }, []);

  const fetchMoreData = async () => {
    let url = `https://newsapi.org/v2/top-headlines?country=${
      props.country
    }&category=${props.category}&apiKey=${props.apikey}&page=${
      page + 1
    }&pageSize=${props.pageSize}`;
    setpage(page + 1);
    let data = await fetch(url);
    let parseDate = await data.json();
    setarticles(articles.concat(parseDate.articles));
    settotalResults(parseDate.totalResults);
  };

  return (
    <>
      <div>
        <h3 className="text-center" style={{ marginTop: "70px" }}>
          NewsAPP - Top {capitalizeFirstLetter(props.category)}
          News Headline
        </h3>
        <hr></hr>
        {loading && <Gifspinner />}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Gifspinner />}
        >
          <div className="container my-4 ">
            <div className="row my-3">
              {articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <Newsitems
                      title={
                        element.title ? element.title : "Title Not Available"
                      }
                      descr={
                        element.description
                          ? element.description
                          : "Descriptions Are Not  Available"
                      }
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                      source={element.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
};

Newsm.defaultProps = {
  country: "in",
  pageSize: 3,
  category: "general",
};
Newsm.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default Newsm;
