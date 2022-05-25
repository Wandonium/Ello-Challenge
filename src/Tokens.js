import React from 'react'

function Tokens(props) {

  const handleClick = () => {
      props.setToken(null);
      props.setReload(!props.reload);
  };

  const start = props.pageContent.substring(0, props.token.position[0]);
  const theToken = props.pageContent.substring(props.token.position[0], props.token.position[1]);
  const end = props.pageContent.substring(props.token.position[1], props.pageContent.length);

  return (
    <div className="my-container">
        <main role="main" className="inner cover">
            <h1 className="cover-heading">Token Clicked: {props.token.value}</h1>
            <p className="lead">
              Token's page content: 
              <span className="spanContent">
                {start}
                <i className="emphasis">{theToken}</i>
                {end}
              </span>
            </p>
            <p className="lead">
            <a href="#" className="btn btn-lg btn-secondary" onClick={handleClick}>Back to Book</a>
            </p>
        </main>
    </div>
  )
}

export default Tokens;