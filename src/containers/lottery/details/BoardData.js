import CTabs from 'components/CTabs';
import Input from 'components/Input';
import { useCallback, useRef, useState } from 'react';
import styles from './style.module.scss';
import BoardTabContent from './BoardTabContent';

function BoardData({ round }) {
  const [searchQuery, setSearchQuery] = useState('');
  const timeoutRef = useRef(null);

  const handleSearch = (e) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSearchQuery(e.target.value.replace(new RegExp('\\\\', 'g'), '\\\\'));
    }, 700);
  };

  let inputPlaceHolder = 'Enter your ticket Id';

  const handleTabChange = (tab) => {
    if (tab === 'tickets') {
      inputPlaceHolder = 'Enter your ticket Id';
    } else {
      inputPlaceHolder = 'Enter your address';
    }
  };

  const SearchInput = useCallback(() => (
    <div className={styles.input}>
      <Input
        type="text"
        name="address"
        id="address"
        placeholder={inputPlaceHolder}
        onChange={handleSearch}
        height={40}
        fontSize={14}
        className={styles.input}
      />
    </div>
  ), []);

  const tabs = [
    { title: 'Tickets', id: 'tickets' },
    { title: 'Participants', id: 'participants' },
  ];

  return (
    <>
      <div className={styles['table-container']}>
        <div className={styles.header}>
          <div className={styles.ctab}>
            <CTabs
              tabs={tabs}
              tabContent={BoardTabContent}
              onChange={handleTabChange}
              customTabProps={{
                searchQuery, round,
              }}
              extraComponent={SearchInput}
              className={`${styles.tabs}`}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default BoardData;
