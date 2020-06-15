import React, { useState } from 'react';
import CustomModal from 'Root/shared/components/CustomModal';
import ConfirmSendContent from 'Root/shared/components/ModalContent/ConfirmSendContent';
import TokenContent from 'Root/shared/components/ModalContent/TokenContent';
import ConfirmSwapContent from 'Root/shared/components/ModalContent/ConfirmSwapContent';
import WaitingContent from 'Root/shared/components/ModalContent/WaitingContent';
import TransactionStatusContent from 'Root/shared/components/ModalContent/TransactionStatusContent';
import { trsStatus } from 'Root/constants/enum';

const ModalPage = () => {
  const [confirmSendModal, toggleConfirmSendModal] = useState(false);
  const [confirmSwapModal, toggleConfirmSwapModal] = useState(false);
  const [tokenModal, toggleTokenModal] = useState(false);
  const [waitingModal, toggleWaitingModal] = useState(false);
  const [successModal, toggleSuccessModal] = useState(false);
  return (
    <div className="h-100" style={{ background: '#09112c' }}>
      <div className="container mt-5">
        {/* confirm send modal */}
        <button
          className="btn btn-primary mr-3"
          onClick={() => { toggleConfirmSendModal(true); }}
        >confirm send
        </button>
        <CustomModal
          toggle={toggleConfirmSendModal}
          modal={confirmSendModal}
          title="Confirm Send"
          modalSize="360"
        >
          <ConfirmSendContent />
        </CustomModal>

        {/* confirm swap */}
        <button
          className="btn btn-primary mr-3"
          onClick={() => { toggleConfirmSwapModal(true); }}
        >Confirm Swap
        </button>
        <CustomModal
          toggle={toggleConfirmSwapModal}
          modal={confirmSwapModal}
          title="Confirm Swap"
          modalSize="360"
        >
          <ConfirmSwapContent />
        </CustomModal>

        {/* token modal */}
        <button
          className="btn btn-primary mr-3"
          onClick={() => { toggleTokenModal(true); }}
        >select token
        </button>
        <CustomModal
          toggle={toggleTokenModal}
          modal={tokenModal}
          title="Select token"
          modalSize="360"
        >
          <TokenContent />
        </CustomModal>

        {/* modal */}
        <button
          className="btn btn-primary mr-2"
          onClick={() => { toggleWaitingModal(true); }}
        >waiting
        </button>
        <CustomModal
          toggle={toggleWaitingModal}
          modal={waitingModal}
          modalSize="360"
        >
          <WaitingContent message="Waiting for sign transaction" />
        </CustomModal>

        {/* success modal */}
        <button
          className="btn btn-primary"
          onClick={() => { toggleSuccessModal(true); }}
        >success transaction
        </button>
        <CustomModal
          toggle={toggleSuccessModal}
          modal={successModal}
          modalSize="360"
        >
          <TransactionStatusContent
            status={trsStatus.SUCCESS}
            address="0x401b914336b87673822c1792786bf0ccf1793795c594c42f174078ff425697f8"
          />
        </CustomModal>
      </div>
    </div>
  );
};

export default ModalPage;
