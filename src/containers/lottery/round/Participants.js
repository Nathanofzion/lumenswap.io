import CTable from 'components/CTable';
import { getRoundParticipants } from 'api/lottery';
import { useEffect, useState } from 'react';
import jsxThemeColors from 'helpers/jsxThemeColors';
import tableHeaders from './participantsTableHeaders';
import styles from '../style.module.scss';

const Participants = ({ searchQuery, round }) => {
  const [searchedParticipants, setSearchedParticipants] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setSearchedParticipants(null);
        const query = { limit: 10 };
        if (searchQuery !== null && searchQuery !== '') {
          query.address = searchQuery.toUpperCase();
        }

        const fetchedParticipants = await getRoundParticipants(
          round.number, query,
        );
        setSearchedParticipants(fetchedParticipants.data.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, [searchQuery]);

  return (
    <div style={{ background: jsxThemeColors.white, marginLeft: -24, marginTop: 15 }}>
      <CTable
        className={styles.table}
        columns={tableHeaders}
        dataSource={searchedParticipants}
        noDataMessage="There is no address"
        loading={searchedParticipants === null}
      />
    </div>
  );
};

export default Participants;
