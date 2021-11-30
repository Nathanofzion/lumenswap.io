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
import AssetBox from 'components/AssetBox';
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
        name: 'Board', link: urlMaker.lottery.root(), exact: true,
      },
      {
        name: 'My Tickets', link: urlMaker.lottery.tickets(), restricted: true, exact: false,
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
            {menus.left.map((menu, index) => (!menu.restricted || isLogged) && (
              <li key={index}>
                <NavLink
                  name={menu.name}
                  href={menu.link}
                  mainHref={menu.mainHref}
                  exact={menu.exact}
                />
              </li>
            ))}
            <li>
              <a
                className={styles['out-link']}
                target="_blank"
                href="https://medium.com/lumenswap/sixth-milestone-lottery-128e33d0aaa2"
                rel="noreferrer"
              >
                Learn about lottery
                <div><Image src={ArrowHeader} width={12} height={12} /></div>
              </a>
            </li>
          </div>
        </ul>
        <AssetBox />
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
