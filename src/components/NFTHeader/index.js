import Logo from 'assets/images/logo';
import Link from 'next/link';
import urlMaker from 'helpers/urlMaker';
import classNames from 'classnames';
import LSPBox from 'components/LSPBox';
import CustomDropdown from 'components/Dropdown';
import Button from 'components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { openConnectModal } from 'actions/modal';
import NavLink from 'components/NavLink';
import MobileMenu from 'components/MobileMenu';
import styles from './styles.module.scss';

const NFTHeader = () => {
  const isLogged = useSelector((state) => state.user.logged);
  const dispatch = useDispatch();

  const logoLink = <Link href={urlMaker.root()}><a><Logo /></a></Link>;
  const btnConnect = isLogged ? <CustomDropdown height="40px" width="160px" />
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
        name: "All Lusi's",
        href: urlMaker.nft.root(),
        public: true,
        disableMainHref: true,
      },
      {
        name: 'My Lusi',
        href: urlMaker.nft.myLusi(),
        public: false,
      },
      {
        name: 'Orders',
        href: urlMaker.nft.orders(),
        public: false,
      },
      {
        name: 'Stats',
        href: urlMaker.nft.stats(),
        public: true,
      },
    ],
    right: [],
  };

  const mobileMenu = [...menus.left, ...menus.right];

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
                  disableMainHref={menu.disableMainHref}
                />
              </li>
            ))}
          </div>
          <div>
            {menus.right.map((menu, index) => (menu.public || isLogged) && (
              <li key={index}>
                <NavLink
                  name={menu.name}
                  href={menu.href}
                  mainHref={menu.mainHref}
                  disableMainHref={menu.disableMainHref}
                />
              </li>
            ))}
          </div>
        </ul>
        {isLogged && <LSPBox />}
        {btnConnect}
      </div>
      <div className="d-md-none d-sm-block d-block w-100">
        <div className="d-flex align-items-center justify-content-end">
          <div className="mr-3">{btnConnect}</div>
          <div>{logoLink}</div>
        </div>
        <MobileMenu menus={mobileMenu} isLogged={isLogged} />
      </div>
    </div>
  );
};

export default NFTHeader;
