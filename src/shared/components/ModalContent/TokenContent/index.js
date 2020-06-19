import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import defaultTokens from 'src/tokens/defaultTokens';
import hideModal from 'src/actions/modal/hide';
import styles from './styles.less';

const TokenContent = ({ setToken, excludeToken, includeToken }) => {
  const [searchString, setSearchString] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const handleChange = (e) => {
    setSearchString(e.target.value);
  };

  useEffect(() => {
    const results = [...includeToken, ...defaultTokens].filter(
      (token) => token.code.toLowerCase().includes(searchString.toLowerCase()),
    );
    setSearchResults(results);
  }, [searchString]);

  const item = (data) => (
    <div className="row justify-content-between mb-3 h-100 align-items-center">
      <div className={classNames(styles.crypto, 'col-auto')}>
        <img
          src={data.logo}
          alt="logo"
        />
        {data.code}
      </div>
      <div className={classNames('col-auto', styles.web)}>{data.web}</div>
    </div>
  );

  return (
    <div className="row">
      <div className="col-12">
        <input
          type="text"
          className={classNames(styles.input, 'form-control primary-input')}
          value={searchString}
          onChange={(e) => { handleChange(e); }}
          placeholder="Asset code"
        />
        <div
          className={classNames(styles.scroll, 'mt-3')}
          style={{ paddingRight: (searchResults.length > 5) && '4px' }}
        >
          {searchResults.map((token, index) => (
            <div
              key={index}
              className={classNames((index === 0) ? 'pt-2' : 'mt-3 pt-2')}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (token.code === excludeToken.code && token.issuer === excludeToken.issuer) {
                  setToken(token, true);
                } else {
                  setToken(token);
                }
                hideModal();
              }}
            >
              {item(token)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenContent;
