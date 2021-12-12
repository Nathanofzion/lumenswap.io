import { useRef, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import BN from 'helpers/BN';
import Link from 'next/link';
import Logo from 'assets/images/logo';
import humanAmount from 'helpers/humanAmount';
import styles from './styles.module.scss';

const CardThumbnail = ({
  name, imgSrc, price, url,
}) => {
  const divRef = useRef(null);
  const [dimensions, setDimensions] = useState({ size: 180 });

  const handleResize = () => {
    if (divRef.current) {
      setDimensions({
        size: divRef.current.offsetWidth,
      });
    }
  };

  useLayoutEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Link href={url}>
      <a className={styles['card-link']}>
        <div
          className={styles.card}
          ref={divRef}
          style={{ cursor: 'pointer' }}
        >
          <div className={styles.title}>#{name}</div>
          <div className={styles.img}>
            <img
              src={imgSrc}
              style={{ width: `${dimensions.size - 12}px`, height: `${dimensions.size - 12}px` }}
            />
          </div>
          <div className={styles.value}>
            {!new BN(price).isZero() ? (
              <>
                <Logo color="#DF4886" />
                {humanAmount(new BN(price).div(10 ** 7).toFixed(7))}
              </>
            ) : '- -'}
          </div>
        </div>
      </a>
    </Link>
  );
};

CardThumbnail.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.any.isRequired,
  imgSrc: PropTypes.string.isRequired,
};

export default CardThumbnail;
