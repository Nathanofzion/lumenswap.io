import CTable from 'components/CTable';
import Head from 'next/head';
import CPagination from 'components/CPagination';
import { useEffect, useState, useRef } from 'react';
import Input from 'components/Input';
import classNames from 'classnames';
import { getRoundParticipants } from 'api/lottery';
import Link from 'next/link';
import Image from 'next/image';
import ArrowIcon from 'assets/images/arrow-right-icon.png';
import urlMaker from 'helpers/urlMaker';
import tableHeaders from '../details/participantsTableHeaders';
import LotteryHeader from '../LotteryHeader';
import styles from '../style.module.scss';

const NoDataMessage = () => (
  <div className={styles.noDataMessageContainer}>
    <div className={styles.noDataMessage}>There is no address</div>
  </div>
);

const AllParticipantPage = ({ round }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(10);
  const [searchedParticipants, setSearchedParticipants] = useState(null);
  const timeOutRef = useRef(null);
  const loading = searchedParticipants === null;

  useEffect(() => {
    async function fetchInitialData() {
      setSearchedParticipants(null);
      const query = {
        page, limit: 20, round: round.number,
      };

      if (searchQuery) query.address = searchQuery.toUpperCase();

      const fetchedParticipants = await getRoundParticipants(
        round.number, query,
      );

      setPages(fetchedParticipants.data.totalPages);
      setPage(fetchedParticipants.data.currentPage);
      setSearchedParticipants(fetchedParticipants.data.data);
    }

    fetchInitialData();
  }, [searchQuery, page]);

  async function handleSearch(e) {
    clearTimeout(timeOutRef.current);
    timeOutRef.current = setTimeout(async () => {
      setPage(1);
      setSearchQuery(e.target.value);
    }, 700);
  }

  return (
    <>
      <div className="container-fluid">
        <Head>
          <title>Round {round.number} Participants | Lumenswap</title>
          <link
            rel="canonical"
            herf={`${process.env.REACT_APP_HOST}${urlMaker.lottery.allParticipants(round.number)}`}
          />
        </Head>
        <LotteryHeader />
      </div>
      <div className={styles.main}>
        <div style={{ marginBottom: 24 }} className={classNames(styles.title, 'd-flex justify-content-between')}>
          <h1 className={classNames(styles.board, 'd-flex align-items-center')}>
            <Link href={urlMaker.lottery.root()} passHref>
              <a style={{ color: 'black', textDecoration: 'none' }}>
                Board
              </a>
            </Link>
            <span style={{ marginLeft: 12, marginTop: 3 }}>
              <Image src={ArrowIcon} width={18} height={18} />
            </span>
            <Link href={urlMaker.lottery.singleRound(round.number)} passHref>
              <a style={{ color: 'black', textDecoration: 'none', marginLeft: 12 }}>
                Round #{round.number}
              </a>
            </Link>
            <span style={{ marginLeft: 12, marginTop: 3 }}>
              <Image src={ArrowIcon} width={18} height={18} />
            </span>
            <span style={{ marginLeft: 12 }}>Participants</span>
          </h1>
        </div>
        <div className={styles.tableContainer}>
          <div className={classNames(styles.inputContainer, 'd-flex justify-content-between align-items-center')}>
            <div className={styles.input}>
              <Input
                type="text"
                placeholder="Enter your address"
                onChange={handleSearch}
                height={40}
                fontSize={15}
                className={styles.input}
              />
            </div>
            <div className={styles['table-title']}>Participants</div>
          </div>
          <CTable
            className={styles.table}
            columns={tableHeaders}
            dataSource={searchedParticipants}
            noDataMessage={NoDataMessage}
            loading={loading}
          />
        </div>

        {!loading && searchedParticipants?.length > 0
        && (
        <div style={{ marginTop: 24, marginBottom: 60 }} className="d-flex">
          <CPagination
            pages={pages}
            currentPage={page}
            onPageClick={(newPage) => {
              setPage(newPage);
            }}
          />
        </div>
        )}
      </div>
    </>
  );
};

export default AllParticipantPage;
