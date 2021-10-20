import Logo from 'assets/images/logo';
import Link from 'next/link';
import urlMaker from 'helpers/urlMaker';
import Image from 'next/image';
import classNames from 'classnames';
import CustomDropdown from 'components/Dropdown';
import Button from 'components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { openConnectModal } from 'actions/modal';
import NavLink from 'components/NavLink';
import MobileMenu from 'components/MobileMenu';
import ArrowHeader from 'assets/images/arrow-header.svg';
import LSPBox from 'components/LSPBox';
import styles from './styles.module.scss';

const LotteryHeader = () => {
  const isLogged = useSelector((state) => state.user.logged);
  const dispatch = useDispatch();

  const logoLink = <Link href={urlMaker.root()}><a><Logo /></a></Link>;
  const BtnConnect = isLogged ? <CustomDropdown height="40px" width="160px" />
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
    );

  const menus = {
    left: [
      {
        name: 'Board', href: urlMaker.lottery.root(), public: true, exact: true,
      },
      {
        name: 'My Tickets', href: urlMaker.lottery.tickets(), public: false, exact: false,
      },
    ],
  };

  const mobileMenu = [...menus.left];

  return (
    <div className={classNames(styles.layout, 'layout')}>
      <div className="d-md-flex d-sm-none d-none w-100">
        <ul className={styles.list}>
          <div>
            <li>{logoLink}</li>
            {menus.left.map((menu, index) => (menu.public || isLogged) && (
              <li key={index}>
                <NavLink
                  name={menu.name}
                  href={menu.href}
                  mainHref={menu.mainHref}
                  exact={menu.exact}
                />
              </li>
            ))}
            <li>
              <a
                className={styles['out-link']}
                target="_blank"
                href="https://medium.com/lumenswap/lumenswap-ecosystem-reward-25f1ddd61ab7"
                rel="noreferrer"
              >
                Learn about lottory
                <div><Image src={ArrowHeader} width={12} height={12} /></div>
              </a>
            </li>
          </div>
        </ul>
        <LSPBox />
        {BtnConnect}
      </div>
      <div className="d-md-none d-sm-block d-block w-100">
        <div className="d-flex align-items-center justify-content-end">
          <div className="mr-3">{BtnConnect}</div>
          <div>{logoLink}</div>
        </div>
        <MobileMenu menus={mobileMenu} isLogged={isLogged} />
      </div>
    </div>
  );
};

export default LotteryHeader;
