import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import urlMaker from 'helpers/urlMaker';
import Breadcrumb from 'components/BreadCrumb';
import Button from 'components/Button';
import SelectOption from 'components/SelectOption';
import { getProposals } from 'api/mockAPI/proposals';
import useIsLogged from 'hooks/useIsLogged';
import DAOProposalItems from './DAOProposalItems';
import DAOContainer from '../DAOContainer';
import styles from './styles.module.scss';
import GovernanceInfo from './GovernanceInfo';

const dropdownItems = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'not-started', label: 'Not Started' },
  { value: 'ended', label: 'Ended' },
];

const DAOProposalList = ({ governanceInfo }) => {
  const [select, setSelect] = useState(dropdownItems[0]);
  const [proposals, setProposals] = useState(null);
  const isLogged = useIsLogged();
  const router = useRouter();

  const crumbData = [
    { url: urlMaker.dao.root(), name: 'Board' },
    { name: governanceInfo.name },
  ];

  useEffect(() => {
    setProposals(null);
    getProposals(governanceInfo.officialName, { status: select.value }).then((proposalData) => {
      setProposals(proposalData);
    });
  }, [select]);

  return (
    <DAOContainer title="Proposals | Lumenswap" info={governanceInfo}>
      <div className={classNames('layout main', styles.layout)}>
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10 col-md-11 col-sm-12 col-12">
            <Breadcrumb
              spaceBetween={8}
              data={crumbData}
            />

            <div className="mt-4">
              <GovernanceInfo governance={governanceInfo} />
            </div>

            <div className={styles['container-proposals']}>
              <div className="row justify-content-between">
                <div className="col-auto">
                  <h2 className={styles.title}>Proposals</h2>
                </div>
                <div className="col-auto">
                  <div className="d-flex align-items-center">
                    <SelectOption
                      items={dropdownItems}
                      defaultValue={select}
                      setValue={setSelect}
                      className={styles.filter}
                      isSearchable={false}
                    />
                    {isLogged && (
                      <Button
                        variant="primary"
                        content="Create proposal"
                        className={styles.btn}
                        onClick={() => {
                          router.push(urlMaker.dao.singleDao.createProposal(router.query.name));
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <DAOProposalItems proposals={proposals} governanceInfo={governanceInfo} />
            </div>

          </div>
        </div>
      </div>
    </DAOContainer>
  );
};

export default DAOProposalList;
