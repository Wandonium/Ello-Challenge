import './App.css';
import { useQuery, gql } from '@apollo/client';
import { PageFlip } from 'page-flip';
import { useEffect } from 'react';
import backgroundImage from './images/background.jpg';

const FEED_QUERY = gql`
  {
    book{
      author
      pages {
        content
        pageIndex
        tokens {
          position
          value
        }
      }
      title
    }
  }
`

function App() {
  const { data, loading, error } = useQuery(FEED_QUERY);
  console.log('screen width: ', window.screen.width);
  console.log('data: ', JSON.stringify(data, null, 2));


  useEffect(() => {
    if(data) {
      const pageFlip = new PageFlip(
        document.getElementById('demoBookExample'),
        {
          width: 550, // base page width
          height: 733, // base page height
  
          size: "stretch",
          // set threshold values:
          minWidth: 315,
          maxWidth: 1000,
          minHeight: 420,
          maxHeight: 1350,
  
          maxShadowOpacity: 0.5, // Half shadow intensity
          showCover: true,
          mobileScrollSupport: false // disable content scrolling on mobile devices
        }
      );
      pageFlip.loadFromHTML(document.querySelectorAll(".page"));
      document.querySelector(".page-total").innerText = pageFlip.getPageCount();
      document.querySelector(
          ".page-orientation"
      ).innerText = pageFlip.getOrientation();
  
      document.querySelector(".btn-prev").addEventListener("click", () => {
          pageFlip.flipPrev(); // Turn to the previous page (with animation)
      });
  
      document.querySelector(".btn-next").addEventListener("click", () => {
          pageFlip.flipNext(); // Turn to the next page (with animation)
      });
  
      // triggered by page turning
      pageFlip.on("flip", (e) => {
          document.querySelector(".page-current").innerText = e.data + 1;
      });
  
      // triggered when the state of the book changes
      pageFlip.on("changeState", (e) => {
          document.querySelector(".page-state").innerText = e.data;
      });
  
      // triggered when page orientation changes
      pageFlip.on("changeOrientation", (e) => {
          document.querySelector(".page-orientation").innerText = e.data;
      });
    }
  }, [data]);



  return (
    <>
      {loading && <div className="loading">
        <div style={{fontSize: '210%'}}>Loading...</div>
        <div className="spinner-border" style={{width: '3rem', height: '3rem'}}></div>
      </div>}
      {error && <pre className="loading">{JSON.stringify(error, null, 2)}</pre>}
      { data && (
        <div style={{paddingTop: '100px'}}>
          <div className="container">
            <div className="flip-book html-book demo-book" id="demoBookExample" style={{backgroundImage: backgroundImage}}>
              <div className="page page-cover page-cover-top" data-density="hard">
                <div className="page-content">
                  <h2>{data.book.title}</h2>
                  <h5>{'by ' + data.book.author}</h5>
                </div>
              </div>
              {data.book.pages.map(page => {
                return (
                  <div className="page" key={page.pageIndex}>
                    <div className="page-content">
                      <div className="page-header">{'Page ' + (page.pageIndex + 1)}</div>
                      <div className="page-text">{page.content}</div>
                      <div className="page-footer">{'No of tokens: ' + page.tokens.length}</div>
                    </div>
                  </div>
                )
              })}
              <div className="page page-cover page-cover-bottom" data-density="hard">
                <div className="page-content">
                  <h2>THE END</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="container pt-3">
            <div className="row align-items-center">
              <div className="col-md-7">
                <div className="row mt-2">
                  <div className="col-md-6" style={{minWidth: '290px'}}>
                    <button type="button" className="btn btn-info btn-prev">Previous page</button>
                    [<span className="page-current">1</span> of <span className="page-total">-</span>]
                    <button type="button" className="btn btn-info btn-next">Next page</button>
                  </div>

                  <div className='col-md-6'>
                    State: <i className="page-state">read</i>, orientation: <i className="page-orientation">landscape</i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
