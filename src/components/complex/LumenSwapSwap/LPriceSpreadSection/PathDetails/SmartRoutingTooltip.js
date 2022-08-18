import appConsts from 'appConsts';
import BN from 'helpers/BN';
import styles from '../styles.module.scss';

function SmartRoutingTooltip({ routes }) {
  let totalAmounts = 0;
  routes.forEach((route) => {
    totalAmounts = new BN(totalAmounts).plus(route.amount).toNumber();
  });
  const divedTotalAmount = new BN(totalAmounts).div(100);
  return (
    <div className={styles.tooltip}>
      {appConsts.tooltip.smartRoute}
      <br />
      <br />
      {routes.map((route, index) => {
        const routePersentage = new BN(route.amount).div(divedTotalAmount).toFixed(1);
        const modifiedRoutes = [...route.route[0]];
        if (route.route.length > 1) {
          route.route.slice(1).forEach((path) => {
            modifiedRoutes.push(path[1]);
          });
        }
        return (
          <div key={index}>
            <span>
              {routePersentage}% {'->'}{' '}
              <span>
                {
                  modifiedRoutes.map((routeItem, routeItemIndex) => (
                    <span key={routeItemIndex}>
                      {routeItem}{routeItemIndex < modifiedRoutes.length - 1 && '/'}
                    </span>
                  ))
          }
              </span>
            </span>
            <br />
          </div>
        );
      })}
    </div>
  );
}

export default SmartRoutingTooltip;
