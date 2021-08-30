import Logo from 'assets/images/logo';
import Link from 'next/link';
import urlMaker from 'helpers/urlMaker';
import classNames from 'classnames';
import CustomDropdown from 'components/Dropdown';
import Button from 'components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { openConnectModal } from 'actions/modal';
import NavLink from 'components/NavLink';
import styles from './styles.module.scss';

const RewardHeader = () => {
  const isLogged = useSelector((state) => state.user.logged);
  const dispatch = useDispatch();

  return (
    <div className={classNames(styles.layout, 'layout')}>
      <ul className={styles.list}>
        <div>
          <li><Link href={urlMaker.root()}><a><Logo /></a></Link></li>
          <li><NavLink name="Dashboard" href={urlMaker.reward.root()} /></li>
        </div>
      </ul>
      {isLogged ? <CustomDropdown height="40px" width="160px" />
        : (
          <Button
            variant="secondary"
            content="Connect Wallet"
            fontWeight={500}
            className={styles.btn}
            onClick={() => {
              dispatch(openConnectModal());
            }}
          />
        ) }
    </div>
  );
};

export default RewardHeader;
