import Tooltips, { PrimaryTooltip } from 'components/Tooltip';
import appConsts from 'appConsts';
import humanizeAmount from 'helpers/humanizeAmount';
import styles from '../styles.module.scss';
import SmartRoutingTooltip from './SmartRoutingTooltip';

function SectionContainer({ children }) {
  return <div className={styles.container}>{children}</div>;
}

function PathDetails({
  fromAssetDetails, toAssetDetails, paths, smartRoute,
}) {
  if (smartRoute) {
    return (
      <SectionContainer>
        <div className={styles.label}>Smart routing
          <Tooltips id="smartRoute" text={<SmartRoutingTooltip routes={smartRoute.routes} />}><span className="icon-question-circle" /></Tooltips>
        </div>
        <div className={styles['best-rate-container']}>
          <span className={styles.difference}>
            +{humanizeAmount(smartRoute.difference)} {toAssetDetails.getCode()}
          </span>
          <div className={styles['best-rate-box']}>
            <span>Best rate</span>
          </div>
        </div>
      </SectionContainer>
    );
  }
  return (
    <SectionContainer>
      <div className={styles.label}>Path
        <Tooltips id="path" text={<PrimaryTooltip text={appConsts.tooltip.path} />}><span className="icon-question-circle" /></Tooltips>
      </div>
      <div className={styles.path}>
        {[
          fromAssetDetails.getCode(),
          ...paths.map((i) => i.asset_code),
          toAssetDetails.getCode(),
        ].map((item, index) => (
          <div className={styles['path-container']} key={index}>
            <span>{item?.toUpperCase() || 'XLM'}</span>
            <span className="icon-arrow-right" />
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}

export default PathDetails;
