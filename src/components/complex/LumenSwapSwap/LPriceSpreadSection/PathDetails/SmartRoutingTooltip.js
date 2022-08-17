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
        const routePersentage = new BN(route.amount).div(divedTotalAmount).toNumber();
        return (
          <div key={index}>
            <span>
              {routePersentage}% {'->'} {route.route.map((routePath, routePathIndex) => (
                <span>{routePathIndex < route.route.length && ' '}
                  {routePath.map((path, pathIndex) => <span key={pathIndex}>{path}{pathIndex < routePath.length - 1 && '/'}</span>)}
                </span>
              ))}
            </span>
            <br />
          </div>
        );
      })}
    </div>
  );
}

export default SmartRoutingTooltip;
