import './App.css';
import { useQuery, gql } from '@apollo/client';
import { PageFlip } from 'page-flip';
import { useEffect, useState } from 'react';
import backgroundImage from './images/background.jpg';
import Tokens from './Tokens';

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
  // console.log('data: ', JSON.stringify(data, null, 2));

  const [token, setToken] = useState(null);


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

      document.querySelectorAll(".link").forEach(item => {
        item.addEventListener("click", (event) => {
          event.preventDefault();
          let theId = event.target.id;
          let start = theId.indexOf('-');
          let tmp = theId.substring(start+1, theId.length);
          let end = tmp.indexOf('-');
          let pageIndex = parseInt(tmp.substring(0, end));
          console.log('pageIndex: ', pageIndex);
          tmp = tmp.substring(end + 1, tmp.length);
          start = tmp.indexOf('-');
          let tokenIndex = parseInt(tmp.substring(start + 1, tmp.length));
          console.log('tokenIndex: ', tokenIndex);
          let token = data.book.pages[pageIndex].tokens[tokenIndex].value;
          console.log('token: ', token);
          setToken(token);
        });
      });
  
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
      {token && <Tokens token={token} />}
      { data && !token && (
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
                let mContent = '';
                let cnt = page.content;
                if(page.tokens.length !== 0) {
                  for(let i = 0; i < page.tokens.length; i++) {
                    let tk = page.tokens[i];
                    let start = tk.position[0];
                    let end = 0;
                    if(i < page.tokens.length -1) {
                      end = page.tokens[i+1].position[0];
                    } else {
                      end = page.content.length;
                    }
                    if(page.pageIndex === 10 && i >= 42) {
                      let tmp = cnt.substring(start, end);
                      let element = `<a href="#" class="link" id="pageIndex-${page.pageIndex}-tokenIndex-${i}">${tmp}</a>`;
                      mContent = mContent + element;
                    } else {
                      let tmp = cnt.substring(start, end);
                      let word = cnt.substring(tk.position[0], tk.position[1]);
                      let element = `<a href="#" class="link" id="pageIndex-${page.pageIndex}-tokenIndex-${i}">${word}</a>`
                      {/* let element = `<a href="#" class="link" onClick={() => handleClick(tk)}>${word}</a>` */}
                      let val = word.indexOf("’") === -1 ? tk.value : word;
                      let re = new RegExp(val, 'i');
                      {/* if(page.pageIndex === 10) {
                        console.log('tmp: ', tmp);
                        console.log('word: ', word);
                        console.log('current token: ', i);
                        console.log('element: ', element);
                        console.log('re: ', re);
                        console.log('regex test: ', re.test(tmp));
                      } */}
                      mContent = mContent + tmp.replace(re, element);
                      {/* console.log('mContent: ', mContent); */}
                    }
                  }
                }
                return (
                  <div className="page" key={page.pageIndex}>
                    <div className="page-content">
                      <div className="page-header">{'Page ' + (page.pageIndex + 1)}</div>
                      <div className="page-text" dangerouslySetInnerHTML = {{ __html: mContent}} />
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
